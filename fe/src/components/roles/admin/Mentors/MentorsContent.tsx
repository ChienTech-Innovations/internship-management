"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select";
import { Search, Plus, Users } from "lucide-react";
import { Pagination } from "@/components/common/Pagination";
import { PageHeader } from "@/components/HeaderContent";

import { User } from "@/types/user.type";
import { MentorStatsCard } from "@/components/roles/admin/Mentors/MentorStatsCard";
import { MentorTable } from "@/components/roles/admin/Mentors/MentorTable";
import MentorDialog from "@/components/roles/admin/Mentors/MentorDialog";
import { useGetUserByPagination } from "@/hooks/useUser";
import { userServices } from "@/services/user.services";
import Loading from "@/components/common/Loading";
import { useToastMessage } from "@/hooks/useToastMessage";

export default function MentorsContent() {
  const { showToastSuccess, showToastError } = useToastMessage();
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
  const [searchName, setSearchName] = useState("");
  const [debouncedSearchName, setDebouncedSearchName] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dialogMode, setDialogMode] = useState<
    "CREATE" | "EDIT" | "DELETE" | "NONE"
  >("NONE");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { data, mutate, isLoading } = useGetUserByPagination(
    {
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      search: debouncedSearchName
    },
    "mentor"
  );
  const users = data?.data?.users;
  const total = data?.data?.total;

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearchName(searchName);
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchName]);

  // const filtered = useMemo(() => {
  //   if (!users || !Array.isArray(users)) return [];
  //   return users.filter((m) => {
  //     const matchSearch = m.fullName
  //       ?.toLowerCase()
  //       .includes(debouncedSearchName.toLowerCase());
  //     const matchStatus =
  //       statusFilter === "all" ||
  //       (statusFilter === "assigned" && m.isAssigned) ||
  //       (statusFilter === "unassigned" && !m.isAssigned);
  //     return matchSearch && matchStatus;
  //   });
  // }, [users, debouncedSearchName, statusFilter]);

  const handleOpenCreate = () => {
    setDialogMode("CREATE");
    setSelectedUser(null);
  };

  const handleOpenEdit = (user: User) => {
    setDialogMode("EDIT");
    setSelectedUser(user);
  };

  const handleDelete = (user: User) => {
    setDialogMode("DELETE");
    setSelectedUser(user);
  };

  const handleCloseDialog = () => {
    setDialogMode("NONE");
    setSelectedUser(null);
  };

  const handleSubmit = async (userData: User) => {
    try {
      if (dialogMode === "CREATE") {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...rest } = userData;
        await userServices.createUsers(rest);
        showToastSuccess("Mentor created successfully!");
      } else if (dialogMode === "EDIT" && selectedUser) {
        await userServices.updateUsersById(selectedUser.id, userData);
        showToastSuccess("Mentor updated successfully!");
      }
      await mutate();
      handleCloseDialog();
    } catch (error) {
      console.error("Failed to submit mentor", error);
      showToastError("Failed to submit mentor");
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedUser) {
      try {
        await userServices.deleteUsers(selectedUser.id);
        await mutate();
        showToastSuccess("Mentor deleted successfully!");
      } catch (error) {
        console.error("Failed to delete user", error);
        showToastError("Failed to delete mentor");
      }
    }
    handleCloseDialog();
  };
  return (
    <>
      <PageHeader
        title="Mentors Management"
        description="Manage mentors."
        icon={<Users className="w-5 h-5" />}
      />
      <div className="space-y-6 py-4 px-4 sm:px-20">
        <MentorStatsCard
          totalMentor={total?.mentor ?? 0}
          totalAssigned={total?.isAssigned ?? 0}
          totalUnssigned={(total?.mentor ?? 0) - (total?.isAssigned ?? 0)}
        />

        <Card className="p-5 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
          <div className="card-section-title mb-4">
            Mentors List
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                placeholder="Search mentors..."
                className="pl-10 search-input-enhanced"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="unassigned">Unassigned</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleOpenCreate} className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-sm rounded-lg">
              <Plus className="w-4 h-4 mr-1" /> Add Mentor
            </Button>
          </div>
          <MentorTable
            mentors={users ?? []}
            pageSize={pagination.pageSize}
            onEdit={handleOpenEdit}
            onDelete={handleDelete}
          />

          <Pagination
            pageIndex={pagination.pageIndex}
            pageCount={data?.data?.pagination.totalPages ?? 0}
            pageSize={pagination.pageSize}
            onPageChange={(i) =>
              setPagination((prev) => ({ ...prev, pageIndex: i }))
            }
            onPageSizeChange={(size) =>
              setPagination({ pageIndex: 0, pageSize: size })
            }
          />
        </Card>

        <MentorDialog
          dialogMode={dialogMode}
          selectedMentor={selectedUser}
          onClose={handleCloseDialog}
          onSubmit={handleSubmit}
          onDelete={handleConfirmDelete}
        />
      </div>
      {isLoading && !data && <Loading />}
    </>
  );
}
