import * as React from "react";
import ReviewCard from "@/pages/myPage/components/ReviewCard";

const sampleReviews = [
  {
    id: "r1",
    name: "김민수",
    rating: 5,
    date: "2025.12.20",
    content: "정말 만족스러웠어요. 상담 내용이 정확하고 실용적이었습니다. 다음에도 이용할게요.",
  },
  {
    id: "r2",
    name: "이영희",
    rating: 4,
    date: "2025.11.30",
    content: "친절했고 설명이 쉬웠어요. 시간도 정확했습니다.",
  },
];

export default function WriteReviewPage() {
  return (
    <div className="min-h-screen bg-[#F7F8FB]">
      <div className="mx-auto w-full max-w-md px-5 pb-10">
        <header className="pt-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="back"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#0F172A] shadow-sm ring-1 ring-[#E5E7EB]"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <h1 className="text-[20px] font-semibold text-[#0F172A]">내 후기</h1>
          </div>
        </header>

        <main className="mt-6 space-y-4">
          <section>
            <div className="flex items-center justify-between">
              <h2 className="text-[16px] font-semibold text-[#0F172A]">작성한 후기</h2>
              <button className="text-[12px] font-medium text-[#2563EB]">전체보기</button>
            </div>

            <div className="mt-3 space-y-3">
              {sampleReviews.map((r) => (
                <ReviewCard
                  key={r.id}
                  reviewerName={r.name}
                  rating={r.rating}
                  date={r.date}
                  content={r.content}
                />
              ))}
            </div>
          </section>

          <section className="mt-4">
            <h2 className="text-[16px] font-semibold text-[#0F172A]">후기 작성하기</h2>
            <div className="mt-3 rounded-2xl bg-white p-4">
              <textarea
                className="w-full min-h-[120px] resize-none rounded-md border border-[#E5E7EB] px-3 py-2 text-[14px] text-[#374151]"
                placeholder="후기를 작성해주세요 (최소 10자)"
              />

              <div className="mt-3 flex items-center justify-between">
                <div className="text-[12px] text-[#9CA3AF]">0 / 1000</div>
                <button className="h-10 rounded-[10px] bg-[#2563EB] px-4 text-[14px] font-medium text-white">
                  작성 완료
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
