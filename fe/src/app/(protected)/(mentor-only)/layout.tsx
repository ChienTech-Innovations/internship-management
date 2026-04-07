import RoleGuard from "@/components/providers/RoleGuard";

export default function MentorOnlyLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <RoleGuard allowedRoles={["mentor"]}>{children}</RoleGuard>;
}
