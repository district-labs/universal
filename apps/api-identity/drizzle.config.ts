import "dotenv/config";
import type { Config } from "drizzle-kit";

if(!process.env.DATABASE_URL) {
	throw new Error("DATABASE_URL environment variable is not set");
}

export default {
	out: "./src/lib/db/drizzle",
	schema: "./src/lib/db/schema.ts",
	dialect: "postgresql",
	dbCredentials: {
		url: process.env.DATABASE_URL,
	},
} satisfies Config;
