import * as React from "react";
import { useNavigate } from "react-router-dom";
import HeadPhone from "@/images/mypage/headPhone.svg?react";
import Point from "@/images/mypage/point.svg?react";
import ReservationList from "@/images/mypage/reservationList.svg?react";
import Write from "@/images/mypage/wirte.svg?react";
import Heart from "@/images/mypage/heart.svg?react";
import Solution from "@/images/mypage/solution.svg?react";
import Payment from "@/images/mypage/payment.svg?react";
import EmptyStar from "@/images/mypage/emptyStar.svg?react";
import Question from "@/images/mypage/question.svg?react";
import DeleteUser from "@/images/mypage/deleteUser.svg?react";
import Logout from "@/images/mypage/logout.svg?react";
{/*소개서 수정, 포트폴리오 관리 임시 라우팅 개발하실 때 이 주석 지우고 살리시면 됩니다!*/} 
//import Portfolio from "@/images/mypage/portfolio.svg?react";
//import Retouch from "@/images/mypage/retouch.svg?react";

import { getUserMe, myPageLogout, type UserMe } from "@/api/mypage";

//import { X } from "lucide-react";
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

  const [me, setMe] = React.useState<UserMe | null>(null);
  const [meLoading, setMeLoading] = React.useState(false);

  // const [isReviewOpen, setIsReviewOpen] = React.useState(true);

  React.useEffect(() => {
    const ac = new AbortController();

    (async () => {
      try {
        setMeLoading(true);
        const data = await getUserMe({ signal: ac.signal });
        setMe(data);
      } catch (e) {
        // Abort는 조용히 무시
        if (e instanceof DOMException && e.name === "AbortError") return;
        console.error(e);
      } finally {
        setMeLoading(false);
      }
    })();

    return () => ac.abort();
  }, []);

  const userName = `${me?.nickname ?? "사용자"}님`;
  {/*소개서 수정, 포트폴리오 관리 임시 라우팅 */}
  //const isExpert = me?.userType === "EXPERT";

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
      count: me?.expertLikeCount ?? 0,
      footerText: "",
      icon: <Heart />,
      onClick: () => navigate("/LikedList"),
    },
    {
      key: "points",
      label: "포인트",
      count: me?.points ?? 0,
      footerText: "",
      icon: <Point />,
      onClick: () => navigate("/PointPage"),
    },
    {
      key: "reviews",
      label: "나의 후기",
      count: me?.reviewCount ?? 0,
      footerText: "",
      icon: <Write />,
      onClick: () => navigate("/myreview"),
    },
  ];

  const onLogout = () => {
    void (async () => {
      try {
        await myPageLogout();
      } catch (e) {
        console.error("logout failed:", e);
      } finally {
        navigate("/", { replace: true });
      }
    })();
  };

  const sections: Array<{
    title: string;
    items: MenuItem[];
  }> = [
    {
      title: "상담 내역",
      items: [
        {
          key: "solution",
          label: "솔루션 확인하기",
          icon: <Solution />,
          onClick: () => navigate("/mypage/mySolution"),
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
          onClick: () => navigate("/mypage/paymentHistory"),
        },
      ],
    },
    {
      title: "설정",
      items: [
        {
          key: "interests",
          label: "관심 분야 설정",
          icon: <EmptyStar />,
          onClick: () => alert("아직 준비중인 기능입니다."),
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
          onClick: () => alert("아직 준비중인 기능입니다."),
        },
        {
          key: "faq",
          label: "FAQ",
          icon: <Question />,
          onClick: () => alert("아직 준비중인 기능입니다."),
        },
      ],
    },
    {
      title: "계정",
      items: [
        {
          key: "logout",
          label: "로그아웃",
          icon: <Logout className="h-5 w-5" />,
          onClick: () => onLogout(),
        },
        {
          key: "deleteUser",
          label: "회원탈퇴",
          icon: <DeleteUser />,
          onClick: () => alert("아직 준비중인 기능입니다."),
        },
      ],
    },
  ];

  {/*소개서 수정, 포트폴리오 관리 임시 라우팅 */}
  // if (isExpert) {
  //   sections.splice(3, 0, {
  //     title: "프로필",
  //     items: [
  //       {
  //         key: "expertIntro",
  //         label: "소개서 수정",
  //         icon: <Retouch />,
  //         onClick: () => navigate("/mypage/expert/introduction"),
  //       },
  //       {
  //         key: "expertPortfolio",
  //         label: "포트폴리오 관리",
  //         icon: <Portfolio />,
  //         onClick: () => navigate("/mypage/expert/portfolio"),
  //       },
  //     ],
  //   });
  // }

  return (
    <div className="flex h-full flex-col bg-white">
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full px-5 pb-10">
          {/* Header */}
          <header className="pt-7">
            <h1 className="pre_title_semi_20 text-[#181818]">마이페이지</h1>

            <div className="mt-5 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="pre_title_semi_18 text-[#181818]">
                  {userName}
                  {meLoading && (
                    <span className="ml-2 text-[12px] text-neutral-500">(불러오는 중...)</span>
                  )}
                </p>
              </div>

              <button
                type="button"
                onClick={() => console.log("내 정보 수정")}
                className="shrink-0 bg-[#f4f4f5] text-[#505158] px-[10px] py-[6px] pre_body_semi_12 hover:bg-neutral-200 active:bg-neutral-300"
              >
                내 정보
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

          <div className={`h-2 bg-[#f1f1f6] -mx-5`} />

          {/* Review Card */}
          {/*    {isReviewOpen && (
            <section className="mt-5">
              <div className="relative rounded-[12px] bg-[#e5f4ff] px-4 py-6">
             
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

              <div className={`mt-7 h-2 bg-[#f1f1f6] -mx-5`} />
            </section>
          )} */}

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
