import { useCallback, useEffect, useState, useRef } from "react";
import { getConsultationConcern, type ConsultationConcern } from "@/api/concern";

export function useConsultationConcern(consultationId: number | null | undefined) {
  const [data, setData] = useState<ConsultationConcern | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  const fetchConcern = useCallback(async () => {
    console.log("[hook] consultationId:", consultationId);

    if (consultationId == null) return;

    // 이전 요청이 있으면 중단
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    setLoading(true);
    setError(null);

    try {
      const d = await getConsultationConcern(consultationId, ac.signal);
      if (ac.signal.aborted) return; // 중단된 요청이면 state 업데이트 스킵
      setData(d);
    } catch (e) {
      if (ac.signal.aborted) return;
      const msg = e instanceof Error ? e.message : "Unknown error";
      setError(msg);
    } finally {
      if (!ac.signal.aborted) setLoading(false);
    }
  }, [consultationId]);

  useEffect(() => {
    void fetchConcern();
    return () => abortRef.current?.abort();
  }, [fetchConcern]);

  return { data, loading, error, refetch: fetchConcern };
}

// get ConsultationSolution

import { getConsultationSolution } from "@/api/solution";

export function useConsultationSolution(consultationId: number | null | undefined) {
  const [solution, setSolution] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  const fetchSolution = useCallback(async () => {
    if (consultationId == null) return;

    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    setLoading(true);
    setError(null);

    try {
      const html = await getConsultationSolution(consultationId, ac.signal);
      if (ac.signal.aborted) return;
      setSolution(html);
    } catch (e) {
      if (ac.signal.aborted) return;
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      if (!ac.signal.aborted) setLoading(false);
    }
  }, [consultationId]);

  useEffect(() => {
    void fetchSolution();
    return () => abortRef.current?.abort();
  }, [fetchSolution]);

  return { solution, loading, error, refetch: fetchSolution };
}
