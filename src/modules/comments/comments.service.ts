import prisma from '../../utils/prisma'
import { CreateComments, UpdateComments } from "./comments.schemas"

export async function getCommentBy(input: CreateComments) {
    const data = await prisma.comment.findMany({
        where: {
            id_place: input.id_place,
            userId: input.userId
        }
    })
    return data.length ? data[0] : null
}

export async function createComment(input: CreateComments) {
    console.log("Crj",input)
    return await prisma.comment.create({
        data: input
    })
}

export async function updateCommtent(input: UpdateComments) {
    const id_respuesta = (input.id_respuesta) ? input.id_respuesta : 0
    const text = (input.text) ? input.text : ''
    console.log(input)
    return await prisma.comment.update({
        where: {
            id: input.id
        },
        data: {
            text,
            id_commet_response: id_respuesta
        }
    })
}