export type ApiResponse<T> = {
  statusCode: number;
  message: string;
  data: T;
};

export type UserType = "MEMBER" | "EXPERT" | string;

export type UserMe = {
  userId: number;
  userType: UserType;
  nickname: string;
  expertLikeCount: number;
  points: number;
  reviewCount: number;

  profileImageUrl?: string | null;
};

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");

export async function getUserMe(opts?: { signal?: AbortSignal }): Promise<UserMe> {
  const res = await fetch(`${API_BASE_URL}/user/me`, {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    signal: opts?.signal,
  });

  if (!res.ok) {
    throw new Error(`GET /api/user/me failed (${res.status})`);
  }

  const json = (await res.json()) as ApiResponse<UserMe>;

  // statusCode가 0이 성공이라는 전제
  //   if (json.statusCode !== 0) {
  //     throw new Error(json.message || "Failed to fetch user info");
  //   }

  return json.data;
}

export async function myPageLogout(opts?: { signal?: AbortSignal }): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
    signal: opts?.signal,
  });

  if (!res.ok) {
    throw new Error(`POST /api/auth/logout failed (${res.status})`);
  }

  // 응답이 JSON일 수도 / 비어있을 수도 있어서 안전 처리
  // const json = (await res.json().catch(() => null)) as ApiResponse<Record<string, never>> | null;

  // if (json && typeof json.statusCode === "number" && json.statusCode !== 0) {
  //   throw new Error(json.message || "Logout failed");
  // }
}

// 예약 내역 + 상담 API

export type ReservationHistoryItem = {
  reservationId: number;
  consultationId: number;
  expertName: string;
  expertProfileImage: string;
  category: "HAIR" | "SKINCARE" | "FASHION" | "MAKEUP" | string;
  consultationType: "MESSAGE" | "TIME_LIMITED" | string;
  scheduledDateTime: string; // ISO
  price: number;
  status: string;
  isPast: boolean;
  canCancel: boolean;
  canRequestRefund: boolean;
  createdAt: string;
};

export type ReservationsHistoryData = {
  unpaidReservations: ReservationHistoryItem[];
  upcomingReservations: ReservationHistoryItem[];
};

export async function getReservationsHistory(opts?: {
  signal?: AbortSignal;
}): Promise<ReservationsHistoryData> {
  const res = await fetch(`${API_BASE_URL}/reservations/history`, {
    method: "GET",
    credentials: "include",
    headers: { Accept: "application/json" },
    signal: opts?.signal,
  });

  if (!res.ok) throw new Error(`GET /api/reservations/history failed (${res.status})`);

  const json = (await res.json()) as ApiResponse<ReservationsHistoryData>;
  if (json.statusCode !== 0)
    throw new Error(json.message || "Failed to fetch reservations history");

  return json.data;
}

export type ConsultationHistoryItem = {
  consultationId: number;
  reservationId: number;
  expertNickname: string;
  expertProfileImage: string;
  category: "HAIR" | "SKINCARE" | "FASHION" | "MAKEUP" | string;
  consultationType: "MESSAGE" | "TIME_LIMITED" | string;
  consultationDate: string; // ISO
  price: number;
  expertLikeCount: number;
  canWriteReview: boolean;
  reviewWritten: boolean;
  dayOfWeek: string; // 서버가 주지만, 프론트에서 date 기반으로도 계산 가능
  expertUserId: string;
};

export async function getConsultationsHistory(opts?: {
  signal?: AbortSignal;
}): Promise<ConsultationHistoryItem[]> {
  const res = await fetch(`${API_BASE_URL}/consultations/history`, {
    method: "GET",
    credentials: "include",
    headers: { Accept: "application/json" },
    signal: opts?.signal,
  });

  if (!res.ok) throw new Error(`GET /api/consultations/history failed (${res.status})`);

  const json = (await res.json()) as ApiResponse<ConsultationHistoryItem[]>;
  if (json.statusCode !== 0)
    throw new Error(json.message || "Failed to fetch consultations history");

  return json.data;
}

// payments

export type PaymentStatus = "UNPAID" | "PAID" | "CANCELED" | string;
export type PaymentCategory = "HAIR" | "MAKEUP" | "SKINCARE" | "FASHION" | string;
export type ConsultationType = "MESSAGE" | "VIDEO" | "TIME_LIMITED" | string;

export type PaymentItem = {
  reservationId: number;
  confirmedDate: string; // ISO
  expertNickname: string;
  category: PaymentCategory;
  consultationType: ConsultationType;
  cost: number;
  status: PaymentStatus;
};

export type PaymentsList = {
  listCount: number;
  payments: PaymentItem[];
};

type ApiResponse3 = {
  statusCode: number;
  message: string;
  data: PaymentsList;
};

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL ?? ""; // 없으면 상대경로로 호출

export async function getReservationPayments(signal?: AbortSignal): Promise<PaymentsList> {
  const res = await fetch(`${API_BASE}/reservations/payments`, {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    signal,
  });

  if (!res.ok) {
    throw new Error(`결제 내역 조회 실패 (HTTP ${res.status})`);
  }

  const json = (await res.json()) as ApiResponse3;

  if (!json || typeof json !== "object") throw new Error("서버 응답이 올바르지 않습니다.");
  if (json.statusCode !== 0) throw new Error(json.message || "요청이 실패했습니다.");

  return json.data ?? { listCount: 0, payments: [] };
}

// onsultationsSolutions

export type ConsultationSolutionApiItem = {
  consultationId: number;
  date: string; // ISO
  expertName: string;
  category: "HAIR" | "MAKEUP" | "SKINCARE" | "FASHION" | string;
  consultationType: "MESSAGE" | "TIME_LIMITED" | string;
  expertUserId: string;
};

type ConsultationSolutionsApiResponse = {
  statusCode: number;
  message: string;
  data: ConsultationSolutionApiItem[];
};

export async function getConsultationsSolutions(opts?: { signal?: AbortSignal }) {
  const res = await fetch(`${API_BASE}/consultations/solutions`, {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    signal: opts?.signal,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to fetch solutions (${res.status}): ${text}`);
  }

  const json = (await res.json()) as ConsultationSolutionsApiResponse;
  return json.data ?? [];
}

// mypage/points/history

export type PointHistoryApiItem = {
  date: string; // ISO
  point_amount: number;
  description: string;
};

export type PointsHistoryResponse = {
  totalPoints: number;
  history: PointHistoryApiItem[];
};

type ApiEnvelope<T> = {
  statusCode: number;
  message: string;
  data: T;
};

export async function getUserPointsHistory(opts?: { signal?: AbortSignal }) {
  const res = await fetch(`${API_BASE}/user/points/history`, {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    signal: opts?.signal,
  });

  if (!res.ok) throw new Error(`포인트 내역 조회 실패 (HTTP ${res.status})`);

  const json = (await res.json()) as ApiEnvelope<PointsHistoryResponse>;
  if (json.statusCode !== 0) throw new Error(json.message || "요청 실패");

  return json.data;
}

// 예약취소

async function apiPost<T>(path: string, body?: unknown, signal?: AbortSignal): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: body === undefined ? undefined : JSON.stringify(body),
    signal,
  });

  // 응답이 비어있는(204 등) 케이스도 대비
  const text = await res.text();
  const json = text ? (JSON.parse(text) as ApiEnvelope<T> | T) : null;

  if (!res.ok) {
    const msg = (json as any)?.message ?? `HTTP ${res.status} ${res.statusText || ""}`.trim();
    throw new Error(msg);
  }

  // Envelope 형태면 statusCode 체크
  if (json && typeof (json as any).statusCode === "number") {
    const env = json as ApiEnvelope<T>;
    if (env.statusCode !== 0) throw new Error(env.message || "API error");
    return env.data;
  }

  // envelope가 아닌 경우(혹시 서버가 plain json/empty 반환)
  return (json as T) ?? (undefined as T);
}

export async function cancelReservation(
  reservationId: number,
  opts?: { signal?: AbortSignal },
): Promise<void> {
  await apiPost<null>(`/reservations/${reservationId}/cancel`, undefined, opts?.signal);
}
