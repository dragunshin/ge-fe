// src/pages/mypage/PaymentHistoryPage.tsx
import * as React from "react";
import { useNavigate } from "react-router-dom";
import Back from "@/images/login/back.svg?react";
import BottomNav from "@/components/navigation/bottom-nav";
import { getReservationPayments, type PaymentCategory, type PaymentItem } from "@/api/mypage";

/** utils */
function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function formatYYMMDD(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const yy = String(d.getFullYear()).slice(-2);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yy}.${mm}.${dd}`;
}

function categoryKo(cat: PaymentCategory) {
  switch (cat) {
    case "HAIR":
      return "헤어";
    case "MAKEUP":
      return "메이크업";
    case "SKINCARE":
      return "스킨";
    case "FASHION":
      return "패션";
    default:
      return "기타";
  }
}

function statusKo(status: string) {
  switch (status) {
    case "PAID":
      return "결제 확정";
    case "UNPAID":
      return "결제 대기";
    case "CANCELED":
      return "결제 취소";
    default:
      return "상태 확인";
  }
}

/** ✅ ReservationHistoryView에서 그대로 가져온 FilterChip */
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

/** ✅ 결제 내역 필터 (FilterChip용) */
type PaymentFilter = "전체" | "헤어" | "메이크업" | "스킨" | "패션";
const FILTERS: PaymentFilter[] = ["전체", "헤어", "패션", "메이크업", "스킨"];

function toFilterKey(cat: PaymentCategory): Exclude<PaymentFilter, "전체"> {
  switch (cat) {
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

export default function PaymentHistoryPage() {
  const navigate = useNavigate();

  /** ✅ 탭 대신 FilterChip 상태 */
  const [selected, setSelected] = React.useState<PaymentFilter>("전체");

  const [listCount, setListCount] = React.useState(0);
  const [payments, setPayments] = React.useState<PaymentItem[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const ac = new AbortController();

    (async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getReservationPayments(ac.signal);
        setListCount(data.listCount ?? data.payments?.length ?? 0);
        setPayments(data.payments ?? []);
      } catch (e) {
        // ✅ abort는 정상 취소로 간주
        if (e instanceof DOMException && e.name === "AbortError") return;
        if (e instanceof Error && (e as any).name === "AbortError") return;

        const msg = e instanceof Error ? e.message : "Unknown error";
        setError(msg);
      } finally {
        setLoading(false);
      }
    })();

    return () => ac.abort();
  }, []);

  // const filtered = React.useMemo(() => {
  //   if (selected === "전체") return payments;
  //   return payments.filter((p) => toFilterKey(p.category) === selected);
  // }, [payments, selected]);

  const filtered = React.useMemo(() => {
    const base =
      selected === "전체" ? payments : payments.filter((p) => toFilterKey(p.category) === selected);

    return [...base].sort((a, b) => {
      return new Date(b.confirmedDate).getTime() - new Date(a.confirmedDate).getTime();
    });
  }, [payments, selected]);

  const countText = selected === "전체" ? listCount || payments.length : filtered.length;

  return (
    <div className="flex h-full flex-col bg-white">
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-md">
          <div className="pt-6">
            {/* header */}
            <header className="flex items-center px-1 py-2 ml-4 bg-white">
              <button onClick={() => navigate(-1)} className="mr-[8px]">
                <Back className="w-[18px] h-[18px]" />
              </button>
              <p className="pre_title_semi_20">결제 내역</p>
            </header>

            <section className="px-5 pt-4">
              <div className="mt-3 flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                {FILTERS.map((f) => (
                  <FilterChip key={f} active={selected === f} onClick={() => setSelected(f)}>
                    {f}
                  </FilterChip>
                ))}
              </div>

              <p className="mt-4 pre_subtitle_semi_16 text-[#181818]">총 {countText}건</p>
            </section>

            {/* List */}
            <section className="px-5 pt-4 pb-12">
              {loading && <p className="pre_body_med_14 text-[#878a93]">불러오는 중…</p>}

              {!loading && error && (
                <div className="rounded-[12px] border border-[#F3D6D6] bg-[#FFF5F5] p-4">
                  <p className="pre_body_med_14 text-[#c03434]">{error}</p>
                </div>
              )}

              {!loading && !error && filtered.length === 0 && (
                <div className="py-16 text-center">
                  <p className="pre_body_med_14 text-[#878a93]">결제 내역이 없습니다.</p>
                </div>
              )}

              {!loading && !error && filtered.length > 0 && (
                <div className="mt-2 space-y-8">
                  {filtered.map((p) => {
                    const leftDate = formatYYMMDD(p.confirmedDate);
                    const title = `${p.expertNickname} ${categoryKo(p.category)} 전문가`;
                    const sub = `${formatYYMMDD(p.confirmedDate)} ${statusKo(p.status)}`;

                    return (
                      <div key={p.reservationId} className="flex items-start gap-4">
                        {/* left date */}
                        <p className="w-[60px] shrink-0 pre_body_reg_13 text-[#878a93]">
                          {leftDate}
                        </p>

                        {/* center */}
                        <div className="min-w-0 flex-1">
                          <p className="pre_subtitle_semi_14 text-[#292a2d]">{title}</p>
                          <p className="mt-1 pre_cap_reg_13 text-[#878a93]">{sub}</p>
                        </div>

                        {/* right amount */}
                        <p className="mt-[1px] shrink-0 pre_title_semi_18 text-[#008bff]">
                          {p.cost.toLocaleString("ko-KR")}원
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
