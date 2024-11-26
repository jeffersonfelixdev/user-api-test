import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'

import { container } from '../../../shared/containers'
import { adminAuth } from '../../../shared/server/middlewares/admin-auth'

export async function listAllUsersRoute(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(adminAuth)
    .get('/users', async (request, reply) => {
      const result = await container.items.listAllUsers.execute()
      return reply.send(result)
    })
}
