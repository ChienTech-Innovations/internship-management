import { DialogWrapper } from "@/components/common/DialogWrapper";
import { UserForm } from "@/components/roles/admin/Users/UserForm";
import { Button } from "@/components/ui/button";
import { DIALOG_MODES, DialogMode } from "@/constants";
import { User } from "@/types/user.type";

type Props = {
  dialogMode: DialogMode;
  selectedMentor: User | null;
  onClose: () => void;
  onSubmit: (data: User) => void;
  onDelete: () => void;
};

export default function MentorDialog({
  dialogMode,
  selectedMentor,
  onClose,
  onSubmit,
  onDelete
}: Props) {
  const isCreate = dialogMode === DIALOG_MODES.CREATE;
  const isEdit = dialogMode === DIALOG_MODES.EDIT;
  const isDelete = dialogMode === DIALOG_MODES.DELETE;

  return (
    <>
      {isCreate && (
        <DialogWrapper isOpen onClose={onClose} title="Create Mentor">
          <UserForm
            initialData={null}
            fixedRole={"mentor"}
            onClose={onClose}
            onSubmit={onSubmit}
            dialogMode={dialogMode}
          />
        </DialogWrapper>
      )}

      {isEdit && (
        <DialogWrapper isOpen onClose={onClose} title="Edit Mentor">
          <UserForm
            initialData={selectedMentor}
            fixedRole={"mentor"}
            onClose={onClose}
            onSubmit={onSubmit}
            dialogMode={dialogMode}
          />
        </DialogWrapper>
      )}

      {isDelete && (
        <DialogWrapper isOpen onClose={onClose} title="Confirm Delete">
          <p>
            Are you sure you want to delete mentor{" "}
            <b>{selectedMentor?.fullName}</b>?
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
