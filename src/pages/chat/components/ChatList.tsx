// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";

// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { ScrollArea } from "@/components/ui/scroll-area";

// import { fetchChatRooms } from "@/api/chat";
// import type { ChatRoomListItem, ChatroomType } from "@/types/chat";
// import type { LastMessageType } from "@/types/chat";

// import { format, formatDistanceToNowStrict, isToday, isYesterday } from "date-fns";
// import { ko } from "date-fns/locale";

// /** ----------------------------
//  *  Types / Mapper
//  *  ---------------------------- */

// export type ChatItem = {
//   id: string; // chatroomId string
//   chatroomId: number;
//   name: string; // opponentNickname
//   tag: string; // expertCategory
//   preview: string;
//   timeLabel: string;
//   unreadCount?: number;
//   chatroomType: ChatroomType;
//   profileImageUrl?: string | null;
//   sortKeyISO?: string; // ✅ 정렬용
// };

// export function mapChatRoomToItem(r: ChatRoomListItem): ChatItem {
//   const baseTime = r.lastMessageAt ?? r.createdAt;

//   function timeLabelFromISO(iso?: string | null) {
//     if (!iso) return "";
//     const d = new Date(iso);
//     if (Number.isNaN(d.getTime())) return "";

//     // 오늘이면 "방금/3분 전/2시간 전"
//     if (isToday(d)) {
//       const dist = formatDistanceToNowStrict(d, { locale: ko, addSuffix: true });
//       // 예: "1분 후" 같이 나오는 경우 방지(서버 시간이 미래면)
//       // dist가 "후"면 그냥 "방금"으로 처리
//       if (dist.includes("후")) return "방금";
//       return dist; // "3분 전", "2시간 전"
//     }

//     // 어제면 "어제"
//     if (isYesterday(d)) return "어제";

//     // 그 외는 "M/D" (원하면 "yyyy.MM.dd"로)
//     return format(d, "M/d", { locale: ko });
//   }

//   function buildPreview(params: {
//     lastMessageType?: LastMessageType;
//     lastMessage?: string | null;
//     opponentNickname: string;
//   }) {
//     const { lastMessageType, lastMessage, opponentNickname } = params;

//     switch (lastMessageType) {
//       case "IMAGE":
//         return "사진을 보냈습니다";
//       case "QUESTION":
//         return `${opponentNickname}님을 위한 고민지가 도착했어요.`;
//       case "SOLUTION":
//         return `${opponentNickname}님을 위한 솔루션지가 도착했어요.`;
//       case "TEXT":
//       case "MIXED":
//       case "SYSTEM":
//       default:
//         return lastMessage?.trim() ? lastMessage : "대화를 시작해보세요.";
//     }
//   }

//   return {
//     id: String(r.chatroomId),
//     chatroomId: r.chatroomId,
//     chatroomType: r.chatroomType,
//     name: r.opponentNickname,
//     tag: r.expertCategory ?? "",
//     preview: buildPreview({
//       lastMessageType: r.lastMessageType,
//       lastMessage: r.lastMessage,
//       opponentNickname: r.opponentNickname,
//     }),
//     timeLabel: timeLabelFromISO(baseTime),
//     unreadCount: r.unreadCount ?? 0,
//     profileImageUrl: r.opponentProfileImage ?? null,
//     sortKeyISO: baseTime ?? undefined,
//   };
// }

// /** ----------------------------
//  *  Filter
//  *  ---------------------------- */

// const FILTERS = ["전체", "메시지 상담", "화상 상담", "안 읽음"] as const;
// type Filter = (typeof FILTERS)[number];

// function matchesFilter(item: ChatItem, filter: Filter) {
//   if (filter === "전체") return true;
//   if (filter === "안 읽음") return (item.unreadCount ?? 0) > 0;
//   if (filter === "메시지 상담") return item.chatroomType === "MESSAGE";
//   if (filter === "화상 상담") return item.chatroomType === "VIDEO";
//   return true;
// }

// /** ----------------------------
//  *  Component
//  *  ---------------------------- */

// export function ChatList() {
//   const nav = useNavigate();

//   const [activeFilter, setActiveFilter] = useState<Filter>("전체");

//   const [raw, setRaw] = useState<ChatRoomListItem[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     let alive = true;

//     (async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         const data = await fetchChatRooms();
//         if (!alive) return;

//         setRaw(data);
//       } catch (e) {
//         console.error(e);
//         if (!alive) return;
//         setError(e instanceof Error ? e.message : "채팅 목록을 불러오지 못했습니다.");
//       } finally {
//         if (alive) setLoading(false);
//       }
//     })();

//     return () => {
//       alive = false;
//     };
//   }, []);

//   const items = useMemo(() => {
//     const mapped = raw.map(mapChatRoomToItem);

//     // 정렬: lastMessageAt(없으면 createdAt) 최신순
//     mapped.sort((a, b) => {
//       const ta = a.sortKeyISO ? new Date(a.sortKeyISO).getTime() : 0;
//       const tb = b.sortKeyISO ? new Date(b.sortKeyISO).getTime() : 0;
//       return tb - ta;
//     });

//     return mapped.filter((x) => matchesFilter(x, activeFilter));
//   }, [raw, activeFilter]);

//   return (
//     <div className="min-h-full w-full bg-[#ffffff]">
//       <div className="mx-auto flex h-full w-full max-w-[420px] flex-col bg-white">
//         {/* sticky header */}
//         <header className="sticky top-0 z-10 bg-white px-5 pt-6 pb-3">
//           <h1 className="pre_title_semi_20 text-[#000000]">채팅</h1>

//           {/* filter chips + overflow */}
//           <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
//             {FILTERS.map((filter) => {
//               const isActive = filter === activeFilter;
//               return (
//                 <button
//                   key={filter}
//                   type="button"
//                   className={[
//                     "h-8 shrink-0 rounded-[4px] px-3 text-[13px]",
//                     isActive
//                       ? "border-transparent bg-[#46474c] text-white pre_body_semi_13"
//                       : "border border-[#dbdcdf] bg-white text-slate-700 pre_body_reg_13",
//                   ].join(" ")}
//                   onClick={() => setActiveFilter(filter)}
//                 >
//                   {filter}
//                 </button>
//               );
//             })}
//           </div>
//         </header>

//         <ScrollArea className="flex-1">
//           {loading && (
//             <div className="px-5 py-10 text-center text-sm text-slate-400">불러오는 중...</div>
//           )}

//           {error && <div className="px-5 py-10 text-center text-sm text-red-500">{error}</div>}

//           {!loading && !error && (
//             <ul className="px-5 pb-6">
//               {items.map((chat) => (
//                 <li key={chat.id}>
//                   <button
//                     type="button"
//                     className={[
//                       "flex w-full items-center gap-3 rounded-2xl py-3 text-left",
//                       "hover:bg-slate-50 active:bg-slate-100",
//                     ].join(" ")}
//                     onClick={() => nav(`/chatList/${chat.chatroomId}`)}
//                     // onClick={() => nav(`/chat`)}
//                   >
//                     <Avatar className="h-[52px] w-[52px] shrink-0 mr-1">
//                       {chat.profileImageUrl ? (
//                         <AvatarImage src={chat.profileImageUrl} alt={chat.name} />
//                       ) : null}
//                       <AvatarFallback className="bg-gray-200 text-slate-600">
//                         {/* {chat.name?.slice(0, 1) ?? "?"} */}
//                       </AvatarFallback>
//                     </Avatar>

//                     {/* 가운데 영역: min-w-0 + truncate 필수 */}
//                     <div className="min-w-0 flex-1">
//                       <div className="flex items-center gap-2">
//                         <span className="truncate pre_subtitle_semi_14 text-[#292a2d]">
//                           {chat.name}
//                         </span>

//                         {!!chat.tag && (
//                           <span className="rounded-[2px] border-0 bg-[#e5f4ff] px-1.5 py-[2px] pre_body_reg_12 text-[#008bff]">
//                             {chat.tag}
//                           </span>
//                         )}
//                       </div>

//                       <p className="mt-1 line-clamp-2 text-[12px] leading-snug text-slate-500">
//                         {chat.preview}
//                       </p>
//                     </div>

//                     {/* 우측 영역 */}
//                     <div className="flex shrink-0 flex-col items-end justify-center gap-2 pl-2">
//                       <span className="pre_cap_med_12 text-[#989ba2]">{chat.timeLabel}</span>

//                       {(chat.unreadCount ?? 0) > 0 ? (
//                         <div className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#2F80FF] px-1">
//                           <span className="text-[11px] font-semibold text-white">
//                             {chat.unreadCount}
//                           </span>
//                         </div>
//                       ) : (
//                         // 배치 흔들림 방지용 자리
//                         <div className="h-5" />
//                       )}
//                     </div>
//                   </button>

//                   {/* divider: 아바타 오른쪽부터 */}
//                   <div className="ml-[56px] border-b border-slate-100" />
//                 </li>
//               ))}

//               {items.length === 0 && (
//                 <div className="py-16 text-center text-sm text-slate-400">
//                   표시할 채팅이 없습니다.
//                 </div>
//               )}
//             </ul>
//           )}
//         </ScrollArea>
//       </div>
//     </div>
//   );
// }
"use client";

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import Default from "@/images/chat/default.svg?url";

import { fetchChatRooms } from "@/api/chat";
import type { ChatRoomListItem, ChatroomType } from "@/types/chat";
import type { LastMessageType } from "@/types/chat";

import { format, formatDistanceToNowStrict, isToday, isYesterday } from "date-fns";
import { ko } from "date-fns/locale";
import type { ChatHeaderData } from "./ChatHeader";

/** ----------------------------
 *  Types / Mapper
 *  ---------------------------- */

export type ChatItem = {
  id: string; // chatroomId string
  chatroomId: number;
  name: string; // opponentNickname
  tag: string; // expertCategory
  preview: string;
  timeLabel: string;
  unreadCount?: number;
  chatroomType: ChatroomType;
  profileImageUrl?: string | null;
  sortKeyISO?: string; // ✅ 정렬용
};

export function mapChatRoomToItem(r: ChatRoomListItem): ChatItem {
  const baseTime = r.lastMessageAt ?? r.createdAt;

  function timeLabelFromISO(iso?: string | null) {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";

    if (isToday(d)) {
      const dist = formatDistanceToNowStrict(d, { locale: ko, addSuffix: true });
      if (dist.includes("후")) return "방금";
      return dist;
    }
    if (isYesterday(d)) return "어제";
    return format(d, "M/d", { locale: ko });
  }

  function buildPreview(params: {
    lastMessageType?: LastMessageType;
    lastMessage?: string | null;
    opponentNickname: string;
  }) {
    const { lastMessageType, lastMessage, opponentNickname } = params;

    switch (lastMessageType) {
      case "IMAGE":
        return "사진을 보냈습니다";
      case "QUESTION":
        return `${opponentNickname}님을 위한 고민지가 도착했어요.`;
      case "CONCERN":
        return `${opponentNickname}님을 위한 고민지가 도착했어요.`;
      case "SOLUTION":
        return `${opponentNickname}님을 위한 솔루션지가 도착했어요.`;
      case "TEXT":
      case "MIXED":
      case "SYSTEM":
      default:
        return lastMessage?.trim() ? lastMessage : "대화를 시작해보세요.";
    }
  }

  return {
    id: String(r.chatroomId),
    chatroomId: r.chatroomId,
    chatroomType: r.chatroomType,
    name: r.opponentNickname,
    tag: r.expertCategory ?? "",
    preview: buildPreview({
      lastMessageType: r.lastMessageType,
      lastMessage: r.lastMessage,
      opponentNickname: r.opponentNickname,
    }),
    timeLabel: timeLabelFromISO(baseTime),
    unreadCount: r.unreadCount ?? 0,
    profileImageUrl: r.opponentProfileImage ?? null,
    sortKeyISO: baseTime ?? undefined,
  };
}

/** ----------------------------
 *  Filter
 *  ---------------------------- */

const FILTERS = ["전체", "메시지 상담", "화상 상담", "안 읽음"] as const;
type Filter = (typeof FILTERS)[number];

function matchesFilter(item: ChatItem, filter: Filter) {
  if (filter === "전체") return true;
  if (filter === "안 읽음") return (item.unreadCount ?? 0) > 0;
  if (filter === "메시지 상담") return item.chatroomType === "MESSAGE";
  if (filter === "화상 상담") return item.chatroomType === "VIDEO";
  return true;
}

/** ----------------------------
 *  Component
 *  ---------------------------- */

export function ChatList() {
  const nav = useNavigate();

  const [activeFilter, setActiveFilter] = useState<Filter>("전체");

  const [raw, setRaw] = useState<ChatRoomListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchChatRooms();
        if (!alive) return;

        setRaw(data);
      } catch (e) {
        console.error(e);
        if (!alive) return;
        setError(e instanceof Error ? e.message : "채팅 목록을 불러오지 못했습니다.");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const items = useMemo(() => {
    const mapped = raw.map(mapChatRoomToItem);

    mapped.sort((a, b) => {
      const ta = a.sortKeyISO ? new Date(a.sortKeyISO).getTime() : 0;
      const tb = b.sortKeyISO ? new Date(b.sortKeyISO).getTime() : 0;
      return tb - ta;
    });

    return mapped.filter((x) => matchesFilter(x, activeFilter));
  }, [raw, activeFilter]);

  return (
    <div className="min-h-full w-full bg-[#ffffff]">
      <div className="mx-auto flex h-full w-full max-w-[420px] flex-col bg-white">
        <header className="sticky top-0 z-10 bg-white px-5 pt-6 pb-3">
          <h1 className="pre_title_semi_20 text-[#000000]">채팅</h1>

          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {FILTERS.map((filter) => {
              const isActive = filter === activeFilter;
              return (
                <button
                  key={filter}
                  type="button"
                  className={[
                    "h-8 shrink-0 rounded-[4px] px-3 text-[13px]",
                    isActive
                      ? "border-transparent bg-[#46474c] text-white pre_body_semi_13"
                      : "border border-[#dbdcdf] bg-white text-slate-700 pre_body_reg_13",
                  ].join(" ")}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </header>

        <ScrollArea className="flex-1">
          {loading && (
            <div className="px-5 py-10 text-center text-sm text-slate-400">불러오는 중...</div>
          )}

          {error && <div className="px-5 py-10 text-center text-sm text-red-500">{error}</div>}

          {!loading && !error && (
            <ul className="px-5 pb-6">
              {items.map((chat) => (
                <li key={chat.id}>
                  <button
                    type="button"
                    className={["flex w-full items-center gap-3 rounded-2xl py-3 text-left"].join(
                      " ",
                    )}
                    onClick={() => {
                      const headerMeta: ChatHeaderData = {
                        nickname: chat.name,
                        category: chat.tag,
                        profileImageUrl: chat.profileImageUrl ?? null,
                      };

                      nav(`/chatlist/${chat.chatroomId}`, {
                        state: { headerMeta },
                      });
                    }}
                  >
                    <Avatar className="h-[52px] w-[52px] shrink-0 mr-1">
                      {chat.profileImageUrl ? (
                        <AvatarImage src={chat.profileImageUrl} alt={chat.name} />
                      ) : null}
                      <AvatarImage
                        src={Default}
                        alt="profile"
                        className="h-full w-full object-cover"
                      />
                    </Avatar>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate pre_subtitle_semi_14 text-[#292a2d]">
                          {chat.name}
                        </span>

                        {!!chat.tag && (
                          <span className="rounded-[2px] border-0 bg-[#e5f4ff] px-1.5 py-[2px] pre_body_reg_12 text-[#008bff]">
                            {chat.tag}
                          </span>
                        )}
                      </div>

                      <p className="mt-1 line-clamp-2 text-[12px] leading-snug text-slate-500">
                        {chat.preview}
                      </p>
                    </div>

                    <div className="flex shrink-0 flex-col items-end justify-center gap-2 pl-2">
                      <span className="pre_cap_med_12 text-[#989ba2]">{chat.timeLabel}</span>

                      {(chat.unreadCount ?? 0) > 0 ? (
                        <div className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#2F80FF] px-1">
                          <span className="text-[11px] font-semibold text-white">
                            {chat.unreadCount}
                          </span>
                        </div>
                      ) : (
                        <div className="h-5" />
                      )}
                    </div>
                  </button>

                  <div className="ml-[56px] border-b border-slate-100" />
                </li>
              ))}

              {items.length === 0 && (
                <div className="py-16 text-center text-sm text-slate-400">
                  표시할 채팅이 없습니다.
                </div>
              )}
            </ul>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
