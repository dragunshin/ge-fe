// src/api/mypage.ts (추가)

// ✅ 서버 응답 래퍼
type ApiEnvelope<T> = {
  statusCode: number;
  message: string;
  data: T;
};

export type ExpertConsultationHistoryItem = {
  consultationId: number;
  reservationId: number;
  chatroomId: number;
  memberUserId: number;
  memberNickname: string;
  memberProfileImage?: string | null;
  category: "HAIR" | "SKINCARE" | "FASHION" | "MAKEUP";
  consultationType: "MESSAGE" | "TIME_LIMITED";
  consultationDate: string; // ISO
  price: number;
  solutionWritten: boolean;
  reviewWritten: boolean;
  dayOfWeek?: string; // 서버가 주면 사용(없으면 date로 계산)
};

// ✅ 프로젝트에 이미 쓰는 base url 규칙이 있으면 여기만 맞춰주세요.
const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL ?? "";

// ✅ 토큰/쿠키 정책에 맞게 headers/credentials 조정
async function apiGet<T>(path: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    signal,
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const json = (await res.json()) as ApiEnvelope<T>;
  if (json.statusCode !== 0) throw new Error(json.message || "API Error");

  return json.data;
}

export function getExpertConsultationsHistory(opts?: { signal?: AbortSignal }) {
  return apiGet<ExpertConsultationHistoryItem[]>("/consultations/expert/history", opts?.signal);
}

async function apiPut<TReq, TRes>(path: string, body: TReq, signal?: AbortSignal): Promise<TRes> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    signal,
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const json = (await res.json()) as ApiEnvelope<TRes>;
  if (json.statusCode !== 0) throw new Error(json.message || "API Error");

  return json.data;
}

/** =========================
 *  Expert Schedules API
 *  ========================= */

export type ConsultationType = "VIDEO" | "MESSAGE";

export type ExpertSchedule = {
  consultationType: ConsultationType;
  price: number;
  isActive: boolean;
};

/**
 * GET /api/expert/{userId}/schedules
 * res.data: ExpertSchedule[]
 */
export function getExpertSchedules(userId: string, opts?: { signal?: AbortSignal }) {
  return apiGet<ExpertSchedule[]>(`/expert/${userId}/schedules`, opts?.signal);
}

/**
 * PUT /api/expert/schedules
 * req: { schedules: ExpertSchedule[] }
 * res.data: unknown (서버 스펙에 따라 바뀔 수 있어 unknown으로 둠)
 */
export function putExpertSchedules(schedules: ExpertSchedule[], opts?: { signal?: AbortSignal }) {
  return apiPut<{ schedules: ExpertSchedule[] }, unknown>(
    `/expert/schedules`,
    { schedules },
    opts?.signal,
  );
}
