import dotenv from 'dotenv';
dotenv.config();

const PORT = Number(process.env.PORT) || 3000;
const JWT_SECRET = String(process.env.JWT_SECRET);
const GOOGLE_MAPS_KEY = process.env.GOOGLE_MAPS_KEY || '';
const DB_URL = process.env.DB_URL || '';
const HOST = process.env.HOST_URL;
const EMAIL_ACCOUNT = process.env.EMAIL_ACCOUNT;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

export { PORT, JWT_SECRET, GOOGLE_MAPS_KEY, DB_URL, HOST, EMAIL_ACCOUNT, EMAIL_PASSWORD };
