import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { InternInfoDetail } from "@/types/intern.type";
import { UserCheck } from "lucide-react";

export default function MentorInfoSection({
  infoInternExport
}: {
  infoInternExport: InternInfoDetail | undefined;
}) {
  return (
    <Card className="rounded-md mt-4">
      <CardHeader className="bg-purple-50 p-3">
        <div className="flex gap-2 items-center">
          <UserCheck className="text-purple-700" />
          <span className="text-xl font-semibold">Mentor Information</span>
        </div>
      </CardHeader>
      <CardContent className="mt-4">
        <div className="grid sm:grid-cols-2 gap-4 text-start">
          <div>
            <p className="text-gray-500">Mentor Name</p>
            <span className="text-sm text-gray-600 font-semibold">
              {infoInternExport?.mentor.fullName}
            </span>
          </div>

          <div>
            <p className="text-gray-500">Contact Email</p>
            <div className="flex gap-2 items-center">
              <span className="text-sm font-semibold text-gray-600">
                {infoInternExport?.mentor.email}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
