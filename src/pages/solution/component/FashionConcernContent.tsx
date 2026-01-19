import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { resolveImageUrl, type FashionConcern } from "@/api/concern";

/** utils */
function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type Fashion = FashionConcern["fashion"];

function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-[#F2F3F5] px-3 py-1 text-[13px] text-[#181818]">
      {children}
    </span>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-[#ECEEF2] bg-white p-4">
      <div className="text-[15px] font-semibold text-[#181818]">{title}</div>
      <div className="mt-3">{children}</div>
    </section>
  );
}

type ImageCategoryKey = "front" | "left" | "right" | "favorite" | "purpose";
const IMAGE_LABEL: Record<ImageCategoryKey, string> = {
  front: "정면",
  left: "왼쪽 측면",
  right: "오른쪽 측면",
  favorite: "마음에 드는 사진(선택)",
  purpose: "목적/참고(선택)",
};

function ImageGrid({
  title,
  keys,
  onClick,
}: {
  title: string;
  keys: string[];
  onClick: (url: string) => void;
}) {
  if (!keys?.length) {
    return <div className="text-[13px] text-[#8E9097]">등록된 이미지가 없어요.</div>;
  }

  return (
    <div>
      <div className="mb-2 text-[13px] text-[#5B5D66]">{title}</div>
      <div className="grid grid-cols-3 gap-2">
        {keys.map((k, i) => {
          const url = resolveImageUrl(k);
          return (
            <button
              key={`${k}-${i}`}
              type="button"
              onClick={() => onClick(url)}
              className="relative aspect-square overflow-hidden rounded-xl border border-[#ECEEF2] bg-[#F7F8FA]"
            >
              <img src={url} alt={title} className="h-full w-full object-cover" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Lightbox({ url, onClose }: { url: string; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="max-h-[80vh] w-full max-w-[520px] overflow-hidden rounded-2xl bg-black"
        onClick={(e) => e.stopPropagation()}
      >
        <img src={url} alt="preview" className="h-full w-full object-contain" />
        <button
          type="button"
          onClick={onClose}
          className="w-full bg-[#111] py-3 text-[14px] font-medium text-white"
        >
          닫기
        </button>
      </div>
    </div>
  );
}

function formatPrice(n: number) {
  if (!Number.isFinite(n)) return "-";
  return n.toLocaleString("ko-KR");
}

export function FashionConcernContent({
  fashion,
  nickname,
  showTitle = false,
  className,
}: {
  fashion: Fashion;
  nickname?: string;
  showTitle?: boolean;
  className?: string;
}) {
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);

  const disadvantages = useMemo(() => {
    const base = fashion.bodyTypeDisadvantages ?? [];
    return fashion.bodyTypeEtcText?.trim()
      ? [...base, `기타: ${fashion.bodyTypeEtcText.trim()}`]
      : base;
  }, [fashion.bodyTypeDisadvantages, fashion.bodyTypeEtcText]);

  const styleImages = useMemo(() => {
    const base = fashion.styleImages ?? [];
    return fashion.styleEtcText?.trim() ? [...base, `기타: ${fashion.styleEtcText.trim()}`] : base;
  }, [fashion.styleImages, fashion.styleEtcText]);

  const priceText = `${formatPrice(fashion.outfitPriceRange?.minPrice ?? 0)} ~ ${formatPrice(
    fashion.outfitPriceRange?.maxPrice ?? 0,
  )}원`;

  return (
    <div className={cn(className)}>
      {showTitle && (
        <div className="mb-4 pre_title_semi_18 text-[#181818]">
          {nickname ?? ""}님의 패션 고민지
        </div>
      )}

      <div className="space-y-3">
        <Section title="기본 정보">
          <div className="grid grid-cols-2 gap-2 text-[14px] text-[#181818]">
            <div className="rounded-xl bg-[#F2F3F5] p-3">키: {fashion.height}cm</div>
            <div className="rounded-xl bg-[#F2F3F5] p-3">몸무게: {fashion.weight}kg</div>
            <div className="rounded-xl bg-[#F2F3F5] p-3">상의 사이즈: {fashion.topSize}</div>
            <div className="rounded-xl bg-[#F2F3F5] p-3">하의 사이즈: {fashion.bottomSize}</div>
          </div>
        </Section>

        <Section title="체형 고민/단점">
          <div className="flex flex-wrap gap-2">
            {disadvantages.length ? (
              disadvantages.map((t) => <Chip key={t}>{t}</Chip>)
            ) : (
              <div className="text-[13px] text-[#8E9097]">선택 없음</div>
            )}
          </div>
        </Section>

        <Section title="선호 스타일">
          <div className="space-y-3">
            <div>
              <div className="mb-2 text-[13px] text-[#5B5D66]">컬러</div>
              <div className="flex flex-wrap gap-2">
                {fashion.styleColors?.length ? (
                  fashion.styleColors.map((t) => <Chip key={t}>{t}</Chip>)
                ) : (
                  <div className="text-[13px] text-[#8E9097]">선택 없음</div>
                )}
              </div>
            </div>

            <div>
              <div className="mb-2 text-[13px] text-[#5B5D66]">핏</div>
              <div className="flex flex-wrap gap-2">
                {fashion.styleFits?.length ? (
                  fashion.styleFits.map((t) => <Chip key={t}>{t}</Chip>)
                ) : (
                  <div className="text-[13px] text-[#8E9097]">선택 없음</div>
                )}
              </div>
            </div>

            <div>
              <div className="mb-2 text-[13px] text-[#5B5D66]">이미지</div>
              <div className="flex flex-wrap gap-2">
                {styleImages.length ? (
                  styleImages.map((t) => <Chip key={t}>{t}</Chip>)
                ) : (
                  <div className="text-[13px] text-[#8E9097]">선택 없음</div>
                )}
              </div>
            </div>
          </div>
        </Section>

        <Section title="관심 아이템/예산">
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {fashion.outfitItems?.length ? (
                fashion.outfitItems.map((t) => <Chip key={t}>{t}</Chip>)
              ) : (
                <div className="text-[13px] text-[#8E9097]">선택 없음</div>
              )}
            </div>
            <div className="rounded-xl bg-[#F2F3F5] p-3 text-[14px] text-[#181818]">
              가격대: {priceText}
            </div>
            {fashion.outfitEtcText?.trim() && (
              <div className="rounded-xl bg-[#F2F3F5] p-3 text-[14px] text-[#181818]">
                기타: {fashion.outfitEtcText.trim()}
              </div>
            )}
          </div>
        </Section>

        <Section title="첨부 이미지">
          <div className="space-y-4">
            {(["front", "left", "right", "favorite", "purpose"] as ImageCategoryKey[]).map((k) => (
              <ImageGrid
                key={k}
                title={IMAGE_LABEL[k]}
                keys={fashion.images?.[k] ?? []}
                onClick={(url) => setSelectedUrl(url)}
              />
            ))}
          </div>
        </Section>
      </div>

      {selectedUrl && <Lightbox url={selectedUrl} onClose={() => setSelectedUrl(null)} />}
    </div>
  );
}
