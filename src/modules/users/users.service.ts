import prisma from "../../utils/prisma";
import { hashPassword } from "../../utils/hash";
import { ActivateSchema, CreateUserInput, EmailSchema, UpdatePasswordSchema, UpdateUserSchema } from "./users.schemas";

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

export async function updateUserById(input: UpdateUserSchema){
   const user = await prisma.user.update({
      where: {
         id: input.id
      },
      data: {
         email: input.email,
         name: input.name,
         current_location: input.current_location
      }
   })
   const {id, name, email, current_location} = user
   return {id, name, email, current_location}
}

export async function updatePasswordById(input: UpdatePasswordSchema){
   const password = input.password
   const { hash, salt } = hashPassword(password)
   const user = await prisma.user.update({
      where: {
         id: input.id
      },
      data: {
         salt,
         password: hash
      }
   })
   const code = user ? true : false
   const msn = user ? "Ok" : "Error"
   return {code, msn}
}

export async function findUserByEmail(email: string) {
   const data = await prisma.user.findMany({
      where: {
         email
      },
      select: {
         id: true,
         name: true,
         email: true,
         status: true,
         password: true,
         salt: true
      }
   })
   return data
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

export async function setActivateUser(encrip: ActivateSchema) {
   const info = await prisma.user.findMany({
      where: {
         salt: encrip.salt,
         status: false
      },
      select : {
         id: true,
         email: true
      }
   })

   let upd = {}

   if((info.length)) {
      upd = await prisma.user.update({
         where: {
            email: info[0].email
         },
         data : {
            status : true
         },
         select: {
            email: true
         }
      })
   }
   return upd   
}

export async function getUserUnique(input: EmailSchema) {
   return await prisma.user.findUnique({
      where: {
         email: input.email
      }
   })
}