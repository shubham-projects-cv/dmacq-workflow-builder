import { useEffect, useState } from "react";

/* ================= TYPES ================= */

export type WorkflowEvent = {
  workflowId: string;
  status: string;
  message?: string;
  timestamp: string;
};

/* ================= STORAGE ================= */

function getKey(id: string) {
  return `workflow-events:${id}`;
}

function load(id: string): WorkflowEvent[] {
  try {
    const raw = localStorage.getItem(getKey(id));

    if (!raw) return [];

    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function save(id: string, events: WorkflowEvent[]) {
  localStorage.setItem(getKey(id), JSON.stringify(events));
}

/* ================= HOOK ================= */

export function useWorkflowStream(workflowId?: string) {
  /* ---------- Init From Storage ---------- */

  const [events, setEvents] = useState<WorkflowEvent[]>(() => {
    if (!workflowId) return [];

    if (typeof window === "undefined") return [];

    return load(workflowId);
  });

  /* ---------- Reload When Workflow Changes ---------- */

  useEffect(() => {
    if (!workflowId) return;

    const saved = load(workflowId);

    // ✅ Make update async (React 19 safe)
    queueMicrotask(() => {
      setEvents(saved);
    });
  }, [workflowId]);

  /* ---------- Live Stream ---------- */

  useEffect(() => {
    if (!workflowId) return;

    const es = new EventSource("http://localhost:4000/stream");

    es.onmessage = (e) => {
      const data: WorkflowEvent = JSON.parse(e.data);

      if (data.workflowId !== workflowId) return;

      setEvents((prev) => {
        const updated = [...prev, data];

        save(workflowId, updated);

        return updated;
      });
    };

    return () => {
      es.close();
    };
  }, [workflowId]);

  return events;
}
