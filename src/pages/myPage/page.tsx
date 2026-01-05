import * as React from "react";
import { useNavigate } from "react-router-dom";
import HeadPhone from "@/images/mypage/headPhone.svg?react";
import Point from "@/images/mypage/point.svg?react";
import ReservationList from "@/images/mypage/reservationList.svg?react";
import Write from "@/images/mypage/wirte.svg?react";
import Heart from "@/images/mypage/heart.svg?react";
import Solution from "@/images/mypage/solution.svg?react";
import Payment from "@/images/mypage/payment.svg?react";
import Star from "@/images/mypage/star.svg?react";
import Question from "@/images/mypage/question.svg?react";

import { X } from "lucide-react";
import BottomNav from "@/components/navigation/bottom-nav";

type StatItem = {
  key: string;
  label: string;
  count: number;
  footerText: string;
  active?: boolean;
  icon: React.ReactNode;
  onClick?: () => void;
};

type MenuItem = {
  key: string;
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function MyPage() {
  const navigate = useNavigate();
  const userName = "최무헌" + "님";

  const [isReviewOpen, setIsReviewOpen] = React.useState(true);

  const stats: StatItem[] = [
    {
      key: "reservations",
      label: "예약 내역",
      count: 0,
      footerText: "보기",
      active: true,
      icon: <ReservationList />,
      onClick: () => navigate("/reservationhistory"),
    },
    {
      key: "likes",
      label: "찜",
      count: 0,
      footerText: "",
      icon: <Heart />,
      onClick: () => navigate("/LikedList"),
    },
    {
      key: "points",
      label: "포인트",
      count: 0,
      footerText: "",
      icon: <Point />,
      onClick: () => navigate("/PointPage"),
    },
    {
      key: "reviews",
      label: "나의 후기",
      count: 0,
      footerText: "",
      icon: <Write />,
      onClick: () => console.log("나의 후기"),
    },
  ];

  const sections: Array<{
    title: string;
    items: MenuItem[];
  }> = [
    {
      title: "결과 확인하기",
      items: [
        {
          key: "solution",
          label: "전문가의 솔루션 확인하기",
          icon: <Solution />,
          onClick: () => console.log("솔루션 확인"),
        },
      ],
    },
    {
      title: "결제 내역",
      items: [
        {
          key: "payments",
          label: "결제 내역 확인하기",
          icon: <Payment />,
          onClick: () => console.log("결제 내역"),
        },
      ],
    },
    {
      title: "설정",
      items: [
        {
          key: "interests",
          label: "관심 분야 설정",
          icon: <Star className="text-black fill-white" />,
          onClick: () => console.log("관심 분야"),
        },
        // {
        //   key: "notifications",
        //   label: "알림 설정",
        //   icon: <BellIcon />,
        //   onClick: () => console.log("알림 설정"),
        // },
      ],
    },
    {
      title: "문의",
      items: [
        {
          key: "support",
          label: "고객센터/공지사항",
          icon: <HeadPhone className="h-5 w-5" />,
          onClick: () => console.log("고객센터/공지사항"),
        },
        {
          key: "faq",
          label: "FAQ",
          icon: <Question />,
          onClick: () => console.log("FAQ"),
        },
      ],
    },
  ];

  return (
    <div className="flex h-full flex-col bg-white">
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full px-5 pb-10">
        {/* Header */}
        <header className="pt-7">
          <h1 className="pre_title_semi_20 text-neutral-900">마이페이지</h1>

          <div className="mt-5 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="pre_title_semi_18 text-neutral-900">{userName}</p>
            </div>

            <button
              type="button"
              onClick={() => console.log("내 정보 수정")}
              className="shrink-0 bg-neutral-100 px-[10px] py-[6px] pre_body_semi_12 hover:bg-neutral-200 active:bg-neutral-300"
            >
              내 정보 수정
            </button>
          </div>

          {/* Stats */}
          <div className="mt-5 rounded-xl bg-white">
            <div className="grid grid-cols-4 items-stretch overflow-hidden">
              {stats.map((s, idx) => (
                <div key={s.key} className="relative">
                  {idx !== 0 && (
                    <div className="absolute left-0 top-3 h-[52px] w-px bg-neutral-200" />
                  )}

                  <button
                    type="button"
                    onClick={s.onClick}
                    className="flex w-full flex-col items-center justify-center gap-1 px-2 py-3"
                  >
                    <span className="text-neutral-800">{s.icon}</span>
                    <span className="text-[12px] font-medium text-neutral-700">{s.label}</span>

                    <div className="mt-1 flex items-center justify-center">
                      <span className="text-[14px] font-semibold text-[#2F80FF]">
                        {s.active ? s.footerText : s.count}
                      </span>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </header>

        <div className={`h-1 w-full bg-[#E1E2E4]`} />

        {/* Review Card */}
        {isReviewOpen && (
          <section className="mt-5">
            <div className="relative rounded-[12px] bg-[#e5f4ff] px-4 py-6">
              {/* X 닫기 버튼 */}
              <button
                type="button"
                onClick={() => setIsReviewOpen(false)}
                aria-label="후기 카드 닫기"
                className="absolute right-3 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-black/5 active:bg-black/10"
              >
                <X className="h-5 w-5 text-neutral-700" />
              </button>

              <p className="pre_subtitle_semi_16 text-neutral-900 mb-4">
                박서령 전문가와의 상담은 어떠셨나요??
              </p>

              <div className="mt-3 flex items-center gap-3">
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-neutral-200" />
                <div className="min-w-0">
                  <p className="text-[14px] font-semibold text-neutral-900">박서령</p>
                  <p className="mt-0.5 truncate text-[12px] text-neutral-600">
                    전문가가 작성한 자신의 강점 한줄을 쓱써문가가 작...
                  </p>
                </div>
              </div>

              <div className="mt-4 h-px w-full bg-[#E5E5EA]" />

              <div className="mt-4 flex items-end justify-between gap-3">
                <div>
                  <p className="pre_subtitle_semi_16 text-black">
                    포인트 적립 <span className="pre_subtitle_semi_16 text-[#008bff]">500P</span>
                  </p>
                  <p className="mt-1 pre_body_med_12 text-[#878a93]">상담일 2025.10.08</p>
                </div>

                <button
                  type="button"
                  onClick={() => console.log("후기 작성")}
                  className="rounded-[4px] bg-white px-4 py-2 pre_body_reg_14 text-neutral-900 shadow-sm ring-1 ring-neutral-200 hover:bg-neutral-50 active:bg-neutral-100"
                >
                  후기 작성
                </button>
              </div>
            </div>

            <div className={`mt-7 h-1 w-full bg-[#E1E2E4]`} />
          </section>
        )}

        {/* Menus */}
        <div className="mt-3 space-y-6">
          {sections.map((section) => (
            <MenuSection key={section.title} title={section.title} items={section.items} />
          ))}
        </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}

function MenuSection({
  title,
  items,
  isLast,
}: {
  title: string;
  items: MenuItem[];
  isLast?: boolean;
}) {
  return (
    <section className={cn(!isLast && "border-b border-neutral-200")}>
      <p className="pt-6 pb-3 pre_body_med_14 text-[#878a93]">{title}</p>

      {items.map((item) => (
        <button
          key={item.key}
          type="button"
          onClick={item.onClick}
          className="flex w-full items-center gap-3 py-2 text-left"
        >
          <span className="text-[#181818]">{item.icon}</span>
          <span className="pre_body_med_16 text-[#181818]">{item.label}</span>
        </button>
      ))}
      <div className="pt-3 divide-y divide-neutral-200" />
    </section>
  );
}
