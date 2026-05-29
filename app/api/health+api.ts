import { handleHealth } from '@/server/handlers/health';

/**
 * GET /api/health — lightweight liveness check (unauthenticated).
 *
 * Authenticated domain endpoints should gate requests with the helpers in
 * `server/auth.ts`, e.g.:
 *
 *   const client = validateClient(request);
 *   if (!client.ok) return Response.json(client.body, { status: client.status });
 *   const key = validateApiKey(request);
 *   if (!key.ok) return Response.json(key.body, { status: key.status });
 *   const rate = await checkRateLimit(request, 'my-endpoint');
 *   if (!rate.ok) return Response.json(rate.body, { status: rate.status });
 */
export async function GET(): Promise<Response> {
  return handleHealth();
}
