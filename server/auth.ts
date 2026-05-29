/**
 * API authentication and rate limiting for protected routes.
 *
 * - API key: x-api-key or Authorization: Bearer <key>
 * - Client header: X-Client must be WeightTracker-iOS/1.0 (iOS app only)
 * - Rate limit: per-IP via Upstash Redis (skipped when env vars missing)
 */

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const EXPECTED_CLIENT = 'WeightTracker-iOS/1.0';
const RATE_LIMIT_REQUESTS = 10;
const RATE_LIMIT_WINDOW = '1 m';

function getApiKey(request: Request): string | null {
  const header = request.headers.get('x-api-key');
  if (header) return header;
  const auth = request.headers.get('authorization');
  if (auth?.startsWith('Bearer ')) return auth.slice(7);
  return null;
}

function getClientIp(request: Request): string {
  // Cloudflare Workers / EAS Hosting
  const cfIp = request.headers.get('cf-connecting-ip');
  if (cfIp) return cfIp;
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return 'unknown';
}

export function validateApiKey(request: Request): { ok: true } | { ok: false; status: number; body: object } {
  const key = process.env.WEIGHTTRACKER_API_KEY;
  if (!key) {
    return { ok: true }; // Skip validation in dev when not configured
  }
  const provided = getApiKey(request);
  if (!provided || provided !== key) {
    return { ok: false, status: 401, body: { error: 'Invalid or missing API key' } };
  }
  return { ok: true };
}

export function validateClient(request: Request): { ok: true } | { ok: false; status: number; body: object } {
  const client = request.headers.get('x-client');
  if (client !== EXPECTED_CLIENT) {
    return { ok: false, status: 403, body: { error: 'Only the WeightTracker iOS app is allowed' } };
  }
  return { ok: true };
}

let ratelimitInstance: Ratelimit | null = null;

function getRatelimit(): Ratelimit | null {
  if (ratelimitInstance) return ratelimitInstance;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  ratelimitInstance = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(RATE_LIMIT_REQUESTS, RATE_LIMIT_WINDOW),
    prefix: 'weighttracker:ratelimit',
  });
  return ratelimitInstance;
}

export async function checkRateLimit(
  request: Request,
  scope = 'api'
): Promise<{ ok: true } | { ok: false; status: number; body: object }> {
  const rl = getRatelimit();
  if (!rl) return { ok: true }; // Skip when Upstash not configured (e.g. local dev)
  const ip = getClientIp(request);
  const { success } = await rl.limit(`${scope}:${ip}`);
  if (!success) {
    return { ok: false, status: 429, body: { error: 'Too many requests. Try again later.' } };
  }
  return { ok: true };
}
