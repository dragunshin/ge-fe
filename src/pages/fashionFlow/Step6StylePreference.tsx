import { Check } from "lucide-react";
import { COLOR_OPTIONS, FIT_IMAGE_OPTIONS, IMAGE_STYLE_OPTIONS } from "./constants";
import MuscleFit from "@/images/reservationFlow/fashionFlow/muscle.svg?react";
import RegularFit from "@/images/reservationFlow/fashionFlow/regular.svg?react";
import OverFit from "@/images/reservationFlow/fashionFlow/over.svg?react";

const FIT_IMAGES = {
  muscle: MuscleFit,
  regular: RegularFit,
  over: OverFit,
};

export function Step6StylePreference({
  colorSelections,
  fitSelection,
  imageStyleSelections,
  imageStyleEtc,
  onToggleColor,
  onFitChange,
  onToggleImageStyle,
  onImageStyleEtcChange,
}: {
  colorSelections: Set<string>;
  fitSelection: string | null;
  imageStyleSelections: Set<string>;
  imageStyleEtc: string;
  onToggleColor: (option: string) => void;
  onFitChange: (value: string) => void;
  onToggleImageStyle: (option: string) => void;
  onImageStyleEtcChange: (value: string) => void;
}) {
  return (
    <section className="pt-[8px]">
      <p className="text-[16px] font-medium text-[#008bff]">6/8</p>
      <h1 className="mt-[6px] text-[20px] font-semibold leading-[1.4] text-black">
        선호하는 스타일을 알려주세요.
      </h1>

      <div className="mt-[24px]">
        <p className="text-[16px] font-semibold text-black">색상</p>
        <div className="mt-[12px] grid grid-cols-2 gap-[12px]">
          {COLOR_OPTIONS.map((option) => {
            const selected = colorSelections.has(option);
            return (
              <button
                key={option}
                type="button"
                className={`flex h-[44px] w-full items-center justify-between rounded-[8px] px-[20px] text-[14px] font-medium ${
                  selected
                    ? "bg-[#eff7fd] text-[#70737c]"
                    : "bg-[#f4f4f5] text-[#70737c]"
                }`}
                onClick={() => onToggleColor(option)}
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
        <p className="text-[16px] font-semibold text-black">핏감</p>
        <div className="mt-[12px] grid grid-cols-3 gap-[8px]">
          {FIT_IMAGE_OPTIONS.map((item) => {
            const selected = fitSelection === item.label;
            const ImageComponent = FIT_IMAGES[item.imageKey as keyof typeof FIT_IMAGES];
            return (
              <button
                key={item.label}
                type="button"
                className="flex flex-col items-center gap-[8px]"
                onClick={() => onFitChange(item.label)}
              >
                <div
                  className={`h-[109px] w-[109px] overflow-hidden rounded-[8px] ${
                    selected ? "ring-2 ring-[#008bff]" : ""
                  }`}
                >
                  <ImageComponent className="h-full w-full" />
                </div>
                <span className="text-[14px] text-[#70737c]">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-[32px]">
        <p className="text-[16px] font-semibold text-black">이미지</p>
        <div className="mt-[12px] grid grid-cols-2 gap-[12px]">
          {IMAGE_STYLE_OPTIONS.map((option) => {
            const selected = imageStyleSelections.has(option);
            return (
              <button
                key={option}
                type="button"
                className={`flex h-[44px] w-full items-center justify-between rounded-[8px] px-[20px] text-[14px] font-medium ${
                  selected
                    ? "bg-[#eff7fd] text-[#70737c]"
                    : "bg-[#f4f4f5] text-[#70737c]"
                }`}
                onClick={() => onToggleImageStyle(option)}
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

      <div className="mt-[32px] w-[342px]">
        <p className="text-[16px] font-medium text-black">기타</p>
        <input
          value={imageStyleEtc}
          onChange={(event) => onImageStyleEtcChange(event.target.value)}
          placeholder="직접 입력해주세요."
          className="mt-[12px] h-[48px] w-full rounded-[4px] border border-[#dbdcdf] px-[20px] text-[13px] text-[#0f0f10] placeholder:text-[#989ba2]"
        />
      </div>
    </section>
  );
}
