// "use client";

// import { useEffect, useState } from "react";
// import ChatHeader from "./components/ChatHeader";
// import { useChatRoom } from "@/hooks/useChatRoom";
// import { MessageList } from "./components/MessageList";
// import { MessageInput } from "./components/MessageInput";
// import { createChatroom } from "@/api/chat";

// export function Chat() {
//   const consultationId = 4;

//   const [chatroomId, setChatroomId] = useState<number | null>(null);
//   const [creating, setCreating] = useState(true);

//   // 훅은 항상 호출 (chatroomId 없으면 null)
//   const { messages, isLoading, isConnected, sendTextMessage } = useChatRoom({
//     roomId: chatroomId,
//   });

//   useEffect(() => {
//     let mounted = true;

//     (async () => {
//       try {
//         setCreating(true);
//         const created = await createChatroom(consultationId, "MESSAGE");
//         if (!mounted) return;
//         setChatroomId(created.chatroomId);
//       } catch (e) {
//         console.error("Failed to create chatroom", e);
//         if (!mounted) return;
//         setChatroomId(null);
//       } finally {
//         if (!mounted) return;
//         setCreating(false);
//       }
//     })();

//     return () => {
//       mounted = false;
//     };
//   }, [consultationId]);

//   if (creating) {
//     return <div className="p-4 text-sm text-slate-500">채팅방 생성 중...</div>;
//   }

//   if (chatroomId == null) {
//     return <div className="p-4 text-sm text-red-500">채팅방 생성 실패</div>;
//   }

//   return (
//     <div className="flex h-full flex-col w-full bg-white">
//       <ChatHeader />

//       {isLoading && (
//         <div className="px-4 py-2 text-center text-xs text-slate-400">
//           메시지를 불러오는 중입니다...
//         </div>
//       )}
//       {!isConnected && (
//         <div className="px-4 py-1 text-center text-[11px] text-slate-400">
//           서버와 연결 중입니다...
//         </div>
//       )}

//       <MessageList messages={messages} />
//       <MessageInput onSend={sendTextMessage} disabled={!isConnected} />
//     </div>
//   );
// }

// "use client";

// import { useParams } from "react-router-dom";
// import ChatHeader from "./components/ChatHeader";
// import { useChatRoom } from "@/hooks/useChatRoom";
// import { MessageList } from "./components/MessageList";
// import { MessageInput } from "./components/MessageInput";

// export function Chat() {
//   const params = useParams<{ roomId: string }>();
//   const roomId = params.roomId ? Number(params.roomId) : null;

//   // 훅은 항상 호출 (roomId가 null이면 내부에서 연결/요청 스킵)
//   const { messages, isLoading, isConnected, sendTextMessage } = useChatRoom({
//     roomId,
//   });

//   if (!roomId || Number.isNaN(roomId)) {
//     return <div className="p-4 text-sm text-slate-500">잘못된 채팅방입니다.</div>;
//   }

//   return (
//     <div className="flex h-full w-full flex-col bg-white">
//       <ChatHeader />

//       {isLoading && (
//         <div className="px-4 py-2 text-center text-xs text-slate-400">
//           메시지를 불러오는 중입니다...
//         </div>
//       )}
//       {!isConnected && (
//         <div className="px-4 py-1 text-center text-[11px] text-slate-400">
//           서버와 연결 중입니다...
//         </div>
//       )}

//       <MessageList messages={messages} />
//       <MessageInput onSend={sendTextMessage} disabled={!isConnected} />
//     </div>
//   );
// }
"use client";

import { useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";

import { useChatRoom } from "@/hooks/useChatRoom";
import { MessageList } from "./components/MessageList";
import { MessageInput } from "./components/MessageInput";
import ChatHeader, { type ChatHeaderData } from "./components/ChatHeader";

export function Chat() {
  const params = useParams();
  const location = useLocation();
  //const state = (location.state ?? {}) as ChatRouteState;

  const chatroomId = useMemo(() => {
    const raw = params.chatroomId;
    if (!raw) return null;
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  }, [params.chatroomId]);

  const { messages, isLoading, isConnected, sendTextMessage, myUserId } = useChatRoom({
    roomId: chatroomId,
  });

  type ChatRouteState = {
    headerMeta?: ChatHeaderData;
  };

  const headerMetaFromState = (location.state as ChatRouteState | null)?.headerMeta ?? null;

  const headerMeta: ChatHeaderData = headerMetaFromState ?? {
    nickname: "상대",
    category: "",
    profileImageUrl: null,
  };

  if (chatroomId == null) {
    return <div className="p-4 text-sm text-red-500">잘못된 채팅방 ID</div>;
  }

  return (
    <div className="flex h-full w-full flex-col bg-white">
      <ChatHeader
        // meta={{
        //   nickname: state.opponentNickname ?? "상대",
        //   category: state.expertCategory ?? "",
        //   profileImageUrl: state.opponentProfileImage ?? null,
        // }}
        meta={headerMeta}
      />

      {isLoading && (
        <div className="px-4 py-2 text-center text-xs text-slate-400">
          메시지를 불러오는 중입니다...
        </div>
      )}
      {!isConnected && (
        <div className="px-4 py-1 text-center text-[11px] text-slate-400">
          서버와 연결 중입니다...
        </div>
      )}

      <MessageList
        messages={messages}
        myUserId={myUserId}
        opponentProfileImage={headerMeta.profileImageUrl ?? null}
      />
      <MessageInput onSend={sendTextMessage} disabled={!isConnected} />
    </div>
  );
}
