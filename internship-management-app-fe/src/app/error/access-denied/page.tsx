"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";

export default function AccessDenied() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { userDetails } = useAuthStore();
  const errorType = searchParams.get("type");

  const handleGoBack = () => {
    if (userDetails?.role) {
      switch (userDetails.role.toLowerCase()) {
        case "admin":
          router.push("/admin/dashboard");
          break;
        case "mentor":
          router.push("/mentor/dashboard");
          break;
        case "intern":
          router.push("/intern/dashboard");
          break;
        default:
          router.push("/");
      }
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-red-600 mb-4">
          {errorType === "404" ? "Page Not Found" : "Access Denied"}
        </h1>
        <p className="text-gray-600 mb-6">
          {errorType === "404"
            ? "The page you are looking for does not exist."
            : "You do not have permission to access this page."}
        </p>
        <Button onClick={handleGoBack} className="bg-blue-600 text-white">
          Go Back to Dashboard
        </Button>
      </div>
    </div>
  );
}
