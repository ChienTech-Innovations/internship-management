"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { ReactNode, useEffect } from "react";
import Loading from "@/components/common/Loading";
import { useRouter } from "next/navigation";

type RoleGuardProps = {
  children: ReactNode;
  allowedRoles: string[];
};

export default function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const { userDetails, isAuthenticated, isHydrated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isHydrated && isAuthenticated && userDetails) {
      const userRole = userDetails.role.toLowerCase();
      if (
        window.location.pathname !== "/" &&
        !allowedRoles.includes(userRole)
      ) {
        router.replace("/error/access-denied?type=access-denied");
      }
    }
  }, [isHydrated, isAuthenticated, userDetails, allowedRoles, router]);

  if (!isHydrated || !isAuthenticated || !userDetails) {
    return <Loading />;
  }

  const userRole = userDetails.role.toLowerCase();
  if (!allowedRoles.includes(userRole)) {
    return null;
  }

  return <>{children}</>;
}
