"use client";

import { useReactFlow } from "reactflow";
import { useWorkflowStore } from "@/store/workflowStore";

export default function Sidebar() {
  const addNode = useWorkflowStore((s) => s.addNode);
  const { getViewport, getZoom } = useReactFlow();

  const handleAdd = (type: string) => {
    const viewport = getViewport();
    const zoom = getZoom();

    const centerX = (-viewport.x + window.innerWidth / 2) / zoom;
    const centerY = (-viewport.y + window.innerHeight / 2) / zoom;

    addNode(type, { x: centerX, y: centerY });
  };

  return (
    <div className="p-4 space-y-4 text-gray-900 bg-white h-full">
      <h2 className="font-semibold text-lg">Nodes</h2>

      <button
        onClick={() => handleAdd("Start")}
        className="w-full px-3 py-2 border rounded hover:bg-gray-100"
      >
        Start Node
      </button>

      <button
        onClick={() => handleAdd("Approval")}
        className="w-full px-3 py-2 border rounded hover:bg-gray-100"
      >
        Approval Node
      </button>

      <button
        onClick={() => handleAdd("End")}
        className="w-full px-3 py-2 border rounded hover:bg-gray-100"
      >
        End Node
      </button>
    </div>
  );
}
