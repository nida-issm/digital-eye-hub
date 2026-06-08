// Hub Backend client — routes through /api/hub proxy

export const isHubConfigured = Boolean(process.env.NEXT_PUBLIC_HUB_API_URL);

interface FetchOptions {
  params?: Record<string, string | number | boolean | undefined>;
}

export async function hubGet<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const url = new URL('/api/hub', window.location.origin);
  url.searchParams.set('path', path);
  if (options.params) {
    Object.entries(options.params).forEach(([k, v]) => {
      if (v !== undefined && v !== '') url.searchParams.set(k, String(v));
    });
  }
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Hub API error ${res.status} for ${path}`);
  return res.json() as Promise<T>;
}

export async function hubPatch<T>(path: string, body: unknown): Promise<T> {
  const url = new URL('/api/hub', window.location.origin);
  url.searchParams.set('path', path);
  const res = await fetch(url.toString(), {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Hub API error ${res.status} for ${path}`);
  return res.json() as Promise<T>;
}
