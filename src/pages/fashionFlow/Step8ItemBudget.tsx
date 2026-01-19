import { Check } from "lucide-react";
import { ITEM_OPTIONS, PRICE_PRESETS, PRICE_MAX } from "./constants";

export function Step8ItemBudget({
  selections,
  onToggle,
  priceMin,
  priceMax,
  minPercent,
  maxPercent,
  selectedPreset,
  hasPresetSelection,
  onPriceMinChange,
  onPriceMaxChange,
  onPricePreset,
  formatPriceRange,
}: {
  selections: Set<string>;
  onToggle: (option: string) => void;
  priceMin: number;
  priceMax: number;
  minPercent: number;
  maxPercent: number;
  selectedPreset: string | null;
  hasPresetSelection: boolean;
  onPriceMinChange: (value: number) => void;
  onPriceMaxChange: (value: number) => void;
  onPricePreset: (min: number, max: number) => void;
  formatPriceRange: () => string;
}) {
  return (
    <section className="pt-[8px]">
      <p className="text-[16px] font-medium text-[#008bff]">7/8</p>
      <h1 className="mt-[6px] text-[20px] font-semibold leading-[1.4] text-black">
        <span>원하시는 </span>
        <span className="text-[#008bff]">착장 1세트의 구성</span>
        <span>을 </span>
        선택해주세요.
      </h1>
      <p className="mt-[4px] text-[14px] leading-[1.5] text-[#656870]">
        전문가가 금액대별 최적의 아이템 조합을 만들어드려요.
      </p>

      <div className="mt-[16px]">
        <p className="text-[16px] font-semibold leading-[1.4] text-[#181818]">아이템 구성</p>
        <div className="mt-[12px] grid grid-cols-2 gap-[12px]">
          {ITEM_OPTIONS.map((option) => {
            const selected = selections.has(option);
            return (
              <button
                key={option}
                type="button"
                className={`flex h-[44px] w-full items-center justify-between rounded-[8px] px-[20px] text-[14px] font-medium ${
                  selected
                    ? "bg-[#eff7fd] text-[#70737c]"
                    : "bg-[#f4f4f5] text-[#70737c]"
                }`}
                onClick={() => onToggle(option)}
              >
                <span>{option}</span>
                <span className="flex h-[18px] w-[18px] items-center justify-center">
                  <Check
                    className={`h-[12px] w-[12px] ${
                      selected ? "text-[#008bff]" : "text-[#c4c7ce]"
                    }`}
                  />
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-[32px]">
        <p className="text-[16px] font-semibold leading-[1.4] text-[#181818]">선호 가격대</p>
        <p className="mt-[8px] text-center text-[16px] font-semibold text-[#181818]">
          {formatPriceRange()}
        </p>
        <div className="mt-[8px] flex justify-center">
          <div className="relative h-[24px] w-[306px]">
            <div className="absolute top-1/2 h-[1px] w-full -translate-y-1/2 rounded-full bg-[#e1e2e4]" />
            <div
              className="absolute top-1/2 h-[1px] -translate-y-1/2 rounded-full bg-[#008bff]"
              style={{
                left: `${minPercent}%`,
                width: `${maxPercent - minPercent}%`,
              }}
            />
            <input
              type="range"
              min={0}
              max={PRICE_MAX}
              value={priceMin}
              onChange={(event) => onPriceMinChange(Number(event.target.value))}
              className="price-range price-range-min absolute inset-0 h-full w-full"
            />
            <input
              type="range"
              min={0}
              max={PRICE_MAX}
              value={priceMax}
              onChange={(event) => onPriceMaxChange(Number(event.target.value))}
              className="price-range price-range-max absolute inset-0 h-full w-full"
            />
          </div>
        </div>
        <div className="mt-[8px] flex justify-center">
          <div className="flex w-[306px] justify-between text-[13px] text-[#878a93]">
            <span>0원</span>
            <span className="text-center">20만원</span>
            <span className="text-right">40만원 이상</span>
          </div>
        </div>
        <div className="mt-[16px] flex w-[340px] flex-wrap gap-x-[6px] gap-y-[10px]">
          {PRICE_PRESETS.map((preset) => {
            const selected = hasPresetSelection && selectedPreset === preset.label;
            return (
              <button
                key={preset.label}
                type="button"
                className={`rounded-[4px] border py-[10px] text-[13px] text-[#0f0f10] ${
                  selected
                    ? "border-[#008bff] bg-[#e5f4ff]"
                    : "border-[#e1e2e4] bg-white"
                }`}
                style={{ paddingLeft: preset.paddingX, paddingRight: preset.paddingX }}
                onClick={() => onPricePreset(preset.min, preset.max)}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
