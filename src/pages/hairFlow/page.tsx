// import { useCallback, useMemo } from "react";
// import { useNavigate, useParams, useSearchParams } from "react-router-dom";
// import { Step1SidePhotos } from "./Step1SidePhotos";
// import { Step2FaceSelect } from "./Step2FaceSelect";
// import { Step3DesiredImage } from "./Step3DesiredImage";
// import { Step4Question } from "./Step4Question";

// type Step = 1 | 2 | 3 | 4;

// function clampStep(raw: string | null): Step {
//   const n = Number(raw);
//   if (n === 1 || n === 2 || n === 3 || n === 4) return n;
//   return 1;
// }

// export function HairSetup() {
//   const navigate = useNavigate();
//   const { reservationId } = useParams<{ reservationId: string }>();
//   const [searchParams, setSearchParams] = useSearchParams();

//   const step: Step = useMemo(() => clampStep(searchParams.get("step")), [searchParams]);

//   const goStep = useCallback(
//     (next: Step, opts?: { replace?: boolean }) => {
//       const sp = new URLSearchParams(searchParams);
//       sp.set("step", String(next));
//       setSearchParams(sp, { replace: opts?.replace ?? false });
//     },
//     [searchParams, setSearchParams],
//   );

//   if (!reservationId) {
//     return (
//       <div className="mx-auto w-full max-w-[420px] p-5">
//         <p className="text-sm text-red-600">reservationId가 없습니다.</p>
//       </div>
//     );
//   }

//   if (step === 1) {
//     return (
//       <Step1SidePhotos
//         reservationId={reservationId}
//         onBack={() => navigate("/", { state: { openCalendarSheet: true } })}
//         onNext={() => goStep(2)}
//       />
//     );
//   }

//   if (step === 2) return <Step2FaceSelect onBack={() => goStep(1)} onNext={() => goStep(3)} />;
//   if (step === 3) return <Step3DesiredImage onBack={() => goStep(2)} onNext={() => goStep(4)} />;

//   return <Step4Question reservationId={reservationId} onBack={() => goStep(3)} onDone={() => {}} />;
// }

import { useEffect, useCallback, useMemo, useLayoutEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Step1SidePhotos } from "./Step1SidePhotos";
import { Step2FaceSelect } from "./Step2FaceSelect";
import { Step3DesiredImage } from "./Step3DesiredImage";
import { Step4Question } from "./Step4Question";

type Step = 1 | 2 | 3 | 4;

function clampStep(raw: string | null): Step {
  const n = Number(raw);
  if (n === 1 || n === 2 || n === 3 || n === 4) return n;
  return 1;
}

export function HairSetup() {
  const navigate = useNavigate();
  const [sp, setSp] = useSearchParams();
  const loc = useLocation();

  // ✅ reservationId는 query에서
  const reservationId = useMemo(() => sp.get("reservationId") ?? "", [sp]);

  // ✅ step도 query에서
  const step: Step = useMemo(() => clampStep(sp.get("step")), [sp]);

  useLayoutEffect(() => {
    // 렌더 직후 1프레임 뒤에 올리면 더 안정적
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      (document.scrollingElement ?? document.documentElement).scrollTop = 0;
    });
  }, [loc.key, step]); // loc.key만 써도 되는데 step까지 같이 두면 더 명확

  // ✅ step만 변경 (reservationId는 유지)
  const goStep = useCallback(
    (next: Step, opts?: { replace?: boolean }) => {
      const nextSp = new URLSearchParams(sp);
      nextSp.set("step", String(next));
      // reservationId 없으면 여기서 넣어줘도 되지만, 보통은 이미 있어야 정상
      setSp(nextSp, { replace: opts?.replace ?? false });
    },
    [sp, setSp],
  );

  // ✅ (선택) 첫 진입에 step이 없으면 step=1을 URL에 박아두기
  // 새로고침/공유 URL 일관성 좋아짐
  // if (!sp.get("step")) goStep(1, { replace: true });
  // ↑ 이건 렌더 중 setSp라서 useEffect로 하는 게 안전. 아래에서 제공.

  useEffect(() => {
    if (!sp.get("step")) {
      const nextSp = new URLSearchParams(sp);
      nextSp.set("step", "1");
      setSp(nextSp, { replace: true });
    }
  }, [sp, setSp]);

  if (!reservationId) {
    return (
      <div className="mx-auto w-full max-w-[420px] p-5">
        <p className="text-sm text-red-600">reservationId가 없습니다.</p>
      </div>
    );
  }

  if (step === 1) {
    return (
      <Step1SidePhotos
        reservationId={reservationId}
        onBack={() => navigate("/explore")}
        onNext={() => goStep(2)}
      />
    );
  }

  if (step === 2) return <Step2FaceSelect onBack={() => goStep(1)} onNext={() => goStep(3)} />;
  if (step === 3) return <Step3DesiredImage onBack={() => goStep(2)} onNext={() => goStep(4)} />;

  return <Step4Question reservationId={reservationId} onBack={() => goStep(3)} onDone={() => {}} />;
}
