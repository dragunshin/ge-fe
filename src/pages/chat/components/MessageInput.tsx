"use client";

import { useCallback, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MessageInputProps {
  onSend: (text: string) => void;
  disabled?: boolean; // 연결 안 됐을 때 등
}

export function MessageInput({ onSend, disabled }: MessageInputProps) {
  const [value, setValue] = useState("");

  //const canSend = !disabled && value.trim().length > 0;

  const canSend = true;

  const handleSend = useCallback(() => {
    // if (!canSend) return;
    const text = value.trim();
    onSend(text);
    setValue("");
  }, [canSend, onSend, value]);

  return (
    <footer className="shrink-0 flex items-center gap-3 border-t border-slate-200 bg-white px-4 py-3">
      {/* + 버튼 (추후 첨부/기능 확장용) */}
      <Button
        type="button"
        className="h-6 w-6 rounded-full bg-[#f4f4f5] p-0 hover:bg-[#cfd2d8]"
        onClick={() => {
          // TODO: 첨부/추가 액션
        }}
      >
        <Plus className="h-6 w-6 text-slate-500" />
      </Button>

      {/* 입력 */}
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="내용을 입력하세요"
        //  disabled={disabled}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
        className="flex-1 rounded-md bg-transparent px-2 py-1 text-[14px] text-slate-900 outline-none placeholder:text-slate-500 disabled:cursor-not-allowed disabled:opacity-60"
      />

      {/* 전송 버튼 */}
      <Button
        type="button"
        onClick={handleSend}
        //  disabled={!canSend}
        className={[
          "h-[34px] w-[57px] rounded-[8px] px-[17px] py-[8px] text-[13px] font-semibold text-white",
          canSend ? "bg-[#878a93] hover:bg-[#70747b]" : "bg-[#c9cbd1] cursor-not-allowed",
        ].join(" ")}
      >
        전송
      </Button>
    </footer>
  );
}
