import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { putExpertSchedules, type ConsultationType, type ExpertSchedule } from "@/api/expert";
import Back from "@/images/login/back.svg?react";

type LocationState = {
  userId: number;
  existing?: ExpertSchedule[];
};

const TYPES: ConsultationType[] = ["VIDEO", "MESSAGE"];

const META: Record<
  ConsultationType,
  { cardTitle: string; desc: string; inputTitle: string; placeholder: string }
> = {
  VIDEO: {
    cardTitle: "화상 상담",
    desc: "전문가와 화상으로 30분 상담을 진행해요. 솔루션지는 24시간 내로 전송됩니다.",
    inputTitle: "실시간 화상 상담",
    placeholder: "가격 입력",
  },

  MESSAGE: {
    cardTitle: "메시지 상담",
    desc: "고민 설문지 답변을 바탕으로 전문가가\n24시간 내에 솔루션지를 보내드려요.",
    inputTitle: "메시지 상담",
    placeholder: "가격 입력",
  },
};

function TopBar({ title }: { title: string }) {
  const nav = useNavigate();
  return (
    <header className="sticky top-0 z-50 bg-white px-5 pt-3">
      <div className="flex items-center px-1 py-2 bg-white">
        <button onClick={() => nav(-1)} className="mr-[8px]" aria-label="뒤로가기">
          <Back className="h-[18px] w-[18px]" />
        </button>
        <p className="pre_title_semi_20">{title}</p>
      </div>
    </header>
  );
}

function parseDigits(v: string) {
  const n = Number(v.replace(/[^\d]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function formatInputKRW(n: number) {
  if (!n) return "";

  return `${String(n)}`;
}

function formatKRWSummary(n: number) {
  return `${n.toLocaleString("ko-KR")}원`;
}

function SelectCircle({ checked }: { checked: boolean }) {
  return (
    <div
      className={[
        "flex h-[18px] w-[18px] items-center justify-center rounded-full border",
        checked ? "border-[#1D6FFF]" : "border-[#C9CDD5]",
      ].join(" ")}
    >
      {checked ? <div className="h-[8px] w-[8px] rounded-full bg-[#1D6FFF]" /> : null}
    </div>
  );
}

export default function ExpertScheduleEditPage() {
  const nav = useNavigate();
  const loc = useLocation();
  const state = (loc.state || {}) as LocationState;

  const existing = state.existing ?? [];
  const hasExisting = existing.some((x) => x.isActive);

  const initial = useMemo(() => {
    const map = new Map<ConsultationType, ExpertSchedule>();
    for (const x of existing) map.set(x.consultationType, x);
    return map;
  }, [existing]);

  const [selected, setSelected] = useState<Record<ConsultationType, boolean>>({
    MESSAGE: false,
    VIDEO: false,
  });
  const [price, setPrice] = useState<Record<ConsultationType, number>>({
    MESSAGE: 0,
    VIDEO: 0,
  });

  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // ✅ existing로 프리필
  useEffect(() => {
    const nextSelected = { ...selected };
    const nextPrice = { ...price };

    for (const t of TYPES) {
      const it = initial.get(t);
      if (it?.isActive) {
        nextSelected[t] = true;
        nextPrice[t] = it.price ?? 0;
      }
    }
    setSelected(nextSelected);
    setPrice(nextPrice);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 첫 진입 1회

  const toggle = (t: ConsultationType) => {
    setSelected((prev) => {
      const next = { ...prev, [t]: !prev[t] };
      // 꺼질 때 가격은 유지해도 되는데, 원하면 0으로 초기화 가능
      return next;
    });
  };

  const onSubmit = async () => {
    setFormError(null);

    const anySelected = TYPES.some((t) => selected[t]);
    if (!anySelected) {
      setFormError("가능한 상담을 최소 1개 이상 선택해주세요.");
      return;
    }

    for (const t of TYPES) {
      if (selected[t] && (!price[t] || price[t] <= 0)) {
        setFormError(`${META[t].inputTitle} 가격을 입력해주세요.`);
        return;
      }
    }

    const payload: ExpertSchedule[] = TYPES.map((t) => ({
      consultationType: t,
      isActive: selected[t],
      price: selected[t] ? price[t] : 0,
    }));

    try {
      setSaving(true);
      await putExpertSchedules(payload);
      nav("/mypage", { replace: true });
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "저장에 실패했어요.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-dvh bg-white">
      <TopBar title="가능한 상담 설정" />

      <div className="px-4 pb-28 pt-3">
        <div className="rounded-[8px] bg-[#e5f4ff] px-4 py-[12px] mb-5 text-center pre_subtitle_med_14 text-[#008bff]">
          가능한 상담을 선택하고 가격을 입력해주세요.
        </div>

        <div className="mt-5 space-y-3">
          {TYPES.map((t) => {
            const isOn = selected[t];
            return (
              <div
                key={t}
                className={[
                  "rounded-[8px] border bg-white p-4",
                  isOn ? "border-[#008bff]" : "border-[#e1e2e4]",
                ].join(" ")}
              >
                <button
                  type="button"
                  onClick={() => toggle(t)}
                  className="flex w-full items-start gap-3 text-left"
                >
                  <div className="pt-1">
                    <SelectCircle checked={isOn} />
                  </div>

                  <div className="flex-1">
                    <div className="pre_subtitle_semi_16 text-[#0f0f10]">{META[t].cardTitle}</div>
                    <div className="mt-1 whitespace-pre-line pre_body_reg_13 text-[#878a93]">
                      {META[t].desc}
                    </div>
                  </div>

                  {isOn && price[t] > 0 ? (
                    <div className="shrink-0 pre_subtitle_semi_14 text-[#0f0f10]">
                      {formatKRWSummary(price[t])}
                    </div>
                  ) : null}
                </button>

                {isOn ? (
                  <div className="mt-4">
                    {/* <div className="mb-2 text-[13px] font-bold text-[#121214]">
                      {META[t].inputTitle}
                    </div> */}

                    <div className="relative">
                      <input
                        value={formatInputKRW(price[t])}
                        onChange={(e) =>
                          setPrice((prev) => ({ ...prev, [t]: parseDigits(e.target.value) }))
                        }
                        placeholder={META[t].placeholder}
                        inputMode="numeric"
                        className="h-11 w-full rounded-[4px] border border-[#ebdcdf] bg-white px-3 pr-10 pre_cap_reg_13 text-[#292a2d] outline-none placeholder:pre_cap_reg_13 placeholder:text-[#70737c]"
                      />
                      {price[t] > 0 ? (
                        <button
                          type="button"
                          aria-label="clear"
                          onClick={() => setPrice((prev) => ({ ...prev, [t]: 0 }))}
                          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-[#121214] p-1 text-white"
                        >
                          <X size={14} />
                        </button>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        {formError ? (
          <div className="mt-4 rounded-xl border border-[#F3D6D6] bg-[#FFF5F5] p-3 text-[13px] font-semibold text-[#B42318]">
            {formError}
          </div>
        ) : null}
      </div>

      <div className="flex justify-center px-4 pb-6 pt-3">
        <button
          type="button"
          disabled={saving}
          onClick={onSubmit}
          className="h-12 w-full max-w-[400px] rounded-[4px] bg-[#181818] text-[16px] font-bold text-white"
        >
          {saving ? "저장 중…" : hasExisting ? "저장하기" : "등록 완료"}
        </button>
      </div>
    </div>
  );
}
