"use client";

import Navbar from "@/components/common/Navbar";
import SideBar from "@/components/common/Sidebar";
import ChatWidget from "@/components/chat/ChatWidget";
import { useAuthStore } from "@/store/useAuthStore";
import { NotificationProvider } from "@/components/Notification/NotificationProvider";

export default function ProtectedLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const { userDetails } = useAuthStore();
  const role = userDetails?.role?.toLowerCase();

  return (
    <NotificationProvider>
      <div className="flex h-screen overflow-hidden">
        <SideBar role={role} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />
          <div className="flex-1 overflow-y-auto bg-[url(/bg.webp)]">
            {children}
          </div>
        </div>
      </div>
      <ChatWidget />
    </NotificationProvider>
  );
}
