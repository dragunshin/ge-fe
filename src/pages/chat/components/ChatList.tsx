"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

type ChatItem = {
  id: string;
  name: string;
  tag: string;
  preview: string;
  timeLabel: string;
  unreadCount?: number;
};

const MOCK_CHATS: ChatItem[] = [
  {
    id: "1",
    name: "전문가 이름",
    tag: "메이크업",
    preview:
      "김바보님을 위한 솔루션지가 도착했어요. 24시간 내에 전문가님께 질문이 가능하며 시간이 지나면...",
    timeLabel: "어제",
    unreadCount: 1,
  },
  {
    id: "2",
    name: "MENUAL",
    tag: "메이크업",
    preview:
      "김바보님을 위한 솔루션지가 도착했어요. 24시간 내에 전문가님께 질문이 가능하며 시간이 지나면...",
    timeLabel: "어제",
    unreadCount: 1,
  },
  {
    id: "3",
    name: "전문가 이름",
    tag: "메이크업",
    preview:
      "김바보님을 위한 솔루션지가 도착했어요. 24시간 내에 전문가님께 질문이 가능하며 시간이 지나면...",
    timeLabel: "어제",
    unreadCount: 1,
  },
  {
    id: "4",
    name: "전문가 이름",
    tag: "메이크업",
    preview:
      "김바보님을 위한 솔루션지가 도착했어요. 24시간 내에 전문가님께 질문이 가능하며 시간이 지나면...",
    timeLabel: "어제",
    unreadCount: 1,
  },
  {
    id: "5",
    name: "전문가 이름",
    tag: "메이크업",
    preview:
      "김바보님을 위한 솔루션지가 도착했어요. 24시간 내에 전문가님께 질문이 가능하며 시간이 지나면...",
    timeLabel: "어제",
    unreadCount: 1,
  },
];

const FILTERS = ["전체", "메시지 상담", "화상 상담", "안 읽음"] as const;
type Filter = (typeof FILTERS)[number];

export function ChatList() {
  const [activeFilter, setActiveFilter] = React.useState<Filter>("전체");

  return (
    <div className="flex w-full justify-center bg-white py-6">
      {/* 아이폰 화면 박스 */}
      <div className="flex flex-col ">
        {/* 상단 여백 + 헤더 */}
        <header className="px-5 pt-5 pb-3">
          {/* 상단 시간/노치 영역은 생략하고 텍스트 헤더만 */}
          <h1 className="text-[20px] font-semibold">채팅</h1>

          {/* 필터 탭 (칩 형태) */}
          <div className="mt-3 mb-4 flex gap-2">
            {FILTERS.map((filter) => {
              const isActive = filter === activeFilter;
              return (
                <Button
                  key={filter}
                  type="button"
                  size="sm"
                  variant="outline"
                  className={
                    "h-8 rounded-full px-3 text-[13px]" +
                    (isActive
                      ? " border-transparent bg-slate-900 text-white"
                      : " border-slate-200 bg-white text-slate-700")
                  }
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </Button>
              );
            })}
          </div>
        </header>

        {/* 리스트 영역 */}
        <ScrollArea className="flex-1 px-5 pb-5">
          <ul className="space-y-6">
            {MOCK_CHATS.map((chat) => (
              <li key={chat.id} className="flex items-center gap-3 rounded-2xl bg-transparent">
                {/* 아바타 */}
                <Avatar className="h-[56px] w-[56px]">
                  {/* 이미지가 있다면 AvatarImage 사용 */}
                  <AvatarFallback className="bg-gray-200" />
                </Avatar>

                {/* 중앙 텍스트 영역 */}
                <div className="flex flex-1 flex-col justify-center">
                  <div className="flex items-center gap-2">
                    <span className="text-[15px] font-semibold text-slate-900">{chat.name}</span>
                    <Badge
                      variant="outline"
                      className="rounded-[4px] border-none bg-[#E3F1FF] px-1.5 py-0 text-[11px] font-medium text-[#2F80FF]"
                    >
                      {chat.tag}
                    </Badge>
                  </div>
                  <p className="mt-1 line-clamp-2 text-[12px] leading-snug text-slate-500">
                    {chat.preview}
                  </p>
                </div>

                {/* 오른쪽 시간 + 읽지 않은 개수 */}
                <div className="flex flex-col items-end justify-center gap-2 pl-2">
                  <span className="text-[11px] text-slate-400">{chat.timeLabel}</span>
                  {chat.unreadCount && chat.unreadCount > 0 && (
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#2F80FF]">
                      <span className="text-[11px] font-semibold text-white">
                        {chat.unreadCount}
                      </span>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </div>
    </div>
  );
}

import * as React from "react";
