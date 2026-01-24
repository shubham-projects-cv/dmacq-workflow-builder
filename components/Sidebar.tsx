"use client";

export default function Sidebar() {
  return (
    <div className="p-4 space-y-4 text-gray-900 bg-white h-full">
      <h2 className="font-semibold text-lg text-gray-900">Nodes</h2>

      <button className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-gray-900 hover:bg-gray-100 transition">
        Start Node
      </button>

      <button className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-gray-900 hover:bg-gray-100 transition">
        Approval Node
      </button>

      <button className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-gray-900 hover:bg-gray-100 transition">
        End Node
      </button>
    </div>
  );
}
