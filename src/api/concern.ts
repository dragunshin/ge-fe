// src/api/consultationConcern.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export type ApiEnvelope<T> = {
  statusCode: number;
  message: string;
  data: T;
};

export type HairConcern = {
  hair: {
    faceAdvantages: string[];
    faceAdvantagesEtcText: string;
    coveringParts: string[];
    coveringPartsEtcText: string;
    pursuedImages: string[];
    stylingDifficulty: string;
    images: {
      hairstyle: string[];
      front: string[];
      left: string[];
      right: string[];
      favorite: string[];
      difficulty: string[];
    };
  };
};

// ✅ key -> 실제 이미지 URL로 변환 (프로젝트 상황에 맞게 1곳에서만 처리)
export function resolveImageUrl(keyOrUrl: string) {
  // 이미 절대 URL이면 그대로
  if (/^https?:\/\//i.test(keyOrUrl)) return keyOrUrl;

  // 방법 1) CDN/퍼블릭 버킷 베이스 URL이 있다면:
  const PUBLIC_IMAGE_BASE = import.meta.env.VITE_PUBLIC_IMAGE_BASE_URL as string | undefined;
  if (PUBLIC_IMAGE_BASE) {
    // key에 한글/공백이 있을 수 있으니 encodeURI (슬래시는 유지)
    return `${PUBLIC_IMAGE_BASE.replace(/\/$/, "")}/${encodeURI(keyOrUrl)}`;
  }

  // 방법 2) 다운로드 프록시 API가 있다면 (예: /api/files?key=...)
  const FILE_PROXY = import.meta.env.VITE_FILE_PROXY_URL as string | undefined;
  if (FILE_PROXY) {
    return `${FILE_PROXY}?key=${encodeURIComponent(keyOrUrl)}`;
  }

  // 베이스가 없으면 일단 key만 반환 (이미지 깨질 수 있음)
  return keyOrUrl;
}

export async function getConsultationConcern(
  consultationId: number,
  signal?: AbortSignal,
): Promise<HairConcern> {
  const res = await fetch(`${API_BASE_URL}/consultations/${consultationId}/concern`, {
    method: "GET",
    credentials: "include",
    signal,
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error(`Concern fetch failed: ${res.status}`);

  const json = (await res.json()) as ApiEnvelope<unknown>;
  if (json.statusCode !== 0) throw new Error(json.message || "API error");

  // ✅ 핵심: data가 string이면 JSON.parse
  const parsed =
    typeof json.data === "string"
      ? (JSON.parse(json.data) as HairConcern)
      : (json.data as HairConcern);

  // 최소 방어
  if (!parsed?.hair) throw new Error("Invalid concern payload");
  return parsed;
}
