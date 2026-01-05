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

export type LastMessageType = "TEXT" | "IMAGE" | "MIXED" | "QUESTION" | "SOLUTION" | "SYSTEM";

export type ChatRoomListItem = {
  chatroomId: number;
  consultationId: number;
  chatroomType: ChatroomType;
  opponentId: number;
  opponentNickname: string;
  opponentProfileImage?: string | null;
  expertCategory?: string | null;
  lastMessage?: string | null;
  lastMessageAt?: string | null; // 서버가 null 가능
  createdAt: string;
  unreadCount?: number;
  lastMessageType?: LastMessageType; // 명세서에 있다고 했으니 optional
};
