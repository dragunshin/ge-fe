import { useNavigate } from "react-router-dom";
import BackIcon from "@/images/login/back.svg?react";
import More from "@/images/chat/more.svg?react";
import { ChatExpertHeader } from "./ChatExpertHeader";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useMemo } from "react";
//import Minho from "@/images/chat/minho2.png";
import Default from "@/images/chat/default.svg?url";

export type ChatHeaderProps = {
  meta: ChatHeaderData;
};

export type ChatHeaderData = {
  nickname: string;
  category: string;
  profileImageUrl: string | null;
};

export default function ChatHeader({ meta }: ChatHeaderProps) {
  const navigate = useNavigate();

  const title = useMemo(() => meta?.nickname ?? "", [meta?.nickname]);
  const category = useMemo(() => meta?.category ?? "", [meta?.category]);
  const profile = useMemo(() => meta?.profileImageUrl ?? null, [meta?.profileImageUrl]);

  return (
    <div className="bg-white mt-2">
      <header className="app-header px-4 pt-3 pb-3 mb-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button
              onClick={() => navigate(-1)}
              className="-ml-2 grid h-9 w-9 place-items-center rounded-full active:bg-black/5"
              aria-label="뒤로가기"
              type="button"
            >
              <BackIcon className="h-4 w-4 text-black" />
            </button>

            <Avatar className="h-9 w-9 mr-1">
              {profile ? (
                <AvatarImage src={profile} alt={title} className="h-full w-full object-cover" />
              ) : null}
              <AvatarImage src={Default} alt="profile" className="h-full w-full object-cover" />
            </Avatar>

            <div className="flex flex-col leading-tight">
              <span className="pre_subtitle_semi_16 text-black">{title}</span>
              <span className="mt-[2px] pre_body_med_12 text-[#878a93]">{category}</span>
            </div>
          </div>

          <button
            type="button"
            className="-mr-2 grid color-[#292a2d] place-items-center rounded-full active:bg-black/5"
            aria-label="더보기"
          >
            <More className="h-6 w-6 text-[#292a2d]" />
          </button>
        </div>
      </header>

      {/* 날짜 구분선*/}
      <ChatExpertHeader />
    </div>
  );
}

// "use client";

// import { useMemo } from "react";
// import { useNavigate } from "react-router-dom";
// import { ChevronLeft, MoreVertical } from "lucide-react";

// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// export type ChatHeaderMeta = {
//   nickname: string;
//   category?: string | null;
//   profileImageUrl?: string | null;
// };

// type ChatHeaderProps = {
//   meta?: ChatHeaderMeta | null;
// };

// export default function ChatHeader({ meta }: ChatHeaderProps) {
//   const nav = useNavigate();

//   const title = useMemo(() => meta?.nickname ?? "", [meta?.nickname]);
//   const category = useMemo(() => meta?.category ?? "", [meta?.category]);
//   const profile = useMemo(() => meta?.profileImageUrl ?? null, [meta?.profileImageUrl]);

//   return (
//     <header className="shrink-0 bg-white">
//       <div className="flex items-center gap-3 px-4 py-3">
//         {/* Back */}
//         <button
//           type="button"
//           onClick={() => nav(-1)}
//           className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-slate-50 active:bg-slate-100"
//           aria-label="뒤로가기"
//         >
//           <ChevronLeft className="h-6 w-6 text-[#111111]" />
//         </button>

//         {/* Avatar */}
//         <Avatar className="h-10 w-10 shrink-0">
//           {profile ? <AvatarImage src={profile} alt={title} /> : null}
//           <AvatarFallback className="bg-gray-200 text-slate-600" />
//         </Avatar>

//         {/* Name / Category */}
//         <div className="min-w-0 flex-1">
//           <div className="truncate text-[17px] font-semibold text-[#111111]">{title}</div>
//           <div className="truncate text-[13px] text-[#8E8E93]">{category}</div>
//         </div>

//         {/* Menu */}
//         <button
//           type="button"
//           className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-slate-50 active:bg-slate-100"
//           aria-label="메뉴"
//           onClick={() => {
//             // TODO: 메뉴 액션
//           }}
//         >
//           <MoreVertical className="h-6 w-6 text-[#111111]" />
//         </button>
//       </div>

//       <div className="h-px bg-[#F2F2F7]" />
//     </header>
//   );
// }

// "use client";

// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { EllipsisVertical } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// import Left from "@/images/chevron_left.png";
// import Minho from "@/images/test/expert_minho.png";

// export type ChatHeaderMeta = {
//   nickname: string;
//   category?: string;
//   profileImageUrl?: string | null;
// };

// type ChatHeaderProps = {
//   meta?: ChatHeaderMeta | null;
// };

// export default function ChatHeader({ meta }: ChatHeaderProps) {
//   const nav = useNavigate();

//   // ✅ props가 없으면 기존 하드코딩(디자인/텍스트 유지)
//   const nickname = meta?.nickname ?? "옹민호 전문가";
//   const category = meta?.category ?? "헤어";

//   // ✅ 프로필 이미지 없으면 기존 이미지 사용 (디자인 유지 목적)
//   const profileSrc = meta?.profileImageUrl ? meta.profileImageUrl : Minho;

//   return (
//     <header className="sticky top-0 z-20 bg-white">
//       <div className="flex items-center justify-between px-4 py-3">
//         <div className="flex items-center gap-3">
//           <button type="button" aria-label="back" onClick={() => nav(-1)}>
//             <img src={Left} alt="" className="h-6 w-6" />
//           </button>

//           <Avatar className="h-10 w-10">
//             <AvatarImage src={profileSrc} alt={nickname} />
//             <AvatarFallback className="bg-slate-200 text-slate-600">
//               {nickname?.slice(0, 1) ?? "?"}
//             </AvatarFallback>
//           </Avatar>

//           <div className="flex flex-col">
//             <span className="text-[16px] font-semibold text-slate-900">{nickname}</span>
//             <span className="text-[13px] text-slate-500">{category}</span>
//           </div>
//         </div>

//         <Button type="button" variant="ghost" size="icon" className="h-9 w-9">
//           <EllipsisVertical className="h-5 w-5 text-slate-700" />
//         </Button>
//       </div>

//       <div className="h-[1px] w-full bg-slate-100" />
//     </header>
//   );
// }
