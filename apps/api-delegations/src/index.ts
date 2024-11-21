import { app } from './app.js';
export type {
  DelegationDb,
  InsertCaveatDb,
  InsertDelegationDb,
  SelectCaveatDb,
  SelectDelegationDb,
} from './db/schema.js';
export { app };
export type AppRouter = typeof app;
export type DelegationsApi = typeof app;
