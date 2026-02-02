"use client";

import { Undo2, Redo2, Save, Send } from "lucide-react";

export default function TopNavbar() {
  return (
    <div className="w-full h-16 bg-white border-b flex items-center justify-between px-4 md:px-6 shadow-sm">
      {/* ================= LEFT ================= */}
      <div className="flex items-center gap-2">
        <button className="flex items-center gap-1 px-3 py-1.5 border rounded hover:bg-gray-100 text-sm">
          <Undo2 size={16} />
          Undo
        </button>

        <button className="flex items-center gap-1 px-3 py-1.5 border rounded hover:bg-gray-100 text-sm">
          <Redo2 size={16} />
          Redo
        </button>
      </div>

      {/* ================= RIGHT ================= */}
      <div className="flex items-center gap-2">
        <button className="flex items-center gap-1 px-3 py-1.5 border rounded hover:bg-gray-100 text-sm">
          <Save size={16} />
          Save Draft
        </button>

        <button className="flex items-center gap-1 px-4 py-1.5 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm">
          <Send size={16} />
          Publish
        </button>
      </div>
    </div>
  );
}
