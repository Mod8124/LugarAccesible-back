import {FastifyReply, FastifyRequest} from "fastify"
import { CreateComments } from "./comments.schemas"
import { getCommentBy, createComment, updateCommtent} from "./comments.service"

export async function registerComment(
    request: FastifyRequest<{
        Body: CreateComments
    }>,
    reply: FastifyReply
) {
    const comment = request.body
    const rta = {status: false, response: {}}
    const rps = {code: 500, msn: 'Error', rta: {}}
    try {
        const data = await getCommentBy(comment)
        rps.code = 200
        
        if(data) {
            comment.id_respuesta = (data?.id_respuesta) ? data?.id_respuesta : 0
            let raiting_comment = (data?.raiting_comment) ? data?.raiting_comment : 0
            const send = {
                id: data.id,
                raiting_comment,
                ...comment
            }
            const upd = await updateCommtent(send)
            rps.msn = (upd) ? "Edito Ok" : "Error"
            rps.rta = upd
        }
        else {
            console.log(comment)
            console.log("SAve")
            const send = {
                ...comment
            }
            const save = await createComment(send)
            rps.msn = (save) ? "Guardo Ok" : "Error"
            rps.rta = save
        }
        rta.response = rps
        return reply.code(201).send(rta)
    } catch (error) {
        rta.response = rps
        return reply.code(500).send(rta)
    }
}