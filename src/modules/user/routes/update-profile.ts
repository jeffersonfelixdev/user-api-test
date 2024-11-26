import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { container } from '../../../shared/containers'
import { jwtAuth } from '../../../shared/server/middlewares/jwt-auth'

export async function updateProfileRoute(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(jwtAuth)
    .put(
      '/users',
      {
        schema: {
          body: z.object({
            name: z.string().optional(),
            password: z.string().min(6).optional(),
          }),
        },
      },
      async (request, reply) => {
        const email = request.userEmail
        const { name, password } = request.body
        await container.items.updateUserProfile.execute({
          name,
          email,
          password,
        })
        return reply.status(204).send()
      },
    )
}
