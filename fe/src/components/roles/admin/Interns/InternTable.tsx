"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { User } from "@/types/user.type";
import { formatDateTime } from "@/lib/helper";
import { cn } from "@/lib/utils";

type Props = {
  interns: User[];
  pageSize: number;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
};

export const InternTable: React.FC<Props> = ({
  interns,
  pageSize,
  onEdit,
  onDelete
}) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-gradient-to-r from-slate-50 to-slate-100/80">
            <TableHead className="w-[150px] table-header">Full Name</TableHead>
            <TableHead className="w-[150px] table-header">Email</TableHead>
            <TableHead className="w-[150px] table-header">Field</TableHead>
            <TableHead className="w-[100px] text-center table-header">
              Phone
            </TableHead>
            <TableHead className="w-[100px] text-center table-header">
              Status
            </TableHead>
            <TableHead className="w-[100px] text-center table-header">
              Start
            </TableHead>
            <TableHead className="w-[100px] text-center table-header">
              End
            </TableHead>
            <TableHead className="w-[100px] text-center table-header">
              Mentor
            </TableHead>
            <TableHead className="w-[110px] text-center table-header">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {interns.map((i) => {
            const { internInformation } = i;
            return (
              <TableRow key={i.id} className="hover:bg-blue-50/50 transition-colors duration-150">
                <TableCell className="underline">
                  <Link href={`/admin/interns/${i.id}`}>
                    {i.fullName ?? ""}
                  </Link>
                </TableCell>
                <TableCell>{i.email}</TableCell>
                <TableCell>{internInformation?.field || "-"}</TableCell>
                <TableCell className="text-center">
                  {i.phoneNumber ?? "-"}
                </TableCell>
                <TableCell className="text-center">
                  <span
                    className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      i?.internInformation?.status === "Onboarding" &&
                        "bg-blue-100 text-blue-800",
                      i?.internInformation?.status === "InProgress" &&
                        "bg-yellow-100 text-yellow-800",
                      i?.internInformation?.status === "Completed" &&
                        "bg-green-100 text-green-800",
                      i?.internInformation?.status === "Dropped" &&
                        "bg-purple-100 text-purple-800",
                      !i?.internInformation?.status &&
                        "bg-gray-100 text-gray-800"
                    )}
                  >
                    {i.internInformation?.status || "N/A"}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  {internInformation?.startDate
                    ? formatDateTime(internInformation.startDate)
                    : "-"}
                </TableCell>
                <TableCell className="text-center">
                  {internInformation?.endDate
                    ? formatDateTime(internInformation.endDate)
                    : "-"}
                </TableCell>
                <TableCell className="text-center">
                  {i.isAssigned ? "Assigned" : "Unassigned"}
                </TableCell>
                <TableCell className="flex gap-2">
                  <div className="m-auto flex gap-1">
                    {" "}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(i)}
                      className="hover:bg-blue-100 rounded-lg transition-colors"
                    >
                      <Edit size={16} className="text-blue-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(i)}
                      className="hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} className="text-red-600" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
          {Array.from({ length: pageSize - interns.length }).map((_, index) => (
            <TableRow key={`empty-${index}`}>
              <TableCell colSpan={10} className="h-12" />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
