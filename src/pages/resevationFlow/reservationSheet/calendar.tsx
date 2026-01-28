import { useEffect, useMemo, useState } from "react";
import { DayPicker, useDayPicker, type MonthCaptionProps } from "react-day-picker";
import { ko } from "date-fns/locale";
import "react-day-picker/style.css";
import Left from "@/images/reservationFlow/left.svg?react";
import Right from "@/images/reservationFlow/right.svg?react";
import { X } from "lucide-react";

type TimeSlot = { id: string; label: string; disabled?: boolean };

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

// function IconChevron({
//   dir = "left",
//   className = "",
// }: {
//   dir?: "left" | "right";
//   className?: string;
// }) {
//   const rotate = dir === "right" ? "rotate-180" : "";
//   return (
//     <svg
//       viewBox="0 0 24 24"
//       className={cn("h-5 w-5", rotate, className)}
//       fill="none"
//       aria-hidden="true"
//     >
//       <path
//         d="M15 18l-6-6 6-6"
//         stroke="currentColor"
//         strokeWidth="2.25"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />
//     </svg>
//   );
// }

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
// function addDays(date: Date, days: number) {
//   const d = new Date(date);
//   d.setDate(d.getDate() + days);
//   return d;
// }

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
          ? "bg-[#008BFF] text-white"
          : disabled
            ? "bg-[#F6F7F8] text-[#BFC4CC]"
            : "bg-[#F4F4F5] text-[#6B6F78] hover:bg-[#E9EBEF]",
      )}
    >
      {label}
    </button>
  );
}

/**
 * ✅ 스샷처럼 "가운데 월 텍스트 + 좌/우 화살표" 한 줄
 */
function MonthHeader(props: MonthCaptionProps) {
  const { calendarMonth } = props;
  const { goToMonth, nextMonth, previousMonth } = useDayPicker();

  const label = `${calendarMonth.date.getFullYear()}년 ${calendarMonth.date.getMonth() + 1}월`;

  return (
    <div className="mb-4 flex items-center justify-center gap-3">
      <button
        type="button"
        aria-label="이전 달"
        disabled={!previousMonth}
        onClick={() => previousMonth && goToMonth(previousMonth)}
        className={cn(
          "inline-flex h-9 w-9 items-center justify-center rounded-full",
          "text-[#C9CDD5] active:bg-[#F1F2F4]",
          "disabled:opacity-100 disabled:text-[#C9CDD5]",
        )}
      >
        <Left />
      </button>

      <div className="pre_subtitle_semi_16 text-[#0f0f10]">{label}</div>

      <button
        type="button"
        aria-label="다음 달"
        disabled={!nextMonth}
        onClick={() => nextMonth && goToMonth(nextMonth)}
        className={cn(
          "inline-flex h-9 w-9 items-center justify-center rounded-full",
          "text-[#121214] active:bg-[#F1F2F4]",
          "disabled:text-[#C9CDD5] disabled:opacity-100",
        )}
      >
        <Right />
      </button>
    </div>
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
  const today = useMemo(() => startOfDay(new Date()), []);

  // // 오늘 포함 과거 비활성(= 내일부터 선택 가능)
  // const disableBefore = useMemo(() => addDays(today, 1), [today]);

  const disableBefore = useMemo(() => today, [today]);

  // ✅ 이전 달로 못 가게 (v9는 startMonth) :contentReference[oaicite:2]{index=2}
  const startMonth = useMemo(() => new Date(today.getFullYear(), today.getMonth(), 1), [today]);

  const [month, setMonth] = useState<Date>(() => startMonth);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(() => today);

  const [selectedTimeId, setSelectedTimeId] = useState<string | null>("t-1130");

  const timeSlots = useMemo(() => buildTimeSlots(11, 22, 30), []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

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
      <button type="button" className="absolute inset-0 bg-black/45" onClick={onClose} />

      <div className="absolute inset-x-0 bottom-0 z-10 mx-auto w-full max-w-[375px] rounded-t-[24px] bg-white shadow-[0_-10px_30px_rgba(0,0,0,0.12)]">
        <div className="relative">
          <button
            type="button"
            aria-label="닫기"
            onClick={onClose}
            className="absolute right-5 top-6 inline-flex h-9 w-9 z-20 items-center justify-center rounded-full hover:bg-black/5"
          >
            <X className="h-6 w-6 text-[#000000]" />
          </button>
          <div className="px-6 pt-6">
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              month={month}
              onMonthChange={setMonth}
              showOutsideDays
              fixedWeeks
              locale={ko}
              weekStartsOn={0}
              today={today}
              disabled={{ before: disableBefore }}
              startMonth={startMonth}
              hideNavigation
              components={{ MonthCaption: MonthHeader }}
              formatters={{
                formatWeekdayName: (d) => ["일", "월", "화", "수", "목", "금", "토"][d.getDay()],
              }}
              className={cn(
                "w-full",
                "[--rdp-accent-color:#008BFF]",
                "[--rdp-accent-background-color:#008BFF]",
                "[--rdp-day_button-border-radius:9999px]",
              )}
              classNames={{
                months: "w-full",
                month: "w-full",
                month_grid: "w-full border-collapse",
                weekday: "pb-3 text-center text-[12px] font-semibold text-[#6B6F78]",
                day: "p-0 text-center align-middle",

                // ✅ 버튼 기본 (선택 스타일은 여기서 하지 말고 selected/today/disabled에서 처리)
                day_button: cn(
                  "mx-auto flex h-[36px] w-[36px] items-center justify-center rounded-full transition focus:outline-none",
                  "pre_cap_reg_14",
                  "text-[#0f0f10] hover:bg-[#EEF0F3]",
                ),

                /**
                 * ✅ (B) 제일 중요: selected/today/disabled는 “day(셀)”에 붙을 수 있음
                 * 그래서 그 안의 button을 그냥 잡아버리면 100% 먹음.
                 * (.rdp-day_button 같은 기본 클래스에 의존하지 않음)
                 */
                selected: cn(
                  "[&>button]:!bg-[#008BFF]",
                  "[&>button]:!text-white",
                  "[&>button]:hover:!bg-[#008BFF]",
                ),
                today: cn(),
                // "[&>button]:!bg-[#EEF0F3]",
                // "[&>button]:!text-[#121214]",
                // "[&>button]:hover:!bg-[#EEF0F3]",
                disabled: cn(
                  "[&>button]:!text-[#AEB0B6]",
                  "[&>button]:cursor-default",
                  "[&>button]:hover:!bg-transparent",
                ),

                outside: "opacity-100",
              }}
            />

            <div className="mt-4 h-[1px] w-full bg-[#EEF0F3]" />

            <div className="mt-4 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
            <div className="mt-5 mb-5 flex justify-center">
              <button
                type="button"
                disabled={!canNext}
                onClick={() => {
                  if (!selectedDate || !selectedTimeId) return;
                  onNext({ date: selectedDate, timeId: selectedTimeId });
                }}
                className={cn(
                  "h-[48px] w-[342px] shrink-0 rounded-[4px] pre_subtitle_semi_16",
                  canNext ? "bg-[#0F0F10] text-white " : "bg-[#E6E7EA] text-[#A9ADB6]",
                )}
              >
                다음
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
