import { ChatList } from "@/pages/chat/components/ChatList";
import BottomNav from "@/components/navigation/bottom-nav";

export default function ChatListPage() {
  return (
    <div className="relative h-full">
      <ChatList />
      <div className="fixed bottom-0 left-1/2 z-50 w-full max-w-[375px] -translate-x-1/2">
        <BottomNav />
      </div>
    </div>
  );
}
