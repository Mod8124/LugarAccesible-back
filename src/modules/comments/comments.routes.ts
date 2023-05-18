import { type FastifyInstance } from "fastify";
import { registerComment, getDetailPlace, setEditPlace } from "./comments.controller"
import { $ref } from "./comments.schemas"

export async function commentRoutes(app: FastifyInstance) {
    app.post("/registrar", {
        schema: {
            tags: ['Comment'],
            body: $ref("createComments"),
            response: {
                201: $ref("responseCommentSchema")
            }
        }
    }, registerComment)

    app.get("/search/:userId/:id_place", {
        schema: {
            tags: ['Comment'],
            params: $ref("searchComment"),
            response: {
                201: $ref("responseCommentSchema")
            }
        }
    }, getDetailPlace)

    app.put("/edit/:id", {
        schema: {
            tags: ['Comment'],
            params: $ref("idComens"),
            body: $ref("reviewComment"),
            response: {
                201: $ref("responseCommentSchema")
            }
        }
    }, setEditPlace)
}

export default commentRoutes