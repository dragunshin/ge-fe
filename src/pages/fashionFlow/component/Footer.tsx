export default function Footer({
  disabled,
  onNext,
  onPreviewNext,
}: {
  disabled: boolean;
  onNext: () => void;
  onPreviewNext: () => void;
}) {
  return (
    <footer className="app-footer bg-transparent">
      <div className="px-[16px] pb-[4px]">
        {/*
        <div className="flex justify-end">
          <button
            type="button"
            className="text-[12px] font-medium text-[#878a93]"
            onClick={onPreviewNext}
          >
            다음 단계로
          </button>
        </div>
        */}
      </div>
      <button
        type="button"
        className={`flex h-[54px] w-full items-center justify-center rounded-none pre_subtitle_semi_16 ${
          disabled
            ? "bg-[#E6E7EA] text-[#A9ADB6]"
            : "bg-[#0f0f10] text-white active:opacity-90"
        }`}
        onClick={onNext}
        disabled={disabled}
      >
        다음
      </button>
    </footer>
  );
}
