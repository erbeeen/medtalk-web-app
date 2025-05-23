export type UserType = {
  status?: string;
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  actions?: string;
};

export type AdminUserType = {
  status?: string;
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  actions?: string;
};
