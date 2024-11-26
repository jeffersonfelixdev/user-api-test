import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { container } from '../../../shared/containers'
import { AppError } from '../../../shared/errors/app-error'

export async function deleteUserRoute(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete(
    '/users/:email',
    {
      schema: {
        params: z.object({
          email: z.string().email(),
        }),
      },
    },
    async (request, reply) => {
      const { userEmail } = request
      const { email } = request.params
      if (email === userEmail) throw new AppError('you cannot delete yourself')
      await container.items.deleteUser.execute(email)
      return reply.status(204).send()
    },
  )
}
