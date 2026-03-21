"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const ExportPage = () => {
  const { userDetails } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (userDetails?.role === "intern" && userDetails?.id) {
      router.push(`/export/${userDetails.id}`);
    }
  }, [userDetails, router]);

  if (userDetails?.role !== "intern") {
    return (
      <div className="w-[60vw] text-center m-auto mt-5">
        <div className="bg-blue-50 border border-blue-200 rounded-md p-8">
          <h2 className="text-2xl font-semibold text-blue-800 mb-4">
            Export Training Plan Report
          </h2>
          <p className="text-blue-600 mb-4">
            Please use the export dialog from the dashboard to select an intern
            and generate their training plan report.
          </p>
          <p className="text-sm text-blue-500">
            This page is only accessible for interns or when selecting a
            specific intern through the export dialog.
          </p>
        </div>
      </div>
    );
  }

  // Loading state
  return (
    <div className="w-[60vw] text-center m-auto mt-5">
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
      <p className="mt-4 text-gray-600">Redirecting to your report...</p>
    </div>
  );
};

export default ExportPage;
