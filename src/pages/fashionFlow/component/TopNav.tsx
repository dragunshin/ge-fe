import { ChevronLeft } from "lucide-react";

export default function TopNav({ onBack }: { onBack?: () => void }) {
  return (
    <header className="app-header sticky top-0 z-20 bg-white">
      <div className="flex h-[44px] items-center px-4">
        <button onClick={onBack} aria-label="뒤로가기">
          <ChevronLeft className="h-[24px] w-[24px]" />
        </button>
      </div>
    </header>
  );
}
