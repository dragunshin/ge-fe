import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Step1SidePhotos } from "./Step1SidePhotos";
import { Step2DesiredImage } from "./Step2DesiredImage";
import { Step3Question } from "./Step3Question";

export function HairSetup() {
  const navigate = useNavigate();
  const initialStep = ((window.history.state as { usr?: { step?: number } } | null)?.usr
    ?.step ?? 1) as 1 | 2 | 3;
  const [step, setStep] = useState<1 | 2 | 3>(initialStep);
  const handleBack = () => {
    if (step === 1) {
      navigate("/", { state: { openCalendarSheet: true } });
      return;
    }
    setStep((prev) => (prev > 1 ? ((prev - 1) as 1 | 2 | 3) : prev));
  };

  if (step === 1) {
    return <Step1SidePhotos onBack={handleBack} onNext={() => setStep(2)} />;
  }

  if (step === 2) {
    return <Step2DesiredImage onBack={handleBack} onNext={() => setStep(3)} />;
  }

  return <Step3Question onBack={handleBack} onDone={() => {}} />;
}
