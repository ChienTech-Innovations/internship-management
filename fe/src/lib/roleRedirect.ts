export function redirectBasedOnRole(role: string) {
  if (typeof window !== "undefined") {
    const baseUrl = window.location.origin;
    if (role === "admin") window.location.href = `${baseUrl}/admin/dashboard`;
    else if (role === "mentor")
      window.location.href = `${baseUrl}/mentor/dashboard`;
    else if (role === "intern")
      window.location.href = `${baseUrl}/intern/dashboard`;
  }
}
