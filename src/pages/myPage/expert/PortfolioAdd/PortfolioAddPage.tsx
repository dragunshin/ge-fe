import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Back from "@/images/login/back.svg?react";
import { X } from "lucide-react";

import { SinglePhotoField } from "@/pages/hairFlow/component/SinglePhotoField";
import { postExpertPortfolio } from "@/api/portfolio";

import review1 from "@/images/pofol/po1.png";
import review2 from "@/images/pofol/po2.png";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function RequiredStar() {
  return <span className="text-[#008bff]"> *</span>;
}

function ExitConfirmModal({
  open,
  onCancel,
  onPrimary,
  primaryDisabled,
  primaryLoading,
}: {
  open: boolean;
  onCancel: () => void;
  onPrimary: () => void;
  primaryDisabled?: boolean;
  primaryLoading?: boolean;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 px-5">
      <div className="w-[343px] rounded-[12px] bg-white px-6 py-5">
        <div className="text-center">
          <div className="pre_subtitle_semi_16 text-[#111111]">등록하지 않고 나가시겠어요?</div>
          <div className="mt-2 pre_body_reg_13 leading-relaxed text-[#70737c]">
            페이지를 나갈 시 입력한 정보가
            <br />
            모두 사라져요.
          </div>
        </div>

        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="h-[44px] w-full rounded-[10px] border border-[#DBDCDF] bg-white pre_body_med_16 text-[#111111]"
          >
            취소
          </button>

          <button
            type="button"
            onClick={onPrimary}
            disabled={primaryDisabled || primaryLoading}
            className={cn(
              "h-[44px] w-full rounded-[10px] pre_body_med_16 text-white",
              primaryDisabled || primaryLoading ? "bg-[#D1D1D6]" : "bg-[#111111] active:opacity-90",
            )}
          >
            {primaryLoading ? "저장 중..." : "저장하기"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PortfolioAddPage() {
  const nav = useNavigate();
  const { expertId } = useParams<{ expertId: string }>();
  // ✅ 1~2번 사진 key
  const [beforeKey, setBeforeKey] = useState<string>("");
  const [afterKey, setAfterKey] = useState<string>("");

  // ✅ 3~6번 입력
  const [title, setTitle] = useState("");
  const [concern, setConcern] = useState("");
  const [solution, setSolution] = useState("");

  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isComposing, setIsComposing] = useState(false);

  // ✅ 팝업/제출
  const [showExit, setShowExit] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isDirty = useMemo(() => {
    return Boolean(
      beforeKey || afterKey || title.trim() || concern.trim() || solution.trim() || tags.length > 0,
    );
  }, [afterKey, beforeKey, concern, solution, tags.length, title]);

  // 브라우저 새로고침/닫기 방지(가능한 범위)
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (!isDirty) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  // 유효성(스크린샷: title 50, concern/solution 1000)
  const titleLen = title.length;
  const concernLen = concern.length;
  const solutionLen = solution.length;

  const isTitleValid = titleLen >= 1 && titleLen <= 50;
  const isConcernValid = concernLen >= 30 && concernLen <= 1000;
  const isSolutionValid = solutionLen >= 30 && solutionLen <= 1000;

  const canSubmit =
    Boolean(beforeKey) && Boolean(afterKey) && isTitleValid && isConcernValid && isSolutionValid;

  const addTag = (raw: string) => {
    const t = raw.trim();
    if (!t) return;

    // writeReview와 동일한 제약(6자, 5개) 베이스 :contentReference[oaicite:9]{index=9}
    if (t.length > 6) return;

    setTags((prev) => {
      if (prev.includes(t)) return prev;
      if (prev.length >= 5) return prev;
      return [...prev, t];
    });
  };

  const removeTag = (t: string) => setTags((prev) => prev.filter((x) => x !== t));

  const onBack = () => {
    if (!isDirty) {
      nav(-1);
      return;
    }
    setShowExit(true);
  };

  const submit = async (goBackAfter?: boolean) => {
    if (submitting) return;

    if (!canSubmit) {
      alert("필수 항목을 입력해주세요. (사진 2장, 제목, 고객의 고민 30자+, 솔루션 30+)");
      return;
    }

    setSubmitting(true);
    try {
      await postExpertPortfolio({
        title: title.trim(),
        concern: concern.trim(),
        solution: solution.trim(),
        beforeImage: beforeKey,
        afterImage: afterKey,
        hashtags: tags,
      });

      alert("포트폴리오 등록이 완료됐어요.");
      if (goBackAfter) nav(-1);
      else nav(-1);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "요청 중 오류가 발생했어요.";
      alert(msg);
    } finally {
      setSubmitting(false);
      setShowExit(false);
    }
  };

  return (
    <div className="mx-auto min-h-[100dvh] w-full max-w-[420px] bg-white pb-28">
      {/* Top bar (writeReview 스타일 참고) :contentReference[oaicite:10]{index=10} */}
      <header className="sticky top-0 z-50 bg-white px-5 pt-3">
        <div className="flex items-center px-1 py-2 bg-white">
          <button onClick={onBack} className="mr-[8px]" aria-label="뒤로가기">
            <Back className="h-[18px] w-[18px]" />
          </button>
          <p className="pre_title_semi_20">포트폴리오 추가하기</p>
        </div>
      </header>

      <main className="px-5 pb-28">
        {/* TIP */}
        <section className="mt-8 text-center">
          <div className="pre_subtitle_semi_16 text-[#181818]">포트폴리오 작성 TIP</div>

          {/* 첫 번째 줄: 회색 텍스트 */}
          <div className="mt-2 pre_body_reg_14 text-[#505158]">
            전문가님의 실력이나 장점 포인트가 잘 드러나는
          </div>

          {/* 두 번째 줄: 파란색 강조 + 회색 텍스트 이어짐 */}
          <div className="pre_body_reg_14 text-[#505158]">
            <span className="font-bold text-[#008bff]">Before &amp; After 사진</span>을 올려주세요!
          </div>

          <div className="mt-4 flex items-start justify-center gap-6">
            <div className="flex flex-col items-center">
              <div className="h-[84px] w-[84px] overflow-hidden rounded-[4px] bg-[#F2F2F7]">
                <img src={review1} alt="Before 예시" className="h-full w-full object-cover" />
              </div>
              <div className="mt-2 pre_body_reg_14 text-[#505158]">Before</div>
            </div>

            <div className="flex flex-col items-center">
              <div className="h-[84px] w-[84px] overflow-hidden rounded-[4px] bg-[#F2F2F7]">
                <img src={review2} alt="After 예시" className="h-full w-full object-cover" />
              </div>
              <div className="mt-2 pre_body_reg_14 text-[#505158]">After</div>
            </div>
          </div>
        </section>

        {/* 1. Before */}
        <section className="mt-10">
          <div className="pre_subtitle_semi_16 text-[#111111]">
            <span className="text-[#008bff]">1.</span>{" "}
            <span className="text-[#008bff]">Before 사진</span>을 1장 올려주세요.
            <RequiredStar />
          </div>
          <div className="mt-2 pre_body_reg_13 text-[#70737c]">
            포트폴리오 등록을 위해 1장은 필수예요.
          </div>

          {/* ✅ Step1SidePhotos처럼 title/helper는 비워서 사용 :contentReference[oaicite:11]{index=11} */}
          <SinglePhotoField
            title=""
            helper=""
            valueKey={beforeKey || undefined}
            resourceType="portfolio"
            resourceId={expertId ?? ""}
            imageType="before"
            onUploadedKey={(key) => setBeforeKey(key)}
            onRemove={() => setBeforeKey("")}
          />
        </section>

        {/* 2. After */}
        <section className="mt-8">
          <div className="pre_subtitle_semi_16 text-[#111111]">
            <span className="text-[#008bff]">2.</span>{" "}
            <span className="text-[#008bff]">After 사진</span>
            을 1장 올려주세요.
            <RequiredStar />
          </div>
          <div className="mt-2 pre_body_reg_13 text-[#70737c]">
            포트폴리오 등록을 위해 1장은 필수예요.
          </div>

          <SinglePhotoField
            title=""
            helper=""
            valueKey={afterKey || undefined}
            resourceType="portfolio"
            resourceId={expertId ?? ""}
            imageType="after"
            onUploadedKey={(key) => setAfterKey(key)}
            onRemove={() => setAfterKey("")}
          />
        </section>

        {/* 3. 제목 */}
        <section className="mt-10">
          <div className="pre_subtitle_semi_16 text-[#111111]">
            3. 제목을 입력해주세요.
            <RequiredStar />
          </div>

          <div className="relative mt-3 h-[82px] rounded-[8px] bg-[#F4F4F5]">
            <textarea
              value={title}
              onChange={(e) => setTitle(e.target.value.slice(0, 50))}
              placeholder="ex. <모류 교정> 앞머리 다운펌"
              className="h-full w-full resize-none bg-transparent px-4 py-3 pre_body_reg_14 text-[#171719] outline-none placeholder:pre_body_reg_14 placeholder:text-[#70737c]"
            />

            <div className="absolute bottom-3 right-4 flex items-center gap-1 text-[12px]">
              <span className={cn(isTitleValid ? "text-[#70737c]" : "text-[#FF3B30]")}>
                {titleLen}
              </span>
              <span className="text-[#70737c]">|</span>
              <span className="text-[#70737c]">50</span>
            </div>
          </div>
        </section>

        {/* 4. 고객의 고민 */}
        <section className="mt-10">
          <div className="pre_subtitle_semi_16 text-[#111111]">
            4. 고객의 고민
            <RequiredStar />
          </div>
          <div className="mt-2 pre_body_reg_13 text-[#70737c]">
            상담 시 고객이 가진 고민이나 신체적 특징을 적어주세요.
          </div>

          <div className="relative mt-3 h-[132px] rounded-[8px] bg-[#F4F4F5]">
            <textarea
              value={concern}
              onChange={(e) => setConcern(e.target.value.slice(0, 1000))}
              placeholder="최소 30자 이상 입력해주세요."
              className="h-full w-full resize-none bg-transparent px-4 py-3 pre_body_reg_14 text-[#171719] outline-none placeholder:pre_body_reg_14 placeholder:text-[#70737c]"
            />

            <div className="absolute bottom-3 right-4 flex items-center gap-1 text-[12px]">
              <span className={cn(isConcernValid ? "text-[#70737c]" : "text-[#FF3B30]")}>
                {concernLen}
              </span>
              <span className="text-[#70737c]">|</span>
              <span className="text-[#70737c]">1,000</span>
            </div>
          </div>
        </section>

        {/* 5. 솔루션 */}
        <section className="mt-10">
          <div className="pre_subtitle_semi_16 text-[#111111]">
            5. 솔루션
            <RequiredStar />
          </div>
          <div className="mt-2 pre_body_reg_13 text-[#70737c]">
            고객의 고민을 해결한 전문가님이 제시한 솔루션을 작성해주세요.
          </div>

          <div className="relative mt-3 h-[132px] rounded-[8px] bg-[#F4F4F5]">
            <textarea
              value={solution}
              onChange={(e) => setSolution(e.target.value.slice(0, 1000))}
              placeholder="최소 30자 이상 입력해주세요."
              className="h-full w-full resize-none bg-transparent px-4 py-3 pre_body_reg_14 text-[#171719] outline-none placeholder:pre_body_reg_14 placeholder:text-[#70737c]"
            />

            <div className="absolute bottom-3 right-4 flex items-center gap-1 text-[12px]">
              <span className={cn(isSolutionValid ? "text-[#70737c]" : "text-[#FF3B30]")}>
                {solutionLen}
              </span>
              <span className="text-[#70737c]">|</span>
              <span className="text-[#70737c]">1,000</span>
            </div>
          </div>
        </section>

        {/* 6. 해시태그 */}
        <section className="mt-10">
          <div className="pre_subtitle_semi_16 text-[#111111]">6. 해시태그</div>
          <div className="mt-2 pre_body_reg_13 text-[#70737c]">
            해시태그를 통해 고객의 고민이나 나의 강점을 추가해보세요.
          </div>

          {/* 선택된 태그 칩 (writeReview 패턴) :contentReference[oaicite:12]{index=12} */}
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
                  <X className="h-3 w-3 text-white" />
                </button>
              ))}
            </div>
          )}

          {/* 입력 박스 (스크린샷처럼 +버튼 없이 Enter만) */}
          <div className="mt-4 flex items-center justify-between rounded-[4px] border border-[#dbdcdf] bg-white px-3 py-3">
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onCompositionStart={() => setIsComposing(true)}
              onCompositionEnd={() => setIsComposing(false)}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;

                // ✅ writeReview의 한글 조합 처리 :contentReference[oaicite:13]{index=13}
                if (isComposing || (e.nativeEvent as any).isComposing) return;

                e.preventDefault();
                addTag(tagInput);
                setTagInput("");
              }}
              placeholder="엔터로 #해시태그를 등록해주세요."
              className="w-full pre_body_reg_13 text-[#171719] outline-none placeholder:pre_body_reg_13 placeholder:text-[#C7C7CC]"
            />
          </div>
        </section>
      </main>

      {/* Bottom CTA (writeReview 스타일) :contentReference[oaicite:14]{index=14} */}
      <div className="fixed bottom-0 left-0 right-0">
        <div className="mx-auto w-[343px] pb-5">
          <button
            type="button"
            onClick={() => submit(false)}
            disabled={!canSubmit || submitting}
            className={cn(
              "h-[48px] w-full rounded-[4px] pre_body_bold_16",
              !canSubmit || submitting
                ? "bg-[#D1D1D6] text-white"
                : "bg-[#181818] text-white active:opacity-90",
            )}
          >
            {submitting ? "작성 중..." : "작성 완료"}
          </button>
        </div>
      </div>

      {/* Exit Popup */}
      <ExitConfirmModal
        open={showExit}
        onCancel={() => setShowExit(false)}
        onPrimary={() => submit(true)}
        primaryLoading={submitting}
        primaryDisabled={false}
      />
    </div>
  );
}
