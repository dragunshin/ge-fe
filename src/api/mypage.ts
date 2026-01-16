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
