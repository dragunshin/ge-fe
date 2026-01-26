import * as React from "react";
import { useNavigate } from "react-router-dom";
import BackIcon from "@/images/login/back.svg?react";
import CameraIcon from "@/images/reservationFlow/camera.svg?react";
import CheckIcon from "@/images/mypage/expert/check.svg?react";
import ClipboardIcon from "@/images/mypage/expert/clipboard.svg?react";
import InstagramIcon from "@/images/mypage/expert/instagram.svg?react";
import RetouchIcon from "@/images/mypage/expert/retouch.svg?react";

import { getUserMe, type UserMe } from "@/api/mypage";
import { uploadImageViaPresign } from "@/api/s3forFlow";
import { expertService } from "@/services/expert.service";
import type { ExpertInfoResponse } from "@/lib/api/types";
import { getLabelFromApiCategory } from "@/lib/utils/category";

const INTRO_MAX = 100;
const CAREER_MAX = 500;
const LINK_MAX = 255;

type DraftInfo = {
  nickname: string;
  introduction: string;
  profileLink: string;
  careerInfo: string;
};

export default function ExpertIntroductionPage() {
  const navigate = useNavigate();
  const [me, setMe] = React.useState<UserMe | null>(null);
  const [info, setInfo] = React.useState<ExpertInfoResponse | null>(null);
  const [activeField, setActiveField] = React.useState<
    "nickname" | "introduction" | "profileLink" | "careerInfo" | null
  >(null);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState({
    profile: false,
    background: false,
  });
  const [draft, setDraft] = React.useState<DraftInfo>({
    nickname: "",
    introduction: "",
    profileLink: "",
    careerInfo: "",
  });
  const [profilePreview, setProfilePreview] = React.useState<string | null>(null);
  const [backgroundPreview, setBackgroundPreview] = React.useState<string | null>(null);
  const [showIncompleteModal, setShowIncompleteModal] = React.useState(false);
  const [showPortfolioModal, setShowPortfolioModal] = React.useState(false);
  const [hasPortfolio, setHasPortfolio] = React.useState<boolean | null>(null);
  const profileInputRef = React.useRef<HTMLInputElement | null>(null);
  const backgroundInputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    const ac = new AbortController();

    (async () => {
      try {
        const data = await getUserMe({ signal: ac.signal });
        setMe(data);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        console.error(error);
      }
    })();

    return () => ac.abort();
  }, []);

  React.useEffect(() => {
    if (!me?.userId) return;

    let isActive = true;

    (async () => {
      try {
        const response = await expertService.getExpertInfo(me.userId);
        if (!isActive) return;
        setInfo(response.data);
        setDraft({
          nickname: response.data.nickname ?? "",
          introduction: response.data.introduction ?? "",
          profileLink: response.data.profileLink ?? "",
          careerInfo: response.data.careerInfo ?? "",
        });
      } catch (error) {
        if (!isActive) return;
        console.error("Failed to fetch expert info:", error);
      }
    })();

    return () => {
      isActive = false;
    };
  }, [me?.userId]);

  React.useEffect(() => {
    if (!me?.userId) return;

    let isActive = true;
    (async () => {
      try {
        const response = await expertService.getExpertPortfolios(me.userId, { page: 0, size: 1 });
        if (!isActive) return;
        setHasPortfolio((response.data ?? []).length > 0);
      } catch (error) {
        if (!isActive) return;
        console.error("Failed to fetch expert portfolios:", error);
        setHasPortfolio(true);
      }
    })();

    return () => {
      isActive = false;
    };
  }, [me?.userId]);

  const isEditing = activeField !== null;
  const isIntroEmpty = React.useMemo(() => {
    if (!info) return false;
    const intro = info.introduction?.trim() ?? "";
    const career = info.careerInfo?.trim() ?? "";
    const link = info.profileLink?.trim() ?? "";
    return intro.length === 0 && career.length === 0 && link.length === 0;
  }, [info]);

  const isDirty = React.useMemo(() => {
    if (!info) return false;
    return (
      (draft.nickname ?? "") !== (info.nickname ?? "") ||
      (draft.introduction ?? "") !== (info.introduction ?? "") ||
      (draft.profileLink ?? "") !== (info.profileLink ?? "") ||
      (draft.careerInfo ?? "") !== (info.careerInfo ?? "")
    );
  }, [draft, info]);

  const handleChange = (field: keyof DraftInfo, value: string) => {
    setDraft((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!activeField || isSaving || !info) return;
    const nextValue = draft[activeField] ?? "";
    const prevValue = info[activeField] ?? "";
    if (nextValue === prevValue) {
      setActiveField(null);
      return;
    }

    try {
      setIsSaving(true);
      const response = await expertService.updateExpertInfo({
        [activeField]: nextValue,
      });
      setInfo(response.data);
      setActiveField(null);
    } catch (error) {
      console.error("Failed to update expert info:", error);
      alert("소개서 수정에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsSaving(false);
    }
  };

  const uploadImage = async (type: "profile" | "background", file: File) => {
    if (!me?.userId) return;

    const previewUrl = URL.createObjectURL(file);
    if (type === "profile") {
      setProfilePreview(previewUrl);
    } else {
      setBackgroundPreview(previewUrl);
    }

    try {
      setIsUploading((prev) => ({ ...prev, [type]: true }));
      const { key } = await uploadImageViaPresign({
        file,
        resourceType: "expert",
        resourceId: me.userId,
        imageType: type,
      });

      const response = await expertService.updateExpertImages({
        profileImageKey: type === "profile" ? key : undefined,
        backgroundImageKey: type === "background" ? key : undefined,
      });

      setInfo(response.data);
    } catch (error) {
      console.error("Failed to upload image:", error);
      alert("이미지 업로드에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsUploading((prev) => ({ ...prev, [type]: false }));
      if (type === "profile") {
        setProfilePreview(null);
      } else {
        setBackgroundPreview(null);
      }
    }
  };

  const backgroundImage =
    backgroundPreview ?? info?.backgroundImage ?? info?.profileImage ?? "";
  const profileImage = profilePreview ?? info?.profileImage ?? "";
  const categoryLabel = getLabelFromApiCategory(info?.category);

  const handleBack = () => {
    if (isIntroEmpty) {
      setShowIncompleteModal(true);
      return;
    }
    if (hasPortfolio === false) {
      setShowPortfolioModal(true);
      return;
    }
    navigate(-1);
  };

  return (
    <div className="flex h-full flex-col bg-white overflow-hidden">
      <header className="app-header sticky top-0 z-50 w-full bg-white">
        <div className="mx-auto flex w-full max-w-[375px] items-center gap-[6px] px-4 py-[16px]">
        <button
          type="button"
          onClick={handleBack}
          className="flex h-[24px] w-[24px] items-center justify-center"
        >
          <BackIcon className="h-[24px] w-[24px]" />
        </button>
        <h1 className="text-[20px] font-semibold text-[#181818]">소개서 수정하기</h1>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto overflow-x-hidden pb-[120px] scrollbar-hide">
        <div className="mx-auto w-full max-w-[375px]">
          <section className="relative h-[220px] w-full">
            {backgroundImage ? (
              <img src={backgroundImage} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full bg-[#d9d9d9]" />
            )}
            <button
              type="button"
              onClick={() => backgroundInputRef.current?.click()}
              disabled={isUploading.background}
              className="absolute left-1/2 top-[168px] -translate-x-1/2 rounded-full bg-black/60 px-[20px] py-[8px] text-[14px] font-semibold text-white"
            >
              {isUploading.background ? "업로드 중" : "배경 편집"}
            </button>
            <input
              ref={backgroundInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  void uploadImage("background", file);
                }
                event.target.value = "";
              }}
            />
          </section>

          <section className="px-[16px] pt-[40px]">
            <div className="flex items-start gap-[12px]">
              <div className="relative">
                <div className="h-[52px] w-[52px] overflow-hidden rounded-full bg-[#f1f1f6]">
                  {profileImage ? (
                    <img src={profileImage} alt="" className="h-full w-full object-cover" />
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() => profileInputRef.current?.click()}
                  disabled={isUploading.profile}
                  className="absolute -right-[4px] bottom-[0px] flex h-[22px] w-[22px] items-center justify-center rounded-full bg-[#f1f1f6]"
                >
                  <CameraIcon className="h-[12px] w-[12px]" />
                </button>
                <input
                  ref={profileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) {
                      void uploadImage("profile", file);
                    }
                    event.target.value = "";
                  }}
                />
              </div>
                <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="inline-flex rounded-[2px] bg-[#f5f9fd] px-[6px] py-[4px] text-[12px] text-[#429ff0]">
                    {categoryLabel || "카테고리"}
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveField("nickname")}
                    className="flex h-[24px] w-[24px] items-center justify-center"
                  >
                    <RetouchIcon className="h-[18px] w-[18px]" />
                  </button>
                </div>
                {activeField === "nickname" ? (
                  <input
                    value={draft.nickname}
                    onChange={(event) => handleChange("nickname", event.target.value)}
                    className="mt-[6px] w-full border-b border-[#008bff] pb-[6px] text-[18px] font-semibold text-[#292a2d] outline-none"
                    placeholder="전문가 이름"
                  />
                ) : (
                  <p className="mt-[6px] text-[18px] font-semibold text-[#292a2d]">
                    {info?.nickname ?? "전문가"}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-[20px] h-[1px] w-full bg-[#f4f4f5]" />

            <div className="mt-[20px] space-y-[14px]">
              <div className="flex gap-[8px]">
                <CheckIcon className="mt-[2px] h-[20px] w-[20px] shrink-0" />
                <div className="flex-1">
                  <div className="flex items-start gap-[8px]">
                    <div className="flex-1 min-w-0">
                      <p className="text-[16px] font-semibold text-[#292a2d]">한 줄 소개</p>
                      {activeField === "introduction" ? (
                        <textarea
                          value={draft.introduction}
                          maxLength={INTRO_MAX}
                          onChange={(event) => handleChange("introduction", event.target.value)}
                          className="mt-[6px] w-full resize-none border-b border-[#008bff] pb-[6px] text-[13px] leading-[1.4] text-[#292a2d] outline-none"
                          rows={3}
                        />
                      ) : (
                        <p
                          className={`mt-[6px] text-[13px] leading-[1.4] ${
                            info?.introduction ? "text-[#878a93]" : "text-[#aeb0b6]"
                          }`}
                        >
                          {info?.introduction || "최소 30자 이상 입력해주세요."}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveField("introduction")}
                      className="flex h-[24px] w-[24px] shrink-0 items-center justify-center"
                    >
                      <RetouchIcon className="h-[18px] w-[18px]" />
                    </button>
                  </div>
                  {activeField === "introduction" && (
                    <p className="mt-[6px] text-[14px] text-[#70737c]">
                      <span className="text-[#ff3434]">{draft.introduction.length}</span> | {INTRO_MAX}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-[8px]">
                <InstagramIcon className="h-[20px] w-[20px] shrink-0" />
                <div className="flex flex-1 items-center gap-[8px]">
                  {activeField === "profileLink" ? (
                    <input
                      value={draft.profileLink}
                      maxLength={LINK_MAX}
                      onChange={(event) => handleChange("profileLink", event.target.value)}
                      className="w-full min-w-0 border-b border-[#008bff] pb-[6px] text-[14px] text-[#429ff0] outline-none"
                      placeholder="instagram link"
                    />
                  ) : (
                    <span
                      className={`min-w-0 text-[14px] ${
                        info?.profileLink ? "text-[#429ff0]" : "text-[#aeb0b6]"
                      }`}
                    >
                      {info?.profileLink || "instagram link"}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => setActiveField("profileLink")}
                    className="flex h-[24px] w-[24px] shrink-0 items-center justify-center"
                  >
                    <RetouchIcon className="h-[18px] w-[18px]" />
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-[8px]">
                <ClipboardIcon className="mt-[2px] h-[20px] w-[20px] shrink-0" />
                <div className="flex-1">
                  <div className="flex items-start gap-[8px]">
                    <div className="flex-1 min-w-0">
                      <p className="text-[16px] font-semibold text-[#292a2d]">경력 정보</p>
                      {activeField === "careerInfo" ? (
                        <textarea
                          value={draft.careerInfo}
                          maxLength={CAREER_MAX}
                          onChange={(event) => handleChange("careerInfo", event.target.value)}
                          className="mt-[6px] w-full resize-none border-b border-[#008bff] pb-[6px] text-[14px] leading-[1.4] text-[#292a2d] outline-none"
                          rows={3}
                        />
                      ) : (
                        <p
                          className={`mt-[6px] whitespace-pre-line text-[14px] leading-[1.4] ${
                            info?.careerInfo ? "text-[#878a93]" : "text-[#aeb0b6]"
                          }`}
                        >
                          {info?.careerInfo ||
                            "ex.\n탈모 헤어스타일링 전문가\n2021~2023 청담동 후고바버샵 근무\n전)옹스샵 원장"}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveField("careerInfo")}
                      className="flex h-[24px] w-[24px] shrink-0 items-center justify-center"
                    >
                      <RetouchIcon className="h-[18px] w-[18px]" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {isEditing && (
        <div className="fixed bottom-0 left-1/2 w-full max-w-[375px] -translate-x-1/2 bg-white px-[16px] pb-[42px] pt-[16px]">
          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={!isDirty || isSaving}
            className={`h-[48px] w-full rounded-[4px] text-[16px] font-bold text-white ${
              !isDirty || isSaving ? "bg-[#aeb0b6]" : "bg-[#181818]"
            }`}
          >
            {isSaving ? "저장 중" : "수정 완료"}
          </button>
        </div>
      )}

      {!isEditing && isIntroEmpty && (
        <div className="fixed bottom-0 left-1/2 w-full max-w-[375px] -translate-x-1/2 bg-white px-[16px] pb-[42px] pt-[16px]">
          <button
            type="button"
            onClick={() => setActiveField("introduction")}
            className="h-[48px] w-full rounded-[4px] bg-[#181818] text-[16px] font-bold text-white"
          >
            소개서 등록
          </button>
        </div>
      )}

      {showIncompleteModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-5">
          <div className="w-[343px] rounded-[8px] border border-[#f1f1f6] bg-white px-[32px] py-[24px]">
            <p className="text-center text-[16px] font-semibold leading-[1.4] text-[#46474c]">
              전문가 소개서 작성이 완료되지
              <br />
              않았어요. 마저 작성해보실래요?
            </p>
            <div className="mt-[20px] flex gap-[8px]">
              <button
                type="button"
                onClick={() => {
                  setShowIncompleteModal(false);
                  navigate(-1);
                }}
                className="h-[40px] w-[120px] rounded-[4px] border border-[#dbdcdf] text-[14px] font-medium text-[#171719]"
              >
                취소
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowIncompleteModal(false);
                  setActiveField("introduction");
                }}
                className="h-[40px] w-[136px] rounded-[4px] bg-[#181818] text-[14px] font-semibold text-white"
              >
                마저 작성하러가기
              </button>
            </div>
          </div>
        </div>
      )}

      {showPortfolioModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-5">
          <div className="w-[343px] rounded-[8px] border border-[#f1f1f6] bg-white px-[32px] py-[24px]">
            <p className="text-center text-[16px] font-semibold leading-[1.4] text-[#46474c]">
              아직 등록된 포트폴리오가 없어요.
              <br />
              지금 작성해보실래요?
            </p>
            <div className="mt-[20px] flex gap-[8px]">
              <button
                type="button"
                onClick={() => {
                  setShowPortfolioModal(false);
                  navigate(-1);
                }}
                className="h-[40px] w-[120px] rounded-[4px] border border-[#dbdcdf] text-[14px] font-medium text-[#171719]"
              >
                취소
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowPortfolioModal(false);
                  if (me?.userId) {
                    navigate(`/portfolioAdd/${me.userId}`);
                  }
                }}
                className="h-[40px] w-[136px] rounded-[4px] bg-[#181818] text-[14px] font-semibold text-white"
              >
                지금 작성하러가기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
