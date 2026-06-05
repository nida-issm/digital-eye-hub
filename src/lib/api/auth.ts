const AUTH_URL     = process.env.DE_AUTH_URL      ?? '';
const AUTH_EMAIL   = process.env.DE_AUTH_EMAIL    ?? '';
const AUTH_PASSWORD= process.env.DE_AUTH_PASSWORD ?? '';
const AUTH_ORG     = process.env.DE_AUTH_ORG_CODE ?? '';

let cachedToken: string | null = null;
let tokenExpiry: number        = 0;

export async function getAccessToken(): Promise<string> {
  const now = Date.now() / 1000;
  if (cachedToken && tokenExpiry - now > 60) return cachedToken;

  const res = await fetch(AUTH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'accept': 'application/json' },
    body: JSON.stringify({
      email:            AUTH_EMAIL,
      password:         AUTH_PASSWORD,
      organizationCode: AUTH_ORG,
    }),
    cache: 'no-store',
  });

  if (!res.ok) throw new Error(`Auth failed: ${res.status} ${await res.text()}`);

  const json = await res.json();
  const token = json?.data?.accessToken;
  if (!token) throw new Error(`No accessToken in auth response: ${JSON.stringify(json)}`);

  // Decode expiry from JWT payload (no library needed)
  const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
  cachedToken = token;
  tokenExpiry = payload.exp;

  return token;
}
