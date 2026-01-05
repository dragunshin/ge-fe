import { useState } from "react";
import { Step1SidePhotos } from "./Step1SidePhotos";
import { Step2DesiredImage } from "./Step2DesiredImage";
import { Step3Question } from "./Step3Question";

export function HairSetup() {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  if (step === 1) {
    return <Step1SidePhotos onBack={() => history.back()} onNext={() => setStep(2)} />;
  }

  if (step === 2) {
    return <Step2DesiredImage onBack={() => setStep(1)} onNext={() => setStep(3)} />;
  }

  return <Step3Question onBack={() => setStep(2)} onDone={() => {}} />;
}
