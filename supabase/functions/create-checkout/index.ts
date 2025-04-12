import Stripe from 'npm:stripe@14.14.0';
import { createClient } from 'npm:@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const PLANS = {
  '1_month': {
    price_id: 'price_1_month',
    duration: 30
  },
  '3_months': {
    price_id: 'price_3_months',
    duration: 90
  },
  '6_months': {
    price_id: 'price_6_months',
    duration: 180
  },
  '12_months': {
    price_id: 'price_12_months',
    duration: 365
  }
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { plan_id, user_id, assessment_id, success_url, cancel_url } = await req.json();

    if (!plan_id || !user_id || !success_url || !cancel_url) {
      throw new Error('Missing required parameters');
    }

    const plan = PLANS[plan_id];
    if (!plan) {
      throw new Error('Invalid plan selected');
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!);

    // Initialize Supabase Admin client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get or create Stripe customer
    const { data: profile } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', user_id)
      .single();

    let customerId: string;

    const { data: existingSubscription } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user_id)
      .maybeSingle();

    if (existingSubscription?.stripe_customer_id) {
      customerId = existingSubscription.stripe_customer_id;
    } else {
      const customer = await stripe.customers.create({
        email: profile.email,
        metadata: {
          user_id
        }
      });
      customerId = customer.id;
    }

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: plan.price_id,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${success_url}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url,
      metadata: {
        user_id,
        assessment_id,
        plan_id
      }
    });

    return new Response(
      JSON.stringify({ sessionId: session.id }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error) {
    console.error('Create checkout error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});