import Stripe from 'npm:stripe@14.14.0';
import { createClient } from 'npm:@supabase/supabase-js@2.39.7';

<<<<<<< HEAD
=======
// Set up CORS headers
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

<<<<<<< HEAD
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
=======
// Handle requests
Deno.serve(async (req) => {
  // Handle CORS preflight requests
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
<<<<<<< HEAD
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
=======
    // Parse request body
    const { price_id, user_id, assessment_id, plan_id, success_url, cancel_url } = await req.json();
    console.log('Create checkout request:', { price_id, user_id, assessment_id, plan_id });

    // Validate required parameters
    if (!price_id || !user_id || !success_url || !cancel_url) {
      throw new Error('Missing required parameters');
    }

    // Initialize Stripe
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      throw new Error('Missing STRIPE_SECRET_KEY environment variable');
    }
    const stripe = new Stripe(stripeSecretKey);
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)

    // Initialize Supabase Admin client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

<<<<<<< HEAD
    // Get or create Stripe customer
    const { data: profile } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', user_id)
      .single();

    let customerId: string;

    const { data: existingSubscription } = await supabase
=======
    // Get user email from auth
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(user_id);
    if (userError) {
      throw new Error(`Error fetching user: ${userError.message}`);
    }
    
    if (!userData?.user?.email) {
      throw new Error('User email not found');
    }
    
    const userEmail = userData.user.email;

    // Check for existing customer ID in profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user_id)
      .single();
      
    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Error fetching profile:', profileError);
    }
    
    let customerId: string;

    // Check for existing subscription
    const { data: existingSubscription, error: subError } = await supabase
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user_id)
      .maybeSingle();
<<<<<<< HEAD

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
=======
      
    if (subError && subError.code !== 'PGRST116') {
      console.error('Error checking existing subscription:', subError);
    }

    // Use existing customer ID if available
    if (profile?.stripe_customer_id) {
      console.log('Using existing customer ID from profile:', profile.stripe_customer_id);
      customerId = profile.stripe_customer_id;
    } else if (existingSubscription?.stripe_customer_id) {
      console.log('Using existing customer ID from subscription:', existingSubscription.stripe_customer_id);
      customerId = existingSubscription.stripe_customer_id;
    } else {
      // Create new customer
      console.log('Creating new Stripe customer for email:', userEmail);
      const customerParams: Stripe.CustomerCreateParams = {
        email: userEmail,
        metadata: {
          user_id
        }
      };
      
      const customer = await stripe.customers.create(customerParams);
      customerId = customer.id;
      
      // Update profile with customer ID
      await supabase
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', user_id);
    }

    // Create Checkout Session
    console.log('Creating checkout session for customer:', customerId);
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
<<<<<<< HEAD
          price: plan.price_id,
=======
          price: price_id,
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${success_url}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url,
      metadata: {
        user_id,
        assessment_id,
<<<<<<< HEAD
        plan_id
      }
    });

    return new Response(
=======
        price_id,
        plan_id: plan_id || price_id.split('_')[0] // Extract plan ID from price ID if not provided
      }
    };
    
    const session = await stripe.checkout.sessions.create(sessionParams);
    console.log('Checkout session created:', session.id);

    return new Response( 
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
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
<<<<<<< HEAD
    return new Response(
      JSON.stringify({ error: error.message }),
=======
    return new Response( 
      JSON.stringify({ error: error.message || 'An error occurred during checkout' }),
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
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