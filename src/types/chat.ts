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

// export type MessageType = "TEXT" | "SOLUTION" | "QUESTION" | "SYSTEM";

// export type ChatMessage = {
//   messageId: number;
//   chatroomId: number;
//   senderId: number;
//   senderRole: "MEMBER" | "EXPERT" | "MENUAL";
//   messageType: "TEXT" | "IMAGE" | "QUESTION" | "SOLUTION" | "SYSTEM";
//   content: string;
//   relatedId: number | null;
//   createdAt: string;
// };

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

export type MessageType = "TEXT" | "IMAGE" | "QUESTION" | "SOLUTION" | "SYSTEM";
export type SenderRole = "MEMBER" | "MENUAL" | "EXPERT";

export type ChatMessage = {
  messageId: number;
  chatroomId: number;
  senderId: number;
  senderRole: SenderRole;
  messageType: MessageType;
  content: string;
  relatedId: number | null;
  createdAt: string;
};

export type SocketResponse<T> = {
  eventType: string;
  chatroomId: number;
  payload: T;
};
