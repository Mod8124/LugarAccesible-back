import mongoose, { model } from 'mongoose';
const schema = mongoose.Schema;

const favoritesSchema = new schema({
  user_id: {
    type: String,
    required: [true, 'user is required'],
    unique: true,
  },
  favorites: {
    type: [{ place_id: String, name: String, location: { lat: String, lng: String } }],
    required: false,
  },
});

const Favorite = model('Favorite', favoritesSchema);

export default Favorite;
