import { type FastifyInstance } from "fastify";
import { getSearch, errorHandler } from "./search.controller";
import { $ref } from "./search.schema";

export async function SearchRoutes(app: FastifyInstance) {

    app.get("/",{
        schema: {
           tags: ['Search'],
           summary:'Get search by query and if the place is wheelchair accessible',
           querystring:$ref('query'),
           response:{
            200:$ref('ResponseSuccess'),
            404:$ref('ResponseFailed'), // default failed response
            400:{          // this error is custom when the user doesn't fill all queries
               description:'Missing fill queries. missingFields is going to be filled with all the fields that are missing',
               types:'object',
               properties: {
                 status: {
                  type: 'string',
                  example:'failed'
                 },
                 error:{
                  type:'string',
                  example:'Please fill in all the queries'
                 },
                 missingFields:{
                  type: 'array',
                  example:[]
                 }
               }
            }
           }
        },
  
     }, getSearch)

     // handle the global error of the searchRoutes
      app.setErrorHandler(errorHandler);
}

export default SearchRoutes;