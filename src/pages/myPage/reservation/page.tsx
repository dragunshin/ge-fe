// import React, { useEffect, useMemo, useState } from "react";
// import Back from "@/images/login/back.svg?react";
// import Payment from "@/images/mypage/payment.svg?react";
// import Write from "@/images/mypage/wirte.svg?react";
// import RedHeart from "@/images/mypage/redheart.svg?react";
// import Message from "@/images/mypage/message.svg?react";
// import SandClock from "@/images/mypage/sandClock.svg?react";
// import { useNavigate } from "react-router-dom";
// import BottomNav from "@/components/navigation/bottom-nav";
// import { getReservationsHistory, type ReservationHistoryItem } from "@/api/mypage";
// import { getConsultationsHistory, type ConsultationHistoryItem } from "@/api/mypage";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// /** utils */
// function cn(...classes: Array<string | false | null | undefined>) {
//   return classes.filter(Boolean).join(" ");
// }

// /** types */
// type ConsultKind = "MESSAGE" | "TIME_LIMITED";
// type Category = "전체" | "헤어" | "스킨케어" | "패션" | "메이크업";

// type Reservation = {
//   id: string;
//   reservationId: number;
//   dateLabel: string; // "10.18"
//   dayLabel: string; // "일요일"
//   kind: ConsultKind;
//   expertName: string;
//   tag: Exclude<Category, "전체">;
//   desc: string;
//   canChange?: boolean;
//   canCancel?: boolean;
//   expertProfileImageUrl?: string | null;
// };

// type PastConsultation = {
//   id: string;
//   dateLabel: string;
//   dayLabel: string;
//   kind: ConsultKind;
//   expertName: string;
//   tag: Exclude<Category, "전체">;
//   likeCount: number;
//   priceWon: number;
//   reviewPriceWon: number;
//   consultationId: string | number;
//   expertUserId: string;
// };

// const DESC_FALLBACK = "전문가가 작성한 자신의 강점 한줄 쓱싹문구가 작성한 자신의 강점 한줄 쓱싹";

// function toConsultKind(v: string): ConsultKind {
//   return v === "MESSAGE" ? "MESSAGE" : "TIME_LIMITED";
// }

// function toKoCategory(v: string): Exclude<Category, "전체"> {
//   switch (v) {
//     case "HAIR":
//       return "헤어";
//     case "SKINCARE":
//       return "스킨케어";
//     case "FASHION":
//       return "패션";
//     case "MAKEUP":
//       return "메이크업";
//     default:
//       return "헤어";
//   }
// }

// function formatMMDD(iso: string) {
//   const d = new Date(iso);
//   const mm = String(d.getMonth() + 1).padStart(2, "0");
//   const dd = String(d.getDate()).padStart(2, "0");
//   return `${mm}.${dd}`;
// }

// function formatKoDay(iso: string) {
//   const d = new Date(iso);
//   const days = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"] as const;
//   return days[d.getDay()];
// }

// function mapWaiting(r: ReservationHistoryItem): Reservation {
//   return {
//     id: `w-${r.reservationId}`,
//     reservationId: r.reservationId,
//     dateLabel: formatMMDD(r.scheduledDateTime),
//     dayLabel: formatKoDay(r.scheduledDateTime),
//     kind: toConsultKind(r.consultationType),
//     expertName: r.expertName,
//     tag: toKoCategory(r.category),
//     desc: DESC_FALLBACK,
//     canChange: true, // "확정 대기" 섹션에서만 버튼 노출용 (UI 그대로)
//     canCancel: r.canCancel,
//     expertProfileImageUrl: r.expertProfileImage || null,
//   };
// }

// function mapUpcoming(r: ReservationHistoryItem): Reservation {
//   return {
//     id: `u-${r.reservationId}`,
//     reservationId: r.reservationId,
//     dateLabel: formatMMDD(r.scheduledDateTime),
//     dayLabel: formatKoDay(r.scheduledDateTime),
//     kind: toConsultKind(r.consultationType),
//     expertName: r.expertName,
//     tag: toKoCategory(r.category),
//     desc: DESC_FALLBACK,
//     canCancel: r.canCancel,
//     expertProfileImageUrl: r.expertProfileImage || null,
//   };
// }

// function mapPast(c: ConsultationHistoryItem): PastConsultation {
//   // API에 “후기 작성 시 얼마 적립” 필드가 없어서 UI 유지용으로 고정값(1000원) 사용
//   const reward = 1000;

//   return {
//     id: `p-${c.consultationId}`,
//     dateLabel: formatMMDD(c.consultationDate),
//     dayLabel: formatKoDay(c.consultationDate),
//     kind: toConsultKind(c.consultationType),
//     expertName: c.expertNickname,
//     tag: toKoCategory(c.category),
//     likeCount: c.expertLikeCount,
//     priceWon: c.price,
//     reviewPriceWon: reward,
//     consultationId: c.consultationId,
//     expertUserId: c.expertUserId,
//   };
// }

// /** ui */
// function Badge({ kind }: { kind: ConsultKind }) {
//   const isMessage = kind === "MESSAGE";
//   return (
//     <span className="inline-flex items-center gap-1 ml-2 rounded-[100px] bg-[#EAF3FF] px-3 py-1 pre_cap_reg_13 text-[#333438] translate-y-0.5">
//       {isMessage ? (
//         <Message className="h-[14px] w-[14px] mr-1" />
//       ) : (
//         <SandClock className="h-[20px] w-[20px]" />
//       )}
//       {isMessage ? "메시지 상담" : "화상 상담"}
//     </span>
//   );
// }

// function TagChip({ children }: { children: React.ReactNode }) {
//   return (
//     <span className="inline-flex items-center bg-[#EAF3FF] px-2 py-[4px] pre_cap_reg_12 text-[#008bff]">
//       {children}
//     </span>
//   );
// }

// function ReservationCard({
//   item,
//   // variant,
//   onCancel,
//  // canceling,
// }: {
//   item: Reservation;
//   variant: "waiting" | "upcoming";
//   onCancel: (reservationId: number) => void;
//   canceling: boolean;
// }) {
//   return (
//     <div className="bg-white mb-6">
//       <div className="flex items-center justify-between py-2">
//         <div className="flex items-baseline gap-2">
//           <span className="pre_subtitle_semi_16 text-black">{item.dateLabel}</span>
//           <span className="pre_cap_reg_14 text-[#70737C] -translate-y-0.2">{item.dayLabel}</span>
//           <Badge kind={item.kind} />
//         </div>
//       </div>
//       {/* <div className="mt-6 divide-y divide-[#e1e2e4]" /> */}
//       <hr className="mt-[4px] mb-4 border-[#e1e2e4]" />
//       <div className="mt-2 flex gap-3">
//         {/* <div className="h-[60px] w-[60px] shrink-0 rounded-full bg-[#Dbdcdf]" /> */}
//         <Avatar className="h-[60px] w-[60px] shrink-0 rounded-full mr-1">
//           {item.expertProfileImageUrl ? (
//             <AvatarImage
//               src={item.expertProfileImageUrl}
//               alt={item.expertName}
//               className="h-full w-full object-cover"
//             />
//           ) : null}
//           <AvatarFallback className="bg-gray-200 text-slate-600" />
//         </Avatar>
//         <div className="min-w-0 flex-1">
//           <div className="flex items-center gap-2">
//             <p className="pre_subtitle_semi_16 text-[#292a2d]">{item.expertName}</p>
//             <TagChip>{item.tag}</TagChip>
//           </div>
//           <p className="mt-1 line-clamp-2 pre_cap_reg_13 text-[#878a93]">{item.desc}</p>

//           <div className="mt-3 flex gap-2">
//             <button
//               type="button"
//               onClick={() => {
//                 alert("개발 중인 기능입니다. 삭제 후에 다시 만들어주세요.");
//               }}
//               className="h-9 w-[81px] rounded-[4px] border border-[#Dbdcdf] bg-white pre_body_med_14 text-black active:scale-[0.99]"
//             >
//               예약변경
//             </button>
//             <button
//               type="button"
//               className={cn(
//                 "h-9 w-[81px] rounded-[4px] border border-[#D1D1D6] bg-white pre_body_med_14 text-black active:scale-[0.99]",
//                 // variant === "upcoming" ? "flex-1" : "flex-1",
//                 //variant === "upcoming" ? "w-[120px]" : "w-[81px]",
//               )}
//               onClick={() => onCancel(item.reservationId)}
//             >
//               예약취소
//             </button>
//             {/* {variant === "waiting" && item.canChange && (
//               <button
//                 type="button"
//                 className="h-9 w-[81px] border border-[#Dbdcdf] bg-white pre_body_med_14 text-black active:scale-[0.99]"
//               >
//                 예약변경
//               </button>
//             )}
//             {item.canCancel && (
//               <button
//                 type="button"
//                 className={cn(
//                   "h-9 w-[81px] border border-[#D1D1D6] bg-white pre_body_med_14 text-black active:scale-[0.99]",
//                   // variant === "upcoming" ? "flex-1" : "flex-1",
//                   //variant === "upcoming" ? "w-[120px]" : "w-[81px]",
//                 )}
//               >
//                 예약취소
//               </button>
//             )} */}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// function FilterChip({
//   active,
//   children,
//   onClick,
// }: {
//   active?: boolean;
//   children: React.ReactNode;
//   onClick: () => void;
// }) {
//   return (
//     <button
//       type="button"
//       onClick={onClick}
//       className={cn(
//         "whitespace-nowrap rounded-[4px] border px-4 py-[6px] pre_cap_reg_13",
//         active
//           ? "pre_cap_semi_13 bg-[#46474c] text-white"
//           : "border-[#Dbdcdf] bg-white text-[#46474c]",
//       )}
//     >
//       {children}
//     </button>
//   );
// }

// function PastItem({ item }: { item: PastConsultation }) {
//   const navigate = useNavigate();
//   return (
//     <div className="bg-white pb-4 mb-7">
//       <div className="flex items-center justify-between py-2">
//         <div className="flex items-baseline gap-2">
//           <span className="pre_subtitle_semi_16 text-black">{item.dateLabel}</span>
//           <span className="pre_cap_reg_14 text-[#70737C] -translate-y-0.2">{item.dayLabel}</span>
//           <Badge kind={item.kind} />
//         </div>
//       </div>
//       <hr className="flex-1 mt-[4px] mb-4 border-[#e1e2e4]" />

//       <div className="mt-2 flex items-center justify-between">
//         <div className="flex items-center gap-2">
//           <p className="pre_subtitle_semi_16 text-[#292a2d]">{item.expertName}</p>
//           <TagChip>{item.tag}</TagChip>
//         </div>

//         <div className="flex flex-col items-center gap-0.2">
//           <RedHeart className="h-6 w-6" />
//           <span className="pre_cap_reg_13 text-[#878a93]">{item.likeCount}</span>
//         </div>
//       </div>

//       <div className="mt-2 flex items-center gap-2 text-[#3A3A3C]">
//         <Payment className="h-[18px] w-[18px]" />
//         <span className="pre_body_med_14">{item.priceWon.toLocaleString("ko-KR")}원</span>
//       </div>

//       <div className="mt-2 flex items-center gap-2">
//         <Write className="h-[18px] w-[18px]" />
//         <span className="pre_body_med_14 text-[#3A3A3C]">
//           후기 작성 시
//           <span className="pre_body_med_14 text-[#008bff] ml-1">
//             {item.reviewPriceWon.toLocaleString("ko-KR")}원
//           </span>
//         </span>
//       </div>

//       <div className="mt-4 rounded-[8px] bg-[#e5f4ff] px-4 py-3 pre_body_semi_14 text-[#292a2d]">
//         후기를 남겨주시면 1000P를 드려요.
//       </div>

//       <div className="mt-4 flex justify-end gap-2 ">
//         <button
//           type="button"
//           onClick={() => navigate(`/experts/${item.expertUserId}`)}
//           className="rounded-[4px] px-4 py-2 bg-[#181818] pre_subtitle_med_14 text-white active:scale-[0.99]"
//         >
//           다시 상담받기
//         </button>
//         <button
//           type="button"
//           onClick={() => navigate(`/reviewWrite/${item.consultationId}`)}
//           className="rounded-[4px] px-4 py-2 border border-[#Dbdcdf] bg-white pre_subtitle_med_14 text-[#171719] active:scale-[0.99]"
//         >
//           후기 쓰기
//         </button>
//       </div>
//     </div>
//   );
// }

// /** page */
// export default function ReservationHistoryView() {
//   const [waiting, setWaiting] = useState<Reservation[]>([]);
//   const [upcoming, setUpcoming] = useState<Reservation[]>([]);
//   const [past, setPast] = useState<PastConsultation[]>([]);

//   const filters: Category[] = ["전체", "헤어", "스킨케어", "패션", "메이크업"];
//   const [selected, setSelected] = useState<Category>("전체");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const ac = new AbortController();

//     (async () => {
//       try {
//         const [r, c] = await Promise.all([
//           getReservationsHistory({ signal: ac.signal }),
//           getConsultationsHistory({ signal: ac.signal }),
//         ]);

//         setWaiting((r.unpaidReservations ?? []).map(mapWaiting));
//         setUpcoming((r.upcomingReservations ?? []).map(mapUpcoming));
//         setPast((c ?? []).map(mapPast));
//       } catch (e) {
//         if (e instanceof DOMException && e.name === "AbortError") return;
//         console.error(e);
//       }
//     })();

//     return () => ac.abort();
//   }, []);

//   const filteredPast = useMemo(() => {
//     if (selected === "전체") return past;
//     return past.filter((p) => p.tag === selected);
//   }, [past, selected]);

//   return (
//     <div className="flex h-full flex-col bg-white">
//       <main className="flex-1 overflow-y-auto scrollbar-hide overscroll-none">
//         {/* header */}
//         {/* <header className="app-header flex items-center px-4 py-4 bg-white">
//           <button onClick={() => navigate(-1)} className="mr-3">
//             <Back className="w-[18px] h-[18px]" />
//           </button>
//           <h1 className="pre_title_semi_20">예약 내역</h1>
//         </header> */}

//         {/* header */}
//         <header className=" mt-3 flex items-center px-1 py-2 ml-4 bg-white">
//           <button onClick={() => navigate(-1)} className="mr-[8px]">
//             <Back className="w-[18px] h-[18px]" />
//           </button>
//           <p className="pre_title_semi_20">예약내역</p>
//         </header>

//         {/* content */}
//         <div className="px-5 pb-10 pt-4">
//           {/* waiting */}
//           <span className="pre_body_med_14 text-[#878a93]">확정 대기 중인 예약 일정이에요</span>
//           <div className="mt-2">
//             {waiting.map((it) => (
//               <ReservationCard key={it.id} item={it} variant="waiting" />
//             ))}
//           </div>

//           <div className={`h-2 bg-[#f1f1f6] mt-[24px] mb-[30px] -mx-5`} />

//           {/* upcoming */}
//           <span className="pre_body_med_14 text-[#878a93]">곧 다가오는 예약 일정이에요</span>
//           <div className="mt-2">
//             {upcoming.map((it) => (
//               <ReservationCard key={it.id} item={it} variant="upcoming" />
//             ))}
//           </div>

//           <div className={`h-2 bg-[#f1f1f6] mt-[24px] mb-[30px] -mx-5`} />

//           {/* past */}
//           <h2 className="pre_subtitle_semi_16 text-black mb-5">지난 상담 내역</h2>

//           <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
//             {filters.map((f) => (
//               <FilterChip key={f} active={selected === f} onClick={() => setSelected(f)}>
//                 {f}
//               </FilterChip>
//             ))}
//           </div>

//           <div className="mt-2">
//             {filteredPast.length === 0 ? (
//               <div className="py-10 text-center text-[13px] text-[#8E8E93]">
//                 해당 카테고리의 지난 상담 내역이 없어요.
//               </div>
//             ) : (
//               filteredPast.map((it) => <PastItem key={it.id} item={it} />)
//             )}
//           </div>
//         </div>
//       </main>
//       <BottomNav />
//     </div>
//   );
// }

import React, { useEffect, useMemo, useState } from "react";
import Back from "@/images/login/back.svg?react";
import Payment from "@/images/mypage/payment.svg?react";
import Write from "@/images/mypage/wirte.svg?react";
import RedHeart from "@/images/mypage/redheart.svg?react";
import Message from "@/images/mypage/message.svg?react";
import SandClock from "@/images/mypage/sandClock.svg?react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/navigation/bottom-nav";
import {
  getReservationsHistory,
  type ReservationHistoryItem,
  getConsultationsHistory,
  type ConsultationHistoryItem,
  cancelReservation, // ✅ C 반영: 취소 API
} from "@/api/mypage";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

/** utils */
function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/** types */
type ConsultKind = "MESSAGE" | "TIME_LIMITED";
type Category = "전체" | "헤어" | "패션" | "메이크업" | "스킨";

type Reservation = {
  id: string;
  reservationId: number;
  dateLabel: string; // "10.18"
  dayLabel: string; // "일요일"
  kind: ConsultKind;
  expertName: string;
  tag: Exclude<Category, "전체">;
  desc: string;
  canChange?: boolean;
  canCancel?: boolean;
  expertProfileImageUrl?: string | null;
};

type PastConsultation = {
  id: string;
  dateLabel: string;
  dayLabel: string;
  kind: ConsultKind;
  expertName: string;
  tag: Exclude<Category, "전체">;
  likeCount: number;
  priceWon: number;
  reviewPriceWon: number;
  consultationId: string | number;
  expertUserId: string;
};

const DESC_FALLBACK = "전문가가 작성한 자신의 강점 한줄 쓱싹문구가 작성한 자신의 강점 한줄 쓱싹";

function toConsultKind(v: string): ConsultKind {
  return v === "MESSAGE" ? "MESSAGE" : "TIME_LIMITED";
}

function toKoCategory(v: string): Exclude<Category, "전체"> {
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

function formatKoDay(iso: string) {
  const d = new Date(iso);
  const days = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"] as const;
  return days[d.getDay()];
}

function mapWaiting(r: ReservationHistoryItem): Reservation {
  return {
    id: `w-${r.reservationId}`,
    reservationId: r.reservationId,
    dateLabel: formatMMDD(r.scheduledDateTime),
    dayLabel: formatKoDay(r.scheduledDateTime),
    kind: toConsultKind(r.consultationType),
    expertName: r.expertName,
    tag: toKoCategory(r.category),
    desc: DESC_FALLBACK,
    canChange: true, // "확정 대기" 섹션에서만 버튼 노출용 (UI 그대로)
    canCancel: r.canCancel,
    expertProfileImageUrl: r.expertProfileImage || null,
  };
}

function mapUpcoming(r: ReservationHistoryItem): Reservation {
  return {
    id: `u-${r.reservationId}`,
    reservationId: r.reservationId,
    dateLabel: formatMMDD(r.scheduledDateTime),
    dayLabel: formatKoDay(r.scheduledDateTime),
    kind: toConsultKind(r.consultationType),
    expertName: r.expertName,
    tag: toKoCategory(r.category),
    desc: DESC_FALLBACK,
    canCancel: r.canCancel,
    expertProfileImageUrl: r.expertProfileImage || null,
  };
}

function mapPast(c: ConsultationHistoryItem): PastConsultation {
  // API에 “후기 작성 시 얼마 적립” 필드가 없어서 UI 유지용으로 고정값(1000원) 사용
  const reward = 1000;

  return {
    id: `p-${c.consultationId}`,
    dateLabel: formatMMDD(c.consultationDate),
    dayLabel: formatKoDay(c.consultationDate),
    kind: toConsultKind(c.consultationType),
    expertName: c.expertNickname,
    tag: toKoCategory(c.category),
    likeCount: c.expertLikeCount,
    priceWon: c.price,
    reviewPriceWon: reward,
    consultationId: c.consultationId,
    expertUserId: c.expertUserId,
  };
}

/** ui */
function Badge({ kind }: { kind: ConsultKind }) {
  const isMessage = kind === "MESSAGE";
  return (
    <span className="inline-flex items-center gap-1 ml-2 rounded-[100px] bg-[#EAF3FF] px-3 py-1 pre_cap_reg_13 text-[#333438] translate-y-0.5">
      {isMessage ? (
        <Message className="h-[14px] w-[14px] mr-1" />
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

function ReservationCard({
  item,
  // variant,
  onCancel,
  canceling,
}: {
  item: Reservation;
  variant: "waiting" | "upcoming";
  onCancel: (reservationId: number) => void;
  canceling: boolean;
}) {
  // ✅ B 반영: canCancel/취소중 상태에 따라 비활성화
  const cancelDisabled = !item.canCancel || canceling;

  return (
    <div className="bg-white mb-6">
      <div className="flex items-center justify-between py-2">
        <div className="flex items-baseline gap-2">
          <span className="pre_subtitle_semi_16 text-black">{item.dateLabel}</span>
          <span className="pre_cap_reg_14 text-[#70737C] -translate-y-0.2">{item.dayLabel}</span>
          <Badge kind={item.kind} />
        </div>
      </div>

      <hr className="mt-[4px] mb-4 border-[#e1e2e4]" />

      <div className="mt-2 flex gap-3">
        <Avatar className="h-[60px] w-[60px] shrink-0 rounded-full mr-1">
          {item.expertProfileImageUrl ? (
            <AvatarImage
              src={item.expertProfileImageUrl}
              alt={item.expertName}
              className="h-full w-full object-cover"
            />
          ) : null}
          <AvatarFallback className="bg-gray-200 text-slate-600" />
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="pre_subtitle_semi_16 text-[#292a2d]">{item.expertName}</p>
            <TagChip>{item.tag}</TagChip>
          </div>
          <p className="mt-1 line-clamp-2 pre_cap_reg_13 text-[#878a93]">{item.desc}</p>

          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => {
                alert("개발 중인 기능입니다. 삭제 후에 다시 만들어주세요.");
              }}
              className="h-9 w-[81px] rounded-[4px] border border-[#Dbdcdf] bg-white pre_body_med_14 text-black active:scale-[0.99]"
            >
              예약변경
            </button>

            <button
              type="button"
              className={cn(
                "h-9 w-[81px] rounded-[4px] border border-[#D1D1D6] bg-white pre_body_med_14 text-black active:scale-[0.99]",
                cancelDisabled && "opacity-40 pointer-events-none",
              )}
              onClick={() => onCancel(item.reservationId)}
            >
              {canceling ? "취소중..." : "예약취소"}
            </button>
          </div>
        </div>
      </div>
    </div>
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
        "whitespace-nowrap rounded-[4px] border px-4 py-[6px] pre_cap_reg_13",
        active
          ? "pre_cap_semi_13 bg-[#46474c] text-white"
          : "border-[#Dbdcdf] bg-white text-[#46474c]",
      )}
    >
      {children}
    </button>
  );
}

function PastItem({ item }: { item: PastConsultation }) {
  const navigate = useNavigate();
  return (
    <div className="bg-white pb-4 mb-7">
      <div className="flex items-center justify-between py-2">
        <div className="flex items-baseline gap-2">
          <span className="pre_subtitle_semi_16 text-black">{item.dateLabel}</span>
          <span className="pre_cap_reg_14 text-[#70737C] -translate-y-0.2">{item.dayLabel}</span>
          <Badge kind={item.kind} />
        </div>
      </div>
      <hr className="flex-1 mt-[4px] mb-4 border-[#e1e2e4]" />

      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="pre_subtitle_semi_16 text-[#292a2d]">{item.expertName}</p>
          <TagChip>{item.tag}</TagChip>
        </div>

        <div className="flex flex-col items-center gap-0.2">
          <RedHeart className="h-6 w-6" />
          <span className="pre_cap_reg_13 text-[#878a93]">{item.likeCount}</span>
        </div>
      </div>

      <div className="mt-2 flex items-center gap-2 text-[#3A3A3C]">
        <Payment className="h-[18px] w-[18px]" />
        <span className="pre_body_med_14">{item.priceWon.toLocaleString("ko-KR")}원</span>
      </div>

      <div className="mt-2 flex items-center gap-2">
        <Write className="h-[18px] w-[18px]" />
        <span className="pre_body_med_14 text-[#3A3A3C]">
          후기 작성 시
          <span className="pre_body_med_14 text-[#008bff] ml-1">
            {item.reviewPriceWon.toLocaleString("ko-KR")}원
          </span>
        </span>
      </div>

      <div className="mt-4 rounded-[8px] bg-[#e5f4ff] px-4 py-3 pre_body_semi_14 text-[#292a2d]">
        후기를 남겨주시면 1000P를 드려요.
      </div>

      <div className="mt-4 flex justify-end gap-2 ">
        <button
          type="button"
          onClick={() => navigate(`/experts/${item.expertUserId}`)}
          className="rounded-[4px] px-4 py-2 bg-[#181818] pre_subtitle_med_14 text-white active:scale-[0.99]"
        >
          다시 상담받기
        </button>
        <button
          type="button"
          onClick={() => navigate(`/reviewWrite/${item.consultationId}`)}
          className="rounded-[4px] px-4 py-2 border border-[#Dbdcdf] bg-white pre_subtitle_med_14 text-[#171719] active:scale-[0.99]"
        >
          후기 쓰기
        </button>
      </div>
    </div>
  );
}

/** page */
export default function ReservationHistoryView() {
  const [waiting, setWaiting] = useState<Reservation[]>([]);
  const [upcoming, setUpcoming] = useState<Reservation[]>([]);
  const [past, setPast] = useState<PastConsultation[]>([]);

  const filters: Category[] = ["전체", "헤어", "패션", "메이크업", "스킨"];
  const [selected, setSelected] = useState<Category>("전체");
  const navigate = useNavigate();

  // ✅ C 반영: 취소 중인 예약 id
  const [cancelingId, setCancelingId] = useState<number | null>(null);

  // ✅ C 반영: 예약 목록만 재조회(나머지 로직은 그대로)
  const refetchReservations = async (signal?: AbortSignal) => {
    const r = await getReservationsHistory({ signal });
    setWaiting((r.unpaidReservations ?? []).map(mapWaiting));
    setUpcoming((r.upcomingReservations ?? []).map(mapUpcoming));
  };

  // ✅ C 반영: 예약 취소 핸들러
  const handleCancel = async (reservationId: number) => {
    if (cancelingId !== null) return;

    const ok = window.confirm("예약을 취소할까요?\n취소 후에는 되돌릴 수 없어요.");
    if (!ok) return;

    // 낙관적 업데이트(즉시 UI 반영)
    setWaiting((prev) => prev.filter((x) => x.reservationId !== reservationId));
    setUpcoming((prev) => prev.filter((x) => x.reservationId !== reservationId));

    setCancelingId(reservationId);
    const ac = new AbortController();

    try {
      await cancelReservation(reservationId, { signal: ac.signal });
      await refetchReservations(ac.signal); // 서버 기준으로 동기화
      alert("예약이 취소되었어요.");
    } catch (e) {
      console.error(e);
      // 실패 시 재동기화(롤백)
      try {
        await refetchReservations(ac.signal);
      } catch {}
      alert("예약 취소에 실패했어요. 잠시 후 다시 시도해 주세요.");
    } finally {
      setCancelingId(null);
    }
  };

  useEffect(() => {
    const ac = new AbortController();

    (async () => {
      try {
        const [r, c] = await Promise.all([
          getReservationsHistory({ signal: ac.signal }),
          getConsultationsHistory({ signal: ac.signal }),
        ]);

        setWaiting((r.unpaidReservations ?? []).map(mapWaiting));
        setUpcoming((r.upcomingReservations ?? []).map(mapUpcoming));
        setPast((c ?? []).map(mapPast));
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") return;
        console.error(e);
      }
    })();

    return () => ac.abort();
  }, []);

  const filteredPast = useMemo(() => {
    if (selected === "전체") return past;
    return past.filter((p) => p.tag === selected);
  }, [past, selected]);

  return (
    <div className="flex h-full flex-col bg-white">
      <main className="flex-1 overflow-y-auto scrollbar-hide overscroll-none">
        <header className="sticky top-0 z-50 mt-3 flex items-center px-1 py-2 ml-4 bg-white">
          <button onClick={() => navigate(-1)} className="mr-[8px]">
            <Back className="w-[18px] h-[18px]" />
          </button>
          <p className="pre_title_semi_20">예약내역</p>
        </header>

        <div className="px-5 pb-10 pt-4">
          {/* waiting */}
          <span className="pre_body_med_14 text-[#878a93]">확정 대기 중인 예약 일정이에요</span>
          <div className="mt-2">
            {waiting.map((it) => (
              <ReservationCard
                key={it.id}
                item={it}
                variant="waiting"
                onCancel={handleCancel}
                canceling={cancelingId === it.reservationId}
              />
            ))}
          </div>

          <div className={`h-2 bg-[#f1f1f6] mt-[24px] mb-[30px] -mx-5`} />

          {/* upcoming */}
          <span className="pre_body_med_14 text-[#878a93]">곧 다가오는 예약 일정이에요</span>
          <div className="mt-2">
            {upcoming.map((it) => (
              <ReservationCard
                key={it.id}
                item={it}
                variant="upcoming"
                onCancel={handleCancel}
                canceling={cancelingId === it.reservationId}
              />
            ))}
          </div>

          <div className={`h-2 bg-[#f1f1f6] mt-[24px] mb-[30px] -mx-5`} />

          {/* past */}
          <h2 className="pre_subtitle_semi_16 text-black mb-5">지난 상담 내역</h2>

          <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {filters.map((f) => (
              <FilterChip key={f} active={selected === f} onClick={() => setSelected(f)}>
                {f}
              </FilterChip>
            ))}
          </div>

          <div className="mt-2">
            {filteredPast.length === 0 ? (
              <div className="py-10 text-center text-[13px] text-[#8E8E93]">
                해당 카테고리의 지난 상담 내역이 없어요.
              </div>
            ) : (
              filteredPast.map((it) => <PastItem key={it.id} item={it} />)
            )}
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
