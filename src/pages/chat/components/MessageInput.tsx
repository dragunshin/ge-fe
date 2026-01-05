// "use client";

// import { useCallback, useState } from "react";
// import { Plus } from "lucide-react";
// import { Button } from "@/components/ui/button";

// interface MessageInputProps {
//   onSend: (text: string) => void;
//   disabled?: boolean;
// }

// export function MessageInput({ onSend, disabled }: MessageInputProps) {
//   const [value, setValue] = useState("");

//   // 로직 유지(현재 코드 그대로)
//   const canSend = true;

//   const handleSend = useCallback(() => {
//     const text = value.trim();
//     onSend(text);
//     setValue("");
//     console.log(disabled);
//   }, [canSend, onSend, value]);

//   return (
//     <footer className="shrink-0 border-t border-[#E5E5EA] bg-white px-4 py-3">
//       <div className="flex items-center gap-3">
//         <Button
//           type="button"
//           className="h-9 w-9 rounded-full border border-[#E5E5EA] bg-[#F2F2F7] p-0 hover:bg-[#EAEAEE]"
//           onClick={() => {
//             // TODO: 첨부/추가 액션
//           }}
//         >
//           <Plus className="h-5 w-5 text-[#8E8E93]" />
//         </Button>

//         <input
//           value={value}
//           onChange={(e) => setValue(e.target.value)}
//           placeholder="내용을 입력하세요"
//           onKeyDown={(e) => {
//             if (e.key === "Enter" && !e.shiftKey) {
//               e.preventDefault();
//               handleSend();
//             }
//           }}
//           className="flex-1 bg-transparent px-1 py-2 text-[14px] text-black outline-none placeholder:text-[#B0B3BA] disabled:cursor-not-allowed disabled:opacity-60"
//         />

//         <Button
//           type="button"
//           onClick={handleSend}
//           className={[
//             "h-9 w-[60px] rounded-[10px] px-0 text-[13px] font-semibold text-white",
//             canSend ? "bg-[#8E8E93] hover:bg-[#7B7E86]" : "bg-[#C9CBD1] cursor-not-allowed",
//           ].join(" ")}
//         >
//           전송
//         </Button>
//       </div>
//     </footer>
//   );
// }

"use client";

import { useCallback, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MessageInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export function MessageInput({ onSend, disabled }: MessageInputProps) {
  const [value, setValue] = useState("");
  const [isComposing, setIsComposing] = useState(false);

  const canSend = true;

  const handleSend = useCallback(() => {
    const text = value.trim();
    if (!text) return; // 빈 값 방지
    onSend(text);
    setValue("");
    console.log(disabled);
  }, [onSend, value, disabled]);

  return (
    <footer className="shrink-0 border-t border-[#E5E5EA] bg-white px-4 py-3">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          className="h-6 w-6 rounded-full bg-[#F4F4F5] p-0 hover:bg-[#EAEAEE]"
          onClick={() => {}}
        >
          <Plus className="h-4 w-4 text-[#878a93]" />
        </Button>

        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="내용을 입력하세요"
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          onKeyDown={(e) => {
            // 한글 조합 중복 이슈
            if (e.key === "Enter" && !e.shiftKey) {
              if (isComposing || (e.nativeEvent as any).isComposing) return;
              e.preventDefault();
              handleSend();
            }
          }}
          className="flex-1 bg-transparent px-1 py-2 pre_body_med_14 text-black outline-none placeholder:text-[#656870] disabled:cursor-not-allowed disabled:opacity-60"
        />

        <Button
          type="button"
          onClick={handleSend}
          className={[
            "h-[34px] w-[57px] rounded-[8px] px-0 pre_body_semi_13 text-white",
            canSend ? "bg-[#181818] hover:bg-[#7B7E86]" : "bg-[#C9CBD1] cursor-not-allowed",
          ].join(" ")}
        >
          전송
        </Button>
      </div>
    </footer>
  );
}
