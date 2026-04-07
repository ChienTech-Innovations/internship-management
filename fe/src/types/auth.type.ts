export type LoginPayload = {
  username: string;
  password: string;
};

export type ResponseToken = {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
};
