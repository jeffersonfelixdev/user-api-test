import { FastifyInstance } from 'fastify'

import fastifySwaggerUi from '@fastify/swagger-ui'

export async function apiDocs(app: FastifyInstance) {
  app.register(fastifySwaggerUi, {
    routePrefix: '/api-docs',
  })
}
