import { useLocation, useNavigate } from "react-router-dom";
import { BatteryFull, ChevronLeft, MoreVertical, SignalHigh, Wifi } from "lucide-react";
import BackIcon from "@/images/login/back.svg?react";
import More from "@/images/chat/more.svg?react";
import { Button } from "@/components/ui/button";
import { ChatExpertHeader } from "./ChatExpertHeader";

type ChatHeaderState = {
  title?: string;
  subtitle?: string;
};

export default function ChatHeader() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex flex-col">
      <header className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={() => navigate(-1)} className="mr-2">
              {/* <img src={backIcon} alt="back" className="w-2.5 h-[18px]" /> */}
              <BackIcon className="h-4 w-4 text-black" />
            </button>
            <div className="flex flex-col">
              <span className="text-[16px] font-semibold text-black">박오징</span>
              <span className="text-[12px] text-[#878A93]">패션</span>
            </div>
          </div>

          {/* <Button type="button" variant="ghost" className="h-6 w-6 p-0">
            <More className="h-6 w-6 text-black" />
          </Button> */}
          <More className="h-6 w-6 text-black" />
        </div>
      </header>
      <ChatExpertHeader name="박오징" />
    </div>
  );
}
