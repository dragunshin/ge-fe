// import { useCallback, useEffect, useRef } from "react";
// import { Client } from "@stomp/stompjs";
// import { useChatStore } from "@/stores/useChatStore";

// const WS_URL = import.meta.env.VITE_WS_URL ?? "ws://localhost:8080/ws-stomp";

// // 모든 컴포넌트에서 공유되는 클라이언트
// let sharedClient: Client | null = null;

// interface SendChatPayload {
//   chatroomId: number;
//   content: string;
//   messageType?: "TEXT" | "SOLUTION" | "QUESTION" | "SYSTEM";
//   relatedId?: number | null;
// }

// export const useStompClient = () => {
//   // ✅ hook으로는 "읽기만"
//   const currentRoomId = useChatStore((s) => s.currentRoomId);
//   const isConnected = useChatStore((s) => s.isConnected);

//   const clientRef = useRef<Client | null>(sharedClient);

//   // 1) 클라이언트 생성 (한 번만, store에 set 안 함)
//   useEffect(() => {
//     if (clientRef.current) return;

//     const client = new Client({
//       brokerURL: WS_URL,
//       reconnectDelay: 5000,
//       heartbeatIncoming: 10000,
//       heartbeatOutgoing: 10000,
//       debug: () => {
//         // 필요하면 로그
//       },
//       onConnect: () => {
//         console.log("[STOMP] connected");
//         // ✅ 정적 setState 사용 (hook 아님)
//         useChatStore.setState({ isConnected: true });
//       },
//       onStompError: (frame) => {
//         console.error("[STOMP] error", frame.body);
//       },
//       onWebSocketClose: () => {
//         console.log("[STOMP] websocket closed");
//         useChatStore.setState({ isConnected: false });
//       },
//     });

//     clientRef.current = client;
//     sharedClient = client;
//     client.activate();

//     return () => {
//       console.log("[STOMP] deactivate");
//       client.deactivate();
//       // cleanup에서는 굳이 setState 안 해도 됨 (해도 한 번이라 상관없지만 안전하게)
//       sharedClient = null;
//       clientRef.current = null;
//     };
//   }, []); // ✅ deps 비움: 한 번만 실행

//   // 2) 현재 방 구독
//   useEffect(() => {
//     const client = clientRef.current;
//     if (!client || !client.connected) return;
//     if (currentRoomId == null) return;

//     const destination = `/sub/chatroom/${currentRoomId}`;
//     console.log("[STOMP] subscribe:", destination);

//     const subscription = client.subscribe(destination, (frame) => {
//       try {
//         const body = JSON.parse(frame.body);

//         const msg = {
//           id: body.id ?? crypto.randomUUID(),
//           chatroomId: body.chatroomId,
//           senderId: body.senderId ?? "unknown",
//           content: body.content,
//           messageType: body.messageType ?? "TEXT",
//           relatedId: body.relatedId ?? null,
//           createdAt: body.createdAt ?? new Date().toISOString(),
//         };

//         // ✅ hook 대신 정적 API로 메시지 추가
//         const { addMessage } = useChatStore.getState();
//         addMessage(msg);
//       } catch (e) {
//         console.error("[STOMP] parse error", e);
//       }
//     });

//     return () => {
//       console.log("[STOMP] unsubscribe:", destination);
//       subscription.unsubscribe();
//     };
//   }, [currentRoomId]);

//   // 3) 메시지 전송
//   const sendChatMessage = useCallback(
//     ({ chatroomId, content, messageType = "TEXT", relatedId = null }: SendChatPayload) => {
//       const client = clientRef.current;
//       if (!client || !client.connected) {
//         console.warn("[STOMP] not connected, skip send");
//         return;
//       }

//       client.publish({
//         destination: "/pub/chat.message",
//         body: JSON.stringify({
//           chatroomId,
//           messageType,
//           content,
//           relatedId,
//         }),
//       });
//     },
//     [],
//   );

//   return {
//     isConnected,
//     sendChatMessage,
//   };
// };

//상태관리 자꾸 무한루프로 빠짐 일단 나중에

// src/hooks/useStompClient.ts
import { useEffect, useRef, useCallback } from "react";
import { Client, type IMessage, type StompSubscription } from "@stomp/stompjs";

const WS_URL = import.meta.env.VITE_WS_URL ?? "ws://localhost:8080/ws-stomp";

// 모듈 전역 싱글톤
let sharedClient: Client | null = null;

type MessageHandler = (msg: IMessage) => void;

interface UseStompClientResult {
  isReady: boolean;
  subscribe: (destination: string, handler: MessageHandler) => () => void;
  send: (destination: string, body: unknown) => void;
}

export function useStompClient(): UseStompClientResult {
  const clientRef = useRef<Client | null>(sharedClient);
  const isReadyRef = useRef(false);

  // 1) 한 번만 클라이언트 생성/연결
  useEffect(() => {
    if (clientRef.current) {
      return;
    }

    const client = new Client({
      brokerURL: WS_URL,
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      debug: () => {
        // console.log("[STOMP]", str);
      },
      onConnect: () => {
        console.log("[STOMP] connected");
        isReadyRef.current = true;
      },
      onStompError: (frame) => {
        console.error("[STOMP] error", frame.body);
      },
      onWebSocketClose: () => {
        console.log("[STOMP] websocket closed");
        isReadyRef.current = false;
      },
    });

    clientRef.current = client;
    sharedClient = client;
    client.activate();

    return () => {
      console.log("[STOMP] deactivate");
      client.deactivate();
      sharedClient = null;
      clientRef.current = null;
      isReadyRef.current = false;
    };
  }, []);

  // 2) 구독 함수
  const subscribe = useCallback((destination: string, handler: MessageHandler) => {
    const client = clientRef.current;
    if (!client) {
      console.warn("[STOMP] subscribe: client not ready");
      return () => {};
    }

    // 아직 연결 전이라면, onConnect에서 다시 구독하는 로직을 넣을 수도 있음
    if (!client.connected) {
      console.warn("[STOMP] subscribe: not connected yet");
      return () => {};
    }

    const sub: StompSubscription = client.subscribe(destination, handler);
    return () => {
      sub.unsubscribe();
    };
  }, []);

  // 3) 전송 함수
  const send = useCallback((destination: string, body: unknown) => {
    const client = clientRef.current;
    if (!client || !client.connected) {
      console.warn("[STOMP] send: not connected");
      return;
    }
    client.publish({
      destination,
      body: JSON.stringify(body),
    });
  }, []);

  return {
    isReady: isReadyRef.current,
    subscribe,
    send,
  };
}
