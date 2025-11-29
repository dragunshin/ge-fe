// // "use client";

// // import { ArrowLeft, ChevronLeft, MoreVertical, Plus } from "lucide-react";

// // import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// // import { Card } from "@/components/ui/card";
// // import { Button } from "@/components/ui/button";
// // import { Input } from "@/components/ui/input";
// // import ChatHeader from "./components/ChatHeader";

// // export function Chat() {
// //   return (
// //     <div className="flex flex-col w-full justify-center py-6">
// //       <ChatHeader />

// //       {/* 채팅 영역 */}

// //       {/* 하단 입력 영역 */}
// //       <footer className="flex items-center gap-2 border-t border-slate-200 bg-white px-4 py-3">
// //         <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-slate-100 p-0">
// //           <Plus className="h-4 w-4 text-slate-600" />
// //         </Button>

// //         <div className="flex-1 rounded-full bg-slate-100 px-4 py-2 text-[13px] text-slate-400">
// //           내용을 입력하세요
// //         </div>

// //         <Button className="h-9 rounded-full px-4 text-[13px] font-semibold">전송</Button>
// //       </footer>

// //       <div className="flex w-full max-w-sm items-center gap-2">
// //         <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-slate-100 p-0">
// //           <Plus className="h-4 w-4 text-slate-600" />
// //         </Button>
// //         <Input type="email" placeholder="내용을 입력하세요" />
// //         <Button type="submit" variant="outline" size="sm">
// //           전송
// //         </Button>
// //       </div>
// //     </div>
// //   );
// // }

// "use client";

// import { Plus } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import ChatHeader from "./components/ChatHeader";

// import { useChatStore } from "@/stores/useChatStore";
// import { useStompClient } from "@/hooks/useStompClient";
// import { MessageBubble } from "./components/MessageBubble";

// export function Chat() {
//   // 현재 방 + 메시지 목록을 zustand에서 가져오기
//   // const currentRoomId = useChatStore((s) => s.currentRoomId);
//   // const messages = useChatStore((s) =>
//   //   currentRoomId ? (s.messagesByRoom[String(currentRoomId)] ?? []) : [],
//   // );
//   // // STOMP 연결 상태 (옵션)
//   // const { isConnected } = useStompClient();

//   return (
//     <div className="flex h-full flex-col w-full bg-white">
//       <ChatHeader />

//       {/* 채팅 영역 */}
//       <main className="flex-1 bg-[#F5F6FA] px-4 py-4 space-y-4 overflow-y-auto">
//         {/* 날짜 칩 – 나중에 실제 날짜로 교체하면 됨 */}
//         <div className="flex justify-center">
//           <div className="rounded-full bg-slate-100 px-4 py-1 text-[11px] text-slate-500">
//             2025년 11월 9일 일요일
//           </div>
//         </div>

//         {/* {!isConnected && (
//           <p className="text-center text-[11px] text-slate-400">서버와 연결 중입니다...</p>
//         )}

//         {messages.map((m) => (
//           <MessageBubble key={m.id} message={m} />
//         ))} */}
//       </main>

//       {/* 하단 입력 영역 – 나중에 STOMP send 붙이면 됨 */}
//       <footer className="flex items-center gap-3 border-t border-slate-200 bg-white px-4 py-3">
//         {/* + 버튼 */}
//         <Button
//           variant="ghost"
//           size="icon"
//           className="h-10 w-10 rounded-full bg-[#f4f4f5] p-0 shadow-[0_0_0_0.5px_rgba(148,163,184,0.4)]"
//         >
//           <Plus className="h-5 w-5 text-slate-500" />
//         </Button>

//         {/* 플레이스홀더 텍스트만 보이는 입력 영역 */}
//         <span className="flex-1 pl-2 text-[15px] text-slate-500">내용을 입력하세요</span>

//         {/* 전송 버튼 */}
//         <Button className="h-10 rounded-[12px] bg-[#7d8189] px-5 text-[14px] font-semibold text-white hover:bg-[#70747b]">
//           전송
//         </Button>
//       </footer>
//     </div>
//   );
// }

// "use client";

// import { useParams } from "react-router-dom";
// import ChatHeader from "./components/ChatHeader";
// import { useChatRoom } from "@/hooks/useChatRoom";
// // import { MessageList } from "./components/MessageList";
// // import { MessageInput } from "./components/MessageInput";

// export function Chat() {
//   const params = useParams<{ roomId: string }>();
//   const roomId = params.roomId ? Number(params.roomId) : NaN;

//   const { messages, isLoading, isConnected, sendTextMessage } = useChatRoom({
//     roomId,
//   });

//   if (!roomId || Number.isNaN(roomId)) {
//     return <div>잘못된 채팅방입니다.</div>;
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

//       {/* <MessageList messages={messages} />
//       <MessageInput onSend={sendTextMessage} /> */}
//     </div>
//   );
// }

"use client";

import { Plus } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import ChatHeader from "./components/ChatHeader";

type ChatMessage = {
  id: number;
  align: "left" | "right";
  text: string;
  actionLabel?: string; // 고민지 보기 / 솔루션지 보기 버튼 텍스트
};

const MOCK_MESSAGES: ChatMessage[] = [
  {
    id: 1,
    align: "right",
    text: "김바보님을 위한 고민지가 도착했습니다.",
    actionLabel: "고민지 보기",
  },
  {
    id: 2,
    align: "left",
    text: "김바보님을 위한 솔루션지가 도착했습니다.",
    actionLabel: "솔루션지 보기",
  },
  {
    id: 3,
    align: "right",
    text: "김바보님이 추가 질문을 보냈습니다.",
  },
  {
    id: 4,
    align: "right",
    text: "제가 왜 깡마른이에요? 그리고 그런 옷 입으면 더 말라보이는거 아니에요? 이런 옷은 안 돼요?",
  },
];

export function Chat() {
  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      <div className="shrink-0">
        <ChatHeader />
      </div>

      {/* 메시지 리스트 영역 */}
      <main className="flex-1 space-y-5 px-4 py-6 overflow-y-auto scrollbar-hide">
        {MOCK_MESSAGES.map((message) => (
          <ChatBubble key={message.id} message={message} />
        ))}
      </main>

      {/* 하단 입력 영역 */}
      <footer className="shrink-0 flex items-center gap-3 border-t border-slate-200 bg-white px-4 py-3">
        {/* + 버튼 */}
        <Button
          //variant="ghost"
          //size="icon"
          type="button"
          className="h-6 w-6 rounded-full bg-[#f4f4f5] p-0 hover:bg-[#cfd2d8]"
        >
          <Plus className="h-6 w-6 text-slate-500" />
        </Button>

        {/* 플레이스홀더 텍스트 */}
        <span className="flex-1 pl-2 text-[14px] text-slate-500">내용을 입력하세요</span>

        {/* 전송 버튼 */}
        <Button className="h-[34px] w-[57px] rounded-[8px] bg-[#878a93] px-[17px] py-[8px] text-[13px] font-semibold text-white hover:bg-[#70747b]">
          전송
        </Button>
      </footer>
    </div>
  );
}

type ChatBubbleProps = {
  message: ChatMessage;
};

function ChatBubble({ message }: ChatBubbleProps) {
  const isLeft = message.align === "left";

  const bubbleBase = "max-w-[80%] rounded-[8px] px-4 py-3 text-[13px] leading-relaxed";

  const bubbleClasses = isLeft
    ? "rounded-bl-none text-black bg-[#f4f4f5]"
    : "rounded-br-none bg-[#008bff] text-white";

  const actionClasses = isLeft ? "bg-white text-slate-800" : "bg-white text-black";

  return (
    <div className={`flex ${isLeft ? "items-start gap-2" : "justify-end"}`}>
      {/* 왼쪽 말풍선이면 아바타 표시 */}
      {isLeft && (
        <Avatar className="mt-1 h-9 w-9 bg-[#D9D9D9]">
          <AvatarFallback />
        </Avatar>
      )}

      <div className={`${bubbleBase} ${bubbleClasses}`}>
        <p className="whitespace-pre-line">{message.text}</p>

        {message.actionLabel && (
          <button
            type="button"
            className={`mt-3 w-full rounded-[8px] py-2 px-5 text-[13px] font-semibold ${actionClasses}`}
          >
            {message.actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
