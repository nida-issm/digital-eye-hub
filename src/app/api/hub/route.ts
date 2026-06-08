import { NextRequest, NextResponse } from 'next/server';

const HUB_URL = process.env.NEXT_PUBLIC_HUB_API_URL ?? 'http://localhost:8000';

export async function GET(req: NextRequest) {
  try {
    const path = req.nextUrl.searchParams.get('path') ?? '';
    const upstream = new URL(path, HUB_URL);

    req.nextUrl.searchParams.forEach((v, k) => {
      if (k !== 'path') upstream.searchParams.set(k, v);
    });

    const res = await fetch(upstream.toString(), {
      headers: { 'accept': 'application/json' },
      next: { revalidate: 30 },
    });

    if (!res.ok) return NextResponse.json({ error: `Hub API error ${res.status}` }, { status: res.status });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const path = req.nextUrl.searchParams.get('path') ?? '';
    const body = await req.json();
    const upstream = new URL(path, HUB_URL);

    const res = await fetch(upstream.toString(), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'accept': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
