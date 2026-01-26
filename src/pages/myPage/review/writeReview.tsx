import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { postReview } from "@/api/review";
import { uploadImageViaPresign } from "@/api/s3forFlow";
import review1 from "@/images/mypage/review1.png";
import review2 from "@/images/mypage/review2.png";
import review3 from "@/images/mypage/review3.png";
import { Plus, RotateCcw, X } from "lucide-react";
import Camera from "@/images/reservationFlow/camera.svg?react";
import Back from "@/images/login/back.svg?react";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function Star({ filled, onClick, label }: { filled: boolean; onClick: () => void; label: string }) {
  return (
    <button type="button" aria-label={label} onClick={onClick} className="">
      <svg
        width="34"
        height="34"
        viewBox="0 0 24 24"
        className={cn(
          "transition-colors",
          filled ? "fill-[#ffda36] text-[#ffda36]" : "fill-[#e1e2e4] text-[#e1e2e4]",
        )}
      >
        <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
      </svg>
    </button>
  );
}

type Draft = {
  rating: number;
  content: string;
  tags: string[];
  imageKeys: string[];
  savedAt: number;
};

export default function ReviewWritePage() {
  const nav = useNavigate();
  const location = useLocation();
  const params = useParams<{ consultationId?: string }>();

  // ✅ 1) URL param 우선, 없으면 location.state에서 받기
  const consultationIdRaw =
    params.consultationId ??
    (location.state as { consultationId?: string | number } | null)?.consultationId;

  // ✅ 2) API 스펙상 number라서 최종적으로 number로 변환해 사용
  const consultationId = useMemo(() => {
    if (consultationIdRaw == null) return null;
    const n = Number(consultationIdRaw);
    return Number.isFinite(n) ? n : null;
  }, [consultationIdRaw]);

  const DRAFT_KEY = useMemo(() => {
    // consultationId가 없으면 임시 키라도 하나 만들어두기
    return consultationId != null ? `reviewDraft:${consultationId}` : `reviewDraft:unknown`;
  }, [consultationId]);

  const [rating, setRating] = useState<number>(0);
  const [content, setContent] = useState<string>("");
  const [tagInput, setTagInput] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [isComposing, setIsComposing] = useState(false);

  // ✅ 서버로 보낼 값은 "업로드 후 받은 key"만
  const [imageKeys, setImageKeys] = useState<string[]>([]);
  // ✅ 화면 프리뷰는 objectURL로만 (로컬 표시용)
  const [previewByKey, setPreviewByKey] = useState<Record<string, string>>({});

  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fileRef = useRef<HTMLInputElement | null>(null);
  const objectUrlsRef = useRef<Set<string>>(new Set());

  const contentLen = content.length;
  const isContentValid = contentLen >= 30 && contentLen <= 1000;
  const isFormValid =
    rating >= 1 && isContentValid && imageKeys.length <= 5 && consultationId != null;

  // ✅ objectURL 정리
  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      objectUrlsRef.current.clear();
    };
  }, []);

  // draft load
  useEffect(() => {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as Partial<Draft>;
      if (typeof parsed.rating === "number") setRating(parsed.rating);
      if (typeof parsed.content === "string") setContent(parsed.content);
      if (Array.isArray(parsed.tags)) setTags(parsed.tags.slice(0, 20));
      if (Array.isArray(parsed.imageKeys)) setImageKeys(parsed.imageKeys.slice(0, 5));
      // previewByKey는 로컬 objectURL이라 새로고침하면 복원 불가(정상)
    } catch {
      // ignore
    }
  }, [DRAFT_KEY]);

  const saveDraft = () => {
    const payload: Draft = {
      rating,
      content,
      tags,
      imageKeys,
      savedAt: Date.now(),
    };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(payload));
    alert("임시저장 되었어요.");
  };

  // const addTag = (raw: string) => {
  //   const t = raw.trim();
  //   if (!t) return;
  //   // const normalized = t.startsWith("#") ? t : `#${t}`;
  //   if (t.length > 7) return;

  //   setTags((prev) => {
  //     if (prev.includes(t)) return prev;
  //     if (prev.length >= 6) return prev;
  //     return [...prev, t];
  //   });
  // };

  const addTag = (raw: string) => {
    const t = raw.trim();
    if (!t) return;
    // const normalized = t.startsWith("#") ? t : `#${t}`;

    // 1. 최대 글자 수 제한: 6자 초과 시 리턴
    if (t.length > 6) return;

    setTags((prev) => {
      if (prev.includes(t)) return prev;

      // 2. 최대 개수 제한: 이미 5개 이상이면 리턴
      if (prev.length >= 5) return prev;

      return [...prev, t];
    });
  };

  const removeTag = (t: string) => setTags((prev) => prev.filter((x) => x !== t));

  const openFilePicker = () => fileRef.current?.click();

  const addFiles = async (files: File[]) => {
    if (!consultationId) return;
    if (!files.length) return;

    const remain = Math.max(0, 5 - imageKeys.length);
    const slice = files.slice(0, remain);
    if (!slice.length) return;

    setUploading(true);
    try {
      for (const file of slice) {
        // 로컬 프리뷰 먼저
        const localUrl = URL.createObjectURL(file);
        objectUrlsRef.current.add(localUrl);

        try {
          // ✅ presigned 업로드 → key 확보
          const { key } = await uploadImageViaPresign({
            file,
            resourceType: "review",
            resourceId: consultationId, // consultationId로 묶어서 관리
            imageType: "front",
          });

          setImageKeys((prev) => (prev.length >= 5 ? prev : [...prev, key]));
          setPreviewByKey((prev) => ({ ...prev, [key]: localUrl }));
        } catch (e) {
          // 업로드 실패 시 프리뷰 정리
          URL.revokeObjectURL(localUrl);
          objectUrlsRef.current.delete(localUrl);
          console.error(e);
          alert("업로드에 실패했어요. 다시 시도해주세요.");
        }
      }
    } finally {
      setUploading(false);
    }
  };

  const onPickFiles: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    await addFiles(files);
  };

  const removeImage = (key: string) => {
    setImageKeys((prev) => prev.filter((k) => k !== key));

    setPreviewByKey((prev) => {
      const url = prev[key];
      if (url) {
        URL.revokeObjectURL(url);
        objectUrlsRef.current.delete(url);
      }
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const submit = async () => {
    if (!isFormValid || submitting || consultationId == null) return;

    setSubmitting(true);
    try {
      const res = await postReview({
        consultationId,
        rating,
        content,
        imageUrls: imageKeys, // ✅ 서버로는 key만 전송
      });

      localStorage.removeItem(DRAFT_KEY);
      alert(res.data.message || "후기 작성이 완료됐어요.");
      nav(-1);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "요청 중 오류가 발생했어요.";
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // consultationId가 없을 때 방어 UI
  if (consultationId == null) {
    return (
      <div className="min-h-screen bg-white px-5 pt-10">
        <div className="pre_subtitle_semi_16 text-[#111111]">잘못된 접근이에요.</div>
        {/* <div className="mt-2 text-[13px] text-[#8E8E93]">
          consultationId가 없어서 후기 작성 페이지를 열 수 없어요.
        </div> */}
        <button
          type="button"
          onClick={() => nav(-1)}
          className="mt-6 h-11 w-full rounded-[12px] bg-[#111111] text-white font-semibold"
        >
          뒤로가기
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Top bar */}
      <header className="px-5 pt-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center px-1 py-2 bg-white">
            <button onClick={() => nav(-1)} className="mr-[8px]">
              <Back className="w-[18px] h-[18px]" />
            </button>
            <p className="pre_title_semi_20">후기 작성</p>
          </div>

          <button
            type="button"
            onClick={saveDraft}
            className="text-[14px] font-medium text-[#B0B0B6]"
          >
            임시저장
          </button>
        </div>
      </header>

      {/* Body */}
      <main className="px-5 pb-28">
        {/* TIP */}
        <section className="mt-8 text-center">
          <div className="pre_subtitle_semi_16 text-[#181818]">후기 작성 TIP</div>
          <div className="mt-2 pre_body_reg_14 text-[#505158]">
            상담 효과를 알 수 있도록 비포애프터 사진이나
            <br />
            솔루션지의 만족도를 알려주세요.
          </div>

          {/* <div className="relative overflow-hidden rounded-[8px]">
          <div className="w-[168px] h-[168px]">
            <img src={thumbnail} alt="" className="w-[168px] h-[168px] object-cover" />
          </div>
        </div> */}

          <div className="mt-4 flex items-center justify-center gap-4">
            <div className="h-[84px] w-[84px] rounded-[4px]">
              <img src={review1} alt="" className=" object-cover" />
            </div>
            <div className="h-[84px] w-[84px] rounded-[4px]">
              <img src={review2} alt="" className=" object-cover" />
            </div>
            <div className="h-[84px] w-[84px] rounded-[4px]">
              <img src={review3} alt="" className=" object-cover" />
            </div>
          </div>
        </section>

        {/* Rating */}
        <section className="mt-8">
          <div className="pre_subtitle_semi_16 text-[#181818]">별점</div>
          <div className="mt-3 flex items-center gap-3">
            {Array.from({ length: 5 }).map((_, i) => {
              const v = i + 1;
              return (
                <Star key={v} filled={rating >= v} onClick={() => setRating(v)} label={`${v}점`} />
              );
            })}
          </div>
        </section>

        {/* Content */}
        <section className="mt-8">
          <div className="pre_subtitle_semi_16 text-[#181818]">후기를 작성해주세요.</div>

          <div className="relative h-[132px] w-[343px] mt-3 rounded-[10px] bg-[#F4F4F5] ">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value.slice(0, 1000))}
              placeholder="최소 30자 이상 입력해주세요."
              className="py-3 px-4 w-full resize-none bg-transparent pre_body_reg_14 text-[#171719] outline-none placeholder:pre_body_reg_14 placeholder:text-[#70737c]"
            />

            <div className="absolute bottom-3 right-4 flex items-center gap-1 text-[12px]">
              <span className={cn(isContentValid ? "text-[#8E8E93]" : "text-[#FF3B30]")}>
                {contentLen}
              </span>
              <span className="text-[#8E8E93]">|</span>
              <span className="text-[#8E8E93]">1,000</span>
            </div>
          </div>
        </section>

        {/* Hashtag */}
        <section className="mt-8">
          <div className="flex items-center justify-between">
            <div className="pre_subtitle_semi_16 text-[#181818]">해시태그</div>

            <button
              type="button"
              onClick={() => {
                setTags([]);
                setTagInput("");
              }}
              className="inline-flex items-center gap-1 pre_body_med_14 text-[#878a93] active:scale-[0.99]"
            >
              <span className="inline-flex pre_body_med_14 h-5 w-5 items-center justify-center">
                <RotateCcw className="w-4 h-4 text-[#878a93]" />
              </span>
              초기화
            </button>
          </div>

          {/* 선택된 태그 칩 */}
          {/* {tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-3">
              {tags.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => removeTag(t)}
                  className="inline-flex items-center gap-1 rounded-[4px] bg-[#333438] pr-2 pl-[12px] py-[6px] pre_cap_reg_13 text-white active:scale-[0.99]"
                  title="삭제"
                >
                  {t}
                  <X className="w-3 h-3 text-white" />
                </button>
              ))}
            </div>
          )} */}

          {/* 선택된 태그 칩 */}
          {tags.length > 0 && (
            <div className="mt-4 flex gap-3 overflow-x-auto scrollbar-hide">
              {tags.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => removeTag(t)}
                  className="flex-shrink-0 inline-flex items-center gap-1 rounded-[4px] bg-[#333438] pr-2 pl-[12px] py-[6px] pre_cap_reg_13 text-white active:scale-[0.99]"
                  title="삭제"
                >
                  {t}
                  <X className="w-3 h-3 text-white" />
                </button>
              ))}
            </div>
          )}

          {/* 입력 박스 + 우측 플러스 버튼 */}
          <div className="mt-4 flex items-center justify-between rounded-[4px] border border-[#dbdcdf] bg-white px-3 py-3">
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onCompositionStart={() => setIsComposing(true)}
              onCompositionEnd={() => setIsComposing(false)}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;

                // ✅ 한글 조합 중 Enter는 무시 (마지막 글자 중복 방지)
                if (isComposing || (e.nativeEvent as any).isComposing) return;

                e.preventDefault();
                addTag(tagInput);
                setTagInput("");
              }}
              placeholder="엔터로 #해시태그를 등록해주세요."
              className="w-full pre_body_reg_13 text-[#171719] outline-none placeholder:pre_body_reg_13 placeholder:text-[#C7C7CC]"
            />

            <button
              type="button"
              onClick={() => {
                const v = tagInput.trim();
                if (!v) return;
                addTag(v);
                setTagInput("");
              }}
              aria-label="태그 추가"
              // shrink-0 추가: 플렉스 컨테이너 안에서 크기 고정
              className="ml-3 shrink-0 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#111111] text-white active:scale-[0.99]"
            >
              {/* Lucide Plus 아이콘으로 교체 (사이즈 16px) */}
              <Plus size={14} />
            </button>
          </div>
        </section>

        {/* Photo/Video */}
        <section className="mt-8">
          <div className="pre_subtitle_semi_16 text-[#181818]">사진/영상</div>

          <div className="mt-3 flex items-start gap-[2.5px] overflow-x-auto pb-1">
            {/* thumbnails (왼쪽부터 채워짐) */}
            {imageKeys.map((key) => {
              const url = previewByKey[key];
              return (
                <div
                  key={key}
                  className="relative h-[65px] w-[65px] shrink-0 overflow-hidden rounded-[10px] bg-[#F2F2F7]"
                >
                  {url ? (
                    <img src={url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[11px] text-[#8E8E93]">
                      업로드 완료
                    </div>
                  )}

                  {/* <button
                    type="button"
                    onClick={() => removeImage(key)}
                    aria-label="이미지 삭제"
                    className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/55"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" className="fill-none">
                      <path
                        d="M18 6 6 18M6 6l12 12"
                        stroke="#FFFFFF"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button> */}

                  <button
                    type="button"
                    onClick={() => removeImage(key)}
                    className="absolute right-2 top-2 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#292a2d]"
                    aria-label="삭제"
                  >
                    <X className="h-3 w-3 text-white" />
                  </button>
                </div>
              );
            })}

            {/* camera box (5장 되면 사라짐) */}
            {imageKeys.length < 5 && (
              <button
                type="button"
                onClick={openFilePicker}
                disabled={uploading}
                className={cn(
                  "flex h-[65px] w-[65px] shrink-0 flex-col items-center justify-center rounded-[8px] border border-[#c2c4c8] bg-white",
                  uploading && "opacity-60",
                )}
              >
                <div className="flex h-8 w-8 items-center justify-center">
                  <Camera className="h-[26px] w-[26px] text-[#878a93]" fill="#878a93" />
                </div>
                <div className="pre_body_med_14 text-[#656870]">{imageKeys.length}/5</div>
              </button>
            )}

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={onPickFiles}
            />
          </div>
        </section>
      </main>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 ">
        <div className="mx-auto w-[342px]">
          <button
            type="button"
            onClick={submit}
            disabled={!isFormValid || submitting}
            className={cn(
              "h-[48px] w-full rounded-[8px] pre_body_bold_16",
              !isFormValid || submitting
                ? "bg-[#D1D1D6] text-white"
                : "bg-[#111111] text-white active:opacity-90",
            )}
          >
            {submitting ? "작성 중..." : "작성 완료"}
          </button>
        </div>
      </div>
    </div>
  );
}
