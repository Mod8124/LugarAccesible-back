import { type FastifyInstance } from "fastify";
import { getUsersHandler } from "./users.controller";

async function UserRoutes(app: FastifyInstance){

   app.get("/",{}, getUsersHandler)
   
}


export default UserRoutes;