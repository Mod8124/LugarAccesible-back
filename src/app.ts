import Fastify from 'fastify'
import cors from '@fastify/cors'
import UserRoutes from './modules/users/users.routes'
import fastifySwagger from '@fastify/swagger'
import { withRefResolver } from 'fastify-zod'
import swaggerUI from "@fastify/swagger-ui"

export function buildApp(){
   const app = Fastify()

   app.register(cors)

   //:::Register Swagger
   app.register( fastifySwagger, withRefResolver({
      // exposeRoute: true,
      openapi: {
         info: {
            title: 'Devathon ed4 API',
            description: 'http://localhost:4000',
            version: '1.0.0'
         },
      }, 
   }))
   app.register(swaggerUI,{
      routePrefix: '/docs',
      uiConfig: {
         docExpansion: 'list',
         deepLinking: false
       },
       staticCSP: true,
       transformStaticCSP: (header) => header,
       transformSpecificationClone: true
   })
   
   //↓ Register routes
   app.get("/", () => ({message: 'Welcome to our api'}))
   app.register(UserRoutes, {prefix: '/users'})

   return app
}