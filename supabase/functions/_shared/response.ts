
export function createSuccessResponse(data: any, customHeaders: Record<string, string> = {}) {
  return new Response(
    JSON.stringify(data),
    {
      status: 200,
      headers: {
        ...customHeaders,
        'Content-Type': 'application/json'
      }
    }
  );
}

export function createErrorResponse(message: string, status = 400, customHeaders: Record<string, string> = {}) {
  return new Response(
    JSON.stringify({ error: message }),
    {
      status,
      headers: {
        ...customHeaders,
        'Content-Type': 'application/json'
      }
    }
  );
}
