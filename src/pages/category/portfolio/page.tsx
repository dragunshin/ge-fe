import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { portfolioItems, type PortfolioItem } from '../expert/portfolio-data';
import { expertService } from '../../../services/expert.service';
import type { ExpertPortfolioResponse } from '../../../lib/api/types';

const mapPortfolioResponse = (portfolio: ExpertPortfolioResponse): PortfolioItem => ({
  id: portfolio.id,
  title: portfolio.title,
  tags: portfolio.hashtags ?? [],
  concern: portfolio.concern,
  solution: portfolio.solution,
  beforeImage: portfolio.beforeImage,
  afterImage: portfolio.afterImage,
});

const PortfolioLandingPage = () => {
  const navigate = useNavigate();
  const { expertId } = useParams();
  const expertIdNumber = useMemo(() => (expertId ? Number(expertId) : undefined), [expertId]);
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedText, setExpandedText] = useState<
    Record<number, { concern: boolean; solution: boolean }>
  >({});
  const [showMore, setShowMore] = useState<
    Record<number, { concern: boolean; solution: boolean }>
  >({});
  const concernRefs = useRef<Record<number, HTMLParagraphElement | null>>({});
  const solutionRefs = useRef<Record<number, HTMLParagraphElement | null>>({});
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const isFetchingRef = useRef(false);

  useEffect(() => {
    if (!expertIdNumber) {
      setItems(portfolioItems);
      setHasMore(false);
      return;
    }

    setItems([]);
    setPage(0);
    setHasMore(true);
  }, [expertIdNumber]);

  useEffect(() => {
    if (!expertIdNumber || !hasMore || isFetchingRef.current) {
      return;
    }

    let isActive = true;

    const fetchPortfolios = async () => {
      try {
        isFetchingRef.current = true;
        setIsLoading(true);
        const response = await expertService.getExpertPortfolios(expertIdNumber, {
          page,
          size: 5,
        });
        if (!isActive) {
          return;
        }
        const mapped = response.data.map(mapPortfolioResponse);
        setItems((prev) => (page === 0 ? mapped : [...prev, ...mapped]));
        setHasMore(mapped.length === 5);
      } catch (error) {
        console.error('Failed to fetch expert portfolios:', error);
        if (!isActive) {
          return;
        }
        if (page === 0) {
          setItems(portfolioItems);
        }
        setHasMore(false);
      } finally {
        if (isActive) {
          setIsLoading(false);
          isFetchingRef.current = false;
        }
      }
    };

    fetchPortfolios();

    return () => {
      isActive = false;
    };
  }, [expertIdNumber, hasMore, page]);

  useEffect(() => {
    const raf = window.requestAnimationFrame(() => {
      const next: Record<number, { concern: boolean; solution: boolean }> = {};
      items.forEach((item) => {
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
  }, [items]);

  const visibleItems = items;

  useEffect(() => {
    if (!sentinelRef.current || !hasMore) {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry?.isIntersecting && hasMore && !isLoading && !isFetchingRef.current) {
          setPage((prev) => prev + 1);
        }
      },
      { rootMargin: '200px' },
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, isLoading]);

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
                    {item.beforeImage && (
                      <img
                        src={item.beforeImage}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    )}
                    <span className="absolute bottom-[8px] left-[8px] rounded-[4px] bg-black/40 px-[6px] py-[2px] text-[14px] text-white">
                      전
                    </span>
                  </div>
                  <div className="relative h-[164px] w-[167.5px] overflow-hidden rounded-[12px] bg-[#d2d4d8]">
                    {item.afterImage && (
                      <img
                        src={item.afterImage}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    )}
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
          {hasMore && <div ref={sentinelRef} className="mx-auto mt-[28px] h-[24px] w-full" />}
        </div>
      </main>
    </div>
  );
};

export default PortfolioLandingPage;
