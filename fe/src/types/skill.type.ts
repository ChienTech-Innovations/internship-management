export type Skill = {
  id: string;
  name: string;
  description?: string;
  createdBy: string;
};

export type SkillRequestPayload = {
  name: string;
  description: string;
};

export type SkillsListResponse = {
  skills: Skill[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
};
