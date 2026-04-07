export type ResponseBase<TData> = {
  message?: string;
  success: boolean;
  data?: TData | null;
};

export type Config = {
  baseUrl?: string;
};

export type Option = {
  label: string;
  value: string;
  extra?: { [key: string]: string | number };
};
