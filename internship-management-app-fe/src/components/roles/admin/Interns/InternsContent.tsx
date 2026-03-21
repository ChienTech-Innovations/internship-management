"use client";

import React, { useEffect, useState } from "react";
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
import { Plus, Search, Users } from "lucide-react";
import { Pagination } from "@/components/common/Pagination";

import { PageHeader } from "@/components/HeaderContent";

import { InternTable } from "@/components/roles/admin/Interns/InternTable";
import InternDialog from "@/components/roles/admin/Interns/InternDialog";
import { useGetUserByPagination } from "@/hooks/useUser";
import { User } from "@/types/user.type";
import { userServices } from "@/services/user.services";
import { InternStatsCard } from "@/components/roles/admin/Interns/InternStatsCard";
import Loading from "@/components/common/Loading";
import { useToastMessage } from "@/hooks/useToastMessage";

export default function InternsContent() {
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
    "intern"
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
  //   return users.filter((i) => {
  //     const matchSearch = i.fullName
  //       ?.toLowerCase()
  //       .includes(debouncedSearch.toLowerCase());
  //     const matchStatus =
  //       statusFilter === "all" ||
  //       (statusFilter === "assigned" && i.isAssigned) ||
  //       (statusFilter === "unassigned" && !i.isAssigned);
  //     return matchSearch && matchStatus;
  //   });
  // }, [users, debouncedSearch, statusFilter]);

  const handleAdd = () => {
    setDialogMode("CREATE");
    setSelectedUser(null);
  };

  const handleEdit = (user: User) => {
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
        const payload = rest.dob ? rest : { ...rest, dob: undefined };
        await userServices.createUsers(payload);
        showToastSuccess("Intern created successfully!");
      } else if (dialogMode === "EDIT" && selectedUser) {
        await userServices.updateUsersById(selectedUser.id, userData);
        showToastSuccess("Intern updated successfully!");
      }
      await mutate();
      handleCloseDialog();
    } catch (error) {
      console.error("Failed to submit intern", error);
      showToastError("Failed to submit intern");
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedUser) {
      try {
        await userServices.deleteUsers(selectedUser.id);
        await mutate();
        showToastSuccess("Intern deleted successfully!");
      } catch (error) {
        console.error("Failed to delete intern", error);
        showToastError("Failed to delete intern");
      }
    }
    handleCloseDialog();
  };

  return (
    <div className="relative">
      {/* Nội dung chính luôn được render */}
      <PageHeader
        title="Interns Management"
        description="Manage all interns in the system."
        icon={<Users className="w-5 h-5" />}
      />
      <div className="space-y-6 py-4 px-4 sm:px-20">
        <InternStatsCard
          totalInterns={total?.intern ?? 0}
          assignedInterns={total?.isAssigned ?? 0}
          unassignedInterns={(total?.intern ?? 0) - (total?.isAssigned ?? 0)}
        />

        <Card className="p-5 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
          <div className="card-section-title mb-4">
            Interns List
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                placeholder="Search interns..."
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
            <Button onClick={handleAdd} className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-sm rounded-lg">
              <Plus className="w-4 h-4 mr-1" /> Add Intern
            </Button>
          </div>
          <InternTable
            interns={users ?? []}
            pageSize={pagination.pageSize}
            onEdit={handleEdit}
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

        <InternDialog
          dialogMode={dialogMode}
          selectedIntern={selectedUser}
          onClose={handleCloseDialog}
          onDelete={handleConfirmDelete}
          onSubmit={handleSubmit}
        />
      </div>

      {isLoading && !data && <Loading />}
    </div>
  );
}
