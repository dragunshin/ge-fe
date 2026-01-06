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
    <div className="app-footer">
      <div className="mx-auto w-full max-w-[420px] px-5 pb-[calc(env(safe-area-inset-bottom)+16px)]">
        <button
          type="button"
          disabled={disabled}
          onClick={onClick}
          className={[
            "h-[64px] w-full pre_subtitle_semi_16",
            disabled ? "bg-black/40 text-white/70" : "bg-black text-white active:bg-black/90",
          ].join(" ")}
        >
          {label}
        </button>
      </div>
    </div>
  );
}
