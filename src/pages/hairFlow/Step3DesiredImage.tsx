import { Check } from "lucide-react";
import TopNav from "./component/TopNav";
import Footer from "./component/Footer";
import { cn } from "@/lib/utils";
import { useStyleSetupStore } from "@/stores/useHairSetupStore";
import type { DesiredTag } from "@/stores/useHairSetupStore";
import { useEffect } from "react";

const TAGS: DesiredTag[] = [
  "섹시함",
  "단정함",
  "귀여움",
  "남자다움",
  "신뢰를 주는",
  "화려한",
  "자연스러움",
  "기타",
];

export function Step3DesiredImage({ onNext, onBack }: { onNext: () => void; onBack?: () => void }) {
  const { desiredTags, toggleDesiredTag, desiredOtherText, setDesiredOtherText } =
    useStyleSetupStore();

  const isSelected = (t: DesiredTag) => desiredTags.includes(t);

  // const canNext = desiredTags.length > 0 || desiredOtherText.trim().length > 0;
  const canNext = desiredTags.length > 0;

  useEffect(() => {
    // 1) window 스크롤을 쓰는 구조라면 이게 먹음
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    // 2) iOS에서 간혹 body/documentElement 중 하나만 먹는 경우 방어
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  return (
    <div className="mx-auto flex min-h-[100dvh] w-full max-w-[430px] flex-col bg-white">
      <TopNav onBack={onBack} />

      <div className="flex-1 pb-28">
        <div className="px-4">
          <p className="pre_body_med_16 text-[#008bff]">6/7</p>
          <p className="mt-2 pre_title_semi_20 text-[#0f0f10]">
            <span className="text-[#008bff]">추구하는 이미지</span>를 선택해주세요.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            {TAGS.map((t) => {
              const selected = isSelected(t);
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => toggleDesiredTag(t)}
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
              value={desiredOtherText}
              onChange={(e) => setDesiredOtherText(e.target.value)}
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
