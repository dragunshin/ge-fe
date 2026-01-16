export type CreateReviewRequest = {
  consultationId: number;
  rating: number; // 1~5
  content: string; // 30~1000자
  imageUrls: string[]; // 최대 5개
};

export type CreateReviewResponse = {
  statusCode: number;
  message: string;
  data: {
    reviewId: number;
    consultationId: number;
    message: string;
  };
};

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export async function postReview(payload: CreateReviewRequest): Promise<CreateReviewResponse> {
  const res = await fetch(`${API_BASE}/review`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `리뷰 작성 실패 (HTTP ${res.status})`);
  }

  return (await res.json()) as CreateReviewResponse;
}

export type ApiResponse<T> = {
  statusCode: number;
  message: string;
  data: T;
};

export type ReviewAvailableItem = {
  consultationId: number;
  expertName: string;
  expertProfileImage: string;
  category: "HAIR" | string;
  consultationDate: string; // ISO
  description: string;
};

export type ReviewCompletedItem = {
  reviewId: number;
  consultationDate: string; // ISO
  expertName: string;
  rating: number;
  content: string;
  imageUrls: string[];
  hashtags?: string[];
  createdAt?: string;
};

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `요청 실패 (HTTP ${res.status})`);
  }
  return (await res.json()) as T;
}

export async function getReviewAvailable(): Promise<ApiResponse<ReviewAvailableItem[]>> {
  return await getJson<ApiResponse<ReviewAvailableItem[]>>(`${API_BASE}/review/available`);
}

export async function getReviewCompleted(): Promise<ApiResponse<ReviewCompletedItem[]>> {
  return await getJson<ApiResponse<ReviewCompletedItem[]>>(`${API_BASE}/review/completed`);
}
