"use client";

import { useMemo } from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { ChevronRight } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type ExpertProfileHeaderProps = {
  name: string; // store만들 때까지
};

export function ChatExpertHeader({ name }: ExpertProfileHeaderProps) {
  //   const { currentRoomId, messagesByRoom } = useChatStore((state) => ({
  //     currentRoomId: state.currentRoomId,
  //     messagesByRoom: state.messagesByRoom,
  //   }));

  //   const formattedDate = useMemo(() => {
  //     if (!currentRoomId) return ""; // 방이 없으면 날짜 표시 X

  //     const key = String(currentRoomId);
  //     const messages = messagesByRoom[key] ?? [];

  //     if (messages.length === 0) return "";

  //     // 마지막 메시지 기준으로 날짜 계산 (원하면 첫 번째로 바꿔도 됨)
  //     const lastMessage = messages[messages.length - 1];
  //     const date = new Date(lastMessage.createdAt);

  //     return format(date, "yyyy년 M월 d일 EEEE", { locale: ko });
  //   }, [currentRoomId, messagesByRoom]);

  const formattedDate = format("2025-11-22T01:41:10.3621861", "yyyy년 M월 d일 EEEE", {
    locale: ko,
  });

  return (
    <section className="flex flex-col items-center gap-3 pt-5 pb-3">
      {/* 아바타 원형 */}
      <Avatar className="h-[96px] w-[96px]">
        {/* <AvatarImage src="/some-profile.png" alt={name} /> */}
        <AvatarFallback className="bg-neutral-200" />
      </Avatar>

      <div className="flex flex-col items-center gap-1">
        <h1 className="text-[18px] font-semibold text-black">{name}</h1>

        <button type="button" className="inline-flex items-center gap-1 text-[#878a93]">
          <span className="text-[16px] text-[#878a93]">전문가 프로필 보기</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {formattedDate && (
        <div className="mt-4 inline-flex items-center justify-center rounded-[20px] bg-[#f4f4f5] px-6 py-2">
          <span className="text-[13px] text-[#656870]">{formattedDate}</span>
        </div>
      )}
    </section>
  );
}
