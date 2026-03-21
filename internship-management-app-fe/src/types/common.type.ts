export type PayloadGet<T> = {
  page: number;
  limit: number;
  search?: string;
  filter?: T;
};
