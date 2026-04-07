import { get, post } from "./api.services";
import { ChatSession, SendMessageResponse } from "@/types/chat.type";

/**
 * Tạo phiên chat mới
 */
export const createChatSession = async (): Promise<ChatSession> => {
  const response = await post<ChatSession>("/chat/session", {});
  return response.data!;
};

/**
 * Lấy danh sách phiên chat của user
 */
export const getUserSessions = async (): Promise<ChatSession[]> => {
  const response = await get<ChatSession[]>("/chat/sessions");
  return response.data!;
};

/**
 * Lấy thông tin phiên chat kèm tin nhắn
 */
export const getChatSession = async (sessionId: string): Promise<ChatSession> => {
  const response = await get<ChatSession>(`/chat/session/${sessionId}`);
  return response.data!;
};

/**
 * Gửi tin nhắn và nhận phản hồi
 */
export const sendMessage = async (
  sessionId: string,
  content: string
): Promise<SendMessageResponse> => {
  const response = await post<SendMessageResponse>("/chat/message", {
    sessionId,
    content
  });
  return response.data!;
};
