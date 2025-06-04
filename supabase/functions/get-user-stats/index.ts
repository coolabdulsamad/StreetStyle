import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Define the response type for the Edge Function
interface UserStatsResponse {
  totalUsers: number;
  recentUsersCount: number;
  previousUsersCount: number; // For growth calculation
}

serve(async (req: Request) => {
  // Define CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*', // IMPORTANT: For development, '*' is fine. For production, replace with your actual frontend domain (e.g., 'https://your-app-domain.com')
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    // ADD 'apikey' to the allowed headers
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey',
  };

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
      status: 204, // No Content
    });
  }

  // Initialize Supabase client with the Service Role Key
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') || '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
  );

  // Optional: Basic authentication check (you might want more robust logic here)
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Unauthorized: Missing Authorization header' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 401,
    });
  }

  try {
    // Fetch total user count
    const { count: totalUsers, error: totalUsersError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    if (totalUsersError) {
      console.error('Error fetching total users:', totalUsersError);
      return new Response(JSON.stringify({ error: 'Failed to fetch total users' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString();

    // Fetch users registered in the last 30 days
    const { count: recentUsersCount, error: recentUsersError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', thirtyDaysAgo);

    if (recentUsersError) {
      console.error('Error fetching recent users:', recentUsersError);
      return new Response(JSON.stringify({ error: 'Failed to fetch recent users' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    // Fetch users registered between 30 and 60 days ago (for growth calculation)
    const { count: previousUsersCount, error: previousUsersError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', sixtyDaysAgo)
      .lt('created_at', thirtyDaysAgo);

    if (previousUsersError) {
      console.error('Error fetching previous period users:', previousUsersError);
      return new Response(JSON.stringify({ error: 'Failed to fetch previous period users' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    const responseData: UserStatsResponse = {
      totalUsers: totalUsers || 0,
      recentUsersCount: recentUsersCount || 0,
      previousUsersCount: previousUsersCount || 0,
    };

    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Edge Function error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});