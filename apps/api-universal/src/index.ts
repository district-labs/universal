import type { hc } from 'hono/client';
import { app } from './app.js';
import type { InsertAccountDb, SelectAccountDb } from './db/schema.js';
import type { LeaderboardSearchParams } from './routes/leaderboard.js';
export {
    app,
    type InsertAccountDb, type LeaderboardSearchParams, type SelectAccountDb
};
export type App = typeof app;
export type UniversalApiClient = ReturnType<typeof hc<App>>;
