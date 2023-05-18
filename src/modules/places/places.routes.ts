import { type FastifyInstance } from "fastify";
import { searchPlaceByPlaceGoogle, savePlaces, caculateRating, getPlacesHandler } from "./places.controller"
import { $placeRef } from "./places.schemas"

export async function PlaceRoutes(app: FastifyInstance) {

    app.get("/list",{
        schema: {
        //    description: 'description',
           tags: ['Places'],
           querystring: $placeRef("locationSchema"),
           response:{
            200:$placeRef('responseSuccessPlacesList')
           }
        },
  
     }, getPlacesHandler)

    app.post("/register", {
        schema: {
            tags: ['Places'],
            body: $placeRef("createPlaceSchema"),
            response: {
                201: $placeRef("responsePlaceSchema")
            }
        }
    }, registerPlaces)
  
    app.post("/create", {
        schema: {
            tags: ["Place"],
            body: $placeRef("createPlaceSchema"),
            response: {
                201: $placeRef("responsePlaceSchema")
            }
        }
    }, savePlaces)

    app.get("/searchByIdGoogle/:id_google_place", {
        schema: {
            tags: ["Place"],
            params: $placeRef("createPlaceSchema"),
            response: {
                201: $placeRef("responsePlaceSchema")
            }
        }
    }, searchPlaceByPlaceGoogle)

    app.get("/ratingavg/:id", {
        schema: {
            tags: ["Place"],
            params: $placeRef("idPlaceSchema"),
            response: {
                201: $placeRef("responsePlaceSchema")
            }
        }

    }, caculateRating)
}

export default PlaceRoutes
