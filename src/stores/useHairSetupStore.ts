import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

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

type State = {
  // Step1(=2/9)
  sidePhotoKeys: { LEFT?: string; RIGHT?: string };

  // Step2(=5/9)
  desiredTags: DesiredTag[];
  desiredOtherText: string;

  // Step3(=9/9)
  questionText: string; // 0~400
  referenceImageKeys: string[]; // max 3

  // actions
  setSidePhotoKey: (side: Side, key: string) => void;
  removeSidePhotoKey: (side: Side) => void;

  toggleDesiredTag: (tag: DesiredTag) => void;
  setDesiredOtherText: (text: string) => void;

  setQuestionText: (text: string) => void;

  addReferenceKey: (key: string) => void;
  removeReferenceKey: (key: string) => void;

  resetAll: () => void;
};

const MAX_REF = 3;
const STORAGE_KEY = "style-setup-v1";

export const useStyleSetupStore = create<State>()(
  persist(
    (set, get) => ({
      sidePhotoKeys: {},
      desiredTags: ["귀여움"],
      desiredOtherText: "",
      questionText: "",
      referenceImageKeys: [],

      setSidePhotoKey: (side, key) =>
        set((s) => ({ sidePhotoKeys: { ...s.sidePhotoKeys, [side]: key } })),

      removeSidePhotoKey: (side) =>
        set((s) => {
          const next = { ...s.sidePhotoKeys };
          delete next[side];
          return { sidePhotoKeys: next };
        }),

      toggleDesiredTag: (tag) =>
        set((s) => {
          const exists = s.desiredTags.includes(tag);
          const next = exists ? s.desiredTags.filter((t) => t !== tag) : [...s.desiredTags, tag];

          // "기타" 토글 해제 시 기타 입력도 같이 비우고 싶으면 아래 유지
          const desiredOtherText = tag === "기타" && exists ? "" : s.desiredOtherText;

          return { desiredTags: next, desiredOtherText };
        }),

      setDesiredOtherText: (text) => set({ desiredOtherText: text }),

      setQuestionText: (text) => set({ questionText: text.slice(0, 400) }),

      addReferenceKey: (key) =>
        set((s) => {
          if (s.referenceImageKeys.includes(key)) return s;
          if (s.referenceImageKeys.length >= MAX_REF) return s;
          return { referenceImageKeys: [...s.referenceImageKeys, key] };
        }),

      removeReferenceKey: (key) =>
        set((s) => ({
          referenceImageKeys: s.referenceImageKeys.filter((k) => k !== key),
        })),

      resetAll: () =>
        set({
          sidePhotoKeys: {},
          desiredTags: ["귀여움"],
          desiredOtherText: "",
          questionText: "",
          referenceImageKeys: [],
        }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        sidePhotoKeys: s.sidePhotoKeys,
        desiredTags: s.desiredTags,
        desiredOtherText: s.desiredOtherText,
        questionText: s.questionText,
        referenceImageKeys: s.referenceImageKeys,
      }),
      version: 1,
    },
  ),
);
