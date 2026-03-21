"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  LogOut,
  UserCheck,
  User,
  BadgeCheck,
  ClipboardList,
  ListTodo,
  UserSearch,
  UserCog,
  X,
  ClipboardCheck,
  CalendarCheck,
  FileText
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useSidebarStore } from "@/store/useSidebarStore";
import Image from "next/image";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const SidebarMenu = {
  admin: [
    { name: "Dashboard", href: "/admin/dashboard", icon: BarChart3 },
    { name: "Users List", href: "/admin/users", icon: UserSearch },
    { name: "Mentors List", href: "/admin/mentors", icon: UserCheck },
    { name: "Interns List", href: "/admin/interns", icon: User },
    { name: "Attendance", href: "/admin/attendance", icon: CalendarCheck },
    { name: "Reports Attendance", href: "/admin/reports", icon: FileText },
    { name: "Tasks", href: "/tasks", icon: ClipboardCheck },
    { name: "Skills", href: "/skills", icon: BadgeCheck },
    { name: "Training Plans", href: "/training-plans", icon: ListTodo },
    { name: "Profile", href: "/profile", icon: UserCog }
  ],
  mentor: [
    { name: "Dashboard", href: "/mentor/dashboard", icon: BarChart3 },
    { name: "Attendance", href: "/mentor/attendance", icon: CalendarCheck },
    { name: "Reports Attendance", href: "/mentor/reports", icon: FileText },
    { name: "Tasks", href: "/tasks", icon: ClipboardCheck },
    { name: "Skills", href: "/skills", icon: BadgeCheck },
    { name: "Training Plans", href: "/training-plans", icon: ListTodo },
    { name: "Assignments", href: "/assignments", icon: ClipboardList },
    { name: "Profile", href: "/profile", icon: UserCog }
  ],
  intern: [
    { name: "Dashboard", href: "/intern/dashboard", icon: BarChart3 },
    { name: "Attendance", href: "/intern/attendance", icon: CalendarCheck },
    { name: "Profile", href: "/profile", icon: UserCog }
  ]
};

interface SideBarProps {
  role?: string;
}

const SideBar: React.FC<SideBarProps> = ({ role }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { isOpen, close } = useSidebarStore();
  const menu =
    SidebarMenu[role as keyof typeof SidebarMenu] || SidebarMenu.admin;
  const { userDetails, logout } = useAuthStore();
  const isMobile = useMediaQuery("(max-width: 639px)");

  return (
    <div
      className={cn(
        "relative flex flex-col h-screen border-r text-white border-gray-200 transition-all duration-500 ease-in-out bg-[linear-gradient(180deg,#0573fd_-29.94%,#1eb2ff_99.28%)] backdrop-blur-sm overflow-hidden",
        isOpen
          ? isMobile
            ? "w-full opacity-100"
            : "w-64 opacity-100"
          : "w-0 opacity-0"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2 gap-2">
          <Image
            src="/tma.webp"
            width={200}
            height={200}
            alt="Picture of the app"
            className="w-[80px] h-[30px]"
          />
          <div className="text-xl font-bold">
            <h1>InternHub</h1>
            <span className="text-[12px] mt-1 font-medium bg-gray-200 text-black rounded-full py-1 px-2">
              {userDetails?.role}
            </span>
          </div>
          {isMobile ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={close}
              className="p-2 hover:bg-gray-100 rounded-lg absolute top-2 right-2 "
            >
              <X />
            </Button>
          ) : (
            <></>
          )}
        </div>
      </div>

      {/* Sidebar Menu */}
      <div className="flex-1 p-4 space-y-2">
        {menu.map((menu) => {
          const Icon = menu.icon;
          const isActive = pathname === menu.href;
          return (
            <Link key={menu.name} href={menu.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start transition-all duration-200 px-4",
                  isActive &&
                    "shadow-sm [background:linear-gradient(270deg,rgba(82,182,255,0.5),transparent)]"
                )}
              >
                <Icon className="w-5 h-5 mr-3" />
                <span>{menu.name}</span>
              </Button>
            </Link>
          );
        })}
      </div>

      <div className="border-t border-gray-200 p-4">
        <div
          className="flex items-center space-x-3 rounded-lg hover:bg-accent hover:text-accent-foreground hover:cursor-pointer transition-colors p-2"
          onClick={() => router.push("/profile")}
        >
          <Avatar className="w-8 h-8">
            <AvatarImage src="" />
            <AvatarFallback className="bg-blue-300 border">
              {userDetails?.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{userDetails?.name}</p>
            <p className="text-sm truncate">{userDetails?.email}</p>
          </div>
        </div>
        <div className="mt-3 space-y-1">
          <Button
            variant="ghost"
            size="lg"
            className="w-full justify-start"
            onClick={logout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
