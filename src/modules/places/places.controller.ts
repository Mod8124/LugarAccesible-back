import {FastifyReply, FastifyRequest} from "fastify"
import { CreatePlaceSchema } from "./places.schemas"
import { createPlace, getPlaceBy} from "./places.service"

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