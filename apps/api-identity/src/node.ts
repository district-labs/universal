import { app } from "./app.js";
import { serve } from "@hono/node-server";

const port = 3300;
serve({ ...app, port }, (info) => {
	console.log(`Listening on http://localhost:${info.port}`);
});
