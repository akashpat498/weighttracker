/**
 * Shared API client for server requests.
 *
 * All app API calls should go through `apiFetch` so they use the correct base URL.
 * In development, `BASE_URL` is empty so paths like `/api/...` hit the same-origin
 * dev server. In production, set `EXPO_PUBLIC_API_URL` if your API is served from
 * a different origin.
 *
 * Sends x-api-key and X-Client (WeightTracker-iOS only) for authenticated endpoints.
 *
 * Add domain-specific service modules (alongside this file) for each endpoint
 * rather than calling `apiFetch` directly from screens.
 */
import { Platform } from 'react-native';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || '';

const API_KEY = process.env.EXPO_PUBLIC_WEIGHTTRACKER_API_KEY || '';

let hasLoggedApiConfig = false;
function logApiConfig(): void {
  if (hasLoggedApiConfig) return;
  hasLoggedApiConfig = true;
  const keyDisplay = API_KEY
    ? `${API_KEY.slice(0, 4)}...${API_KEY.slice(-4)}`
    : '[NOT SET]';
  console.log(
    '[API] BASE_URL:',
    BASE_URL || '(local)',
    '| API key:',
    keyDisplay
  );
}

function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  if (API_KEY) headers['x-api-key'] = API_KEY;
  if (Platform.OS === 'ios') headers['x-client'] = 'WeightTracker-iOS/1.0';
  return headers;
}

export async function apiFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  logApiConfig();
  const url = path.startsWith('http') ? path : `${BASE_URL}${path}`;
  const authHeaders = getAuthHeaders();
  const headers = new Headers(options.headers);
  for (const [k, v] of Object.entries(authHeaders)) {
    headers.set(k, v);
  }
  return fetch(url, { ...options, headers });
}
