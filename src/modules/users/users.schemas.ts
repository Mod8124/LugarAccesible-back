import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';
// register
const bodyRegister = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string(),
});

const registerFailed = z.object({
  status: z.string(),
  msg: z.string(),
});

const registerSuccess = z.object({
  status: z.string(),
  msg: z.string(),
});

// login
const bodyLogin = z.object({
  email: z.string(),
  password: z.string(),
});

const loginSuccess = z.object({
  status: z.string(),
  data: z.object({
    // accesstoken: z.string(),
    name: z.string(),
    email: z.string(),
    avatar: z.string(),
  }),
});

// update
const bodyUpdate = z.object({
  name: z.string(),
  email: z.string(),
  avatar: z.string(),
});

const updateSuccess = z.object({
  status: z.string(),
  msg: z.string(),
  data: z.object({
    name: z.string(),
    email: z.string(),
    avatar: z.string(),
  }),
});

// update password
const bodyUpdatePassword = z.object({
  currentPassword: z.string(),
  newPassword: z.string(),
});

// verify
const paramsVerify = z.object({
  code: z.string(),
});

export const { schemas: userSchema, $ref } = buildJsonSchemas(
  {
    bodyRegister,
    registerFailed,
    registerSuccess,
    bodyLogin,
    loginSuccess,
    bodyUpdate,
    bodyUpdatePassword,
    updateSuccess,
    paramsVerify,
  },
  { $id: 'User_Schemas' },
);
