import * as React from "react";
import { useNavigate } from "react-router-dom";

import HeadPhone from "@/images/mypage/headPhone.svg?react";
import ReservationList from "@/images/mypage/reservationList.svg?react";
import Write from "@/images/mypage/wirte.svg?react";
import Heart from "@/images/mypage/heart.svg?react";
import Question from "@/images/mypage/question.svg?react";
import DeleteUser from "@/images/mypage/deleteUser.svg?react";
import Logout from "@/images/mypage/logout.svg?react";
import Solution from "@/images/mypage/solution.svg?react";

import Cal from "@/images/expert/cal.svg?react";
//import Money from "@/images/expert/money.svg?react";
import Note from "@/images/expert/note.svg?react";
import Shape from "@/images/expert/Shape.svg?react";
//import { ClipboardList } from "lucide-react";

import type { UserMe } from "@/api/mypage";
import BottomNav from "@/components/navigation/bottom-nav";

type StatItem = {
  key: string;
  label: string;
  count: number;
  footerText: string; // "보기" or ""
  active?: boolean; // true면 footerText 표시
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

export default function MyPageExpert({
  me,
  meLoading,
  onLogout,
}: {
  me: UserMe | null;
  meLoading: boolean;
  onLogout: () => void;
}) {
  const navigate = useNavigate();

  const userName = `${me?.nickname ?? "전문가님"}`;
  const userId = me?.userId ?? null;

  const stats: StatItem[] = [
    {
      key: "consultHistory",
      label: "상담내역",
      count: 0,
      footerText: "보기",
      active: true,
      icon: <ReservationList />,
      onClick: () => navigate("/expertConsultationHistory"), // TODO: 실제 라우트로 교체
    },
    {
      key: "likes",
      label: "찜",
      count: me?.expertLikeCount ?? 0,
      footerText: "",
      icon: <Heart />,
      //  onClick: () => alert("아직 준비중인 기능입니다."),
    },
    {
      key: "profile",
      label: "프로필",
      count: 0,
      footerText: "보기",
      active: true,
      icon: <Shape />,
      onClick: () => navigate(`/experts/${userId}`),
    },
    {
      key: "reviews",
      label: "나의 후기",
      count: me?.reviewCount ?? 0,
      footerText: "",
      icon: <Write />,
      //   onClick: () => navigate("/myreview"),
    },
  ];

  // ✅ 사진 메뉴 섹션 구성
  const sections: Array<{ title: string; items: MenuItem[] }> = [
    {
      title: "상담",
      items: [
        // {
        //   key: "availableSetting",
        //   label: "가능한 상담 설정",
        //   icon: <ClipboardList className="h-[18px] w-[18px]" />,
        //   onClick: () => navigate(`/expert/schedules/${userId}`), // TODO
        // },
        {
          key: "ConsultationSetting",
          label: "상담 설정",
          icon: <Solution className="h-[18px] w-[18px]" />,
          onClick: () => navigate(`/expert/schedules/${userId}`), // TODO
        },
        {
          key: "scheduleChange",
          label: "가능한 상담 일정 변경",
          icon: <Cal className="h-[18px] w-[18px]" />,
          onClick: () => alert("아직 준비중인 기능입니다."), // TODO
        },
      ],
    },
    {
      title: "프로필",
      items: [
        {
          key: "introEdit",
          label: "소개서 수정",
          icon: <Write className="h-[18px] w-[18px]" />,
          onClick: () => navigate("/mypage/expert/introduction"),
        },
        {
          key: "portfolio",
          label: "포트폴리오 관리",
          icon: <Note className="h-[18px] w-[18px]" />,
          onClick: () => navigate("/mypage/expert/portfolio"),
        },
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
          onClick: onLogout,
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

  return (
    <div className="flex h-full flex-col bg-white">
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full px-5 pb-10">
          {/* Header */}
          <header className="pt-7">
            {/* ✅ 사진처럼 타이틀은 중앙 정렬 */}
            <h1 className="pre_title_semi_20 text-[#181818] text-left">마이페이지</h1>

            <div className="mt-5 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="pre_title_semi_18 text-[#181818]">
                  {userName}
                  {meLoading && (
                    <span className="ml-2 text-[12px] text-neutral-500">(불러오는 중...)</span>
                  )}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-5 rounded-xl bg-white">
              <div className="grid grid-cols-4 items-stretch overflow-hidden">
                {stats.map((s, idx) => (
                  <div key={s.key} className="relative">
                    {idx !== 0 && (
                      <div className="absolute left-0 top-8 h-[32.5px] w-px bg-[#c2c4c8]" />
                    )}

                    <button
                      type="button"
                      onClick={s.onClick}
                      className="flex w-full flex-col items-center justify-center gap-1 px-2 py-3"
                    >
                      <span className="text-[#292a2d]">{s.icon}</span>
                      <span className="pre_body_reg_14 text-[#70737c]">{s.label}</span>

                      <div className="flex items-center justify-center">
                        <span className="pre_subtitle_semi_14 text-[#008bff]">
                          {s.active ? s.footerText : s.count}
                        </span>
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </header>

          {/* ✅ 회색 구분선 */}
          <div className="h-2 bg-[#f1f1f6] -mx-5" />

          {/* Menus */}
          <div className="mt-3 space-y-6">
            {sections.map((section, idx) => (
              <MenuSection
                key={section.title}
                title={section.title}
                items={section.items}
                isLast={idx === sections.length - 1}
              />
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

      {/* 기존 코드 그대로(실질적 영향 없음, 유지) */}
      <div className="pt-3 divide-y divide-neutral-200" />
    </section>
  );
}
