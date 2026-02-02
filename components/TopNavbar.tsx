"use client";

import { Undo2, Redo2, Save, Send } from "lucide-react";

export default function TopNavbar() {
  return (
    <div className="w-full bg-white border-b shadow-sm px-3 py-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* ================= LEFT ================= */}
        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-1 px-2 py-1.5 border rounded hover:bg-gray-100 text-sm"
            title="Undo"
          >
            <Undo2 size={16} />
            <span className="hidden sm:inline">Undo</span>
          </button>

          <button
            className="flex items-center gap-1 px-2 py-1.5 border rounded hover:bg-gray-100 text-sm"
            title="Redo"
          >
            <Redo2 size={16} />
            <span className="hidden sm:inline">Redo</span>
          </button>
        </div>

        {/* ================= RIGHT ================= */}
        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-1 px-2 py-1.5 border rounded hover:bg-gray-100 text-sm"
            title="Save Draft"
          >
            <Save size={16} />
            <span className="hidden sm:inline">Save Draft</span>
          </button>

          <button
            className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
            title="Publish"
          >
            <Send size={16} />
            <span className="hidden sm:inline">Publish</span>
          </button>
        </div>
      </div>
    </div>
  );
}
