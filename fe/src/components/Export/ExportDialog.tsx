"use client";

import { DialogWrapper } from "@/components/common/DialogWrapper";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useGetInfoMentorDashboard } from "@/hooks/useDashboard";
import { useGetUsersAllByRole } from "@/hooks/useUser";
import { useAuthStore } from "@/store/useAuthStore";
import { useToastStore } from "@/store/useToastStore";

import { Download, Eye } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";

import { downloadTrainingPlanExport } from "@/hooks/useTrainingPlan";

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (intern?: string | undefined) => void;
}

export const ExportDialog = ({
  isOpen,
  onClose,
  onSubmit
}: ExportDialogProps) => {
  const { userDetails } = useAuthStore();
  const { showToastError, showToastSuccess } = useToastStore();
  const [selectedIntern, setSelectedIntern] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  const { data: mentorData } = useGetInfoMentorDashboard(
    userDetails?.role === "mentor"
  );
  const { data: adminData } = useGetUsersAllByRole(
    "intern",
    userDetails?.role === "admin"
  );

  const internList = useMemo(() => {
    if (!userDetails) return [];

    switch (userDetails.role) {
      case "intern":
        return [
          {
            id: userDetails.id,
            username: userDetails.name,
            email: userDetails.email
          }
        ];
      case "mentor":
        return (
          mentorData?.myInterns?.map((i) => ({
            id: i.internId,
            username: i.intern.username,
            email: i.intern.email
          })) ?? []
        );
      case "admin":
        return (
          adminData?.data?.users.map((u) => ({
            id: u.internInformation?.internId,
            username: u.username,
            email: u.email
          })) ?? []
        );
      default:
        return [];
    }
  }, [userDetails, mentorData, adminData]);

  useEffect(() => {
    if (userDetails?.role === "intern") {
      setSelectedIntern(userDetails.id);
    }
  }, [userDetails]);

  const handleView = () => {
    if (!selectedIntern) {
      showToastError("Please select an intern to view");
      return;
    }
    const url = `/export/${selectedIntern}`;
    window.open(url, "_blank", "noopener,noreferrer");
    onClose();
  };

  const handleExport = async () => {
    if (!selectedIntern) {
      showToastError("Please select an intern to export");
      return;
    }
    try {
      setIsExporting(true);
      const linkParam = `link=${encodeURIComponent(
        window.location.origin + "/export/" + selectedIntern
      )}`;
      const blob = await downloadTrainingPlanExport(selectedIntern, linkParam);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `training-plan-${selectedIntern}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      showToastSuccess("Exported training plan PDF");
      onClose();
    } catch (error) {
      showToastError((error as Error).message || "Failed to export PDF");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DialogWrapper
      isOpen={isOpen}
      onClose={onClose}
      title={
        <span className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Export Training Plan Report
        </span>
      }
    >
      {/* Select Intern */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Select Intern</label>
        </div>

        {userDetails?.role === "intern" ? (
          <input
            className="w-full opacity-80"
            value={`${userDetails.name} - (${userDetails.email})`}
            disabled
          />
        ) : (
          <Select value={selectedIntern} onValueChange={setSelectedIntern}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose an intern to export..." />
            </SelectTrigger>
            <SelectContent>
              {internList.map((intern) => (
                <SelectItem key={intern.id} value={intern.id || ""}>
                  {`${intern.username} - (${intern.email})`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        {onSubmit ? (
          ""
        ) : (
          <Button
            variant="secondary"
            disabled={!selectedIntern}
            onClick={handleView}
          >
            <Eye className="mr-2 h-4 w-4" /> View
          </Button>
        )}
        <Button
          variant="default"
          disabled={!selectedIntern || isExporting}
          onClick={() => {
            if (onSubmit) {
              onSubmit(selectedIntern);
              onClose();
            } else {
              handleExport();
              onClose();
            }
          }}
        >
          <Download className="mr-2 h-4 w-4" />{" "}
          {isExporting ? "Exporting..." : "Export"}
        </Button>
      </div>
    </DialogWrapper>
  );
};
