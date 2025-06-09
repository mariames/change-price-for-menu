import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';

export async function createContext(opts: FetchCreateContextFnOptions) {
  return {
    req: opts.req,
    resHeaders: opts.resHeaders,
  };
} 