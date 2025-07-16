export interface IUser {
  userId: string;
  email: string;
  password: string;
  name: {
    first: string;
    last: string;
  };
  createdAt?: Date;
}
