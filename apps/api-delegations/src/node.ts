import { serve } from "@hono/node-server";
import { app } from "./index.js";

const port = 3200;
serve({ ...app, port }, (info) => {
	console.log(`Listening on http://localhost:${info.port}`);
});
