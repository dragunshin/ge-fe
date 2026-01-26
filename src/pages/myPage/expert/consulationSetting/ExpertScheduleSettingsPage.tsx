import Back from "@/images/login/back.svg?react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getExpertSchedules, type ExpertSchedule, type ConsultationType } from "@/api/expert";

function formatKRW(n: number) {
  return `${n.toLocaleString("ko-KR")}원`;
}

const META: Record<ConsultationType, { title: string; desc: string }> = {
  MESSAGE: {
    title: "메시지 상담",
    desc: "고민 설문지 답변을 바탕으로 전문가가\n24시간 내에 솔루션지를 보내드려요.",
  },
  VIDEO: {
    title: "화상 상담",
    desc: "전문가와 화상으로 30분 상담을 진행해요.\n솔루션지는 24시간 내로 전송됩니다.",
  },
};

function TopBar({ title, right }: { title: string; right?: React.ReactNode }) {
  const nav = useNavigate();
  return (
    <header className="sticky top-0 z-50 bg-white px-5 pt-3">
      <div className="flex items-center px-1 py-2 bg-white">
        <button onClick={() => nav("/mypage")} className="mr-[8px]" aria-label="뒤로가기">
          <Back className="h-[18px] w-[18px]" />
        </button>
        <p className="pre_title_semi_20">{title}</p>
        <div className="ml-auto">{right}</div>
      </div>
    </header>
  );
}

export default function ExpertScheduleSettingsPage() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<ExpertSchedule[]>([]);

  const { userId } = useParams<{ userId: string }>();

  const refetch = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await getExpertSchedules(userId ?? "");
      setItems(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "불러오기에 실패했어요.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  const activeItems = useMemo(() => items.filter((it) => it.isActive), [items]);

  const isEmpty = activeItems.length === 0;

  if (loading) {
    return <div className="min-h-dvh bg-white p-4 text-[14px] text-[#5B5D66]">불러오는 중…</div>;
  }

  if (error) {
    return (
      <div className="min-h-dvh bg-white p-4">
        <div className="rounded-2xl border border-[#F3D6D6] bg-[#FFF5F5] p-4 text-[14px] text-[#B42318]">
          {error}
        </div>
        <button
          type="button"
          onClick={() => void refetch()}
          className="mt-4 w-full rounded-xl bg-[#121214] py-3 text-[15px] font-semibold text-white"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-white">
      <TopBar
        title="가능한 상담 설정"
        right={
          !isEmpty ? (
            <button
              type="button"
              onClick={() => nav("/expert/schedules/edit", { state: { existing: items, userId } })}
              className="text-[14px] font-semibold text-[#008bff]"
            >
              편집
            </button>
          ) : null
        }
      />

      <div className="px-4 pb-28 pt-6">
        {isEmpty ? (
          // ✅ 1.png
          <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
            <div className="whitespace-pre-line pre_subtitle_semi_16 text-[#46474c]">
              아직 가능한 상담 종류 등록을{"\n"}하지 않으셨어요! 지금 등록해보세요.
            </div>

            <button
              type="button"
              onClick={() => nav("/expert/schedules/edit", { state: { existing: items, userId } })}
              className="mt-6 rounded-[4px] bg-[#181818] px-9 py-2 pre_subtitle_semi_14 text-white"
            >
              지금 등록하기
            </button>
          </div>
        ) : (
          // ✅ 2.png
          <div>
            <div className="rounded-[8px] bg-[#e5f4ff] px-4 py-[12px] mb-5 text-center pre_subtitle_med_14 text-[#008bff]">
              편집을 눌러 실시간 가능한 상담을 수정해 보세요.
            </div>

            <div className="mt-6 space-y-3">
              {activeItems.map((it) => (
                <div
                  key={it.consultationType}
                  className="rounded-[8px] border border-[#E1e2e4] bg-white p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="pre_subtitle_semi_16 text-[#0f0f10]">
                        {META[it.consultationType].title}
                      </div>
                      <div className="mt-1 whitespace-pre-line pre_body_reg_13 text-[#878a93]">
                        {META[it.consultationType].desc}
                      </div>
                    </div>

                    <div className="shrink-0 pre_subtitle_semi_16 text-[#0f0f10]">
                      {formatKRW(it.price)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {!isEmpty && (
        <div className="flex justify-center px-4 pb-6 pt-3">
          {" "}
          {/* ✅ flex와 justify-center 추가 */}
          <button
            type="button"
            onClick={() => nav("/expert/schedules/edit", { state: { existing: items, userId } })}
            // ✅ min-w-[400px] 삭제 -> w-full과 max-w-[400px] 조합으로 변경
            // 이렇게 하면 모바일에서는 꽉 차고, PC에서는 400px 중앙 정렬이 됩니다.
            className="h-12 w-full max-w-[400px] rounded-[4px] bg-[#181818] text-[16px] font-bold text-white"
          >
            편집하기
          </button>
        </div>
      )}
    </div>
  );
}
