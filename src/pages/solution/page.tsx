// import ConcernView from "./customer/readConcern";
// import EditorPage from "./writeSolution";
// import { useMe } from "@/hooks/userMe";

// export default function ConsultationGate() {
//   const { me, loading, error, refetch } = useMe();

//   if (loading) return <div className="p-4 text-sm text-slate-600">불러오는 중…</div>;

//   if (error) {
//     return (
//       <div className="p-4">
//         <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
//           유저 정보를 불러오지 못했어요: {error}
//         </div>
//         <button
//           type="button"
//           onClick={() => refetch()}
//           className="mt-3 w-full rounded-lg bg-slate-900 py-3 text-sm font-semibold text-white"
//         >
//           다시 시도
//         </button>
//       </div>
//     );
//   }

//   if (me && me.userType !== "MEMBER") return <EditorPage />;

//   // if (me && me.userType == "MEMBER") return <EditorPage />;
//   return <ConcernView />;
// }

// src/pages/ConsultationGate.tsx
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import ConcernView from "./customer/readConcern"; // 너 경로에 맞게
import EditorPage from "./writeSolution"; // 너 경로에 맞게
import { useMe } from "@/hooks/userMe"; // 너 훅 경로에 맞게

export default function ConsultationGate() {
  const { me, loading, error, refetch } = useMe();
  const { consultationId } = useParams();

  // (선택) consultationId 유효성 체크
  const consultationIdNum = useMemo(() => {
    if (!consultationId) return null;
    const n = Number(consultationId);
    return Number.isFinite(n) ? n : null;
  }, [consultationId]);

  if (!consultationIdNum) {
    return <div className="p-4 text-sm text-slate-600">잘못된 consultationId에요.</div>;
  }

  if (loading) return <div className="p-4 text-sm text-slate-600">불러오는 중…</div>;

  if (error) {
    return (
      <div className="p-4">
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          유저 정보를 불러오지 못했어요: {error}
        </div>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-3 w-full rounded-lg bg-slate-900 py-3 text-sm font-semibold text-white"
        >
          다시 시도
        </button>
      </div>
    );
  }

  // ✅ 핵심 분기
  if (me?.userType !== "MEMBER") return <EditorPage />; // EXPERT 등
  return <ConcernView />; // MEMBER
}
