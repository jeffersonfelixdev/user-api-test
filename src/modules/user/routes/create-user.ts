import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { UserRole } from '@prisma/client'

import { container } from '../../../shared/containers'

export async function createUserRoute(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/users',
    {
      schema: {
        body: z.object({
          name: z.string(),
          email: z.string().email(),
          password: z.string().min(6),
        }),
        response: {
          201: z.object({
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
      const { name, email, password } = request.body
      const result = await container.items.createUser.execute({
        name,
        email,
        password,
      })
      return reply.status(201).send(result)
    },
  )
}
