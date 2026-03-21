import { buildPagingUrlQuery } from "@/lib/helper";
import { del, get, post, put } from "@/services/api.services";
import { PayloadGet } from "@/types/common.type";
import {
  Skill,
  SkillRequestPayload,
  SkillsListResponse
} from "@/types/skill.type";

export const skillServices = {
  getSkillUser: () => {
    return get<SkillsListResponse>("/skills?limit=1000");
  },
  getSkillUserByPagination: (payload: PayloadGet<Record<string, never>>) => {
    const urlPayload = buildPagingUrlQuery(payload);
    return get<SkillsListResponse>(`/skills${urlPayload}`);
  },
  getSkillAll: () => {
    return get<SkillsListResponse>("/skills/all");
  },
  getSkillAllByPagination: (payload: PayloadGet<Record<string, never>>) => {
    const urlPayload = buildPagingUrlQuery(payload);
    return get<SkillsListResponse>(`/skills/all${urlPayload}`);
  },
  getSkillById: (id: string) => {
    return get<Skill>(`/skills/${id}`);
  },
  createSkill: (payload: SkillRequestPayload) => {
    return post<Skill>("/skills", payload);
  },
  updateSkill: (id: string, payload: SkillRequestPayload) => {
    return put(`/skills/${id}`, payload);
  },
  deleteSkill: (id: string) => {
    return del(`/skills/${id}`);
  },
  restoreSkill: (id: string) => {
    return put(`skills/${id}/restore`);
  }
};
