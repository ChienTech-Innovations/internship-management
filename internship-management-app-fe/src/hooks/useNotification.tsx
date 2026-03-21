"use client";

import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "@/store/useAuthStore";
import { useNotificationStore } from "@/store/useNotificationStore";
import { notificationServices } from "@/services/notification.services";
import { useToastStore } from "@/store/useToastStore";
import { Notification } from "@/types/notification.type";
import { API_URL } from "@/constants";

export function useNotification() {
  const socketRef = useRef<Socket | null>(null);
  const { accessToken, isAuthenticated } = useAuthStore();
  const { addNotification, setNotifications, setUnreadCount } =
    useNotificationStore();
  const { showToastSuccess } = useToastStore();

  // Fetch initial notifications
  useEffect(() => {
    if (!isAuthenticated || !accessToken) return;

    const fetchNotifications = async () => {
      try {
        const res = await notificationServices.getNotifications();
        if (res.data) {
          setNotifications(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }

      try {
        const countRes = await notificationServices.getUnreadCount();
        if (countRes.data) {
          setUnreadCount(countRes.data.count);
        }
      } catch (error) {
        console.error("Failed to fetch unread count:", error);
      }
    };

    fetchNotifications();
  }, [isAuthenticated, accessToken, setNotifications, setUnreadCount]);

  // Socket.IO connection
  useEffect(() => {
    if (!isAuthenticated || !accessToken) return;

    const socket = io(API_URL, {
      auth: { token: accessToken },
      transports: ["websocket", "polling"]
    });

    socket.on("connect", () => {
      console.log("Socket.IO connected");
    });

    socket.on("notification", (notification: Notification) => {
      addNotification(notification);
      showToastSuccess(notification.message);
    });

    socket.on("disconnect", () => {
      console.log("Socket.IO disconnected");
    });

    socket.on("connect_error", (error) => {
      console.error("Socket.IO connection error:", error.message);
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [isAuthenticated, accessToken, addNotification, showToastSuccess]);

  return socketRef.current;
}
