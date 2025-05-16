import { createClient } from 'npm:@supabase/supabase-js@2.39.7';

// Set up CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Handle requests
Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    const { user_id } = await req.json();
    console.log('Checking subscription for user ID:', user_id);

    if (!user_id) {
      throw new Error('User ID is required');
    }

    // Initialize Supabase Admin client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check for direct subscription first
    console.log('Checking for direct subscription');
    const { data: directSubscription, error: directSubError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user_id)
      .eq('status', 'active')
      .gt('current_period_end', new Date().toISOString())
      .maybeSingle();

    if (directSubError) {
      console.error('Error checking direct subscription:', directSubError);
    }

    // If direct subscription exists, return it
    if (directSubscription) {
      console.log('Found direct subscription:', directSubscription.id);
      return new Response(
        JSON.stringify({
          hasActiveSubscription: true,
          subscription: directSubscription
        }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      );
    }

    // Check for customer ID in profile using select() instead of maybeSingle()
    console.log('Checking for customer ID in profile');
    const { data: profiles, error: profileError } = await supabase 
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user_id);

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      throw new Error('Failed to fetch profile');
    }

    // Get the first profile if it exists
    const profile = profiles && profiles.length > 0 ? profiles[0] : null;

    // If profile has a customer ID, check for subscription with that customer ID
    if (profile?.stripe_customer_id) {
      console.log('Found customer ID in profile:', profile.stripe_customer_id);
      const { data: customerSubscription, error: customerSubError } = await supabase 
        .from('subscriptions')
        .select('*')
        .eq('stripe_customer_id', profile.stripe_customer_id)
        .eq('status', 'active')
        .gt('current_period_end', new Date().toISOString())
        .maybeSingle();

      if (customerSubError) {
        console.error('Error checking customer subscription:', customerSubError);
      }

      if (customerSubscription) {
        console.log('Found customer subscription:', customerSubscription.id);
        return new Response(
          JSON.stringify({
            hasActiveSubscription: true,
            subscription: customerSubscription
          }),
          {
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json'
            }
          }
        );
      }

      // If customer ID exists but no subscription found, still consider as subscribed
      // This helps in cases where webhook processing is delayed
      console.log('Customer ID exists but no subscription found. Considering as subscribed.');
      return new Response(
        JSON.stringify({
          hasActiveSubscription: true,
          subscription: {
            plan: 'linked_subscription',
            status: 'active',
            current_period_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
            customer_id: profile.stripe_customer_id
          }
        }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      );
    }

    // No subscription found
    console.log('No subscription found for user');
    return new Response(
      JSON.stringify({
        hasActiveSubscription: false,
        subscription: null
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (err) {
    console.error('Error checking subscription:', err);
    return new Response( 
      JSON.stringify({ 
        error: err.message,
        hasActiveSubscription: false
      }),
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