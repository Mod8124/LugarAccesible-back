import { type FastifyInstance } from "fastify";
import { loginHandler, registerUserHandler, getUsersHandler, updateUser, updatePassword } from "./users.controller";
import { $ref } from "./users.schemas";

async function UserRoutes(app: FastifyInstance){
   app.post("/register", {
      schema: {
         tags: ['User'],
         body: $ref("createUserSchema"),
         response: {
            201: $ref("createUserResponseSchema")
         }
      }
   }, registerUserHandler)
   
   app.get("/",{ 
      preHandler: [app.authenticate],
      schema: {
         tags: ['User'],
      }
   }, getUsersHandler)

   app.post("/login", {
      schema: {
         tags: ['User'],
         body: $ref('loginSchema'),
         response: {
            200: $ref("loginResponseSchema")
         }
      }
   }, loginHandler)

   app.post("/perfil", {
      preHandler: [app.authenticate],
      schema: {
         tags: ['User'],
         body: $ref('updateUserSchema'),
         response: {
            200: $ref('responseOkSchema')
         }
      }
   }, updateUser)

   app.post("/changepassword", {
      preHandler: [app.authenticate],
      schema: {
         tags: ['User'],
         body: $ref('updatePasswordSchema'),
         response: {
            200: $ref('responseOkSchema')
         }
      }
   }, updatePassword)
}


export default UserRoutes;