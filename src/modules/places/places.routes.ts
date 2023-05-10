import { type FastifyInstance } from "fastify";
import { registerPlaces } from "./places.controller"
import { $ref } from "./places.schemas"

export async function PlaceRoutes(app: FastifyInstance) {
    app.post("/register", {
        schema: {
            tags: ["Place"],
            body: $ref("createPlaceSchema"),
            response: {
                201: $ref("responsePlaceSchema")
            }
        }
    }, registerPlaces)
}

export default PlaceRoutes
