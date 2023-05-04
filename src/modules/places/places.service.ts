import prisma from "../../utils/prisma";

type Location = {
   lat: string,
   lng: string
}
const endPoint = 'http://lcaoltiongoogglemapsapi'

export async function getPlacesByLocation(location:Location, ) {
   fetch(endPoint)
}
