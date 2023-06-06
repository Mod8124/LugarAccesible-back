import nodemailer from 'nodemailer';
import { HOST, EMAIL_ACCOUNT, EMAIL_PASSWORD } from '../../config';

const Transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_ACCOUNT,
    pass: EMAIL_PASSWORD,
  },
});

export const sendVerificationMail = async (user: {
  name: string;
  email: string;
  confirmCode: string;
}) => {
  const mailOptions = {
    from: EMAIL_ACCOUNT,
    to: user.email,
    subject: 'Enlace de verificación de cuenta',
    html: `<article style="">
      <h1>LugarAccesible</h1>
      <h3 style="color:#637083">
        Bienvenido <strong>${user.name}</strong> a LugarAccesible, Por favor verifique su cuenta haciendo click
      <a href="${HOST}/auth/validation/${user.confirmCode}">Aqui</a>
      </h3>
    </article>`,
  };

  return await Transporter.sendMail(mailOptions);
};

export const sendVerificationChangeMail = async (user: {
  name: string;
  email: string;
  confirmCode: string;
}) => {
  const mailOptions = {
    from: EMAIL_ACCOUNT,
    to: user.email,
    subject: 'Enlace de verificación de cuenta',
    html: `<article style="">
      <h1>LugarAccesible</h1>
     <h3 style="color:#637083">
       Hola <strong>${user.name}</strong>,
       Has solicitado cambiar tu correo electrónico en LugarAccesible.
       Por favor verifique su cuenta haciendo click
       <a href="${HOST}/auth/validation/${user.confirmCode}">aquí</a>.
    </h3>
    </article>`,
  };

  return await Transporter.sendMail(mailOptions);
};
