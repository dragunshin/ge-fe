const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export type ApiEnvelope<T> = {
  statusCode: number;
  message: string;
  data: T;
};

export async function postConsultationSolution(
  consultationId: number,
  solution: string,
  signal?: AbortSignal,
): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/consultations/${consultationId}/solution`, {
    method: "POST",
    credentials: "include",
    signal,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ solution }),
  });

  if (!res.ok) throw new Error(`Solution submit failed: ${res.status}`);

  const text = await res.text();
  if (!text) return;

  let json: ApiEnvelope<unknown>;
  try {
    json = JSON.parse(text) as ApiEnvelope<unknown>;
  } catch {
    // 응답이 JSON이 아니어도(예: 빈/텍스트) 성공으로 처리하고 싶으면 return;
    throw new Error("Invalid solution response");
  }

  if (json.statusCode !== 0) throw new Error(json.message || "API error");
}

export async function getConsultationSolution(
  consultationId: number,
  signal?: AbortSignal,
): Promise<string> {
  const res = await fetch(`${API_BASE_URL}/consultations/${consultationId}/solution`, {
    method: "GET",
    credentials: "include",
    signal,
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error(`Solution fetch failed: ${res.status}`);

  // 서버가 항상 JSON이라면 그대로 json()
  const json = (await res.json()) as ApiEnvelope<unknown>;
  if (json.statusCode !== 0) throw new Error(json.message || "API error");

  if (typeof json.data !== "string") throw new Error("Invalid solution payload");
  return json.data;
}
