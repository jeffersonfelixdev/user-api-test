import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { UserRole } from '@prisma/client'

import { container } from '../../../shared/containers'
import { adminAuth } from '../../../shared/server/middlewares/admin-auth'

export async function adminEditUser(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(adminAuth)
    .put(
      '/users/:email',
      {
        schema: {
          params: z.object({
            email: z.string().email(),
          }),
          body: z.object({
            name: z.string().optional(),
            password: z.string().optional(),
            role: z.nativeEnum(UserRole).optional(),
          }),
        },
      },
      async (request, reply) => {
        const { email } = request.params
        const { name, password, role } = request.body
        await container.items.updateUser.execute({
          email,
          name,
          password,
          role,
        })
        return reply.status(204).send()
      },
    )
}
