import type { ChatMessage } from "@/types/chat";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

export async function fetchChatMessages(roomId: number): Promise<ChatMessage[]> {
  const res = await fetch(`${API_BASE}/api/chatrooms/${roomId}/messages`);
  if (!res.ok) {
    throw new Error("Failed to fetch messages");
  }
  const data = await res.json();
  // 백엔드 응답이 바로 ChatMessage[] 형태면 그대로 반환
  return data as ChatMessage[];
}
