import { type FastifyInstance } from "fastify";
import { getPlacesHandler } from "./places.controller";
import { $placeRef } from "./places.schemas";


async function PlacesRoutes(app: FastifyInstance){

   app.get("/list",{
      schema: {
         description: 'description',
         tags: ['Places'],
         querystring: $placeRef("locationSchema")
      },

   }, getPlacesHandler)
   
}


export default PlacesRoutes;