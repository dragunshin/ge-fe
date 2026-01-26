import React, { useEffect, useMemo, useState } from "react";
import Back from "@/images/login/back.svg?react";
import Sol from "@/images/mypage/solution.svg?react";
import Message from "@/images/mypage/message.svg?react";
import SandClock from "@/images/mypage/sandClock.svg?react";
import BottomNav from "@/components/navigation/bottom-nav";
import { useNavigate } from "react-router-dom";
import { MoreVertical } from "lucide-react";

import { getConsultationsSolutions, type ConsultationSolutionApiItem } from "@/api/mypage";

/** utils */
function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/** types */
type ConsultKind = "MESSAGE" | "TIME_LIMITED";
type Category = "전체" | "헤어" | "메이크업" | "스킨" | "패션";

type SolutionItem = {
  id: string;
  consultationId: number;
  dateLabel: string;
  expertName: string;
  tag: Exclude<Category, "전체">;
  kind: ConsultKind;
  expertUserId: string;
};

function toConsultKind(v: string): ConsultKind {
  return v === "MESSAGE" ? "MESSAGE" : "TIME_LIMITED";
}

function toKoCategory(v: string): Exclude<Category, "전체"> {
  switch (v) {
    case "HAIR":
      return "헤어";
    case "MAKEUP":
      return "메이크업";
    case "SKINCARE":
      return "스킨";
    case "FASHION":
      return "패션";
    default:
      return "헤어";
  }
}

function formatYYYYMMDD(iso: string) {
  const d = new Date(iso);
  const yyyy = String(d.getFullYear());
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}.${mm}.${dd}`;
}

function mapSolution(a: ConsultationSolutionApiItem): SolutionItem {
  const tag = toKoCategory(a.category);

  return {
    id: `s-${a.consultationId}`,
    consultationId: a.consultationId,
    dateLabel: formatYYYYMMDD(a.date),
    expertName: a.expertName,
    tag,
    kind: toConsultKind(a.consultationType),
    expertUserId: a.expertUserId,
  };
}

/** ui */
function Badge({ kind }: { kind: ConsultKind }) {
  const isMessage = kind === "MESSAGE";
  return (
    <span className="inline-flex items-center gap-1 rounded-[100px] bg-[#EAF3FF] px-3 py-1 pre_cap_reg_13 text-[#333438]">
      {isMessage ? (
        <Message className="h-[14px] w-[14px] mr-1" />
      ) : (
        <SandClock className="h-[18px] w-[18px]" />
      )}
      {isMessage ? "메시지 상담" : "시간제한형 상담"}
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
        "whitespace-nowrap rounded-[4px] border px-3 py-[6px] pre_cap_reg_13",
        active
          ? "pre_cap_semi_13 bg-[#46474c] text-white"
          : "border-[#Dbdcdf] bg-white text-[#46474c]",
      )}
    >
      {children}
    </button>
  );
}

function FileRow({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-4 flex w-full items-center gap-3 rounded-[6px] border border-[#dbdcdf] bg-white px-4 py-3 text-left active:scale-[0.999]"
    >
      {/* <FileText className="h-6 w-6 text-[#6B6E76]" /> */}
      <Sol className="h-[18px] w-[18px]" />
      <span className="min-w-0 flex-1 truncate pre_body_reg_14 text-[#46474c]">{label}</span>
    </button>
  );
}

function SolutionCard({ item }: { item: SolutionItem }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white">
      {/* date row */}
      <div className="flex items-center justify-between py-0">
        <span className="pre_subtitle_semi_16 text-black">{item.dateLabel}</span>
        <button
          type="button"
          aria-label="더보기"
          className="rounded-[6px] p-2 active:bg-[#F1F2F4]"
          onClick={() => {
            // TODO: 옵션 메뉴
          }}
        >
          <MoreVertical className="h-5 w-5 text-[#8E8E93]" />
        </button>
      </div>

      {/* expert row */}
      <div className="flex items-center gap-2">
        <p className="pre_subtitle_semi_16 text-[#292a2d]">{item.expertName}</p>
        <TagChip>{item.tag}</TagChip>
        <Badge kind={item.kind} />
      </div>

      {/* file row */}
      <FileRow
        label="솔루션지 보러가기"
        onClick={() => navigate(`/consultations/${item.consultationId}/solution`)}
      />

      {/* actions */}
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          className="py-2 rounded-[4px] bg-[#0f0f10] px-4 pre_subtitle_med_14 text-white active:scale-[0.99]"
          onClick={() => navigate(`/experts/${item.expertUserId}`)}
          //onClick={() => alert("아직 준비중인 기능입니다.")}
        >
          다시 상담받기
        </button>
        <button
          type="button"
          className="py-2 rounded-[4px] border border-[#Dbdcdf] bg-white px-4 pre_subtitle_med_14 text-[#171719] active:scale-[0.99]"
          onClick={() => navigate(`/myreview`)}
        >
          후기 보기
        </button>
      </div>
    </div>
  );
}

/** page */
export default function MySolutionView() {
  const [items, setItems] = useState<SolutionItem[]>([]);
  const [loading, setLoading] = useState(false);

  /** ✅ ReservationHistoryView와 동일한 필터 구성 */
  const filters: Category[] = ["전체", "헤어", "패션", "메이크업", "스킨"];
  const [selected, setSelected] = useState<Category>("전체");

  const navigate = useNavigate();

  useEffect(() => {
    const ac = new AbortController();

    (async () => {
      try {
        setLoading(true);
        const data = await getConsultationsSolutions({ signal: ac.signal });
        setItems((data ?? []).map(mapSolution));
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") return;
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();

    return () => ac.abort();
  }, []);

  /** ✅ 기능: 선택된 카테고리에 따라 필터링 */
  const filtered = useMemo(() => {
    if (selected === "전체") return items;
    return items.filter((it) => it.tag === selected);
  }, [items, selected]);

  return (
    <div className="flex h-full flex-col bg-white">
      <main className="flex-1 overflow-y-auto scrollbar-hide overscroll-none">
        {/* header */}
        <header className="mt-3 flex items-center px-1 py-2 ml-4 bg-white">
          <button onClick={() => navigate(-1)} className="mr-[8px]">
            <Back className="w-[18px] h-[18px]" />
          </button>
          <p className="pre_title_semi_20">전문가 솔루션</p>
        </header>

        <div className="px-5 pt-2">
          <div className="mt-2 flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
            {filters.map((f) => (
              <FilterChip key={f} active={selected === f} onClick={() => setSelected(f)}>
                {f}
              </FilterChip>
            ))}
          </div>
        </div>

        {/* content */}
        <div className="px-5 pb-10 pt-4">
          {loading ? (
            <div className="py-10 text-center text-[13px] text-[#8E8E93]">불러오는 중…</div>
          ) : filtered.length === 0 ? (
            <div className="py-10 text-center text-[13px] text-[#8E8E93]">
              해당 카테고리의 솔루션이 없어요.
            </div>
          ) : (
            filtered.map((it, idx) => (
              <div key={it.id}>
                <SolutionCard item={it} />
                {idx !== filtered.length - 1 ? (
                  <div className="h-2 bg-[#f1f1f6] mt-[24px] mb-[20px] -mx-5" />
                ) : null}
              </div>
            ))
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
