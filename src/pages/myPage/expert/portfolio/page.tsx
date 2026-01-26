import * as React from "react";
import BackIcon from "@/images/login/back.svg?react";
import AddPortfolioIcon from "@/images/mypage/expert/addPortfolio.svg?react";
import OptionIcon from "@/images/mypage/expert/option.svg?react";
import RepresentativePinIcon from "@/images/mypage/expert/representativePin.svg?react";
import { useNavigate } from "react-router-dom";

import { getUserMe, type UserMe } from "@/api/mypage";
import { expertService } from "@/services/expert.service";
import type { ExpertPortfolioResponse } from "@/lib/api/types";
import { portfolioItems } from "@/pages/category/expert/portfolio-data";

type ExpertPortfolioItem = {
  id: number;
  title: string;
  tags: string[];
  concern: string;
  solution: string;
  beforeImage?: string;
  afterImage?: string;
  isRepresentative: boolean;
};

const mapPortfolioResponse = (portfolio: ExpertPortfolioResponse): ExpertPortfolioItem => ({
  id: portfolio.id,
  title: portfolio.title,
  tags: portfolio.hashtags ?? [],
  concern: portfolio.concern,
  solution: portfolio.solution,
  beforeImage: portfolio.beforeImage,
  afterImage: portfolio.afterImage,
  isRepresentative: portfolio.isRepresentative,
});

export default function ExpertPortfolioPage() {
  const navigate = useNavigate();
  const [me, setMe] = React.useState<UserMe | null>(null);
  const [items, setItems] = React.useState<ExpertPortfolioItem[]>([]);
  const [page, setPage] = React.useState(0);
  const [hasMore, setHasMore] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  const isFetchingRef = React.useRef(false);
  const [openMenuId, setOpenMenuId] = React.useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<ExpertPortfolioItem | null>(null);
  const [representTarget, setRepresentTarget] = React.useState<ExpertPortfolioItem | null>(null);
  const [expandedText, setExpandedText] = React.useState<
    Record<number, { concern: boolean; solution: boolean }>
  >({});
  const [showMore, setShowMore] = React.useState<
    Record<number, { concern: boolean; solution: boolean }>
  >({});
  const concernRefs = React.useRef<Record<number, HTMLParagraphElement | null>>({});
  const solutionRefs = React.useRef<Record<number, HTMLParagraphElement | null>>({});

  React.useEffect(() => {
    const ac = new AbortController();

    (async () => {
      try {
        const data = await getUserMe({ signal: ac.signal });
        setMe(data);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        console.error(error);
      }
    })();

    return () => ac.abort();
  }, []);

  React.useEffect(() => {
    if (!me?.userId) return;

    setItems([]);
    setPage(0);
    setHasMore(true);
  }, [me?.userId]);

  React.useEffect(() => {
    if (!me?.userId || !hasMore || isFetchingRef.current) return;

    let isActive = true;

    const fetchPortfolios = async () => {
      try {
        isFetchingRef.current = true;
        setIsLoading(true);
        const response = await expertService.getExpertPortfolios(me.userId, {
          page,
          size: 5,
        });
        if (!isActive) return;
        const mapped = response.data.map(mapPortfolioResponse);
        setItems((prev) => (page === 0 ? mapped : [...prev, ...mapped]));
        setHasMore(mapped.length === 5);
      } catch (error) {
        console.error("Failed to fetch expert portfolios:", error);
        if (!isActive) return;
        if (page === 0) {
          setItems(
            portfolioItems.map((item) => ({
              ...item,
              isRepresentative: false,
            })),
          );
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
  }, [me?.userId, page, hasMore]);

  React.useEffect(() => {
    const raf = window.requestAnimationFrame(() => {
      const next: Record<number, { concern: boolean; solution: boolean }> = {};
      items.forEach((item) => {
        const concernEl = concernRefs.current[item.id];
        const solutionEl = solutionRefs.current[item.id];
        const concernOverflow = !!concernEl && concernEl.scrollHeight > concernEl.clientHeight + 1;
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

  const toggleRepresentative = async (item: ExpertPortfolioItem) => {
    try {
      const response = await expertService.toggleRepresentativePortfolio({
        portfolioId: item.id,
      });
      const { portfolioId, isRepresentative } = response.data;
      setItems((prev) =>
        prev.map((portfolio) => {
          if (portfolio.id === portfolioId) {
            return { ...portfolio, isRepresentative };
          }
          if (isRepresentative) {
            return { ...portfolio, isRepresentative: false };
          }
          return portfolio;
        }),
      );
    } catch (error) {
      console.error("Failed to toggle representative portfolio:", error);
      alert("대표 포트폴리오 설정에 실패했습니다.");
    }
  };

  const deletePortfolio = async (item: ExpertPortfolioItem) => {
    try {
      await expertService.deletePortfolio(item.id);
      setItems((prev) => prev.filter((portfolio) => portfolio.id !== item.id));
      setDeleteTarget(null);
    } catch (error) {
      console.error("Failed to delete portfolio:", error);
      alert("포트폴리오 삭제에 실패했습니다.");
    }
  };

  return (
    <div className="flex h-full flex-col bg-white">
      <header className="app-header">
        <div className="flex items-center gap-[6px] px-4 py-[16px]">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-[24px] w-[24px] items-center justify-center"
          >
            <BackIcon className="h-[24px] w-[24px]" />
          </button>
          <h1 className="text-[20px] font-semibold text-[#181818]">포트폴리오 관리</h1>
        </div>
      </header>

      <main className="relative flex-1 overflow-y-auto pb-[80px]">
        <div className="flex flex-col gap-[2px] pt-[14px]">
          {items.map((item) => {
            const isConcernExpanded = expandedText[item.id]?.concern ?? false;
            const isSolutionExpanded = expandedText[item.id]?.solution ?? false;
            const visibleTags = item.tags.slice(0, 2);
            const extraCount = item.tags.length - visibleTags.length;

            return (
              <section
                key={item.id}
                className="relative border-b-[8px] border-[#f4f4f5] px-[16px] py-[28px]"
              >
                <div className="flex flex-col gap-[12px]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-[8px]">
                      <h2 className="text-[16px] font-semibold text-[#292a2d]">{item.title}</h2>
                      {item.isRepresentative && (
                        <RepresentativePinIcon className="h-[24px] w-[24px]" />
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setOpenMenuId((prev) => (prev === item.id ? null : item.id))}
                      className="flex h-[24px] w-[24px] items-center justify-center"
                    >
                      <OptionIcon className="h-[24px] w-[24px]" />
                    </button>
                  </div>

                  <div className="flex gap-[8px] overflow-hidden">
                    {visibleTags.map((tag) => (
                      <span
                        key={`${item.id}-${tag}`}
                        className="rounded-[2px] bg-[#f4f4f5] px-[6px] py-[4px] text-[12px] text-[#46474c]"
                      >
                        {tag}
                      </span>
                    ))}
                    {extraCount > 0 && (
                      <span className="rounded-[2px] bg-[#f4f4f5] px-[6px] py-[4px] text-[12px] text-[#46474c]">
                        +{extraCount}
                      </span>
                    )}
                  </div>
                  <div className="flex h-[164px] items-center gap-[8px]">
                    <div className="relative h-[164px] w-[167.5px] overflow-hidden rounded-[12px] bg-[#d2d4d8]">
                      {item.beforeImage && (
                        <img src={item.beforeImage} alt="" className="h-full w-full object-cover" />
                      )}
                      <span className="absolute bottom-[8px] left-[8px] rounded-[4px] bg-black/40 px-[6px] py-[2px] text-[14px] text-white">
                        전
                      </span>
                    </div>
                    <div className="relative h-[164px] w-[167.5px] overflow-hidden rounded-[12px] bg-[#d2d4d8]">
                      {item.afterImage && (
                        <img src={item.afterImage} alt="" className="h-full w-full object-cover" />
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
                      isConcernExpanded ? "" : "line-clamp-3"
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
                      isSolutionExpanded ? "" : "line-clamp-3"
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

                {openMenuId === item.id && (
                  <div className="absolute right-[16px] top-[64px] z-70 w-[156px] overflow-hidden rounded-[8px] border border-[#f1f1f6] bg-white px-[12px] text-[14px]">
                    <button
                      type="button"
                      onClick={() => {
                        setOpenMenuId(null);
                        return;
                      }}
                      className="w-full border-b border-[#f1f1f6] px-[32px] py-[10px] text-center font-medium text-[#171719]"
                    >
                      수정하기
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setOpenMenuId(null);
                        // setDeleteTarget(item);
                        alert("개발 중인 기능입니다. 삭제 후에 다시 만들어주세요.");
                      }}
                      className="w-full border-b border-[#f1f1f6] px-[32px] py-[10px] text-center font-medium text-[#171719]"
                    >
                      삭제하기
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setOpenMenuId(null);
                        if (item.isRepresentative) {
                          void toggleRepresentative(item);
                        } else {
                          setRepresentTarget(item);
                        }
                      }}
                      className="w-full px-[32px] py-[10px] text-center font-medium text-[#008bff]"
                    >
                      {item.isRepresentative ? "대표 포트폴리오 해제" : "대표로 지정"}
                    </button>
                  </div>
                )}
              </section>
            );
          })}

          {hasMore && (
            <div className="flex items-center justify-center px-[16px] py-[20px]">
              <button
                type="button"
                onClick={() => setPage((prev) => prev + 1)}
                disabled={isLoading}
                className="flex items-center gap-[8px] rounded-[12px] border border-[#f4f4f5] px-[16px] py-[10px] text-[12px] text-[#666]"
              >
                {isLoading ? "불러오는 중" : "펼쳐서 더보기"}
              </button>
            </div>
          )}
        </div>

        <div className="fixed bottom-[24px] left-1/2 z-30 w-full max-w-[375px] -translate-x-1/2 px-[16px]">
          <button
            type="button"
            onClick={() => navigate(`/portfolioAdd/${me?.userId}`)}
            className="ml-auto flex h-[56px] w-[56px] items-center justify-center"
          >
            <AddPortfolioIcon className="h-[56px] w-[56px]" />
          </button>
        </div>

        {openMenuId !== null && (
          <button
            type="button"
            aria-label="메뉴 닫기"
            onClick={() => setOpenMenuId(null)}
            className="fixed inset-0 z-60 bg-black/50"
          />
        )}

        {representTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-[16px]">
            <div className="h-[158px] w-[312px] rounded-[8px] border border-[#f1f1f6] bg-white px-[32px] py-[24px] text-center">
              <p className="text-[16px] font-semibold text-[#46474c]">
                대표 포트폴리오로 지정하시겠어요?
              </p>
              <p className="mt-[6px] text-[13px] text-[#878a93]">1가지만 지정 가능해요.</p>
              <div className="mt-[20px] flex gap-[8px]">
                <button
                  type="button"
                  onClick={() => setRepresentTarget(null)}
                  className="h-[40px] w-full rounded-[4px] border border-[#dbdcdf] text-[14px]"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (representTarget) {
                      void toggleRepresentative(representTarget);
                    }
                    setRepresentTarget(null);
                  }}
                  className="h-[40px] w-full rounded-[4px] bg-[#181818] text-[14px] font-semibold text-white"
                >
                  대표로 지정
                </button>
              </div>
            </div>
          </div>
        )}

        {deleteTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-[16px]">
            <div className="h-[130px] w-[312px] rounded-[8px] border border-[#f1f1f6] bg-white px-[32px] py-[24px] text-center">
              <p className="text-[16px] font-semibold text-[#46474c]">
                포트폴리오를 삭제하시겠습니까?
              </p>
              <div className="mt-[20px] flex gap-[8px]">
                <button
                  type="button"
                  onClick={() => setDeleteTarget(null)}
                  className="h-[40px] w-full rounded-[4px] border border-[#dbdcdf] text-[14px]"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={() => void deletePortfolio(deleteTarget)}
                  className="h-[40px] w-full rounded-[4px] bg-[#181818] text-[14px] font-semibold text-white"
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
