import { useEffect, useState } from "react";

/* ================= TYPES ================= */

export type WorkflowEvent = {
  workflowId: string;
  status: string;
  message?: string;
  timestamp: string;
};

/* ================= HOOK ================= */

export function useWorkflowStream() {
  const [events, setEvents] = useState<WorkflowEvent[]>([]);

  useEffect(() => {
    const es = new EventSource("http://localhost:4000/stream");

    es.onmessage = (e) => {
      const data: WorkflowEvent = JSON.parse(e.data);

      setEvents((prev) => [...prev, data]);
    };

    return () => {
      es.close();
    };
  }, []);

  return events;
}
