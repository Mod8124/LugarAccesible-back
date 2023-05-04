import { PORT } from "../config/";
import { app } from "./app";

const server = app

async function main (){
   try {
      await server.listen({port:PORT, host: "0.0.0.0"})
      console.log(`Server running at http://localhost:${PORT}`);
   } catch (err) {
      console.log( err );
      process.exit(1)
   }
}

main();