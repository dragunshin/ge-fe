import { Plus } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import ChatHeader from "./ChatHeader";

export function ChatRoom() {
  return (
    <div className="flex w-full justify-center bg-[#E3F1FF] py-6">
      {/* 아이폰 화면 박스 */}
      <div className="flex h-[812px] w-[375px] flex-col rounded-3xl bg-white shadow-xl overflow-hidden">
        {/* 상단 상태바는 생략, 헤더만 구현 */}
        <ChatHeader />

        {/* 프로필 영역 */}
        <section className="flex flex-col items-center px-6 pt-4 pb-5">
          <Avatar className="h-[96px] w-[96px]">
            <AvatarFallback className="bg-[#D8D8D8]" />
          </Avatar>

          <div className="mt-4 text-[17px] font-semibold text-black">박오징</div>
          <button className="mt-1 text-[12px] text-[#8E8E93]">전문가 프로필 보기 &gt;</button>

          <div className="mt-5 rounded-full bg-[#F2F2F7] px-4 py-1">
            <span className="text-[12px] text-[#8E8E93]">2025년 11월 9일 일요일</span>
          </div>
        </section>

        {/* 채팅 영역 */}
        <main className="flex-1 space-y-4 px-16 pb-4 pt-1">
          {/* 내 메시지 1: 고민지 도착 + 버튼 */}
          <div className="flex justify-end">
            <div className="max-w-[260px] rounded-2xl bg-[#2F80FF] px-12 py-3 text-[13px] leading-relaxed text-white">
              <p>김바보님을 위한 고민지가 도착했습니다.</p>
              <button className="mt-3 w-full rounded-xl bg-white py-6 text-[13px] font-semibold text-black">
                고민지 보기
              </button>
            </div>
          </div>

          {/* 상대 메시지: 솔루션지 도착 + 버튼 */}
          <div className="flex items-start gap-2">
            <Avatar className="mt-6 h-8 w-8">
              <AvatarFallback className="bg-[#D8D8D8]" />
            </Avatar>
            <div className="max-w-[260px] rounded-2xl bg-[#F5F5F8] px-4 py-3 text-[13px] leading-relaxed text-black">
              <p>김바보님을 위한 솔루션지가 도착했습니다.</p>
              <button className="mt-3 w-full rounded-xl bg-white py-6 text-[13px] font-semibold text-black">
                솔루션지 보기
              </button>
            </div>
          </div>

          {/* 내 메시지 2 */}
          <div className="flex justify-end">
            <div className="max-w-[260px] rounded-2xl bg-[#2F80FF] px-4 py-3 text-[13px] leading-relaxed text-white">
              김바보님이 추가 질문을 보냈습니다.
            </div>
          </div>

          {/* 내 메시지 3 (멀티라인) */}
          <div className="flex justify-end">
            <div className="max-w-[260px] rounded-2xl bg-[#2F80FF] px-4 py-3 text-[13px] leading-relaxed text-white whitespace-pre-line">
              제가 왜 깜마른이에요? 그리고 그런 옷 입으면 더 말라보이는거 아니에요? 이론 옷은 안
              돼요?
            </div>
          </div>
        </main>

        {/* 하단 입력 영역 */}
        <footer className="border-t border-[#E5E5EA] bg-white px-4 pb-4 pt-3">
          <div className="mb-2 flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full bg-[#F2F2F7] p-0"
            >
              <Plus className="h-4 w-4 text-[#8E8E93]" />
            </Button>

            <div className="flex-1 rounded-full bg-[#F2F2F7] px-4 py-2 text-[13px] text-[#8E8E93]">
              내용을 입력하세요
            </div>

            <Button
              type="button"
              className="h-8 rounded-full bg-[#C7C7CC] px-4 text-[13px] font-semibold text-white"
            >
              전송
            </Button>
          </div>

          {/* 홈 인디케이터(검은 바) */}
          <div className="mt-1 flex justify-center">
            <div className="h-1.5 w-24 rounded-full bg-black" />
          </div>
        </footer>
      </div>
    </div>
  );
}
