"use client";

import {
  X,
  Upload,
  Download,
  Mail,
  FileText,
  CheckCircle,
  Square,
} from "lucide-react";
import { useRef } from "react";

import { useWorkflowStore } from "@/store/workflowStore";

/* ================= NODE CONFIG ================= */

const NODE_LIST = [
  { type: "Start", label: "Start", icon: FileText },
  { type: "Approval", label: "Approval", icon: CheckCircle },
  { type: "End", label: "End", icon: Square },
  { type: "Email", label: "Email", icon: Mail },
];

export default function Sidebar({
  onAddNode,
}: {
  onAddNode: (type: string) => void;
}) {
  const closeLeft = useWorkflowStore((s) => s.closeLeft);

  const workflow = useWorkflowStore((s) => s.workflow);
  const setWorkflow = useWorkflowStore((s) => s.setWorkflow);

  const fileRef = useRef<HTMLInputElement>(null);

  /* ================= DRAG ================= */

  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    nodeType: string,
  ) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  /* ================= EXPORT ================= */

  const handleExport = () => {
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

  /* ================= IMPORT ================= */

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);

        if (!json.nodes || !json.edges) {
          alert("Invalid workflow ❌");
          return;
        }

        setWorkflow(json);
        alert("Imported ✅");
      } catch {
        alert("Invalid JSON ❌");
      }
    };

    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div className="h-full flex flex-col bg-white text-gray-900 p-4">
      {/* HEADER */}

      <div className="border-b flex items-center justify-between mb-5 pb-3">
        <h2 className="font-semibold text-lg">Nodes</h2>

        <button onClick={closeLeft}>
          <X size={18} />
        </button>
      </div>

      {/* LIST */}

      <div className="flex-1 overflow-y-auto space-y-3">
        {NODE_LIST.map((node) => {
          const Icon = node.icon;

          return (
            <div
              key={node.type}
              draggable
              onDragStart={(e) => onDragStart(e, node.type)}
              onClick={() => onAddNode(node.type)}
              className="cursor-pointer border rounded px-3 py-2 hover:bg-gray-100 active:bg-gray-200 flex items-center gap-2 text-sm font-medium"
            >
              <Icon size={16} className="text-gray-600" />

              {node.label}
            </div>
          );
        })}
      </div>

      {/* FOOTER */}

      <div className="space-y-3">
        <input
          ref={fileRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          className="hidden"
        />

        <button
          onClick={handleExport}
          className="w-full flex items-center justify-center gap-2 border rounded px-3 py-2 hover:bg-gray-100"
        >
          <Download size={16} />
          Export JSON
        </button>

        <button
          onClick={() => fileRef.current?.click()}
          className="w-full flex items-center justify-center gap-2 border rounded px-3 py-2 hover:bg-gray-100"
        >
          <Upload size={16} />
          Import JSON
        </button>
      </div>
    </div>
  );
}
