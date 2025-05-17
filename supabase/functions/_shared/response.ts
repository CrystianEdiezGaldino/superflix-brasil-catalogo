
import { corsHeaders } from "./cors.ts";

// Helper function to create a standardized error response
export const createErrorResponse = (message: string, status: number = 401, details?: any) => {
  console.log(`[CHECK-SUBSCRIPTION] Error: ${message}`);
  return new Response(
    JSON.stringify({ 
      error: message,
      details,
      hasActiveSubscription: false,
      isAdmin: false,
      hasTempAccess: false,
      has_trial_access: false 
    }),
    { 
      status: status, 
      headers: { ...corsHeaders, "Content-Type": "application/json" } 
    }
  );
};

// Create a response with subscription data
export const createSuccessResponse = (data: any) => {
  return new Response(
    JSON.stringify(data),
    { 
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200
    }
  );
};
