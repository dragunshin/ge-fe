import { Check } from "lucide-react";
import TopNav from "./component/TopNav";
import Footer from "./component/Footer";
import { cn } from "@/lib/utils";
import { useStyleSetupStore } from "@/stores/useHairSetupStore";
import type { FaceStrengthTag, FaceCoverTag } from "@/stores/useHairSetupStore";

const STRENGTH_TAGS: FaceStrengthTag[] = [
  "눈",
  "눈썹",
  "코",
  "입",
  "얼굴형",
  "이미지 조화",
  "모르겠음",
  "기타",
];

const COVER_TAGS: FaceCoverTag[] = [
  "눈",
  "눈썹",
  "코",
  "입",
  "얼굴형",
  "이미지 조화",
  "턱",
  "광대",
  "모르겠음",
  "기타",
];

export function Step2FaceSelect({ onNext, onBack }: { onNext: () => void; onBack?: () => void }) {
  const {
    faceStrengthTags,
    toggleFaceStrengthTag,
    faceStrengthOtherText,
    setFaceStrengthOtherText,

    faceCoverTags,
    toggleFaceCoverTag,
    faceCoverOtherText,
    setFaceCoverOtherText,
  } = useStyleSetupStore();

  const isStrengthSelected = (t: FaceStrengthTag) => faceStrengthTags.includes(t);
  const isCoverSelected = (t: FaceCoverTag) => faceCoverTags.includes(t);
  // const strengthOk = faceStrengthTags.length > 0 || faceStrengthOtherText.trim().length > 0;
  // const coverOk = faceCoverTags.length > 0 || faceCoverOtherText.trim().length > 0;
  const strengthOk = faceStrengthTags.length > 0;
  const coverOk = faceCoverTags.length > 0;
  const canNext = strengthOk && coverOk;

  return (
    <div className="mx-auto min-h-[100dvh] w-full max-w-[420px] bg-white pb-28">
      <TopNav onBack={onBack} />

      <div className="px-4">
        {/* ===================== 4/7 ===================== */}
        <p className="pre_body_med_16 text-[#008bff]">4/7</p>

        <p className="mt-2 pre_title_semi_20 text-black">
          <span className="text-[#429ff0]">자신이 생각하는 얼굴 장점</span>을 선택해주세요.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          {STRENGTH_TAGS.map((t) => {
            const selected = isStrengthSelected(t);
            return (
              <button
                key={t}
                type="button"
                onClick={() => toggleFaceStrengthTag(t)}
                className={cn(
                  "relative w-[166px] h-[44px] rounded-[8px] px-4 text-left pre_body_med_14 text-[#70737c]",
                  selected ? "bg-[#eff7fd]" : "bg-[#f4f4f5]",
                )}
              >
                {t}
                {selected ? (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Check className="h-[13px] w-[15px] text-[#429ff0] mr-2" />
                  </span>
                ) : (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Check className="h-[13px] w-[15px] text-[#c2c4c8] mr-2" />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-8">
          <p className="pre_body_med_16 text-black">기타</p>
          <input
            value={faceStrengthOtherText}
            onChange={(e) => setFaceStrengthOtherText(e.target.value)}
            placeholder="직접 입력해주세요."
            className="mt-3 h-12 w-full rounded-[4px] border border-[#dbdcdf] px-4 pre_body_med_14 text-neutral-700 outline-none placeholder:text-[#989ba2] focus:border-[#1D63FF]/40"
          />
        </div>

        {/* ===================== 5/7 ===================== */}
        <div className="mt-12">
          <p className="pre_body_med_16 text-[#008bff]">5/7</p>
          <p className="mt-2 pre_title_semi_20 text-[#0f0f10]">
            <span className="text-[#429ff0]">얼굴에서 커버하고 싶은 부분</span>을 선택해주세요.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            {COVER_TAGS.map((t) => {
              const selected = isCoverSelected(t);
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => toggleFaceCoverTag(t)}
                  className={cn(
                    "relative w-[166px] h-[44px] rounded-[8px] px-4 text-left pre_body_med_14 text-[#70737c]",
                    selected ? "bg-[#eff7fd]" : "bg-[#f4f4f5]",
                  )}
                >
                  {t}
                  {selected ? (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Check className="h-[13px] w-[15px] text-[#429ff0] mr-2" />
                    </span>
                  ) : (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Check className="h-[13px] w-[15px] text-[#c2c4c8] mr-2" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-8">
            <p className="pre_body_med_16 text-black">기타</p>
            <input
              value={faceCoverOtherText}
              onChange={(e) => setFaceCoverOtherText(e.target.value)}
              placeholder="직접 입력해주세요."
              className="mt-3 h-12 w-full rounded-[4px] border border-[#dbdcdf] px-4 pre_body_med_14 text-neutral-700 outline-none placeholder:text-[#989ba2] focus:border-[#1D63FF]/40"
            />
          </div>
        </div>
      </div>

      <Footer onClick={onNext} disabled={!canNext} />
    </div>
  );
}
