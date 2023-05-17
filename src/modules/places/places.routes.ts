import { type FastifyInstance } from "fastify";
import { searchPlaceByPlaceGoogle, savePlaces, caculateRating } from "./places.controller"
import { $ref } from "./places.schemas"

export async function PlaceRoutes(app: FastifyInstance) {
    app.post("/create", {
        schema: {
            tags: ["Place"],
            body: $ref("createPlaceSchema"),
            response: {
                201: $ref("responsePlaceSchema")
            }
        }
    }, savePlaces)

    app.get("/searchByIdGoogle/:id_google_place", {
        schema: {
            tags: ["Place"],
            params: $ref("createPlaceSchema"),
            response: {
                201: $ref("responsePlaceSchema")
            }
        }
    }, searchPlaceByPlaceGoogle)

    app.get("/ratingavg/:id", {
        schema: {
            tags: ["Place"],
            params: $ref("idPlaceSchema"),
            response: {
                201: $ref("responsePlaceSchema")
            }
        }

    }, caculateRating)
}

export default PlaceRoutes
