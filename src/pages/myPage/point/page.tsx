import * as React from "react";
import { useNavigate } from "react-router-dom";
//import { X } from "lucide-react";
import Back from "@/images/login/back.svg?react";
import Point from "@/images/mypage/point.svg?react";
import BottomNav from "@/components/navigation/bottom-nav";
import { getUserPointsHistory } from "@/api/mypage";

/** types */
type PointHistoryItem = {
  id: string;
  date: string; // "23.11.24"
  title: string; // description
  expiresAt?: string; // API에 없음 → optional 처리
  amount: number; // point_amount
};

function formatYYMMDD(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const yy = String(d.getFullYear()).slice(-2);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yy}.${mm}.${dd}`;
}

export default function PointPage() {
  const navigate = useNavigate();

  // 후기 유도 카드 닫기
  //const [reviewCardOpen, setReviewCardOpen] = React.useState(true);

  const [myPoint, setMyPoint] = React.useState(0);
  const [history, setHistory] = React.useState<PointHistoryItem[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const ac = new AbortController();

    (async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getUserPointsHistory({ signal: ac.signal });

        setMyPoint(data.totalPoints ?? 0);

        const mapped: PointHistoryItem[] = (data.history ?? []).map((h, idx) => ({
          id: `${h.date}-${idx}`,
          date: formatYYMMDD(h.date),
          title: h.description,
          amount: h.point_amount,
          // expiresAt
        }));

        setHistory(mapped);
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") return;
        if (e instanceof Error && (e as any).name === "AbortError") return;

        setError(e instanceof Error ? e.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    })();

    return () => ac.abort();
  }, []);

  return (
    <div className="flex h-full flex-col bg-white">
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-md">
          <div className="pt-6">
            {/* header */}
            <header className="sticky top-0 z-50 flex items-center px-1 py-2 ml-4 bg-white">
              <button onClick={() => navigate(-1)} className="mr-[8px]">
                <Back className="w-[18px] h-[18px]" />
              </button>
              <p className="pre_title_semi_20">포인트</p>
            </header>

            {/* My Point */}
            <section className="px-5 pt-5">
              <p className="pre_body_med_14 text-[#878a93]">내 포인트</p>

              <div className="mt-3 flex items-center gap-3">
                <Point className="w-6 h-6" />

                <p className="text-[24px] leading-[140%] font-semibold text-[#008bff]">
                  {myPoint.toLocaleString("ko-KR")}
                </p>
              </div>
            </section>

            {/* Divider (thick) */}
            <div className="mt-5 h-2 w-full bg-[#f4f4f5]" />

            {/* Review Card (기존 그대로)
            {reviewCardOpen && (
              <section className="px-5 pt-5">
                <div className="relative rounded-[12px] bg-[#E5F4FF] px-4 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-[14px] font-semibold text-neutral-900">
                      박서령 전문가와의 상담은 어떠셨나요?
                    </p>

                    <button
                      type="button"
                      aria-label="close"
                      onClick={() => setReviewCardOpen(false)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-black/5 active:bg-black/10"
                    >
                      <X className="h-5 w-5 text-neutral-600" />
                    </button>
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <div className="h-11 w-11 shrink-0 rounded-full bg-neutral-300" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[14px] font-semibold text-neutral-900">박서령</p>
                      <p className="mt-1 truncate text-[12px] text-neutral-500">
                        전문가가 작성한 자신의 강점 한줄 쓱싹문가가 작...
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 h-px w-full bg-[#E5E5EA]" />

                  <div className="mt-4 flex items-end justify-between gap-3">
                    <div>
                      <p className="text-[14px] font-semibold text-neutral-900">
                        포인트 적립{" "}
                        <span className="text-[14px] font-bold text-[#008bff]">500P</span>
                      </p>
                      <p className="mt-1 text-[12px] text-neutral-500">상담일 2025.10.08</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => console.log("후기 작성")}
                      className="h-[32px] rounded-[6px] bg-white px-4 text-[13px] font-semibold text-neutral-900 ring-1 ring-neutral-200 hover:bg-neutral-50 active:bg-neutral-100"
                    >
                      후기 작성
                    </button>
                  </div>
                </div>
              </section>
            )} */}

            {/* Point History */}
            <section className="px-5 pt-6 pb-12">
              <p className="pre_subtitle_semi_16 text-[#292a2d]">포인트 내역</p>

              {loading && <p className="mt-4 pre_body_med_14 text-[#878a93]">불러오는 중…</p>}

              {!loading && error && (
                <div className="mt-4 rounded-[12px] border border-[#F3D6D6] bg-[#FFF5F5] p-4">
                  <p className="pre_body_med_14 text-[#c03434]">{error}</p>
                </div>
              )}

              {!loading && !error && history.length === 0 && (
                <div className="py-16 text-center">
                  <p className="pre_body_med_14 text-[#878a93]">포인트 내역이 없습니다.</p>
                </div>
              )}

              {!loading && !error && history.length > 0 && (
                <div className="mt-4 divide-y divide-[#f4f4f5]">
                  {history.map((h) => {
                    const isMinus = h.amount < 0;
                    const abs = Math.abs(h.amount);

                    return (
                      <div key={h.id} className="py-5">
                        <div className="flex items-start gap-4">
                          {/* date */}
                          <p className="w-[48px] shrink-0 pre_body_reg_13 text-[#878a93]">
                            {h.date}
                          </p>

                          {/* title + (expires optional) */}
                          <div className="min-w-0 flex-1">
                            <p className="pre_subtitle_semi_16 text-[#292a2d]">{h.title}</p>
                            {h.expiresAt ? (
                              <p className="mt-1 pre_cap_reg_13 text-[#878a93]">{h.expiresAt}</p>
                            ) : null}
                          </div>

                          {/* amount */}
                          <p
                            className={
                              "mt-[1px] shrink-0 pre_title_semi_18 " +
                              (isMinus ? "text-[#c03434]" : "text-[#008bff]")
                            }
                          >
                            {isMinus ? "-" : "+"}
                            {abs.toLocaleString("ko-KR")}P
                          </p>
                        </div>
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
