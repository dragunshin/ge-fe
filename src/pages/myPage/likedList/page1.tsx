import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Heart from "@/images/redHeart.svg?react";
import Back from "@/images/login/back.svg?react";
import Star from "@/images/mypage/star.svg?react";
import BottomNav from "@/components/navigation/bottom-nav";
import { expertService } from "@/services/expert.service";
import { getApiCategoryFromLabel, getLabelFromApiCategory } from "@/lib/utils/category";
import type { ExpertSummaryResponse } from "@/lib/api/types";

type Category = "전체" | "헤어" | "스킨" | "패션" | "메이크업";

export default function LikedListPage() {
  const navigate = useNavigate();

  const chips: Category[] = ["전체", "헤어", "스킨", "패션", "메이크업"];

  // ✅ 선택 상태
  const [activeChip, setActiveChip] = useState<Category>("스킨");
  const [likedExperts, setLikedExperts] = useState<ExpertSummaryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isActive = true;

    const fetchLikedExperts = async () => {
      setIsLoading(true);
      try {
        const response = await expertService.getLikedExperts({
          category: getApiCategoryFromLabel(activeChip),
          page: 0,
          size: 50,
        });
        if (!isActive) {
          return;
        }
        setLikedExperts(response.data ?? []);
      } catch (error) {
        console.error("Failed to fetch liked experts:", error);
        if (isActive) {
          setLikedExperts([]);
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    fetchLikedExperts();

    return () => {
      isActive = false;
    };
  }, [activeChip]);

  // ✅ 선택 카테고리에 맞게 필터링
  const filteredData = useMemo(() => {
    const source = likedExperts ?? [];
    if (activeChip === "전체") return source;
    return source.filter(
      (item) => getLabelFromApiCategory(item.category) === activeChip,
    );
  }, [activeChip, likedExperts]);

  return (
    <div className="flex h-full flex-col bg-white">
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-md px-4 pb-12">
        <div className="pt-6">
          {/* header */}
          <header className="app-header flex items-center px-1 py-2 bg-white">
            <button onClick={() => navigate(-1)} className="mr-3">
              <Back className="w-[18px] h-[18px]" />
            </button>
            <h1 className="pre_title_semi_20">찜목록</h1>
          </header>

          {/* chips */}
          <div className="mt-3 flex gap-2 overflow-auto pb-2">
            {chips.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setActiveChip(c)} // ✅ 클릭 시 필터 변경
                className={`shrink-0 rounded-md px-3 py-1.5 text-[13px] ${
                  c === activeChip
                    ? "bg-neutral-800 text-white"
                    : "bg-white border border-neutral-200 text-neutral-700"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* list */}
        <div className="mt-6 space-y-4">
          {filteredData.map((item) => (
            <article
              key={item.expertId}
              className="relative rounded-lg border border-neutral-200 bg-white p-4"
            >
              {/* heart */}
              <div className="absolute right-4 top-4">
                <button
                  type="button"
                  aria-label="like"
                  className="inline-flex items-center justify-center"
                >
                  <Heart className="h-5 w-5 fill-[#FF3434]" stroke="none" />
                </button>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full bg-neutral-200">
                  {item.profileImage && (
                    <img
                      src={item.profileImage}
                      alt={`${item.nickname} 프로필`}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3">
                    <h2 className="pre_subtitle_semi_16 text-[#292a2d] truncate">
                      {item.nickname}
                    </h2>
                    <span className="inline-flex items-center px-2 py-0.5 pre_cap_reg_12 bg-[#e5f4ff] text-[#008bff]">
                      {getLabelFromApiCategory(item.category)}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center gap-1">
                    <Star className="h-4 w-4 stroke-none" />
                    <span className="pre_cap_semi_13 text-[#989ba2]">
                      {item.ratingAverage ? item.ratingAverage.toFixed(1) : "0.0"}
                    </span>
                    <span className="pre_body_reg_13 text-[#878a93]">
                      ({item.reviewCount.toLocaleString()})
                    </span>
                  </div>

                  <p className="mt-3 pre_body_reg_13 text-[#878a93] line-clamp-2">
                    {item.introduction}
                  </p>

                  <div className="mt-4 flex items-center w-full">
                    <button type="button" className="pre_body_semi_13 text-[#008bff]">
                      바로 상담 가능
                    </button>

                    <button
                      type="button"
                      className="w-[84px] h-[32px] ml-auto rounded-[4px] bg-[#0f0f10] px-[10px] py-[6px] pre_body_med_14 text-white"
                    >
                      상담 예약
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}

          {/* (선택) 필터 결과가 없을 때 메시지 — 디자인 크게 안 바꿈 */}
          {!isLoading && filteredData.length === 0 && (
            <div className="py-10 text-center text-[13px] text-neutral-400">
              해당 카테고리의 찜이 없어요.
            </div>
          )}
          {isLoading && (
            <div className="py-10 text-center text-[13px] text-neutral-400">
              찜 목록을 불러오는 중이에요.
            </div>
          )}
        </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
