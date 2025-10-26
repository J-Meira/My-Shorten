export interface IUser {
  id: number;
  name: string;
  email: string;
  password: string;
}

export interface ISignInDTO2 {
  email: string;
  password: string;
}

export interface IUserDTO extends Omit<IUser, 'id'> {}

export interface ISignInDTO extends Omit<IUser, 'id' | 'name'> {}
