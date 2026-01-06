import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Step1SidePhotos } from "./Step1SidePhotos";
import { Step2DesiredImage } from "./Step2DesiredImage";
import { Step3Question } from "./Step3Question";

export function HairSetup() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);

  if (step === 1) {
    // return <Step1SidePhotos onBack={() => history.back()} onNext={() => setStep(2)} />;
    // 라우팅 수정 신용섭: 캘린더 선택 페이지로 이동
    return (
      <Step1SidePhotos
        onBack={() => navigate("/", { state: { openCalendarSheet: true } })}
        onNext={() => setStep(2)}
      />
    );
  }

  if (step === 2) {
    return <Step2DesiredImage onBack={() => setStep(1)} onNext={() => setStep(3)} />;
  }

  return <Step3Question onBack={() => setStep(2)} onDone={() => {}} />;
}
