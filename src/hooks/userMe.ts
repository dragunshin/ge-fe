import { useCallback, useEffect, useRef, useState } from "react";
import { getUserMe, type UserMe } from "@/api/mypage";

export function useMe() {
  const [me, setMe] = useState<UserMe | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  const fetchMe = useCallback(async () => {
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    setLoading(true);
    setError(null);

    try {
      const d = await getUserMe({ signal: ac.signal });
      if (ac.signal.aborted) return;
      setMe(d);
    } catch (e) {
      if (ac.signal.aborted) return;
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      if (!ac.signal.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchMe();
    return () => abortRef.current?.abort();
  }, [fetchMe]);

  return { me, loading, error, refetch: fetchMe };
}
