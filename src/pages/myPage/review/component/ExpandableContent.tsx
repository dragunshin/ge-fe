import { useCallback, useLayoutEffect, useRef, useState } from "react";

function ExpandableContent({
  content,
  expanded,
  onToggle,
  lines = 3,
}: {
  content: string;
  expanded: boolean;
  onToggle: () => void;
  lines?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isOverflow, setIsOverflow] = useState(false);

  const checkOverflow = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    // clamp가 적용된 상태에서 scrollHeight > clientHeight면 잘린 것
    const overflow = el.scrollHeight > el.clientHeight + 1;
    setIsOverflow(overflow);
  }, []);

  useLayoutEffect(() => {
    // 렌더 직후 1회 측정
    checkOverflow();

    // 폭 변경/폰트 로딩 등으로 높이가 바뀔 수 있어 ResizeObserver로 재측정
    const el = ref.current;
    if (!el) return;

    const ro = new ResizeObserver(() => checkOverflow());
    ro.observe(el);

    return () => ro.disconnect();
  }, [content, expanded, checkOverflow]);

  const showToggle = isOverflow || expanded;

  return (
    <div className="mt-4 text-[12px] leading-5 text-[#6B6B6B]">
      <div
        ref={ref}
        style={
          expanded
            ? undefined
            : {
                display: "-webkit-box",
                WebkitLineClamp: lines,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }
        }
      >
        {content}
      </div>

      {showToggle ? (
        <button
          type="button"
          onClick={onToggle}
          className="mt-1 text-[12px] font-medium text-[#6B6B6B]"
        >
          {expanded ? "접기" : "… 더보기"}
        </button>
      ) : null}
    </div>
  );
}
export default ExpandableContent;
