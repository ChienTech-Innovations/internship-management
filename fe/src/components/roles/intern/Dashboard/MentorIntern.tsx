import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { InternInfoDetail } from "@/types/intern.type";
import { Mail, MapPin, Phone } from "lucide-react";
import React from "react";

type Props = {
  internInfo?: InternInfoDetail;
};

const MentorIntern = ({ internInfo }: Props) => {
  return (
    <Card className="rounded-xl p-6 min-h-[200px] flex flex-col justify-between relative overflow-hidden hover:shadow-lg transition-all duration-300 border-slate-200/80">
      <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-blue-500 to-cyan-500 rounded-l-xl" />

      <div className="flex items-center justify-between pl-2">
        <h1 className="text-base font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          Info Mentor
        </h1>
        <Badge
          variant="outline"
          className={`capitalize ${
            internInfo?.mentor?.status === "active"
              ? "bg-emerald-100 text-emerald-700 border-emerald-300"
              : "bg-gray-100 text-gray-600 border-gray-300"
          }`}
        >
          {internInfo?.mentor?.status || "Unknown"}
        </Badge>
      </div>

      {internInfo?.mentor ? (
        <div className="flex flex-col xl:flex-row items-center text-center space-y-2 p-4 justify-between gap-4">
          <div className="flex gap-3 justify-between items-center">
            <Avatar className="w-16 h-16 ring-2 ring-blue-200 ring-offset-2">
              <AvatarFallback className="text-2xl font-semibold bg-gradient-to-br from-blue-100 to-cyan-100 text-blue-700">
                {internInfo?.mentor?.fullName?.[0] || "?"}
              </AvatarFallback>
            </Avatar>
            <div className="text-start">
              <CardTitle className="text-xl font-bold text-gray-900">
                {internInfo?.mentor?.fullName}
              </CardTitle>
              <CardDescription className="text-sm text-gray-500">
                {internInfo?.mentor?.username}
              </CardDescription>
            </div>
          </div>
          <div className="space-y-2.5 text-sm text-gray-700">
            <div className="flex gap-2 items-center text-start">
              <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                <Mail className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <span className="font-medium w-28">Email:</span>
              <span>{internInfo?.mentor?.email}</span>
            </div>
            <div className="flex gap-2 items-center text-start">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <span className="font-medium w-28">Phone Number:</span>
              <span>{internInfo?.mentor?.phoneNumber || "-"}</span>
            </div>
            <div className="flex gap-2 items-center text-start">
              <div className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
                <MapPin className="w-3.5 h-3.5 text-orange-600" />
              </div>
              <span className="font-medium w-28">Address:</span>
              <span>{internInfo?.mentor?.address || "-"}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-400 font-semibold text-sm">
          No mentor info available
        </div>
      )}
    </Card>
  );
};

export default MentorIntern;
