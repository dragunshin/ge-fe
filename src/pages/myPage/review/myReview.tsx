import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getReviewAvailable,
  getReviewCompleted,
  type ReviewAvailableItem,
  type ReviewCompletedItem,
} from "@/api/review";
import ExpertStar from "@/images/mypage/expertStar.svg?react";
import Back from "@/images/login/back.svg?react";
import DocIcon from "@/images/mypage/docIcon.svg?react";
import ExpandableContent from "./component/ExpandableContent";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type Tab = "available" | "completed";

function formatYYYYMMDD(iso: string) {
  const d = new Date(iso);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}.${mm}.${dd}`;
}

function toSafeIso(isoLike: string) {
  // "2026-01-12T05:20:05.342085" -> "2026-01-12T05:20:05.342085Z"
  // (Z가 없으면 UTC로 간주되게 붙여주기)
  return /Z$|[+-]\d{2}:\d{2}$/.test(isoLike) ? isoLike : `${isoLike}Z`;
}

function categoryLabel(cat: string) {
  if (cat === "HAIR") return "헤어";
  return cat;
}

export default function MyReviewPage() {
  const nav = useNavigate();
  const [tab, setTab] = useState<Tab>("available");

  const [available, setAvailable] = useState<ReviewAvailableItem[]>([]);
  const [completed, setCompleted] = useState<ReviewCompletedItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [expanded, setExpanded] = useState<Record<number, boolean>>({}); // reviewId -> expanded

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const [a, c] = await Promise.all([getReviewAvailable(), getReviewCompleted()]);
        if (!mounted) return;
        setAvailable(a.data ?? []);
        setCompleted(c.data ?? []);
      } catch (e) {
        console.error(e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    console.log(completed);

    return () => {
      mounted = false;
    };
  }, []);

  // const underlineStyle = useMemo(() => {
  //   return tab === "available" ? "translate-x-0" : "translate-x-full";
  // }, [tab]);

  return (
    <div className="min-h-screen bg-white">
      {/* header */}
      <header className="mt-3 mb-1 flex items-center px-1 py-2 ml-4 bg-white">
        <button onClick={() => nav(-1)} className="mr-[8px]">
          <Back className="w-[18px] h-[18px]" />
        </button>
        <p className="pre_title_semi_20">나의 후기</p>
      </header>

      {/* Tabs */}
      <div className="mt-2">
        <div className="relative mx-auto max-w-[420px] px-5">
          <div className="grid grid-cols-2">
            <button
              type="button"
              onClick={() => setTab("available")}
              className={cn(
                "w-full py-2 text-center pre_subtitle_semi_16",
                tab === "available" ? "text-[#181818]" : "text-[#878a93]",
              )}
            >
              작성 가능
            </button>

            <button
              type="button"
              onClick={() => setTab("completed")}
              className={cn(
                "w-full py-2 text-center pre_subtitle_semi_16",
                tab === "completed" ? "text-[#181818]" : "text-[#878a93]",
              )}
            >
              작성 완료
            </button>
          </div>

          {/* track + underline */}
          <div className="relative h-[2px] w-full bg-[#E5E5EA]">
            <div
              className={cn(
                "absolute left-0 top-0 h-full w-1/2 bg-[#008bff] transition-transform duration-200 will-change-transform",
                tab === "available" ? "translate-x-0" : "translate-x-full",
              )}
            />
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-[420px] px-5 pb-[calc(env(safe-area-inset-bottom)+24px)] pt-5">
        {loading ? (
          <div className="py-16 text-center text-[13px] text-[#8E8E93]">불러오는 중...</div>
        ) : tab === "available" ? (
          <AvailableTab
            items={available}
            onWrite={(consultationId) => nav(`/reviewWrite/${consultationId}`)}
            onGoExperts={() => nav("/explore")}
          />
        ) : (
          <CompletedTab
            items={completed}
            expanded={expanded}
            onToggle={(reviewId) => setExpanded((p) => ({ ...p, [reviewId]: !p[reviewId] }))}
          />
        )}
      </main>
    </div>
  );
}

/* ----------------------- Available Tab ----------------------- */

function AvailableTab({
  items,
  onWrite,
  onGoExperts,
}: {
  items: ReviewAvailableItem[];
  onWrite: (consultationId: number) => void;
  onGoExperts: () => void;
}) {
  if (items.length === 0) {
    return (
      <div>
        <div className="py-14 text-center">
          <div className="flex justify-center">
            <DocIcon className="w-[67px] h-[77px]" />
          </div>
          <div className="mt-5 pre_subtitle_semi_16text-[#46474c]">
            아직 작성 가능한 후기가 없어요
          </div>

          <button
            type="button"
            onClick={onGoExperts}
            className="mt-6 h-[40px] w-[175px] rounded-[4px] bg-[#181818] pre_subtitle_semi_16 text-white"
          >
            전문가 보러가기
          </button>
        </div>

        <div className="mt-6">
          <div className="pre_subtitle_semi_16 text-[#181818]">추천 전문가 리스트</div>

          {/* <div className="mt-3 rounded-[12px] border border-[#E5E5EA] bg-white p-4">
            <div className="flex items-start gap-3">
              <div className="h-[46px] w-[46px] shrink-0 rounded-full bg-[#D1D1D6]" />

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-[15px] font-semibold text-[#111111]">김푸힝</div>
                  <button type="button" aria-label="찜">
                    <HeartIcon />
                  </button>
                </div>

                <div className="mt-1 flex items-center gap-2">
                  <span className="rounded-[4px] bg-[#E8F1FF] px-2 py-[2px] text-[11px] font-semibold text-[#0A84FF]">
                    헤어
                  </span>
                  <span className="rounded-[4px] bg-[#F2F2F7] px-2 py-[2px] text-[11px] font-medium text-[#111111]">
                    세부고민 #1
                  </span>
                </div>

                <div className="mt-2 text-[12px] leading-5 text-[#8E8E93]">
                  전문가가 작성한 자신의 강점 한줄 쓱싹문가가 작성한 자신의 강점 한줄 쓱싹
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <button type="button" className="text-[12px] font-semibold text-[#0A84FF]">
                    바로 상담 가능
                  </button>

                  <button
                    type="button"
                    className="h-[34px] rounded-[8px] bg-[#111111] px-4 text-[13px] font-semibold text-white"
                  >
                    상담 예약
                  </button>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    );
  }

  return (
    <div>
      {items.map((it, idx) => {
        const date = formatYYYYMMDD(it.consultationDate);
        const cat = categoryLabel(it.category);

        return (
          <div key={it.consultationId} className={cn(idx !== 0 && "mt-6")}>
            <div className="pre_subtitle_med_16 text-[#0f0f10]">{date}</div>

            <div className="mt-3 flex items-start gap-3">
              <div className="h-[60px] w-[60px] shrink-0 overflow-hidden rounded-full bg-[#D1D1D6]">
                {it.expertProfileImage ? (
                  <img src={it.expertProfileImage} alt="" className="h-full w-full object-cover" />
                ) : null}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <div className="pre_subtitle_semi_16 text-[#292a2d]">{it.expertName}</div>
                  <span className="rounded-[2px] bg-[#e5f4ff] px-2 py-[4px] pre_cap_reg_12 text-[#008bff]">
                    {cat}
                  </span>
                </div>

                <div className="mt-2 pre_cap_reg_13 text-[#878a93]">{it.description || "공란"}</div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onWrite(it.consultationId)}
              className="mt-4 h-[40px] w-full rounded-[4px] bg-[#181818] pre_subtitle_semi_14 text-white"
            >
              후기 작성
            </button>

            {/* <div className="mt-6 h-[8px] bg-[#F2F2F7]" /> */}
            <div className={`h-2 bg-[#f1f1f6] mt-[18px] -mx-5`} />
          </div>
        );
      })}
    </div>
  );
}

/* ----------------------- Completed Tab ----------------------- */

function CompletedTab({
  items,
  expanded,
  onToggle,
}: {
  items: ReviewCompletedItem[];
  expanded: Record<number, boolean>;
  onToggle: (reviewId: number) => void;
}) {
  return (
    <div>
      {items.map((it, idx) => {
        // const date = formatYYYYMMDD(it.consultationDate);
        const date = formatYYYYMMDD(toSafeIso(it.createdAt ?? it.consultationDate));

        const isExpanded = Boolean(expanded[it.reviewId]);

        const img1 = it.imageUrls?.[0] ?? "";
        const img2 = it.imageUrls?.[1] ?? "";

        return (
          <div key={it.reviewId} className={cn(idx !== 0 && "mt-10")}>
            <div className="flex items-start justify-between">
              <div className="pre_subtitle_med_16 text-[#0f0f10]">{date}</div>

              <button
                type="button"
                aria-label="메뉴"
                className="h-[24px] w-[24px] -mr-2 flex items-center justify-center"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" className="fill-none">
                  <path d="M12 6.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" fill="#111111" />
                  <path d="M12 13.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" fill="#111111" />
                  <path d="M12 20.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" fill="#111111" />
                </svg>
              </button>
            </div>

            <div className="mt-3 flex items-center gap-1">
              <div className="pre_subtitle_semi_16 text-[#292a2d] mr-1">{it.expertName}</div>
              <ExpertStar className="w-[18px] h-[18px]" />
              <div className="pre_cap_semi_13 text-[#989ba2]">{it.rating.toFixed(1)}</div>
            </div>

            {/* images */}
            <div className="mt-4 flex gap-4">
              <div className="h-[112px] w-[112px] overflow-hidden rounded-[8px] bg-[#D1D1D6]">
                {img1 ? <img src={img1} alt="" className="h-full w-full object-cover" /> : null}
              </div>
              <div className="h-[112px] w-[112px] overflow-hidden rounded-[8px] bg-[#D1D1D6]">
                {img2 ? <img src={img2} alt="" className="h-full w-full object-cover" /> : null}
              </div>
            </div>

            {/* content */}
            {/* <div className="mt-4 text-[12px] leading-5 text-[#6B6B6B]">
              <div
                style={
                  isExpanded
                    ? undefined
                    : {
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }
                }
              >
                {it.content}
              </div>

              <button
                type="button"
                onClick={() => onToggle(it.reviewId)}
                className="mt-1 text-[12px] font-medium text-[#6B6B6B]"
              >
                {isExpanded ? "접기" : "… 더보기"}
              </button>
            </div> */}

            <ExpandableContent
              content={it.content}
              expanded={isExpanded}
              onToggle={() => onToggle(it.reviewId)}
              lines={3}
            />

            {/* hashtags */}
            {(it.hashtags?.length ?? 0) > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {it.hashtags!.map((tag, i) => (
                  <Chip key={`${it.reviewId}-tag-${i}`}>{tag}</Chip>
                ))}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function Chip({ children }: { children: string }) {
  return (
    <span className="rounded-[2px] bg-[#f4f4f5] px-2 py-1 pre_cap_reg_12 text-[#46474c]">
      {children}
    </span>
  );
}
