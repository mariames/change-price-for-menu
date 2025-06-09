import { router } from '../trpc';
import { menuRouter } from './routers/menu';

export const appRouter = router({
  menu: menuRouter,
});

export type AppRouter = typeof appRouter; 