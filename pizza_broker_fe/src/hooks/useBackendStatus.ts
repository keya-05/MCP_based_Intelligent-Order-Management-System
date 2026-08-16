import { useEffect, useState } from "react";
import { askShopAgent } from "../lib/api";

export type BackendStatus = "checking" | "online" | "offline";

const POLL_INTERVAL_MS = 30_000;

export function useBackendStatus() {
  const [status, setStatus] = useState<BackendStatus>("checking");

  useEffect(() => {
    let cancelled = false;

    const ping = async () => {
      try {
        await askShopAgent("__ping__");
        if (!cancelled) setStatus("online");
      } catch {
        if (!cancelled) setStatus("offline");
      }
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
