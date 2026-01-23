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

  const [activeChip, setActiveChip] = useState<Category>("전체");
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

  const filteredData = useMemo(() => {
    const source = likedExperts ?? [];
    if (activeChip === "전체") return source;
    return source.filter((item) => getLabelFromApiCategory(item.category) === activeChip);
  }, [activeChip, likedExperts]);

  // ✅ 하트 클릭: 찜취소(목록에서 제거)
  const handleToggleLike = async (expertId: number) => {
    try {
      await expertService.unlikeExpert(expertId);
      setLikedExperts((prev) => prev.filter((e) => e.expertId !== expertId));
    } catch (error) {
      console.error("Failed to unlike expert:", error);
    }
  };

  return (
    <div className="flex h-full flex-col bg-white">
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-md px-4 pb-12">
          <div className="pt-6">
            {/* header */}
            <header className="flex items-center px-1 py-2 bg-white">
              <button onClick={() => navigate(-1)} className="mr-3">
                <Back className="w-[18px] h-[18px]" />
              </button>
              <h1 className="pre_title_semi_20">찜목록</h1>
            </header>

            {/* chips */}
            <div className="mt-3 flex gap-1.5 overflow-auto pb-2">
              {chips.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setActiveChip(c)}
                  className={`whitespace-nowrap rounded-[4px] border px-3 py-[6px] pre_cap_reg_13 ${
                    c === activeChip
                      ? "pre_cap_semi_13 bg-[#46474c] text-white"
                      : "bg-white border-[#dbdcdf] text-[#46474c]"
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
                {/* heart (위치 고정) */}
                <div className="absolute right-4 top-4">
                  {/* <button
                    type="button"
                    aria-label="like"
                    className="inline-flex items-center justify-center"
                  >
                    <Heart className="h-6 w-6 fill-[#FF3434]" stroke="none" />
                  </button> */}

                  <button
                    type="button"
                    aria-label="like"
                    className="inline-flex items-center justify-center"
                    onClick={() => handleToggleLike(item.expertId)}
                  >
                    <Heart className="h-6 w-6 fill-[#FF3434]" stroke="none" />
                  </button>
                </div>

                {/* [수정 1] 상단 영역: 아바타 + 이름/평점 (Flex 컨테이너) */}
                <div className="flex items-start gap-4">
                  {/* avatar */}
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

                  {/* right content (이름, 평점 정보만 남김) */}
                  <div className="min-w-0 flex-1 pr-8">
                    {/* name + category */}
                    <div className="flex items-center gap-3">
                      <p
                        className="pre_subtitle_semi_16 truncate text-[#292a2d] cursor-pointer hover:opacity-70"
                        onClick={() => navigate(`/experts/${item.expertId}`)}
                      >
                        {item.nickname}
                      </p>
                      <span className="pre_cap_reg_12 inline-flex items-center bg-[#e5f4ff] px-2 py-1 text-[#008bff]">
                        {getLabelFromApiCategory(item.category)}
                      </span>
                    </div>

                    {/* rating */}
                    <div className="mt-2 flex items-center gap-1">
                      <Star className="h-4 w-4 stroke-none" />
                      <span className="pre_cap_semi_13 text-[#989ba2]">
                        {item.ratingAverage ? item.ratingAverage.toFixed(1) : "0.0"}
                      </span>
                      <span className="pre_body_reg_13 text-[#878a93]">
                        ({item.reviewCount.toLocaleString()})
                      </span>
                    </div>
                  </div>
                </div>

                {/* ✅ 별점 아래 구분선 (사진상으로는 구분선 없이 공백만 있어 보여 제거하거나 필요시 유지) */}
                {/* <div className="mt-3 h-px w-full bg-[#E5E5EA]" /> */}

                {/* [수정 2] 소개글: Flex 컨테이너 밖으로 꺼내서 전체 너비 사용 */}
                <p className="pre_body_reg_13 mt-4 line-clamp-2 text-[#878a93]">
                  {item.introduction}
                </p>

                {/* [수정 3] 하단 버튼 영역: Flex 컨테이너 밖으로 꺼내고 justify-between 적용 */}
                <div className="mt-4 flex w-full items-center justify-between">
                  <button type="button" className="pre_body_semi_13 text-[#008bff]">
                    바로 상담 가능
                  </button>

                  <button
                    onClick={() => navigate(`/experts/${item.expertId}`)}
                    type="button"
                    className="pre_body_med_14 ml-auto h-[32px] w-[84px] rounded-[4px] bg-[#0f0f10] px-[10px] py-[6px] text-white"
                  >
                    상담 예약
                  </button>
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
