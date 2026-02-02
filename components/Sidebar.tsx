"use client";

import { X } from "lucide-react";

import { useWorkflowStore } from "@/store/workflowStore";

export default function Sidebar() {
  const closeLeft = useWorkflowStore((s) => s.closeLeft);

  /* ✅ Drag Handler */
  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    nodeType: string,
  ) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="p-4 h-full bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg">Nodes</h2>

        <button onClick={closeLeft}>
          <X size={18} />
        </button>
      </div>

      {/* Draggable Nodes */}
      <div className="space-y-3">
        <div
          draggable
          onDragStart={(e) => onDragStart(e, "Start")}
          className="cursor-grab border rounded px-3 py-2 hover:bg-gray-100"
        >
          Start
        </div>

        <div
          draggable
          onDragStart={(e) => onDragStart(e, "Approval")}
          className="cursor-grab border rounded px-3 py-2 hover:bg-gray-100"
        >
          Approval
        </div>

        <div
          draggable
          onDragStart={(e) => onDragStart(e, "End")}
          className="cursor-grab border rounded px-3 py-2 hover:bg-gray-100"
        >
          End
        </div>
      </div>
    </div>
  );
}
