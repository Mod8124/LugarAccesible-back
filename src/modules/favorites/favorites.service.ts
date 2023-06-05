import Favorite from '../../db/models/favoriteModel';

export interface IBodyPostComment {
  [key: string]: string | { lat: number; lng: number } | string[] | boolean | undefined;
  place_id: string;
  name: string;
  formatted_address: string;
  location: { lat: number; lng: number };
  types: string[];
  wheelchair_accessible_entrance?: boolean;
}

export const getFavorites = async (user_id: string) => {
  const favorites = await Favorite.findOne({ user_id });
  if (!favorites) return [];
  return favorites.favorites;
};

export const postFavorite = async (user_id: string, body: IBodyPostComment) => {
  const favorites = await Favorite.findOne({ user_id });
  if (!favorites) {
    const newFavorite = await Favorite.create({
      user_id,
      favorites: [
        {
          place_id: body.place_id,
          name: body.name,
          formatted_address: body.formatted_address,
          location: body.location,
          types: body.types,
          wheelchair_accessible_entrance: body.wheelchair_accessible_entrance,
        },
      ],
    });
    return newFavorite;
  } else {
    const favorite = await Favorite.findOne({ user_id, 'favorites.place_id': body.place_id });
    if (favorite) {
      return favorite.favorites;
    } else {
      const postFavorite = await Favorite.findOneAndUpdate(
        { user_id },
        {
          $push: {
            favorites: {
              place_id: body.place_id,
              name: body.name,
              formatted_address: body.formatted_address,
              location: body.location,
              types: body.types,
              wheelchair_accessible_entrance: body.wheelchair_accessible_entrance,
            },
          },
        },
        { new: true, upsert: true },
      );
      return postFavorite.favorites;
    }
  }
};

export const deleteFavorite = async (user_id: string, favorite: { place_id: string }) => {
  const favorites = await Favorite.findOneAndUpdate(
    { user_id },
    { $pull: { favorites: { place_id: favorite.place_id } } },
    { new: true },
  );
  return favorites?.favorites;
};
