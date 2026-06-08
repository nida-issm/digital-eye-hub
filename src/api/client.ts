export const isConfigured = Boolean(process.env.NEXT_PUBLIC_DE_API_URL);

interface FetchOptions {
  params?: Record<string, string | number | boolean | undefined>;
}

function getCredentials() {
  if (typeof window === 'undefined') return { email: '', password: '' };
  return {
    email:    sessionStorage.getItem('de-email')    ?? '',
    password: sessionStorage.getItem('de-password') ?? '',
  };
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

  const { email, password } = getCredentials();
  const res = await fetch(url.toString(), {
    headers: {
      'x-de-email':    email,
      'x-de-password': password,
    },
  });

  if (!res.ok) throw new Error(`Proxy error ${res.status} for ${path}`);
  return res.json() as Promise<T>;
}
