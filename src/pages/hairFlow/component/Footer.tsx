// // // export default function Footer({
// // //   label = "다음",
// // //   disabled,
// // //   onClick,
// // // }: {
// // //   label?: string;
// // //   disabled?: boolean;
// // //   onClick: () => void;
// // // }) {
// // //   return (
// // //     <div className="fixed inset-x-0 bottom-0 z-50">
// // //       <div className="mx-auto w-full max-w-[420px] px-5 pb-[calc(env(safe-area-inset-bottom)+16px)]">
// // //         <button
// // //           type="button"
// // //           disabled={disabled}
// // //           onClick={onClick}
// // //           className={[
// // //             "h-[64px] w-full pre_subtitle_semi_16",
// // //             disabled ? "bg-black/40 text-white/70" : "bg-black text-white active:bg-black/90",
// // //           ].join(" ")}
// // //         >
// // //           {label}
// // //         </button>
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // export default function Footer({
// //   label = "다음",
// //   disabled,
// //   onClick,
// // }: {
// //   label?: string;
// //   disabled?: boolean;
// //   onClick: () => void;
// // }) {
// //   return (
// //     <div
// //       className="
// //         fixed bottom-0 left-1/2 z-50 w-full max-w-[375px]
// //         -translate-x-1/2
// //       "
// //     >
// //       <div className="pointer-events-none absolute inset-x-0 -top-10 h-10 " />

// //       <button
// //         type="button"
// //         disabled={disabled}
// //         onClick={onClick}
// //         className={[
// //           "h-[64px] w-full pre_subtitle_semi_16",
// //           disabled ? "bg-black/40 text-white/70" : "bg-black text-white active:bg-black/90",
// //         ].join(" ")}
// //       >
// //         {label}
// //       </button>

// //       {/* safe-area도 검정으로 채우기 (iOS 홈 인디케이터) */}
// //       <div className="h-[env(safe-area-inset-bottom)] bg-black" />
// //     </div>
// //   );
// // }

// export default function Footer({
//   label = "다음",
//   disabled,
//   onClick,
// }: {
//   label?: string;
//   disabled?: boolean;
//   onClick: () => void;
// }) {
//   return (
//     <div className="fixed inset-x-0 bottom-0 z-50">
//       {/* ✅ 위 폼이랑 똑같이: max-w + 좌우 패딩 */}
//       <div className="mx-auto w-full max-w-[410px] px-4">
//         {/* ✅ 검정 배경은 '컨테이너 폭' 안에서만 */}
//         <div className="bg-black">
//           <button
//             type="button"
//             disabled={disabled}
//             onClick={onClick}
//             className={[
//               "h-[64px] w-full pre_subtitle_semi_16",
//               // ✅ disabled는 투명도 말고 불투명으로 (분단/비침 방지)
//               disabled ? "bg-[#AEB0B6] text-white" : "bg-[#0f0f10] text-white active:bg-black/90",
//             ].join(" ")}
//           >
//             {label}
//           </button>

//           {/* safe-area도 검정(모바일에서 홈 인디케이터 영역) */}
//           <div className="h-[env(safe-area-inset-bottom)] bg-black" />
//         </div>
//       </div>
//     </div>
//   );
// }
export default function Footer({
  label = "다음",
  disabled,
  onClick,
}: {
  label?: string;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    // ✅ 바(배경)는 화면 전체 폭
    <div className="fixed inset-x-0 bottom-0 z-50 pb-[env(safe-area-inset-bottom)]">
      {/* ✅ 버튼은 컨테이너 폭 유지 */}
      <div className="mx-auto w-full max-w-[410px] px-4">
        <button
          type="button"
          disabled={disabled}
          onClick={onClick}
          className={[
            "h-[64px] w-full pre_subtitle_semi_16",
            disabled ? "bg-[#AEB0B6] text-white" : "bg-[#0f0f10] text-white active:bg-black/90",
          ].join(" ")}
        >
          {label}
        </button>
      </div>
    </div>
  );
}
