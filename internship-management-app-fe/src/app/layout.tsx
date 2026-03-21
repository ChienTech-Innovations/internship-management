import { Metadata, Viewport } from "next";
import "./globals.css";
import SWRProvider from "@/lib/swr/SWRProvider";
import { Toaster } from "@/components/ui/toaster";
import AuthProvider from "@/components/providers/AuthProvider";

export const metadata: Metadata = {
  title: "Interns Management App",
  description:
    "An intern management app streamlines task assignment, progress tracking, performance evaluation, and reporting for efficient intern management."
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 2,
  userScalable: true
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html lang="en">
        <body>
          <SWRProvider>
            <AuthProvider>{children}</AuthProvider>
            <Toaster />
          </SWRProvider>
        </body>
      </html>
    </>
  );
}
