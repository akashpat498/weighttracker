/**
 * Example request handler. Domain handlers (e.g. parsing a natural-language
 * workout entry via the `llm` client) should follow this shape: validate the
 * request, do the work, return a Response.
 */
export async function handleHealth(): Promise<Response> {
  return Response.json({ status: 'ok', service: 'weighttracker', time: new Date().toISOString() });
}
