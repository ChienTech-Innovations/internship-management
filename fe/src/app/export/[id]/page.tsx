import ExportPDF from "@/components/Export/ExportPDF";
import React, { use } from "react";

export default function ExportPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <ExportPDF internId={id} />;
}
