import prisma from '../../utils/prisma'
import {CreatePlaceSchema, idPlaceSchema, SearchPlaceSchema} from './places.schemas'

import { GOOGLE_MAPS_KEY } from "../../../config";

export type Location = {
   lat: string,
   lng: string
}

export interface Place {
   place_id: string,
   icon: string,
   name: string,
   location: Location,   
   types: string
}

export async function getPlaceByIdGoogle(input: CreatePlaceSchema) {
    return await prisma.place.findMany({
        where: {
            id_google_place: input.id_google_place
        }
    }) 
}

const endPoint = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json'

export async function getPlaces(location: Location) {
   const url = `${endPoint}?location=${location.lat} ${location.lng}&radius=5000&key=${GOOGLE_MAPS_KEY}&accessibility=accessible`
   const result =  await fetch(url)
      .then(res => {
         if(res.ok){
            return res.json()
         }
      })
      .then( data => {
          const lista = data?.results.map( (item:any) => {
            return {
               place_id: item.place_id,
               icon: item.icon,
               name: item.name,
               location: {lat: item.geometry.location},   
               types: item.types
            }
         })
         return lista
      })
      return result;
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