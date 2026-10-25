import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Admin | PrepLoom",
  description: "Manage PrepLoom learning content.",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return children;
}
