export default function Footer({
  label = "다음",
  onClick,
}: {
  label?: string;
  onClick: () => void;
}) {
  return (
    <div className="absolute inset-x-0 bottom-0 z-50 bg-white">
      <div className="mx-auto w-full max-w-[375px] px-5 pb-[calc(env(safe-area-inset-bottom)+16px)]">
        <button
          type="button"
          onClick={onClick}
          className="flex h-[54px] w-full items-center justify-center rounded-none pre_subtitle_semi_16 bg-[#0f0f10] text-white active:opacity-90"
        >
          {label}
        </button>
      </div>
    </div>
  );
}
