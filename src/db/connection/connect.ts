import { DB_URL } from '../../../config';
import mongoose from 'mongoose';

export const ConnectMongoDb = async () => {
  try {
    const data = await mongoose.connect(`${DB_URL}`);
    console.log(`connection to database successful : ${data.connection.name}`);
  } catch (err) {
    console.log(err);
  }
};
