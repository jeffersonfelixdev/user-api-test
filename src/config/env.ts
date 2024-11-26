import 'dotenv/config'
import { z } from 'zod'

import { logError } from './debug'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
  DATABASE_URL: z.string().default(''),
  APP_JWK_PRIVATE_KEY: z.string(),
})

const parsedEnv = envSchema.safeParse(process.env)

if (!parsedEnv.success) {
  logError('⛔️ environment variables verification failed!')
  logError(JSON.stringify(parsedEnv.error.format()))
  throw new Error(JSON.stringify(parsedEnv.error.format()))
}

export const env = parsedEnv.data
