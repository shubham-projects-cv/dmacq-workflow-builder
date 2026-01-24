"use client";

import { ReactNode } from "react";
import { Plus } from "lucide-react";
import { useWorkflowStore } from "@/store/workflowStore";

export default function WorkflowLayout({
  sidebar,
  children,
  rightPanel,
}: {
  sidebar: ReactNode;
  children: ReactNode;
  rightPanel?: ReactNode;
}) {
  const isLeftOpen = useWorkflowStore((s) => s.isLeftOpen);
  const toggleLeft = useWorkflowStore((s) => s.toggleLeft);

  return (
    <div className="h-screen w-screen flex overflow-hidden relative bg-white">
      {/* Left Sidebar */}
      {isLeftOpen && (
        <div className="w-64 border-r bg-white text-gray-900">{sidebar}</div>
      )}

      {/* Reopen Button */}
      {!isLeftOpen && (
        <button
          onClick={toggleLeft}
          className="absolute top-4 left-4 z-50 bg-white border rounded p-2 shadow hover:bg-gray-100"
        >
          <Plus size={18} />
        </button>
      )}

      {/* Canvas */}
      <div className="flex-1 relative">{children}</div>

      {/* Right Panel */}
      {rightPanel && (
        <div className="w-72 border-l bg-white text-gray-900">{rightPanel}</div>
      )}
    </div>
  );
}
