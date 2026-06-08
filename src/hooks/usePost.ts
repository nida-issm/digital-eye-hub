'use client';
import { useState } from 'react';

export function usePost<TBody, TResponse>(
  fetcher: (body: TBody) => Promise<TResponse>
) {
  const [data, setData]       = useState<TResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const execute = async (body: TBody) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetcher(body);
      setData(res);
      return res;
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error';
      setError(msg);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, execute };
}
