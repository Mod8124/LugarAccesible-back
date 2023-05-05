import prisma from "../../utils/prisma";
import { hashPassword } from "../../utils/hash";
import { CreateUserInput } from "./users.schemas";

export async function getUsers() {
   return await prisma.user.findMany(
      {
         select: {
            id: true,
            email: true,
            name: true
         }
      }
   )
}

export async function createUser(input: CreateUserInput) {
   const {password, ...res} = input
   const { hash, salt } = hashPassword(password)
   const user = await prisma.user.create({
      data: {
         ...res, salt, password: hash
      }
   })
   return user
}

export async function findUserByEmail(email: string) {
   return prisma.user.findUnique({
      where: {
         email
      }
   })
}

export async function findUsers() {
   return prisma.user.findMany({
      select: {
         email: true,
         name: true,
         id: true
      }
   })   
}

export async function getUserById(correo: string) {
   return await prisma.user.findUnique(
      {
         where: {
            email: correo
         },
         select: {
            id: true,
            email: true,
            name: true
         }
      }
   )
}