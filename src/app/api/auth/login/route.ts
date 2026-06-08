import { NextRequest, NextResponse } from 'next/server';

const AUTH_BASE = process.env.DE_AUTH_URL     ?? '';
const AUTH_ORG  = process.env.DE_AUTH_ORG_CODE ?? '';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    const res = await fetch(`${AUTH_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'accept': 'application/json' },
      body: JSON.stringify({ email, password, organizationCode: AUTH_ORG }),
      cache: 'no-store',
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const json = await res.json();
    if (!json?.data?.accessToken) {
      return NextResponse.json({ error: 'Auth failed' }, { status: 401 });
    }

    return NextResponse.json({ success: true, email });
  } catch (err) {
    return NextResponse.json({ error: 'Auth error' }, { status: 500 });
  }
}
