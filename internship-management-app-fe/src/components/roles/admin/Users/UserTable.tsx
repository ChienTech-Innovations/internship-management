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
import { User } from "@/types/user.type";
import { cn } from "@/lib/utils";
import { formatDateTime } from "@/lib/helper";

type Props = {
  users: User[];
  pageSize: number;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
};

export const UserTable: React.FC<Props> = ({
  users,
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
            <TableHead className="w-[150px] table-header">Username</TableHead>
            <TableHead className="w-[200px] table-header">Email</TableHead>
            <TableHead className="w-[100px] text-center table-header">
              Role
            </TableHead>
            <TableHead className="w-[200px] table-header">Field</TableHead>
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
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} className="hover:bg-blue-50/50 transition-colors duration-150">
              <TableCell className="underline">{user.fullName}</TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell className="text-center">
                <span
                  className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium",
                    user.role === "admin" && "bg-amber-100 text-amber-800",
                    user.role === "mentor" && "bg-green-100 text-green-800",
                    user.role === "intern" && "bg-blue-100 text-blue-800"
                  )}
                >
                  {user.role}
                </span>
              </TableCell>
              <TableCell>
                {user.role === "intern" && user.internInformation?.field
                  ? user.internInformation.field
                  : "-"}
              </TableCell>
              <TableCell className="text-center">
                <span
                  className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium",
                    user.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  )}
                >
                  {user.status}
                </span>
              </TableCell>
              <TableCell className="text-center">
                {user.role === "intern" && user.internInformation?.startDate
                  ? formatDateTime(user.internInformation.startDate)
                  : "-"}
              </TableCell>
              <TableCell className="text-center">
                {user.role === "intern" && user.internInformation?.endDate
                  ? formatDateTime(user.internInformation.endDate)
                  : "-"}
              </TableCell>
              <TableCell className="flex gap-2">
                <div className="m-auto flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(user)}
                    className="hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <Edit size={16} className="text-blue-600" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(user)}
                    className="hover:bg-red-100 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} className="text-red-600" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {Array.from({ length: pageSize - users.length }).map((_, index) => (
            <TableRow key={`empty-${index}`}>
              <TableCell colSpan={10} className="h-12" />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
