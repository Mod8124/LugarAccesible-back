import mongoose, { model, Model } from 'mongoose';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import validator from 'validator';
const schema = mongoose.Schema;

export interface IUserSchema {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  password: string;
  isConfirm: boolean;
  confirmCode: string | null;
}

export interface UserModel extends Model<IUserSchema> {
  register(user: { name: string; email: string; password: string }): IUserSchema;
  login(user: { email: string; password: string }): IUserSchema;
  verify(confirmCode: string): IUserSchema;
  update(
    id: string,
    user: {
      email: string;
      name: string;
      avatar: string;
      password?: string;
      newPassword?: string;
    },
  ): IUserSchema;
  updatePassword(id: string, user: { currentPassword: string; newPassword: string }): IUserSchema;
}

const userSchema = new schema<IUserSchema, UserModel>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isConfirm: {
    type: Boolean,
    required: false,
    default: false,
  },
  confirmCode: {
    type: String,
    required: false,
  },
  avatar: {
    type: String,
    required: true,
  },
});

const validatePassword = (password: string) => {
  // validation password
  if (password.length < 6) {
    throw new Error('La contraseña debe ser al menos de 6 caracteres');
  }

  if (!/\d/.test(password)) {
    throw new Error('La contraseña debe tener un numero');
  }

  if (!/[A-Z]/.test(password)) {
    throw new Error('La contraseña debe tener al menos una mayuscula');
  }

  if (
    !validator.isStrongPassword(password, {
      minLength: 6,
      minUppercase: 1,
      minSymbols: 0,
    })
  ) {
    throw new Error('La contraseña no es fuerte');
  }
};

userSchema.statics.register = async function ({ name, email, password }) {
  // validation
  if (!email && !password) {
    throw Error('Email & Contraseña debe ser rellenados');
  } else if (!email || !password) {
    const fieldName = !email ? 'Email' : 'Contraseña';
    throw Error(`${fieldName} debe ser rellenado`);
  }

  // validation email
  if (!validator.isEmail(email)) {
    throw Error('El email no es valido');
  }

  validatePassword(password);

  const exists = await this.findOne({ email });

  if (exists) {
    throw Error('El email ya esta en uso');
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const imgavatar = `https://ui-avatars.com/api/?name=${name}&background=002966&rounded=true&color=fff`;

  const cryptoToken = crypto.randomBytes(18).toString('hex');

  const user = await this.create({
    name,
    email,
    password: hash,
    avatar: imgavatar,
    confirmCode: cryptoToken,
  });

  return user;
};

userSchema.statics.login = async function ({ email, password }) {
  // validation
  if (!email && !password) {
    throw Error('Email & Contraseña son requeridos');
  } else if (!email || !password) {
    const fieldName = !email ? 'Email' : 'Contraseña';
    throw Error(`${fieldName} es requerido`);
  }

  // validation email
  if (!validator.isEmail(email)) {
    throw Error('El email no es valido');
  }

  const user = await this.findOne({ email });
  if (!user) {
    throw Error('El email es incorrecto');
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw Error('La contraseña es incorrecta');
  }

  return user;
};

userSchema.statics.verify = async function (confirmCode: string) {
  const exists = await this.findOne({ confirmCode });

  if (!exists) throw new Error('El codigo de confirmacion no existe');

  exists.confirmCode = null;
  exists.isConfirm = true;

  const user = await exists.save();

  return user;
};

userSchema.statics.update = async function (id, { email, name, avatar, password, newPassword }) {
  if (!validator.isEmail(email)) throw Error('El email no es valido');
  if (!name) throw Error(`name debe ser rellenado`);

  const user = await this.findById({ _id: id });

  if (!user) throw Error('El usuario no existe');

  if (user?.email !== email) {
    const exists = await this.findOne({ email });

    if (exists) throw Error('El email ya esta en uso');
    const cryptoToken = crypto.randomBytes(18).toString('hex');
    user.isConfirm = false;
    user.confirmCode = cryptoToken;
  }

  user.name = name;
  user.email = email;
  user.avatar = avatar;

  const updateUser = await user.save();

  return updateUser;
};

userSchema.statics.updatePassword = async function (id, { currentPassword, newPassword }) {
  const user = await this.findById({ _id: id });

  if (!user) throw Error('El usuario no existe');

  if (!currentPassword) throw Error('Debes proporcionar la contraseña actual ');

  if (!newPassword) throw Error('Debes proporcionar la contraseña nueva');

  // Validate the old password
  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

  if (!isPasswordValid) throw Error('Contraseña actual equivocada');

  // check if is strong
  validatePassword(newPassword);

  // Generate a new password hash
  const newPasswordHash = await bcrypt.hash(newPassword, 10);
  user.password = newPasswordHash;

  const updateUser = await user.save();

  return updateUser;
};

const User = model<IUserSchema, UserModel>('User', userSchema);

export default User;
