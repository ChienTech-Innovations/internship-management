import { buildPagingUrlQuery } from "@/lib/helper";
import { del, get, post, put } from "@/services/api.services";
import { PayloadGet } from "@/types/common.type";
import { User, userRequestPayload } from "@/types/user.type";

export type UserAllPayload = {
  users: User[];
  total: {
    admin: number;
    completedIntern: number;
    intern: number;
    isAssigned: number;
    mentor: number;
  };
};

export type UserAllPayloadPagi = UserAllPayload & {
  pagination: {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
  };
};

export const userServices = {
  getUsersById: (id: string) => {
    return get<User>(`/users/${id}`);
  },
  getUserByPagination: (
    payload: PayloadGet<Record<string, never>>,
    role?: string
  ) => {
    const urlPayload = buildPagingUrlQuery(payload);
    const url = role
      ? `/users?role=${role}${urlPayload.replace("?", "&")}`
      : `/users${urlPayload}`;

    return get<UserAllPayloadPagi>(url);
  },
  getUsersAllByRole: (role?: string) => {
    const url = role ? `/users?role=${role}` : "/users";
    return get<UserAllPayload>(url);
  },
  getUsersProfile: () => {
    return get<User>("/users/profile");
  },
  createUsers: (payload: userRequestPayload) => {
    return post<userRequestPayload>("/users", payload);
  },
  updateUsersProfile: (payload: User) => {
    return put(`/users/profile`, payload);
  },
  updateUsersById: (id: string, payload: User) => {
    return put(`/users/${id}`, payload);
  },
  deleteUsers: (id: string) => {
    return del(`/users/${id}`);
  }
};
