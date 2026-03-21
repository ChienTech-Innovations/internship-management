"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Search, Plus, Users } from "lucide-react";

import { User } from "@/types/user.type";
import { PageHeader } from "@/components/HeaderContent";

import { userServices } from "@/services/user.services";
import { UserStatsCard } from "@/components/roles/admin/Users/UserStatsCard";
import { UserTable } from "@/components/roles/admin/Users/UserTable";
import UserDialog from "@/components/roles/admin/Users/UserDialog";
import { useGetUserByPagination } from "@/hooks/useUser";
import { TableSkeleton } from "@/components/common/Skeleton";
import { useToastMessage } from "@/hooks/useToastMessage";
import { Pagination } from "@/components/common/Pagination";
import { sortByRole } from "@/lib/utils";

export default function UsersContent() {
  const { showToastSuccess, showToastError } = useToastMessage();
  const [searchName, setSearchName] = useState("");
  const [debouncedSearchName, setDebouncedSearchName] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
  const [dialogMode, setDialogMode] = useState<
    "CREATE" | "EDIT" | "DELETE" | "NONE"
  >("NONE");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { data, mutate, isLoading } = useGetUserByPagination({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: debouncedSearchName
  });

  const users = data?.data?.users;
  const total = data?.data?.total;

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setDebouncedSearchName(searchName);
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    }, 500);
    return () => clearTimeout(timeOut);
  }, [searchName]);

  const filteredUsers = useMemo(() => {
    if (!users || !Array.isArray(users)) return [];
    return users.filter((u: User) => {
      const matchesSearch = u.username
        .toLowerCase()
        .includes(debouncedSearchName.toLowerCase());
      const matchesRole = roleFilter === "all" || u.role === roleFilter;
      const matchesStatus = statusFilter === "all" || u.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, debouncedSearchName, roleFilter, statusFilter]);

  const sortUsers = sortByRole(filteredUsers, "role");

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
        const payload = rest.dob ? rest : { ...rest, dob: undefined };
        await userServices.createUsers(payload);
        showToastSuccess("User created successfully!");
      } else if (dialogMode === "EDIT" && selectedUser) {
        await userServices.updateUsersById(selectedUser.id, userData);
        showToastSuccess("User updated successfully!");
      }

      await mutate();
      handleCloseDialog();
    } catch (error) {
      console.error("Failed to submit user", error);
      showToastError("Failed to submit user");
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedUser) {
      try {
        await userServices.deleteUsers(selectedUser.id);
        showToastSuccess("User deleted successfully!");
        await mutate();
      } catch (error) {
        console.error("Failed to delete user", error);
        showToastError("Failed to delete user");
      }
    }
    handleCloseDialog();
  };

  if (isLoading && !data) {
    return (
      <>
        <PageHeader
          title="Users Management"
          description="Manage all users in the system."
          icon={<Users className="w-5 h-5" />}
        />
        <div className="space-y-6 py-4 px-4 sm:px-20">
          <TableSkeleton rows={6} cols={5} showToolbar />
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Users Management"
        description="Manage all users in the system."
        icon={<Users className="w-5 h-5" />}
      />
      <div className="space-y-6 py-4 px-4 sm:px-20">
        <UserStatsCard
          totalUsers={
            (total?.admin ?? 0) + (total?.intern ?? 0) + (total?.mentor ?? 0)
          }
          totalAdmins={total?.admin ?? 0}
          totalMentors={total?.mentor ?? 0}
          totalInterns={total?.intern ?? 0}
        />
        <Card className="p-5 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
          <div className="card-section-title mb-4">
            User List
          </div>
          <div className="flex items-center gap-4  mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                placeholder="Search users..."
                className="pl-10 search-input-enhanced"
              />
            </div>

            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value={"admin"}>Admin</SelectItem>
                <SelectItem value={"mentor"}>Mentor</SelectItem>
                <SelectItem value={"intern"}>Intern</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value={"active"}>Active</SelectItem>
                <SelectItem value={"inactive"}>Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={handleOpenCreate} className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-sm rounded-lg">
              <Plus className="w-4 h-4 mr-1" /> Add User
            </Button>
          </div>
          <UserTable
            users={sortUsers}
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
        <UserDialog
          dialogMode={dialogMode}
          selectedUser={selectedUser}
          onClose={handleCloseDialog}
          onDelete={handleConfirmDelete}
          onSubmit={handleSubmit}
        />
      </div>
    </>
  );
}
