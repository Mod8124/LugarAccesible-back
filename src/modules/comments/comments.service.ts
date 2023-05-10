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
    return await prisma.comment.create({
        data: {
            userId: input.userId,
            text: input.text,
            id_place: input.id_place
        }
    })
}

export async function updateCommtent(input: UpdateComments) {
    const id_respuesta = (input.id_respuesta) ? input.id_respuesta : 0
    const text = (input.text) ? input.text : ''
    return await prisma.comment.update({
        where: {
            id: input.id
        },
        data: {
            text,
            id_respuesta
        }
    })
}