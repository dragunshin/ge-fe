// import { create } from "zustand";
// import { createJSONStorage, persist } from "zustand/middleware";

// type Side = "LEFT" | "RIGHT";

// export type DesiredTag =
//   | "섹시함"
//   | "단정함"
//   | "귀여움"
//   | "남자다움"
//   | "신뢰를 주는"
//   | "화려한"
//   | "자연스러움"
//   | "기타";

// export type FaceStrengthTag = "눈" | "눈썹" | "코" | "입" | "얼굴형" | "이미지 조화" | "모르겠음";

// export type FaceCoverTag =
//   | "눈"
//   | "눈썹"
//   | "코"
//   | "입"
//   | "얼굴형"
//   | "이미지 조화"
//   | "턱"
//   | "광대"
//   | "모르겠음";

// type State = {
//   // Step1(=2/9)
//   sidePhotoKeys: { LEFT?: string; RIGHT?: string };

//   // Step2(=5/9)
//   desiredTags: DesiredTag[];
//   desiredOtherText: string;

//   // ✅ New: 4/7 (얼굴 장점)
//   faceStrengthTags: FaceStrengthTag[];
//   faceStrengthOtherText: string;

//   // ✅ New: 5/7 (커버하고 싶은 부분)
//   faceCoverTags: FaceCoverTag[];
//   faceCoverOtherText: string;

//   // Step3(=9/9)
//   questionText: string; // 0~400
//   referenceImageKeys: string[]; // max 3

//   // actions
//   setSidePhotoKey: (side: Side, key: string) => void;
//   removeSidePhotoKey: (side: Side) => void;

//   toggleDesiredTag: (tag: DesiredTag) => void;
//   setDesiredOtherText: (text: string) => void;

//   // ✅ New actions
//   toggleFaceStrengthTag: (tag: FaceStrengthTag) => void;
//   setFaceStrengthOtherText: (text: string) => void;

//   toggleFaceCoverTag: (tag: FaceCoverTag) => void;
//   setFaceCoverOtherText: (text: string) => void;

//   setQuestionText: (text: string) => void;

//   addReferenceKey: (key: string) => void;
//   removeReferenceKey: (key: string) => void;

//   resetAll: () => void;
// };

// const MAX_REF = 3;
// const STORAGE_KEY = "style-setup-v1";

// function toggleWithExclusiveUnknown<T extends string>(current: T[], tag: T, unknownTag: T) {
//   const exists = current.includes(tag);

//   // "모르겠음"은 단독 선택
//   if (tag === unknownTag) {
//     return exists ? ([] as T[]) : ([unknownTag] as T[]);
//   }

//   // 일반 태그 토글
//   let next = exists ? current.filter((t) => t !== tag) : [...current, tag];

//   // 일반 태그 선택 시 "모르겠음" 자동 해제
//   next = next.filter((t) => t !== unknownTag);

//   return next;
// }

// export const useStyleSetupStore = create<State>()(
//   persist(
//     (set) => ({
//       sidePhotoKeys: {},

//       desiredTags: ["귀여움"],
//       desiredOtherText: "",

//       // ✅ defaults
//       faceStrengthTags: [],
//       faceStrengthOtherText: "",
//       faceCoverTags: [],
//       faceCoverOtherText: "",

//       questionText: "",
//       referenceImageKeys: [],

//       setSidePhotoKey: (side, key) =>
//         set((s) => ({ sidePhotoKeys: { ...s.sidePhotoKeys, [side]: key } })),

//       removeSidePhotoKey: (side) =>
//         set((s) => {
//           const next = { ...s.sidePhotoKeys };
//           delete next[side];
//           return { sidePhotoKeys: next };
//         }),

//       toggleDesiredTag: (tag) =>
//         set((s) => {
//           const exists = s.desiredTags.includes(tag);
//           const next = exists ? s.desiredTags.filter((t) => t !== tag) : [...s.desiredTags, tag];

//           // "기타" 토글 해제 시 기타 입력도 같이 비움
//           const desiredOtherText = tag === "기타" && exists ? "" : s.desiredOtherText;

//           return { desiredTags: next, desiredOtherText };
//         }),

//       setDesiredOtherText: (text) => set({ desiredOtherText: text }),

//       // ✅ New: 얼굴 장점
//       toggleFaceStrengthTag: (tag) =>
//         set((s) => ({
//           faceStrengthTags: toggleWithExclusiveUnknown(s.faceStrengthTags, tag, "모르겠음"),
//         })),

//       setFaceStrengthOtherText: (text) => set({ faceStrengthOtherText: text }),

//       // ✅ New: 커버하고 싶은 부분
//       toggleFaceCoverTag: (tag) =>
//         set((s) => ({
//           faceCoverTags: toggleWithExclusiveUnknown(s.faceCoverTags, tag, "모르겠음"),
//         })),

//       setFaceCoverOtherText: (text) => set({ faceCoverOtherText: text }),

//       setQuestionText: (text) => set({ questionText: text.slice(0, 400) }),

//       addReferenceKey: (key) =>
//         set((s) => {
//           if (s.referenceImageKeys.includes(key)) return s;
//           if (s.referenceImageKeys.length >= MAX_REF) return s;
//           return { referenceImageKeys: [...s.referenceImageKeys, key] };
//         }),

//       removeReferenceKey: (key) =>
//         set((s) => ({
//           referenceImageKeys: s.referenceImageKeys.filter((k) => k !== key),
//         })),

//       resetAll: () =>
//         set({
//           sidePhotoKeys: {},

//           desiredTags: ["귀여움"],
//           desiredOtherText: "",

//           faceStrengthTags: [],
//           faceStrengthOtherText: "",
//           faceCoverTags: [],
//           faceCoverOtherText: "",

//           questionText: "",
//           referenceImageKeys: [],
//         }),
//     }),
//     {
//       name: STORAGE_KEY,
//       storage: createJSONStorage(() => localStorage),
//       partialize: (s) => ({
//         sidePhotoKeys: s.sidePhotoKeys,

//         desiredTags: s.desiredTags,
//         desiredOtherText: s.desiredOtherText,

//         faceStrengthTags: s.faceStrengthTags,
//         faceStrengthOtherText: s.faceStrengthOtherText,
//         faceCoverTags: s.faceCoverTags,
//         faceCoverOtherText: s.faceCoverOtherText,

//         questionText: s.questionText,
//         referenceImageKeys: s.referenceImageKeys,
//       }),
//       version: 2,
//       migrate: (persisted: any, version) => {
//         if (version === 1) {
//           return {
//             ...persisted,
//             faceStrengthTags: [],
//             faceStrengthOtherText: "",
//             faceCoverTags: [],
//             faceCoverOtherText: "",
//           };
//         }
//         return persisted;
//       },
//     },
//   ),
// );
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

/** ===== Types ===== */
type Side = "LEFT" | "RIGHT";

export type DesiredTag =
  | "섹시함"
  | "단정함"
  | "귀여움"
  | "남자다움"
  | "신뢰를 주는"
  | "화려한"
  | "자연스러움"
  | "기타";

export type FaceStrengthTag = "눈" | "눈썹" | "코" | "입" | "얼굴형" | "이미지 조화" | "모르겠음";

export type FaceCoverTag =
  | "눈"
  | "눈썹"
  | "코"
  | "입"
  | "얼굴형"
  | "이미지 조화"
  | "턱"
  | "광대"
  | "모르겠음";

export type HairImageType = "hairstyle" | "front" | "left" | "right" | "favorite" | "difficulty";
type HairImages = Record<HairImageType, string[]>;

type State = {
  /** ===== Legacy/Compatibility ===== */
  sidePhotoKeys: { LEFT?: string; RIGHT?: string };

  desiredTags: DesiredTag[];
  desiredOtherText: string;

  questionText: string; // 0~400
  referenceImageKeys: string[]; // max 3 (legacy: favorite로 매핑 가능)

  /** ===== New (API 스펙과 동일하게) ===== */
  faceStrengthTags: FaceStrengthTag[];
  faceStrengthOtherText: string;

  faceCoverTags: FaceCoverTag[];
  faceCoverOtherText: string;

  images: HairImages;

  /** ===== actions (legacy) ===== */
  setSidePhotoKey: (side: Side, key: string) => void;
  removeSidePhotoKey: (side: Side) => void;

  toggleDesiredTag: (tag: DesiredTag) => void;
  setDesiredOtherText: (text: string) => void;

  setQuestionText: (text: string) => void;

  addReferenceKey: (key: string) => void;
  removeReferenceKey: (key: string) => void;

  /** ===== actions (new) ===== */
  toggleFaceStrengthTag: (tag: FaceStrengthTag) => void;
  setFaceStrengthOtherText: (text: string) => void;

  toggleFaceCoverTag: (tag: FaceCoverTag) => void;
  setFaceCoverOtherText: (text: string) => void;

  /** 이미지 저장 (API 스펙 그대로) */
  setSingleImage: (type: Exclude<HairImageType, "favorite" | "difficulty">, key: string) => void;
  clearSingleImage: (type: Exclude<HairImageType, "favorite" | "difficulty">) => void;

  addImage: (type: "favorite" | "difficulty", key: string, max?: number) => void;
  removeImage: (type: "favorite" | "difficulty", key: string) => void;
  clearImages: (type: HairImageType) => void;

  /** 마지막 제출용 payload */
  buildHairConcernBody: () => {
    hair: {
      faceAdvantages: FaceStrengthTag[];
      faceAdvantagesEtcText: string;
      coveringParts: FaceCoverTag[];
      coveringPartsEtcText: string;
      pursuedImages: DesiredTag[];
      stylingDifficulty: string;
      images: HairImages;
    };
  };

  resetAll: () => void;
};

/** ===== Consts/Helpers ===== */
const STORAGE_KEY = "style-setup-v1";
const VERSION = 3;
const MAX_REF = 3;

const emptyImages = (): HairImages => ({
  hairstyle: [],
  front: [],
  left: [],
  right: [],
  favorite: [],
  difficulty: [],
});

function toggleWithExclusiveUnknown<T extends string>(current: T[], tag: T, unknownTag: T) {
  const exists = current.includes(tag);

  // "모르겠음"은 단독 선택
  if (tag === unknownTag) return exists ? ([] as T[]) : ([unknownTag] as T[]);

  // 일반 태그 토글
  let next = exists ? current.filter((t) => t !== tag) : [...current, tag];

  // 일반 태그 선택 시 "모르겠음" 자동 해제
  next = next.filter((t) => t !== unknownTag);
  return next;
}

function cleanImages(images: HairImages): HairImages {
  return {
    hairstyle: (images.hairstyle ?? []).filter(Boolean),
    front: (images.front ?? []).filter(Boolean),
    left: (images.left ?? []).filter(Boolean),
    right: (images.right ?? []).filter(Boolean),
    favorite: (images.favorite ?? []).filter(Boolean),
    difficulty: (images.difficulty ?? []).filter(Boolean),
  };
}

export const useStyleSetupStore = create<State>()(
  persist(
    (set, get) => ({
      /** legacy 초기값 */
      sidePhotoKeys: {},

      desiredTags: [],
      desiredOtherText: "",

      questionText: "",
      referenceImageKeys: [],

      /** new 초기값 */
      faceStrengthTags: [],
      faceStrengthOtherText: "",
      faceCoverTags: [],
      faceCoverOtherText: "",

      images: emptyImages(),

      /** ===== legacy actions ===== */
      setSidePhotoKey: (side, key) =>
        set((s) => {
          const nextSide = { ...s.sidePhotoKeys, [side]: key };

          // legacy 호환: LEFT/RIGHT는 images.left/right에만 반영
          const nextImages = { ...s.images };
          if (side === "LEFT") nextImages.left = key ? [key] : [];
          if (side === "RIGHT") nextImages.right = key ? [key] : [];

          return { sidePhotoKeys: nextSide, images: nextImages };
        }),

      removeSidePhotoKey: (side) =>
        set((s) => {
          const next = { ...s.sidePhotoKeys };
          delete next[side];

          const nextImages = { ...s.images };
          if (side === "LEFT") nextImages.left = [];
          if (side === "RIGHT") nextImages.right = [];

          return { sidePhotoKeys: next, images: nextImages };
        }),

      toggleDesiredTag: (tag) =>
        set((s) => {
          const exists = s.desiredTags.includes(tag);
          const next = exists ? s.desiredTags.filter((t) => t !== tag) : [...s.desiredTags, tag];

          // "기타" 토글 해제 시 기타 입력도 같이 비우기
          const desiredOtherText = tag === "기타" && exists ? "" : s.desiredOtherText;

          return { desiredTags: next, desiredOtherText };
        }),

      setDesiredOtherText: (text) => set({ desiredOtherText: text }),

      setQuestionText: (text) => set({ questionText: text.slice(0, 400) }),

      addReferenceKey: (key) =>
        set((s) => {
          if (!key) return s;
          if (s.referenceImageKeys.includes(key)) return s;
          if (s.referenceImageKeys.length >= MAX_REF) return s;

          // legacy(referenceImageKeys) + new(images.favorite) 둘 다 유지
          const nextLegacy = [...s.referenceImageKeys, key];
          const fav = s.images.favorite;
          const nextFav =
            fav.includes(key) || fav.length >= MAX_REF ? fav : [...fav, key].slice(0, MAX_REF);

          return {
            referenceImageKeys: nextLegacy,
            images: { ...s.images, favorite: nextFav },
          };
        }),

      removeReferenceKey: (key) =>
        set((s) => ({
          referenceImageKeys: s.referenceImageKeys.filter((k) => k !== key),
          images: { ...s.images, favorite: s.images.favorite.filter((k) => k !== key) },
        })),

      /** ===== new actions ===== */
      toggleFaceStrengthTag: (tag) =>
        set((s) => ({
          faceStrengthTags: toggleWithExclusiveUnknown(s.faceStrengthTags, tag, "모르겠음"),
        })),

      setFaceStrengthOtherText: (text) => set({ faceStrengthOtherText: text }),

      toggleFaceCoverTag: (tag) =>
        set((s) => ({
          faceCoverTags: toggleWithExclusiveUnknown(s.faceCoverTags, tag, "모르겠음"),
        })),

      setFaceCoverOtherText: (text) => set({ faceCoverOtherText: text }),

      setSingleImage: (type, key) =>
        set((s) => ({
          images: { ...s.images, [type]: key ? [key] : [] },
        })),

      clearSingleImage: (type) =>
        set((s) => ({
          images: { ...s.images, [type]: [] },
        })),

      addImage: (type, key, max = MAX_REF) =>
        set((s) => {
          if (!key) return s;
          const cur = s.images[type];
          if (cur.includes(key)) return s;
          if (cur.length >= max) return s;

          const next = [...cur, key];

          // favorite는 legacy(referenceImageKeys)도 같이 맞춰주기
          if (type === "favorite") {
            const nextLegacy = s.referenceImageKeys.includes(key)
              ? s.referenceImageKeys
              : [...s.referenceImageKeys, key].slice(0, max);
            return { images: { ...s.images, favorite: next }, referenceImageKeys: nextLegacy };
          }

          return { images: { ...s.images, [type]: next } };
        }),

      removeImage: (type, key) =>
        set((s) => {
          const next = s.images[type].filter((k) => k !== key);

          if (type === "favorite") {
            return {
              images: { ...s.images, favorite: next },
              referenceImageKeys: s.referenceImageKeys.filter((k) => k !== key),
            };
          }

          return { images: { ...s.images, [type]: next } };
        }),

      clearImages: (type) =>
        set((s) => {
          if (type === "favorite") {
            return { images: { ...s.images, favorite: [] }, referenceImageKeys: [] };
          }
          return { images: { ...s.images, [type]: [] } };
        }),

      /** ===== 제출 payload ===== */
      buildHairConcernBody: () => {
        const s = get();

        // images 정리 + legacy fallback(혹시 UI가 아직 옛 값을 쓴다면)
        const merged: HairImages = cleanImages({
          ...emptyImages(), // ✅ 누락 키 방어
          ...s.images,
          left: s.images.left?.length
            ? s.images.left
            : s.sidePhotoKeys.LEFT
              ? [s.sidePhotoKeys.LEFT]
              : [],
          right: s.images.right?.length
            ? s.images.right
            : s.sidePhotoKeys.RIGHT
              ? [s.sidePhotoKeys.RIGHT]
              : [],
          favorite: s.images.favorite?.length
            ? s.images.favorite
            : s.referenceImageKeys?.length
              ? s.referenceImageKeys
              : [],
        });

        return {
          hair: {
            faceAdvantages: s.faceStrengthTags,
            faceAdvantagesEtcText: s.faceStrengthOtherText,
            coveringParts: s.faceCoverTags,
            coveringPartsEtcText: s.faceCoverOtherText,
            pursuedImages: s.desiredTags,
            stylingDifficulty: s.questionText,
            images: merged,
          },
        };
      },

      /** ===== reset ===== */
      resetAll: () =>
        set({
          sidePhotoKeys: {},

          desiredTags: ["귀여움"],
          desiredOtherText: "",

          questionText: "",
          referenceImageKeys: [],

          faceStrengthTags: [],
          faceStrengthOtherText: "",
          faceCoverTags: [],
          faceCoverOtherText: "",

          images: emptyImages(),
        }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      version: VERSION,
      partialize: (s) => ({
        sidePhotoKeys: s.sidePhotoKeys,

        desiredTags: s.desiredTags,
        desiredOtherText: s.desiredOtherText,

        questionText: s.questionText,
        referenceImageKeys: s.referenceImageKeys,

        faceStrengthTags: s.faceStrengthTags,
        faceStrengthOtherText: s.faceStrengthOtherText,
        faceCoverTags: s.faceCoverTags,
        faceCoverOtherText: s.faceCoverOtherText,

        images: s.images,
      }),
      // ✅ 여기만 고쳤다: v1 -> v3 업그레이드 누적 적용
      migrate: (persisted: any, oldVersion) => {
        let state = { ...persisted };

        if (oldVersion < 2) {
          state = {
            ...state,
            faceStrengthTags: state.faceStrengthTags ?? [],
            faceStrengthOtherText: state.faceStrengthOtherText ?? "",
            faceCoverTags: state.faceCoverTags ?? [],
            faceCoverOtherText: state.faceCoverOtherText ?? "",
          };
        }

        if (oldVersion < 3) {
          state = {
            ...state,
            images: state.images ? { ...emptyImages(), ...state.images } : emptyImages(),
          };
        } else {
          // v3라도 누락 키 방어
          state = {
            ...state,
            images: state.images ? { ...emptyImages(), ...state.images } : emptyImages(),
          };
        }

        return state;
      },
    },
  ),
);

/** ===== persist helpers =====
 *  컴포넌트에서 (as any) 안 쓰려고, 여기서만 안전하게 캐스팅 처리
 */
type PersistApi = {
  clearStorage?: () => void | Promise<void>;
};

function getPersistApi(): PersistApi {
  return (useStyleSetupStore as unknown as { persist?: PersistApi }).persist ?? {};
}

/** persist(localStorage)만 비우기 */
export async function clearStyleSetupPersist() {
  await getPersistApi().clearStorage?.();
  // 보험: 혹시 clearStorage가 안 먹는 환경이면 직접 제거
  localStorage.removeItem(STORAGE_KEY);
}

/** 메모리 상태 + persist(localStorage)까지 한 번에 초기화 */
export async function resetStyleSetupAll() {
  useStyleSetupStore.getState().resetAll();
  await clearStyleSetupPersist();
}
