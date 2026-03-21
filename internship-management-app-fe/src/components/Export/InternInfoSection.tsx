import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatDateTime } from "@/lib/helper";
import { InternInfoDetail } from "@/types/intern.type";
import { User } from "lucide-react";

export default function InternInfoSection({
  infoInternExport
}: {
  infoInternExport: InternInfoDetail | undefined;
}) {
  return (
    <Card className="rounded-md">
      <CardHeader className="bg-blue-50 p-3">
        <div className="flex gap-2 items-center">
          <User className="text-blue-700" />
          <span className="text-xl font-semibold">Intern Information</span>
        </div>
      </CardHeader>
      <CardContent className="mt-4">
        <div className="grid sm:grid-cols-2 gap-4 text-start">
          <div>
            <p className="text-gray-500">Full Name</p>
            <span className="text-sm font-semibold text-gray-600">
              {infoInternExport?.intern?.fullName}
            </span>
          </div>
          <div>
            <p className="text-gray-500">Field</p>
            <span className="text-sm font-semibold text-gray-600">
              {infoInternExport?.field}
            </span>
          </div>
          <div>
            <p className="text-gray-500">Username</p>
            <span className="text-sm font-semibold text-gray-600">
              {infoInternExport?.intern?.username}
            </span>
          </div>
          <div>
            <p className="text-gray-500">Status</p>
            <span className="text-sm font-semibold text-gray-600 bg-gray-200 rounded-full py-1 px-2">
              {infoInternExport?.status}
            </span>
          </div>
          <div>
            <p className="text-gray-500">Email</p>
            <div className="flex gap-2 items-center">
              <span className="text-sm font-semibold text-gray-600">
                {infoInternExport?.intern?.email}
              </span>
            </div>
          </div>
          <div>
            <p className="text-gray-500">Phone</p>
            <span className="text-sm font-semibold text-gray-600">
              {infoInternExport?.intern?.phoneNumber}
            </span>
          </div>
          <div>
            <p className="text-gray-500">Start Date</p>
            <span className="text-sm font-semibold text-gray-600">
              {infoInternExport?.startDate
                ? formatDateTime(infoInternExport.startDate)
                : "-"}
            </span>
          </div>
          <div>
            <p className="text-gray-500">End Date</p>
            <span className="text-sm font-semibold text-gray-600">
              {infoInternExport?.endDate
                ? formatDateTime(infoInternExport.endDate)
                : "-"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
