
import { useState, useEffect } from 'react';

interface UseFetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
  immediate?: boolean;
}

export function useFetch<T = any>(url: string, options: UseFetchOptions = {}) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  
  const { method = 'GET', body, headers = {}, immediate = false } = options;

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const requestOptions: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
      };
      
      if (body && method !== 'GET') {
        requestOptions.body = JSON.stringify(body);
      }
      
      const response = await fetch(url, requestOptions);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      setData(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (immediate) {
      fetchData();
    }
  }, [url, immediate]);
  
  return { data, error, loading, fetchData, setData };
}

export default useFetch;
