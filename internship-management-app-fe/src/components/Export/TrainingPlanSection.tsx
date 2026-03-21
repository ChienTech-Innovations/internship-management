import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { InternInfoDetail } from "@/types/intern.type";
import { BookOpen } from "lucide-react";

export default function TrainingPlanSection({
  infoInternExport
}: {
  infoInternExport: InternInfoDetail | undefined;
}) {
  return (
    <Card className="rounded-md mt-4">
      <CardHeader className="bg-orange-50 p-3">
        <div className="flex gap-2 items-center">
          <BookOpen className="text-orange-700" />
          <span className="text-xl font-semibold">Training Plan</span>
        </div>
      </CardHeader>
      <CardContent className="mt-4 text-start space-y-4">
        <CardTitle className="text-md">{infoInternExport?.plan.name}</CardTitle>
        <CardDescription className="text-sm">
          {infoInternExport?.plan.description}
        </CardDescription>
        <CardTitle className="text-md">Skills to be Developed</CardTitle>

        {infoInternExport?.plan.skills.map((skill) => (
          <Badge
            key={skill.id}
            className="bg-blue-50 text-blue-700 mr-2 text-sm"
          >
            {skill.skill.name}
          </Badge>
        ))}
      </CardContent>
    </Card>
  );
}
