import { app } from './index.js'
import { serve } from '@hono/node-server'

serve({ ...app, port: +(process.env.PORT || "8787" as string) }, info => {
  console.log(`Listening on http://localhost:${info.port}`)
})
