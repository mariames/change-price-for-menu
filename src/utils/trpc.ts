import { createTRPCReact } from '@trpc/react-query';
import { type AppRouter } from '@/server/api/root';

console.log('Creating tRPC client...');
export const trpc = createTRPCReact<AppRouter>();
console.log('tRPC client created:', !!trpc); 