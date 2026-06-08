const AUTH_BASE  = process.env.DE_AUTH_URL    ?? '';
const AUTH_ORG   = process.env.DE_AUTH_ORG_CODE ?? '';

let cachedToken: string | null = null;
let tokenExpiry: number        = 0;

export interface AuthCredentials {
  email: string;
  password: string;
}

export async function getAccessToken(credentials?: AuthCredentials): Promise<string> {
  const now = Date.now() / 1000;
  if (cachedToken && tokenExpiry - now > 60) return cachedToken;

  if (!credentials) throw new Error('AUTH_CREDENTIALS_REQUIRED');

  const res = await fetch(`${AUTH_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'accept': 'application/json' },
    body: JSON.stringify({
      email:            credentials.email,
      password:         credentials.password,
      organizationCode: AUTH_ORG,
    }),
    cache: 'no-store',
  });

  if (!res.ok) throw new Error(`Auth failed: ${res.status} ${await res.text()}`);

  const json = await res.json();
  const token = json?.data?.accessToken;
  if (!token) throw new Error(`No accessToken in auth response`);

  const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
  cachedToken  = token;
  tokenExpiry  = payload.exp;

  return token;
}

export function clearToken() {
  cachedToken = null;
  tokenExpiry = 0;
}
