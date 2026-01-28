//import { ChevronLeft } from "lucide-react";
import Back from "@/images/login/back.svg?react";

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

    <header className="sticky top-0 z-50 flex items-center bg-white ml-1 mt-4 mb-1">
      <button onClick={onBack} className="mx-4 my-[18px]">
        <Back className="w-[18px] h-[18px]" />
      </button>
      {/* <h1 className="pre_title_semi_20">찜목록</h1> */}
    </header>
  );
}
