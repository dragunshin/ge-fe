"use client";

import * as React from "react";
import { ChevronLeft, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

type Option = { id: string; label: string };

const OPTIONS: Option[] = [
  { id: "hair", label: "헤어" },
  { id: "skin", label: "피부" },
  { id: "makeup", label: "메이크업" },
  { id: "fashion", label: "패션" },
];

export default function FaceStep() {
  const navigate = useNavigate();
  const [selected, setSelected] = React.useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const canContinue = selected.size > 0;

  return (
    <div className="h-screen flex flex-col bg-white text-gray-900 overflow-hidden">
      {/* Top bar */}
      <header className="shrink-0 flex h-12 items-center justify-between bg-white px-3">
        <button
          className="flex items-center gap-1 text-gray-900"
          onClick={() => history.back()}
          aria-label="뒤로가기"
        >
          <ChevronLeft className="size-5" />
        </button>
        <button
          onClick={() => navigate('/')}
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          건너뛰기
        </button>
      </header>

      <main className="flex-1 px-4 pt-1 overflow-y-auto scrollbar-hide">
        <p className="mb-2 text-sm font-medium text-[#429FF04D]">1/7</p>
        <h1 className="mb-6 text-[22px] font-bold leading-snug">
          관심 분야를 선택해주세요.
        </h1>

        {/* ==== 수정된 그리드: 라벨을 버튼 밖으로 ==== */}
        <section className="grid grid-cols-3 gap-x-4 gap-y-8">
          {OPTIONS.map((opt) => {
            const isActive = selected.has(opt.id);

            const tile =
              "relative aspect-square w-full rounded-2xl transition focus:outline-none";
            const tileColor = isActive
              ? "bg-blue-300"
              : "bg-gray-300";

            return (
              <div key={opt.id} className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => toggle(opt.id)}
                  className={`${tile} ${tileColor}`}
                  aria-pressed={isActive}
                  aria-label={opt.label}
                >
                  {/* 체크 배지: 비선택이면 렌더 X */}
                  {isActive && (
                    <div className="pointer-events-none absolute inset-0 z-10 grid place-items-center">
                      <div className="grid size-5 place-items-center rounded-full bg-white shadow-sm">
                        <Check className="size-3 text-blue-500" />
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
        {/* <section className="mt-8">
          <h2 className="mb-2 text-base font-semibold">기타</h2>
          <Input
            value={etc}
            onChange={(e) => setEtc(e.target.value)}
            placeholder="직접 입력해주세요."
            className="h-12 w-[342px] rounded-[4px] border-gray-200 text-[15px] placeholder:text-gray-400"
          />
        </section> */}
      </main>

      {/* Bottom action */}
      <div className="shrink-0 bg-white pt-2 pb-2">
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
