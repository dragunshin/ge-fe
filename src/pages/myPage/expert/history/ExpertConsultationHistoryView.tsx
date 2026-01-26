import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Back from "@/images/login/back.svg?react";
import Message from "@/images/mypage/message.svg?react";
import SandClock from "@/images/mypage/sandClock.svg?react";
import Payment from "@/images/mypage/payment.svg?react";

import { getExpertConsultationsHistory, type ExpertConsultationHistoryItem } from "@/api/expert";

type ConsultKind = "MESSAGE" | "TIME_LIMITED";
type CategoryKo = "헤어" | "스킨" | "패션" | "메이크업";

type Row = {
  id: string;
  dateLabel: string; // "10.18"
  dayLabel: string; // "일요일"
  kind: ConsultKind;
  memberNickname: string;
  tag: CategoryKo;
  priceWon: number;
  solutionWritten: boolean;
  consultationId: number;
  chatroomId: number;
};

function toKoCategory(v: ExpertConsultationHistoryItem["category"]): CategoryKo {
  switch (v) {
    case "HAIR":
      return "헤어";
    case "SKINCARE":
      return "스킨";
    case "FASHION":
      return "패션";
    case "MAKEUP":
      return "메이크업";
    default:
      return "헤어";
  }
}

function formatMMDD(iso: string) {
  const d = new Date(iso);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${mm}.${dd}`;
}

function toKoDayFromApi(dayOfWeek?: string): string | null {
  if (!dayOfWeek) return null;

  // 이미 "일요일" 같은 형태면 그대로
  if (dayOfWeek.includes("요일")) return dayOfWeek;

  const key = dayOfWeek.trim().toUpperCase();
  const map: Record<string, string> = {
    SUN: "일요일",
    SUNDAY: "일요일",
    MON: "월요일",
    MONDAY: "월요일",
    TUE: "화요일",
    TUESDAY: "화요일",
    WED: "수요일",
    WEDNESDAY: "수요일",
    THU: "목요일",
    THURSDAY: "목요일",
    FRI: "금요일",
    FRIDAY: "금요일",
    SAT: "토요일",
    SATURDAY: "토요일",
  };
  return map[key] ?? null;
}

function formatKoDay(iso: string) {
  const d = new Date(iso);
  const days = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"] as const;
  return days[d.getDay()];
}

function mapRow(x: ExpertConsultationHistoryItem): Row {
  return {
    id: `c-${x.consultationId}`,
    dateLabel: formatMMDD(x.consultationDate),
    dayLabel: toKoDayFromApi(x.dayOfWeek) ?? formatKoDay(x.consultationDate),
    kind: x.consultationType,
    memberNickname: x.memberNickname,
    tag: toKoCategory(x.category),
    priceWon: x.price,
    solutionWritten: x.solutionWritten,
    consultationId: x.consultationId,
    chatroomId: x.chatroomId,
  };
}

/** ui parts */
function Badge({ kind }: { kind: ConsultKind }) {
  const isMessage = kind === "MESSAGE";
  return (
    <span className="ml-2 inline-flex translate-y-0.5 items-center gap-1 rounded-[100px] bg-[#EAF3FF] px-3 py-1 pre_cap_reg_13 text-[#333438]">
      {isMessage ? (
        <Message className="mr-1 h-[14px] w-[14px]" />
      ) : (
        <SandClock className="h-[20px] w-[20px]" />
      )}
      {isMessage ? "메시지 상담" : "화상 상담"}
    </span>
  );
}

function TagChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center bg-[#EAF3FF] px-2 py-[4px] pre_cap_reg_12 text-[#008bff]">
      {children}
    </span>
  );
}

function UnwrittenBanner() {
  return (
    <div className="mb-5 rounded-[8px] bg-[#EAF3FF] px-4 py-3 pre_body_med_14 text-[#008BFF]">
      아직 작성 전인 솔루션지가 있어요.
    </div>
  );
}

function ItemCard({ item }: { item: Row }) {
  const navigate = useNavigate();

  const goChat = () => {
    navigate(`/chatlist/${item.chatroomId}`);
  };

  const goWriteSolution = () => {
    navigate(`/concern/${item.consultationId}`);
  };

  return (
    <div className="bg-white">
      {/* top meta */}
      <div className="flex items-center justify-between py-2">
        <div className="flex items-baseline gap-2">
          <span className="pre_subtitle_semi_16 text-black">{item.dateLabel}</span>
          <span className="pre_cap_reg_14 text-[#70737C] -translate-y-0.2">{item.dayLabel}</span>
          <Badge kind={item.kind} />
        </div>
      </div>

      <hr className="mt-[4px] mb-4 border-[#f1f1f6]" />

      {/* nickname + tag */}
      <div className="flex items-center gap-2">
        <p className="pre_subtitle_semi_16 text-[#292A2D]">{item.memberNickname}</p>
        <TagChip>{item.tag}</TagChip>
      </div>

      {/* price */}
      <div className="mt-2 flex items-center gap-2 text-[#3A3A3C]">
        <Payment className="h-[18px] w-[18px]" />
        <span className="pre_body_med_14">{item.priceWon.toLocaleString("ko-KR")}원</span>
      </div>

      {/* actions */}
      <div className="mt-4 flex justify-end gap-2 pb-4">
        {!item.solutionWritten ? (
          <>
            <button
              type="button"
              onClick={goWriteSolution}
              className="py-2 rounded-[4px] border border-[#dbdcdf] bg-white px-4 pre_body_med_14 text-[#171719] active:scale-[0.99]"
            >
              솔루션지 작성하기
            </button>
            <button
              type="button"
              onClick={goChat}
              className="py-2 rounded-[4px] border border-[#dbdcdf] bg-white px-4 pre_body_med_14 text-[#171719] active:scale-[0.99]"
            >
              채팅으로 이동
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={goChat}
            className="py-2 rounded-[4px] border border-[#dbdcdf] bg-white px-4 pre_body_med_14 text-[#171719] active:scale-[0.99]"
          >
            채팅으로 이동
          </button>
        )}
      </div>
    </div>
  );
}

/** page */
export default function ExpertConsultationHistoryView() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ac = new AbortController();

    (async () => {
      try {
        setLoading(true);
        const data = await getExpertConsultationsHistory({ signal: ac.signal });
        setRows((data ?? []).map(mapRow));
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") return;
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();

    return () => ac.abort();
  }, []);

  const hasUnwrittenSolution = useMemo(() => rows.some((r) => !r.solutionWritten), [rows]);

  return (
    <div className="flex h-full flex-col bg-white">
      <main className="flex-1 overflow-y-auto scrollbar-hide overscroll-none">
        {/* header */}
        <header className="sticky top-0 z-50 flex items-center bg-white px-1 pb-2 pt-3 ml-4">
          <button onClick={() => navigate(-1)} className="mr-[8px]">
            <Back className="h-[18px] w-[18px]" />
          </button>
          <p className="pre_title_semi_20">상담 내역</p>
        </header>

        {/* content */}
        <div className="px-5 pb-10 pt-4">
          {hasUnwrittenSolution && <UnwrittenBanner />}

          {loading ? (
            <div className="py-10 text-center text-[13px] text-[#8E8E93]">불러오는 중…</div>
          ) : rows.length === 0 ? (
            <div className="py-10 text-center text-[13px] text-[#8E8E93]">상담 내역이 없어요.</div>
          ) : (
            rows.map((it, idx) => (
              <React.Fragment key={it.id}>
                <ItemCard item={it} />
                {idx !== rows.length - 1 && <div className="h-2 bg-[#F1F1F6] -mx-5" />}
              </React.Fragment>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
