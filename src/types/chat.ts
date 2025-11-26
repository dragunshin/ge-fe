export type ChatroomType = "MESSAGE" | "VIDEO" | "NOTICE";

export interface ExpertSummary {
  userId: number;
  nickname: string;
  categoryName: string;
}

export interface MemberSummary {
  userId: number;
  nickname: string;
}

export interface Chatroom {
  chatroomId: number;
  consultationId: number;
  chatroomType: ChatroomType;
  expert: ExpertSummary;
  member: MemberSummary;
  createdAt: string;
}

export type MessageType = "TEXT" | "SOLUTION" | "QUESTION" | "SYSTEM";

export interface ChatMessage {
  id: string;
  chatroomId: number;
  senderId: string;
  content: string;
  messageType: MessageType;
  relatedId?: number | null;
  createdAt: string; // ISO
}

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}
