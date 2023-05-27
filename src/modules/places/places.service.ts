import { GOOGLE_MAPS_KEY } from '../../../config';
import { getWeelChair, filteredTypes } from '../search/search.service';
import Favorite from '../../db/models/favoriteModel';
import { getRating, getComments } from '../comments/comments.service';

export type Location = {
  lat: string;
  lng: string;
};

export interface Place {
  place_id: string;
  icon: string;
  name: string;
  location: Location;
  types: string;
}

const endPoint = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';

export async function getPlaces(location: Location) {
  const url = `${endPoint}?location=${location.lat} ${location.lng}&radius=5000&key=${GOOGLE_MAPS_KEY}&accessibility=accessible`;
  const result = await fetch(url)
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
    })
    .then((data) => {
      return Promise.all(
        data?.results.map(async (item: any) => {
          const wheelchair_accessible_entrance = await getWeelChair(item.place_id);
          return {
            place_id: item.place_id,
            name: item.name,
            types: item.types.filter(filteredTypes),
            location: item.geometry.location,
            wheelchair_accessible_entrance,
          };
        }),
      );
    });
  return result;
}

interface IFavorite {
  _id: string;
  user_id: string;
  favorites: {
    place_id: string;
    name: string;
    location: {
      lat: string;
      lng: string;
    };
  }[];
}

const isFavorite = async (_id: string, place_id: string): Promise<boolean> => {
  const favorite = await Favorite.findOne({ user_id: _id, 'favorites.place_id': place_id });
  return !!favorite;
};

export const getDetails = async (place_id: string, user_id?: string) => {
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&key=${GOOGLE_MAPS_KEY}&fields=formatted_address,formatted_phone_number,geometry,name,international_phone_number,opening_hours,photos,place_id,website,types,wheelchair_accessible_entrance`;

  const response = await fetch(url);
  const data = await response.json();

  const newData = {
    formatted_address: data.result.formatted_address,
    formatted_phone_number: data.result.formatted_phone_number,
    location: data.result.geometry.location,
    name: data.result.name,
    international_phone_number: data.result.international_phone_number,
    opening_hours: data.result.opening_hours,
    photos: data.result.photos,
    place_id: data.result.place_id,
    website: data.result.website,
    types: data.result.types.filter(filteredTypes),
    wheelchair_accessible_entrance:
      'wheelchair_accessible_entrance' in data.result
        ? data.result.wheelchair_accessible_entrance
        : false,
    isFavorite: user_id ? await isFavorite(user_id, place_id) : false,
  };

  return newData;
};
