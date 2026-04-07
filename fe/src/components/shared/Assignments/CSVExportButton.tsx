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
import { useAuthStore } from "@/store/useAuthStore";

import { Download } from "lucide-react";
import React, { useState } from "react";

import { Assignment } from "@/types/trainingPlan.type";
import { useGetInternInfoAllById } from "@/hooks/useIntern";
import { formatDateTime } from "@/lib/helper";

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (intern?: string | undefined) => void;
  assignments: Assignment[];
  selectedInternId: string;
  internList: Array<{
    id: string | undefined;
    userName: string;
    email: string;
  }>;
}

export const CSVExportButton = ({
  isOpen,
  onClose,
  assignments,
  internList
}: ExportDialogProps) => {
  const { userDetails } = useAuthStore();
  const [selectedIntern, setSelectedIntern] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isExporting, setIsExporting] = useState(false);

  const { data } = useGetInternInfoAllById(selectedIntern);
  const dataTrainingPlan = data?.data;
  const completed = dataTrainingPlan?.plan?.assignments?.reduce((acc, ass) => {
    if (ass.status === "Reviewed") acc++;
    return acc;
  }, 0);

  const convertToCSV = (data: Assignment[]) => {
    if (data.length === 0) return "";

    const infoLines = [
      ["Training Plan Name", dataTrainingPlan?.plan?.name || ""],
      ["Mentor", dataTrainingPlan?.mentor?.fullName || ""],
      ["Intern", dataTrainingPlan?.intern?.fullName || ""],
      [
        "Project Scope",
        dataTrainingPlan?.plan?.skills?.map((s) => s.skill?.name).join(", ") ||
          ""
      ],
      ["Status", dataTrainingPlan?.status || ""],
      [
        "Progress",
        (
          ((completed ?? 0) /
            (dataTrainingPlan?.plan?.assignments?.length || 1)) *
          100
        ).toFixed(2) + "%"
      ],
      ["Start Date", formatDateTime(dataTrainingPlan?.startDate || "") || ""],
      ["End Date", formatDateTime(dataTrainingPlan?.endDate || "") || ""],
      []
    ];

    const headers = ["Task Name", "Status", "Durations (hours)", "Skills"];

    const rows = data.map((assignment) => [
      assignment.task.name ?? "",
      assignment.status ?? "",
      String(assignment.estimatedTime ?? ""),
      assignment.skills.map((s) => s.skill.name).join(", ")
    ]);

    const csvContent = [...infoLines, headers, ...rows]
      .map((row) =>
        row
          .map((field) =>
            typeof field === "string" &&
            (field.includes(",") || field.includes("\n") || field.includes('"'))
              ? `"${field.replace(/"/g, '""')}"`
              : field
          )
          .join(",")
      )
      .join("\n");

    return csvContent;
  };

  const downloadCSV = () => {
    // Filter assignments based on selected intern
    let dataToExport = assignments;
    if (selectedIntern !== "all") {
      dataToExport = assignments.filter((a) => a.assignedTo === selectedIntern);
    }

    if (dataToExport.length === 0) {
      alert("No data to export!");
      return;
    }

    const csvContent = convertToCSV(dataToExport);
    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;"
    });
    const link = document.createElement("a");

    // Create filename based on selection
    const selectedInternName =
      selectedIntern === "all"
        ? "all-interns"
        : internList.find((i) => i.id === selectedIntern)?.userName ||
          "unknown";

    const filename = `assignments-${selectedInternName}-${
      new Date().toISOString().split("T")[0]
    }.csv`;

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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
                  {`${intern.userName} - (${intern.email})`}
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
        <Button
          variant="default"
          disabled={!selectedIntern || isExporting}
          onClick={() => {
            downloadCSV();
            onClose();
          }}
        >
          <Download className="mr-2 h-4 w-4" />{" "}
          {isExporting ? "Exporting..." : "Export"}
        </Button>
      </div>
    </DialogWrapper>
  );
};
