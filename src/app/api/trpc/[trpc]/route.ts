import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '@/server/api/root';
import { TRPCError } from '@trpc/server';


const handler = async (req: Request) => {
  console.log('tRPC request:', {
    url: req.url,
    method: req.method,
    headers: Object.fromEntries(req.headers.entries()),
  });

  try {
    const response = await fetchRequestHandler({
      endpoint: '/api/trpc',
      req,
      router: appRouter,
      createContext: () => ({}),
      onError:
        process.env.NODE_ENV === 'development'
          ? ({ path, error }: { path: string | undefined; error: TRPCError }) => {
              console.error(
                `❌ tRPC failed on ${path ?? '<no-path>'}: ${error.message}`
              );
            }
          : undefined,
    });

    console.log('tRPC response:', {
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
    });

    return response;
  } catch (error) {
    console.error('tRPC handler error:', error);
    throw error;
  }
};

export { handler as GET, handler as POST }; 