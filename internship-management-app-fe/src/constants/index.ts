// Backend URL (REST + WebSocket). Cần trỏ đúng server Nest (vd: http://localhost:4000) để thông báo realtime hoạt động.
export const API_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

export const DIALOG_MODES = {
  CREATE: "CREATE",
  EDIT: "EDIT",
  DELETE: "DELETE",
  NONE: "NONE"
} as const;

export type DialogMode = keyof typeof DIALOG_MODES;
