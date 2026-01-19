import { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "react-quill-new/dist/quill.snow.css";
import Back from "@/images/login/back.svg?react";

import { useConsultationSolution, useConsultationConcern } from "@/hooks/useConsulation";

export default function SolutionView() {
  const { consultationId } = useParams();
  const nav = useNavigate();

  const consultationIdNum = useMemo(() => {
    const n = Number(consultationId);
    return Number.isFinite(n) ? n : null;
  }, [consultationId]);

  const { solution, loading, error, refetch } = useConsultationSolution(consultationIdNum);

  const { data: concern } = useConsultationConcern(consultationIdNum);
  const nickname = concern?.nickname;

  if (loading) {
    return <div className="p-4 text-[14px] text-[#5B5D66]">불러오는 중…</div>;
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="rounded-2xl border border-[#F3D6D6] bg-[#FFF5F5] p-4 text-[14px] text-[#B42318]">
          데이터를 불러오지 못했어요: {error}
        </div>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-3 w-full rounded-xl bg-[#111] py-3 text-[14px] font-semibold text-white"
        >
          다시 시도
        </button>
      </div>
    );
  }

  if (!solution?.trim()) {
    return <div className="p-4 text-[14px] text-[#5B5D66]">작성된 솔루션이 없어요.</div>;
  }

  return (
    <div className="min-h-screen bg-[#F6F6F7] p-2">
      {/* Top bar */}
      <header className="px-2 my-1 mb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center px-1 py-2">
            <button onClick={() => nav(-1)} className="mr-[8px]">
              <Back className="w-[18px] h-[18px]" />
            </button>
            <p className="pre_title_semi_18 ml-1">
              {nickname ? `${nickname}님의 솔루션지` : "솔루션지"}
            </p>
          </div>
        </div>
      </header>

      {/* ✅ Quill HTML 렌더링 */}
      <div className="rounded-xl border border-[#ECEEF2] bg-white p-1">
        <div className="ql-snow">
          <div
            className="ql-editor"
            // 서버에서 저장한 HTML 그대로 표시
            dangerouslySetInnerHTML={{ __html: solution }}
          />
        </div>
      </div>
    </div>
  );
}
