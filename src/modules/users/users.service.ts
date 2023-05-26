import User from '../../db/models/userModel';
export interface IUser {
  name: string;
  email: string;
  password: string;
}

export type TLoginUser = Omit<IUser, 'name'>;

export interface IUpdate {
  [key: string]: string;
  name: string;
  email: string;
  avatar: string;
}

export const register = async (object: IUser) => {
  const user = User.register(object);
  return user;
};

export const login = async (object: TLoginUser) => {
  const user = User.login(object);
  return user;
};

export const update = async (id: string, object: IUpdate) => {
  const updatedUser = await User.findByIdAndUpdate(id, object, { new: true });
  return updatedUser;
};
