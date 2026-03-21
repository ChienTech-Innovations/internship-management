import RoleGuard from "@/components/providers/RoleGuard";

export default function AdminOnlyLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <RoleGuard allowedRoles={["admin"]}>{children}</RoleGuard>;
}
