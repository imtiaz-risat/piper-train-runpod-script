"use client";

import { AuthProvider } from "@/providers/auth-provider";

export default function TrainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthProvider>{children}</AuthProvider>;
}
