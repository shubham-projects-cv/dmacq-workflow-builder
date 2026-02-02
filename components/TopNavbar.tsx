"use client";

import { Undo2, Redo2, Save, Send } from "lucide-react";
import { useWorkflowStore } from "@/store/workflowStore";

export default function TopNavbar() {
  const workflow = useWorkflowStore((s) => s.workflow);

  const handlePublish = async () => {
    try {
      const res = await fetch("http://localhost:4000/workflow/publish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          workflow, // ✅ send full workflow
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Workflow Started ✅\nID: " + data.workflowId);
      } else {
        alert("Failed ❌: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Server error ❌");
    }
  };

  return (
    <div className="w-full bg-white border-b shadow-sm px-3 py-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* LEFT */}
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1 px-2 py-1.5 border rounded hover:bg-gray-100 text-sm">
            <Undo2 size={16} />
            <span className="hidden sm:inline">Undo</span>
          </button>

          <button className="flex items-center gap-1 px-2 py-1.5 border rounded hover:bg-gray-100 text-sm">
            <Redo2 size={16} />
            <span className="hidden sm:inline">Redo</span>
          </button>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1 px-2 py-1.5 border rounded hover:bg-gray-100 text-sm">
            <Save size={16} />
            <span className="hidden sm:inline">Save Draft</span>
          </button>

          {/* ✅ PUBLISH */}
          <button
            onClick={handlePublish}
            className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
          >
            <Send size={16} />
            <span className="hidden sm:inline">Publish</span>
          </button>
        </div>
      </div>
    </div>
  );
}
