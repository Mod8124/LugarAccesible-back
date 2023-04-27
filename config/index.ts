import dotenv from 'dotenv'
dotenv.config()

const PORT = Number(process.env.PORT) || 8080;

export {
   PORT
}