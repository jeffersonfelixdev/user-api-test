import { FastifyInstance } from 'fastify'
import fastifyPlugin from 'fastify-plugin'

import { UserRole } from '@prisma/client'

import { AppError } from '../../errors/app-error'

export const adminAuth = fastifyPlugin(async (app: FastifyInstance) => {
  app.addHook('preHandler', async request => {
    let result: { sub: string; role: UserRole } | null = null
    try {
      result = await request.jwtVerify<{ sub: string; role: UserRole }>()
    } catch (err) {
      throw new AppError('invalid token', 401)
    }
    if (result.role !== UserRole.ADMIN)
      throw new AppError('forbidden access', 403)
    request.userEmail = result.sub
    request.userRole = result.role
  })
})
