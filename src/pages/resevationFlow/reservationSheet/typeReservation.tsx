// import { useEffect, useMemo, useState } from "react";

// import { X } from "lucide-react";
// import Radioo from "@/images/reservationFlow/nomalRadio.svg?react";
// import SelectedRadio from "@/images/reservationFlow/selectedRadio.svg?react";

// // type ConsultType = "MESSAGE" | "VIDEO";

// // type Option = {
// //   id: ConsultType;
// //   title: string;
// //   priceLabel: string;
// //   description: string;
// // };

// // type ConsultationMethodSheetProps = {
// //   open: boolean;
// //   onClose: () => void;
// //   onNext?: (selected: ConsultType) => void;
// //   defaultValue?: ConsultType;
// // };

// type ConsultType = "MESSAGE" | "VIDEO";

// type ExpertSchedule = {
//   consultationType: ConsultType;
//   price: number;
//   isActive: boolean;
// };

// type Option = {
//   id: ConsultType;
//   title: string;
//   priceLabel: string;
//   description: string;
//   disabled?: boolean;
// };

// type ConsultationMethodSheetProps = {
//   open: boolean;
//   onClose: () => void;
//   onNext?: (selected: ConsultType) => void;
//   defaultValue?: ConsultType;

//   schedules?: ExpertSchedule[];
//   loading?: boolean;
//   errorMessage?: string | null;
// };

// const TYPE_META: Record<ConsultType, { title: string; description: string }> = {
//   MESSAGE: {
//     title: "메세지 상담",
//     description: "설문조사 답변을 바탕으로 전문가가 24시간 내로 솔루션지를 보내드려요.",
//   },
//   VIDEO: {
//     title: "실시간 화상 상담",
//     description: "전문가와 화상으로 15분 상담을 진행해요.",
//   },
// };

// const formatPrice = (price: number) => `${price.toLocaleString()}원`;

// function cn(...classes: Array<string | false | null | undefined>) {
//   return classes.filter(Boolean).join(" ");
// }

// function Radio({ checked }: { checked: boolean }) {
//   return (
//     // <span
//     //   className={cn(
//     //     "mt-[2px] inline-flex h-[18px] w-[18px] items-center justify-center rounded-full border",
//     //     checked ? "border-[#1D63FF]" : "border-[#C9CDD4]",
//     //   )}
//     //   aria-hidden="true"
//     // >
//     //   <span
//     //     className={cn(
//     //       "h-[10px] w-[10px] rounded-full",
//     //       checked ? "bg-[#1D63FF]" : "bg-transparent",
//     //     )}
//     //   />
//     // </span>

//     <>
//       {checked ? (
//         <SelectedRadio className="h-[18px] w-[18px] shrink-0" />
//       ) : (
//         <Radioo className="h-[18px] w-[18px] shrink-0" />
//       )}
//     </>
//   );
// }

// export default function ConsultationMethodSheet({
//   open,
//   onClose,
//   onNext,
//   defaultValue = "MESSAGE",
//   schedules = [],
//   loading = false,
//   errorMessage = null,
// }: ConsultationMethodSheetProps) {
//   const options: Option[] = useMemo(() => {
//     // 원하는 표시 순서 고정
//     const order: ConsultType[] = ["MESSAGE", "VIDEO"];

//     return order.flatMap((type) => {
//       const sch = schedules.find((s) => s.consultationType === type);
//       if (!sch) return [];
//       return [
//         {
//           id: type,
//           title: TYPE_META[type].title,
//           description: TYPE_META[type].description,
//           priceLabel: formatPrice(sch.price),
//           disabled: !sch.isActive,
//         },
//       ];
//     });
//   }, [schedules]);

//   const [selected, setSelected] = useState<ConsultType>(defaultValue);

//   useEffect(() => {
//     if (!open) return;
//     const enabled = options.filter((o) => !o.disabled);
//     if (enabled.length === 0) return;

//     const canUseDefault = enabled.some((o) => o.id === defaultValue);
//     setSelected(canUseDefault ? defaultValue : enabled[0].id);
//   }, [open, defaultValue, options]);

//   const selectedOption = options.find((o) => o.id === selected);
//   //const canNext = !loading && !errorMessage && selectedOption && !selectedOption.disabled;

//   // 열릴 때 스크롤 잠금(모바일 느낌)
//   useEffect(() => {
//     if (!open) return;
//     const prev = document.body.style.overflow;
//     document.body.style.overflow = "hidden";
//     return () => {
//       document.body.style.overflow = prev;
//     };
//   }, [open]);

//   // ESC로 닫기
//   useEffect(() => {
//     if (!open) return;
//     const onKeyDown = (e: KeyboardEvent) => {
//       if (e.key === "Escape") onClose();
//     };
//     window.addEventListener("keydown", onKeyDown);
//     return () => window.removeEventListener("keydown", onKeyDown);
//   }, [open, onClose]);

//   if (!open) return null;

//   return (
//     <div className="fixed inset-0 z-50">
//       {/* overlay */}
//       <button
//         type="button"
//         className="absolute inset-0 bg-black/40"
//         aria-label="닫기"
//         onClick={onClose}
//       />

//       {/* bottom sheet wrapper */}
//       <div className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-[375px]">
//         <div className="rounded-t-[16px] bg-white px-5 pb-6 pt-5 shadow-[0_-12px_32px_rgba(0,0,0,0.18)]">
//           {/* header */}
//           <div className="flex items-center justify-between">
//             <h2 className="pre_subtitle_semi_18 text-[#000000]">
//               원하는 상담 방식을 선택해주세요.
//             </h2>
//             <button
//               type="button"
//               onClick={onClose}
//               className="rounded-full p-1 text-[#000000]/70 hover:bg-black/5"
//               aria-label="닫기"
//             >
//               <X className="h-6 w-6 text-[#000000]" />
//             </button>
//           </div>

//           {/* options */}
//           <div className="mt-4 space-y-3">
//             {options.map((opt) => {
//               const isSelected = selected === opt.id;
//               return (
//                 <button
//                   key={opt.id}
//                   type="button"
//                   onClick={() => setSelected(opt.id)}
//                   className={cn(
//                     "w-full rounded-[12px] border px-4 py-4 text-left transition",
//                     isSelected ? "border-[#008BFF] bg-[#ffffff]" : "border-[#e1e2e4] bg-white",
//                   )}
//                   role="radio"
//                   aria-checked={isSelected}
//                 >
//                   <div className="flex items-start justify-between gap-3">
//                     <div className="flex items-start gap-3">
//                       <Radio checked={isSelected} />
//                       <div>
//                         <div
//                           className={cn(
//                             "pre_subtitle_semi_16",
//                             isSelected ? "text-[#008BFF]" : "text-[#0f0f10]",
//                           )}
//                         >
//                           {opt.title}
//                         </div>
//                         <p className="mt-1 whitespace-pre-line pre_body_reg_14 text-[#878a93]">
//                           {opt.description}
//                         </p>
//                       </div>
//                     </div>

//                     <div
//                       className={cn(
//                         "shrink-0 pt-[1px] pre_subtitle_semi_14",
//                         isSelected ? "text-[#008BFF]" : "text-[#0f0f10]",
//                       )}
//                     >
//                       {opt.priceLabel}
//                     </div>
//                   </div>
//                 </button>
//               );
//             })}
//           </div>

//           {/* next button */}
//           <button
//             type="button"
//             className="mt-10 h-[48px] w-[342px] rounded-[4px] bg-[#181818] pre_subtitle_semi_16 text-white active:scale-[0.99]"
//             onClick={() => onNext?.(selected)}
//           >
//             다음
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
import { useEffect, useMemo, useState } from "react";

import { X } from "lucide-react";
import Radioo from "@/images/reservationFlow/nomalRadio.svg?react";
import SelectedRadio from "@/images/reservationFlow/selectedRadio.svg?react";

type ConsultType = "MESSAGE" | "VIDEO";

type ExpertSchedule = {
  consultationType: ConsultType;
  price: number;
  isActive: boolean;
};

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

  // ✅ /api/expert/{userId}/schedules 의 data 배열을 그대로 넣어주면 가격만 치환됨
  schedules?: ExpertSchedule[];

  // ✅ page.tsx에서 넘기고 있으니 받기만 (UI 반영 X = 디자인 유지)
  loading?: boolean;
  errorMessage?: string | null;
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function Radio({ checked }: { checked: boolean }) {
  return (
    <>
      {checked ? (
        <SelectedRadio className="h-[22px] w-[22px] shrink-0" />
      ) : (
        <Radioo className="h-[22px] w-[22px] shrink-0" />
      )}
    </>
  );
}

function formatPriceLabel(price: number) {
  return `${price.toLocaleString()}원`;
}

export default function ConsultationMethodSheet({
  open,
  onClose,
  onNext,
  defaultValue = "MESSAGE",
  schedules,
}: ConsultationMethodSheetProps) {
  const options: Option[] = useMemo(() => {
    // ✅ 기존 카드 구조/스타일 유지 + 스샷 문구로 맞춤
    const base: Option[] = [
      {
        id: "MESSAGE",
        title: "메세지 상담",
        priceLabel: "24000원",
        description: "고민 설문지 답변을 바탕으로 전문가가 24시간 내에 솔루션지를 보내드려요.",
      },
      {
        id: "VIDEO",
        title: "실시간 화상 상담",
        priceLabel: "40000원",
        // ✅ 스샷처럼 2줄(whitespace-pre-line 유지)
        description: "전문가와 화상으로 30분 상담을 진행해요. 솔루션은 24시간 내로 전송됩니다.",
      },
    ];

    // ✅ schedules가 있으면 priceLabel만 치환 (디자인/구조 변경 없음)
    if (!Array.isArray(schedules) || schedules.length === 0) return base;

    return base.map((opt) => {
      const matched = schedules.find((s) => s.consultationType === opt.id);
      if (!matched) return opt;
      if (typeof matched.price !== "number") return opt;
      return { ...opt, priceLabel: formatPriceLabel(matched.price) };
    });
  }, [schedules]);

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
        <div className="rounded-t-[16px] bg-white px-5 pb-5 pt-5 shadow-[0_-12px_32px_rgba(0,0,0,0.18)]">
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
          <div className="mt-4 space-y-3">
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
                    {/* ✅ left 영역을 flex-1 + min-w-0로 잡아서 설명이 충분히 넓게/wrap 되게 */}
                    {/* ✅ items-center로 radio 세로 가운데 정렬 */}
                    <div className="flex flex-1 min-w-0 items-center gap-3">
                      <Radio checked={isSelected} />

                      {/* ✅ 텍스트 블록도 min-w-0로 wrap 안전하게 */}
                      <div className="min-w-0">
                        <div
                          className={cn(
                            "pre_subtitle_semi_16",
                            isSelected ? "text-[#008BFF]" : "text-[#0f0f10]",
                          )}
                        >
                          {opt.title}
                        </div>

                        <p className="mt-1 whitespace-pre-line pre_body_reg_12 text-[#878a93]">
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
          <div className="mt-5 flex justify-center">
            <button
              type="button"
              className="h-[48px] w-[342px] rounded-[4px] bg-[#181818] pre_subtitle_semi_16 text-white"
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
