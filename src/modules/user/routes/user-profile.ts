import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { UserRole } from '@prisma/client'

import { container } from '../../../shared/containers'
import { jwtAuth } from '../../../shared/server/middlewares/jwt-auth'

export async function userProfileRoute(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(jwtAuth)
    .get(
      '/me',
      {
        schema: {
          response: {
            200: z.object({
              user: z.object({
                name: z.string(),
                email: z.string().email(),
                role: z.nativeEnum(UserRole),
              }),
            }),
          },
        },
      },
      async (request, reply) => {
        const email = request.userEmail
        const result = await container.items.getUserProfile.execute(email)
        return reply.send(result)
      },
    )
}
