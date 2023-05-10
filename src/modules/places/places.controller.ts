import type { FastifyReply, FastifyRequest } from "fastify";
import { getPlaces } from "./places.service";

export async function getPlacesHandler(
   request: FastifyRequest<{Querystring:{lat:string, lng:string}}>,
   reply: FastifyReply
) {
   const {lat, lng} = request.query
   if(!lat || !lng){
      return reply.send({
         message: 'Requires lat and lng as parameters'
      })
   }
   const places = await getPlaces({lat, lng})
   reply
      .code(200)
      .send(places)
}

