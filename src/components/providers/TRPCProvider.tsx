'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { useState, useEffect } from 'react';
import { trpc } from '@/utils/trpc';
import superjson from 'superjson';

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => {
    console.log('Creating QueryClient...');
    return new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 5000,
        },
      },
    });
  });

  const [trpcClient] = useState(() => {
    console.log('Creating tRPC client...');
    return trpc.createClient({
      transformer: superjson,
      links: [
        httpBatchLink({
          url: '/api/trpc',
          fetch(url, options) {
            console.log('tRPC fetch request:', { 
              url, 
              method: options?.method,
              headers: options?.headers,
              body: options?.body ? JSON.parse(options.body as string) : undefined
            });
            return fetch(url, options).then(async (response) => {
              const responseData = await response.clone().text();
              console.log('tRPC fetch response:', {
                status: response.status,
                headers: Object.fromEntries(response.headers.entries()),
                data: responseData
              });
              return response;
            }).catch(error => {
              console.error('tRPC fetch error:', error);
              throw error;
            });
          },
        }),
      ],
    });
  });

  useEffect(() => {
    console.log('TRPCProvider mounted');
  }, []);

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
} 