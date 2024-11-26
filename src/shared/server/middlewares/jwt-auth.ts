import { FastifyInstance } from 'fastify'
import fastifyPlugin from 'fastify-plugin'

import { AppError } from '../../errors/app-error'

export const jwtAuth = fastifyPlugin(async (app: FastifyInstance) => {
  app.addHook('preHandler', async request => {
    try {
      const result = await request.jwtVerify<{ sub: string; role: string }>()
      request.userEmail = result.sub
      request.userRole = result.role
    } catch {
      throw new AppError('invalid token', 401)
    }
  })
})
