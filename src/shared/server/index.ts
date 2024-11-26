import fastify from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import jwkToPem from 'jwk-to-pem'

import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'

import { logInfo } from '../../config/debug'
import { env } from '../../config/env'
import { adminEditUser } from '../../modules/user/routes/admin-edit-user'
import { createUserRoute } from '../../modules/user/routes/create-user'
import { deleteUserRoute } from '../../modules/user/routes/delete-user'
import { listAllUsersRoute } from '../../modules/user/routes/list-all-users'
import { signInRoute } from '../../modules/user/routes/sign-in'
import { updateProfileRoute } from '../../modules/user/routes/update-profile'
import { userProfileRoute } from '../../modules/user/routes/user-profile'
import { apiDocs } from './api-docs'
import { errorHandler } from './error-handler'

const app = fastify({ logger: true })

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)
app.setErrorHandler(errorHandler)

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'User API',
      description: 'UserAPI Documentation Reference',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'http://localhost:8000',
        description: 'Development',
      },
    ],
    components: {
      securitySchemes: {
        token: {
          description: 'JWT',
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  transform: jsonSchemaTransform,
})
app.register(apiDocs)

app.register(fastifyJwt, {
  secret: {
    private: jwkToPem(JSON.parse(env.APP_JWK_PRIVATE_KEY), { private: true }),
    public: jwkToPem(JSON.parse(env.APP_JWK_PRIVATE_KEY)),
  },
})

app.register(fastifyCors)

app.register(createUserRoute)
app.register(signInRoute)
app.register(userProfileRoute)
app.register(updateProfileRoute)
app.register(listAllUsersRoute)
app.register(adminEditUser)
app.register(deleteUserRoute)

app.listen({ host: '0.0.0.0', port: 8000 }).then(() => {
  logInfo('Server running on port 8000')
})
