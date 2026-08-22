import { useEffect, useState } from "react";
import { checkHealth } from "../lib/api";

export type BackendStatus = "checking" | "online" | "offline";

const POLL_INTERVAL_MS = 30_000;

export function useBackendStatus() {
  const [status, setStatus] = useState<BackendStatus>("checking");

  useEffect(() => {
    let cancelled = false;

    const ping = async () => {
      const ok = await checkHealth();
      if (!cancelled) setStatus(ok ? "online" : "offline");
    };

    ping();
    const interval = setInterval(ping, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return status;
}
