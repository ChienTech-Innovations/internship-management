"use client";

import { DialogWrapper } from "@/components/common/DialogWrapper";
import { UserForm } from "@/components/roles/admin/Users/UserForm";
import { Button } from "@/components/ui/button";
import { DIALOG_MODES, DialogMode } from "@/constants";
import { User } from "@/types/user.type";

interface Props {
  dialogMode: DialogMode;
  selectedUser: User | null;
  onClose: () => void;
  onDelete: () => void;
  onSubmit: (data: User) => void;
}

export default function UserDialog({
  dialogMode,
  selectedUser,
  onClose,
  onDelete,
  onSubmit
}: Props) {
  const isCreate = dialogMode === DIALOG_MODES.CREATE;
  const isEdit = dialogMode === DIALOG_MODES.EDIT;
  const isDelete = dialogMode === DIALOG_MODES.DELETE;

  return (
    <>
      {/* CREATE */}
      {isCreate && (
        <DialogWrapper isOpen onClose={onClose} title="Create User">
          <UserForm
            initialData={null}
            onClose={onClose}
            onSubmit={onSubmit}
            dialogMode={dialogMode}
          />
        </DialogWrapper>
      )}

      {/* EDIT */}
      {isEdit && (
        <DialogWrapper isOpen onClose={onClose} title="Edit User">
          <UserForm
            initialData={selectedUser}
            onClose={onClose}
            onSubmit={onSubmit}
            dialogMode={dialogMode}
          />
        </DialogWrapper>
      )}

      {/* DELETE */}
      {isDelete && (
        <DialogWrapper isOpen onClose={onClose} title="Comfirm Delete">
          <p>Are you sure you want to delete user{""}</p>
          <b>{selectedUser?.fullName}</b>?
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={onDelete}>
              Delete
            </Button>
          </div>
        </DialogWrapper>
      )}
    </>
  );
}
