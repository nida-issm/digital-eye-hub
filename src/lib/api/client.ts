// All DE API calls are proxied through /api/de to keep auth credentials server-side

export const isConfigured = Boolean(process.env.NEXT_PUBLIC_DE_API_URL);

interface FetchOptions {
  params?: Record<string, string | number | boolean | undefined>;
}

export async function deGet<T>(path: string, options: FetchOptions = {}): Promise<T> {
  if (!isConfigured) throw new Error('DE_API_NOT_CONFIGURED');

  const url = new URL('/api/de', window.location.origin);
  url.searchParams.set('path', path);

  if (options.params) {
    Object.entries(options.params).forEach(([k, v]) => {
      if (v !== undefined && v !== '') url.searchParams.set(k, String(v));
    });
  }

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Proxy error ${res.status} for ${path}`);
  return res.json() as Promise<T>;
}
