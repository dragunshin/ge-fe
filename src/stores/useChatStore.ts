import { create } from "zustand";

export type MessageType = "TEXT" | "SOLUTION" | "QUESTION" | "SYSTEM";

export interface ChatMessage {
  id: string;
  chatroomId: number;
  senderId: string;
  content: string;
  messageType: MessageType;
  relatedId?: number | null;
  createdAt?: string;
}

interface ChatState {
  isConnected: boolean;
  currentRoomId: number | null;
  messagesByRoom: Record<string, ChatMessage[]>;

  setConnected: (connected: boolean) => void;
  setCurrentRoom: (roomId: number | null) => void;

  addMessage: (msg: ChatMessage) => void;
  setInitialMessages: (roomId: number, messages: ChatMessage[]) => void;
  clearRoomMessages: (roomId: number) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  isConnected: false,
  currentRoomId: null,
  messagesByRoom: {},

  setConnected: (connected) => set({ isConnected: connected }),
  setCurrentRoom: (roomId) => set({ currentRoomId: roomId }),

  setInitialMessages: (roomId, messages) => {
    const key = String(roomId);
    set((state) => ({
      messagesByRoom: {
        ...state.messagesByRoom,
        [key]: messages,
      },
    }));
  },

  addMessage: (msg) => {
    const key = String(msg.chatroomId);
    const prev = get().messagesByRoom[key] ?? [];
    set((state) => ({
      messagesByRoom: {
        ...state.messagesByRoom,
        [key]: [...prev, msg],
      },
    }));
  },

  clearRoomMessages: (roomId) => {
    const key = String(roomId);
    const { [key]: _, ...rest } = get().messagesByRoom;
    set({ messagesByRoom: rest });
  },
}));
