import { useCallback, useEffect, useState, useRef } from "react";
import { getConsultationConcern, type HairConcern } from "@/api/concern";

export function useConsultationConcern(consultationId: number | null | undefined) {
  const [data, setData] = useState<HairConcern | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  const fetchConcern = useCallback(async () => {
    if (consultationId == null) return;

    // 이전 요청이 있으면 중단
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    setLoading(true);
    setError(null);

    try {
      const d = await getConsultationConcern(consultationId, ac.signal);
      if (ac.signal.aborted) return; // 중단된 요청이면 state 업데이트 스킵
      setData(d);
    } catch (e) {
      if (ac.signal.aborted) return;
      const msg = e instanceof Error ? e.message : "Unknown error";
      setError(msg);
    } finally {
      if (!ac.signal.aborted) setLoading(false);
    }
  }, [consultationId]);

  useEffect(() => {
    void fetchConcern();
    return () => abortRef.current?.abort();
  }, [fetchConcern]);

  return { data, loading, error, refetch: fetchConcern };
}

// src/pages/ConsultationConcernView.tsx
import { useMemo } from "react";

import { resolveImageUrl } from "@/api/concern";
import { useParams } from "react-router-dom";

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-[#F2F3F5] px-3 py-1 text-[13px] text-[#181818]">
      {children}
    </span>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-[#ECEEF2] bg-white p-4">
      <div className="text-[15px] font-semibold text-[#181818]">{title}</div>
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

export default function ConcernView() {
  const { consultationId } = useParams();

  const consultationIdNum = useMemo(() => {
    if (!consultationId) return null;
    const n = Number(consultationId);
    return Number.isFinite(n) ? n : null;
  }, [consultationId]);

  const { data, loading, error, refetch } = useConsultationConcern(consultationIdNum);
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);

  const hair = data?.hair;

  const faceAdvantages = useMemo(() => {
    if (!hair) return [];
    const base = hair.faceAdvantages ?? [];
    return hair.faceAdvantagesEtcText?.trim()
      ? [...base, `기타: ${hair.faceAdvantagesEtcText.trim()}`]
      : base;
  }, [hair]);

  const coveringParts = useMemo(() => {
    if (!hair) return [];
    const base = hair.coveringParts ?? [];
    return hair.coveringPartsEtcText?.trim()
      ? [...base, `기타: ${hair.coveringPartsEtcText.trim()}`]
      : base;
  }, [hair]);

  if (loading) {
    return <div className="p-4 text-[14px] text-[#5B5D66]">불러오는 중…</div>;
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="rounded-2xl border border-[#F3D6D6] bg-[#FFF5F5] p-4 text-[14px] text-[#B42318]">
          데이터를 불러오지 못했어요: {error}
        </div>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-3 w-full rounded-xl bg-[#111] py-3 text-[14px] font-semibold text-white"
        >
          다시 시도
        </button>
      </div>
    );
  }

  if (!hair) {
    return <div className="p-4 text-[14px] text-[#5B5D66]">표시할 데이터가 없어요.</div>;
  }

  return (
    <div className="min-h-screen bg-[#F7F8FA] p-4">
      <div className="mb-4 pre_title_semi_18 text-[#181818]">" "님의 헤어 고민 요약</div>

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
