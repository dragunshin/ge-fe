import { useCallback, useEffect, useMemo, useState } from "react";
import { useStompClient } from "@/hooks/useStompClient";
import type { ChatMessage, SocketResponse, MessageType } from "@/types/chat";
import { fetchChatMessages } from "@/api/chat";

type UseChatRoomArgs = { roomId: number | null };

function normalizeFromSocket(raw: unknown): ChatMessage | null {
  const env = raw as any;

  const payload = (env?.payload ?? env) as any;
  if (!payload) return null;

  const messageId = payload.messageId ?? payload.id;
  const chatroomId = env?.chatroomId ?? payload.chatroomId;

  if (typeof messageId !== "number" || typeof chatroomId !== "number") return null;

  return {
    messageId,
    chatroomId,
    senderId: Number(payload.senderId),
    senderRole: (payload.senderRole ?? "MEMBER") as any,
    messageType: (payload.messageType ?? "TEXT") as any,
    content: String(payload.content ?? ""),
    relatedId: payload.relatedId == null ? null : Number(payload.relatedId),
    createdAt: String(payload.createdAt ?? new Date().toISOString()),
  };
}

export function useChatRoom({ roomId }: UseChatRoomArgs) {
  const canUseRoom = roomId != null;
  const { isReady, subscribe, send } = useStompClient();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // history fetch - 403이어도 채팅은 계속
  useEffect(() => {
    if (!canUseRoom) return;

    let mounted = true;
    setIsLoading(true);

    fetchChatMessages(roomId)
      .then((data) => {
        if (!mounted) return;
        setMessages(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.warn("[CHAT] history load skipped:", err);
        if (!mounted) return;
        setMessages([]); // 실패해도 빈 배열로 진행 - 처음 고려
      })
      .finally(() => {
        if (!mounted) return;
        setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [canUseRoom, roomId]);

  // “연결된 다음”에 SUB하도록 isReady를 의존성에 넣는 게 핵심
  useEffect(() => {
    if (!canUseRoom || !isReady) return;

    const dest = `/sub/chatrooms/${roomId}`;

    const unsubscribe = subscribe(dest, (msg) => {
      try {
        const raw = JSON.parse(msg.body) as SocketResponse<any>;
        const normalized = normalizeFromSocket(raw);
        if (!normalized) return;

        setMessages((prev) => {
          // optimistic(음수 id) 제거: senderId/content/type이 같으면 제거
          const cleaned = prev.filter(
            (m) =>
              !(
                m.messageId < 0 &&
                m.senderId === normalized.senderId &&
                m.content === normalized.content &&
                m.messageType === normalized.messageType
              ),
          );

          if (cleaned.some((m) => m.messageId === normalized.messageId)) return cleaned;

          return [...cleaned, normalized].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
        });
      } catch (e) {
        console.error("[CHAT] bad message frame:", e, msg.body);
      }
    });

    return () => unsubscribe();
  }, [canUseRoom, isReady, roomId, subscribe]);

  const sendTextMessage = useCallback(
    (text: string) => {
      if (!canUseRoom) return;
      if (!isReady) {
        console.warn("[CHAT] send blocked: not connected");
        return;
      }

      const tempId = -Date.now();

      // optimistic 표시 (history 403이어도 화면에서 보이게)
      setMessages((prev) => [
        ...prev,
        {
          messageId: tempId,
          chatroomId: roomId,
          senderId: -1, // 내 userId를 알고 있으면 여기 넣어도 됨
          senderRole: "MEMBER",
          messageType: "TEXT",
          content: text,
          relatedId: null,
          createdAt: new Date().toISOString(),
        },
      ]);

      // senderId는 서버에서
      send("/pub/chat/message", {
        chatroomId: roomId,
        messageType: "TEXT" as MessageType,
        content: text,
        relatedId: null,
      });
    },
    [canUseRoom, isReady, roomId, send],
  );

  const isConnected = !!(canUseRoom && isReady);

  return useMemo(
    () => ({ messages, isLoading, isConnected, sendTextMessage }),
    [messages, isLoading, isConnected, sendTextMessage],
  );
}
