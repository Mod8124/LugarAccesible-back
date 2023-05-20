import dotenv from 'dotenv'
dotenv.config()

const PORT = Number(process.env.PORT) || 3000;
const JWT_SECRET = String(process.env.JWT_SECRET)
const GOOGLE_MAPS_KEY = process.env.GOOGLE_MAPS_KEY || ''
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || ''
export {
   PORT, 
   JWT_SECRET,
   GOOGLE_MAPS_KEY,
   SENDGRID_API_KEY
}