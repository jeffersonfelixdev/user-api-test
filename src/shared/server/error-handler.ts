import { FastifyInstance } from 'fastify'
import {
  hasZodFastifySchemaValidationErrors,
  isResponseSerializationError,
} from 'fastify-type-provider-zod'

import { logError } from '../../config/debug'
import { AppError } from '../errors/app-error'

type FastifyErrorHandler = FastifyInstance['errorHandler']

export const errorHandler: FastifyErrorHandler = (error, request, reply) => {
  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply.code(400).send({
      error: 'Response Validation Error',
      message: "Request doesn't match the schema",
      statusCode: 400,
      details: {
        issues: error.validation,
        method: request.method,
        url: request.url,
      },
    })
  }

  if (isResponseSerializationError(error)) {
    return reply.code(500).send({
      error: 'Internal Server Error',
      message: "Response doesn't match the schema",
      statusCode: 500,
      details: {
        issues: error.cause.issues,
        method: error.method,
        url: error.url,
      },
    })
  }

  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      status: 'Application Error',
      message: error.message,
    })
  }

  if (error.code === 'FST_BASIC_AUTH_MISSING_OR_BAD_AUTHORIZATION_HEADER')
    return reply.status(401).send()

  logError(error.stack ?? 'Unknown error')

  return reply.status(500).send({
    status: 'Internal Server Error',
    message: 'Unknown error, see server logs',
  })
}
