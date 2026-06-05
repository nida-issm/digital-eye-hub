import { NextRequest, NextResponse } from 'next/server';
import { getAccessToken } from '@/lib/api/auth';

const BASE_URL = process.env.NEXT_PUBLIC_DE_API_URL ?? '';

export async function GET(req: NextRequest) {
  try {
    const path  = req.nextUrl.searchParams.get('path') ?? '';
    const token = await getAccessToken();

    const upstream = new URL(path, BASE_URL);
    req.nextUrl.searchParams.forEach((v, k) => {
      if (k !== 'path') upstream.searchParams.set(k, v);
    });

    const res = await fetch(upstream.toString(), {
      headers: {
        'Authorization': `Bearer ${token}`,
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
      next: { revalidate: 30 },
    });

    // For 404s return empty array/null gracefully instead of propagating error
    if (res.status === 404) {
      return NextResponse.json([], { status: 200 });
    }

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
