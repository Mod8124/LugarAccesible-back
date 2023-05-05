import  { FastifyReply, FastifyRequest } from "fastify";
import { getUsers, createUser, findUserByEmail } from "./users.service";
import { CreateUserInput, LoginInput } from "./users.schemas";
import { verifyPassword } from "../../utils/hash";

export async function registerUserHandler(
   request: FastifyRequest<{
      Body: CreateUserInput;
   }>,
   reply: FastifyReply
) {
   const body = request.body

   try {
      const user = await createUser(body)
      return reply.code(201).send(user)
   } catch (error) {
      return reply.code(500).send(error)
   }
}

export async function loginHandler (
   request: FastifyRequest<{
      Body: LoginInput;
   }>,
   reply: FastifyReply
){
   const body = request.body
   //consultar usuario
   const user = await findUserByEmail(body.email)
   if(!user) {
      return reply.code(401).send({
         message: "Invalido email o pasword"
      })
   }

   //verificar pasword
   const correctPassword = verifyPassword({
      candidatePassword: body.password,
      salt: user.salt,
      hash: user.password
   })

   if(correctPassword) {
      const { password, salt, ...res} = user
      const token = await reply.jwtSign(res)
      return { accessToken: token}
   }

   return reply.code(401).send({
      message: "Invalido email o pasword"
   })
}

export async function getUsersHandler(
   request: FastifyRequest,
   reply: FastifyReply
) {
   const users = await getUsers()
   reply.code(200).send(users)
}