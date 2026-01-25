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
  introduction: string;
  profileLink: string;
  careerInfo: string;
};

export default function ExpertIntroductionPage() {
  const navigate = useNavigate();
  const [me, setMe] = React.useState<UserMe | null>(null);
  const [info, setInfo] = React.useState<ExpertInfoResponse | null>(null);
  const [activeField, setActiveField] = React.useState<
    "introduction" | "profileLink" | "careerInfo" | null
  >(null);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState({
    profile: false,
    background: false,
  });
  const [draft, setDraft] = React.useState<DraftInfo>({
    introduction: "",
    profileLink: "",
    careerInfo: "",
  });
  const [profilePreview, setProfilePreview] = React.useState<string | null>(null);
  const [backgroundPreview, setBackgroundPreview] = React.useState<string | null>(null);
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

  const isEditing = activeField !== null;

  const isDirty = React.useMemo(() => {
    if (!info) return false;
    return (
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

  return (
    <div className="flex h-full flex-col bg-white overflow-hidden">
      <header className="app-header w-full">
        <div className="mx-auto flex w-full max-w-[375px] items-center gap-[6px] px-4 py-[16px]">
        <button
          type="button"
          onClick={() => navigate(-1)}
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
                    {getLabelFromApiCategory(info?.category)}
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveField("introduction")}
                    className="flex h-[24px] w-[24px] items-center justify-center"
                  >
                    <RetouchIcon className="h-[18px] w-[18px]" />
                  </button>
                </div>
                <p className="mt-[6px] text-[18px] font-semibold text-[#292a2d]">
                  {info?.nickname ?? "전문가"} 전문가
                </p>
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
                        <p className="mt-[6px] text-[13px] leading-[1.4] text-[#878a93]">
                          {info?.introduction ?? ""}
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
                    <span className="min-w-0 text-[14px] text-[#429ff0]">
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
                        <p className="mt-[6px] whitespace-pre-line text-[14px] leading-[1.4] text-[#878a93]">
                          {info?.careerInfo ?? ""}
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
    </div>
  );
}
