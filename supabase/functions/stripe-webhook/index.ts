import Stripe from 'npm:stripe@14.14.0';
import { createClient } from 'npm:@supabase/supabase-js@2.39.7';

<<<<<<< HEAD
const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!);
const endpointSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!;

Deno.serve(async (req) => {
  try {
    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      return new Response('No signature', { status: 400 });
    }

    const body = await req.text();
    const event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
=======
// Initialize Stripe with secret key
const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
if (!stripeSecretKey) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable');
}
const stripe = new Stripe(stripeSecretKey);

// Get webhook secret for signature verification
const endpointSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
if (!endpointSecret) {
  console.warn('Warning: STRIPE_WEBHOOK_SECRET is not set. Webhook signature verification will be skipped.');
}

interface StripeCustomer {
  id: string;
  email: string;
  metadata: {
    user_id?: string;
  };
}

// Set up CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Stripe-Signature',
};

Deno.serve(async (req) => {
  try {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    console.log('Received webhook request');
    
    // Get the request body and signature
    let event;
    const payload = await req.text();
    const signature = req.headers.get('stripe-signature');
    
    // Verify webhook signature if secret is available
    if (endpointSecret && signature) {
      try {
        event = stripe.webhooks.constructEvent(payload, signature, endpointSecret);
        console.log('Webhook signature verified');
      } catch (err) {
        console.error(`Webhook signature verification failed: ${err.message}`);
        return new Response(`Webhook signature verification failed: ${err.message}`, { 
          status: 400,
          headers: corsHeaders
        });
      }
    } else {
      // If no secret or signature, parse the payload directly (less secure)
      try {
        event = JSON.parse(payload);
        console.warn('Webhook processed without signature verification');
      } catch (err) {
        console.error(`Error parsing webhook payload: ${err.message}`);
        return new Response(`Error parsing webhook payload: ${err.message}`, { 
          status: 400,
          headers: corsHeaders
        });
      }
    }
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)

    // Initialize Supabase Admin client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

<<<<<<< HEAD
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
        
        // Update subscriptions table
        await supabase
          .from('subscriptions')
          .upsert({
            user_id: session.metadata.user_id,
            stripe_subscription_id: subscription.id,
            stripe_customer_id: session.customer as string,
            plan: session.metadata.plan_id,
            status: subscription.status,
            current_period_start: new Date(subscription.current_period_start * 1000),
            current_period_end: new Date(subscription.current_period_end * 1000),
            cancel_at_period_end: subscription.cancel_at_period_end
          });
=======
    console.log(`Processing webhook event: ${event.type}`);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        console.log('Checkout session completed:', session.id);
        
        // Get subscription details if available
        let subscription;
        if (session.subscription) {
          subscription = await stripe.subscriptions.retrieve(session.subscription as string);
          console.log('Retrieved subscription:', subscription.id);
        } else {
          console.log('No subscription found in session');
        }
        
        // Get customer details
        let customer, customerEmail, userId;
        
        if (session.customer) {
          customer = await stripe.customers.retrieve(session.customer as string) as StripeCustomer;
          customerEmail = customer.email;
          console.log('Retrieved customer:', customer.id, 'email:', customerEmail);
        }
        
        // Get user ID from metadata or find by email
        userId = session.metadata?.user_id;
        
        if (!userId && customerEmail) {
          // Try to find a user with this email
          const { data: userData, error: userError } = await supabase.auth.admin.listUsers();
          
          if (userError) {
            console.error('Error listing users:', userError);
          } else {
            const matchingUser = userData.users.find(u => u.email === customerEmail);
            if (matchingUser) {
              userId = matchingUser.id;
              console.log('Found user by email:', userId);
            }
          }
        }
        
        if (userId) {
          console.log('Updating profile for user:', userId);
          // Update the user's profile with the Stripe customer ID
          const { error: profileError } = await supabase
            .from('profiles')
            .update({ stripe_customer_id: session.customer as string })
            .eq('id', userId);
            
          if (profileError) {
            console.error('Error updating profile:', profileError);
          }
          
          // Get plan ID from metadata or default to '1_month'
          const planId = session.metadata?.plan_id || '1_month';
          console.log('Plan ID from metadata:', planId);
          
          if (subscription) {
            console.log('Updating subscription record for user:', userId);
            // Update subscriptions table
            const { error: subscriptionError } = await supabase
              .from('subscriptions')
              .upsert({
                user_id: userId,
                stripe_subscription_id: subscription.id,
                stripe_customer_id: session.customer as string,
                plan: planId,
                status: subscription.status,
                current_period_start: new Date(subscription.current_period_start * 1000),
                current_period_end: new Date(subscription.current_period_end * 1000),
                cancel_at_period_end: subscription.cancel_at_period_end
              });
              
            if (subscriptionError) {
              console.error('Error updating subscription record:', subscriptionError);
            }
          }
          
          // Store assessment ID if provided
          const assessmentId = session.metadata?.assessment_id;
          if (assessmentId) {
            console.log('Assessment ID from metadata:', assessmentId);
            // You could store this in a separate table if needed
          }
        }
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)

        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
<<<<<<< HEAD
        
        await supabase
=======
        console.log('Subscription updated:', subscription.id);
        
        // Get the customer ID
        const customerId = subscription.customer as string;
        console.log('Customer ID:', customerId);
        
        // Find all profiles with this customer ID
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId);
          
        if (profilesError) {
          console.error('Error finding profiles:', profilesError);
        }
        
        // Update subscriptions for all matching profiles
        if (profiles && profiles.length > 0) {
          console.log('Found profiles with customer ID:', profiles.length);
          for (const profile of profiles) {
            console.log('Updating subscription for profile:', profile.id);
            const { error: updateError } = await supabase
              .from('subscriptions')
              .update({
                status: subscription.status,
                current_period_start: new Date(subscription.current_period_start * 1000),
                current_period_end: new Date(subscription.current_period_end * 1000),
                cancel_at_period_end: subscription.cancel_at_period_end,
                updated_at: new Date()
              })
              .eq('user_id', profile.id);
              
            if (updateError) {
              console.error('Error updating subscription for profile:', updateError);
            }
          }
        } else {
          console.log('No profiles found with customer ID:', customerId);
        }
        
        // Also update by subscription ID for backward compatibility
        console.log('Updating subscription by subscription ID:', subscription.id);
        const { error: updateError } = await supabase
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
          .from('subscriptions')
          .update({
            status: subscription.status,
            current_period_start: new Date(subscription.current_period_start * 1000),
            current_period_end: new Date(subscription.current_period_end * 1000),
            cancel_at_period_end: subscription.cancel_at_period_end,
            updated_at: new Date()
          })
          .eq('stripe_subscription_id', subscription.id);
<<<<<<< HEAD
=======
          
        if (updateError) {
          console.error('Error updating subscription by ID:', updateError);
        }
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)

        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
<<<<<<< HEAD
        
        await supabase
=======
        console.log('Subscription deleted:', subscription.id);
        
        // Get the customer ID
        const customerId = subscription.customer as string;
        console.log('Customer ID:', customerId);
        
        // Find all profiles with this customer ID
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId);
          
        if (profilesError) {
          console.error('Error finding profiles:', profilesError);
        }
        
        // Update subscriptions for all matching profiles
        if (profiles && profiles.length > 0) {
          console.log('Found profiles with customer ID:', profiles.length);
          for (const profile of profiles) {
            console.log('Updating subscription for profile:', profile.id);
            const { error: updateError } = await supabase
              .from('subscriptions')
              .update({
                status: 'canceled',
                updated_at: new Date()
              })
              .eq('user_id', profile.id);
              
            if (updateError) {
              console.error('Error updating subscription for profile:', updateError);
            }
          }
        } else {
          console.log('No profiles found with customer ID:', customerId);
        }
        
        // Also update by subscription ID for backward compatibility
        console.log('Updating subscription by subscription ID:', subscription.id);
        const { error: updateError } = await supabase
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
          .from('subscriptions')
          .update({
            status: 'canceled',
            updated_at: new Date()
          })
          .eq('stripe_subscription_id', subscription.id);
<<<<<<< HEAD
=======
          
        if (updateError) {
          console.error('Error updating subscription by ID:', updateError);
        }
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)

        break;
      }
    }

<<<<<<< HEAD
    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' }
=======
    console.log('Webhook processed successfully');
    return new Response(JSON.stringify({ 
      received: true,
      success: true,
      timestamp: new Date().toISOString()
    }), {
      headers: { 
        ...corsHeaders,
        'Content-Type': 'application/json' 
      }
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
    });

  } catch (err) {
    console.error('Stripe webhook error:', err);
    return new Response(
<<<<<<< HEAD
      JSON.stringify({ error: err.message }),
      { status: 400 }
=======
      JSON.stringify({ 
        error: err.message,
        success: false,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 400,
        headers: corsHeaders
      }
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
    );
  }
});