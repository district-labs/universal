import "dotenv/config";
import { defineConfig } from "drizzle-kit";

if (!process.env.DB_FILE_NAME) {
	throw new Error("DB_FILE_NAME is not defined");
}

export default defineConfig({
	out: "./src/lib/db/drizzle",
	schema: "./src/lib/db/schema.ts",
	dialect: "sqlite",
	dbCredentials: {
		url: process.env.DB_FILE_NAME,
	},
});
