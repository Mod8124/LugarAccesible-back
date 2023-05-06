import dotenv from 'dotenv'
dotenv.config()

const PORT = Number(process.env.PORT) || 3000;
const JWT_SECRET = String(process.env.JWT_SECRET)
export {
   PORT, JWT_SECRET
}