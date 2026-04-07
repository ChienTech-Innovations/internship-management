import RoleGuard from "@/components/providers/RoleGuard";

export default function ProfileLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={["admin", "mentor", "intern"]}>
      {children}
    </RoleGuard>
  );
}
