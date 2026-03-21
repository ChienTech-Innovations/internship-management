"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, BookOpen } from "lucide-react";
import { Pagination } from "@/components/common/Pagination";
import { PageHeader } from "@/components/HeaderContent";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { FormProvider, useForm } from "react-hook-form";
import { useAuthStore } from "@/store/useAuthStore";
import { TableSkeleton } from "@/components/common/Skeleton";
import { Skill, SkillRequestPayload } from "@/types/skill.type";
import {
  useGetSkillAllByPagination,
  useGetSkillUserByPagination
} from "@/hooks/useSkill";
import { skillServices } from "@/services/skill.services";

import { useToastMessage } from "@/hooks/useToastMessage";
import { SkillTable } from "@/components/shared/Skills/SkillTable";
import { SkillForm } from "@/components/shared/Skills/SkillForm";

export default function SkillContent() {
  const { userDetails } = useAuthStore();
  const { showToastSuccess, showToastError } = useToastMessage();

  const [searchSkillName, setSearchSkillName] = useState("");
  const [debouncedSearchSkillName, setDebouncedSearchSkillName] = useState("");
  const [paginationSkill, setPaginationSkill] = useState({
    pageIndex: 0,
    pageSize: 5
  });

  const allHookResult = useGetSkillAllByPagination({
    page: paginationSkill.pageIndex + 1,
    limit: paginationSkill.pageSize,
    search: debouncedSearchSkillName
  });

  const userHookResult = useGetSkillUserByPagination({
    page: paginationSkill.pageIndex + 1,
    limit: paginationSkill.pageSize,
    search: debouncedSearchSkillName
  });

  const isAdmin = userDetails?.role === "admin";
  const source = isAdmin ? allHookResult : userHookResult;

  const skills: Skill[] = source.data?.data?.skills || [];
  const skillPagination = source.data?.data?.pagination;
  const isSkillLoading = source.isLoading;
  const mutateSkill = source.mutate;

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setDebouncedSearchSkillName(searchSkillName);
      setPaginationSkill((prev) => ({ ...prev, pageIndex: 0 }));
    }, 500);
    return () => clearTimeout(timeOut);
  }, [searchSkillName]);

  const methodsSkill = useForm<SkillRequestPayload>({
    defaultValues: { name: "", description: "" }
  });

  const [dialogSkill, setDialogSkill] = useState<{
    open: boolean;
    mode: "add" | "edit";
    entity: Skill | null;
  }>({ open: false, mode: "add", entity: null });

  const [confirmDeleteSkill, setConfirmDeleteSkill] = useState<Skill | null>(
    null
  );

  const openSkillDialog = (
    mode: "add" | "edit",
    entity: Skill | null = null
  ) => {
    if (mode === "edit" && entity) {
      methodsSkill.setValue("name", entity.name);
      methodsSkill.setValue("description", entity.description ?? "");
    } else {
      methodsSkill.reset();
    }
    setDialogSkill({ open: true, mode, entity });
  };

  const submitSkill = async (payload: SkillRequestPayload) => {
    try {
      if (dialogSkill.mode === "edit" && dialogSkill.entity) {
        await skillServices.updateSkill(dialogSkill.entity.id, payload);
        showToastSuccess("Skill updated successfully!");
      } else {
        await skillServices.createSkill(payload);
        showToastSuccess("Skill created successfully!");
      }
      await mutateSkill();
      setDialogSkill({ open: false, mode: "add", entity: null });
    } catch (error) {
      console.error("Failed to submit skill:", error);
      showToastError("Failed to submit skill");
    }
  };

  const deleteSkill = async () => {
    if (confirmDeleteSkill) {
      try {
        await skillServices.deleteSkill(confirmDeleteSkill.id);
        await mutateSkill();
        showToastSuccess("Skill deleted successfully!");
      } catch (error) {
        console.error("Failed to delete skill:", error);
        showToastError("Failed to delete skill");
      }
    }
    setConfirmDeleteSkill(null);
  };

  if (isSkillLoading && !source.data) {
    return (
      <>
        <PageHeader
          title="Skills Management"
          description="Manage all skills"
          icon={<BookOpen className="w-5 h-5" />}
        />
        <div className="py-4 px-4 sm:px-24">
          <TableSkeleton rows={5} cols={4} showToolbar />
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Skills Management"
        description="Manage all skills"
        icon={<BookOpen className="w-5 h-5" />}
      />
      <div className="py-4 px-4 sm:px-24">
        <Card className="p-5 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
          <div className="card-section-title mb-4">
            Skills List
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={searchSkillName}
                onChange={(e) => setSearchSkillName(e.target.value)}
                placeholder="Search skills..."
                className="pl-10 search-input-enhanced"
              />
            </div>
            <Button onClick={() => openSkillDialog("add")} className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-sm rounded-lg">
              <Plus size={16} className="w-4 h-4 mr-1" /> Add Skill
            </Button>
          </div>
          <SkillTable
            isLoading={isSkillLoading}
            paginatedItems={skills}
            paginationPageSize={paginationSkill.pageSize}
            onEdit={(skill) => openSkillDialog("edit", skill)}
            onDelete={(skill) => setConfirmDeleteSkill(skill)}
          />

          <Pagination
            pageIndex={paginationSkill.pageIndex}
            pageCount={skillPagination?.totalPages ?? 1}
            pageSize={paginationSkill.pageSize}
            onPageChange={(i) =>
              setPaginationSkill((prev) => ({ ...prev, pageIndex: i }))
            }
            onPageSizeChange={(size) =>
              setPaginationSkill({ pageIndex: 0, pageSize: size })
            }
          />
        </Card>

        <FormProvider {...methodsSkill}>
          <SkillForm
            isOpen={dialogSkill.open}
            onClose={() =>
              setDialogSkill({ open: false, mode: "add", entity: null })
            }
            title={dialogSkill.mode === "edit" ? "Edit Skill" : "Add Skill"}
            description={
              dialogSkill.mode === "edit"
                ? "Update skill information"
                : "Add a new skill"
            }
            isEditing={dialogSkill.mode === "edit"}
            onSubmit={submitSkill}
          />
        </FormProvider>
        <ConfirmDialog
          isOpen={!!confirmDeleteSkill}
          title="Confirm Delete"
          description={`Are you sure you want to delete "${confirmDeleteSkill?.name}"?`}
          onCancel={() => setConfirmDeleteSkill(null)}
          onConfirm={deleteSkill}
        />
      </div>
    </>
  );
}
