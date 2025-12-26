import * as React from "react";

//import HeadPhone from "@/images/mypage/headPhone.svg?react";
import Point from "@/images/mypage/point.svg?react";
import ReservationList from "@/images/mypage/reservationList.svg?react";
import Write from "@/images/mypage/wirte.svg?react";
import Heart from "@/images/mypage/heart.svg?react";

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
  const userName = "최무헌" + "님";

  const stats: StatItem[] = [
    {
      key: "reservations",
      label: "예약 내역",
      count: 0,
      footerText: "보기",
      active: true,
      icon: <ReservationList />,
      onClick: () => console.log("예약 내역"),
    },
    {
      key: "likes",
      label: "찜",
      count: 0,
      footerText: "",
      icon: <Heart />,
      onClick: () => console.log("찜"),
    },
    {
      key: "points",
      label: "포인트",
      count: 0,
      footerText: "",
      icon: <Point />,
      onClick: () => console.log("포인트"),
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
          icon: <DocIcon />,
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
          icon: <CardIcon />,
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
          icon: <StarIcon />,
          onClick: () => console.log("관심 분야"),
        },
        {
          key: "notifications",
          label: "알림 설정",
          icon: <BellIcon />,
          onClick: () => console.log("알림 설정"),
        },
      ],
    },
    {
      title: "문의",
      items: [
        {
          key: "support",
          label: "고객센터/공지사항",
          icon: <HeadsetIcon />,
          onClick: () => console.log("고객센터/공지사항"),
        },
        {
          key: "faq",
          label: "FAQ",
          icon: <HelpIcon />,
          onClick: () => console.log("FAQ"),
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto w-full  px-5 pb-10">
        {/* Header */}
        <header className="pt-7">
          <h1 className="text-[20px] font-semibold tracking-[-0.2px] text-neutral-900">
            마이페이지
          </h1>

          <div className="mt-5 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[18px] font-semibold text-neutral-900">{userName}</p>
            </div>

            <button
              type="button"
              onClick={() => console.log("내 정보 수정")}
              className="shrink-0 rounded-md bg-neutral-100 px-3 py-2 text-[12px] font-medium text-neutral-700 hover:bg-neutral-200 active:bg-neutral-300"
            >
              내 정보 수정
            </button>
          </div>

          {/* Stats */}
          <div className="mt-5 rounded-xl bg-white">
            <div className="grid grid-cols-4 items-stretch overflow-hidden rounded-xl border border-neutral-200">
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

        {/* Review Card */}
        <section className="mt-5">
          <div className="rounded-2xl border border-neutral-200 bg-sky-50 p-4">
            <p className="text-[14px] font-semibold text-neutral-900">
              박서령 전문가와의 상담은 어떠셨나요??
            </p>

            <div className="mt-3 flex items-center gap-3">
              <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-neutral-200" />
              <div className="min-w-0">
                <p className="text-[14px] font-semibold text-neutral-900">박서령</p>
                <p className="mt-0.5 truncate text-[12px] text-neutral-600">
                  전문가가 작성한 자신의 강점 한줄을 쓱써문가가 작...
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-end justify-between gap-3">
              <div>
                <p className="text-[12px] font-semibold text-sky-700">
                  포인트 적립 <span className="text-[16px] font-bold text-sky-700">500P</span>
                </p>
                <p className="mt-1 text-[12px] text-neutral-500">상담일 2025.10.08</p>
              </div>

              <button
                type="button"
                onClick={() => console.log("후기 작성")}
                className="rounded-lg bg-white px-4 py-2 text-[13px] font-semibold text-neutral-800 shadow-sm ring-1 ring-neutral-200 hover:bg-neutral-50 active:bg-neutral-100"
              >
                후기 작성
              </button>
            </div>
          </div>
        </section>

        {/* Menus */}
        <div className="mt-7 space-y-6">
          {sections.map((section) => (
            <MenuSection key={section.title} title={section.title} items={section.items} />
          ))}
        </div>
      </div>
    </div>
  );
}

function MenuSection({ title, items }: { title: string; items: MenuItem[] }) {
  return (
    <section>
      <p className="mb-2 text-[12px] font-semibold text-neutral-400">{title}</p>

      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
        {items.map((item, idx) => (
          <React.Fragment key={item.key}>
            <button
              type="button"
              onClick={item.onClick}
              className="flex w-full items-center gap-3 px-4 py-4 text-left hover:bg-neutral-50 active:bg-neutral-100"
            >
              <span className="text-neutral-700">{item.icon}</span>
              <span className="flex-1 text-[14px] font-medium text-neutral-900">{item.label}</span>
              <ChevronRightIcon />
            </button>

            {idx !== items.length - 1 && <div className="h-px bg-neutral-200" />}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}

/* ---------- Icons (no external deps) ---------- */
function IconBase({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("h-5 w-5", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function DocIcon() {
  return (
    <IconBase>
      <path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h8" />
      <path d="M8 17h6" />
    </IconBase>
  );
}

function CardIcon() {
  return (
    <IconBase>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M3 10h18" />
      <path d="M7 15h4" />
    </IconBase>
  );
}

function StarIcon() {
  return (
    <IconBase>
      <path d="M12 17.3l-5.2 3 1.4-5.9-4.6-4 6.1-.5L12 4.3l2.3 5.6 6.1.5-4.6 4 1.4 5.9z" />
    </IconBase>
  );
}

function BellIcon() {
  return (
    <IconBase>
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 7 3 7H3s3 0 3-7" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </IconBase>
  );
}

function HeadsetIcon() {
  return (
    <IconBase>
      <path d="M4 12a8 8 0 0 1 16 0" />
      <path d="M4 12v4a2 2 0 0 0 2 2h2v-6H6a2 2 0 0 0-2 2z" />
      <path d="M20 12v4a2 2 0 0 1-2 2h-2v-6h2a2 2 0 0 1 2 2z" />
    </IconBase>
  );
}

function HelpIcon() {
  return (
    <IconBase>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.5a2.5 2.5 0 0 1 5 0c0 2-2.5 2-2.5 4" />
      <path d="M12 17h.01" />
    </IconBase>
  );
}

function ChevronRightIcon() {
  return (
    <IconBase className="text-neutral-300">
      <path d="M10 6l6 6-6 6" />
    </IconBase>
  );
}
