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
//     // ✅ 바(배경)는 화면 전체 폭
//     <div className="fixed inset-x-0 bottom-0 pb-[env(safe-area-inset-bottom)]">
//       {/* ✅ 버튼은 컨테이너 폭 유지 */}
//       <div className="mx-auto w-full max-w-[410px] px-4">
//         <button
//           type="button"
//           disabled={disabled}
//           onClick={onClick}
//           className={[
//             "h-[64px] w-full pre_subtitle_semi_16",
//             disabled ? "bg-[#AEB0B6] text-white" : "bg-[#0f0f10] text-white active:bg-black/90",
//           ].join(" ")}
//         >
//           {label}
//         </button>
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
    // 1. 하단 고정 (z-index로 위에 띄움)
    // pointer-events-none을 줘서 max-w 바깥 영역 클릭 시 뒤에 있는 요소에 영향 안 주도록 설정(선택사항)
    <div className="sticky bottom-0 z-50 bg-transparent">
      {/* 2. 앱의 최대 너비(410px)에 맞춤 + 중앙 정렬 */}

      <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        className={[
          // 레이아웃: 꽉 찬 너비, 높이 64px
          "w-full h-[64px]",
          // 텍스트 스타일
          "pre_subtitle_semi_16",
          // ★ 중요: Safe Area 패딩 추가 (버튼 내부가 아니라 아래쪽 여백으로 처리)
          "pb-[env(safe-area-inset-bottom)] box-content",
          // 배경색 및 상태 스타일
          disabled ? "bg-[#AEB0B6] text-white cursor-not-allowed" : "bg-[#0f0f10] text-white ",
        ].join(" ")}
      >
        {/* 텍스트는 64px 높이의 중앙에 오도록 배치 */}
        <span className="flex h-[64px] items-center justify-center">{label}</span>
      </button>
    </div>
  );
}
