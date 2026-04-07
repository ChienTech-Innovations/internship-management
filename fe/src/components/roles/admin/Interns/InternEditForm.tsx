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
import { User, internProfile } from "@/types/user.type";
import { InternStatus } from "@/types/intern.type";
import { formatDateForInput } from "@/lib/helper";
import { DialogMode } from "@/constants";

type Props = {
  initialData: User | null;
  onClose: () => void;
  onSubmit: (data: User) => void;
  dialogMode: DialogMode;
};

const defaultInternInformation: internProfile = {
  id: "",
  field: "",
  internId: "",
  mentorId: null,
  planId: null,
  startDate: "",
  endDate: "",
  status: "Onboarding"
};

const defaultUserForm: User = {
  id: "",
  email: "",
  username: "",
  password: "",
  fullName: "",
  phoneNumber: "",
  dob: "",
  address: "",
  role: "intern",
  status: "active",
  isAssigned: false,
  internInformation: { ...defaultInternInformation }
};

export default function InternEditForm({
  initialData,
  onSubmit,
  onClose,
  dialogMode
}: Props) {
  const [form, setForm] = useState<Partial<User>>(() => ({
    ...defaultUserForm,
    ...initialData,
    password: initialData ? "" : defaultUserForm.password,
    internInformation: {
      ...defaultInternInformation,
      ...initialData?.internInformation
    }
  }));

  const handleChange = <K extends keyof User>(key: K, value: User[K]) => {
    setForm((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const handleInternInfoChange = <K extends keyof internProfile>(
    key: K,
    value: internProfile[K]
  ) => {
    setForm((prev) => ({
      ...prev,
      internInformation: {
        ...(prev.internInformation ?? {
          ...defaultInternInformation,
          internId: prev.id ?? ""
        }),
        [key]: value
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let formToSubmit = { ...form };

    if (initialData && !form.password) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...rest } = formToSubmit;
      formToSubmit = rest;
    }

    onSubmit(formToSubmit as User);
  };

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
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <RequiredLabel required={dialogMode === "CREATE"}>
            Username
          </RequiredLabel>
          <Input
            value={form.username}
            onChange={(e) => handleChange("username", e.target.value)}
            disabled={dialogMode === "EDIT"}
          />
        </div>
        <div>
          <RequiredLabel required={dialogMode === "CREATE"}>
            Email
          </RequiredLabel>
          <Input
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
        </div>
        <div>
          <RequiredLabel required={dialogMode === "CREATE"}>
            Full Name
          </RequiredLabel>
          <Input
            value={form.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
          />
        </div>
        <div>
          <Label>Phone</Label>
          <Input
            value={form.phoneNumber ?? ""}
            onChange={(e) => handleChange("phoneNumber", e.target.value)}
          />
        </div>
        <div>
          <RequiredLabel required={dialogMode === "CREATE"}>
            Password
          </RequiredLabel>
          <Input
            type="password"
            placeholder={
              initialData
                ? "Leave empty to keep current password"
                : "Enter password"
            }
            value={form.password}
            onChange={(e) => handleChange("password", e.target.value)}
          />
        </div>
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
          />
        </div>
        <div>
          <RequiredLabel required={dialogMode === "CREATE"}>
            Status
          </RequiredLabel>
          <Select
            value={form.internInformation?.status ?? "Onboarding"}
            onValueChange={(val) =>
              handleInternInfoChange("status", val as InternStatus)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Onboarding">Onboarding</SelectItem>
              <SelectItem value="InProgress">In Progress</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Dropped">Dropped</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <RequiredLabel required={dialogMode === "CREATE"}>
            Field
          </RequiredLabel>
          <Input
            value={form.internInformation?.field ?? ""}
            onChange={(e) => handleInternInfoChange("field", e.target.value)}
          />
        </div>
        <div>
          <RequiredLabel required={dialogMode === "CREATE"}>
            Start Date
          </RequiredLabel>
          <Input
            type="date"
            value={formatDateForInput(form.internInformation?.startDate)}
            onChange={(e) =>
              handleInternInfoChange("startDate", e.target.value)
            }
          />
        </div>
        <div>
          <RequiredLabel required={dialogMode === "CREATE"}>
            End Date
          </RequiredLabel>
          <Input
            type="date"
            value={formatDateForInput(form.internInformation?.endDate)}
            onChange={(e) => handleInternInfoChange("endDate", e.target.value)}
          />
        </div>
        <div>
          <RequiredLabel required={dialogMode === "CREATE"}>Role</RequiredLabel>
          <Input value="Intern" disabled />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">{initialData ? "Update" : "Create"}</Button>
      </div>
    </form>
  );
}
