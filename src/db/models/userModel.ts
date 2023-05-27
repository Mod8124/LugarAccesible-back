import mongoose, { model, Model } from 'mongoose';
const schema = mongoose.Schema;
import bcrypt from 'bcrypt';
import validator from 'validator';

export interface IUserSchema {
  _id: string;
  name: string;
  isConfirm: boolean;
  email: string;
  avatar: string;
  password: string;
}

export interface UserModel extends Model<IUserSchema> {
  register(user: { name: string; email: string; password: string }): IUserSchema;
  login(user: { email: string; password: string }): IUserSchema;
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
  avatar: {
    type: String,
    required: true,
  },
});

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

  const exists = await this.findOne({ email });

  if (exists) {
    throw Error('El email ya esta en uso');
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const imgavatar = `https://ui-avatars.com/api/?name=${name}&background=002966&rounded=true&color=fff`;

  const user = await this.create({ name, email, password: hash, avatar: imgavatar });

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

const User = model<IUserSchema, UserModel>('User', userSchema);

export default User;
