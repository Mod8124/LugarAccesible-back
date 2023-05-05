import { type FastifyInstance } from "fastify";
import { loginHandler, registerUserHandler, getUsersHandler } from "./users.controller";
import { $ref } from "./users.schemas";

async function UserRoutes(app: FastifyInstance){
   app.post("/", {
      schema: {
         body: $ref("createUserSchema"),
         response: {
            201: $ref("createUserResponseSchema")
         }
      }
   }, registerUserHandler)
   
   app.get("/",{ 
      preHandler: [app.authenticate]
   }, getUsersHandler)

   app.post("/login", {
      schema: {
         body: $ref('loginSchema'),
         response: {
            200: $ref("loginResponseSchema")
         }
      }
   }, loginHandler)
}


export default UserRoutes;