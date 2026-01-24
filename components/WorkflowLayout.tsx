"use client";

import { ReactNode } from "react";

export default function WorkflowLayout({
  sidebar,
  children,
}: {
  sidebar: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="h-screen w-screen flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-gray-100 border-r">{sidebar}</div>

      {/* Canvas */}
      <div className="flex-1 bg-white">{children}</div>
    </div>
  );
}
