import React, { useMemo, useState } from "react";
import Back from "@/images/login/back.svg?react";
import Heart from "@/images/mypage/heart.svg?react";
import Payment from "@/images/mypage/payment.svg?react";
import Write from "@/images/mypage/wirte.svg?react";
import Message from "@/images/mypage/message.svg?react";
import SandClock from "@/images/mypage/sandClock.svg?react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/navigation/bottom-nav";

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

/** ui */
function Badge({ kind }: { kind: ConsultKind }) {
  const isMessage = kind === "MESSAGE";
  return (
    <span className="inline-flex items-center gap-1 ml-2 rounded-full bg-[#EAF3FF] px-3 py-1 pre_cap_reg_12 text-[#333438]">
      {isMessage ? (
        <Message className="h-[12px] w-[12px] mr-1" />
      ) : (
        <SandClock className="h-[20px] w-[20px]" />
      )}
      {isMessage ? "메시지 상담" : "시간제한형 상담"}
    </span>
  );
}

function TagChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded bg-[#EAF3FF] px-2 py-[2px] pre_cap_reg_12 text-[#008bff]">
      {children}
    </span>
  );
}

function Divider() {
  // return <div className="h-[8px] w-full bg-[#e1e2e4]" />;
  return <div className="mt-6 divide-y divide-[#e1e2e4]" />;
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
          <span className="pre_subtitle_semi_16 text-black">{item.dateLabel}</span>
          <span className="pre_cap_reg_14 text-[#70737C]">{item.dayLabel}</span>
          <Badge kind={item.kind} />
        </div>
      </div>
      {/* <div className="mt-6 divide-y divide-[#e1e2e4]" /> */}
      <hr className="mt-[4px] mb-4 border-[#e1e2e4]" />
      <div className="mt-2 flex gap-3">
        <div className="h-[60px] w-[60px] shrink-0 rounded-full bg-[#Dbdcdf]" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-[15px] font-semibold text-black">{item.expertName}</p>
            <TagChip>{item.tag}</TagChip>
          </div>
          <p className="mt-1 line-clamp-2 pre_cap_reg_13 text-[#878a93]">{item.desc}</p>

          <div className="mt-3 flex gap-2">
            {variant === "waiting" && item.canChange && (
              <button
                type="button"
                className="h-9 w-[81px] border border-[#Dbdcdf] bg-white pre_body_med_14 text-black active:scale-[0.99]"
              >
                예약변경
              </button>
            )}
            {item.canCancel && (
              <button
                type="button"
                className={cn(
                  "h-9 w-[81px] border border-[#D1D1D6] bg-white pre_body_med_14 text-black active:scale-[0.99]",
                  // variant === "upcoming" ? "flex-1" : "flex-1",
                  //variant === "upcoming" ? "w-[120px]" : "w-[81px]",
                )}
              >
                예약취소
              </button>
            )}
          </div>
        </div>
      </div>
      <hr className="mt-[24px] mb-[30px] border-[#e1e2e4] border-t-4" />

      {/* <div className="mt-4 h-px w-full bg-[#E5E5EA]" /> */}
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
        "h-9 whitespace-nowrap rounded-md border px-4 pre_cap_semi_13 active:scale-[0.99]",
        active
          ? "border-[#1C1C1E] bg-[#46474c] text-white"
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
          <span className="pre_subtitle_semi_16 text-black">{item.dateLabel}</span>
          <span className="pre_cap_reg_14 text-[#70737C]">{item.dayLabel}</span>
          <Badge kind={item.kind} />
        </div>
      </div>
      <hr className="flex-1 mt-[4px] mb-4 border-[#e1e2e4]" />

      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="text-[15px] font-semibold text-black">{item.expertName}</p>
          <TagChip>{item.tag}</TagChip>
        </div>

        <div className="flex items-center gap-1">
          <Heart className="h-5 w-5 fill-[#FF3434]" stroke="#FF3434" />
          <span className="pre_cap_reg_13 text-[#878a93]">{item.likeCount}</span>
        </div>
      </div>

      <div className="mt-2 flex items-center gap-2 text-[#3A3A3C]">
        <Payment className="h-4 w-4" />
        <span className="pre_body_med_14">{item.priceWon.toLocaleString("ko-KR")}원</span>
      </div>

      <div className="mt-2 flex items-center gap-2">
        <Write className="h-4 w-4 text-[#3A3A3C]" />
        <span className="pre_body_med_14 text-[#3A3A3C]">
          후기 작성 시{" "}
          <span className="pre_body_med_14 text-[#008bff]">
            {item.reviewPriceWon.toLocaleString("ko-KR")}원
          </span>
        </span>
      </div>

      <div className="mt-3 rounded-[8px] bg-[#e5f4ff] px-4 py-3 pre_body_semi_14 text-[#292a2d]">
        후기를 남겨주시면 1000원을 환급해드려요.
      </div>

      <div className="mt-4 flex gap-2 mx-3">
        <button
          type="button"
          className="h-11 flex-1 rounded-[4px] bg-[#1C1C1E] text-[14px] font-semibold text-white active:scale-[0.99]"
        >
          다시 상담받기
        </button>
        <button
          type="button"
          className="h-11 flex-1 rounded-[4px] border border-[#D1D1D6] bg-white text-[14px] font-semibold text-black active:scale-[0.99]"
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
  const navigate = useNavigate();

  const filteredPast = useMemo(() => {
    if (selected === "전체") return past;
    return past.filter((p) => p.tag === selected);
  }, [past, selected]);

  return (
    <div className="flex h-full flex-col bg-white">
      <main className="flex-1 overflow-y-auto">
        {/* header */}
        <header className="flex items-center px-4 py-4 bg-white">
          <button onClick={() => navigate(-1)} className="mr-3">
            <Back className="w-[18px] h-[18px]" />
          </button>
          <h1 className="pre_title_semi_20">예약 내역</h1>
        </header>

        {/* content */}
        <div className="px-5 pb-10 pt-4">
        {/* waiting */}
        <span className="pre_body_med_14 text-[#878a93]">확정 대기 중인 예약 일정이에요</span>
        <div className="mt-2">
          {waiting.map((it) => (
            <ReservationCard key={it.id} item={it} variant="waiting" />
          ))}
        </div>

        <Divider />

        {/* upcoming */}
        <span className="pre_body_med_14 text-[#878a93]">곧 다가오는 예약 일정이에요</span>
        <div className="mt-2">
          {upcoming.map((it) => (
            <ReservationCard key={it.id} item={it} variant="upcoming" />
          ))}
        </div>

        <Divider />

        {/* past */}
        <h2 className="pre_subtitle_semi_16 text-black mb-5">지난 상담 내역</h2>

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
      </main>
      <BottomNav />
    </div>
  );
}
