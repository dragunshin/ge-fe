"use client";

import { useEffect, useRef } from "react";
import type { ChatMessage } from "@/types/chat";
import { MessageBubble } from "./MessageBubble";

type Props = {
  messages: ChatMessage[];
  myUserId?: number | null;
  opponentProfileImage?: string | null;
};
export function MessageList({ messages, myUserId, opponentProfileImage }: Props) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  return (
    <main className="scrollbar-hide flex-1 overflow-y-auto bg-[#F6F6F7] px-4 py-4">
      <div className="space-y-3">
        {messages.map((m) => (
          <MessageBubble
            key={m.messageId}
            message={m}
            myUserId={myUserId}
            opponentProfileImage={opponentProfileImage}
          />
        ))}
      </div>
      <div ref={bottomRef} />
    </main>
  );
}
