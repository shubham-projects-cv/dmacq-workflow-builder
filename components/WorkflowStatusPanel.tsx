"use client";

import { JSX, useEffect, useMemo, useRef, useState } from "react";
import {
  X,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  ChevronUp,
  ChevronDown,
  Mail,
  Flag,
  Play,
} from "lucide-react";

/* ================= Types ================= */

type WorkflowEvent = {
  workflowId: string;
  status: string;
  message?: string;

  // ✅ Added
  meta?: {
    to?: string;
  };

  timestamp: string;
};

type Props = {
  events: WorkflowEvent[];
  onClose: () => void;
};

type TimelineItem = {
  key: string;
  title: string;
  description?: string;
  time: string;
  duration?: string;
  icon: JSX.Element;
  color: string;
};

/* ================= Helpers ================= */

function formatDateTime(iso: string): string {
  const d = new Date(iso);

  return d.toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms} ms`;

  const sec = Math.floor(ms / 1000);

  if (sec < 60) return `${sec} sec`;

  const min = Math.floor(sec / 60);
  const rem = sec % 60;

  return `${min}m ${rem}s`;
}

/* ================= Component ================= */

export default function WorkflowStatusPanel({ events, onClose }: Props) {
  const [minimized, setMinimized] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  const completed = events.some((e) => e.status === "COMPLETED");

  /* ================= Build Timeline ================= */

  const timeline = useMemo<TimelineItem[]>(() => {
    if (!events.length) return [];

    const items: TimelineItem[] = [];

    for (let i = 0; i < events.length; i++) {
      const current = events[i];
      const prev = events[i - 1];

      const currentTime = new Date(current.timestamp).getTime();
      const prevTime = prev ? new Date(prev.timestamp).getTime() : undefined;

      const duration =
        prevTime !== undefined
          ? formatDuration(currentTime - prevTime)
          : undefined;

      /* ---------- START ---------- */

      if (current.status === "STARTED") {
        items.push({
          key: `${i}-started`,
          title: "Workflow started",
          time: formatDateTime(current.timestamp),
          duration,
          icon: <Play size={16} />,
          color: "border-cyan-400 text-cyan-400",
        });
      }

      /* ---------- WAITING ---------- */

      if (current.status === "WAITING") {
        items.push({
          key: `${i}-waiting`,
          title: "Waiting for approval",
          description: current.meta?.to
            ? `Approval email sent to ${current.meta.to}`
            : "Approval email sent",

          time: formatDateTime(current.timestamp),
          duration,
          icon: <AlertCircle size={16} />,
          color: "border-yellow-400 text-yellow-400",
        });
      }

      /* ---------- DECISION ---------- */

      if (current.status === "DECISION") {
        const approved = current.message === "approve";

        items.push({
          key: `${i}-decision`,
          title: approved ? "Request approved" : "Request denied",
          description: approved
            ? "Approver accepted the request"
            : "Approver rejected the request",
          time: formatDateTime(current.timestamp),
          duration,
          icon: approved ? <ThumbsUp size={16} /> : <ThumbsDown size={16} />,
          color: approved
            ? "border-green-500 text-green-500"
            : "border-red-500 text-red-500",
        });

        items.push({
          key: `${i}-send-final`,
          title: "Sending result email",
          description: "Notifying workflow owner",
          time: formatDateTime(current.timestamp),
          icon: <Mail size={16} />,
          color: "border-indigo-500 text-indigo-500",
        });
      }

      if (current.status === "EMAIL_SENT") {
        items.push({
          key: `${i}-email`,
          title: "Sending email",
          description: current.meta?.to
            ? `To: ${current.meta.to}`
            : "Sending email",
          time: formatDateTime(current.timestamp),
          icon: <Mail size={16} />,
          color: "border-indigo-500 text-indigo-500",
        });
      }

      /* ---------- COMPLETED ---------- */

      if (current.status === "COMPLETED") {
        const start = new Date(events[0].timestamp).getTime();
        const end = new Date(current.timestamp).getTime();

        items.push({
          key: `${i}-completed`,
          title: "Workflow completed",
          description: `Total time: ${formatDuration(end - start)}`,
          time: formatDateTime(current.timestamp),
          icon: <Flag size={16} />,
          color: "border-blue-500 text-blue-500",
        });
      }
    }

    return items;
  }, [events]);

  /* ================= Auto Scroll ================= */

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [timeline]);

  /* ================= Render ================= */

  return (
    <div
      className={`
        fixed top-20 right-4 z-50
        w-80
        bg-white border rounded-xl shadow-lg
        transition-all duration-300
        ${minimized ? "h-14" : "h-[460px]"}
        glow-panel
      `}
    >
      {/* ================= HEADER ================= */}

      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="font-semibold text-base">Workflow Activity</div>

        <div className="flex items-center gap-2">
          <button onClick={() => setMinimized(!minimized)}>
            {minimized ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          {completed && (
            <button onClick={onClose}>
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* ================= BODY ================= */}

      {!minimized && (
        <div className="p-3 space-y-3 text-sm overflow-y-auto h-[400px]">
          {timeline.map((item) => (
            <div key={item.key} className={`border-l-4 pl-3 ${item.color}`}>
              <div className="flex items-center gap-2 font-medium">
                {item.icon}
                {item.title}
              </div>

              {item.description && (
                <div className="text-[13px] text-gray-600 mt-0.5">
                  {item.description}
                </div>
              )}

              <div className="flex justify-between text-[12px] text-gray-500 mt-1">
                <span>{item.time}</span>

                {item.duration && <span>⏱ {item.duration}</span>}
              </div>
            </div>
          ))}

          <div ref={bottomRef} />
        </div>
      )}
    </div>
  );
}
