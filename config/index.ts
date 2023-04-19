import dotenv from 'dotenv'
dotenv.config()

const PORT = Number(process.env.PORT) || 3000;

export {
   PORT
}