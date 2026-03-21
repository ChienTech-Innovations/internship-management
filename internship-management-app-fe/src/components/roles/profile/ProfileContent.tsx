"use client";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Calendar, Briefcase } from "lucide-react";
import { User } from "@/types/user.type";

import { useGetUsersProfile } from "@/hooks/useUser";
import UserDialog from "@/components/roles/admin/Users/UserDialog";
import { userServices } from "@/services/user.services";
import { formatDateTime } from "@/lib/helper";
import Loading from "@/components/common/Loading";

export default function ProfileContent() {
  const [dialogMode, setDialogMode] = useState<
    "CREATE" | "EDIT" | "DELETE" | "NONE"
  >("NONE");
  const [seletedUser, setSelectedUser] = useState<User | null>(null);
  const { data, mutate, isLoading } = useGetUsersProfile();
  const userProfile = data?.data;

  const handleSubmit = async (userData: User) => {
    try {
      await userServices.updateUsersProfile(userData);
      await mutate();
      handleCloseDialog();
    } catch (error) {
      console.error("Failed to submit user", error);
    }
  };

  const handleEdit = (user: User) => {
    setDialogMode("EDIT");
    setSelectedUser(user);
  };

  const handleCloseDialog = () => {
    setDialogMode("NONE");
    setSelectedUser(null);
  };

  const handleConfirmDelete = async () => {
    if (seletedUser) {
      try {
        await userServices.deleteUsers(seletedUser.id);
        await mutate();
      } catch (error) {
        console.error("Failed to delete user", error);
      }
    }
    handleCloseDialog();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-4">
      {/* Basic Info - Gradient Header */}
      <Card className="rounded-xl overflow-hidden border-slate-200/80 shadow-sm">
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-28 relative" />
        <CardHeader className="flex flex-col items-center text-center space-y-2 p-4 -mt-14">
          <Avatar className="w-24 h-24 ring-4 ring-white shadow-lg">
            <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-blue-100 to-cyan-100 text-blue-700">
              {userProfile?.fullName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              {userProfile?.fullName}
            </CardTitle>
            <CardDescription className="text-sm text-gray-500">
              @{userProfile?.username}
            </CardDescription>
          </div>
          <div className="flex gap-2 mt-1">
            <Badge
              variant="outline"
              className={`capitalize ${
                userProfile?.role === "admin"
                  ? "bg-amber-100 text-amber-700 border-amber-300"
                  : userProfile?.role === "mentor"
                  ? "bg-emerald-100 text-emerald-700 border-emerald-300"
                  : "bg-blue-100 text-blue-700 border-blue-300"
              }`}
            >
              {userProfile?.role}
            </Badge>
            <Badge
              variant="outline"
              className={`capitalize ${
                userProfile?.status === "active"
                  ? "bg-emerald-100 text-emerald-700 border-emerald-300"
                  : "bg-gray-100 text-gray-600 border-gray-300"
              }`}
            >
              {userProfile?.status}
            </Badge>
          </div>
          <div className="mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (userProfile) handleEdit(userProfile);
              }}
              className="rounded-lg hover:bg-blue-50 transition-colors"
            >
              Edit Profile
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Contact Info */}
      <Card className="rounded-xl border-slate-200/80 hover:shadow-md transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-base font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-gray-700">
          <div className="flex gap-3 items-center">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
              <Mail className="w-4 h-4 text-blue-600" />
            </div>
            <span className="font-medium w-28">Email: </span>
            <span>{userProfile?.email}</span>
          </div>
          <div className="flex gap-3 items-center">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
              <Phone className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="font-medium w-28">Phone Number:</span>
            <span> {userProfile?.phoneNumber || "-"}</span>
          </div>
          <div className="flex gap-3 items-center">
            <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4 text-orange-600" />
            </div>
            <span className="font-medium w-28">Address:</span>
            <span> {userProfile?.address || "-"}</span>
          </div>
        </CardContent>
      </Card>

      {/* Personal Info */}
      <Card className="rounded-xl border-slate-200/80 hover:shadow-md transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-base font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Personal Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-gray-700">
          <div className="flex gap-3 items-center">
            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4 text-purple-600" />
            </div>
            <span className="font-medium w-28">Date of Birth:</span>
            <span>{formatDateTime(userProfile?.dob || "")}</span>
          </div>
        </CardContent>
      </Card>

      {userProfile?.role === "intern" && (
        <Card className="rounded-xl border-slate-200/80 hover:shadow-md transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-base font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Internship Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-100 flex items-center justify-center shrink-0">
                <Briefcase className="w-4 h-4 text-cyan-600" />
              </div>
              <span className="font-medium w-28">Field:</span>
              <span>{userProfile?.internInformation?.field || "-"}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="font-medium w-28">Start Date:</span>
              <span>
                {formatDateTime(
                  userProfile?.internInformation?.startDate || ""
                ) || "-"}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4 text-rose-600" />
              </div>
              <span className="font-medium w-28">End Date:</span>
              <span>
                {formatDateTime(
                  userProfile?.internInformation?.endDate || ""
                ) || "-"}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Account Status */}
      <Card className="rounded-xl border-slate-200/80 hover:shadow-md transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-base font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Account Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <span className="font-medium w-24">Assigned:</span>
            {userProfile?.isAssigned ? (
              <Badge className="bg-blue-100 text-blue-800 border border-blue-300">
                Yes
              </Badge>
            ) : (
              <Badge className="bg-gray-100 text-gray-600 border border-gray-300">
                No
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      <UserDialog
        dialogMode={dialogMode}
        selectedUser={userProfile ?? null}
        onClose={handleCloseDialog}
        onDelete={handleConfirmDelete}
        onSubmit={handleSubmit}
      />
      {isLoading && !userProfile && <Loading />}
    </div>
  );
}
