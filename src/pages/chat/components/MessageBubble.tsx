"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { ChatMessage } from "@/types/chat";
import { useNavigate } from "react-router-dom";

type Props = {
  message: ChatMessage;
  myUserId?: number | null;
  opponentProfileImage?: string | null;
};

export function MessageBubble({ message, myUserId, opponentProfileImage }: Props) {
  const nav = useNavigate();

  const isMine = message.senderId < 0 || (myUserId != null && message.senderId === myUserId);

  const isQuestionCard = message.messageType === "CONCERN";
  const isSolutionCard = message.messageType === "SOLUTION";
  //const isCard = isQuestionCard || isSolutionCard;

  const actionLabel =
    message.messageType === "CONCERN"
      ? "고민지 보기"
      : message.messageType === "SOLUTION"
        ? "솔루션지 보기"
        : undefined;

  // const cardButton =
  //   "mt-3 w-full rounded-[8px] bg-[#EAF3FF] py-3 text-[13px] font-semibold text-[#2B6DEB]";

  const textBubbleOthers =
    "max-w-[254px] border border-[#f1f1f6] rounded-[8px] rounded-bl-none bg-white px-[15px] py-[12px] pre_body_reg_13 text-[#181818]";

  const textBubbleMine =
    "max-w-[291px] border border-[#f1f1f6] rounded-[8px] rounded-br-none bg-white px-[15px] py-[12px] pre_body_reg_13 text-[#181818]";

  // QUESTION(=CONCERN) 카드: 기본은 가운데, 내 메시지면 오른쪽
  // if (isQuestionCard) {
  //   const boxClass = [
  //     "w-full max-w-[246px]",
  //     "border border-[#f1f1f6] rounded-[8px] rounded-bl-none bg-white",
  //     "p-[12px]",
  //   ].join(" ");

  //   const MineboxClass = [
  //     "w-full max-w-[246px]",
  //     "border border-[#f1f1f6] rounded-[8px] rounded-br-none bg-white",
  //     "p-[12px]",
  //   ].join(" ");

  //   return (
  //     <div className={isMine ? "flex justify-end" : "flex justify-center"}>
  //       <div className={isMine ? MineboxClass : boxClass}>
  //         {/* ✅ 스샷처럼 좌측 정렬(기존 text-center 제거) */}
  //         <p className="whitespace-pre-wrap pre_cap_reg_13 text-[#181818]">
  //           김바보님의 고민지가 도착했습니다.
  //         </p>
  //         {/* <p className="whitespace-pre-wrap pre_cap_reg_13 text-[#181818]">{message.content}</p> */}

  //         {actionLabel && (
  //           <button
  //             type="button"
  //             onClick={() => nav(`/concern/${message.relatedId}`)}
  //             className={cardButton}
  //           >
  //             {actionLabel}
  //           </button>
  //         )}
  //       </div>
  //     </div>
  //   );
  // }

  // QUESTION(=CONCERN) 카드
  if (isQuestionCard) {
    const boxClass = [
      "flex flex-col gap-2",
      "border border-[#f1f1f6] rounded-[8px] rounded-bl-none bg-white",
      "p-[12px] w-[246px]",
    ].join(" ");

    const mineBoxClass = [
      "flex flex-col gap-2",
      "border border-[#f1f1f6] rounded-[8px] rounded-br-none bg-white",
      "p-[12px] w-[246px]",
    ].join(" ");

    // ✅ 내 메시지면: 오른쪽(아바타 없음)
    if (isMine) {
      return (
        <div className="flex justify-end">
          <div className={mineBoxClass}>
            {/* <p className="whitespace-pre-wrap pre_cap_reg_13 text-[#181818]">{message.content}</p> */}
            <p className="whitespace-pre-wrap pre_cap_reg_13 text-[#181818]">
              김바보님의 고민지가 도착했습니다.
            </p>
            {actionLabel && (
              <button
                type="button"
                onClick={() => nav(`/concern/${message.relatedId}`)}
                //className={cardButton}
                className="w-full rounded-[8px] bg-[#E5f4ff] py-[8px] px-[20px] pre_cap_semi_13 text-[#008BFF] active:scale-[0.98]"
              >
                {actionLabel}
              </button>
            )}
          </div>
        </div>
      );
    }

    // ✅ 상대 메시지면: 왼쪽 + 아바타
    return (
      <div className="flex items-start gap-3">
        <Avatar className="h-9 w-9 shrink-0">
          {opponentProfileImage ? (
            <AvatarImage
              src={opponentProfileImage}
              alt="profile"
              className="h-full w-full object-cover"
            />
          ) : null}
          <AvatarFallback className="bg-slate-200" />
        </Avatar>

        <div className={boxClass}>
          <p className="whitespace-pre-wrap pre_cap_reg_13 text-[#181818]">{message.content}</p>

          {actionLabel && (
            <button
              type="button"
              onClick={() => nav(`/concern/${message.relatedId}`)}
              // className={cardButton}
              className="w-full rounded-[8px] bg-[#E5f4ff] py-[8px] px-[20px] pre_cap_semi_13 text-[#008BFF] active:scale-[0.98]"
            >
              {actionLabel}
            </button>
          )}
        </div>
      </div>
    );
  }

  // SOLUTION 카드: 왼쪽 + 아바타 + 카드
  // if (isSolutionCard) {
  //   return (
  //     <div className="flex items-end gap-3">
  //       <Avatar className="h-9 w-9">
  //         {opponentProfileImage ? (
  //           <AvatarImage
  //             src={opponentProfileImage}
  //             alt="profile"
  //             className="h-full w-full object-cover"
  //           />
  //         ) : null}
  //         <AvatarFallback className="bg-slate-200" />
  //       </Avatar>

  //       <div className={cardBox}>
  //         <p>{message.content}</p>
  //         {actionLabel && (
  //           <button type="button" className={cardButton}>
  //             {actionLabel}
  //           </button>
  //         )}
  //       </div>
  //     </div>
  //   );
  // }

  // SOLUTION 카드
  if (isSolutionCard) {
    const boxClass = [
      "flex flex-col gap-2",
      "border border-[#f1f1f6] rounded-[8px] rounded-bl-none bg-white",
      "p-[12px] w-[250px]",
    ].join(" ");

    const mineBoxClass = [
      "flex flex-col gap-2",
      "border border-[#f1f1f6] rounded-[8px] rounded-br-none bg-white",
      "p-[12px] w-[250px]",
    ].join(" ");

    // ✅ 내 메시지면: 오른쪽(아바타 없음)
    if (isMine) {
      return (
        <div className="flex justify-end">
          <div className={mineBoxClass}>
            <p className="whitespace-pre-wrap pre_cap_reg_13 text-[#181818]">{message.content}</p>

            {actionLabel && (
              <button
                type="button"
                className="w-full rounded-[8px] bg-[#E5f4ff] py-[8px] px-[20px] pre_cap_semi_13 text-[#008BFF] active:scale-[0.98]"
              >
                {actionLabel}
              </button>
            )}
          </div>
        </div>
      );
    }

    // ✅ 상대 메시지면: 왼쪽 + 아바타
    return (
      <div className="flex items-start gap-3">
        <Avatar className="h-9 w-9 shrink-0">
          {opponentProfileImage ? (
            <AvatarImage
              src={opponentProfileImage}
              alt="profile"
              className="h-full w-full object-cover"
            />
          ) : null}
          <AvatarFallback className="bg-slate-200" />
        </Avatar>

        <div className={boxClass}>
          <p className="whitespace-pre-wrap pre_cap_reg_13 text-[#181818]">{message.content}</p>

          {actionLabel && (
            <button
              type="button"
              className="w-full rounded-[8px] bg-[#E5f4ff] py-[8px] px-[20px] pre_cap_semi_13 text-[#008BFF] active:scale-[0.98]"
            >
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
          <p className="whitespace-pre-line pre_cap_reg_13 text-[#0f0f10]">{message.content}</p>
        </div>
      </div>
    );
  }

  // 나머지는 전부 "상대방 메시지"로 처리 (NOTICE/SYSTEM/INFO도 여기로 떨어짐)
  return (
    <div className="flex items-start gap-3">
      <> {console.log(myUserId, message.senderId)}</>
      {/* <Avatar className="h-9 w-9">
        <img src={opponentProfileImage} alt="" className="h-full w-full object-cover" />
      </Avatar> */}

      <Avatar className="h-9 w-9">
        {opponentProfileImage ? (
          <AvatarImage
            src={opponentProfileImage}
            alt="profile"
            className="h-full w-full object-cover"
          />
        ) : null}
        <AvatarFallback className="bg-slate-200" />
      </Avatar>

      <div className={textBubbleOthers}>
        <p className="whitespace-pre-line pre_cap_reg_13 text-[#0f0f10]">{message.content}</p>
      </div>
    </div>
  );
}
