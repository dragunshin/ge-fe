import { useCallback, useEffect, useMemo, useState } from "react";
import { Client, type IMessage, type StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const WS_URL = import.meta.env.VITE_WS_URL ?? "https://api.menual.site/ws/chat";

type MessageHandler = (msg: IMessage) => void;

export interface UseStompClientResult {
  isReady: boolean;
  subscribe: (destination: string, handler: MessageHandler) => () => void;
  send: (destination: string, body: unknown) => void;
}

type SubRecord = {
  destination: string;
  handler: MessageHandler;
  sub?: StompSubscription;
  active: boolean;
};

// module singleton 중복 연결 방지
let shared: Client | null = null;
let sharedReady = false;
let mounts = 0;

const readyListeners = new Set<(ready: boolean) => void>();
const subs = new Set<SubRecord>();

function emitReady(next: boolean) {
  sharedReady = next;
  for (const fn of readyListeners) fn(next);
}

function buildClient(): Client {
  const isSockJsUrl = WS_URL.startsWith("http://") || WS_URL.startsWith("https://");

  const client = new Client({
    // SockJS 서버면 brokerURL 대신 webSocketFactory 사용
    brokerURL: isSockJsUrl ? undefined : WS_URL,
    webSocketFactory: isSockJsUrl
      ? () =>
          new SockJS(WS_URL, undefined, {
            withCredentials: true,
            transports: ["websocket", "xhr-streaming", "xhr-polling"],
          } as any)
      : undefined,

    reconnectDelay: 3000,
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,

    debug: (str) => {
      if (import.meta.env.DEV) console.log("[STOMP]", str);
    },

    onConnect: () => {
      emitReady(true);

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
  if (shared) return shared;

  shared = buildClient();
  shared.activate();
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
}

export function useStompClient(): UseStompClientResult {
  const [isReady, setIsReady] = useState(sharedReady);

  useEffect(() => {
    mounts += 1;
    ensureClient();

    const listener = (ready: boolean) => setIsReady(ready);
    readyListeners.add(listener);
    setIsReady(sharedReady);

    return () => {
      readyListeners.delete(listener);
      mounts -= 1;
      teardownIfUnused();
    };
  }, []);

  const subscribe = useCallback((destination: string, handler: MessageHandler) => {
    const client = ensureClient();

    const rec: SubRecord = { destination, handler, active: true };
    subs.add(rec);

    // 이미 연결돼 있으면 바로 SUBSCRIBE
    if (client.connected) {
      rec.sub = client.subscribe(destination, handler);
    }
    // 아니면 onConnect에서 자동 구독

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
    });
  }, []);

  return useMemo(() => ({ isReady, subscribe, send }), [isReady, subscribe, send]);
}
