import type { ChatMessage, ChatRoomListItem } from "@/types/chat";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

// export async function fetchChatMessages(roomId: number): Promise<ChatMessage[]> {
//   const res = await fetch(`${API_BASE}/chatrooms/${roomId}/messages`, {
//     method: "GET",
//     credentials: "include",
//     headers: { Accept: "application/json" },
//   });
//   if (!res.ok) {
//     throw new Error("Failed to fetch messages");
//   }
//   const data = await res.json();

//   return data as ChatMessage[];
// }

export async function fetchChatMessages(roomId: number): Promise<ChatMessage[]> {
  const res = await fetch(`${API_BASE}/chat/room/${roomId}/messages`, {
    method: "GET",
    credentials: "include",
    headers: { Accept: "application/json" },
  });

  // 이력이 없어서 204인 경우
  if (res.status === 204) return [];

  // 응답 바디가 없을 수도 있으
  const json = await res.json().catch(() => null);

  // "처음이라 없음"을 404로 주면
  if (res.status === 404) return [];

  if (!res.ok) {
    const msg =
      (json && typeof json === "object" && "message" in (json as any) && (json as any).message) ||
      `Failed to fetch messages (${res.status})`;
    throw new Error(String(msg));
  }

  if (Array.isArray(json)) return json as ChatMessage[];
  if (
    json &&
    typeof json === "object" &&
    "data" in (json as any) &&
    Array.isArray((json as any).data)
  ) {
    return (json as any).data as ChatMessage[];
  }

  return [];
}

type ChatroomType = "MESSAGE" | "VIDEO" | "NOTICE";

type ApiResponse<T> = {
  statusCode: number;
  message: string;
  data: T;
};

export type ChatroomUserSummary = {
  userId: number;
  nickname: string;
  categoryName?: string; // member에는 없을 수 있으니 optional
};

export type CreateChatroomResponse = {
  chatroomId: number;
  consultationId: number;
  chatroomType: ChatroomType;
  expert: ChatroomUserSummary; // categoryName 포함
  member: ChatroomUserSummary; // categoryName 없을 수 있음
  createdAt: string;
};

// export async function createChatroom(consultationId: number, chatroomType: ChatroomType) {
//   const res = await fetch(`${API_BASE}/chat/room`, {
//     method: "POST",
//     credentials: "include",
//     headers: { "Content-Type": "application/json", Accept: "application/json" },
//     //body: JSON.stringify({ chatroomType }),
//     body: JSON.stringify({ consultationId, chatroomType }),
//   });

//   const json = (await res.json().catch(() => null)) as ApiResponse<CreateChatroomResponse> | null;

//   if (!res.ok || !json) throw new Error(json?.message ?? "Failed to create chatroom");
//   return json.data;
// }

export async function fetchChatRooms(): Promise<ChatRoomListItem[]> {
  const res = await fetch(`${API_BASE}/chat/room`, {
    method: "GET",
    credentials: "include",
    headers: { Accept: "application/json" },
  });

  const json = (await res.json().catch(() => null)) as ApiResponse<ChatRoomListItem[]> | null;
  if (!res.ok || !json) throw new Error(json?.message ?? "Failed to fetch chat rooms");
  return json.data;
}
