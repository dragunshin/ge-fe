import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Heart from "@/images/mypage/heart.svg?react";
import Back from "@/images/login/back.svg?react";
import Star from "@/images/mypage/star.svg?react";

type Category = "전체" | "헤어" | "스킨케어" | "패션" | "메이크업";

type Expert = {
  id: string;
  name: string;
  category: Exclude<Category, "전체">; // ✅ 전체는 데이터에 없음
  rating: string;
  reviews: string;
  description: string;
  availableNow?: boolean;
};

// (샘플) 카테고리 테스트가 되게 몇 개는 다르게 줌 — 실제 데이터 쓰면 이 부분은 그대로 교체하면 됨
const sampleData: Expert[] = [
  {
    id: "0",
    name: "김푸힝",
    category: "헤어",
    rating: "4.7",
    reviews: "(1,130)",
    description: "전문가가 작성한 자신의 강점 한줄 쓱싹문가가 작성한 자신의 강점 한줄 쓱싹",
    availableNow: true,
  },
  {
    id: "1",
    name: "김푸힝",
    category: "스킨케어",
    rating: "4.7",
    reviews: "(1,130)",
    description: "전문가가 작성한 자신의 강점 한줄 쓱싹문가가 작성한 자신의 강점 한줄 쓱싹",
    availableNow: true,
  },
  {
    id: "2",
    name: "김푸힝",
    category: "패션",
    rating: "4.7",
    reviews: "(1,130)",
    description: "전문가가 작성한 자신의 강점 한줄 쓱싹문가가 작성한 자신의 강점 한줄 쓱싹",
    availableNow: true,
  },
];

export default function LikedListPage() {
  const navigate = useNavigate();

  const chips: Category[] = ["전체", "헤어", "스킨케어", "패션", "메이크업"];

  // ✅ 선택 상태
  const [activeChip, setActiveChip] = useState<Category>("스킨케어");

  // ✅ 선택 카테고리에 맞게 필터링
  const filteredData = useMemo(() => {
    if (activeChip === "전체") return sampleData;
    return sampleData.filter((x) => x.category === activeChip);
  }, [activeChip]);

  return (
    <div className="min-h-screen bg-white">
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
              key={item.id}
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
                <div className="h-14 w-14 shrink-0 rounded-full bg-neutral-200" />

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3">
                    <h2 className="pre_subtitle_semi_16 text-[#292a2d] truncate">{item.name}</h2>
                    <span className="inline-flex items-center px-2 py-0.5 pre_cap_reg_12 bg-[#e5f4ff] text-[#008bff]">
                      {item.category}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center gap-1">
                    <Star className="h-4 w-4 stroke-none" />
                    <span className="pre_cap_semi_13 text-[#989ba2]">{item.rating}</span>
                    <span className="pre_body_reg_13 text-[#878a93]">{item.reviews}</span>
                  </div>

                  <p className="mt-3 pre_body_reg_13 text-[#878a93] line-clamp-2">
                    {item.description}
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
          {filteredData.length === 0 && (
            <div className="py-10 text-center text-[13px] text-neutral-400">
              해당 카테고리의 찜이 없어요.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
