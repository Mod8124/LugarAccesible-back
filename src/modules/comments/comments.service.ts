import prisma from '../../utils/prisma'
import { CreateComments, ReviewComment, UpdateComments } from "./comments.schemas"

export async function getCommentBy(input: CreateComments) {
    const data = await prisma.comment.findMany({
        where: {
            id_place: input.id_place,
            userId: input.userId
        }
    })
    return data.length ? data[0] : null
}

export async function getDetailComment(idplace: number, iduser: number) {
    return await prisma.comment.findFirst({
        where: {
            id_place: idplace,
            userId: iduser
        }
    })
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
            id_commet_response: id_respuesta
        }
    })
}

export async function editComment(id: number, input: ReviewComment) {
    return await prisma.comment.update({
        where: {
            id
        },
        data: {
            text: input.text ? input.text : null,
            raiting_comment: input.raiting_comment ? input.raiting_comment : null,
            id_respuesta: input.id_respuesta ? input.id_respuesta : null
        }
    })
}