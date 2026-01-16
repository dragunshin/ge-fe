// import { useCallback, useEffect, useMemo, useState } from "react";
// import { useStompClient } from "@/hooks/useStompClient";
// import type { ChatMessage, SocketResponse, MessageType } from "@/types/chat";
// import { fetchChatMessages } from "@/api/chat";

// type UseChatRoomArgs = { roomId: number | null };

// function normalizeFromSocket(raw: unknown): ChatMessage | null {
//   const env = raw as any;

//   const payload = (env?.payload ?? env) as any;
//   if (!payload) return null;

//   const messageId = payload.messageId ?? payload.id;
//   const chatroomId = env?.chatroomId ?? payload.chatroomId;

//   if (typeof messageId !== "number" || typeof chatroomId !== "number") return null;

//   return {
//     messageId,
//     chatroomId,
//     senderId: Number(payload.senderId),
//     senderRole: (payload.senderRole ?? "MEMBER") as any,
//     messageType: (payload.messageType ?? "TEXT") as any,
//     content: String(payload.content ?? ""),
//     relatedId: payload.relatedId == null ? null : Number(payload.relatedId),
//     createdAt: String(payload.createdAt ?? new Date().toISOString()),
//   };
// }

// export function useChatRoom({ roomId }: UseChatRoomArgs) {
//   const canUseRoom = roomId != null;
//   const { isReady, subscribe, send } = useStompClient();

//   const [messages, setMessages] = useState<ChatMessage[]>([]);
//   const [isLoading, setIsLoading] = useState(false);

//   // history fetch - 403이어도 채팅은 계속
//   useEffect(() => {
//     if (!canUseRoom) return;

//     let mounted = true;
//     setIsLoading(true);

//     fetchChatMessages(roomId)
//       .then((data) => {
//         if (!mounted) return;
//         setMessages(Array.isArray(data) ? data : []);
//       })
//       .catch((err) => {
//         console.warn("[CHAT] history load skipped:", err);
//         if (!mounted) return;
//         setMessages([]); // 실패해도 빈 배열로 진행 - 처음 고려
//       })
//       .finally(() => {
//         if (!mounted) return;
//         setIsLoading(false);
//       });

//     return () => {
//       mounted = false;
//     };
//   }, [canUseRoom, roomId]);

//   // “연결된 다음”에 SUB하도록 isReady를 의존성에 넣는 게 핵심
//   useEffect(() => {
//     if (!canUseRoom || !isReady) return;

//     const dest = `/sub/chatrooms/${roomId}`;

//     const unsubscribe = subscribe(dest, (msg) => {
//       try {
//         const raw = JSON.parse(msg.body) as SocketResponse<any>;
//         const normalized = normalizeFromSocket(raw);
//         if (!normalized) return;

//         setMessages((prev) => {
//           // optimistic(음수 id) 제거: senderId/content/type이 같으면 제거
//           const cleaned = prev.filter(
//             (m) =>
//               !(
//                 m.messageId < 0 &&
//                 m.senderId === normalized.senderId &&
//                 m.content === normalized.content &&
//                 m.messageType === normalized.messageType
//               ),
//           );

//           if (cleaned.some((m) => m.messageId === normalized.messageId)) return cleaned;

//           return [...cleaned, normalized].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
//         });
//       } catch (e) {
//         console.error("[CHAT] bad message frame:", e, msg.body);
//       }
//     });

//     return () => unsubscribe();
//   }, [canUseRoom, isReady, roomId, subscribe]);

//   const sendTextMessage = useCallback(
//     (text: string) => {
//       if (!canUseRoom) return;
//       if (!isReady) {
//         console.warn("[CHAT] send blocked: not connected");
//         return;
//       }

//       const tempId = -Date.now();

//       // optimistic 표시 (history 403이어도 화면에서 보이게)
//       setMessages((prev) => [
//         ...prev,
//         {
//           messageId: tempId,
//           chatroomId: roomId,
//           //  senderId: -1, // 내 userId를 알고 있으면 여기 넣어도 됨
//           senderId: 1,
//           senderRole: "MEMBER",
//           messageType: "TEXT",
//           content: text,
//           relatedId: null,
//           createdAt: new Date().toISOString(),
//         },
//       ]);

//       // senderId는 서버에서
//       send("/pub/chat/message", {
//         chatroomId: roomId,
//         messageType: "TEXT" as MessageType,
//         content: text,
//         relatedId: null,
//       });
//     },
//     [canUseRoom, isReady, roomId, send],
//   );

//   const isConnected = !!(canUseRoom && isReady);

//   return useMemo(
//     () => ({ messages, isLoading, isConnected, sendTextMessage }),
//     [messages, isLoading, isConnected, sendTextMessage],
//   );
// }
// src/hooks/useChatRoom.ts
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { IMessage } from "@stomp/stompjs";
import { useStompClient } from "@/hooks/useStompClient";
import { fetchChatMessages } from "@/api/chat";
import type { ChatMessage } from "@/types/chat";

type SocketEvent<T> = {
  eventType: "MESSAGE";
  chatroomId: number;
  payload: T;
};

export function useChatRoom({ roomId }: { roomId: number | null }) {
  const { isReady, myUserId, subscribe, send } = useStompClient();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ 연결 상태는 “소켓 연결” 기준으로만
  const isConnected = isReady;

  // roomId는 콜백에서 안정적으로 쓰려고 ref로 들고감
  const roomIdRef = useRef<number | null>(roomId);
  useEffect(() => {
    roomIdRef.current = roomId;
  }, [roomId]);

  /** 1) 히스토리 로드: 실패(403)해도 실시간까지 막지 않기 */
  useEffect(() => {
    let alive = true;
    if (!roomId) return;

    setIsLoading(true);
    fetchChatMessages(roomId)
      .then((data) => {
        if (!alive) return;
        setMessages(data);
      })
      .catch((err) => {
        // ✅ 403이면 “히스토리만 못 가져옴”이지, 실시간을 막을 이유가 없음
        console.warn("[CHAT] history load skipped:", err);
      })
      .finally(() => {
        if (!alive) return;
        setIsLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [roomId]);

  /** 2) 실시간 구독: 의존성 최소화 + functional update */
  useEffect(() => {
    if (!roomId) return;
    if (!isReady) return;

    const destination = `/sub/chatrooms/${roomId}`;

    const unsubscribe = subscribe(destination, (frame: IMessage) => {
      try {
        const evt = JSON.parse(frame.body) as SocketEvent<ChatMessage>;
        if (evt?.eventType !== "MESSAGE") return;
        if (evt?.chatroomId !== roomIdRef.current) return;

        const incoming = evt.payload;

        // ✅ 핵심: functional update (클로저 stale 방지)
        setMessages((prev) => {
          // messageId 중복 방지(서버가 에코로 보내므로 필수에 가까움)
          if (incoming?.messageId != null && prev.some((m) => m.messageId === incoming.messageId)) {
            return prev;
          }
          return [...prev, incoming];
        });
      } catch (e) {
        console.error("[CHAT] bad socket payload:", e, frame.body);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [roomId, isReady, subscribe]);

  /** 3) 전송: publish만 하면 됨 (senderId는 서버가 세션에서 주입) */
  const sendTextMessage = useCallback(
    (text: string) => {
      const chatroomId = roomIdRef.current;
      if (!chatroomId) return;

      const payload = {
        chatroomId,
        messageType: "TEXT",
        content: text,
        relatedId: null,
        // 서버가 senderId 주입하지만, 프론트 optimistic/버블정렬에 쓰고 싶으면 넣어도 됨
        senderId: myUserId ?? undefined,
      };

      send("/pub/chat/message", payload);
    },
    [send, myUserId],
  );

  return useMemo(
    () => ({ messages, isLoading, isConnected, myUserId, sendTextMessage }),
    [messages, isLoading, isConnected, myUserId, sendTextMessage],
  );
}
