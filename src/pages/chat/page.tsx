"use client";

import { useEffect, useState } from "react";
import ChatHeader from "./components/ChatHeader";
import { useChatRoom } from "@/hooks/useChatRoom";
import { MessageList } from "./components/MessageList";
import { MessageInput } from "./components/MessageInput";
import { createChatroom } from "@/api/chat";

export function Chat() {
  const consultationId = 4;

  const [chatroomId, setChatroomId] = useState<number | null>(null);
  const [creating, setCreating] = useState(true);

  // 훅은 항상 호출 (chatroomId 없으면 null)
  const { messages, isLoading, isConnected, sendTextMessage } = useChatRoom({
    roomId: chatroomId,
  });

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setCreating(true);
        const created = await createChatroom(consultationId, "MESSAGE");
        if (!mounted) return;
        setChatroomId(created.chatroomId);
      } catch (e) {
        console.error("Failed to create chatroom", e);
        if (!mounted) return;
        setChatroomId(null);
      } finally {
        if (!mounted) return;
        setCreating(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [consultationId]);

  if (creating) {
    return <div className="p-4 text-sm text-slate-500">채팅방 생성 중...</div>;
  }

  if (chatroomId == null) {
    return <div className="p-4 text-sm text-red-500">채팅방 생성 실패</div>;
  }

  return (
    <div className="flex h-full flex-col w-full bg-white">
      <ChatHeader />

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

      <MessageList messages={messages} />
      <MessageInput onSend={sendTextMessage} disabled={!isConnected} />

    </div>
  );
}
