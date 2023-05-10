import type { FastifyReply, FastifyRequest } from "fastify";
import { getUsers, createUser, findUserByEmail, updateUserById, updatePasswordById } from "./users.service";
import { CreateUserInput, LoginInput, UpdateUserSchema, UpdatePasswordSchema } from "./users.schemas";
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

export async function updateUser(
   request: FastifyRequest<{
      Body: UpdateUserSchema
   }>,
   reply: FastifyReply
) {
   const body = request.body
   const rta = { status: false, response: {}}
   const rsp = {code: 401, msn: '', rta: {}}

   try {
      rta.status = true
      rsp.code = 201
      const user = await updateUserById(body)
      rsp.msn = (user) ? "Ok" : "Error"
      rsp.rta = user
      
      rta.response = rsp
      return reply.code(201).send(rta)
   } catch (error) {
      rsp.code = 500
      rsp.msn = "Error"
      rta.response = rsp
      return reply.code(500).send(rta)
   }
}

export async function updatePassword(
   request: FastifyRequest<{
      Body: UpdatePasswordSchema
   }>,
   reply: FastifyReply
) {
   const body = request.body
   const rta = { status: false, response: {}}
   const rsp = {code: 401, msn: ''}

   try {
      rta.status = true
      rsp.code = 201

      const user = await updatePasswordById(body)
      rsp.msn = (user) ? "Ok" : "Error"
      rta.response = rsp
      return reply.code(201).send(rta)
   } catch (error) {
      rsp.code = 500
      rsp.msn = "Error"
      rta.response = rsp
      return reply.code(500).send(rta)
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
   const rta = { status: false, response: {}}
   const rsp = {code: 401, msn: '', accessToken: ''}
   if(!user) {
      rsp.msn = 'No existe email'
      rta.response = rsp
      return reply.code(401).send(rta)
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
      rta.status = true
      rsp.code = 201
      rsp.msn = "Datos correctos"
      rsp.accessToken = token
      rta.response = rsp
      return rta
   }
   rsp.msn = "Clave incorrecta"
   rta.response = rsp
   return rta
}

export async function getUsersHandler(
   request: FastifyRequest,
   reply: FastifyReply
) {
   const users = await getUsers()
   reply.code(200).send(users)
}