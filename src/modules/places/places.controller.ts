import type {FastifyReply, FastifyRequest} from "fastify"
import { CreatePlaceSchema } from "./places.schemas"
import { createPlace, getPlaceBy, getPlaces} from "./places.service"

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

export async function registerPlaces(
    request: FastifyRequest<{
        Body: CreatePlaceSchema
    }>,
    reply: FastifyReply
) {
    const places = request.body
    const rta = {status: false, response: {}}
    const rsp = {code: 500, msn: 'Error', rta: {}}
    try {
        const data = await getPlaceBy(places)
        rsp.code = 200
        rsp.msn = "Ya se registro"
        console.log(data)
        if(!data.length) {
            const rst = await createPlace(places)
            rsp.msn = (rst) ? "Se guardo" : "Error"
            rsp.rta = rst
        }
        else
        {
            rsp.rta = data[0]
        }        
        rta.response = rsp
        
        return reply.code(201).send(rta)
    } catch (error) {
        rta.response = rsp
        return reply.code(500).send(rta)
    }
}