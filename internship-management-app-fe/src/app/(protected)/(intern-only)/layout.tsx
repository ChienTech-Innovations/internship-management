import RoleGuard from "@/components/providers/RoleGuard";

export default function InternOnlyLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <RoleGuard allowedRoles={["intern"]}>{children}</RoleGuard>;
}
