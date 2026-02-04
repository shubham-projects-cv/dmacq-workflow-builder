"use client";

import { Undo2, Redo2, Save, Send } from "lucide-react";
import { useMemo } from "react";
import { useWorkflowStore } from "@/store/workflowStore";

type NodeType = "start" | "approval" | "email" | "end";

export default function TopNavbar() {
  const workflow = useWorkflowStore((s) => s.workflow);

  /* ================= VALIDATION ================= */

  const isWorkflowValid = useMemo(() => {
    const { nodes, edges } = workflow;

    if (!nodes.length) return false;

    const nodeMap = new Map(nodes.map((n) => [n.id, n]));
    const incoming = new Map<string, number>();
    const outgoing = new Map<string, number>();

    for (const n of nodes) {
      incoming.set(n.id, 0);
      outgoing.set(n.id, 0);
    }

    /* ---------- Validate Edges ---------- */

    for (const e of edges) {
      if (!nodeMap.has(e.source)) return false;
      if (!nodeMap.has(e.target)) return false;

      incoming.set(e.target, (incoming.get(e.target) ?? 0) + 1);
      outgoing.set(e.source, (outgoing.get(e.source) ?? 0) + 1);
    }

    /* ---------- Validate Nodes ---------- */

    for (const node of nodes) {
      const type = node.type as NodeType;

      const inCount = incoming.get(node.id) ?? 0;
      const outCount = outgoing.get(node.id) ?? 0;

      /* Start → must have output */
      if (type === "start" && outCount === 0) return false;

      /* End → must have input */
      if (type === "end" && inCount === 0) return false;

      /* Middle nodes → must have both */
      if (type !== "start" && type !== "end") {
        if (inCount === 0 || outCount === 0) return false;
      }

      /* Email node → must have email */
      if (type === "email") {
        if (!node.data?.email) return false;
      }

      /* Approval node → must have email + both paths */
      if (type === "approval") {
        if (!node.data?.email) return false;

        const approve = edges.find(
          (e) => e.source === node.id && e.data?.condition === "approve",
        );

        const deny = edges.find(
          (e) => e.source === node.id && e.data?.condition === "deny",
        );

        if (!approve || !deny) return false;
      }
    }

    return true;
  }, [workflow]);

  /* ================= PUBLISH ================= */

  const handlePublish = async () => {
    if (!isWorkflowValid) return;
    const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

    try {
      const res = await fetch(`${API}/workflow/publish`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          workflow,
        }),
      });

      const data = await res.json();

      if (data.success) {
        window.dispatchEvent(
          new CustomEvent("workflow-started", {
            detail: { workflowId: data.workflowId },
          }),
        );
      } else {
        alert("Failed ❌: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Server error ❌");
    }
  };

  /* ================= UI ================= */

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

          {/* PUBLISH */}
          <button
            onClick={handlePublish}
            disabled={!isWorkflowValid}
            className={`
              flex items-center gap-1 px-3 py-1.5 rounded text-sm
              ${
                isWorkflowValid
                  ? "bg-indigo-600 text-white hover:bg-indigo-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }
            `}
            title={
              isWorkflowValid
                ? "Publish Workflow"
                : "Complete all connections and required fields"
            }
          >
            <Send size={16} />
            <span className="hidden sm:inline">Publish</span>
          </button>
        </div>
      </div>
    </div>
  );
}
