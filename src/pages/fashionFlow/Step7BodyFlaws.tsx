import { Check } from "lucide-react";
import { BODY_FLAW_OPTIONS } from "./constants";

export function Step7BodyFlaws({
  selections,
  onToggle,
  etcValue,
  onEtcChange,
}: {
  selections: Set<string>;
  onToggle: (option: string) => void;
  etcValue: string;
  onEtcChange: (value: string) => void;
}) {
  return (
    <section className="pt-[8px]">
      <p className="text-[16px] font-medium text-[#008bff]">3/6</p>
      <h1 className="mt-[6px] text-[20px] font-semibold leading-[1.4] text-black">
        본인의 <span className="text-[#429ff0]">체형적 결점</span>으로 생각하는 부분을
        선택해주세요.
      </h1>

      <div className="mt-[16px] grid grid-cols-2 gap-[12px]">
        {BODY_FLAW_OPTIONS.map((option) => {
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

      <div className="mt-[24px]">
        <p className="text-[16px] font-medium text-black">기타</p>
        <input
          value={etcValue}
          onChange={(event) => onEtcChange(event.target.value)}
          placeholder="직접 입력해주세요."
          className="mt-[12px] h-[48px] w-full rounded-[4px] border border-[#dbdcdf] px-[20px] text-[13px] text-[#0f0f10] placeholder:text-[#989ba2]"
        />
      </div>
    </section>
  );
}
