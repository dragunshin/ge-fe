import React, { useMemo, useState } from "react";

/** utils */
function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/** types */
type ConsultKind = "MESSAGE" | "TIME_LIMITED";
type Category = "전체" | "헤어" | "스킨케어" | "패션" | "메이크업";

type Reservation = {
  id: string;
  dateLabel: string; // "10.18"
  dayLabel: string; // "일요일"
  kind: ConsultKind;
  expertName: string;
  tag: Exclude<Category, "전체">;
  desc: string;
  canChange?: boolean;
  canCancel?: boolean;
};

type PastConsultation = {
  id: string;
  dateLabel: string;
  dayLabel: string;
  kind: ConsultKind;
  expertName: string;
  tag: Exclude<Category, "전체">;
  likeCount: number;
  priceWon: number;
  reviewPriceWon: number;
};

/** icons */
const IconBack = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" {...p}>
    <path
      d="M15 18l-6-6 6-6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconMessage = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" {...p}>
    <path
      d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v8A2.5 2.5 0 0 1 17.5 17H10l-4.5 3V17A2.5 2.5 0 0 1 4 14.5v-8Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path d="M7 8h10M7 11h7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const IconHourglass = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" {...p}>
    <path d="M7 3h10M7 21h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path
      d="M8 3v4c0 1.1.6 2.1 1.6 2.6L12 11l2.4-1.4A3 3 0 0 0 16 7V3"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path
      d="M16 21v-4c0-1.1-.6-2.1-1.6-2.6L12 13l-2.4 1.4A3 3 0 0 0 8 17v4"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
  </svg>
);

const IconHeart = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" {...p}>
    <path
      d="M12 20s-7-4.4-9.2-8.5C1 8.3 2.9 6 5.6 6c1.5 0 2.9.7 3.7 1.9C10.1 6.7 11.5 6 13 6c2.7 0 4.6 2.3 2.8 5.5C19 15.6 12 20 12 20Z"
      fill="currentColor"
    />
  </svg>
);

const IconCard = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" {...p}>
    <path
      d="M3.5 7.5A2.5 2.5 0 0 1 6 5h12a2.5 2.5 0 0 1 2.5 2.5v9A2.5 2.5 0 0 1 18 19H6a2.5 2.5 0 0 1-2.5-2.5v-9Z"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <path d="M3.5 9h17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const IconPen = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" {...p}>
    <path
      d="M4 20h4l10.5-10.5a2 2 0 0 0 0-2.8l-.2-.2a2 2 0 0 0-2.8 0L5 16v4Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path d="M13.5 6.5l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

/** ui */
function Badge({ kind }: { kind: ConsultKind }) {
  const isMessage = kind === "MESSAGE";
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[#EAF3FF] px-3 py-1 text-[12px] font-semibold text-[#2B6DEB]">
      {isMessage ? <IconMessage className="h-4 w-4" /> : <IconHourglass className="h-4 w-4" />}
      {isMessage ? "메시지 상담" : "시간제한형 상담"}
    </span>
  );
}

function TagChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded bg-[#EAF3FF] px-2 py-[2px] text-[12px] font-semibold text-[#2B6DEB]">
      {children}
    </span>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <p className="text-[13px] font-medium text-[#8E8E93]">{children}</p>;
}

function Divider() {
  return <div className="h-[10px] w-full bg-[#F2F2F7]" />;
}

function ReservationCard({
  item,
  variant,
}: {
  item: Reservation;
  variant: "waiting" | "upcoming";
}) {
  return (
    <div className="bg-white">
      <div className="flex items-center justify-between py-2">
        <div className="flex items-baseline gap-2">
          <span className="text-[18px] font-semibold text-black">{item.dateLabel}</span>
          <span className="text-[13px] font-medium text-[#8E8E93]">{item.dayLabel}</span>
        </div>
        <Badge kind={item.kind} />
      </div>

      <div className="mt-2 flex gap-3">
        <div className="h-14 w-14 shrink-0 rounded-full bg-[#D1D1D6]" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-[15px] font-semibold text-black">{item.expertName}</p>
            <TagChip>{item.tag}</TagChip>
          </div>
          <p className="mt-1 line-clamp-2 text-[12px] leading-[140%] text-[#8E8E93]">{item.desc}</p>

          <div className="mt-3 flex gap-2">
            {variant === "waiting" && item.canChange && (
              <button
                type="button"
                className="h-9 flex-1 rounded-md border border-[#D1D1D6] bg-white text-[13px] font-semibold text-black active:scale-[0.99]"
              >
                예약변경
              </button>
            )}
            {item.canCancel && (
              <button
                type="button"
                className={cn(
                  "h-9 rounded-md border border-[#D1D1D6] bg-white text-[13px] font-semibold text-black active:scale-[0.99]",
                  variant === "upcoming" ? "flex-1" : "flex-1",
                )}
              >
                예약취소
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 h-px w-full bg-[#E5E5EA]" />
    </div>
  );
}

function FilterChip({
  active,
  children,
  onClick,
}: {
  active?: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-9 whitespace-nowrap rounded-md border px-4 text-[13px] font-semibold active:scale-[0.99]",
        active
          ? "border-[#1C1C1E] bg-[#1C1C1E] text-white"
          : "border-[#D1D1D6] bg-white text-black",
      )}
    >
      {children}
    </button>
  );
}

function PastItem({ item }: { item: PastConsultation }) {
  return (
    <div className="bg-white pb-4">
      <div className="flex items-center justify-between py-2">
        <div className="flex items-baseline gap-2">
          <span className="text-[18px] font-semibold text-black">{item.dateLabel}</span>
          <span className="text-[13px] font-medium text-[#8E8E93]">{item.dayLabel}</span>
        </div>
        <Badge kind={item.kind} />
      </div>

      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="text-[15px] font-semibold text-black">{item.expertName}</p>
          <TagChip>{item.tag}</TagChip>
        </div>

        <div className="flex items-center gap-1 text-[#FF3B30]">
          <IconHeart className="h-5 w-5" />
          <span className="text-[12px] font-semibold">{item.likeCount}</span>
        </div>
      </div>

      <div className="mt-2 flex items-center gap-2 text-[#3A3A3C]">
        <IconCard className="h-4 w-4" />
        <span className="text-[13px] font-semibold">{item.priceWon.toLocaleString("ko-KR")}원</span>
      </div>

      <div className="mt-2 flex items-center gap-2">
        <IconPen className="h-4 w-4 text-[#3A3A3C]" />
        <span className="text-[13px] font-semibold text-[#3A3A3C]">
          후기 작성 시{" "}
          <span className="text-[#2B6DEB]">{item.reviewPriceWon.toLocaleString("ko-KR")}원</span>
        </span>
      </div>

      <div className="mt-3 rounded-md bg-[#EAF3FF] px-4 py-3 text-[12px] font-semibold text-[#2B6DEB]">
        후기를 남겨주시면 1000원을 환급해드려요.
      </div>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          className="h-11 flex-1 rounded-md bg-[#1C1C1E] text-[14px] font-semibold text-white active:scale-[0.99]"
        >
          다시 상담받기
        </button>
        <button
          type="button"
          className="h-11 flex-1 rounded-md border border-[#D1D1D6] bg-white text-[14px] font-semibold text-black active:scale-[0.99]"
        >
          후기 쓰기
        </button>
      </div>

      <div className="mt-4 h-px w-full bg-[#E5E5EA]" />
    </div>
  );
}

/** page */
export default function ReservationHistoryView() {
  const waiting: Reservation[] = [
    {
      id: "w1",
      dateLabel: "10.18",
      dayLabel: "일요일",
      kind: "MESSAGE",
      expertName: "전문가 이름",
      tag: "헤어",
      desc: "전문가가 작성한 자신의 강점 한줄 쓱싹문구가 작성한 자신의 강점 한줄 쓱싹",
      canChange: true,
      canCancel: true,
    },
  ];

  const upcoming: Reservation[] = [
    {
      id: "u1",
      dateLabel: "10.18",
      dayLabel: "일요일",
      kind: "TIME_LIMITED",
      expertName: "전문가 이름",
      tag: "헤어",
      desc: "전문가가 작성한 자신의 강점 한줄 쓱싹문구가 작성한 자신의 강점 한줄 쓱싹",
      canCancel: true,
    },
  ];

  const past: PastConsultation[] = [
    {
      id: "p1",
      dateLabel: "10.18",
      dayLabel: "일요일",
      kind: "TIME_LIMITED",
      expertName: "전문가 이름",
      tag: "헤어",
      likeCount: 33,
      priceWon: 55_000,
      reviewPriceWon: 50_000,
    },
  ];

  const filters: Category[] = ["전체", "헤어", "스킨케어", "패션", "메이크업"];
  const [selected, setSelected] = useState<Category>("스킨케어");

  const filteredPast = useMemo(() => {
    if (selected === "전체") return past;
    return past.filter((p) => p.tag === selected);
  }, [past, selected]);

  return (
    <div className="min-h-screen bg-white">
      {/* header */}
      <div className="px-5 pt-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="뒤로가기"
            className="grid h-9 w-9 place-items-center rounded-full active:bg-[#F2F2F7]"
          >
            <IconBack className="h-6 w-6 text-black" />
          </button>
          <h1 className="text-[18px] font-semibold text-black">예약 내역</h1>
        </div>
      </div>

      {/* content */}
      <div className="px-5 pb-10 pt-4">
        {/* waiting */}
        <SectionTitle>확정 대기 중인 예약 일정이에요</SectionTitle>
        <div className="mt-2">
          {waiting.map((it) => (
            <ReservationCard key={it.id} item={it} variant="waiting" />
          ))}
        </div>

        <Divider />

        {/* upcoming */}
        <SectionTitle>곧 다가오는 예약 일정이에요</SectionTitle>
        <div className="mt-2">
          {upcoming.map((it) => (
            <ReservationCard key={it.id} item={it} variant="upcoming" />
          ))}
        </div>

        <Divider />

        {/* past */}
        <h2 className="text-[16px] font-semibold text-black">지난 상담 내역</h2>

        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {filters.map((f) => (
            <FilterChip key={f} active={selected === f} onClick={() => setSelected(f)}>
              {f}
            </FilterChip>
          ))}
        </div>

        <div className="mt-2">
          {filteredPast.length === 0 ? (
            <div className="py-10 text-center text-[13px] text-[#8E8E93]">
              해당 카테고리의 지난 상담 내역이 없어요.
            </div>
          ) : (
            filteredPast.map((it) => <PastItem key={it.id} item={it} />)
          )}
        </div>
      </div>
    </div>
  );
}
