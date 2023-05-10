import prisma from '../../utils/prisma'
import {CreatePlaceSchema} from './places.schemas'

export async function getPlaceBy(input: CreatePlaceSchema) {
    return await prisma.place.findMany({
        where: input
    }) 
}

export async function createPlace(input: CreatePlaceSchema) {
    const rta = await prisma.place.create({
        data: input
    })
    console.log(rta)
    return rta
}