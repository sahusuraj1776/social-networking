export type AuthUser = {
  id:number;
  email:string;
  gender:string|null;
  city:string|null
  name:string;
  profession:string|null;
  profileUrl:string|null;
  role:string|null;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export const AUTH_TOKEN_KEY = 'auth_token';
export const AUTH_USER_KEY = 'auth_user';