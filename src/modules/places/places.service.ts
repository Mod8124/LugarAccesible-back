import prisma from '../../utils/prisma'
import {CreatePlaceSchema} from './places.schemas'
import { GOOGLE_MAPS_KEY } from "../../../config";
import { getWeelChair, filteredTypes } from '../search/search.service';

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

export async function getPlaceBy(input: CreatePlaceSchema) {
    return await prisma.place.findMany({
        where: input
    }) 
}

const endPoint = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json'

export async function getPlaces(location: Location) {
  const url = `${endPoint}?location=${location.lat} ${location.lng}&radius=5000&key=${GOOGLE_MAPS_KEY}&accessibility=accessible`;
  const result = await fetch(url)
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
    })
    .then((data) => {
      return Promise.all(
        data?.results.map(async (item: any) => {
          const wheelchair_accessible_entrance = await getWeelChair(item.place_id);
          return {
            place_id: item.place_id,
            name: item.name,
            types: item.types.filter(filteredTypes),
            location: item.geometry.location ,
            wheelchair_accessible_entrance,
          };
        })
      );
    });
  return result;
}

export async function createPlace(input: CreatePlaceSchema) {
    return await prisma.place.create({
        data: input
    })
}