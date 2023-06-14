import { GOOGLE_MAPS_KEY } from '../../../config';
import axios from 'axios';

// these are the most important type from types so I apply this on types so this return only the most useful keywords
const keywords: { [key: string]: string } = {
  accounting: 'accounting',
  airport: 'airport',
  amusement_park: 'amusement_park',
  aquarium: 'aquarium',
  art_gallery: 'art_gallery',
  atm: 'atm',
  bakery: 'bakery',
  bank: 'bank',
  bar: 'bar',
  beauty_salon: 'beauty_salon',
  bicycle_store: 'bicycle_store',
  book_store: 'book_store',
  bowling_alley: 'bowling_alley',
  bus_station: 'bus_station',
  cafe: 'cafe',
  campground: 'campground',
  car_dealer: 'car_dealer',
  car_rental: 'car_rental',
  car_repair: 'car_repair',
  car_wash: 'car_wash',
  casino: 'casino',
  cemetery: 'cemetery',
  church: 'church',
  city_hall: 'city_hall',
  clothing_store: 'clothing_store',
  convenience_store: 'convenience_store',
  courthouse: 'courthouse',
  dentist: 'dentist',
  department_store: 'department_store',
  doctor: 'doctor',
  drugstore: 'drugstore',
  electrician: 'electrician',
  electronics_store: 'electronics_store',
  embassy: 'embassy',
  fire_station: 'fire_station',
  florist: 'florist',
  funeral_home: 'funeral_home',
  furniture_store: 'furniture_store',
  gas_station: 'gas_station',
  gym: 'gym',
  hair_care: 'hair_care',
  hardware_store: 'hardware_store',
  hindu_temple: 'hindu_temple',
  home_goods_store: 'home_goods_store',
  hospital: 'hospital',
  insurance_agency: 'insurance_agency',
  jewelry_store: 'jewelry_store',
  laundry: 'laundry',
  lawyer: 'lawyer',
  library: 'library',
  light_rail_station: 'light_rail_station',
  liquor_store: 'liquor_store',
  local_government_office: 'local_government_office',
  locksmith: 'locksmith',
  lodging: 'lodging',
  meal_delivery: 'meal_delivery',
  meal_takeaway: 'meal_takeaway',
  mosque: 'mosque',
  movie_rental: 'movie_rental',
  movie_theater: 'movie_theater',
  moving_company: 'moving_company',
  museum: 'museum',
  night_club: 'night_club',
  painter: 'painter',
  park: 'park',
  parking: 'parking',
  pet_store: 'pet_store',
  pharmacy: 'pharmacy',
  physiotherapist: 'physiotherapist',
  plumber: 'plumber',
  police: 'police',
  post_office: 'post_office',
  primary_school: 'primary_school',
  real_estate_agency: 'real_estate_agency',
  restaurant: 'restaurant',
  roofing_contractor: 'roofing_contractor',
  rv_park: 'rv_park',
  school: 'school',
  secondary_school: 'secondary_school',
  shoe_store: 'shoe_store',
  shopping_mall: 'shopping_mall',
  spa: 'spa',
  stadium: 'stadium',
  storage: 'storage',
  store: 'store',
  subway_station: 'subway_station',
  supermarket: 'supermarket',
  synagogue: 'synagogue',
  taxi_stand: 'taxi_stand',
  tourist_attraction: 'tourist_attraction',
  train_station: 'train_station',
  transit_station: 'transit_station',
  travel_agency: 'travel_agency',
  university: 'university',
  veterinary_care: 'veterinary_care',
  zoo: 'zoo',
};

interface IGetSearchParams {
  lat: string;
  lng: string;
  query?: string;
  types?: string;
}

interface IGeometry {
  location: {
    lat: number;
    lng: number;
  };
}

interface IResults {
  business_status: string;
  formatted_address: string;
  name: string;
  place_id: string;
  types: string[];
  location: IGeometry;
  opening_hours: {
    open_now: boolean;
  };
  wheelchair_accessible_entrance: boolean;
}

// getting the whole data from the search (first)
const getSearch = async ({ lat, lng, query, types }: IGetSearchParams) => {
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&location=${lat},${lng}&key=${GOOGLE_MAPS_KEY}&types=${types}`,
  );
  const data = response.data;
  return data.results;
};

export const getWeelChair = async (place_id: string) => {
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&key=${GOOGLE_MAPS_KEY}`,
  );
  const data = response.data;
  return 'wheelchair_accessible_entrance' in data.result
    ? data.result.wheelchair_accessible_entrance
    : false;
};

export const filteredTypes = (type: string) => {
  return type === keywords[type];
};

const getResults = async ({ lat, lng, query, types }: IGetSearchParams): Promise<IResults[]> => {
  const results = await getSearch({ lat, lng, query, types });
  const newResults = await Promise.all(
    results.map(async (result: any) => {
      const wheelchair_accessible_entrance = await getWeelChair(result.place_id);
      const opening_hours = result.opening_hours ? result.opening_hours : { open_now: false };
      return {
        business_status: result.business_status,
        formatted_address: result.formatted_address,
        name: result.name,
        place_id: result.place_id,
        types: result.types.filter(filteredTypes),
        location: result.geometry.location,
        opening_hours,
        wheelchair_accessible_entrance,
      };
    }),
  );

  return newResults;
};
