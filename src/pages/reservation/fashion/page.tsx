import * as React from "react";
import { Camera, Check, ChevronLeft, Upload, X } from "lucide-react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

const IMAGE_GUIDE = [
  "밝은 조명 하에서 고화질 사진이 필요해요.",
  "보정 없는 셀프카메라를 사용해주세요.",
];

const SIDE_GUIDE = ["박시하지 않은 반팔, 반바지를 착용을 권장해요."];

const IMAGE_STYLE_OPTIONS = [
  "섹시함",
  "단정함",
  "귀여움",
  "남자다움",
  "신뢰를 주는",
  "화려한",
  "자연스러움",
  "꾸안꾸",
  "따뜻한",
  "차가운",
  "힙한",
  "기타",
];

const COLOR_OPTIONS = ["무채색", "컬러풀", "파스텔톤", "잘 모르겠음"];

const BODY_FLAW_OPTIONS = [
  "좁은 어깨",
  "얇은 다리",
  "얇은 팔",
  "볼록한 배",
  "굵은 다리",
  "큰 몸통",
  "얄상한 몸",
  "키",
  "상하체 비율",
  "머리 크기",
];

const ITEM_OPTIONS = ["아우터", "상의", "하의", "신발", "악세사리", "가방"];

const PRICE_PRESETS = [
  { label: "10만원 이하", min: 0, max: 10, paddingX: 14 },
  { label: "10만원대", min: 10, max: 19, paddingX: 14 },
  { label: "20만원대", min: 20, max: 29, paddingX: 14 },
  { label: "30만원대", min: 30, max: 39, paddingX: 14 },
  { label: "40만원 이상", min: 40, max: 40, paddingX: 9 },
  { label: "상관없음", min: 0, max: 40, paddingX: 9 },
];

const PRICE_MAX = 40;

const SIZE_OPTIONS = ["S", "M", "L", "XL", "XXL"];

const FIT_IMAGE_OPTIONS = [
  { label: "머슬핏" },
  { label: "레귤러" },
  { label: "오버핏" },
];

const MOOD_IMAGE_OPTIONS = [
  { label: "클래식" },
  { label: "캐주얼" },
  { label: "스트릿" },
  { label: "댄디" },
  { label: "고프코어" },
  { label: "에슬레저" },
];

type OutfitImage = {
  id: string;
  url: string;
};

const createPreview = (file: File) => ({
  id: crypto.randomUUID(),
  url: URL.createObjectURL(file),
});

const releasePreview = (preview?: OutfitImage | null) => {
  if (preview?.url) {
    URL.revokeObjectURL(preview.url);
  }
};

export default function FashionReservationFlowPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [step, setStep] = React.useState(1);
  const [introStage, setIntroStage] = React.useState<1 | 2>(1);
  const [frontImage, setFrontImage] = React.useState<OutfitImage | null>(null);
  const [leftImage, setLeftImage] = React.useState<OutfitImage | null>(null);
  const [rightImage, setRightImage] = React.useState<OutfitImage | null>(null);
  const [outfits, setOutfits] = React.useState<OutfitImage[]>([]);
  const [heightValue, setHeightValue] = React.useState("");
  const [weightValue, setWeightValue] = React.useState("");
  const [topSize, setTopSize] = React.useState<string | null>(null);
  const [bottomSize, setBottomSize] = React.useState<string | null>(null);
  const [colorSelections, setColorSelections] = React.useState<Set<string>>(
    () => new Set(),
  );
  const [fitSelection, setFitSelection] = React.useState<string | null>(null);
  const [moodSelections, setMoodSelections] = React.useState<Set<string>>(
    () => new Set(),
  );
  const [imageStyleSelections, setImageStyleSelections] = React.useState<
    Set<string>
  >(() => new Set());
  const [imageStyleEtc, setImageStyleEtc] = React.useState("");
  const [bodySelections, setBodySelections] = React.useState<Set<string>>(
    () => new Set(),
  );
  const [bodyEtc, setBodyEtc] = React.useState("");
  const [itemSelections, setItemSelections] = React.useState<Set<string>>(
    () => new Set(),
  );
  const [priceMin, setPriceMin] = React.useState(0);
  const [priceMax, setPriceMax] = React.useState(40);
  const [purposeText, setPurposeText] = React.useState("");
  const [purposeImages, setPurposeImages] = React.useState<OutfitImage[]>([]);

  const frontInputRef = React.useRef<HTMLInputElement | null>(null);
  const leftInputRef = React.useRef<HTMLInputElement | null>(null);
  const rightInputRef = React.useRef<HTMLInputElement | null>(null);
  const outfitInputRef = React.useRef<HTMLInputElement | null>(null);
  const purposeInputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    const stepParam = Number(searchParams.get("step"));
    if (!Number.isNaN(stepParam) && stepParam >= 1 && stepParam <= 9) {
      setStep(stepParam);
      setIntroStage(1);
    }
  }, [searchParams]);

  React.useEffect(() => {
    return () => {
      releasePreview(frontImage);
      releasePreview(leftImage);
      releasePreview(rightImage);
      outfits.forEach((item) => releasePreview(item));
      purposeImages.forEach((item) => releasePreview(item));
    };
  }, [frontImage, leftImage, rightImage, outfits, purposeImages]);

  const handleSingleUpload = (
    files: FileList | null,
    setter: React.Dispatch<React.SetStateAction<OutfitImage | null>>,
  ) => {
    const file = files?.[0];
    if (!file) return;
    setter((prev) => {
      releasePreview(prev);
      return createPreview(file);
    });
  };

  const handleOutfitUpload = (files: FileList | null) => {
    if (!files?.length) return;
    setOutfits((prev) => {
      const remainingSlots = Math.max(0, 5 - prev.length);
      const next = Array.from(files)
        .slice(0, remainingSlots)
        .map(createPreview);
      return [...prev, ...next];
    });
  };

  const removeOutfit = (id: string) => {
    setOutfits((prev) => {
      const target = prev.find((item) => item.id === id);
      releasePreview(target ?? null);
      return prev.filter((item) => item.id !== id);
    });
  };

  const removeSingleImage = (
    setter: React.Dispatch<React.SetStateAction<OutfitImage | null>>,
  ) => {
    setter((prev) => {
      releasePreview(prev);
      return null;
    });
  };

  const formatNumeric = (value: string) => value.replace(/[^0-9]/g, "");

  const applyUnit = (value: string, unit: "cm" | "kg") => {
    const numeric = formatNumeric(value);
    if (!numeric) return "";
    return unit === "cm" ? `${numeric} cm` : `${numeric}kg`;
  };

  const toggleColorSelection = (option: string) => {
    setColorSelections((prev) => {
      const next = new Set(prev);
      if (next.has(option)) {
        next.delete(option);
      } else {
        next.add(option);
      }
      return next;
    });
  };

  const toggleMoodSelection = (option: string) => {
    setMoodSelections((prev) => {
      const next = new Set(prev);
      if (next.has(option)) {
        next.delete(option);
      } else {
        next.add(option);
      }
      return next;
    });
  };

  const toggleImageStyle = (option: string) => {
    setImageStyleSelections((prev) => {
      const next = new Set(prev);
      if (next.has(option)) {
        next.delete(option);
      } else {
        next.add(option);
      }
      return next;
    });
  };

  const toggleBodySelection = (option: string) => {
    setBodySelections((prev) => {
      const next = new Set(prev);
      if (next.has(option)) {
        next.delete(option);
      } else {
        next.add(option);
      }
      return next;
    });
  };

  const toggleItemSelection = (option: string) => {
    setItemSelections((prev) => {
      const next = new Set(prev);
      if (next.has(option)) {
        next.delete(option);
      } else {
        next.add(option);
      }
      return next;
    });
  };

  const formatPrice = (value: number) => {
    if (value >= PRICE_MAX) return "40만원 이상";
    if (value === 0) return "0원";
    return `${value}만원`;
  };

  const formatPriceRange = () =>
    `${formatPrice(priceMin)} ~ ${formatPrice(priceMax)}`;

  const handlePriceMin = (value: number) => {
    setPriceMin(Math.min(value, priceMax));
  };

  const handlePriceMax = (value: number) => {
    setPriceMax(Math.max(value, priceMin));
  };

  const handlePurposeUpload = (files: FileList | null) => {
    if (!files?.length) return;
    setPurposeImages((prev) => {
      const remainingSlots = Math.max(0, 3 - prev.length);
      const next = Array.from(files)
        .slice(0, remainingSlots)
        .map(createPreview);
      return [...prev, ...next];
    });
  };

  const removePurposeImage = (id: string) => {
    setPurposeImages((prev) => {
      const target = prev.find((item) => item.id === id);
      releasePreview(target ?? null);
      return prev.filter((item) => item.id !== id);
    });
  };

  const canProceed = () => {
    if (step === 1) return introStage === 1 ? true : Boolean(frontImage);
    if (step === 2) return Boolean(leftImage && rightImage);
    if (step === 3) return outfits.length >= 2;
    if (step === 4) {
      const hasHeight = Boolean(formatNumeric(heightValue));
      const hasWeight = Boolean(formatNumeric(weightValue));
      return hasHeight && hasWeight && Boolean(topSize) && Boolean(bottomSize);
    }
    if (step === 5) return imageStyleSelections.size > 0;
    if (step === 6) {
      return (
        colorSelections.size > 0 &&
        Boolean(fitSelection) &&
        moodSelections.size > 0
      );
    }
    if (step === 7) return bodySelections.size > 0;
    if (step === 8) return true;
    if (step === 9) return purposeText.trim().length > 0;
    return false;
  };

  const handleNext = () => {
    if (!canProceed()) return;
    if (step === 1 && introStage === 1) {
      setIntroStage(2);
      return;
    }
    if (step < 9) {
      setStep((prev) => prev + 1);
      if (step === 1) {
        setIntroStage(1);
      }
      return;
    }
    navigate("/payment/order", {
      state: { from: `${location.pathname}${location.search}` },
    });
  };

  const handlePreviewNext = () => {
    if (step === 1 && introStage === 1) {
      setIntroStage(2);
      return;
    }
    if (step < 9) {
      setStep((prev) => prev + 1);
      if (step === 1) {
        setIntroStage(1);
      }
      return;
    }
    navigate("/payment/order");
  };

  const handleBack = () => {
    if (step === 1) {
      if (introStage === 2) {
        setIntroStage(1);
        return;
      }
      navigate(-1);
      return;
    }
    if (step === 2) {
      setStep(1);
      setIntroStage(2);
      return;
    }
    setStep((prev) => prev - 1);
  };

  const minPercent = (priceMin / PRICE_MAX) * 100;
  const maxPercent = (priceMax / PRICE_MAX) * 100;

  return (
    <div className="flex min-h-full flex-col bg-white text-[#0f0f10]">
      <header className="fixed top-0 left-1/2 z-10 w-full max-w-[375px] -translate-x-1/2 bg-white">
        <div className="flex h-[44px] items-center px-[16px]">
          <button onClick={handleBack} aria-label="뒤로가기">
            <ChevronLeft className="h-[24px] w-[24px]" />
          </button>
        </div>
      </header>

      <main className="hide-scrollbar flex-1 overflow-y-auto px-[16px] pb-[160px] pt-[44px]">
        {step === 1 && introStage === 1 && (
          <section className="pt-[8px]">
            <p className="text-[16px] font-medium text-[#008bff]">1/9</p>
            <h1 className="mt-[6px] text-[20px] font-semibold leading-[1.4] text-black">
              맨유얼에서 정확한 컨설팅을
              <br />
              위한 사진 등록 가이드
            </h1>
            <p className="mt-[10px] text-[13px] leading-[1.4] text-[#70737c]">
              제출한 사진은 마케팅이나 외부 공개 목적으로 일정
              <br />
              활용하지 않습니다.
            </p>

            <div className="mt-[24px] rounded-[12px] bg-[#eff7fd] px-[16px] py-[12px]">
              <p className="text-[14px] font-semibold text-[#008bff]">
                좋은 사진의 예
              </p>
              <ul className="mt-[6px] list-disc space-y-[4px] pl-[20px] text-[14px] leading-[1.5] text-[#008bff]">
                {IMAGE_GUIDE.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {step === 1 && introStage === 2 && (
          <section className="pt-[8px]">
            <p className="text-[16px] font-medium text-[#008bff]">1/9</p>
            <h1 className="mt-[6px] text-[20px] font-semibold leading-[1.4] text-black">
              <span className="text-[#429ff0]">전신 정면 사진 </span>
              먼저 올려주세요.
            </h1>
            {!frontImage && (
              <div className="mt-[16px] flex gap-[8px]">
                <div className="h-[167px] w-[168px] rounded-[8px] bg-[#e1e2e4]" />
                <div className="h-[167px] w-[168px] rounded-[8px] bg-[#e1e2e4]" />
              </div>
            )}

            <div className="mt-[16px] rounded-[12px] bg-[#eff7fd] px-[16px] py-[12px]">
              <ul className="list-disc pl-[20px] text-[14px] leading-[1.5] text-[#008bff]">
                {SIDE_GUIDE.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            {frontImage && (
              <div className="relative mt-[16px] h-[167px] w-[168px] overflow-hidden rounded-[8px]">
                <img
                  src={frontImage.url}
                  alt="전신 정면"
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  className="absolute right-[10px] top-[10px] flex h-[24px] w-[24px] items-center justify-center rounded-full bg-black/70"
                  onClick={() => removeSingleImage(setFrontImage)}
                >
                  <X className="h-[14px] w-[14px] text-white" />
                </button>
              </div>
            )}

            <div className="mt-[16px]">
              <input
                ref={frontInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => {
                  handleSingleUpload(event.target.files, setFrontImage);
                  event.currentTarget.value = "";
                }}
              />
              <button
                type="button"
                className="flex h-[52px] w-[306px] items-center justify-center gap-[8px] rounded-[12px] border border-[#dbdcdf] text-[16px] font-medium text-[#46474c]"
                onClick={() => frontInputRef.current?.click()}
              >
                <Camera className="h-[20px] w-[20px]" />
                사진 업로드
              </button>
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="pt-[8px]">
            <p className="text-[16px] font-medium text-[#008bff]">2/9</p>
            <h1 className="mt-[6px] text-[20px] font-semibold leading-[1.4] text-black">
              이제 <span className="text-[#429ff0]">전신 측면 사진</span>을
              올려주세요.
            </h1>
            {!leftImage && !rightImage && (
              <div className="mt-[16px] flex gap-[8px]">
                <div className="h-[167px] w-[168px] rounded-[8px] bg-[#e1e2e4]" />
                <div className="h-[167px] w-[168px] rounded-[8px] bg-[#e1e2e4]" />
              </div>
            )}

            <div className="mt-[16px] rounded-[12px] bg-[#eff7fd] px-[16px] py-[12px]">
              <ul className="list-disc pl-[20px] text-[14px] leading-[1.5] text-[#008bff]">
                {SIDE_GUIDE.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="mt-[24px] space-y-[28px]">
              <div>
                <p className="text-[20px] font-semibold leading-[1.4]">
                  왼쪽 전신을 올려주세요.
                </p>
                <p className="mt-[6px] text-[13px] leading-[1.4] text-[#70737c]">
                  몸을 왼쪽으로 돌린 촬영본을 올려주세요.
                </p>
                {leftImage && (
                  <div className="relative mt-[16px] h-[167px] w-[168px] overflow-hidden rounded-[8px]">
                    <img
                      src={leftImage.url}
                      alt="왼쪽 전신"
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      className="absolute right-[10px] top-[10px] flex h-[24px] w-[24px] items-center justify-center rounded-full bg-black/70"
                      onClick={() => removeSingleImage(setLeftImage)}
                    >
                      <X className="h-[14px] w-[14px] text-white" />
                    </button>
                  </div>
                )}
                <input
                  ref={leftInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => {
                    handleSingleUpload(event.target.files, setLeftImage);
                    event.currentTarget.value = "";
                  }}
                />
                <button
                  type="button"
                  className="mt-[16px] flex h-[52px] w-[306px] items-center justify-center gap-[8px] rounded-[12px] border border-[#dbdcdf] text-[16px] font-medium text-[#46474c]"
                  onClick={() => leftInputRef.current?.click()}
                >
                  <Camera className="h-[20px] w-[20px]" />
                  {leftImage ? "다시 업로드하기" : "사진 업로드"}
                </button>
              </div>

              <div>
                <p className="text-[20px] font-semibold leading-[1.4]">
                  오른쪽 전신을 올려주세요.
                </p>
                <p className="mt-[6px] text-[13px] leading-[1.4] text-[#70737c]">
                  몸을 오른쪽으로 돌린 촬영본을 올려주세요.
                </p>
                {rightImage && (
                  <div className="relative mt-[16px] h-[167px] w-[168px] overflow-hidden rounded-[8px]">
                    <img
                      src={rightImage.url}
                      alt="오른쪽 전신"
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      className="absolute right-[10px] top-[10px] flex h-[24px] w-[24px] items-center justify-center rounded-full bg-black/70"
                      onClick={() => removeSingleImage(setRightImage)}
                    >
                      <X className="h-[14px] w-[14px] text-white" />
                    </button>
                  </div>
                )}
                <input
                  ref={rightInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => {
                    handleSingleUpload(event.target.files, setRightImage);
                    event.currentTarget.value = "";
                  }}
                />
                <button
                  type="button"
                  className="mt-[16px] flex h-[52px] w-[306px] items-center justify-center gap-[8px] rounded-[12px] border border-[#dbdcdf] text-[16px] font-medium text-[#46474c]"
                  onClick={() => rightInputRef.current?.click()}
                >
                  <Camera className="h-[20px] w-[20px]" />
                  {rightImage ? "다시 업로드하기" : "사진 업로드"}
                </button>
              </div>
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="pt-[8px]">
            <p className="text-[16px] font-medium text-[#008bff]">3/9</p>
            <h1 className="mt-[6px] text-[20px] font-semibold leading-[1.4] text-black">
              본인 사진 중 <span className="text-[#429ff0]">가장 마음에 들었던 착장</span>을
              올려주세요.
            </h1>

            {outfits.length === 0 && (
              <div className="mt-[16px] flex gap-[8px]">
                <div className="h-[167px] w-[168px] rounded-[8px] bg-[#e1e2e4]" />
                <div className="h-[167px] w-[168px] rounded-[8px] bg-[#e1e2e4]" />
              </div>
            )}

            <div className="mt-[16px] rounded-[12px] bg-[#eff7fd] px-[16px] py-[12px]">
              <ul className="list-disc pl-[20px] text-[14px] leading-[1.5] text-[#008bff]">
                <li>최소 2장에서 최대 5장까지 올려주세요.</li>
              </ul>
            </div>

            <div className="mt-[16px] flex flex-wrap gap-[8px]">
              {outfits.map((item) => (
                <div
                  key={item.id}
                  className="relative h-[167px] w-[168px] overflow-hidden rounded-[8px]"
                >
                  <img
                    src={item.url}
                    alt="착장 사진"
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    className="absolute right-[10px] top-[10px] flex h-[24px] w-[24px] items-center justify-center rounded-full bg-black/70"
                    onClick={() => removeOutfit(item.id)}
                  >
                    <X className="h-[14px] w-[14px] text-white" />
                  </button>
                </div>
              ))}
            </div>

            <input
              ref={outfitInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              multiple
              onChange={(event) => {
                handleOutfitUpload(event.target.files);
                event.currentTarget.value = "";
              }}
            />
            <button
              type="button"
              className="mt-[16px] flex h-[52px] w-[306px] items-center justify-center gap-[8px] rounded-[12px] border border-[#dbdcdf] text-[16px] font-medium text-[#46474c]"
              onClick={() => outfitInputRef.current?.click()}
            >
              <Upload className="h-[20px] w-[20px]" />
              사진 업로드
            </button>
          </section>
        )}

        {step === 4 && (
          <section className="pt-[8px]">
            <p className="text-[16px] font-medium text-[#008bff]">4/9</p>
            <h1 className="mt-[6px] text-[20px] font-semibold leading-[1.4] text-black">
              <span className="text-[#429ff0]">키/몸무게, 상•하의 사이즈</span>를
              알려주세요.
            </h1>

            <div className="mt-[24px] space-y-[16px]">
              <div>
                <p className="text-[16px] font-medium text-black">키</p>
                <input
                  value={heightValue}
                  onChange={(event) =>
                    setHeightValue(formatNumeric(event.target.value))
                  }
                  onBlur={() => setHeightValue((prev) => applyUnit(prev, "cm"))}
                  onFocus={() =>
                    setHeightValue((prev) => formatNumeric(prev))
                  }
                  placeholder="직접 입력해주세요."
                  className="mt-[12px] h-[48px] w-full rounded-[4px] border border-[#dbdcdf] px-[20px] text-[13px] text-[#0f0f10] placeholder:text-[#989ba2]"
                />
              </div>
              <div>
                <p className="text-[16px] font-medium text-black">몸무게</p>
                <input
                  value={weightValue}
                  onChange={(event) =>
                    setWeightValue(formatNumeric(event.target.value))
                  }
                  onBlur={() => setWeightValue((prev) => applyUnit(prev, "kg"))}
                  onFocus={() =>
                    setWeightValue((prev) => formatNumeric(prev))
                  }
                  placeholder="직접 입력해주세요."
                  className="mt-[12px] h-[48px] w-full rounded-[4px] border border-[#dbdcdf] px-[20px] text-[13px] text-[#0f0f10] placeholder:text-[#989ba2]"
                />
              </div>
            </div>

            <div className="mt-[24px]">
              <p className="text-[16px] font-medium text-black">상의 사이즈</p>
              <div className="mt-[12px] grid grid-cols-[165px_165px] gap-[12px]">
                {SIZE_OPTIONS.map((option) => {
                  const selected = topSize === option;
                  return (
                    <button
                      key={`top-${option}`}
                      type="button"
                      onClick={() =>
                        setTopSize((prev) => (prev === option ? null : option))
                      }
                      className={`flex h-[44px] w-full items-center justify-between rounded-[8px] px-[20px] text-[14px] font-medium ${
                        selected
                          ? "bg-[#eff7fd] text-[#70737c]"
                          : "bg-[#f4f4f5] text-[#70737c]"
                      }`}
                    >
                      <span>{option}</span>
                      <span
                        className={`flex h-[18px] w-[18px] items-center justify-center rounded-full ${
                          selected ? "opacity-100" : "opacity-0"
                        }`}
                      >
                        <Check className="h-[12px] w-[12px] text-[#008bff]" />
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-[24px]">
              <p className="text-[16px] font-medium text-black">하의 사이즈</p>
              <div className="mt-[12px] grid grid-cols-[165px_165px] gap-[12px]">
                {SIZE_OPTIONS.map((option) => {
                  const selected = bottomSize === option;
                  return (
                    <button
                      key={`bottom-${option}`}
                      type="button"
                      onClick={() =>
                        setBottomSize((prev) => (prev === option ? null : option))
                      }
                      className={`flex h-[44px] w-full items-center justify-between rounded-[8px] px-[20px] text-[14px] font-medium ${
                        selected
                          ? "bg-[#eff7fd] text-[#70737c]"
                          : "bg-[#f4f4f5] text-[#70737c]"
                      }`}
                    >
                      <span>{option}</span>
                      <span
                        className={`flex h-[18px] w-[18px] items-center justify-center rounded-full ${
                          selected ? "opacity-100" : "opacity-0"
                        }`}
                      >
                        <Check className="h-[12px] w-[12px] text-[#008bff]" />
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {step === 5 && (
          <section className="pt-[8px]">
            <p className="text-[16px] font-medium text-[#008bff]">5/9</p>
            <h1 className="mt-[6px] text-[20px] font-semibold leading-[1.4] text-black">
              <span className="text-[#429ff0]">추구하는 이미지</span>를
              선택해주세요.
            </h1>

            <div className="mt-[16px] grid grid-cols-[165px_166px] gap-[12px]">
              {IMAGE_STYLE_OPTIONS.map((option) => {
                const selected = imageStyleSelections.has(option);
                return (
                  <button
                    key={option}
                    type="button"
                    className={`flex h-[44px] w-full items-center justify-between rounded-[8px] px-[20px] text-[14px] font-medium ${
                      selected
                        ? "bg-[#eff7fd] text-[#70737c]"
                        : "bg-[#f4f4f5] text-[#70737c]"
                    }`}
                    onClick={() => toggleImageStyle(option)}
                  >
                    <span>{option}</span>
                    <span
                      className={`flex h-[18px] w-[18px] items-center justify-center rounded-full ${
                        selected ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      <Check className="h-[12px] w-[12px] text-[#008bff]" />
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-[32px] w-[342px]">
              <p className="text-[16px] font-medium text-black">기타</p>
              <input
                value={imageStyleEtc}
                onChange={(event) => setImageStyleEtc(event.target.value)}
                placeholder="직접 입력해주세요."
                className="mt-[12px] h-[48px] w-full rounded-[4px] border border-[#dbdcdf] px-[20px] text-[13px] text-[#0f0f10] placeholder:text-[#989ba2]"
              />
            </div>
          </section>
        )}

        {step === 6 && (
          <section className="pt-[8px]">
            <p className="text-[16px] font-medium text-[#008bff]">6/9</p>
            <h1 className="mt-[6px] text-[20px] font-semibold leading-[1.4] text-black">
              선호하는 스타일을 알려주세요.
            </h1>

            <div className="mt-[24px]">
              <p className="text-[16px] font-semibold text-black">색상</p>
              <div className="mt-[12px] grid grid-cols-2 gap-[12px]">
                {COLOR_OPTIONS.map((option) => {
                  const selected = colorSelections.has(option);
                  return (
                    <button
                      key={option}
                      type="button"
                      className={`flex h-[44px] w-full items-center justify-between rounded-[8px] px-[20px] text-[14px] font-medium ${
                        selected
                          ? "bg-[#eff7fd] text-[#70737c]"
                          : "bg-[#f4f4f5] text-[#70737c]"
                      }`}
                      onClick={() => toggleColorSelection(option)}
                    >
                      <span>{option}</span>
                      <span
                        className={`flex h-[18px] w-[18px] items-center justify-center rounded-full ${
                          selected ? "opacity-100" : "opacity-0"
                        }`}
                      >
                        <Check className="h-[12px] w-[12px] text-[#008bff]" />
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-[32px]">
              <p className="text-[16px] font-semibold text-black">핏감</p>
              <div className="mt-[12px] grid grid-cols-3 gap-[8px]">
                {FIT_IMAGE_OPTIONS.map((item) => {
                  const selected = fitSelection === item.label;
                  return (
                    <button
                      key={item.label}
                      type="button"
                      className="flex flex-col items-center gap-[8px]"
                      onClick={() =>
                        setFitSelection((prev) =>
                          prev === item.label ? null : item.label,
                        )
                      }
                    >
                      <div
                        className={`h-[109px] w-[109px] overflow-hidden rounded-[8px] ${
                          selected ? "ring-2 ring-[#008bff]" : ""
                        }`}
                      />
                      <span className="text-[14px] text-[#70737c]">
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-[32px]">
              <p className="text-[16px] font-semibold text-black">무드</p>
              <div className="mt-[12px] grid grid-cols-3 gap-[8px]">
                {MOOD_IMAGE_OPTIONS.map((item) => {
                  const selected = moodSelections.has(item.label);
                  return (
                    <button
                      key={item.label}
                      type="button"
                      className="flex flex-col items-center gap-[8px]"
                      onClick={() => toggleMoodSelection(item.label)}
                    >
                      <div
                        className={`h-[109px] w-[109px] overflow-hidden rounded-[8px] ${
                          selected ? "ring-2 ring-[#008bff]" : ""
                        }`}
                      />
                      <span className="text-[14px] text-[#70737c]">
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {step === 7 && (
          <section className="pt-[8px]">
            <p className="text-[16px] font-medium text-[#008bff]">7/9</p>
            <h1 className="mt-[6px] text-[20px] font-semibold leading-[1.4] text-black">
              본인의 <span className="text-[#429ff0]">체형적 결점</span>으로 생각하는
              부분을 선택해주세요.
            </h1>

            <div className="mt-[16px] grid grid-cols-2 gap-[12px]">
              {BODY_FLAW_OPTIONS.map((option) => {
                const selected = bodySelections.has(option);
                return (
                  <button
                    key={option}
                    type="button"
                    className={`flex h-[44px] w-full items-center justify-between rounded-[8px] px-[20px] text-[14px] font-medium ${
                      selected
                        ? "bg-[#eff7fd] text-[#70737c]"
                        : "bg-[#f4f4f5] text-[#70737c]"
                    }`}
                    onClick={() => toggleBodySelection(option)}
                  >
                    <span>{option}</span>
                    <span
                      className={`flex h-[18px] w-[18px] items-center justify-center rounded-full ${
                        selected ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      <Check className="h-[12px] w-[12px] text-[#008bff]" />
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-[24px]">
              <p className="text-[16px] font-medium text-black">기타</p>
              <input
                value={bodyEtc}
                onChange={(event) => setBodyEtc(event.target.value)}
                placeholder="직접 입력해주세요."
                className="mt-[12px] h-[48px] w-full rounded-[4px] border border-[#dbdcdf] px-[20px] text-[13px] text-[#0f0f10] placeholder:text-[#989ba2]"
              />
            </div>
          </section>
        )}

        {step === 8 && (
          <section className="pt-[8px]">
            <p className="text-[16px] font-medium text-[#008bff]">8/9</p>
            <h1 className="mt-[6px] text-[20px] font-semibold leading-[1.4] text-black">
              <span>원하시는 </span>
              <span className="text-[#008bff]">착장 1세트의 구성</span>
              <span>을 </span>
              선택해주세요.
            </h1>
            <p className="mt-[4px] text-[14px] leading-[1.5] text-[#656870]">
              전문가가 금액대별 최적의 아이템 조합을 만들어드려요.
            </p>

            <div className="mt-[16px]">
              <p className="text-[16px] font-semibold leading-[1.4] text-[#181818]">
                아이템 구성
              </p>
              <div className="mt-[12px] grid grid-cols-2 gap-[12px]">
                {ITEM_OPTIONS.map((option) => {
                  const selected = itemSelections.has(option);
                  return (
                    <button
                      key={option}
                      type="button"
                    className={`flex h-[44px] w-full items-center justify-between rounded-[8px] px-[20px] text-[14px] font-medium ${
                        selected
                          ? "bg-[#eff7fd] text-[#70737c]"
                          : "bg-[#f4f4f5] text-[#70737c]"
                      }`}
                      onClick={() => toggleItemSelection(option)}
                    >
                      <span>{option}</span>
                      <span
                        className={`flex h-[18px] w-[18px] items-center justify-center rounded-full ${
                          selected ? "opacity-100" : "opacity-0"
                        }`}
                      >
                        <Check className="h-[12px] w-[12px] text-[#008bff]" />
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-[32px]">
              <p className="text-[16px] font-semibold leading-[1.4] text-[#181818]">
                선호 가격대
              </p>
              <p className="mt-[8px] text-center text-[16px] font-semibold text-[#181818]">
                {formatPriceRange()}
              </p>
              <div className="mt-[8px] flex justify-center">
                <div className="relative h-[24px] w-[306px]">
                  <div className="absolute top-1/2 h-[1px] w-full -translate-y-1/2 bg-[#e1e2e4]" />
                  <div
                    className="absolute top-1/2 h-[1px] -translate-y-1/2 bg-[#008bff]"
                    style={{
                      left: `${minPercent}%`,
                      width: `${maxPercent - minPercent}%`,
                    }}
                  />
                  <input
                    type="range"
                    min={0}
                    max={PRICE_MAX}
                    value={priceMin}
                    onChange={(event) => handlePriceMin(Number(event.target.value))}
                    className="price-range price-range-min absolute inset-0 h-full w-full"
                  />
                  <input
                    type="range"
                    min={0}
                    max={PRICE_MAX}
                    value={priceMax}
                    onChange={(event) => handlePriceMax(Number(event.target.value))}
                    className="price-range price-range-max absolute inset-0 h-full w-full"
                  />
                </div>
              </div>
              <div className="mt-[8px] flex justify-between text-[13px] text-[#878a93]">
                <span>0원</span>
                <span>20만원</span>
                <span>40만원 이상</span>
              </div>
              <div className="mt-[16px] flex w-[340px] flex-wrap gap-x-[6px] gap-y-[10px]">
                {PRICE_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    className="rounded-[4px] border border-[#e1e2e4] py-[10px] text-[13px] text-[#0f0f10]"
                    style={{ paddingLeft: preset.paddingX, paddingRight: preset.paddingX }}
                    onClick={() => {
                      setPriceMin(preset.min);
                      setPriceMax(preset.max);
                    }}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {step === 9 && (
          <section className="pt-[8px]">
            <p className="text-[16px] font-medium text-[#008bff]">9/9</p>
            <h1 className="mt-[6px] text-[20px] font-semibold leading-[1.4] text-black">
              전문가 상담 목적을 알려주세요.
            </h1>
            <p className="mt-[4px] text-[14px] leading-[1.5] text-[#656870]">
              상담 목적을 구체적으로 작성해 주세요.
              <br />
              매치하고 싶은 옷이 있다면 사진을 추가해 주세요.
            </p>

            <div className="relative mt-[16px] h-[177px] rounded-[8px] border border-[#e1e2e4] bg-[#f4f4f5]">
              <textarea
                value={purposeText}
                onChange={(event) => setPurposeText(event.target.value)}
                maxLength={400}
                placeholder="ex. 이번주에 데이트가 있어서 최대한 댄디한 룩으로 입고 싶어요."
                className="h-full w-full resize-none bg-transparent px-[14px] py-[15px] text-[14px] leading-[1.5] text-[#0f0f10] placeholder:text-[#656870]"
              />
              <span className="absolute bottom-[12px] right-[12px] text-[14px] text-[#656870]">
                <span className={purposeText.length > 0 ? "text-[#008bff]" : ""}>
                  {purposeText.length}
                </span>
                /400
              </span>
            </div>

            <div className="mt-[12px] flex gap-[8px]">
              <input
                ref={purposeInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(event) => {
                  handlePurposeUpload(event.target.files);
                  event.currentTarget.value = "";
                }}
              />
              <button
                type="button"
                className="flex h-[108px] w-[108px] flex-col items-center justify-center rounded-[8px] border border-[#e1e2e4] bg-[#fafafa] text-[14px] text-[#656870]"
                onClick={() => purposeInputRef.current?.click()}
              >
                <Camera className="h-[24px] w-[24px]" />
                <span className="mt-[6px]">{purposeImages.length}/3</span>
              </button>
              {purposeImages.map((image) => (
                <div
                  key={image.id}
                  className="relative h-[108px] w-[108px] overflow-hidden rounded-[8px]"
                >
                  <img
                    src={image.url}
                    alt="추가 이미지"
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    className="absolute right-[6px] top-[6px] flex h-[24px] w-[24px] items-center justify-center rounded-full bg-black/80"
                    onClick={() => removePurposeImage(image.id)}
                  >
                    <X className="h-[14px] w-[14px] text-white" />
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <div className="fixed bottom-0 left-1/2 w-full max-w-[375px] -translate-x-1/2 bg-white">
        <div className="px-[16px] pb-[8px] pt-[4px]">
          <div className="flex justify-end">
            <button
              type="button"
              className="text-[12px] font-medium text-[#878a93]"
              onClick={handlePreviewNext}
            >
              다음 단계로
            </button>
          </div>
        </div>
        <button
          type="button"
          className={`flex h-[90px] w-full items-center justify-center text-[16px] font-semibold text-white ${
            canProceed() ? "bg-[#0f0f10]" : "bg-[#aeb0b6]"
          }`}
          onClick={handleNext}
          disabled={!canProceed()}
        >
          다음
        </button>
        <div className="flex h-[34px] items-center justify-center bg-transparent">
          <div className="h-[5px] w-[134px] rounded-[100px] bg-transparent" />
        </div>
      </div>
    </div>
  );
}
