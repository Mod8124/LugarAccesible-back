import prisma from '../../utils/prisma'
import {CreatePlaceSchema, idPlaceSchema, SearchPlaceSchema} from './places.schemas'

export async function getPlaceByIdGoogle(input: CreatePlaceSchema) {
    return await prisma.place.findMany({
        where: {
            id_google_place: input.id_google_place
        }
    }) 
}

export async function createPlace(input: CreatePlaceSchema) {
    return await prisma.place.create({
        data: {
            id_google_place: input.id_google_place
        }
    })
}

export async function updatePlaces(idpla: idPlaceSchema, input: CreatePlaceSchema) {
    return await prisma.place.update({
        where: idpla,
        data: {
            id_google_place: input.id_google_place
        }
    })
}

export async function calculateAvg(id_place: number) {
    const avg = await prisma.comment.aggregate({
        _avg: {
            raiting_comment: true
        },
        where: {
            id_place,
            raiting_comment: {
                not: null
            }
        }
    })
    
    return await prisma.place.update({
        where: {
            id: id_place
        },
        data: {
            rating: avg._avg.raiting_comment ? avg._avg.raiting_comment : null
        }
    })
}