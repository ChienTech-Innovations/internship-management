import { buildPagingUrlQuery } from "@/lib/helper";
import { useCustomSWR } from "@/lib/swr/useCustomSWR";
import { skillServices } from "@/services/skill.services";
import { PayloadGet } from "@/types/common.type";
import { Skill } from "@/types/skill.type";

export const useGetSkillUser = () => {
  return useCustomSWR<Skill[]>(
    "/skills",
    async () => (await skillServices.getSkillUser()).data?.skills ?? []
  );
};

export const useGetSkillUserByPagination = (
  payload: PayloadGet<Record<string, never>>
) => {
  const urlPayload = buildPagingUrlQuery(payload);
  return useCustomSWR(`/skills${urlPayload}`, () =>
    skillServices.getSkillUserByPagination(payload)
  );
};

export const useGetSkillAll = () => {
  return useCustomSWR<Skill[]>(
    "/skills/all",
    async () => (await skillServices.getSkillAll()).data?.skills ?? []
  );
};

export const useGetSkillAllByPagination = (
  payload: PayloadGet<Record<string, never>>
) => {
  const urlPayload = buildPagingUrlQuery(payload);
  return useCustomSWR(`/skills/all${urlPayload}`, () =>
    skillServices.getSkillAllByPagination(payload)
  );
};
export const useGetSkillById = (id: string) => {
  return useCustomSWR<Skill>(`/skills/${id}`);
};
