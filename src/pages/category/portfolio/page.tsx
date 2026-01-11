import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronLeft } from 'lucide-react';
import { portfolioItems } from '../expert/portfolio-data';

const PortfolioLandingPage = () => {
  const navigate = useNavigate();
  const [expandedText, setExpandedText] = useState<
    Record<number, { concern: boolean; solution: boolean }>
  >({});
  const [showMore, setShowMore] = useState<
    Record<number, { concern: boolean; solution: boolean }>
  >({});
  const [showAll, setShowAll] = useState(false);
  const concernRefs = useRef<Record<number, HTMLParagraphElement | null>>({});
  const solutionRefs = useRef<Record<number, HTMLParagraphElement | null>>({});

  useEffect(() => {
    const raf = window.requestAnimationFrame(() => {
      const next: Record<number, { concern: boolean; solution: boolean }> = {};
      portfolioItems.forEach((item) => {
        const concernEl = concernRefs.current[item.id];
        const solutionEl = solutionRefs.current[item.id];
        const concernOverflow =
          !!concernEl && concernEl.scrollHeight > concernEl.clientHeight + 1;
        const solutionOverflow =
          !!solutionEl && solutionEl.scrollHeight > solutionEl.clientHeight + 1;
        next[item.id] = {
          concern: concernOverflow,
          solution: solutionOverflow,
        };
      });
      setShowMore(next);
    });
    return () => window.cancelAnimationFrame(raf);
  }, []);

  const visibleItems = showAll ? portfolioItems : portfolioItems.slice(0, 3);

  return (
    <div className="flex h-full flex-col bg-white">
      <header className="app-header flex items-center gap-[15px] px-4 pt-[14px]">
        <button
          onClick={() => navigate(-1)}
          className="flex h-[24px] w-[24px] items-center justify-center"
        >
          <ChevronLeft className="h-[24px] w-[24px]" />
        </button>
        <h1 className="text-[20px] font-semibold text-[#0f0f10]">포트폴리오</h1>
      </header>

      <main className="flex-1 overflow-x-hidden overflow-y-auto pb-10 scrollbar-hide">
        <div className="flex flex-col gap-[2px] pt-[14px]">
          {visibleItems.map((item) => {
            const isConcernExpanded = expandedText[item.id]?.concern ?? false;
            const isSolutionExpanded = expandedText[item.id]?.solution ?? false;
            return (
            <section
              key={item.id}
              className="border-b-[8px] border-[#f4f4f5] px-[16px] py-[28px]"
            >
              <div className="flex flex-col gap-[12px]">
                <h2 className="text-[16px] font-semibold text-[#292a2d]">{item.title}</h2>
                <div className="flex gap-[8px] overflow-hidden">
                  {item.tags.map((tag) => (
                    <span
                      key={`${item.id}-${tag}`}
                      className="rounded-[2px] bg-[#f4f4f5] px-[6px] py-[4px] text-[12px] text-[#46474c]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex h-[164px] items-center gap-[8px]">
                  <div className="relative h-[164px] w-[167.5px] overflow-hidden rounded-[12px] bg-[#d2d4d8]">
                    <span className="absolute bottom-[8px] left-[8px] rounded-[4px] bg-black/40 px-[6px] py-[2px] text-[14px] text-white">
                      전
                    </span>
                  </div>
                  <div className="relative h-[164px] w-[167.5px] overflow-hidden rounded-[12px] bg-[#d2d4d8]">
                    <span className="absolute bottom-[8px] right-[8px] rounded-[4px] bg-black/40 px-[6px] py-[2px] text-[14px] text-white">
                      후
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-[28px] space-y-[6px]">
                <p className="text-[14px] font-semibold text-[#292a2d]">고객의 고민</p>
                <p
                  ref={(el) => {
                    concernRefs.current[item.id] = el;
                  }}
                  className={`text-[13px] leading-[1.4] text-[#505158] ${
                    isConcernExpanded ? '' : 'line-clamp-3'
                  }`}
                >
                  {item.concern}
                </p>
                {showMore[item.id]?.concern && !isConcernExpanded && (
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedText((prev) => ({
                        ...prev,
                        [item.id]: {
                          concern: true,
                          solution: prev[item.id]?.solution ?? false,
                        },
                      }))
                    }
                    className="text-[13px] text-[#c2c4c8]"
                  >
                    더보기
                  </button>
                )}
              </div>
              <div className="mt-[28px] space-y-[6px]">
                <p className="text-[14px] font-semibold text-[#292a2d]">솔루션</p>
                <p
                  ref={(el) => {
                    solutionRefs.current[item.id] = el;
                  }}
                  className={`text-[13px] leading-[1.4] text-[#505158] ${
                    isSolutionExpanded ? '' : 'line-clamp-3'
                  }`}
                >
                  {item.solution}
                </p>
                {showMore[item.id]?.solution && !isSolutionExpanded && (
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedText((prev) => ({
                        ...prev,
                        [item.id]: {
                          concern: prev[item.id]?.concern ?? false,
                          solution: true,
                        },
                      }))
                    }
                    className="text-[13px] text-[#c2c4c8]"
                  >
                    더보기
                  </button>
                )}
              </div>
            </section>
          );
          })}
          {!showAll && portfolioItems.length > 3 && (
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="mx-auto mt-[28px] flex h-[40px] w-[151px] items-center justify-center gap-[8px] rounded-[12px] border border-[#f4f4f5]"
            >
              <span className="text-[12px] font-medium text-[#666]">펼쳐서 더보기</span>
              <ChevronDown className="h-[24px] w-[24px] text-[#666]" />
            </button>
          )}
        </div>
      </main>
    </div>
  );
};

export default PortfolioLandingPage;
