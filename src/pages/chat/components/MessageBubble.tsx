// "use client";

// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import type { ChatMessage } from "@/types/chat";

// type Props = {
//   message: ChatMessage;
//   myUserId?: number;
// };

// export function MessageBubble({ message, myUserId }: Props) {
//   const isMine = myUserId != null && message.senderId === myUserId;

//   const isCard = message.messageType === "QUESTION" || message.messageType === "SOLUTION";

//   const actionLabel =
//     message.messageType === "QUESTION"
//       ? "고민지 보기"
//       : message.messageType === "SOLUTION"
//         ? "솔루션지 보기"
//         : undefined;

//   const baseBubble = "max-w-[80%] rounded-[20px] px-4 py-3 text-[13px] leading-relaxed";

//   if (isMine) {
//     return (
//       <div className="flex justify-end">
//         <div className={`${baseBubble} bg-[#2F80FF] text-white shadow-sm`}>
//           <p className="whitespace-pre-line">{message.content}</p>
//           {isCard && actionLabel && (
//             <button
//               type="button"
//               className="mt-3 w-full rounded-xl bg-white py-3 text-[13px] font-semibold text-[#2F80FF]"
//             >
//               {actionLabel}
//             </button>
//           )}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex items-start gap-2">
//       <Avatar className="mt-1 h-8 w-8 bg-[#D9D9D9] text-slate-600">
//         <AvatarFallback className="text-xs">?</AvatarFallback>
//       </Avatar>
//       <div
//         className={`${baseBubble} ${isCard ? "bg-[#F8F8FC] text-slate-900 border border-slate-200" : "bg-white text-slate-900 shadow-sm"}`}
//       >
//         <p className="whitespace-pre-line">{message.content}</p>
//         {isCard && actionLabel && (
//           <button
//             type="button"
//             className="mt-3 w-full rounded-xl bg-white py-3 text-[13px] font-semibold text-slate-800"
//           >
//             {actionLabel}
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import { Avatar } from "@/components/ui/avatar";
import type { ChatMessage } from "@/types/chat";
import Minho from "@/images/chat/minho.png";

type Props = {
  message: ChatMessage;
  myUserId?: number;
};

export function MessageBubble({ message, myUserId }: Props) {
  // TODO: userId 조회하기
  const myUserIdLocal = 1;
  myUserId = myUserIdLocal;
  const isMine = myUserId != null && message.senderId === myUserId;

  const isQuestionCard = message.messageType === "QUESTION";
  const isSolutionCard = message.messageType === "SOLUTION";
  //const isCard = isQuestionCard || isSolutionCard;

  const actionLabel =
    message.messageType === "QUESTION"
      ? "고민지 보기"
      : message.messageType === "SOLUTION"
        ? "솔루션지 보기"
        : undefined;

  const cardBox =
    "w-full max-w-[286px] border border-[#f1f1f6] rounded-[8px] bg-white px-4 py-3 pre_body_reg_13 text-[#181818]";

  const cardButton =
    "mt-3 w-full rounded-[8px] bg-[#EAF3FF] py-3 text-[13px] font-semibold text-[#2B6DEB]";

  const textBubbleOthers =
    "max-w-[254px] border border-[#f1f1f6] rounded-[8px] bg-white px-[15px] py-[12px] pre_body_reg_13 text-[#181818]";

  const textBubbleMine =
    "max-w-[291px] border border-[#f1f1f6] rounded-[8px] bg-white px-[15px] py-[12px] pre_body_reg_13 text-[#181818]";

  // QUESTION 카드: 가운데 카드 (아바타 없음)
  if (isQuestionCard) {
    return (
      <div className="flex justify-center">
        <div className={cardBox}>
          <p className="text-center">{message.content}</p>
          {actionLabel && (
            <button type="button" className={cardButton}>
              {actionLabel}
            </button>
          )}
        </div>
      </div>
    );
  }

  // SOLUTION 카드: 왼쪽 + 아바타 + 카드
  if (isSolutionCard) {
    return (
      <div className="flex items-end gap-3">
        <Avatar className="h-9 w-9">
          <img src={Minho} alt="용민호 전문가" className="h-full w-full object-cover" />
        </Avatar>

        <div className={cardBox}>
          <p>{message.content}</p>
          {actionLabel && (
            <button type="button" className={cardButton}>
              {actionLabel}
            </button>
          )}
        </div>
      </div>
    );
  }

  // 일반 텍스트 (내 메시지): 가운데 흰 말풍선
  if (isMine) {
    console.log(myUserId, message.senderId);

    return (
      <div className="flex justify-end">
        <div className={textBubbleMine}>
          <p className="whitespace-pre-line">{message.content}</p>
        </div>
      </div>
    );
  }

  // 나머지는 전부 "상대방 메시지"로 처리 (NOTICE/SYSTEM/INFO도 여기로 떨어짐)
  return (
    <div className="flex items-start gap-3">
      <> {console.log(myUserId, message.senderId)}</>
      <Avatar className="h-9 w-9">
        <img src={Minho} alt="용민호 전문가" className="h-full w-full object-cover" />
      </Avatar>

      <div className={textBubbleOthers}>
        <p className="whitespace-pre-line">{message.content}</p>
      </div>
    </div>
  );
}
