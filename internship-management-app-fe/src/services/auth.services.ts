import { post, requestData } from "@/services/api.services";
import { LoginPayload, ResponseToken } from "@/types/auth.type";

export const authServices = {
  login: (payload: LoginPayload) => {
    return requestData(post<ResponseToken>("/auth/login", payload));
  },
  logout: () => {
    return fetch("/auth/logout", {
      method: "POST",
      credentials: "include"
    });
  }
};
