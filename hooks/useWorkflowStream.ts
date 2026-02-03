import { useEffect, useMemo, useState } from "react";

/* ================= TYPES ================= */

export type WorkflowEvent = {
  workflowId: string;
  status: string;
  message?: string;
  meta?: {
    to?: string;
  };
  timestamp: string;
};

export type WorkflowStatusState = {
  started: boolean;
  waiting: boolean;
  decision: "approve" | "deny" | null;
  completed: boolean;
};

/* ================= STORAGE ================= */

function getKey(id: string): string {
  return `workflow-events:${id}`;
}

function load(id: string): WorkflowEvent[] {
  try {
    const raw = localStorage.getItem(getKey(id));

    if (!raw) return [];

    return JSON.parse(raw) as WorkflowEvent[];
  } catch {
    return [];
  }
}

function save(id: string, events: WorkflowEvent[]): void {
  localStorage.setItem(getKey(id), JSON.stringify(events));
}

/* ================= STATUS DERIVER ================= */

function deriveStatus(events: WorkflowEvent[]): WorkflowStatusState {
  let started = false;
  let waiting = false;
  let completed = false;
  let decision: "approve" | "deny" | null = null;

  for (const e of events) {
    if (e.status === "STARTED") {
      started = true;
    }

    if (e.status === "WAITING") {
      waiting = true;
    }

    if (e.status === "DECISION") {
      if (e.message === "approve" || e.message === "deny") {
        decision = e.message;
      }
    }

    if (e.status === "COMPLETED") {
      completed = true;
    }
  }

  return {
    started,
    waiting,
    decision,
    completed,
  };
}

/* ================= HOOK ================= */

export function useWorkflowStream(workflowId?: string) {
  /* ---------- Init ---------- */

  const [events, setEvents] = useState<WorkflowEvent[]>(() => {
    if (!workflowId) return [];

    if (typeof window === "undefined") return [];

    return load(workflowId);
  });

  /* ---------- Reload When ID Changes ---------- */

  useEffect(() => {
    if (!workflowId) return;

    const saved = load(workflowId);

    queueMicrotask(() => {
      setEvents(saved);
    });
  }, [workflowId]);

  /* ---------- Live Stream ---------- */

  useEffect(() => {
    if (!workflowId) return;

    const es = new EventSource("http://localhost:4000/stream");

    es.onmessage = (e: MessageEvent<string>) => {
      const data = JSON.parse(e.data) as WorkflowEvent;

      if (data.workflowId !== workflowId) return;

      setEvents((prev) => {
        const updated = [...prev, data];

        // Clear storage when completed
        if (data.status === "COMPLETED") {
          localStorage.removeItem(getKey(workflowId));
        } else {
          save(workflowId, updated);
        }

        return updated;
      });
    };

    return () => {
      es.close();
    };
  }, [workflowId]);

  /* ---------- Derived Status (No State) ---------- */

  const status = useMemo<WorkflowStatusState>(() => {
    return deriveStatus(events);
  }, [events]);

  return {
    events,
    status,
  };
}
