"use client";

import * as React from "react";
import { ChevronLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Option = { id: string; label: string };

const OPTIONS: Option[] = [
  { id: "eyes", label: "눈" },
  { id: "eyebrow", label: "눈썹" },
  { id: "nose", label: "코" },
  { id: "mouth", label: "입" },
  { id: "faceShape", label: "얼굴형" },
  { id: "harmony", label: "조화" },
];

export default function FaceStep() {
  const [selected, setSelected] = React.useState<Set<string>>(new Set(["eyebrow"]));
  const [etc, setEtc] = React.useState("");

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const canContinue = selected.size > 0 || etc.trim().length > 0;

  return (
    <div className="mx-auto min-h-dvh bg-white text-gray-900">
      {/* Top bar */}
      <header className="sticky top-0 z-10 flex h-12 items-center justify-between bg-white/90 px-3 backdrop-blur">
        <button
          className="flex items-center gap-1 text-gray-900"
          onClick={() => history.back()}
          aria-label="뒤로가기"
        >
          <ChevronLeft className="size-5" />
        </button>
        <span className="text-sm text-gray-500">건너뛰기</span>
      </header>

      <main className="px-4 pb-[88px] pt-1">
        <p className="mb-2 text-sm font-medium text-[#429FF04D]">1/7</p>
        <h1 className="mb-6 text-[22px] font-bold leading-snug">
          얼굴에서 자신 있는 부분을 골라주세요.
        </h1>

        {/* ==== 수정된 그리드: 라벨을 버튼 밖으로 ==== */}
        <section className="grid grid-cols-3 gap-x-4 gap-y-8">
          {OPTIONS.map((opt) => {
            const isActive = selected.has(opt.id);

            const tile =
              "relative aspect-square w-full rounded-2xl border transition focus:outline-none focus:ring-2 focus:ring-black/10";
            const tileColor = isActive
              ? "bg-slate-400 border-slate-300"
              : "bg-gray-200/80 border-gray-200";
            const overlay = isActive ? "" : "absolute inset-0 rounded-2xl bg-[#AEB0B6]";

            return (
              <div key={opt.id} className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => toggle(opt.id)}
                  className={`${tile} ${tileColor}`}
                  aria-pressed={isActive}
                  aria-label={opt.label}
                >
                  {/* 회색 덮개 (비활성일 때만) */}
                  {!isActive && <div className={overlay} aria-hidden />}

                  {/* 체크 배지: 비선택이면 렌더 X */}
                  {isActive && (
                    <div className="pointer-events-none absolute inset-0 z-10 grid place-items-center">
                      <div className="grid size-5 place-items-center rounded-full bg-white/90 shadow-sm">
                        <Check className="size-3 text-slate-700" />
                      </div>
                    </div>
                  )}
                </button>

                {/* 라벨: 버튼 아래에 배치되어 겹치지 않음 */}
                <span
                  className={`mt-2 text-center text-[15px] ${isActive ? "text-gray-900 font-semibold" : "text-gray-700"}`}
                >
                  {opt.label}
                </span>
              </div>
            );
          })}
        </section>

        {/* ETC */}
        <section className="mt-8">
          <h2 className="mb-2 text-base font-semibold">기타</h2>
          <Input
            value={etc}
            onChange={(e) => setEtc(e.target.value)}
            placeholder="직접 입력해주세요."
            className="h-12 w-[342px] rounded-[4px] border-gray-200 text-[15px] placeholder:text-gray-400"
          />
        </section>
      </main>

      {/* Bottom action */}
      <div className="fixed inset-x-0 bottom-0 z-20 mx-auto bg-white/80 pb-[env(safe-area-inset-bottom)] pt-2 backdrop-blur">
        <Button
          size="lg"
          disabled={!canContinue}
          className="h-14 w-full rounded-none bg-black text-base font-semibold text-white hover:bg-black/90 disabled:opacity-50"
        >
          다음
        </Button>
        <div className="mx-auto mt-2 h-1 w-28 rounded-full bg-gray-300" />
      </div>
    </div>
  );
}
