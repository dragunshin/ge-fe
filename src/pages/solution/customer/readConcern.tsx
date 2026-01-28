// import { useConsultationConcern } from "@/hooks/useConsulation";
// import { useMemo, useState } from "react";

// import { resolveImageUrl } from "@/api/concern";
// import { useParams, useNavigate } from "react-router-dom";
// import Back from "@/images/login/back.svg?react";

// function Chip({ children }: { children: React.ReactNode }) {
//   return (
//     <span className="inline-flex items-center rounded-full bg-[#F6F6F7] px-3 py-1 pre_body_reg_13 text-[#181818]">
//       {children}
//     </span>
//   );
// }

// function Section({ title, children }: { title: string; children: React.ReactNode }) {
//   return (
//     <section className="rounded-2xl border border-[#dbdcdf] bg-white p-4">
//       <div className="pre_subtitle_semi_16 text-[#181818]">{title}</div>
//       <div className="mt-3">{children}</div>
//     </section>
//   );
// }

// type ImageCategoryKey = "hairstyle" | "front" | "left" | "right" | "favorite" | "difficulty";
// const IMAGE_LABEL: Record<ImageCategoryKey, string> = {
//   hairstyle: "헤어 스타일 참고",
//   front: "정면",
//   left: "왼쪽 측면",
//   right: "오른쪽 측면",
//   favorite: "마음에 드는 사진(선택)",
//   difficulty: "어려움 관련(선택)",
// };

// function ImageGrid({
//   title,
//   keys,
//   onClick,
// }: {
//   title: string;
//   keys: string[];
//   onClick: (url: string) => void;
// }) {
//   if (!keys?.length) {
//     return <div className="text-[13px] text-[#8E9097]">등록된 이미지가 없어요.</div>;
//   }

//   return (
//     <div>
//       <div className="mb-2 text-[13px] text-[#5B5D66]">{title}</div>
//       <div className="grid grid-cols-3 gap-2">
//         {keys.map((k, i) => {
//           const url = resolveImageUrl(k);
//           return (
//             <button
//               key={`${k}-${i}`}
//               type="button"
//               onClick={() => onClick(url)}
//               className="relative aspect-square overflow-hidden rounded-xl border border-[#ECEEF2] bg-[#F7F8FA]"
//             >
//               <img src={url} alt={title} className="h-full w-full object-cover" />
//             </button>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

// function Lightbox({ url, onClose }: { url: string; onClose: () => void }) {
//   return (
//     <div
//       className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
//       onClick={onClose}
//       role="presentation"
//     >
//       <div
//         className="max-h-[80vh] w-full max-w-[520px] overflow-hidden rounded-2xl bg-black"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <img src={url} alt="preview" className="h-full w-full object-contain" />
//         <button
//           type="button"
//           onClick={onClose}
//           className="w-full bg-[#111] py-3 text-[14px] font-medium text-white"
//         >
//           닫기
//         </button>
//       </div>
//     </div>
//   );
// }

// export default function ConcernView() {
//   const { consultationId } = useParams();

//   const nav = useNavigate();

//   const consultationIdNum = useMemo(() => {
//     if (!consultationId) return null;
//     const n = Number(consultationId);
//     return Number.isFinite(n) ? n : null;
//   }, [consultationId]);

//   const { data, loading, error, refetch } = useConsultationConcern(consultationIdNum);
//   const [selectedUrl, setSelectedUrl] = useState<string | null>(null);

//   const hair = data?.hair;

//   const faceAdvantages = useMemo(() => {
//     if (!hair) return [];
//     const base = hair.faceAdvantages ?? [];
//     return hair.faceAdvantagesEtcText?.trim()
//       ? [...base, `기타: ${hair.faceAdvantagesEtcText.trim()}`]
//       : base;
//   }, [hair]);

//   const coveringParts = useMemo(() => {
//     if (!hair) return [];
//     const base = hair.coveringParts ?? [];
//     return hair.coveringPartsEtcText?.trim()
//       ? [...base, `기타: ${hair.coveringPartsEtcText.trim()}`]
//       : base;
//   }, [hair]);

//   if (loading) {
//     return <div className="p-4 text-[14px] text-[#5B5D66]">불러오는 중…</div>;
//   }

//   if (error) {
//     return (
//       <div className="p-4">
//         <div className="rounded-2xl border border-[#F3D6D6] bg-[#FFF5F5] p-4 text-[14px] text-[#B42318]">
//           데이터를 불러오지 못했어요: {error}
//         </div>
//         <button
//           type="button"
//           onClick={() => refetch()}
//           className="mt-3 w-full rounded-xl bg-[#111] py-3 text-[14px] font-semibold text-white"
//         >
//           다시 시도
//         </button>
//       </div>
//     );
//   }

//   if (!hair) {
//     return <div className="p-4 text-[14px] text-[#5B5D66]">표시할 데이터가 없어요.</div>;
//   }

//   return (
//     <div className="min-h-screen bg-[#F6F6F7] p-4">
//       {/* Top bar */}
//       <header className="px-2 mb-2">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center px-1 py-2">
//             <button onClick={() => nav(-1)} className="mr-[8px]">
//               <Back className="w-[18px] h-[18px]" />
//             </button>
//             <p className="pre_title_semi_18 ml-1">{data.nickname}님의 고민지</p>
//           </div>
//         </div>
//       </header>
//       {/* <div className="mb-2 ml-2 pre_title_semi_18 text-[#181818]">{data.nickname}님의 고민지</div> */}

//       <div className="space-y-3">
//         <Section title="얼굴 장점">
//           <div className="flex flex-wrap gap-2">
//             {faceAdvantages.length ? (
//               faceAdvantages.map((t) => <Chip key={t}>{t}</Chip>)
//             ) : (
//               <div className="text-[13px] text-[#8E9097]">선택 없음</div>
//             )}
//           </div>
//         </Section>

//         <Section title="커버하고 싶은 부위">
//           <div className="flex flex-wrap gap-2">
//             {coveringParts.length ? (
//               coveringParts.map((t) => <Chip key={t}>{t}</Chip>)
//             ) : (
//               <div className="text-[13px] text-[#8E9097]">선택 없음</div>
//             )}
//           </div>
//         </Section>

//         <Section title="추구하는 이미지">
//           <div className="flex flex-wrap gap-2">
//             {hair.pursuedImages?.length ? (
//               hair.pursuedImages.map((t) => <Chip key={t}>{t}</Chip>)
//             ) : (
//               <div className="text-[13px] text-[#8E9097]">선택 없음</div>
//             )}
//           </div>
//         </Section>

//         <Section title="스타일링 어려움/궁금증">
//           <div className="whitespace-pre-wrap rounded-xl bg-[#F2F3F5] p-3 pre_body_reg_13 text-[#181818]">
//             {hair.stylingDifficulty?.trim() || "작성된 내용이 없어요."}
//           </div>
//         </Section>

//         <Section title="첨부 이미지">
//           <div className="space-y-4">
//             {(
//               [
//                 "hairstyle",
//                 "front",
//                 "left",
//                 "right",
//                 "favorite",
//                 "difficulty",
//               ] as ImageCategoryKey[]
//             ).map((k) => (
//               <ImageGrid
//                 key={k}
//                 title={IMAGE_LABEL[k]}
//                 keys={hair.images?.[k] ?? []}
//                 onClick={(url) => setSelectedUrl(url)}
//               />
//             ))}
//           </div>
//         </Section>
//       </div>

//       {selectedUrl && <Lightbox url={selectedUrl} onClose={() => setSelectedUrl(null)} />}
//     </div>
//   );
// }

import { useConsultationConcern } from "@/hooks/useConsulation";
import { useMemo, useState } from "react";

import { resolveImageUrl } from "@/api/concern";
import { useParams, useNavigate } from "react-router-dom";
import Back from "@/images/login/back.svg?react";

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-[#F6F6F7] px-3 py-1 pre_body_reg_13 text-[#181818]">
      {children}
    </span>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-[#dbdcdf] bg-white p-4">
      <div className="pre_subtitle_semi_16 text-[#181818]">{title}</div>
      <div className="mt-3">{children}</div>
    </section>
  );
}

/** ===================== */
/** HAIR IMAGE CATEGORIES */
/** ===================== */
type HairImageCategoryKey = "hairstyle" | "front" | "left" | "right" | "favorite" | "difficulty";
const HAIR_IMAGE_LABEL: Record<HairImageCategoryKey, string> = {
  hairstyle: "헤어 스타일 참고",
  front: "정면",
  left: "왼쪽 측면",
  right: "오른쪽 측면",
  favorite: "마음에 드는 사진(선택)",
  difficulty: "어려움 관련(선택)",
};

/** ======================== */
/** FASHION IMAGE CATEGORIES */
/** ======================== */
type FashionImageCategoryKey = "front" | "left" | "right" | "favorite" | "purpose";
const FASHION_IMAGE_LABEL: Record<FashionImageCategoryKey, string> = {
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

function formatKRW(n: number) {
  if (!Number.isFinite(n)) return "-";
  return n.toLocaleString("ko-KR");
}

export default function ConcernView() {
  const { consultationId } = useParams();
  const nav = useNavigate();

  const consultationIdNum = useMemo(() => {
    if (!consultationId) return null;
    const n = Number(consultationId);
    return Number.isFinite(n) ? n : null;
  }, [consultationId]);

  const { data, loading, error, refetch } = useConsultationConcern(consultationIdNum);
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);

  // ✅ 여기서 hair/fashion 분기
  const hair = (data as any)?.hair as any | undefined;
  const fashion = (data as any)?.fashion as any | undefined;

  /** ======= HAIR derived ======= */
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

  /** ======= FASHION derived ======= */
  const bodyTypeDisadvantages = useMemo(() => {
    if (!fashion) return [];
    const base = fashion.bodyTypeDisadvantages ?? [];
    return fashion.bodyTypeEtcText?.trim()
      ? [...base, `기타: ${fashion.bodyTypeEtcText.trim()}`]
      : base;
  }, [fashion]);

  const styleImages = useMemo(() => {
    if (!fashion) return [];
    const base = fashion.styleImages ?? [];
    return fashion.styleEtcText?.trim() ? [...base, `기타: ${fashion.styleEtcText.trim()}`] : base;
  }, [fashion]);

  const outfitEtcText = useMemo(() => {
    if (!fashion) return "";
    return fashion.outfitEtcText?.trim?.() ? fashion.outfitEtcText.trim() : "";
  }, [fashion]);

  const priceText = useMemo(() => {
    if (!fashion) return "";
    const min = fashion.outfitPriceRange?.minPrice ?? 0;
    const max = fashion.outfitPriceRange?.maxPrice ?? 0;
    return `${formatKRW(min)} ~ ${formatKRW(max)}원`;
  }, [fashion]);

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

  // ✅ hair도 fashion도 없으면
  if (!hair && !fashion) {
    return <div className="p-4 text-[14px] text-[#5B5D66]">표시할 데이터가 없어요.</div>;
  }

  return (
    <div className="min-h-screen bg-[#F6F6F7] p-4">
      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-[#F6F6F7] px-2 mb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center px-1 py-2">
            <button onClick={() => nav(-1)} className="mr-[8px]">
              <Back className="w-[18px] h-[18px]" />
            </button>
            <p className="pre_title_semi_18 ml-1">{data?.nickname}님의 고민지</p>
          </div>
        </div>
      </header>

      {/* ===================== */}
      {/* ✅ HAIR VIEW (기존 그대로) */}
      {/* ===================== */}
      {hair && (
        <div className="space-y-3">
          <Section title="얼굴 장점">
            <div className="flex flex-wrap gap-2">
              {faceAdvantages.length ? (
                faceAdvantages.map((t: string) => <Chip key={t}>{t}</Chip>)
              ) : (
                <div className="text-[13px] text-[#8E9097]">선택 없음</div>
              )}
            </div>
          </Section>

          <Section title="커버하고 싶은 부위">
            <div className="flex flex-wrap gap-2">
              {coveringParts.length ? (
                coveringParts.map((t: string) => <Chip key={t}>{t}</Chip>)
              ) : (
                <div className="text-[13px] text-[#8E9097]">선택 없음</div>
              )}
            </div>
          </Section>

          <Section title="추구하는 이미지">
            <div className="flex flex-wrap gap-2">
              {hair.pursuedImages?.length ? (
                hair.pursuedImages.map((t: string) => <Chip key={t}>{t}</Chip>)
              ) : (
                <div className="text-[13px] text-[#8E9097]">선택 없음</div>
              )}
            </div>
          </Section>

          <Section title="스타일링 어려움/궁금증">
            <div className="whitespace-pre-wrap rounded-xl bg-[#F2F3F5] p-3 pre_body_reg_13 text-[#181818]">
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
                ] as HairImageCategoryKey[]
              ).map((k) => (
                <ImageGrid
                  key={k}
                  title={HAIR_IMAGE_LABEL[k]}
                  keys={hair.images?.[k] ?? []}
                  onClick={(url) => setSelectedUrl(url)}
                />
              ))}
            </div>
          </Section>
        </div>
      )}

      {/* ======================== */}
      {/* ✅ FASHION VIEW (추가)    */}
      {/* ======================== */}
      {fashion && (
        <div className="space-y-3">
          <Section title="기본 정보">
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl bg-[#F2F3F5] p-3 pre_body_reg_13 text-[#181818]">
                키: {fashion.height}cm
              </div>
              <div className="rounded-xl bg-[#F2F3F5] p-3 pre_body_reg_13 text-[#181818]">
                몸무게: {fashion.weight}kg
              </div>
              <div className="rounded-xl bg-[#F2F3F5] p-3 pre_body_reg_13 text-[#181818]">
                상의 사이즈: {fashion.topSize}
              </div>
              <div className="rounded-xl bg-[#F2F3F5] p-3 pre_body_reg_13 text-[#181818]">
                하의 사이즈: {fashion.bottomSize}
              </div>
            </div>
          </Section>

          <Section title="체형 고민/단점">
            <div className="flex flex-wrap gap-2">
              {bodyTypeDisadvantages.length ? (
                bodyTypeDisadvantages.map((t: string) => <Chip key={t}>{t}</Chip>)
              ) : (
                <div className="text-[13px] text-[#8E9097]">선택 없음</div>
              )}
            </div>
          </Section>

          <Section title="선호 컬러">
            <div className="flex flex-wrap gap-2">
              {fashion.styleColors?.length ? (
                fashion.styleColors.map((t: string) => <Chip key={t}>{t}</Chip>)
              ) : (
                <div className="text-[13px] text-[#8E9097]">선택 없음</div>
              )}
            </div>
          </Section>

          <Section title="선호 핏">
            <div className="flex flex-wrap gap-2">
              {fashion.styleFits?.length ? (
                fashion.styleFits.map((t: string) => <Chip key={t}>{t}</Chip>)
              ) : (
                <div className="text-[13px] text-[#8E9097]">선택 없음</div>
              )}
            </div>
          </Section>

          <Section title="추구하는 이미지">
            <div className="flex flex-wrap gap-2">
              {styleImages.length ? (
                styleImages.map((t: string) => <Chip key={t}>{t}</Chip>)
              ) : (
                <div className="text-[13px] text-[#8E9097]">선택 없음</div>
              )}
            </div>
          </Section>

          <Section title="관심 아이템">
            <div className="flex flex-wrap gap-2">
              {fashion.outfitItems?.length ? (
                fashion.outfitItems.map((t: string) => <Chip key={t}>{t}</Chip>)
              ) : (
                <div className="text-[13px] text-[#8E9097]">선택 없음</div>
              )}
            </div>

            <div className="mt-3 space-y-2">
              <div className="rounded-xl bg-[#F2F3F5] p-3 pre_body_reg_13 text-[#181818]">
                가격대: {priceText}
              </div>
              {outfitEtcText && (
                <div className="rounded-xl bg-[#F2F3F5] p-3 pre_body_reg_13 text-[#181818]">
                  기타: {outfitEtcText}
                </div>
              )}
            </div>
          </Section>

          <Section title="첨부 이미지">
            <div className="space-y-4">
              {(["front", "left", "right", "favorite", "purpose"] as FashionImageCategoryKey[]).map(
                (k) => (
                  <ImageGrid
                    key={k}
                    title={FASHION_IMAGE_LABEL[k]}
                    keys={fashion.images?.[k] ?? []}
                    onClick={(url) => setSelectedUrl(url)}
                  />
                ),
              )}
            </div>
          </Section>
        </div>
      )}

      {selectedUrl && <Lightbox url={selectedUrl} onClose={() => setSelectedUrl(null)} />}
    </div>
  );
}
