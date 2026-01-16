const API_BASE = import.meta.env.VITE_API_BASE_URL;

export async function postHairConcern(reservationId: number, body: unknown) {
  const res = await fetch(`${API_BASE}/reservations/${reservationId}/hair-concern`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`hair-concern 저장 실패: ${res.status} ${text}`);
  }

  return res.json();
}
