// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// export type ApiEnvelope<T> = {
//   statusCode: number;
//   message: string;
//   data: T;
// };

// export type HairConcern = {
//   hair: {
//     faceAdvantages: string[];
//     faceAdvantagesEtcText: string;
//     coveringParts: string[];
//     coveringPartsEtcText: string;
//     pursuedImages: string[];
//     stylingDifficulty: string;
//     images: {
//       hairstyle: string[];
//       front: string[];
//       left: string[];
//       right: string[];
//       favorite: string[];
//       difficulty: string[];
//     };
//   };
// };

// // ✅ 서버 응답 변경: data 안에 nickname, concernsJson
// export type ConsultationConcernRes = {
//   nickname: string;
//   concernsJson: string; // 서버가 "string"으로 준다고 했으니 우선 string으로
// };

// // 필요하면 화면에서 같이 쓰기 좋게 합친 타입
// export type ConsultationConcern = { nickname: string } & HairConcern;

// // ✅ key -> 실제 이미지 URL로 변환 (프로젝트 상황에 맞게 1곳에서만 처리)
// export function resolveImageUrl(keyOrUrl: string) {
//   if (/^https?:\/\//i.test(keyOrUrl)) return keyOrUrl;

//   const PUBLIC_IMAGE_BASE = import.meta.env.VITE_PUBLIC_IMAGE_BASE_URL as string | undefined;
//   if (PUBLIC_IMAGE_BASE) {
//     return `${PUBLIC_IMAGE_BASE.replace(/\/$/, "")}/${encodeURI(keyOrUrl)}`;
//   }

//   const FILE_PROXY = import.meta.env.VITE_FILE_PROXY_URL as string | undefined;
//   if (FILE_PROXY) {
//     return `${FILE_PROXY}?key=${encodeURIComponent(keyOrUrl)}`;
//   }

//   return keyOrUrl;
// }

// export async function getConsultationConcern(
//   consultationId: number,
//   signal?: AbortSignal,
// ): Promise<ConsultationConcern> {
//   const res = await fetch(`${API_BASE_URL}/consultations/${consultationId}/concern`, {
//     method: "GET",
//     credentials: "include",
//     signal,
//     headers: { "Content-Type": "application/json" },
//   });

//   if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);

//   const json = await res.json();

//   // 🔍 [디버깅] 1. 서버 원본 응답 확인
//   console.log("🔍 [1. Raw Response]:", json);

//   if (json.statusCode !== 0) {
//     throw new Error(json.message || "API Error (Non-zero status)");
//   }

//   const payload = json.data;

//   // 🔍 [디버깅] 2. payload 확인
//   console.log("🔍 [2. Payload]:", payload, "Type:", typeof payload);

//   // payload가 없는 경우
//   if (!payload) {
//     throw new Error("데이터가 비어있습니다 (payload is null/undefined)");
//   }

//   const { nickname, concernsJson } = payload;

//   // 🔍 [디버깅] 3. 필드 타입 확인
//   console.log("[3. Fields]:", {
//     nickname,
//     nicknameType: typeof nickname,
//     concernsJsonType: typeof concernsJson,
//   });

//   // 4. 엄격한 타입 체크 (여기서 걸리는지 확인)
//   if (typeof nickname !== "string") {
//     // 닉네임이 없으면 에러 대신 빈 문자열로 처리하고 넘어갈 수도 있습니다.
//     // throw new Error(`닉네임 형식이 잘못되었습니다. (received: ${typeof nickname})`);
//     console.warn("닉네임이 문자열이 아닙니다:", nickname);
//   }

//   if (typeof concernsJson !== "string") {
//     // 만약 객체로 이미 변환되어 들어왔다면 바로 사용하도록 허용
//     if (typeof concernsJson === "object" && concernsJson !== null) {
//       console.log("concernsJson이 이미 객체입니다.");
//       return { nickname: nickname || "알 수 없음", ...concernsJson };
//     }
//     throw new Error(`concernsJson 형식이 잘못되었습니다. (received: ${typeof concernsJson})`);
//   }

//   // 5. JSON 파싱 시도
//   try {
//     const parsed = JSON.parse(concernsJson);
//     console.log("🔍 [4. Parsed JSON]:", parsed);

//     if (!parsed.hair) {
//       throw new Error("파싱된 데이터에 'hair' 필드가 없습니다.");
//     }

//     return {
//       nickname: nickname || "알 수 없음",
//       ...parsed,
//     };
//   } catch (e) {
//     console.error("❌ JSON Parse Error:", e);
//     throw new Error(`concernsJson 파싱 실패: ${e instanceof Error ? e.message : String(e)}`);
//   }
// }

// src/api/concern.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export type ApiEnvelope<T> = {
  statusCode: number;
  message: string;
  data: T;
};

export type ConsultationConcernRes = {
  nickname: string;
  concernsJson: string;
};

/** HAIR payload */
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

/** FASHION payload */
export type FashionConcern = {
  fashion: {
    height: number;
    weight: number;
    topSize: string;
    bottomSize: string;
    bodyTypeDisadvantages: string[];
    bodyTypeEtcText: string;

    styleColors: string[];
    styleFits: string[];
    styleImages: string[];
    styleEtcText: string;

    outfitItems: string[];
    outfitPriceRange: { minPrice: number; maxPrice: number };
    outfitEtcText: string;

    images: {
      front: string[];
      left: string[];
      right: string[];
      favorite: string[];
      purpose: string[];
    };
  };
};

export type ConcernType = "HAIR" | "FASHION";

export type ConcernJson =
  | (HairConcern & { type: "HAIR" })
  | (FashionConcern & { type: "FASHION" })
  | { type?: string; hair?: HairConcern["hair"]; fashion?: FashionConcern["fashion"] };

export type ConsultationConcern = { nickname: string } & ConcernJson;

// ✅ key -> 실제 이미지 URL로 변환
export function resolveImageUrl(keyOrUrl: string) {
  if (/^https?:\/\//i.test(keyOrUrl)) return keyOrUrl;

  const PUBLIC_IMAGE_BASE = import.meta.env.VITE_PUBLIC_IMAGE_BASE_URL as string | undefined;
  if (PUBLIC_IMAGE_BASE) {
    return `${PUBLIC_IMAGE_BASE.replace(/\/$/, "")}/${encodeURI(keyOrUrl)}`;
  }

  const FILE_PROXY = import.meta.env.VITE_FILE_PROXY_URL as string | undefined;
  if (FILE_PROXY) {
    return `${FILE_PROXY}?key=${encodeURIComponent(keyOrUrl)}`;
  }

  return keyOrUrl;
}

export async function getConsultationConcern(
  consultationId: number,
  signal?: AbortSignal,
): Promise<ConsultationConcern> {
  const res = await fetch(`${API_BASE_URL}/consultations/${consultationId}/concern`, {
    method: "GET",
    credentials: "include",
    signal,
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error(`Concern fetch failed: ${res.status}`);

  const json = (await res.json()) as ApiEnvelope<ConsultationConcernRes>;
  if (json.statusCode !== 0) throw new Error(json.message || "API error");

  const nickname = json.data?.nickname;
  const concernsJson = json.data?.concernsJson;

  if (typeof nickname !== "string" || typeof concernsJson !== "string") {
    throw new Error("Invalid concern payload");
  }

  let parsed: any;
  try {
    parsed = JSON.parse(concernsJson);
  } catch {
    throw new Error("Invalid concernsJson payload");
  }

  if (!parsed || typeof parsed !== "object") throw new Error("Invalid concernsJson payload");

  // ✅ type 보정 (서버가 type 안 주는 경우 대비)
  if (typeof parsed.type !== "string") {
    if (parsed.hair) parsed.type = "HAIR";
    else if (parsed.fashion) parsed.type = "FASHION";
  }

  if (!parsed.hair && !parsed.fashion) throw new Error("Invalid concernsJson payload");

  return { nickname, ...parsed } as ConsultationConcern;
}
