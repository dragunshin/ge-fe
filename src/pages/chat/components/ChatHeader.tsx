import { useNavigate } from "react-router-dom";
import BackIcon from "@/images/login/back.svg?react";
import More from "@/images/chat/more.svg?react";
import { ChatExpertHeader } from "./ChatExpertHeader";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Minho from "@/images/chat/minho.png";

export default function ChatHeader() {
  const navigate = useNavigate();

  return (
    <div className="bg-white mt-2">
      <header className="px-4 pt-3 pb-3 mb-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button
              onClick={() => navigate(-1)}
              className="-ml-2 grid h-9 w-9 place-items-center rounded-full active:bg-black/5"
              aria-label="뒤로가기"
              type="button"
            >
              <BackIcon className="h-4 w-4 text-black" />
            </button>

            <Avatar className="h-9 w-9 mr-1">
              {/* <AvatarFallback className="bg-neutral-200 text-[12px] font-semibold text-neutral-700">
                용
              </AvatarFallback> */}
              <img src={Minho} alt="용민호 전문가" className="h-full w-full object-cover" />
            </Avatar>

            <div className="flex flex-col leading-tight">
              <span className="pre_subtitle_semi_16 text-black">용민호 전문가</span>
              <span className="mt-[2px] pre_body_med_12 text-[#878a93]">헤어</span>
            </div>
          </div>

          <button
            type="button"
            className="-mr-2 grid color-[#292a2d] place-items-center rounded-full active:bg-black/5"
            aria-label="더보기"
          >
            <More className="h-6 w-6 text-[#292a2d]" />
          </button>
        </div>
      </header>

      {/* 날짜 구분선*/}
      <ChatExpertHeader />
    </div>
  );
}
