export type UserType = {
  status?: string;
  _id?: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  verified?: boolean;
  actions?: string;
};

export type AdminUserType = {
  status?: string;
  _id?: string;
  role: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  verified?: boolean;
  actions?: string;
};
