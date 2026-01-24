"use client";

import { X } from "lucide-react";
import { useReactFlow } from "reactflow";
import { useWorkflowStore } from "@/store/workflowStore";

export default function Sidebar() {
  const addNode = useWorkflowStore((s) => s.addNode);
  const closeLeft = useWorkflowStore((s) => s.closeLeft);

  const { getViewport, getZoom } = useReactFlow();

  const handleAdd = (type: string) => {
    const viewport = getViewport();
    const zoom = getZoom();

    const centerX = (-viewport.x + window.innerWidth / 2) / zoom;
    const centerY = (-viewport.y + window.innerHeight / 2) / zoom;

    addNode(type, { x: centerX, y: centerY });
  };

  return (
    <div className="p-4 h-full bg-white text-gray-900 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg">Nodes</h2>

        <button onClick={closeLeft}>
          <X size={18} />
        </button>
      </div>

      {/* Buttons */}
      <div className="space-y-3">
        <button
          onClick={() => handleAdd("Start")}
          className="w-full border rounded px-3 py-2 hover:bg-gray-100"
        >
          Start
        </button>

        <button
          onClick={() => handleAdd("Approval")}
          className="w-full border rounded px-3 py-2 hover:bg-gray-100"
        >
          Approval
        </button>

        <button
          onClick={() => handleAdd("End")}
          className="w-full border rounded px-3 py-2 hover:bg-gray-100"
        >
          End
        </button>
      </div>
    </div>
  );
}
