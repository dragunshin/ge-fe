import { Check } from "lucide-react";
import { SIZE_OPTIONS } from "./constants";

type SizeOption = (typeof SIZE_OPTIONS)[number];

export function Step4BodySize({
  heightValue,
  weightValue,
  topSize,
  bottomSize,
  onHeightChange,
  onHeightBlur,
  onHeightFocus,
  onWeightChange,
  onWeightBlur,
  onWeightFocus,
  onTopSizeChange,
  onBottomSizeChange,
}: {
  heightValue: string;
  weightValue: string;
  topSize: SizeOption | null;
  bottomSize: SizeOption | null;
  onHeightChange: (value: string) => void;
  onHeightBlur: () => void;
  onHeightFocus: () => void;
  onWeightChange: (value: string) => void;
  onWeightBlur: () => void;
  onWeightFocus: () => void;
  onTopSizeChange: (value: SizeOption) => void;
  onBottomSizeChange: (value: SizeOption) => void;
}) {
  return (
    <section className="pt-[8px]">
      <p className="text-[16px] font-medium text-[#008bff]">2/6</p>
      <h1 className="mt-[6px] text-[20px] font-semibold leading-[1.4] text-black">
        <span className="text-[#429ff0]">키/몸무게, 상•하의 사이즈</span>를 알려주세요.
      </h1>

      <div className="mt-[24px] space-y-[16px]">
        <div>
          <p className="text-[16px] font-medium text-black">키</p>
          <input
            value={heightValue}
            onChange={(event) => onHeightChange(event.target.value)}
            onBlur={onHeightBlur}
            onFocus={onHeightFocus}
            placeholder="직접 입력해주세요."
            className="mt-[12px] h-[48px] w-full rounded-[4px] border border-[#dbdcdf] px-[20px] text-[13px] text-[#0f0f10] placeholder:text-[#989ba2]"
          />
        </div>
        <div>
          <p className="text-[16px] font-medium text-black">몸무게</p>
          <input
            value={weightValue}
            onChange={(event) => onWeightChange(event.target.value)}
            onBlur={onWeightBlur}
            onFocus={onWeightFocus}
            placeholder="직접 입력해주세요."
            className="mt-[12px] h-[48px] w-full rounded-[4px] border border-[#dbdcdf] px-[20px] text-[13px] text-[#0f0f10] placeholder:text-[#989ba2]"
          />
        </div>
      </div>

      <div className="mt-[24px]">
        <p className="text-[16px] font-medium text-black">상의 사이즈</p>
        <div className="mt-[12px] grid grid-cols-[165px_165px] gap-[12px]">
          {SIZE_OPTIONS.map((option) => {
            const selected = topSize === option;
            return (
              <button
                key={`top-${option}`}
                type="button"
                onClick={() => onTopSizeChange(option)}
                className={`flex h-[44px] w-full items-center justify-between rounded-[8px] px-[20px] text-[14px] font-medium ${
                  selected
                    ? "bg-[#eff7fd] text-[#70737c]"
                    : "bg-[#f4f4f5] text-[#70737c]"
                }`}
              >
                <span>{option}</span>
                <span
                  className={`flex h-[18px] w-[18px] items-center justify-center rounded-full ${
                    selected ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <Check className="h-[12px] w-[12px] text-[#008bff]" />
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-[24px]">
        <p className="text-[16px] font-medium text-black">하의 사이즈</p>
        <div className="mt-[12px] grid grid-cols-[165px_165px] gap-[12px]">
          {SIZE_OPTIONS.map((option) => {
            const selected = bottomSize === option;
            return (
              <button
                key={`bottom-${option}`}
                type="button"
                onClick={() => onBottomSizeChange(option)}
                className={`flex h-[44px] w-full items-center justify-between rounded-[8px] px-[20px] text-[14px] font-medium ${
                  selected
                    ? "bg-[#eff7fd] text-[#70737c]"
                    : "bg-[#f4f4f5] text-[#70737c]"
                }`}
              >
                <span>{option}</span>
                <span
                  className={`flex h-[18px] w-[18px] items-center justify-center rounded-full ${
                    selected ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <Check className="h-[12px] w-[12px] text-[#008bff]" />
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
