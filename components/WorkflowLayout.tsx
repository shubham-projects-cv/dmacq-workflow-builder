"use client";

import { ReactNode, useEffect, useState } from "react";
import { Plus, RotateCcw } from "lucide-react";

import { useWorkflowStore } from "@/store/workflowStore";
import TopNavbar from "@/components/TopNavbar";

/* ================= STORAGE ================= */

const WORKFLOW_KEY = "active-workflow";

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

  /* ================= ACTIVE WORKFLOW ================= */

  const [hasActiveWorkflow, setHasActiveWorkflow] = useState(false);

  useEffect(() => {
    const check = () => {
      setHasActiveWorkflow(!!localStorage.getItem(WORKFLOW_KEY));
    };

    check();

    window.addEventListener("workflow-started", check as EventListener);
    window.addEventListener("workflow-completed", check as EventListener);
    window.addEventListener("storage", check);

    return () => {
      window.removeEventListener("workflow-started", check as EventListener);
      window.removeEventListener("workflow-completed", check as EventListener);
      window.removeEventListener("storage", check);
    };
  }, []);

  /* ================= CLEAR ================= */

  const handleClear = () => {
    localStorage.clear();
    window.location.reload();
  };

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
            w-72 h-full
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
          <div className="absolute right-0 top-0 z-40 w-72 h-full bg-white border-l transition-transform duration-300 translate-x-0">
            {rightPanel}
          </div>
        )}

        {/* ================= NEW WORKFLOW (ALWAYS ACTIVE) ================= */}
        <button
          onClick={handleClear}
          className="
            fixed bottom-5 right-5 z-50
            flex items-center gap-2
            bg-indigo-600 text-white
            px-4 py-2 rounded-full
            shadow-lg
            hover:bg-indigo-700
            text-sm font-medium
          "
        >
          <RotateCcw size={16} />
          New Workflow
        </button>
      </div>
    </div>
  );
}
