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

export interface IUpdatePassword {
  currentPassword: string;
  newPassword: string;
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
  const updatedUser = await User.update(id, object);
  return updatedUser;
};

export const updatePassword = async (id: string, object: IUpdatePassword) => {
  const updateUser = await User.updatePassword(id, object);
  return updateUser;
};

export const verify = async (confirmCode: string) => {
  const updateUser = await User.verify(confirmCode);
  return updateUser;
};
