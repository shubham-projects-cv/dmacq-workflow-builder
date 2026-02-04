import { useEffect, useMemo, useState } from "react";

/* ================= TYPES ================= */

export type WorkflowEvent = {
  workflowId: string;
  status: string;
  message?: string;
  meta?: {
    to?: string;

    currentApproverId?: string | null;
    currentEdgeId?: string | null;

    completedApproverIds?: string[];
    completedEdgeIds?: string[];
  };
  timestamp: string;
};

export type WorkflowStatusState = {
  started: boolean;
  waiting: boolean;
  decision: "approve" | "deny" | null;
  completed: boolean;

  currentApproverId: string | null;
  currentEdgeId: string | null;

  completedApproverIds: string[];
  completedEdgeIds: string[];
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

/* ================= STATUS ================= */

function deriveStatus(events: WorkflowEvent[]): WorkflowStatusState {
  let started = false;
  let waiting = false;
  let completed = false;

  let decision: "approve" | "deny" | null = null;

  let currentApproverId: string | null = null;
  let currentEdgeId: string | null = null;

  let completedApproverIds: string[] = [];
  let completedEdgeIds: string[] = [];

  for (const e of events) {
    if (e.status === "STARTED") {
      started = true;
    }

    if (e.status === "WAITING") {
      waiting = true;

      currentApproverId = e.meta?.currentApproverId ?? null;
      currentEdgeId = e.meta?.currentEdgeId ?? null;
    }

    if (e.status === "DECISION") {
      waiting = false;

      if (e.message === "approve" || e.message === "deny") {
        decision = e.message;
      }

      currentApproverId = null;
      currentEdgeId = e.meta?.currentEdgeId ?? null;
    }

    if (e.status === "COMPLETED") {
      completed = true;
      waiting = false;

      currentApproverId = null;
      currentEdgeId = null;
    }

    /* ---------- META SYNC ---------- */

    if (Array.isArray(e.meta?.completedApproverIds)) {
      completedApproverIds = e.meta.completedApproverIds;
    }

    if (Array.isArray(e.meta?.completedEdgeIds)) {
      completedEdgeIds = e.meta.completedEdgeIds;
    }
  }

  return {
    started,
    waiting,
    decision,
    completed,

    currentApproverId,
    currentEdgeId,

    completedApproverIds,
    completedEdgeIds,
  };
}

/* ================= HOOK ================= */

export function useWorkflowStream(workflowId?: string) {
  const [events, setEvents] = useState<WorkflowEvent[]>(() => {
    if (!workflowId) return [];
    if (typeof window === "undefined") return [];

    return load(workflowId);
  });

  /* ================= Reload ================= */

  useEffect(() => {
    if (!workflowId) return;

    const saved = load(workflowId);

    if (saved.some((e) => e.status === "COMPLETED")) {
      localStorage.removeItem(getKey(workflowId));

      queueMicrotask(() => {
        setEvents([]);
      });

      return;
    }

    queueMicrotask(() => {
      setEvents(saved);
    });
  }, [workflowId]);

  /* ================= Stream ================= */

  useEffect(() => {
    if (!workflowId) return;

    const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

    const es = new EventSource(`${API}/stream`);

    es.onmessage = (e: MessageEvent<string>) => {
      const data = JSON.parse(e.data) as WorkflowEvent;

      if (data.workflowId !== workflowId) return;

      setEvents((prev) => {
        const updated = [...prev, data];

        if (data.status === "COMPLETED") {
          localStorage.removeItem(getKey(workflowId));
        } else {
          save(workflowId, updated);
        }

        return updated;
      });
    };

    return () => es.close();
  }, [workflowId]);

  /* ================= Derived ================= */

  const status = useMemo<WorkflowStatusState>(() => {
    return deriveStatus(events);
  }, [events]);

  return {
    events,
    status,
  };
}
