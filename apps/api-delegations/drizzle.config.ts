import { env } from "@/env.js";
import type { Config } from "drizzle-kit";

export default {
	schema: "./src/db/schema.ts",
	out: "./src/db/migrations",
	dialect: "postgresql",
	dbCredentials: {
		url: env.DELEGATIONS_DATABASE_URL,
	},
} satisfies Config;
