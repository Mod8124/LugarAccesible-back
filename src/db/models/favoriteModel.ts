import mongoose, { model } from 'mongoose';
const schema = mongoose.Schema;

const favoriteSchema = new schema({
  user_id: {
    type: String,
    required: [true, 'user is required'],
    unique: true,
  },
  favorites: {
    type: [{ place_id: String, name: String, location: { lat: Number, lng: Number } }],
    required: false,
  },
});

const Favorite = model('Favorite', favoriteSchema);

export default Favorite;
