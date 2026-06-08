import { NextRequest, NextResponse } from 'next/server';

const BASE_URL   = process.env.NEXT_PUBLIC_DE_API_URL ?? '';
const AUTH_BASE  = process.env.DE_AUTH_URL ?? '';
const AUTH_ORG   = process.env.DE_AUTH_ORG_CODE ?? '';

let cachedToken: string | null = null;
let tokenExpiry: number        = 0;

async function getToken(email: string, password: string): Promise<string> {
  const now = Date.now() / 1000;
  if (cachedToken && tokenExpiry - now > 60) return cachedToken;

  const res = await fetch(`${AUTH_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'accept': 'application/json' },
    body: JSON.stringify({ email, password, organizationCode: AUTH_ORG }),
    cache: 'no-store',
  });

  if (!res.ok) throw new Error(`Auth failed: ${res.status}`);
  const json = await res.json();
  const token = json?.data?.accessToken;
  if (!token) throw new Error('No accessToken in response');

  const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
  cachedToken = token;
  tokenExpiry = payload.exp;
  return token;
}

export async function GET(req: NextRequest) {
  try {
    const path  = req.nextUrl.searchParams.get('path') ?? '';

    // Get credentials from request headers (set by login screen)
    const email    = req.headers.get('x-de-email')    ?? '';
    const password = req.headers.get('x-de-password') ?? '';

    if (!email || !password) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const token = await getToken(email, password);
    const upstream = new URL(path, BASE_URL);
    req.nextUrl.searchParams.forEach((v, k) => {
      if (k !== 'path') upstream.searchParams.set(k, v);
    });

    const res = await fetch(upstream.toString(), {
      headers: { 'Authorization': `Bearer ${token}`, 'accept': 'application/json' },
      next: { revalidate: 30 },
    });

    if (res.status === 404) return NextResponse.json([], { status: 200 });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
