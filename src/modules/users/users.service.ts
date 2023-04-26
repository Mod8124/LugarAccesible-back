import exp from "constants";
import prisma from "../../utils/prisma";
import { number } from "zod";
import { CreateUserDTO, UpdateUserDTO } from "./users.schemas";

export async function getUsers() {
   return await prisma.user.findMany()
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

export async function saveUser(user: CreateUserDTO) {
   const newUser = await prisma.user.create({
      data: {
         email: user.email,
         name: user.name,
         password: user.password
      },
      select: {
         id: true,
         email: true,
         name: true
      }
   })
   return newUser
}

export async function updateUser(correo: string, user: UpdateUserDTO) {
   const updUser = await prisma.user.update({
      where: {
         email: correo
      },
      data: {
         email: user.email,
         name: user.name,
         password: user.password
      },
      select: {
         id: true,
         email: true,
         name: true
      }
   })
   return updUser
}
