import Fastify from 'fastify'
import cors from '@fastify/cors'
import UserRoutes from './modules/users/users.routes'

export function buildApp(){
   const app = Fastify()

   app.register(cors)
   
   //↓ Register routes
   app.get("/", () => ({message: 'Welcome to our api'}))
   app.register(UserRoutes, {prefix: '/users'})

   return app
}