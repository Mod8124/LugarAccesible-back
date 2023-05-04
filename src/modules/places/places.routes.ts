import { type FastifyInstance } from "fastify";
import { getPlacesHandler } from "./places.controller";

async function PlacesRoutes(app: FastifyInstance){

   app.get("/",{}, getPlacesHandler)
   
}


export default PlacesRoutes;