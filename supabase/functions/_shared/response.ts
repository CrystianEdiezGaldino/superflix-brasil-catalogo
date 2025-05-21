
// Helper for creating error responses
export const createErrorResponse = (message: string, status: number = 400, additionalHeaders = {}) => {
  return new Response(
    JSON.stringify({
      error: message
    }),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
        ...additionalHeaders
      }
    }
  );
};

// Helper for creating success responses
export const createSuccessResponse = (data: any, additionalHeaders = {}) => {
  return new Response(
    JSON.stringify(data),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...additionalHeaders
      }
    }
  );
};
