import { ChevronLeft } from "lucide-react";

export default function TopNav({ onBack }: { onBack?: () => void }) {
  return (
    // <header className="px-5 pt-4">
    //   <button
    //     type="button"
    //     onClick={onBack}
    //     className="inline-flex h-10 w-10 items-center justify-center rounded-full active:bg-neutral-100"
    //     aria-label="뒤로가기"
    //   >
    //     <ChevronLeft className="h-6 w-6 text-neutral-800" />
    //   </button>
    // </header>

    <header className="app-header flex h-[44px] items-center bg-white px-4">
      <button onClick={onBack} aria-label="뒤로가기">
        <ChevronLeft className="h-[24px] w-[24px]" />
      </button>
      {/* <h1 className="pre_title_semi_20">찜목록</h1> */}
    </header>
  );
}
