export type FormData = {
  email: string;
  password: string;
};

export type LoginResponse = {
  ok: boolean;
  token: string;
};