"use client";

import { ReactNode } from "react";
import { Plus } from "lucide-react";

import { useWorkflowStore } from "@/store/workflowStore";
import TopNavbar from "@/components/TopNavbar";

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
    <div className="w-screen h-screen flex flex-col bg-white overflow-hidden">
      {/* ================= TOP NAV ================= */}
      <TopNavbar />

      {/* ================= MAIN AREA ================= */}
      <div className="relative flex-1 overflow-hidden">
        {/* ================= SIDEBAR ================= */}
        <div
          className={`
            absolute left-0 top-0 z-40
            w-64 h-full
            bg-white border-r
            transition-transform duration-300
            ${isLeftOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          {sidebar}
        </div>

        {/* ================= OPEN BTN ================= */}
        {!isLeftOpen && (
          <button
            onClick={toggleLeft}
            className="absolute top-4 left-4 z-50 bg-white border rounded p-2 shadow hover:bg-gray-100"
          >
            <Plus size={18} />
          </button>
        )}

        {/* ================= CANVAS ================= */}
        <div className="w-full h-full relative">{children}</div>

        {/* ================= RIGHT PANEL ================= */}
        {rightPanel && (
          <div className="absolute top-0 right-0 h-full w-72 border-l bg-white z-40">
            {rightPanel}
          </div>
        )}
      </div>
    </div>
  );
}
