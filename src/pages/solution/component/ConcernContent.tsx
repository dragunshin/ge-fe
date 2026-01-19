// src/components/concern/ConcernContent.tsx
import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { resolveImageUrl, type HairConcern } from "@/api/concern";

/** utils */
function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type ConcernHair = HairConcern["hair"];

function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-[#F6F6F7] px-3 py-1 pre_body_reg_13 text-[#181818]">
      {children}
    </span>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-[#dbdcdf] bg-white p-4">
      <div className="pre_subtitle_semi_16 text-[#181818]">{title}</div>
      <div className="mt-3">{children}</div>
    </section>
  );
}

type ImageCategoryKey = "hairstyle" | "front" | "left" | "right" | "favorite" | "difficulty";
const IMAGE_LABEL: Record<ImageCategoryKey, string> = {
  hairstyle: "헤어 스타일 참고",
  front: "정면",
  left: "왼쪽 측면",
  right: "오른쪽 측면",
  favorite: "마음에 드는 사진(선택)",
  difficulty: "어려움 관련(선택)",
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

/**
 * ✅ UI만 담당 (fetch/params 없음)
 * - ConcernView(페이지), EditorPage(전문가) 어디서든 재사용 가능
 */
export function ConcernContent({
  hair,
  nickname,
  showTitle = false,
  className,
}: {
  hair: ConcernHair;
  nickname?: string;
  showTitle?: boolean;
  className?: string;
}) {
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);

  const faceAdvantages = useMemo(() => {
    const base = hair.faceAdvantages ?? [];
    return hair.faceAdvantagesEtcText?.trim()
      ? [...base, `기타: ${hair.faceAdvantagesEtcText.trim()}`]
      : base;
  }, [hair.faceAdvantages, hair.faceAdvantagesEtcText]);

  const coveringParts = useMemo(() => {
    const base = hair.coveringParts ?? [];
    return hair.coveringPartsEtcText?.trim()
      ? [...base, `기타: ${hair.coveringPartsEtcText.trim()}`]
      : base;
  }, [hair.coveringParts, hair.coveringPartsEtcText]);

  return (
    <div className={cn(className)}>
      {showTitle && (
        <div className="mb-4 pre_title_semi_18 text-[#181818]">
          {nickname ?? ""}님의 헤어 고민지
        </div>
      )}

      <div className="space-y-3">
        <Section title="얼굴 장점">
          <div className="flex flex-wrap gap-2">
            {faceAdvantages.length ? (
              faceAdvantages.map((t) => <Chip key={t}>{t}</Chip>)
            ) : (
              <div className="text-[13px] text-[#8E9097]">선택 없음</div>
            )}
          </div>
        </Section>

        <Section title="커버하고 싶은 부위">
          <div className="flex flex-wrap gap-2">
            {coveringParts.length ? (
              coveringParts.map((t) => <Chip key={t}>{t}</Chip>)
            ) : (
              <div className="text-[13px] text-[#8E9097]">선택 없음</div>
            )}
          </div>
        </Section>

        <Section title="추구하는 이미지">
          <div className="flex flex-wrap gap-2">
            {hair.pursuedImages?.length ? (
              hair.pursuedImages.map((t) => <Chip key={t}>{t}</Chip>)
            ) : (
              <div className="text-[13px] text-[#8E9097]">선택 없음</div>
            )}
          </div>
        </Section>

        <Section title="스타일링 어려움/궁금증">
          <div className="whitespace-pre-wrap rounded-xl bg-[#F2F3F5] p-3 text-[14px] leading-6 text-[#181818]">
            {hair.stylingDifficulty?.trim() || "작성된 내용이 없어요."}
          </div>
        </Section>

        <Section title="첨부 이미지">
          <div className="space-y-4">
            {(
              [
                "hairstyle",
                "front",
                "left",
                "right",
                "favorite",
                "difficulty",
              ] as ImageCategoryKey[]
            ).map((k) => (
              <ImageGrid
                key={k}
                title={IMAGE_LABEL[k]}
                keys={hair.images?.[k] ?? []}
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
