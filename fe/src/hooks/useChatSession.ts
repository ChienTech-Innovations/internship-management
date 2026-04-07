"use client";

import { useState, useEffect, useCallback } from "react";
import { createChatSession, getChatSession } from "@/services/chat.services";
import { ChatSession } from "@/types/chat.type";

export function useChatSession(userId: string | undefined) {
  const [session, setSession] = useState<ChatSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getStorageKey = useCallback(() => {
    return userId ? `chatSessionId_${userId}` : null;
  }, [userId]);

  const initializeChat = useCallback(async () => {
    const storageKey = getStorageKey();
    if (!storageKey) return;

    try {
      setIsLoading(true);
      setError(null);

      const savedSessionId = localStorage.getItem(storageKey);

      if (savedSessionId) {
        try {
          const existingSession = await getChatSession(savedSessionId);
          if (existingSession.userId === userId) {
            setSession(existingSession);
            return;
          }
          localStorage.removeItem(storageKey);
        } catch {
          localStorage.removeItem(storageKey);
        }
      }

      const newSession = await createChatSession();
      localStorage.setItem(storageKey, newSession.id);
      setSession(newSession);
    } catch (err) {
      console.error("Lỗi khởi tạo chat:", err);
      setError("Không thể kết nối đến hệ thống chat. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  }, [getStorageKey, userId]);

  useEffect(() => {
    if (userId) {
      initializeChat();
    } else {
      setIsLoading(false);
    }
  }, [userId, initializeChat]);

  const startNewChat = useCallback(async () => {
    const storageKey = getStorageKey();
    if (storageKey) {
      localStorage.removeItem(storageKey);
    }
    setSession(null);
    await initializeChat();
  }, [getStorageKey, initializeChat]);

  return { session, isLoading, error, initializeChat, startNewChat };
}
