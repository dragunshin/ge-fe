import * as React from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Footer from "./component/Footer";
import TopNav from "./component/TopNav";
import { PRICE_MAX, PRICE_PRESETS, SIZE_OPTIONS } from "./constants";
import { uploadImageViaPresign } from "@/api/s3forFlow";
import type { OutfitImage } from "./types";
import { Step1Guide } from "./Step1Guide";
import { Step2SidePhotos } from "./Step2SidePhotos";
import { Step3OutfitPhotos } from "./Step3OutfitPhotos";
import { Step4BodySize } from "./Step4BodySize";
import { Step6StylePreference } from "./Step6StylePreference";
import { Step7BodyFlaws } from "./Step7BodyFlaws";
import { Step8ItemBudget } from "./Step8ItemBudget";
import { Step9Purpose } from "./Step9Purpose";
import { reservationService } from "@/services/reservation.service";

const createPreview = (file: File) => ({
  id: crypto.randomUUID(),
  url: URL.createObjectURL(file),
  file,
});

type SizeOption = (typeof SIZE_OPTIONS)[number];

const releasePreview = (preview?: OutfitImage | null) => {
  if (preview?.url) {
    URL.revokeObjectURL(preview.url);
  }
};

export default function FashionFlowPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [step, setStep] = React.useState(1);
  const [introStage] = React.useState<1 | 2>(2);
  const [frontImage, setFrontImage] = React.useState<OutfitImage | null>(null);
  const [leftImage, setLeftImage] = React.useState<OutfitImage | null>(null);
  const [rightImage, setRightImage] = React.useState<OutfitImage | null>(null);
  const [outfitKeys, setOutfitKeys] = React.useState<string[]>([]);
  const [purposeKeys, setPurposeKeys] = React.useState<string[]>([]);
  const [heightValue, setHeightValue] = React.useState("");
  const [weightValue, setWeightValue] = React.useState("");
  const [topSize, setTopSize] = React.useState<SizeOption | null>(null);
  const [bottomSize, setBottomSize] = React.useState<SizeOption | null>(null);
  const [colorSelections, setColorSelections] = React.useState<Set<string>>(
    () => new Set(),
  );
  const [fitSelection, setFitSelection] = React.useState<string | null>(null);
  const [imageStyleSelections, setImageStyleSelections] = React.useState<Set<string>>(
    () => new Set(),
  );
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
  const [selectedPricePreset, setSelectedPricePreset] = React.useState<string | null>(
    null,
  );
  const [hasPricePresetSelection, setHasPricePresetSelection] = React.useState(false);
  const [purposeText, setPurposeText] = React.useState("");

  const reservationIdRaw =
    searchParams.get("reservationId") ??
    searchParams.get("reservation_id") ??
    (location.state as { reservationId?: number } | null)?.reservationId ??
    sessionStorage.getItem("consult_reservation_id");
  const reservationId = reservationIdRaw ? Number(reservationIdRaw) : null;
  const paymentOrderPath = reservationId
    ? `/payment/order?reservationId=${reservationId}`
    : "/payment/order";

  const frontInputRef = React.useRef<HTMLInputElement | null>(null);
  const leftInputRef = React.useRef<HTMLInputElement | null>(null);
  const rightInputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    const stepParam = Number(searchParams.get("step"));
    if (!Number.isNaN(stepParam) && stepParam >= 1 && stepParam <= 6) {
      setStep(stepParam);
    }
  }, [searchParams]);

  React.useEffect(() => {
    return () => {
      releasePreview(frontImage);
      releasePreview(leftImage);
      releasePreview(rightImage);
      // no-op for multi uploads handled by picker
    };
  }, [frontImage, leftImage, rightImage]);

  const handleSingleUpload = (
    files: FileList | null,
    setter: React.Dispatch<React.SetStateAction<OutfitImage | null>>,
    imageType: string,
  ) => {
    const file = files?.[0];
    if (!file) return;
    if (!reservationId) {
      window.alert("예약 ID가 없습니다. 다시 시도해주세요.");
      return;
    }
    const preview = { ...createPreview(file), isUploading: true };
    setter((prev) => {
      releasePreview(prev);
      return preview;
    });
    uploadImageViaPresign({
      file,
      resourceType: "consultation",
      resourceId: reservationId,
      imageType,
    })
      .then(({ key }) => {
        setter((prev) => {
          if (!prev || prev.id !== preview.id) return prev;
          return { ...prev, key, isUploading: false };
        });
      })
      .catch((error) => {
        console.error(error);
        window.alert("업로드에 실패했어요. 다시 시도해주세요.");
        setter((prev) => {
          if (!prev || prev.id !== preview.id) return prev;
          releasePreview(prev);
          return null;
        });
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

  const formatPrice = (value: number) => {
    if (value >= PRICE_MAX) return "40만원 이상";
    if (value === 0) return "0원";
    return `${value}만원`;
  };

  const formatPriceRange = () => `${formatPrice(priceMin)} ~ ${formatPrice(priceMax)}`;

  const handlePriceMin = (value: number) => {
    setPriceMin(Math.min(value, priceMax));
    setSelectedPricePreset(null);
    setHasPricePresetSelection(false);
  };

  const handlePriceMax = (value: number) => {
    setPriceMax(Math.max(value, priceMin));
    setSelectedPricePreset(null);
    setHasPricePresetSelection(false);
  };

  const addOutfitKey = (key: string) => {
    setOutfitKeys((prev) => [...prev, key]);
  };

  const removeOutfitKey = (key: string) => {
    setOutfitKeys((prev) => prev.filter((item) => item !== key));
  };

  const addPurposeKey = (key: string) => {
    setPurposeKeys((prev) => [...prev, key]);
  };

  const removePurposeKey = (key: string) => {
    setPurposeKeys((prev) => prev.filter((item) => item !== key));
  };

  const canProceed = () => {
    if (step === 1) {
      const hasMinimumOutfits = outfitKeys.length >= 2;
      const hasRequiredKeys =
        Boolean(frontImage?.key) &&
        Boolean(leftImage?.key) &&
        Boolean(rightImage?.key);
      return hasMinimumOutfits && hasRequiredKeys;
    }
    if (step === 2) {
      const hasHeight = Boolean(formatNumeric(heightValue));
      const hasWeight = Boolean(formatNumeric(weightValue));
      return hasHeight && hasWeight && Boolean(topSize) && Boolean(bottomSize);
    }
    if (step === 3) return bodySelections.size > 0;
    if (step === 4) {
      return (
        colorSelections.size > 0 && Boolean(fitSelection) && imageStyleSelections.size > 0
      );
    }
    if (step === 5) return itemSelections.size > 0;
    if (step === 6) return purposeText.trim().length > 0;
    return false;
  };

  const mapBodyType = (value: string) => {
    const map: Record<string, string> = {
      "좁은 어깨": "좁은어깨",
      "얇은 다리": "얇은다리",
      "얇은 팔": "얇은팔",
      "볼록한 배": "볼록한배",
      "굵은 다리": "굵은다리",
      "큰 몸통": "큰몸통",
      "얄상한 몸": "얄상한몸",
      "상하체 비율": "상하체비율",
      "머리 크기": "머리크기",
    };
    return map[value] ?? value;
  };

  const submitFashionConcern = async () => {
    if (!reservationId) {
      window.alert("예약 ID가 없습니다. 다시 시도해주세요.");
      return false;
    }
    if (!frontImage?.key || !leftImage?.key || !rightImage?.key) return false;

    setIsSubmitting(true);

    try {
      const frontKey = frontImage.key;
      const leftKey = leftImage.key;
      const rightKey = rightImage.key;
      const favoriteKeys = outfitKeys;
      const consultationKeys = purposeKeys;

      const bodyTypeDisadvantages = Array.from(bodySelections).map(mapBodyType);
      const styleColors = Array.from(colorSelections);
      const styleImages = Array.from(imageStyleSelections);

      await reservationService.updateFashionConcern(reservationId, {
        fashion: {
          height: Number(formatNumeric(heightValue)),
          weight: Number(formatNumeric(weightValue)),
          topSize: topSize ?? "M",
          bottomSize: bottomSize ?? "M",
          bodyTypeDisadvantages,
          bodyTypeEtcText: bodyEtc.trim() ? bodyEtc : undefined,
          styleColors,
          styleFits: fitSelection ? [fitSelection] : [],
          styleImages,
          styleEtcText: imageStyleEtc.trim() ? imageStyleEtc : undefined,
          outfitItems: Array.from(itemSelections),
          outfitPriceRange: {
            minPrice: priceMin * 10000,
            maxPrice: priceMax * 10000,
          },
            images: {
              front: [frontKey],
              left: [leftKey],
              right: [rightKey],
              favorite: favoriteKeys,
              purpose: consultationKeys.length ? consultationKeys : undefined,
            },
          },
        });
      return true;
    } catch (error) {
      console.error(error);
      window.alert("고민지 저장에 실패했어요. 다시 시도해주세요.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = async () => {
    if (!canProceed()) {
      if (step === 1 && introStage === 2 && outfitKeys.length < 2) {
        window.alert("사진을 최소 2장 이상 업로드해 주세요.");
        return;
      }
      if (
        step === 1 &&
        introStage === 2 &&
        (!frontImage?.key || !leftImage?.key || !rightImage?.key)
      ) {
        window.alert("사진 업로드가 완료되지 않았어요. 잠시만 기다려주세요.");
      }
      return;
    }
    if (step < 6) {
      setStep((prev) => prev + 1);
      return;
    }
    const submitted = await submitFashionConcern();
    if (!submitted) return;
    navigate(paymentOrderPath, {
      state: {
        from: `${location.pathname}${location.search}`,
        category: "패션",
        step: 6,
      },
    });
  };

  const handlePreviewNext = () => {
    if (step < 6) {
      setStep((prev) => prev + 1);
      return;
    }
    navigate(paymentOrderPath, {
      state: {
        from: `${location.pathname}${location.search}`,
        category: "패션",
        step: 6,
      },
    });
  };

  const handleBack = () => {
    if (step === 1) {
      const returnPath = sessionStorage.getItem("consult_return_path");
      if (returnPath) {
        navigate(returnPath, { state: { openCalendarSheet: true } });
      } else {
        navigate("/", { state: { openCalendarSheet: true } });
      }
      return;
    }
    if (step === 2) {
      setStep(1);
      return;
    }
    setStep((prev) => prev - 1);
  };

  const minPercent = (priceMin / PRICE_MAX) * 100;
  const maxPercent = (priceMax / PRICE_MAX) * 100;

  return (
    <div className="flex min-h-full flex-col bg-white text-[#0f0f10]">
      <TopNav onBack={handleBack} />

      <main className="hide-scrollbar flex-1 overflow-y-auto px-[16px] pb-[160px]">
        {step === 1 && (
          <>
            <Step1Guide
              introStage={introStage}
              frontImage={frontImage}
              frontInputRef={frontInputRef}
              onRemoveFront={() => removeSingleImage(setFrontImage)}
              onUploadFront={(files) => handleSingleUpload(files, setFrontImage, "front")}
            />
            {introStage === 2 && (
              <>
                <Step2SidePhotos
                  leftImage={leftImage}
                  rightImage={rightImage}
                  leftInputRef={leftInputRef}
                  rightInputRef={rightInputRef}
                  onRemoveLeft={() => removeSingleImage(setLeftImage)}
                  onRemoveRight={() => removeSingleImage(setRightImage)}
                  onUploadLeft={(files) => handleSingleUpload(files, setLeftImage, "left")}
                  onUploadRight={(files) => handleSingleUpload(files, setRightImage, "right")}
                />
                <Step3OutfitPhotos
                  keys={outfitKeys}
                  reservationId={reservationId}
                  onAddKey={addOutfitKey}
                  onRemoveKey={removeOutfitKey}
                />
              </>
            )}
          </>
        )}
        {step === 2 && (
          <Step4BodySize
            heightValue={heightValue}
            weightValue={weightValue}
            topSize={topSize}
            bottomSize={bottomSize}
            onHeightChange={(value) => setHeightValue(formatNumeric(value))}
            onHeightBlur={() => setHeightValue((prev) => applyUnit(prev, "cm"))}
            onHeightFocus={() => setHeightValue((prev) => formatNumeric(prev))}
            onWeightChange={(value) => setWeightValue(formatNumeric(value))}
            onWeightBlur={() => setWeightValue((prev) => applyUnit(prev, "kg"))}
            onWeightFocus={() => setWeightValue((prev) => formatNumeric(prev))}
            onTopSizeChange={(value) =>
              setTopSize((prev) => (prev === value ? null : value))
            }
            onBottomSizeChange={(value) =>
              setBottomSize((prev) => (prev === value ? null : value))
            }
          />
        )}
        {step === 3 && (
          <Step7BodyFlaws
            selections={bodySelections}
            onToggle={(option) => toggleSetValue(option, setBodySelections)}
            etcValue={bodyEtc}
            onEtcChange={setBodyEtc}
          />
        )}
        {step === 4 && (
          <Step6StylePreference
            colorSelections={colorSelections}
            fitSelection={fitSelection}
            imageStyleSelections={imageStyleSelections}
            imageStyleEtc={imageStyleEtc}
            onToggleColor={(option) => toggleSetValue(option, setColorSelections)}
            onFitChange={(value) =>
              setFitSelection((prev) => (prev === value ? null : value))
            }
            onToggleImageStyle={(option) =>
              toggleSetValue(option, setImageStyleSelections)
            }
            onImageStyleEtcChange={setImageStyleEtc}
          />
        )}
        {step === 5 && (
          <Step8ItemBudget
            selections={itemSelections}
            onToggle={(option) => toggleSetValue(option, setItemSelections)}
            priceMin={priceMin}
            priceMax={priceMax}
            minPercent={minPercent}
            maxPercent={maxPercent}
            selectedPreset={selectedPricePreset}
            hasPresetSelection={hasPricePresetSelection}
            onPriceMinChange={handlePriceMin}
            onPriceMaxChange={handlePriceMax}
            onPricePreset={(min, max) => {
              setPriceMin(min);
              setPriceMax(max);
              const preset = PRICE_PRESETS.find(
                (entry) => entry.min === min && entry.max === max,
              );
              setSelectedPricePreset(preset?.label ?? null);
              setHasPricePresetSelection(Boolean(preset?.label));
            }}
            formatPriceRange={formatPriceRange}
          />
        )}
        {step === 6 && (
          <Step9Purpose
            purposeText={purposeText}
            keys={purposeKeys}
            reservationId={reservationId}
            onPurposeTextChange={setPurposeText}
            onAddKey={addPurposeKey}
            onRemoveKey={removePurposeKey}
          />
        )}
      </main>

      <Footer
        disabled={!canProceed() || isSubmitting}
        onNext={handleNext}
        onPreviewNext={handlePreviewNext}
      />
    </div>
  );
}
  const toggleSetValue = (
    value: string,
    setter: React.Dispatch<React.SetStateAction<Set<string>>>,
  ) => {
    setter((prev) => {
      const next = new Set(prev);
      if (next.has(value)) {
        next.delete(value);
      } else {
        next.add(value);
      }
      return next;
    });
  };
