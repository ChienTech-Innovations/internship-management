"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select";
import { User } from "@/types/user.type";
import { Eye, EyeOff } from "lucide-react";
import { InternStatus } from "@/types/intern.type";
import { DialogMode } from "@/constants";
import { formatDateForInput } from "@/lib/helper";

type Props = {
  initialData: User | null;
  onClose: () => void;
  onSubmit: (user: User) => void;
  fixedRole?: string;
  hideRoleSelect?: boolean;
  dialogMode: DialogMode;
};

const defaultInternInfo = {
  id: "",
  internId: "",
  field: "",
  mentorId: null,
  planId: null,
  startDate: "",
  endDate: "",
  status: "Onboarding" as InternStatus
};

export const UserForm = ({
  initialData,
  onClose,
  onSubmit,
  fixedRole,
  hideRoleSelect,
  dialogMode
}: Props) => {
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState<User>(() => {
    const data: User = initialData || {
      id: "",
      username: "",
      email: "",
      fullName: "",
      phoneNumber: "",
      password: "",
      role: fixedRole || "",
      dob: "",
      address: "",
      status: "active"
    };

    if ((fixedRole ?? data.role) === "intern") {
      return {
        ...data,
        internInformation: {
          ...defaultInternInfo,
          ...data.internInformation
        }
      };
    }

    return data;
  });

  const handleChange = <K extends keyof User>(key: K, value: User[K]) => {
    setForm((prev) => {
      const updated = { ...prev, [key]: value };

      if (key === "role") {
        if (value === "intern" && !prev.internInformation) {
          updated.internInformation = {
            ...defaultInternInfo,
            internId: prev.id
          };
        }
        if (value !== "intern" && prev.internInformation) {
          delete updated.internInformation;
        }
      }

      return updated;
    });
  };

  const handleInternInfoChange = <K extends keyof typeof defaultInternInfo>(
    key: K,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      internInformation: {
        ...(prev.internInformation ?? {
          ...defaultInternInfo,
          internId: prev.id
        }),
        [key]: value
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, role: fixedRole ?? form.role };

    if (payload.role !== "intern") {
      delete payload.internInformation;
    }

    onSubmit(payload);
  };

  const isIntern = (fixedRole ?? form.role) === "intern";
  const isCreate = !initialData;

  const RequiredLabel = ({
    children,
    required = false
  }: {
    children: React.ReactNode;
    required?: boolean;
  }) => (
    <Label>
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </Label>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <RequiredLabel required>Username</RequiredLabel>
          <Input
            value={form.username ?? ""}
            onChange={(e) => handleChange("username", e.target.value)}
            placeholder="Username"
            disabled={dialogMode === "EDIT"}
          />
        </div>

        <div>
          <RequiredLabel required>Email</RequiredLabel>
          <Input
            value={form.email ?? ""}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="Email"
          />
        </div>

        <div>
          <RequiredLabel required>Fullname</RequiredLabel>
          <Input
            value={form.fullName ?? ""}
            onChange={(e) => handleChange("fullName", e.target.value)}
            placeholder="Fullname"
          />
        </div>

        <div>
          <Label>Phone</Label>
          <Input
            value={form.phoneNumber ?? ""}
            onChange={(e) => handleChange("phoneNumber", e.target.value)}
            placeholder="Phone"
          />
        </div>

        <div className="relative">
          {dialogMode === "CREATE" ? (
            <RequiredLabel required>Password</RequiredLabel>
          ) : (
            <RequiredLabel>Password</RequiredLabel>
          )}
          <Input
            type={showPassword ? "text" : "password"}
            value={form.password ?? ""}
            onChange={(e) => handleChange("password", e.target.value)}
            placeholder="Password"
          />
          <button
            type="button"
            className="absolute right-2 top-8"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>

        {!hideRoleSelect && !fixedRole && (
          <div>
            <RequiredLabel required>Role</RequiredLabel>
            <Select
              value={form.role}
              onValueChange={(val) => handleChange("role", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="mentor">Mentor</SelectItem>
                <SelectItem value="intern">Intern</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {fixedRole && (
          <div>
            <RequiredLabel required>Role</RequiredLabel>
            <Input value={fixedRole} disabled />
          </div>
        )}

        <div>
          <Label>Date of Birth</Label>
          <Input
            type="date"
            value={formatDateForInput(form.dob)}
            onChange={(e) => handleChange("dob", e.target.value)}
          />
        </div>

        <div>
          <Label>Address</Label>
          <Input
            value={form.address ?? ""}
            onChange={(e) => handleChange("address", e.target.value)}
            placeholder="Address"
          />
        </div>

        <div>
          <RequiredLabel required>Status</RequiredLabel>
          <Select
            value={form.status}
            onValueChange={(val) => handleChange("status", val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isIntern && (
          <>
            <div>
              <RequiredLabel required>Field</RequiredLabel>
              <Input
                type="text"
                value={form.internInformation?.field ?? ""}
                onChange={(e) =>
                  handleInternInfoChange("field", e.target.value)
                }
              />
            </div>
            <div>
              <RequiredLabel required>Start Date</RequiredLabel>
              <Input
                type="date"
                value={formatDateForInput(form.internInformation?.startDate)}
                onChange={(e) =>
                  handleInternInfoChange("startDate", e.target.value)
                }
              />
            </div>
            <div>
              <RequiredLabel required>End Date</RequiredLabel>
              <Input
                type="date"
                value={formatDateForInput(form.internInformation?.endDate)}
                onChange={(e) =>
                  handleInternInfoChange("endDate", e.target.value)
                }
              />
            </div>
            <div>
              <RequiredLabel required>Intern Status</RequiredLabel>
              <Select
                value={form.internInformation?.status ?? "Onboarding"}
                onValueChange={(val) =>
                  handleInternInfoChange("status", val as InternStatus)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Intern Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Onboarding">Onboarding</SelectItem>
                  <SelectItem value="InProgress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">{isCreate ? "Create" : "Update"}</Button>
      </div>
    </form>
  );
};
