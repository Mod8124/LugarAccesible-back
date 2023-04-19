import prisma from "../../utils/prisma";

export async function getUsers() {
   return await prisma.user.findMany()
}