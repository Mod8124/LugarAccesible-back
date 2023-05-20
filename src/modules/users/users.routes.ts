import { type FastifyInstance } from "fastify";
import { loginHandler, registerUserHandler, getUsersHandler, updateUser, updatePassword, setActivate, forgotYourPassword } from "./users.controller";
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

   app.post("/validation/:salt", {
      schema: {
         tags: ['User'],
         params: $ref("activateSchema"),
         response: {
            201: $ref("responseOkSchema")
         }
      }
   }, setActivate)
   
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
            200: $ref("loginResponseSchema"),
            400: {          // this error is custom when the user doesn't fill all queries
               description:'Missing fill queries. missingFields is going to be filled with all the fields that are missing',
               types:'object',
               properties: {
                  status: {
                     type: 'string',
                     example:'failed'
                  },
                  error:{
                     type:'string',
                     example:'Please fill in all the queries'
                  },
                  missingFields:{
                     type: 'array',
                     example:[]
                  }
               }
            }
         }
      }
   }, loginHandler)

   app.post("/sendmailchangepwd", {
      schema: {
         tags: ['User'],
         body: $ref("emailSchema"),
         response: {
            200: $ref('responseOkSchema')
         }
      }
   }, forgotYourPassword)

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