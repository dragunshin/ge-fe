// import { useCallback, useEffect, useMemo, useState } from "react";
// import { Client, type IMessage, type StompSubscription } from "@stomp/stompjs";
// import SockJS from "sockjs-client";

// const WS_URL = import.meta.env.VITE_WS_URL ?? "https://api.menual.site/ws/chat";

// type MessageHandler = (msg: IMessage) => void;

// export interface UseStompClientResult {
//   isReady: boolean;
//   subscribe: (destination: string, handler: MessageHandler) => () => void;
//   send: (destination: string, body: unknown) => void;
// }

// type SubRecord = {
//   destination: string;
//   handler: MessageHandler;
//   sub?: StompSubscription;
//   active: boolean;
// };

// // module singleton 중복 연결 방지
// let shared: Client | null = null;
// let sharedReady = false;
// let mounts = 0;

// const readyListeners = new Set<(ready: boolean) => void>();
// const subs = new Set<SubRecord>();

// function emitReady(next: boolean) {
//   sharedReady = next;
//   for (const fn of readyListeners) fn(next);
// }

// function buildClient(): Client {
//   const isSockJsUrl = WS_URL.startsWith("http://") || WS_URL.startsWith("https://");

//   const client = new Client({
//     // SockJS 서버면 brokerURL 대신 webSocketFactory 사용
//     brokerURL: isSockJsUrl ? undefined : WS_URL,
//     webSocketFactory: isSockJsUrl
//       ? () =>
//           new SockJS(WS_URL, undefined, {
//             withCredentials: true,
//             transports: ["websocket", "xhr-streaming", "xhr-polling"],
//           } as any)
//       : undefined,

//     reconnectDelay: 3000,
//     heartbeatIncoming: 10000,
//     heartbeatOutgoing: 10000,

//     debug: (str) => {
//       if (import.meta.env.DEV) console.log("[STOMP]", str);
//     },

//     onConnect: () => {
//       emitReady(true);

//       // 연결되면 밀린 구독 flush
//       for (const r of subs) {
//         if (!r.active) continue;
//         if (!r.sub) r.sub = client.subscribe(r.destination, r.handler);
//       }
//     },

//     onWebSocketClose: () => {
//       // 재연결 시 재구독 되도록 핸들 제거
//       for (const r of subs) r.sub = undefined;
//       emitReady(false);
//     },

//     onStompError: (frame) => {
//       console.error("[STOMP] stomp error:", frame.headers, frame.body);
//     },

//     onWebSocketError: (evt) => {
//       console.error("[STOMP] websocket error", evt);
//     },
//   });

//   return client;
// }

// function ensureClient() {
//   if (shared) return shared;

//   shared = buildClient();
//   shared.activate();
//   return shared;
// }

// function teardownIfUnused() {
//   if (mounts > 0) return;

//   const client = shared;
//   shared = null;

//   for (const r of subs) {
//     try {
//       r.sub?.unsubscribe();
//     } catch {}
//   }
//   subs.clear();

//   try {
//     client?.deactivate();
//   } catch {}

//   emitReady(false);
// }

// export function useStompClient(): UseStompClientResult {
//   const [isReady, setIsReady] = useState(sharedReady);

//   useEffect(() => {
//     mounts += 1;
//     ensureClient();

//     const listener = (ready: boolean) => setIsReady(ready);
//     readyListeners.add(listener);
//     setIsReady(sharedReady);

//     return () => {
//       readyListeners.delete(listener);
//       mounts -= 1;
//       teardownIfUnused();
//     };
//   }, []);

//   const subscribe = useCallback((destination: string, handler: MessageHandler) => {
//     const client = ensureClient();

//     const rec: SubRecord = { destination, handler, active: true };
//     subs.add(rec);

//     // 이미 연결돼 있으면 바로 SUBSCRIBE
//     if (client.connected) {
//       rec.sub = client.subscribe(destination, handler);
//     }
//     // 아니면 onConnect에서 자동 구독

//     return () => {
//       rec.active = false;
//       try {
//         rec.sub?.unsubscribe();
//       } catch {}
//       subs.delete(rec);
//     };
//   }, []);

//   const send = useCallback((destination: string, body: unknown) => {
//     const client = ensureClient();

//     if (!client.connected) {
//       console.warn("[STOMP] send blocked: not connected");
//       return;
//     }

//     client.publish({
//       destination,
//       body: JSON.stringify(body),
//     });
//   }, []);

//   return useMemo(() => ({ isReady, subscribe, send }), [isReady, subscribe, send]);
// }

// // src/hooks/useStompClient.ts
// import { useCallback, useEffect, useMemo, useState } from "react";
// import { Client, type IMessage, type StompSubscription } from "@stomp/stompjs";
// import SockJS from "sockjs-client";

// /**
//  * ✅ SockJS는 "http/https" 또는 상대경로만 받음
//  * - dev(추천): "/ws/chat"  (vite proxy로 https://api... 로 전달)
//  * - prod(직결): "https://api.menual.site/ws/chat"
//  */
// const SOCKJS_URL = import.meta.env.VITE_SOCKJS_URL ?? "/ws/chat";

// type MessageHandler = (msg: IMessage) => void;

// export interface UseStompClientResult {
//   isReady: boolean;
//   subscribe: (destination: string, handler: MessageHandler) => () => void;
//   send: (destination: string, body: unknown) => void;
// }

// type SubRecord = {
//   destination: string;
//   handler: MessageHandler;
//   sub?: StompSubscription;
//   active: boolean;
// };

// // -------------------------
// // module singleton
// // -------------------------
// let shared: Client | null = null;
// let sharedReady = false;
// let mounts = 0;

// const readyListeners = new Set<(ready: boolean) => void>();
// const subs = new Set<SubRecord>();

// function emitReady(next: boolean) {
//   sharedReady = next;
//   for (const fn of readyListeners) fn(next);
// }

// function buildClient(): Client {
//   const client = new Client({
//     // ✅ SockJS 고정: brokerURL 사용하지 않음
//     brokerURL: undefined,

//     webSocketFactory: () => {
//       // ⚠️ SockJS는 ws/wss 금지. 내부적으로 websocket/xhr-streaming 등을 선택함.
//       return new SockJS(SOCKJS_URL, undefined, {
//         transports: ["websocket", "xhr-streaming", "xhr-polling"],
//       }) as any;
//     },

//     reconnectDelay: 3000,
//     heartbeatIncoming: 10000,
//     heartbeatOutgoing: 10000,

//     debug: (str) => {
//       if (import.meta.env.DEV) console.log("[STOMP]", str);
//     },

//     onConnect: () => {
//       emitReady(true);

//       // 연결되면 활성 구독 flush
//       for (const r of subs) {
//         if (!r.active) continue;
//         if (!r.sub) r.sub = client.subscribe(r.destination, r.handler);
//       }
//     },

//     onWebSocketClose: () => {
//       // 재연결 시 다시 subscribe 되도록 sub 핸들 제거
//       for (const r of subs) r.sub = undefined;
//       emitReady(false);
//     },

//     onStompError: (frame) => {
//       console.error("[STOMP] stomp error:", frame.headers, frame.body);
//     },

//     onWebSocketError: (evt) => {
//       console.error("[STOMP] websocket error", evt);
//     },
//   });

//   return client;
// }

// function ensureClient() {
//   if (shared) return shared;

//   shared = buildClient();
//   shared.activate();
//   return shared;
// }

// function teardownIfUnused() {
//   if (mounts > 0) return;

//   const client = shared;
//   shared = null;

//   for (const r of subs) {
//     try {
//       r.sub?.unsubscribe();
//     } catch {}
//   }
//   subs.clear();

//   try {
//     client?.deactivate();
//   } catch {}

//   emitReady(false);
// }

// export function useStompClient(): UseStompClientResult {
//   const [isReady, setIsReady] = useState(sharedReady || !!shared?.connected);

//   useEffect(() => {
//     mounts += 1;
//     ensureClient();

//     const listener = (ready: boolean) => setIsReady(ready);
//     readyListeners.add(listener);

//     // 초기 동기화
//     setIsReady(sharedReady || !!shared?.connected);

//     return () => {
//       readyListeners.delete(listener);
//       mounts -= 1;
//       teardownIfUnused();
//     };
//   }, []);

//   const subscribe = useCallback((destination: string, handler: MessageHandler) => {
//     const client = ensureClient();

//     const rec: SubRecord = { destination, handler, active: true };
//     subs.add(rec);

//     if (client.connected) {
//       rec.sub = client.subscribe(destination, handler);
//     }
//     // 연결 전이면 onConnect에서 자동 구독

//     return () => {
//       rec.active = false;
//       try {
//         rec.sub?.unsubscribe();
//       } catch {}
//       subs.delete(rec);
//     };
//   }, []);

//   const send = useCallback((destination: string, body: unknown) => {
//     const client = ensureClient();

//     if (!client.connected) {
//       console.warn("[STOMP] send blocked: not connected");
//       return;
//     }

//     client.publish({
//       destination,
//       body: JSON.stringify(body),
//     });
//   }, []);

//   return useMemo(() => ({ isReady, subscribe, send }), [isReady, subscribe, send]);
// }

import { useCallback, useEffect, useMemo, useState } from "react";
import { Client, type IMessage, type StompSubscription, type IFrame } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const RAW_WS_URL = import.meta.env.VITE_WS_URL ?? "/ws/chat";

type MessageHandler = (msg: IMessage) => void;

export interface UseStompClientResult {
  isReady: boolean;
  myUserId: number | null; // ✅ 추가
  subscribe: (destination: string, handler: MessageHandler) => () => void;
  send: (destination: string, body: unknown) => void;
}

type SubRecord = {
  destination: string;
  handler: MessageHandler;
  sub?: StompSubscription;
  active: boolean;
};

// module singleton (중복 연결 방지)
let shared: Client | null = null;
let sharedReady = false;
let sharedMyUserId: number | null = null; // ✅ 추가
let mounts = 0;

const readyListeners = new Set<(ready: boolean) => void>();
const myUserIdListeners = new Set<(id: number | null) => void>(); // ✅ 추가
const subs = new Set<SubRecord>();

function emitReady(next: boolean) {
  sharedReady = next;
  for (const fn of readyListeners) fn(next);
}

function emitMyUserId(next: number | null) {
  sharedMyUserId = next;
  for (const fn of myUserIdListeners) fn(next);
}

function normalizeSockJsUrl(url: string) {
  // SockJS는 ws/wss 스킴을 직접 못 씀 → http/https로 바꿔야 함
  if (url.startsWith("ws://")) return "http://" + url.slice("ws://".length);
  if (url.startsWith("wss://")) return "https://" + url.slice("wss://".length);
  return url; // "/ws/chat" 같은 상대경로 or "http(s)://..."
}

function parseMyUserIdFromHeaders(headers: Record<string, string>) {
  // 서버 로그에 user-name: 1 이 보였으니 최우선
  const raw =
    headers["user-name"] ?? headers["userName"] ?? headers["user-id"] ?? headers["userId"];

  if (!raw) return null;

  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

function buildClient(): Client {
  const sockUrl = normalizeSockJsUrl(RAW_WS_URL);

  const client = new Client({
    // ✅ SockJS 서버는 brokerURL 쓰면 안 됨 (순수 WebSocket 열어버림)
    brokerURL: undefined,

    // ✅ SockJS로만 연결
    webSocketFactory: () =>
      new SockJS(sockUrl, undefined, {
        transports: ["websocket", "xhr-streaming", "xhr-polling"],
        // 쿠키 기반 인증이면 필요할 수 있음(프록시/서버 설정에 따라)
        // withCredentials: true,
      } as any),

    reconnectDelay: 3000,
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,

    debug: (str) => {
      if (import.meta.env.DEV) console.log("[STOMP]", str);
    },

    // ✅ CONNECTED 프레임에서 user-name 파싱
    onConnect: (frame: IFrame) => {
      emitReady(true);

      const myId = parseMyUserIdFromHeaders((frame.headers ?? {}) as Record<string, string>);
      if (myId != null) emitMyUserId(myId);

      // 연결되면 밀린 구독 flush
      for (const r of subs) {
        if (!r.active) continue;
        if (!r.sub) r.sub = client.subscribe(r.destination, r.handler);
      }
    },

    onWebSocketClose: () => {
      // 재연결 시 재구독 되도록 핸들 제거
      for (const r of subs) r.sub = undefined;
      emitReady(false);
      // 보통은 재연결 동안 myUserId 유지해도 OK.
      // 필요하면 아래 주석 해제해서 끊길 때 null로 초기화 가능
      // emitMyUserId(null);
    },

    onStompError: (frame) => {
      console.error("[STOMP] stomp error:", frame.headers, frame.body);
    },

    onWebSocketError: (evt) => {
      console.error("[STOMP] websocket error", evt);
    },
  });

  return client;
}

function ensureClient() {
  if (!shared) {
    shared = buildClient();
  }
  // ✅ 이미 만들어진 client가 deactivate 상태면 다시 activate 필요
  if (!shared.active) {
    shared.activate();
  }
  return shared;
}

function teardownIfUnused() {
  if (mounts > 0) return;

  const client = shared;
  shared = null;

  for (const r of subs) {
    try {
      r.sub?.unsubscribe();
    } catch {}
  }
  subs.clear();

  try {
    client?.deactivate();
  } catch {}

  emitReady(false);
  emitMyUserId(null);
}

export function useStompClient(): UseStompClientResult {
  const [isReady, setIsReady] = useState(sharedReady);
  const [myUserId, setMyUserId] = useState<number | null>(sharedMyUserId);

  useEffect(() => {
    mounts += 1;
    ensureClient();

    const readyListener = (ready: boolean) => setIsReady(ready);
    const idListener = (id: number | null) => setMyUserId(id);

    readyListeners.add(readyListener);
    myUserIdListeners.add(idListener);

    setIsReady(sharedReady);
    setMyUserId(sharedMyUserId);

    return () => {
      readyListeners.delete(readyListener);
      myUserIdListeners.delete(idListener);
      mounts -= 1;
      teardownIfUnused();
    };
  }, []);

  const subscribe = useCallback((destination: string, handler: MessageHandler) => {
    const client = ensureClient();

    const rec: SubRecord = { destination, handler, active: true };
    subs.add(rec);

    if (client.connected) {
      rec.sub = client.subscribe(destination, handler);
    }

    return () => {
      rec.active = false;
      try {
        rec.sub?.unsubscribe();
      } catch {}
      subs.delete(rec);
    };
  }, []);

  const send = useCallback((destination: string, body: unknown) => {
    const client = ensureClient();

    if (!client.connected) {
      console.warn("[STOMP] send blocked: not connected");
      return;
    }

    client.publish({
      destination,
      body: JSON.stringify(body),
      headers: { "content-type": "application/json" },
    });
  }, []);

  return useMemo(
    () => ({ isReady, myUserId, subscribe, send }),
    [isReady, myUserId, subscribe, send],
  );
}
