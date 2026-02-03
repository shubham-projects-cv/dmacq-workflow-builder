"use client";

import { JSX, useEffect, useRef, useState } from "react";
import {
  CheckCircle,
  X,
  Clock,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

type WorkflowEvent = {
  workflowId: string;
  status: string;
  message?: string;
  timestamp: string;
};

type Props = {
  events: WorkflowEvent[];
  onClose: () => void;
};

const STATUS_META: Record<
  string,
  { color: string; icon: JSX.Element; label: string }
> = {
  STARTED: {
    color: "border-cyan-400 text-cyan-400",
    icon: <Clock size={14} />,
    label: "Workflow started",
  },
  WAITING: {
    color: "border-yellow-400 text-yellow-400",
    icon: <AlertCircle size={14} />,
    label: "Waiting for approval",
  },
  DECISION_APPROVE: {
    color: "border-green-500 text-green-500",
    icon: <ThumbsUp size={14} />,
    label: "Request approved",
  },
  DECISION_DENY: {
    color: "border-red-500 text-red-500",
    icon: <ThumbsDown size={14} />,
    label: "Request denied",
  },
  COMPLETED: {
    color: "border-blue-500 text-blue-500",
    icon: <CheckCircle size={14} />,
    label: "Workflow completed",
  },
};

export default function WorkflowStatusPanel({ events, onClose }: Props) {
  const [minimized, setMinimized] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const completed = events.some((e) => e.status === "COMPLETED");

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [events]);

  return (
    <div
      className={`
        fixed top-20 right-4 z-50
        w-80
        bg-white border rounded-xl shadow-lg
        transition-all duration-300
        ${minimized ? "h-14" : "h-[420px]"}
        glow-panel
      `}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="font-semibold text-sm">Workflow Live Status</div>

        <div className="flex items-center gap-2">
          <button onClick={() => setMinimized(!minimized)}>
            {minimized ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {completed && (
            <button onClick={onClose}>
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* BODY */}
      {!minimized && (
        <div className="p-3 space-y-3 text-xs overflow-y-auto h-[350px]">
          {events.map((e, i) => {
            const key =
              e.status === "DECISION"
                ? `DECISION_${e.message?.toUpperCase()}`
                : e.status;

            const meta = STATUS_META[key];

            if (!meta) return null;

            return (
              <div key={i} className={`border-l-4 pl-3 ${meta.color}`}>
                <div className="flex items-center gap-2 font-medium">
                  {meta.icon}
                  {meta.label}
                </div>

                <div className="text-[10px] text-gray-500 mt-0.5">
                  {new Date(e.timestamp).toLocaleTimeString()}
                </div>
              </div>
            );
          })}

          <div ref={bottomRef} />
        </div>
      )}
    </div>
  );
}
