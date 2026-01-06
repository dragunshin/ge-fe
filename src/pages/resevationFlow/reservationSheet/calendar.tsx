import { useEffect, useMemo, useState } from "react";
import { DayPicker } from "react-day-picker";
import { ko } from "date-fns/locale";
import "react-day-picker/dist/style.css";

type TimeSlot = { id: string; label: string; disabled?: boolean };

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function IconChevron({
  dir = "left",
  className = "",
}: {
  dir?: "left" | "right";
  className?: string;
}) {
  const rotate = dir === "right" ? "rotate-180" : "";
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("h-5 w-5", rotate, className)}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M15 18l-6-6 6-6"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function toKoreanTimeLabel(hour24: number, minute: 0 | 30) {
  const isAM = hour24 < 12;
  const meridiem = isAM ? "오전" : "오후";
  let hour12 = hour24 % 12;
  if (hour12 === 0) hour12 = 12;

  const mm = minute === 0 ? "00" : "30";
  return `${meridiem} ${hour12}:${mm}`;
}

function buildTimeSlots(startHour = 11, endHour = 22, stepMinutes: 30 | 60 = 30): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const totalStart = startHour * 60;
  const totalEnd = endHour * 60;

  for (let t = totalStart; t <= totalEnd; t += stepMinutes) {
    const h = Math.floor(t / 60);
    const m = (t % 60) as 0 | 30;
    const id = `t-${String(h).padStart(2, "0")}${m === 0 ? "00" : "30"}`;
    slots.push({ id, label: toKoreanTimeLabel(h, m) });
  }
  return slots;
}

function TimePill({
  label,
  selected,
  disabled,
  onClick,
}: {
  label: string;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "shrink-0 w-[88px] h-[36px] rounded-[6px] pre_cap_reg_13 transition",
        "active:scale-[0.98]",
        selected
          ? cn(
              "bg-[#008BFF] text-white",
              // "shadow-[0_6px_18px_rgba(0,139,255,0.35)]",
              //"ring-2 ring-[#008BFF]/20",
            )
          : disabled
            ? "bg-[#F6F7F8] text-[#BFC4CC]"
            : "bg-[#F4F4F5] text-[#c2c4c8] hover:bg-[#E9EBEF]",
      )}
    >
      {label}
    </button>
  );
}

export default function DateTimeBottomSheet({
  open,
  onClose,
  onNext,
}: {
  open: boolean;
  onClose: () => void;
  onNext: (payload: { date: Date; timeId: string }) => void;
}) {
  // 스샷과 동일하게 보이도록 고정(원하면 new Date()로 교체)
  const today = useMemo(() => new Date(2025, 12, 7), []);
  const [month, setMonth] = useState<Date>(new Date(2025, 12, 7));
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date(2025, 12, 7));
  const [selectedTimeId, setSelectedTimeId] = useState<string | null>("t-1130");

  // ✅ 11:00 ~ 22:00, 30분 단위 자동 생성
  const timeSlots = useMemo(() => buildTimeSlots(11, 22, 30), []);

  // 열릴 때 스크롤 잠금
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // ESC 닫기
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  const canNext = Boolean(selectedDate && selectedTimeId);

  return (
    <div className="fixed inset-0 z-50">
      {/* backdrop */}
      <button type="button" className="absolute inset-0 bg-black/45" onClick={onClose} />

      {/* sheet */}
      <div className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-[375px] rounded-t-[24px] bg-white shadow-[0_-10px_30px_rgba(0,0,0,0.12)]">
        <div className="px-6 pt-6">
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate} // ✅ 이게 제일 깔끔
            month={month}
            onMonthChange={setMonth}
            showOutsideDays
            fixedWeeks
            locale={ko}
            className="w-full"
            formatters={{
              formatCaption: (m) => `${m.getFullYear()}년 ${m.getMonth() + 1}월`,
              formatWeekdayName: (d) => ["일", "월", "화", "수", "목", "금", "토"][d.getDay()],
            }}
            components={{
              Chevron: (props) => {
                const dir = props.orientation === "right" ? "right" : "left";
                return <IconChevron dir={dir} className="text-[#121214]" />;
              },
            }}
            modifiers={{ today }}
            classNames={
              {
                //   months: "w-full",
                //   month: "w-full",
                //   caption: "relative mb-4 flex items-center justify-center",
                //   caption_label: "text-[16px] font-extrabold text-[#121214]",
                //   nav: "absolute inset-y-0 left-0 right-0 flex items-center justify-between",
                //   nav_button: "rounded-full p-2 text-[#121214] active:bg-[#F1F2F4] focus:outline-none",
                //   nav_button_previous: "ml-1",
                //   nav_button_next: "mr-1",
                //   // ✅ 레이아웃은 기본 table을 최대한 유지(세로로 깨지는 것 방지)
                //   table: "w-full border-collapse",
                //   head_cell: "pb-3 text-center text-[12px] font-semibold text-[#6B6F78]",
                //   cell: "p-0 text-center align-middle",
                //   // ✅ 핵심: 선택 표시를 '버튼'에 aria-selected로 직접 먹임
                //   day_button: cn(
                //     "mx-auto flex h-10 w-10 items-center justify-center rounded-full",
                //     "text-[14px] font-semibold text-[#121214] transition",
                //     "hover:bg-[#EEF0F3]",
                //     "aria-[selected=true]:bg-[#008BFF] aria-[selected=true]:text-white",
                //   ),
                //   // ✅ 오늘(회색 원)도 버튼에 먹이려면 이걸 같이 써줌
                //   // DayPicker가 today에 day_today 클래스를 붙여줘서 버튼에도 적용됨(버전마다 다르면 아래가 대안)
                //   day_today: "bg-[#EEF0F3] text-[#121214]",
                //   // ✅ 이번 달 밖 날짜 더 연하게
                //   day_outside: "text-[#E9EDF3] opacity-80",
                //   day_disabled: "text-[#E9EDF3] opacity-60",
              }
            }
          />

          {/* divider */}
          <div className="mt-4 h-[1px] w-full bg-[#EEF0F3]" />

          {/* times */}
          <div className="mt-4 overflow-x-auto scrollbar-hide pb-1">
            <div className="flex gap-2">
              {timeSlots.map((t) => {
                const selected = selectedTimeId === t.id;
                return (
                  <TimePill
                    key={t.id}
                    label={t.label}
                    selected={selected}
                    disabled={t.disabled}
                    onClick={() => {
                      if (t.disabled) return;
                      setSelectedTimeId(t.id);
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* next */}
          <button
            type="button"
            disabled={!canNext}
            onClick={() => {
              if (!selectedDate || !selectedTimeId) return;
              onNext({ date: selectedDate, timeId: selectedTimeId });
            }}
            className={cn(
              "mt-5 mb-5 w-[342px] h-[54px] w-full rounded-[4px] pre_subtitle_semi_16",
              canNext ? "bg-[#0f0f10] text-white active:opacity-90" : "bg-[#E6E7EA] text-[#A9ADB6]",
            )}
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
}
