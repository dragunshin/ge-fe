// "use client";

// import { useEffect, useRef } from "react";
// import type { ChatMessage } from "@/types/chat";
// import { MessageBubble } from "./MessageBubble";

// interface MessageListProps {
//   messages: ChatMessage[];
// }

// export function MessageList({ messages }: MessageListProps) {
//   const bottomRef = useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages.length]);

//   return (
//     <main className="flex-1 overflow-y-auto bg-white px-4 py-4">
//       {messages.length === 0 ? (
//         <div className="py-10 text-center text-sm text-slate-400">아직 메시지가 없어요.</div>
//       ) : (
//         <div className="space-y-3">
//           {messages.map((message, idx) => {
//             const key =
//               (message.id as string | number | undefined) ?? `${message.createdAt ?? "na"}-${idx}`;

//             return <MessageBubble key={key} message={message} />;
//           })}
//         </div>
//       )}

//       <div ref={bottomRef} />
//     </main>
//   );
// }

"use client";

import { useEffect, useRef } from "react";
import type { ChatMessage } from "@/types/chat";
import { MessageBubble } from "./MessageBubble";

type Props = {
  messages: ChatMessage[];
  myUserId?: number; // 내 메시지 판별에 사용
};

export function MessageList({ messages, myUserId }: Props) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  return (
    <main className="flex-1 overflow-y-auto bg-[#F5F6FA] px-4 py-4 space-y-3">
      {messages.map((m) => (
        <MessageBubble key={m.messageId} message={m} myUserId={myUserId} />
      ))}
      <div ref={bottomRef} />
    </main>
  );
}
