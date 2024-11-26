import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { UserRole } from '@prisma/client'

import { container } from '../../../shared/containers'
import { adminAuth } from '../../../shared/server/middlewares/admin-auth'

export async function getUserRoute(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(adminAuth)
    .get(
      '/users/:email',
      {
        schema: {
          params: z.object({
            email: z.string().email(),
          }),
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
        const { email } = request.params
        const result = await container.items.getUserProfile.execute(email)
        return reply.send(result)
      },
    )
}
