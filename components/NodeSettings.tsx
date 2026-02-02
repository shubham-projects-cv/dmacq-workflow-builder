"use client";

import { X, Mail, Type, User } from "lucide-react";
import { ChangeEvent } from "react";

import { useWorkflowStore } from "@/store/workflowStore";

export default function NodeSettings() {
  const nodeId = useWorkflowStore((s) => s.settingsNodeId);
  const nodes = useWorkflowStore((s) => s.workflow.nodes);

  const close = useWorkflowStore((s) => s.closeSettings);
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);

  if (!nodeId) return null;

  const node = nodes.find((n) => n.id === nodeId);

  if (!node) return null;

  const isEmail = node.type === "email";

  const handleChange =
    (field: string) => (e: ChangeEvent<HTMLInputElement>) => {
      updateNodeData(node.id, {
        [field]: e.target.value,
      });
    };

  return (
    <div className="h-full bg-white text-gray-900 p-4">
      {/* ================= HEADER ================= */}

      <div className="flex items-center justify-between mb-5 border-b pb-3">
        <h3 className="font-semibold text-lg">Node Settings</h3>

        <button onClick={close}>
          <X size={18} />
        </button>
      </div>

      {/* ================= FORM ================= */}

      <div className="space-y-4 text-sm">
        {/* LABEL */}

        <div>
          <label className="flex items-center gap-1 mb-1 font-medium">
            <Type size={14} />
            Label
          </label>

          <input
            value={node.data?.label || ""}
            onChange={handleChange("label")}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* EMAIL */}

        <div>
          <label className="flex items-center gap-1 mb-1 font-medium">
            <Mail size={14} />
            Receiver Email
          </label>

          <input
            value={node.data?.email || ""}
            onChange={handleChange("email")}
            placeholder="user@email.com"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* APPROVER ONLY FOR APPROVAL */}

        {!isEmail && (
          <div>
            <label className="flex items-center gap-1 mb-1 font-medium">
              <User size={14} />
              Approver Name
            </label>

            <input
              value={node.data?.approver || ""}
              onChange={handleChange("approver")}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        )}
      </div>
    </div>
  );
}
