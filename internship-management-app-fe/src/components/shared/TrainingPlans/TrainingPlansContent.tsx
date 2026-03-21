"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Plus, BookOpen, Search } from "lucide-react";
import { PageHeader } from "@/components/HeaderContent";
import { useFilter } from "@/hooks/useFilter";
import { TrainingPlanDetailModal } from "@/components/shared/TrainingPlans/TrainingPlanDetail/TrainingPlanDetailModal";
import { AssignTrainingPlanForm } from "@/components/shared/TrainingPlans/AssignTrainingPlanForm";
import {
  TrainingPlan,
  TrainingPlanRequestPayload
} from "@/types/trainingPlan.type";
import TrainingPlanUnassigned from "@/components/shared/TrainingPlans/TrainingPlanUnassigned";
import { Separator } from "@/components/ui/separator";
import { useGetUsersAllByRole } from "@/hooks/useUser";
import {
  useGetTrainingPlanUser,
  useGetTrainingPlanWithInterns
} from "@/hooks/useTrainingPlan";
import { trainingPlanServices } from "@/services/trainingPlan.services";
import { TrainingPlanAssigned } from "@/components/shared/TrainingPlans/TrainingPlanAssigned";
import { useGetSkillUser } from "@/hooks/useSkill";
import { useGetTaskUser } from "@/hooks/useTask";
import TrainingPlanDialog from "@/components/shared/TrainingPlans/TrainingPlanForm/TrainingPlanDialog";
import { DIALOG_MODES, DialogMode } from "@/constants";
import { useToastStore } from "@/store/useToastStore";
import { useAuthStore } from "@/store/useAuthStore";
import Loading from "@/components/common/Loading";

export default function TrainingPlansContent() {
  const [dialogMode, setDialogMode] = useState<DialogMode>(DIALOG_MODES.NONE);
  const [selectedPlan, setSelectedPlan] = useState<TrainingPlan | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [detailPlan, setDetailPlan] = useState<TrainingPlan | null>(null);
  const [sourceType, setSourceType] = useState<"assigned" | "unassigned">(
    "assigned"
  );
  const { userDetails } = useAuthStore();

  const { showToastSuccess, showToastError } = useToastStore();

  const { data: dataIntern } = useGetUsersAllByRole("intern");
  const interns = dataIntern?.data?.users;
  const {
    data: dataTrainingPlan,
    mutate: mutateTrainingPlan,
    isLoading
  } = useGetTrainingPlanUser();
  const { data: assignedMap, mutate: mutateAssignedMap } =
    useGetTrainingPlanWithInterns();

  const { data: skills } = useGetSkillUser();
  const { data: tasks } = useGetTaskUser();

  const {
    filtered: filteredPlans,
    term: filterTerm,
    setTerm: setFilterTerm
  } = useFilter<TrainingPlan>(
    Array.isArray(dataTrainingPlan?.data) ? dataTrainingPlan?.data : [],
    "",
    (p, s) => p.name.toLowerCase().includes(s.toLowerCase())
  );

  const handleSubmit = async (data: TrainingPlanRequestPayload) => {
    try {
      setIsSubmitting(true);
      if (selectedPlan) {
        await trainingPlanServices.updateTrainingPlan(selectedPlan.id, data);
        showToastSuccess("Training plan updated successfully");
      } else {
        await trainingPlanServices.createTrainingPlan(data);
        showToastSuccess("Training plan created successfully");
      }
      await mutateTrainingPlan();
      mutateAssignedMap();
      handleCloseDialog();
    } catch (error) {
      console.error("Failed to save training plan", error);
      showToastError("Failed to save training plan");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTrainingPlan = async (planId: string) => {
    try {
      await trainingPlanServices.deleteTrainingPlan(planId);
      showToastSuccess("Training plan deleted successfully");
      await mutateTrainingPlan();
      mutateAssignedMap();
      handleCloseDialog();
    } catch (error) {
      console.error("Failed to delete training plan", error);
      showToastError("Failed to delete training plan");
    }
  };

  const handleCloseDialog = () => {
    setDialogMode(DIALOG_MODES.NONE);
    setSelectedPlan(null);
  };

  const handleCreatePlan = () => {
    setDialogMode(DIALOG_MODES.CREATE);
    setSelectedPlan(null);
  };

  const handleEditPlan = (plan: TrainingPlan) => {
    setDialogMode(DIALOG_MODES.EDIT);
    setSelectedPlan(plan);
  };

  const handleDeletePlanWrapper = (planId: string) => {
    handleDeleteTrainingPlan(planId);
  };

  return (
    <>
      <PageHeader
        title="Training Plans"
        description="Manage skill-based training plans for interns"
        icon={<BookOpen className="w-5 h-5" />}
      />
      <div className="space-y-6 py-4 px-4 sm:px-20">
        <Card className="p-5 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
          <div className="relative flex items-center gap-4 mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={filterTerm}
              onChange={(e) => setFilterTerm(e.target.value)}
              placeholder="Search plans..."
              className="pl-10 search-input-enhanced"
            />
            <Button onClick={handleCreatePlan} className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-sm rounded-lg">
              <Plus className="w-4 h-4 mr-2" /> New Plan
            </Button>
          </div>
          <div
            className={`grid grid-cols-1 ${
              userDetails?.role === "mentor" ? "md:grid-cols-3" : ""
            } gap-6 `}
          >
            {userDetails?.role === "mentor" && (
              <Card className="p-4 rounded-xl border-slate-200/80">
                <h3 className="card-section-title mb-4">
                  Assign Training Plan
                </h3>
                <Separator />
                <AssignTrainingPlanForm
                  interns={interns ?? []}
                  plans={filteredPlans}
                  onAssigned={async () => {
                    await mutateTrainingPlan();
                    await mutateAssignedMap();
                  }}
                />
              </Card>
            )}

            <Card className="p-4 space-y-4 min-h-[calc(100vh-300px)] rounded-xl border-slate-200/80">
              <h3 className="card-section-title">
                Displayed Training Plans
              </h3>
              <Separator />
              <TrainingPlanUnassigned
                filteredPlans={filteredPlans}
                onView={(plan) => {
                  setDetailPlan(plan);
                  setSourceType("unassigned");
                  setModalOpen(true);
                }}
                onEdit={handleEditPlan}
                onDelete={handleDeletePlanWrapper}
              />
            </Card>

            {userDetails?.role !== "admin" && (
              <Card className="p-4 space-y-4 min-h-[calc(100vh-300px)] rounded-xl border-slate-200/80">
                <h3 className="card-section-title">
                  Assigned Training Plans
                </h3>
                <Separator />
                <TrainingPlanAssigned
                  assignedMap={assignedMap ?? []}
                  onView={(dataTrainingPlan) => {
                    setDetailPlan(dataTrainingPlan);
                    setSourceType("assigned");
                    setModalOpen(true);
                  }}
                  onEdit={handleEditPlan}
                  onDelete={handleDeletePlanWrapper}
                />
              </Card>
            )}
          </div>
        </Card>

        <TrainingPlanDialog
          dialogMode={dialogMode}
          selectedPlan={selectedPlan}
          onClose={handleCloseDialog}
          onDelete={handleDeleteTrainingPlan}
          onSubmit={handleSubmit}
          skills={skills ?? []}
          tasks={tasks ?? []}
          isSubmitting={isSubmitting}
        />

        <TrainingPlanDetailModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          plan={detailPlan}
          sourceType={sourceType}
        />
        {isLoading && <Loading />}
      </div>
    </>
  );
}
