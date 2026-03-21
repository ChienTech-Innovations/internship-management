import { buildPagingUrlQuery } from "@/lib/helper";
import { useCustomSWR } from "@/lib/swr/useCustomSWR";
import { userServices } from "@/services/user.services";
import { PayloadGet } from "@/types/common.type";
import { useMemo } from "react";

export const useGetUsersById = (id: string) => {
  return useCustomSWR(`/users/${id}`);
};

export const useGetUserByPagination = (
  payload: PayloadGet<Record<string, never>>,
  role?: string
) => {
  const urlPayload = buildPagingUrlQuery(payload);
  const url = role
    ? `/users?role=${role}${urlPayload.replace("?", "&")}`
    : `/users${urlPayload}`;

  return useCustomSWR(url, () =>
    userServices.getUserByPagination(payload, role)
  );
};

export const useGetUsersAllByRole = (
  role?: string | null,
  showFetch: boolean = true
) => {
  const key = useMemo(() => {
    if (!showFetch) return null;
    return role ? `/users?role=${role}` : `/users`;
  }, [role, showFetch]);

  return useCustomSWR(
    key,
    () => userServices.getUsersAllByRole(role || undefined),
    { showError: true }
  );
};

export const useGetUsersProfile = () => {
  return useCustomSWR(`/users/profile`, () => userServices.getUsersProfile());
};
