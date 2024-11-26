import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { UserRole } from '@prisma/client'

import { container } from '../../../shared/containers'

export async function signInRoute(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/users/sign-in',
    {
      schema: {
        body: z.object({
          email: z.string(),
          password: z.string(),
        }),
        response: {
          200: z.object({
            name: z.string(),
            email: z.string().email(),
            role: z.nativeEnum(UserRole),
            accessToken: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body
      const { user } = await container.items.authenticateUserUseCase.execute({
        email,
        password,
      })
      const accessToken = await reply.jwtSign(
        { role: user.role },
        { expiresIn: '24h', sub: user.email },
      )
      return {
        ...user,
        accessToken,
      }
    },
  )
}
