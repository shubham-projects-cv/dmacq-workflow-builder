"use client";

import { X, Download, Upload } from "lucide-react";
import { useReactFlow } from "reactflow";
import { useRef } from "react";

import { useWorkflowStore, WorkflowJSON } from "@/store/workflowStore";

export default function Sidebar() {
  const addNode = useWorkflowStore((s) => s.addNode);
  const closeLeft = useWorkflowStore((s) => s.closeLeft);

  const workflow = useWorkflowStore((s) => s.workflow);
  const setWorkflow = useWorkflowStore((s) => s.setWorkflow);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { getViewport, getZoom } = useReactFlow();

  /* -------- Add Node -------- */

  const handleAdd = (type: string) => {
    const viewport = getViewport();
    const zoom = getZoom();

    const centerX = (-viewport.x + window.innerWidth / 2) / zoom;
    const centerY = (-viewport.y + window.innerHeight / 2) / zoom;

    addNode(type, { x: centerX, y: centerY });
  };

  /* -------- Export -------- */

  const handleExport = (): void => {
    const data = JSON.stringify(workflow, null, 2);

    const blob = new Blob([data], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = "workflow.json";

    a.click();

    URL.revokeObjectURL(url);
  };

  /* -------- Import -------- */

  const handleImportClick = (): void => {
    fileInputRef.current?.click();
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      try {
        const json = JSON.parse(reader.result as string) as WorkflowJSON;

        setWorkflow(json);
      } catch {
        alert("Invalid workflow JSON");
      }
    };

    reader.readAsText(file);
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

      {/* Add Nodes */}
      <div className="space-y-3 mb-6">
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

      {/* Import / Export */}
      <div className="space-y-3 mt-auto">
        <button
          onClick={handleExport}
          className="w-full border rounded px-3 py-2 flex items-center justify-center gap-2 hover:bg-gray-100"
        >
          <Download size={16} />
          Export JSON
        </button>

        <button
          onClick={handleImportClick}
          className="w-full border rounded px-3 py-2 flex items-center justify-center gap-2 hover:bg-gray-100"
        >
          <Upload size={16} />
          Import JSON
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          hidden
          onChange={handleImportFile}
        />
      </div>
    </div>
  );
}
