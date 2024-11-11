import "dotenv/config";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema.js";

if (!process.env.DB_FILE_NAME) {
	throw new Error("DB_FILE_NAME is not defined");
}

const client = createClient({ url: process.env.DB_FILE_NAME });
export const db = drizzle({ client, schema });
