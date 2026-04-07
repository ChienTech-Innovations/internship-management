"use client";

import { DialogWrapper } from "@/components/common/DialogWrapper";
import InternEditForm from "@/components/roles/admin/Interns/InternEditForm";

import { Button } from "@/components/ui/button";
import { DIALOG_MODES, DialogMode } from "@/constants";
import { User } from "@/types/user.type";

interface Props {
  dialogMode: DialogMode;
  selectedIntern: User | null;
  onClose: () => void;
  onSubmit: (data: User) => void;
  onDelete: () => void;
}

export default function InternDialog({
  dialogMode,
  selectedIntern,
  onClose,
  onSubmit,
  onDelete
}: Props) {
  const isCreate = dialogMode === DIALOG_MODES.CREATE;
  const isEdit = dialogMode === DIALOG_MODES.EDIT;
  const isDelete = dialogMode === DIALOG_MODES.DELETE;

  return (
    <>
      {/* CREATE */}
      {isCreate && (
        <DialogWrapper isOpen onClose={onClose} title="Create Intern">
          <InternEditForm
            initialData={null}
            onClose={onClose}
            onSubmit={onSubmit}
            dialogMode={dialogMode}
          />
        </DialogWrapper>
      )}

      {/* EDIT */}
      {isEdit && (
        <DialogWrapper isOpen onClose={onClose} title="Edit Intern">
          <InternEditForm
            initialData={selectedIntern}
            onClose={onClose}
            onSubmit={onSubmit}
            dialogMode={dialogMode}
          />
        </DialogWrapper>
      )}

      {/* DELETE CONFIRM */}
      {isDelete && (
        <DialogWrapper isOpen onClose={onClose} title="Confirm Delete">
          <p>
            Are you sure you want to delete intern{" "}
            <b>{selectedIntern?.fullName}</b>?
          </p>
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
