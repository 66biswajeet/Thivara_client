export function setCorsHeaders(response) {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization",
  );
  response.headers.set("Access-Control-Max-Age", "86400");
  return response;
}

export function handleCorsPreFlight(request) {
  if (request.method === "OPTIONS") {
    const response = new Response(null, {
      status: 204,
    });
    return setCorsHeaders(response);
  }
  return null;
}
