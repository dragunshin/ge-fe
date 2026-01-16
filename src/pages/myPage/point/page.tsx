import * as React from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import Back from "@/images/login/back.svg?react";
import Point from "@/images/mypage/point.svg?react";
import BottomNav from "@/components/navigation/bottom-nav";

/** types */
type PointHistoryItem = {
  id: string;
  date: string; // "23.11.24"
  title: string; // "리뷰 작성 적립"
  expiresAt: string; // "26.11.23 23:59까지"
  amount: number; // 3000
};

export default function PointPage() {
  const navigate = useNavigate();

  // 상단 포인트
  const myPoint = 3000;

  // 후기 유도 카드 닫기
  const [reviewCardOpen, setReviewCardOpen] = React.useState(true);

  // 포인트 내역 샘플
  const history: PointHistoryItem[] = [
    {
      id: "1",
      date: "23.11.24",
      title: "리뷰 작성 적립",
      expiresAt: "26.11.23 23:59까지",
      amount: 3000,
    },
    {
      id: "2",
      date: "23.11.24",
      title: "리뷰 작성 적립",
      expiresAt: "26.11.23 23:59까지",
      amount: 3000,
    },
    {
      id: "3",
      date: "23.11.24",
      title: "리뷰 작성 적립",
      expiresAt: "26.11.23 23:59까지",
      amount: 3000,
    },
  ];

  return (
    <div className="flex h-full flex-col bg-white">
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-md">
          <div className="pt-6">
            {/* header */}
            <header className="app-header flex items-center px-1 py-2 ml-4 bg-white">
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

                <p className="text-[28px] leading-[140%] font-semibold text-[#008bff]">
                  {myPoint.toLocaleString("ko-KR")}
                </p>
              </div>
            </section>

            {/* Divider (thick) */}
            <div className="mt-5 h-2 w-full bg-[#f4f4f5]" />

            {/* Review Card */}
            {reviewCardOpen && (
              <section className="px-5 pt-5">
                <div className="relative rounded-[12px] bg-[#E5F4FF] px-4 py-4">
                  {/* title + close */}
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

                  {/* expert row */}
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

                  {/* bottom */}
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
            )}

            {/* Point History */}
            <section className="px-5 pt-6 pb-12">
              <h2 className="text-[16px] font-semibold text-neutral-900">포인트 내역</h2>

              <div className="mt-4 divide-y divide-[#E5E5EA]">
                {history.map((h) => (
                  <div key={h.id} className="py-5">
                    <div className="flex items-start gap-4">
                      {/* date (왼쪽) - 위로 올림 */}
                      <p className="w-[48px] shrink-0 pre_body_reg_13 text-[#878a93]">{h.date}</p>

                      {/* title + expires (가운데) */}
                      <div className="min-w-0 flex-1">
                        <p className="pre_subtitle_semi_14 text-[#292a2d]">{h.title}</p>
                        <p className="mt-1 pre_cap_reg_13 text-[#878a93]">{h.expiresAt}</p>
                      </div>

                      {/* amount (오른쪽) - 제목 라인에 맞춰 살짝 내림/올림 조절 */}
                      <p className="mt-[1px] shrink-0 pre_title_semi_18 text-[#008bff]">
                        +{h.amount.toLocaleString("ko-KR")}P
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
