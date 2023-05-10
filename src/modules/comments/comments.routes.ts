import { type FastifyInstance } from "fastify";
import { registerComment } from "./comments.controller"
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
}

export default commentRoutes