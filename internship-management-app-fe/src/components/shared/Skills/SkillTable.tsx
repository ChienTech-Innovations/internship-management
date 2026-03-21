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
import { Skill } from "@/types/skill.type";
import Loading from "@/components/common/Loading";

interface SkillTableProps {
  isLoading: boolean;
  paginatedItems: Skill[];
  paginationPageSize: number;
  onEdit: (skill: Skill) => void;
  onDelete: (skill: Skill) => void;
}

export const SkillTable: React.FC<SkillTableProps> = ({
  isLoading,
  paginatedItems,
  onEdit,
  onDelete
}) => {
  if (isLoading) return <Loading />;

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-gradient-to-r from-slate-50 to-slate-100/80">
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedItems.length > 0 ? (
            paginatedItems.map((skill) => (
              <TableRow key={skill.id} className="hover:bg-blue-50/50 transition-colors duration-150">
                <TableCell className="font-medium text-gray-800">
                  {skill.name}
                </TableCell>
                <TableCell>{skill.description || "-"}</TableCell>
                <TableCell className="py-3 px-4 text-center">
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-blue-100 rounded-lg transition-colors"
                      onClick={() => onEdit(skill)}
                    >
                      <Edit size={16} className="text-blue-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-red-100 rounded-lg transition-colors"
                      onClick={() => onDelete(skill)}
                    >
                      <Trash2 size={16} className="text-red-600" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-6">
                No skills found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
