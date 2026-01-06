import { useEffect, useMemo, useState } from "react";

import { X } from "lucide-react";
import Radioo from "@/images/reservationFlow/nomalRadio.svg?react";
import SelectedRadio from "@/images/reservationFlow/selectedRadio.svg?react";

type ConsultType = "MESSAGE" | "LIVE";

type Option = {
  id: ConsultType;
  title: string;
  priceLabel: string;
  description: string;
};

type ConsultationMethodSheetProps = {
  open: boolean;
  onClose: () => void;
  onNext?: (selected: ConsultType) => void;
  defaultValue?: ConsultType;
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function Radio({ checked }: { checked: boolean }) {
  return (
    // <span
    //   className={cn(
    //     "mt-[2px] inline-flex h-[18px] w-[18px] items-center justify-center rounded-full border",
    //     checked ? "border-[#1D63FF]" : "border-[#C9CDD4]",
    //   )}
    //   aria-hidden="true"
    // >
    //   <span
    //     className={cn(
    //       "h-[10px] w-[10px] rounded-full",
    //       checked ? "bg-[#1D63FF]" : "bg-transparent",
    //     )}
    //   />
    // </span>

    <>
      {checked ? (
        <SelectedRadio className="h-[18px] w-[18px] shrink-0" />
      ) : (
        <Radioo className="h-[18px] w-[18px] shrink-0" />
      )}
    </>
  );
}

export default function ConsultationMethodSheet({
  open,
  onClose,
  onNext,
  defaultValue = "MESSAGE",
}: ConsultationMethodSheetProps) {
  const options: Option[] = useMemo(
    () => [
      {
        id: "MESSAGE",
        title: "메세지 상담",
        priceLabel: "24000원",
        description: "설문조사 답변을 바탕으로 전문가가 24시간 내로 솔루션지를 보내드려요.",
      },
      {
        id: "LIVE",
        title: "실시간 화상 상담",
        priceLabel: "40000원",
        description: "전문가와 화상으로 15분 상담을 진행해요.",
      },
    ],
    [],
  );

  const [selected, setSelected] = useState<ConsultType>(defaultValue);

  // 열릴 때 스크롤 잠금(모바일 느낌)
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // ESC로 닫기
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* overlay */}
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="닫기"
        onClick={onClose}
      />

      {/* bottom sheet wrapper */}
      <div className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-[375px]">
        <div className="flex max-h-[80dvh] flex-col rounded-none bg-white px-5 pt-5 shadow-[0_-12px_32px_rgba(0,0,0,0.18)]">
          {/* header */}
          <div className="flex items-center justify-between">
            <h2 className="pre_subtitle_semi_18 text-[#000000]">
              원하는 상담 방식을 선택해주세요.
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-1 text-[#000000]/70 hover:bg-black/5"
              aria-label="닫기"
            >
              <X className="h-6 w-6 text-[#000000]" />
            </button>
          </div>

          {/* options */}
          <div className="mt-4 flex-1 space-y-3 overflow-y-auto pb-6">
            {options.map((opt) => {
              const isSelected = selected === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSelected(opt.id)}
                  className={cn(
                    "w-full rounded-[12px] border px-4 py-4 text-left transition",
                    isSelected ? "border-[#008BFF] bg-[#ffffff]" : "border-[#e1e2e4] bg-white",
                  )}
                  role="radio"
                  aria-checked={isSelected}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <Radio checked={isSelected} />
                      <div>
                        <div
                          className={cn(
                            "pre_subtitle_semi_16",
                            isSelected ? "text-[#008BFF]" : "text-[#0f0f10]",
                          )}
                        >
                          {opt.title}
                        </div>
                        <p className="mt-1 whitespace-pre-line pre_body_reg_14 text-[#878a93]">
                          {opt.description}
                        </p>
                      </div>
                    </div>

                    <div
                      className={cn(
                        "shrink-0 pt-[1px] pre_subtitle_semi_14",
                        isSelected ? "text-[#008BFF]" : "text-[#0f0f10]",
                      )}
                    >
                      {opt.priceLabel}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* next button */}
          <div className="app-footer bg-white pb-5">
            <button
              type="button"
              className="h-[48px] w-full rounded-none bg-[#181818] pre_subtitle_semi_16 text-white active:scale-[0.99]"
              onClick={() => onNext?.(selected)}
            >
              다음
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
