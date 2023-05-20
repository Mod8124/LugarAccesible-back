import type { FastifyReply, FastifyRequest } from "fastify";
import { getUsers, createUser, findUserByEmail, updateUserById, updatePasswordById, setActivateUser, getUserUnique } from "./users.service";
import { CreateUserInput, LoginInput, UpdateUserSchema, UpdatePasswordSchema, ActivateSchema, EmailSchema } from "./users.schemas";
import { verifyPassword } from "../../utils/hash";
import { SENDGRID_API_KEY } from "../../../config/";
import exp from "constants";
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(SENDGRID_API_KEY)
const hostName = 'https://vps-3308549-x.dattaweb.com';

export async function registerUserHandler(
   request: FastifyRequest<{
      Body: CreateUserInput;
   }>,
   reply: FastifyReply
) {
   const body = request.body

   try {
      const user = await findUserByEmail(body.email)
      
      const rta = { status: false, response: {} }
      const rps = { code: 500, msn: 'Error', rta: {} }

      if(!user.length) {         
         const data = await createUser(body)
         rps.code = 400
         rps.msn = 'Error al registrar'

         if(data.id) {
            rta.status = true
            rps.code = 201
            
            const msg = {
               to: data.email, // Change to your recipient
               from: 'j.eloy.cayetano.m@gmail.com', // Change to your verified sender
               subject: `Detalles de la cuenta de ${data.name} en ${hostName}`,
               text: 'Registrar usuario',
               html: `<table style="font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:18px;margin:auto;background-color:#ebebeb;text-align:center" border="0" cellspacing="0" cellpadding="0" width="600"> <tbody> <tr style="line-height:0px"> <td style="line-height:0px" width="600" valign="bottom"> <img width="600" src="https://ci4.googleusercontent.com/proxy/khxBq-7bG5rA_M_YcEdqEK-YPAi_S07l36Nkae3PTcx4YW5Xi12IDXvGqXN8JtMnMxRrS_zJnREx7hF89W9e9zbULrPYACx-a1d2oi160ZhaKQ9Fz4hcOoQ=s0-d-e1-ft#https://www.valentina-db.com/media/com_hikashop/images/mail/header.png" border="0" alt="" class="CToWUd" data-bit="iit"> </td> </tr> <tr> <td width="600"> <table border="0" cellspacing="0" cellpadding="0" width="600" style="margin:0px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:18px"> <tbody> <tr> <td width="20"></td> <td style="color:#575757" width="560" height="25"></td> <td width="20"></td> </tr> <tr> <td width="20"></td> <td style="border:1px solid #adadad;background-color:#ffffff;text-align:left;padding:6px"> Hola,<br> Gracias por registrarse en <a href="${hostName}" target="_blank" data-saferedirecturl="https://www.google.com/url?q=${hostName}">${hostName}</a>.<br> Su cuenta debe ser activada haciendo clic en el siguiente enlace. A continuación, podrá continuar dar click al enlace. <br><br> <a href="${hostName}/users/validation/${data.salt}">${hostName}/<wbr>users/<wbr>validation/<wbr>${data.salt}</a> <br><br> <br> Username : <a href="mailto:${data.email}" target="_blank">${data.email}</a><br> <br> <br> Atentamente, <br>Devathon 04 </td> <td width="20"></td> </tr> </tbody> </table> </td> </tr> <tr style="line-height:0px"> <td style="line-height:0px" width="600" valign="top"> <img width="600" src="https://ci4.googleusercontent.com/proxy/wg85m4s6gCokDE73UzX_0BKa_ERZp2MmpB7GQIcmEkmXMniSJlDgxADZRWvFGvO8H4yiQVHDRrOyr3cyuOMzJfAZTAaO7x59rFJTVX0vFvu4zUKZmXvKPQ0=s0-d-e1-ft#https://www.valentina-db.com/media/com_hikashop/images/mail/footer.png" border="0" alt="--" class="CToWUd" data-bit="iit"> </td> </tr> </tbody> </table>`,
            }
            sgMail.send(msg)
            .then(() => {
               rps.msn = 'Se envio un correo de validación'
            })
            .catch((er: any) => {
               console.error(er)
               rps.code = 400
               rps.msn = 'Error al enviar correo de validacion'
            })
         }         
      }
      else {
         rta.status = true
         rps.code = 200
         rps.msn = user[0].status ? 'El usuario ya se registro' : 'Revice su correo para activar su cuenta'
      }
      rta.response = rps
      return reply.code(200).send(rta)
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
   let alluser = await findUserByEmail(body.email)
   
   const rta = { status: false, response: {}}
   const rsp = {code: 401, msn: '', accessToken: '', name: '', email: ''}
   if(!alluser.length) {
      rsp.msn = 'No existe email'
      rta.response = rsp
      return reply.code(401).send(rta)
   }
   else {
      //verificar pasword
      if(alluser[0].status) {
         rsp.msn = "Clave incorrecta"
         const correctPassword = verifyPassword({
            candidatePassword: body.password,
            salt: alluser[0]?.salt,
            hash: alluser[0]?.password
         })

         if(correctPassword) {
            const { password, salt, ...res} = alluser[0]
            const token = await reply.jwtSign(res)
            rta.status = true
            rsp.code = 200
            rsp.msn = "Datos correctos"
            rsp.accessToken = token
            rsp.name = res.name
            rsp.email = res.email
            rta.response = rsp
         }
      }
      else {
         rta.status = true
         rsp.msn = 'No activo email'
         rta.response = rsp
      }
   }
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

export async function setActivate(
   request: FastifyRequest<{
      Params: ActivateSchema
   }>,
   reply: FastifyReply
) {
   const activate = request.params

   const rta = { status: false, response: {}}
   const rsp = {code: 401, msn: ''}

   try {
      rta.status = true
      rsp.code = 201

      const user = await setActivateUser(activate)
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

export async function forgotYourPassword(
   request: FastifyRequest<{
      Body: EmailSchema
   }>,
   reply: FastifyReply
) {
   const infoemail = request.body
   const rta = { status: false, response: {}}
   const rsp = {code: 401, msn: ''}

   try {
      rta.status = true
      rsp.code = 201

      const user = await getUserUnique(infoemail)
      
      let msn = 'No existe usuario'
      if(user?.id) {
         msn = 'Activar cuenta'
         if(user?.status) {
            const msg = {
               to: user.email, // Change to your recipient
               from: 'j.eloy.cayetano.m@gmail.com', // Change to your verified sender
               subject: `Recuperar password ${user.name} en ${hostName}`,
               text: 'and easy to do anywhere, even with Node.js',
               html: `<table style="font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:18px;margin:auto;background-color:#ebebeb;text-align:center" border="0" cellspacing="0" cellpadding="0" width="600"> <tbody> <tr style="line-height:0px"> <td style="line-height:0px" width="600" valign="bottom"> <img width="600" src="https://ci4.googleusercontent.com/proxy/khxBq-7bG5rA_M_YcEdqEK-YPAi_S07l36Nkae3PTcx4YW5Xi12IDXvGqXN8JtMnMxRrS_zJnREx7hF89W9e9zbULrPYACx-a1d2oi160ZhaKQ9Fz4hcOoQ=s0-d-e1-ft#https://www.valentina-db.com/media/com_hikashop/images/mail/header.png" border="0" alt="" class="CToWUd" data-bit="iit"> </td> </tr> <tr> <td width="600"> <table border="0" cellspacing="0" cellpadding="0" width="600" style="margin:0px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:18px"> <tbody> <tr> <td width="20"></td> <td style="color:#575757" width="560" height="25"></td> <td width="20"></td> </tr> <tr> <td width="20"></td> <td style="border:1px solid #adadad;background-color:#ffffff;text-align:left;padding:6px"> Hola,<br> Solicito recuperar el password en <a href="${hostName}" target="_blank" data-saferedirecturl="https://www.google.com/url?q=${hostName}">${hostName}</a>.<br> Cambiar el password. A continuación, podrá continuar dar click al enlace. <br><br> <a href="${hostName}/users/cambiarpassword/${user.email}">${hostName}/<wbr>users/<wbr>cambiarpassword/<wbr>${user.email}</a> <br><br> <br> Username : <a href="mailto:${user.email}" target="_blank">${user.email}</a><br> <br> <br> Atentamente, <br>Devathon 04 </td> <td width="20"></td> </tr> </tbody> </table> </td> </tr> <tr style="line-height:0px"> <td style="line-height:0px" width="600" valign="top"> <img width="600" src="https://ci4.googleusercontent.com/proxy/wg85m4s6gCokDE73UzX_0BKa_ERZp2MmpB7GQIcmEkmXMniSJlDgxADZRWvFGvO8H4yiQVHDRrOyr3cyuOMzJfAZTAaO7x59rFJTVX0vFvu4zUKZmXvKPQ0=s0-d-e1-ft#https://www.valentina-db.com/media/com_hikashop/images/mail/footer.png" border="0" alt="--" class="CToWUd" data-bit="iit"> </td> </tr> </tbody> </table>`,
            }
            sgMail.send(msg)
            .then(() => {
               msn = 'Email enviado'
            })
            .catch((er: any) => {
               console.error(er)
            })
         }
      }

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