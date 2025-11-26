// // import type { Message } from "@/types";
// // import { useFriends } from "../../../store/friendsStore";
// // import { toTimeLabelChat } from "@/utils/time";

// // export default function MessageBubble({ m }: { m: Message }) {
// //   const me = useFriends((s) => s.me);
// //   const users = useFriends((s) => s.friends);

// //   const myId = me?.id ?? "me";
// //   const isMine = m.userId === myId || m.userId === "me";

// //   const sender = isMine
// //     ? me
// //     : (users.find((u) => u.id === m.userId) ?? {
// //         name: "알수없음",
// //         avatar: "/images/avatar.svg",
// //       });

// //   const time = m.createdAt ? toTimeLabelChat(m.createdAt) : "";

// //   const bubbleBase =
// //     "w-fit max-w-[212px] rounded-lg !py-2 !px-4 text-body-6 text-gray-900 whitespace-pre-line break-words";

// //   if (isMine) {
// //     return (
// //       <div className="!mb-5 flex w-full items-end !px-4 justify-end">
// //         <time className="text-caption text-gray-600 !mr-2">{time}</time>
// //         {/* <div className=" rounded-lg bg-yellow-500 !py-2 !px-4 text-body-6 text-gray-900 whitespace-pre-line">
// //           {m.text}
// //         </div> */}
// //         <div className={`${bubbleBase} bg-yellow-800`}>{m.text}</div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="flex items-end !px-4 !mb-5">
// //       <div className=" flex items-start">
// //         {/* <img src={sender?.avatar} className="h-9 w-9 object-cover" /> */}
// //         <img src="/images/avatar.svg" className="h-9 w-9 object-cover z-10 !mr-3" />
// //         <div className={`${bubbleBase} bg-gray-300 !px-4 !py-2`}>{m.text}</div>
// //       </div>
// //       <time className="text-caption self-end !ml-2 whitespace-nowrap text-gray-600">{time}</time>
// //     </div>
// //   );
// // }

// "use client";

// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import type { ChatMessage } from "@/stores/useChatStore";

// // TODO: 실제 로그인 유저 ID로 교체
// const MY_ID = "me";

// interface MessageBubbleProps {
//   message: ChatMessage;
// }

// export function MessageBubble({ message }: MessageBubbleProps) {
//   const isMine = message.senderId === MY_ID;
//   const isCard = message.messageType === "QUESTION" || message.messageType === "SOLUTION";

//   const actionLabel =
//     message.messageType === "QUESTION"
//       ? "고민지 보기"
//       : message.messageType === "SOLUTION"
//         ? "솔루션지 보기"
//         : undefined;

//   // 공통 말풍선 스타일
//   const baseBubble = "max-w-[80%] rounded-[20px] px-4 py-3 text-[13px] leading-relaxed";

//   // 내가 보낸 메시지 (오른쪽, 파란색)
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

//   // 상대/전문가가 보낸 메시지 (왼쪽, 아바타 포함)
//   return (
//     <div className="flex items-start gap-2">
//       <Avatar className="mt-1 h-8 w-8 bg-[#D9D9D9] text-slate-600">
//         <AvatarFallback className="text-xs">박</AvatarFallback>
//       </Avatar>

//       <div
//         className={`${baseBubble} ${
//           isCard
//             ? "bg-[#F8F8FC] text-slate-900 border border-slate-200"
//             : "bg-white text-slate-900 shadow-sm"
//         }`}
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

// src/features/chat/components/MessageBubble.tsx
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { ChatMessage } from "@/types/chat";

const MY_ID = "me"; // TODO: 실제 로그인한 유저 ID로 교체

interface Props {
  message: ChatMessage;
}

export function MessageBubble({ message }: Props) {
  const isMine = message.senderId === MY_ID;

  const isCard = message.messageType === "QUESTION" || message.messageType === "SOLUTION";

  const actionLabel =
    message.messageType === "QUESTION"
      ? "고민지 보기"
      : message.messageType === "SOLUTION"
        ? "솔루션지 보기"
        : undefined;

  const baseBubble = "max-w-[80%] rounded-[20px] px-4 py-3 text-[13px] leading-relaxed";

  if (isMine) {
    return (
      <div className="flex justify-end">
        <div className={`${baseBubble} bg-[#2F80FF] text-white shadow-sm`}>
          <p className="whitespace-pre-line">{message.content}</p>
          {isCard && actionLabel && (
            <button
              type="button"
              className="mt-3 w-full rounded-xl bg-white py-3 text-[13px] font-semibold text-[#2F80FF]"
            >
              {actionLabel}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2">
      <Avatar className="mt-1 h-8 w-8 bg-[#D9D9D9] text-slate-600">
        <AvatarFallback className="text-xs">박</AvatarFallback>
      </Avatar>
      <div
        className={`${baseBubble} ${
          isCard
            ? "bg-[#F8F8FC] text-slate-900 border border-slate-200"
            : "bg-white text-slate-900 shadow-sm"
        }`}
      >
        <p className="whitespace-pre-line">{message.content}</p>
        {isCard && actionLabel && (
          <button
            type="button"
            className="mt-3 w-full rounded-xl bg-white py-3 text-[13px] font-semibold text-slate-800"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
