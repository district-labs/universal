import { app } from './app.js'
import { serve } from '@hono/node-server'

serve({ ...app, port: +(process.env.PORT || "1111" as string) }, info => {
  console.log(`Listening on http://localhost:${info.port}`)
})
