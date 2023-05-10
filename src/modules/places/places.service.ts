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
