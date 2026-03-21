"use client";

import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "@/store/useAuthStore";
import { useNotificationStore } from "@/store/useNotificationStore";
import { notificationServices } from "@/services/notification.services";
import { useToastStore } from "@/store/useToastStore";
import { Notification } from "@/types/notification.type";
import { API_URL } from "@/constants";

/**
 * Provider giữ kết nối Socket.IO ở layout (protected) để socket không bị ngắt khi đổi trang.
 * Chỉ mount 1 lần khi vào khu vực protected → 1 socket duy nhất, nhận realtime đúng cách.
 */
export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { accessToken, isAuthenticated } = useAuthStore();
  const socketRef = useRef<Socket | null>(null);
  const tokenRef = useRef<string | null>(null);

  // Refs để tránh effect re-run khi store thay đổi → tránh disconnect/reconnect
  const addNotification = useNotificationStore((s) => s.addNotification);
  const setNotifications = useNotificationStore((s) => s.setNotifications);
  const setUnreadCount = useNotificationStore((s) => s.setUnreadCount);
  const showToastSuccess = useToastStore((s) => s.showToastSuccess);

  const addNotificationRef = useRef(addNotification);
  const showToastRef = useRef(showToastSuccess);
  addNotificationRef.current = addNotification;
  showToastRef.current = showToastSuccess;

  // Load danh sách + unread count khi đã đăng nhập
  useEffect(() => {
    if (!isAuthenticated || !accessToken) return;

    const load = async () => {
      try {
        const [res, countRes] = await Promise.all([
          notificationServices.getNotifications(),
          notificationServices.getUnreadCount(),
        ]);
        if (res?.data) setNotifications(res.data);
        if (countRes?.data != null && typeof countRes.data === "object" && "count" in countRes.data) {
          setUnreadCount((countRes.data as { count: number }).count);
        }
      } catch (e) {
        console.error("Failed to load notifications:", e);
      }
    };
    load();
  }, [isAuthenticated, accessToken, setNotifications, setUnreadCount]);

  // Một socket duy nhất: tạo khi có token, disconnect khi logout hoặc token đổi
  useEffect(() => {
    if (!isAuthenticated || !accessToken) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        tokenRef.current = null;
      }
      return;
    }

    // Đã có socket và cùng token → không tạo lại
    if (socketRef.current && tokenRef.current === accessToken) {
      return;
    }

    // Disconnect socket cũ nếu token đổi
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    const socket = io(API_URL, {
      auth: { token: accessToken },
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      console.log("[Notifications] Socket connected");
    });

    socket.on("notification", (payload: Notification) => {
      addNotificationRef.current(payload);
      showToastRef.current(payload.message);
    });

    socket.on("disconnect", (reason) => {
      console.log("[Notifications] Socket disconnected:", reason);
    });

    socket.on("connect_error", (err) => {
      console.error("[Notifications] Socket error:", err.message);
    });

    socketRef.current = socket;
    tokenRef.current = accessToken;

    return () => {
      socket.disconnect();
      socketRef.current = null;
      tokenRef.current = null;
    };
  }, [isAuthenticated, accessToken]);

  return <>{children}</>;
}
