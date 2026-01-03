import * as React from "react";
import StarIcon from "@/images/mypage/star.svg?react";

type ExpertFrameProps = {
  name: string;
  category: string;
  rating: number;
  reviews: number;
  description: string;
  isOnline?: boolean;
  className?: string;
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function ExpertFrame({
  name,
  category,
  rating,
  reviews,
  description,
  isOnline,
  className,
}: ExpertFrameProps) {
  return (
    <article
      className={cn(
        "rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-[0_6px_20px_rgba(15,23,42,0.06)]",
        className,
      )}
    >
      <div className="flex items-start gap-4">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-[#E5E7EB]">
          {isOnline && (
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-[#22C55E]" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-[16px] font-semibold text-[#111827]">{name}</p>
            <span className="rounded-md bg-[#EAF3FF] px-2 py-0.5 text-[12px] font-semibold text-[#2B6DEB]">
              {category}
            </span>
          </div>

          <div className="mt-1 flex items-center gap-1.5 text-[12px] text-[#6B7280]">
            <StarIcon className="h-[14px] w-[14px]" />
            <span className="font-semibold text-[#111827]">{rating.toFixed(1)}</span>
            <span>({reviews.toLocaleString("ko-KR")})</span>
          </div>
        </div>
      </div>

      <p className="mt-3 line-clamp-2 text-[13px] leading-[1.5] text-[#6B7280]">
        {description}
      </p>

      <div className="mt-4 flex items-center justify-between rounded-xl bg-[#F5F7FB] px-4 py-3">
        <div>
          <p className="text-[12px] text-[#6B7280]">상담 가능 시간</p>
          <p className="mt-1 text-[13px] font-semibold text-[#111827]">오늘 14:00 - 18:00</p>
        </div>
        <button
          type="button"
          className="rounded-lg bg-[#111827] px-3 py-2 text-[12px] font-semibold text-white"
        >
          상담 예약
        </button>
      </div>
    </article>
  );
}
