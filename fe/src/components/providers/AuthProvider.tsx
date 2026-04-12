"use client";

import Loading from "@/components/common/Loading";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter, usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

type AuthProviderProps = {
  children: ReactNode;
};

const PUBLIC_ROUTES = ["/", "/login"];
const PUBLIC_ROUTE_PREFIXES = ["/export"];

export default function AuthProvider({ children }: AuthProviderProps) {
  const { isAuthenticated, isHydrated, setHydrated, userDetails } =
    useAuthStore();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setHydrated();
  }, [setHydrated]);

  useEffect(() => {
    if (isHydrated) {
      setIsLoading(false);

      const isPublicRoute =
        PUBLIC_ROUTES.includes(pathname) ||
        PUBLIC_ROUTE_PREFIXES.some(
          (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
        );

      if (!isAuthenticated && !isPublicRoute) {
        router.push("/login");
        return;
      }

      if (
        isAuthenticated &&
        userDetails &&
        pathname === "/" &&
        !window.history.state?.fromRedirect
      ) {
        /* empty */
      }
    }
  }, [isHydrated, isAuthenticated, userDetails, router, pathname]);

  if (isLoading) return <Loading />;
  return <>{children}</>;
}
