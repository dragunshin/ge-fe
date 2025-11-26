import { useEffect, useState, useCallback } from "react";
import type { ChatMessage } from "@/types/chat";
import { fetchChatMessages } from "@/api/chat";
import { useStompClient } from "@/hooks/useStompClient";

interface UseChatRoomOptions {
  roomId: number;
}

export function useChatRoom({ roomId }: UseChatRoomOptions) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { isReady, subscribe, send } = useStompClient();

  // 1) 초기 메시지 REST로 가져오기
  useEffect(() => {
    let mounted = true;
    setIsLoading(true);

    fetchChatMessages(roomId)
      .then((data) => {
        if (!mounted) return;
        setMessages(data);
      })
      .catch((err) => {
        console.error("Failed to load messages", err);
      })
      .finally(() => {
        if (!mounted) return;
        setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [roomId]);

  // 2) STOMP 구독
  useEffect(() => {
    if (!isReady) return;

    const destination = `/sub/chatroom/${roomId}`;
    const unsubscribe = subscribe(destination, (frame) => {
      try {
        const body = JSON.parse(frame.body) as ChatMessage;
        setMessages((prev) => [...prev, body]);
      } catch (e) {
        console.error("[CHAT] failed to parse message", e);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [roomId, isReady, subscribe]);

  // 3) 메시지 전송 함수
  const sendTextMessage = useCallback(
    (content: string) => {
      if (!content.trim()) return;

      const payload = {
        chatroomId: roomId,
        messageType: "TEXT",
        content,
        relatedId: null,
      };

      send("/pub/chat.message", payload);
    },
    [roomId, send],
  );

  return {
    messages,
    isLoading,
    isConnected: isReady,
    sendTextMessage,
  };
}
