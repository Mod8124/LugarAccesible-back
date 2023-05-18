import type {FastifyReply, FastifyRequest} from "fastify"
import { CreatePlaceSchema, idPlaceSchema } from "./places.schemas"
import { createPlace, getPlaceByIdGoogle, calculateAvg} from "./places.service"

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

export async function searchPlaceByPlaceGoogle(
    request: FastifyRequest<{
        Params: CreatePlaceSchema
    }>,
    reply: FastifyReply
) {
    const places = request.params
    const rta = {status: false, response: {}}
    const rsp = {code: 500, msn: 'Error', rta: {}}
    try {
        const data = await getPlaceByIdGoogle(places)
        rta.status = true
        rsp.code = 200
        rsp.rta = (data[0]) ? data[0] : rsp.rta
        rsp.msn = (data) ? "Ok" : "Error"
        rta.response = rsp
        
        return reply.code(201).send(rta)
    } catch (error) {
        rta.response = rsp
        return reply.code(500).send(rta)
    }
}

export async function savePlaces(
    request: FastifyRequest<{
        Body: CreatePlaceSchema
    }>,
    reply: FastifyReply
) {
    const places = request.body
    const rta = {status: false, response: {}}
    const rsp = {code: 500, msn: 'Error', rta: {}}

    try {
        rsp.code = 200
        const rst = await createPlace(places)
        rsp.msn = (rst) ? "Se guardo" : "Error"
        rsp.rta = rst
        rta.response = rsp
        
        return reply.code(201).send(rta)
    } catch (error) {
        rta.response = rsp
        return reply.code(500).send(rta)
    }
}

export async function caculateRating(
    request: FastifyRequest<{
        Params: idPlaceSchema;
    }>,
    reply: FastifyReply
) {
    const idpla = request.params
    const rta = {status: false, response: {}}
    const rsp = {code: 500, msn: 'Error', rta: {}}

    try {
        rsp.code = 200
        
        const rst = await calculateAvg(idpla.id)
        rsp.msn = (rst) ? "Se guardo" : "Error"
        rsp.rta = rst
        rta.response = rsp
        
        return reply.code(201).send(rta)
    } catch (error) {
        rta.response = rsp
        return reply.code(500).send(rta)
    }
}