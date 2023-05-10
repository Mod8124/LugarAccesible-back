import { type FastifyInstance } from "fastify";
import { registerPlaces, getPlacesHandler } from "./places.controller"
import { $placeRef } from "./places.schemas"

export async function PlaceRoutes(app: FastifyInstance) {

    app.get("/list",{
        schema: {
           description: 'description',
           tags: ['Places'],
           querystring: $placeRef("locationSchema")
        },
  
     }, getPlacesHandler)

    app.post("/register", {
        schema: {
            tags: ["Place"],
            body: $placeRef("createPlaceSchema"),
            response: {
                201: $placeRef("responsePlaceSchema")
            }
        }
    }, registerPlaces)
}

export default PlaceRoutes
