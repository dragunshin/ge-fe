import * as React from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Footer from "./component/Footer";
import TopNav from "./component/TopNav";
import { PRICE_MAX } from "./constants";
import type { OutfitImage } from "./types";
import { Step1Guide } from "./Step1Guide";
import { Step2SidePhotos } from "./Step2SidePhotos";
import { Step3OutfitPhotos } from "./Step3OutfitPhotos";
import { Step4BodySize } from "./Step4BodySize";
import { Step5ImageStyle } from "./Step5ImageStyle";
import { Step6StylePreference } from "./Step6StylePreference";
import { Step7BodyFlaws } from "./Step7BodyFlaws";
import { Step8ItemBudget } from "./Step8ItemBudget";
import { Step9Purpose } from "./Step9Purpose";

const createPreview = (file: File) => ({
  id: crypto.randomUUID(),
  url: URL.createObjectURL(file),
});

const releasePreview = (preview?: OutfitImage | null) => {
  if (preview?.url) {
    URL.revokeObjectURL(preview.url);
  }
};

export default function FashionFlowPage() {
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

  const toggleSetValue = (value: string, setter: React.Dispatch<React.SetStateAction<Set<string>>>) => {
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

  const formatPrice = (value: number) => {
    if (value >= PRICE_MAX) return "40만원 이상";
    if (value === 0) return "0원";
    return `${value}만원`;
  };

  const formatPriceRange = () => `${formatPrice(priceMin)} ~ ${formatPrice(priceMax)}`;

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
      return colorSelections.size > 0 && Boolean(fitSelection) && moodSelections.size > 0;
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
      state: {
        from: `${location.pathname}${location.search}`,
        category: "패션",
        step: 9,
      },
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
    navigate("/payment/order", { state: { category: "패션", step: 9 } });
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
      <TopNav onBack={handleBack} />

      <main className="hide-scrollbar flex-1 overflow-y-auto px-[16px] pb-[160px]">
        {step === 1 && (
          <Step1Guide
            introStage={introStage}
            frontImage={frontImage}
            frontInputRef={frontInputRef}
            onRemoveFront={() => removeSingleImage(setFrontImage)}
            onUploadFront={(files) => handleSingleUpload(files, setFrontImage)}
          />
        )}
        {step === 2 && (
          <Step2SidePhotos
            leftImage={leftImage}
            rightImage={rightImage}
            leftInputRef={leftInputRef}
            rightInputRef={rightInputRef}
            onRemoveLeft={() => removeSingleImage(setLeftImage)}
            onRemoveRight={() => removeSingleImage(setRightImage)}
            onUploadLeft={(files) => handleSingleUpload(files, setLeftImage)}
            onUploadRight={(files) => handleSingleUpload(files, setRightImage)}
          />
        )}
        {step === 3 && (
          <Step3OutfitPhotos
            outfits={outfits}
            outfitInputRef={outfitInputRef}
            onUploadOutfits={handleOutfitUpload}
            onRemoveOutfit={removeOutfit}
          />
        )}
        {step === 4 && (
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
        {step === 5 && (
          <Step5ImageStyle
            selections={imageStyleSelections}
            onToggle={(option) => toggleSetValue(option, setImageStyleSelections)}
            etcValue={imageStyleEtc}
            onEtcChange={setImageStyleEtc}
          />
        )}
        {step === 6 && (
          <Step6StylePreference
            colorSelections={colorSelections}
            fitSelection={fitSelection}
            moodSelections={moodSelections}
            onToggleColor={(option) => toggleSetValue(option, setColorSelections)}
            onToggleMood={(option) => toggleSetValue(option, setMoodSelections)}
            onFitChange={(value) =>
              setFitSelection((prev) => (prev === value ? null : value))
            }
          />
        )}
        {step === 7 && (
          <Step7BodyFlaws
            selections={bodySelections}
            onToggle={(option) => toggleSetValue(option, setBodySelections)}
            etcValue={bodyEtc}
            onEtcChange={setBodyEtc}
          />
        )}
        {step === 8 && (
          <Step8ItemBudget
            selections={itemSelections}
            onToggle={(option) => toggleSetValue(option, setItemSelections)}
            priceMin={priceMin}
            priceMax={priceMax}
            minPercent={minPercent}
            maxPercent={maxPercent}
            onPriceMinChange={handlePriceMin}
            onPriceMaxChange={handlePriceMax}
            onPricePreset={(min, max) => {
              setPriceMin(min);
              setPriceMax(max);
            }}
            formatPriceRange={formatPriceRange}
          />
        )}
        {step === 9 && (
          <Step9Purpose
            purposeText={purposeText}
            purposeImages={purposeImages}
            purposeInputRef={purposeInputRef}
            onPurposeTextChange={setPurposeText}
            onUploadPurpose={handlePurposeUpload}
            onRemovePurpose={removePurposeImage}
          />
        )}
      </main>

      <Footer disabled={!canProceed()} onNext={handleNext} onPreviewNext={handlePreviewNext} />
    </div>
  );
}
