import { useState, useEffect, useMemo } from "react";
import { ChevronLeft, XCircle } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

// --- [아이콘 컴포넌트] (경로 확인 필요) ---
import Radioo from "@/images/reservationFlow/nomalRadio.svg?react";
import SelectedRadio from "@/images/reservationFlow/selectedRadio.svg?react";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type ConsultType = "MESSAGE" | "VIDEO";

interface ScheduleItem {
  type: ConsultType;
  title: string;
  description: string;
  price: number;
  isActive: boolean;
}

interface ServerScheduleData {
  consultationType: ConsultType;
  price: number;
  isActive: boolean;
}

const MASTER_DATA: Record<ConsultType, { title: string; description: string }> = {
  MESSAGE: {
    title: "메세지 상담",
    description: "고민 설문지 답변을 바탕으로 전문가가\n24시간 내에 솔루션지를 보내드려요.",
  },
  VIDEO: {
    title: "실시간 화상 상담",
    description: "전문가와 화상으로 30분 상담을 진행해요.\n솔루션지는 24시간 내로 전송됩니다.",
  },
};

function RadioIcon({ checked }: { checked: boolean }) {
  return (
    <div className="shrink-0">
      {checked ? (
        <SelectedRadio className="h-[20px] w-[20px]" />
      ) : (
        <Radioo className="h-[20px] w-[20px]" />
      )}
    </div>
  );
}

export default function ExpertConsultationSettings() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const [mode, setMode] = useState<"view" | "edit">("view");
  const [isLoading, setIsLoading] = useState(true);
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);

  const hasActiveItems = useMemo(() => schedules.some((s) => s.isActive), [schedules]);
  const formatNumber = (num: number) => num.toLocaleString();

  // --------------------------------------------------------------------------
  // 1. 초기 데이터 로드 (수정됨: userId 체크 및 로딩 상태 해제 보장)
  // --------------------------------------------------------------------------
  useEffect(() => {
    const fetchData = async () => {
      console.log("📌 데이터 로딩 시작. userId:", userId);

      // [핵심 수정] userId가 없으면 로딩을 끄고 함수 종료
      if (!userId) {
        console.warn(
          "⚠️ URL에 userId가 없습니다. 테스트를 위해 브라우저 주소를 확인해주세요. (예: /expert/1/schedules)",
        );
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        // 실제 API 호출
        console.log(`📡 GET 요청 시도: /api/expert/${userId}/schedules`);
        const res = await axios.get<{ data: ServerScheduleData[] }>(
          `/api/expert/${userId}/schedules`,
        );

        console.log("✅ 서버 응답 데이터:", res.data);
        const serverDataList = res.data.data || [];

        // 데이터 병합
        const initializedData: ScheduleItem[] = (Object.keys(MASTER_DATA) as ConsultType[]).map(
          (type) => {
            const serverItem = serverDataList.find((d) => d.consultationType === type);
            const master = MASTER_DATA[type];
            return {
              type,
              title: master.title,
              description: master.description,
              price: serverItem ? serverItem.price : 0,
              isActive: serverItem ? serverItem.isActive : false,
            };
          },
        );

        setSchedules(initializedData);
      } catch (err) {
        console.error("❌ 데이터 불러오기 실패:", err);
        // 에러가 나도 화면이 멈추지 않게 기본값으로 설정
        const fallbackData = (Object.keys(MASTER_DATA) as ConsultType[]).map((type) => ({
          type,
          title: MASTER_DATA[type].title,
          description: MASTER_DATA[type].description,
          price: 0,
          isActive: false,
        }));
        setSchedules(fallbackData);
      } finally {
        // [중요] 성공하든 실패하든 로딩 종료
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  // ... (이하 핸들러 및 렌더링 로직은 기존과 동일) ...

  const toggleActive = (type: ConsultType) => {
    setSchedules((prev) =>
      prev.map((item) => (item.type === type ? { ...item, isActive: !item.isActive } : item)),
    );
  };

  const handlePriceChange = (type: ConsultType, valueStr: string) => {
    const numberValue = Number(valueStr.replace(/[^0-9]/g, ""));
    setSchedules((prev) =>
      prev.map((item) => (item.type === type ? { ...item, price: numberValue } : item)),
    );
  };

  const clearPrice = (type: ConsultType) => {
    setSchedules((prev) => prev.map((item) => (item.type === type ? { ...item, price: 0 } : item)));
  };

  const handleSave = async () => {
    if (!userId) return;

    // 가격 유효성 검사 (활성 상태인데 가격이 0원이면 경고)
    const invalidItem = schedules.find((item) => item.isActive && item.price === 0);
    if (invalidItem) {
      alert(`'${invalidItem.title}'의 가격을 입력해주세요.`);
      return;
    }

    const payload = {
      schedules: schedules.map((item) => ({
        consultationType: item.type,
        price: item.price,
        isActive: item.isActive,
      })),
    };

    try {
      console.log("📡 PUT 요청 시도:", payload);
      await axios.put(`/api/expert/${userId}/schedules`, payload);
      alert("상담 설정이 저장되었습니다.");
      setMode("view");
    } catch (err) {
      console.error("저장 실패:", err);
      alert("저장에 실패했습니다.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <span className="text-gray-500 font-medium">로딩 중... (콘솔을 확인해주세요)</span>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white text-[#0f0f10]">
      {/* 헤더 */}
      <header className="sticky top-0 z-10 flex h-[56px] items-center justify-between bg-white px-4">
        <button type="button" onClick={() => (mode === "edit" ? setMode("view") : navigate(-1))}>
          <ChevronLeft className="h-6 w-6" />
        </button>
        <h1 className="text-[18px] font-semibold">
          {mode === "edit" ? "상담 설정 및 가격" : "가능한 상담 설정"}
        </h1>
        {mode === "view" && hasActiveItems ? (
          <button
            onClick={() => setMode("edit")}
            className="text-[16px] font-medium text-[#008BFF]"
          >
            편집
          </button>
        ) : (
          <div className="w-6" />
        )}
      </header>

      {/* CASE 1: 초기 상태 (데이터 없음) */}
      {mode === "view" && !hasActiveItems && (
        <div className="flex flex-1 flex-col items-center justify-center px-6 pb-20">
          <p className="whitespace-pre-line text-center text-[16px] font-medium leading-[150%] text-[#878a93]">
            아직 가능한 상담 종류 등록을{"\n"}
            하지 않으셨어요! 지금 등록해보세요.
          </p>
          <button
            onClick={() => setMode("edit")}
            className="mt-6 h-[48px] w-[140px] rounded-[4px] bg-[#181818] text-[14px] font-bold text-white active:scale-[0.98]"
          >
            지금 등록하기
          </button>
        </div>
      )}

      {/* CASE 2: 리스트 뷰 */}
      {mode === "view" && hasActiveItems && (
        <div className="flex-1">
          <div className="w-full bg-[#E5F4FF] px-5 py-4 text-center">
            <p className="text-[14px] font-medium text-[#008BFF]">
              편집을 눌러 실시간 화상 상담도 추가해보세요.
            </p>
          </div>
          <div className="px-5 pt-6 space-y-3">
            {schedules
              .filter((s) => s.isActive)
              .map((item) => (
                <div
                  key={item.type}
                  className="w-full rounded-[12px] border border-[#e1e2e4] bg-white p-5"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[16px] font-semibold text-[#0f0f10]">{item.title}</span>
                    <span className="text-[16px] font-bold text-[#0f0f10]">
                      {item.price.toLocaleString()}원
                    </span>
                  </div>
                  <p className="whitespace-pre-line text-[14px] leading-[150%] text-[#878a93]">
                    {item.description}
                  </p>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* CASE 3: 편집 모드 */}
      {mode === "edit" && (
        <div className="flex flex-1 flex-col">
          <div className="w-full bg-[#E5F4FF] px-5 py-4 text-center">
            <p className="text-[14px] font-medium text-[#008BFF]">
              가능한 상담을 선택하고 가격을 설정해주세요.
            </p>
          </div>

          <div className="flex-1 px-5 pt-6 pb-32 space-y-6">
            {schedules.map((item) => {
              const isActive = item.isActive;
              return (
                <div key={item.type} className="space-y-3">
                  <button
                    onClick={() => toggleActive(item.type)}
                    className={cn(
                      "w-full rounded-[12px] border p-5 text-left transition-all flex items-start justify-between gap-3",
                      isActive
                        ? "border-[#008BFF] ring-1 ring-[#008BFF] bg-white"
                        : "border-[#e1e2e4] bg-white",
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <RadioIcon checked={isActive} />
                      <div>
                        <div
                          className={cn(
                            "text-[16px] font-semibold",
                            isActive ? "text-[#008BFF]" : "text-[#0f0f10]",
                          )}
                        >
                          {item.title}
                        </div>
                        <p className="mt-1 whitespace-pre-line text-[14px] leading-[150%] text-[#878a93]">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </button>

                  {isActive && (
                    <div className="relative animate-in fade-in slide-in-from-top-2 duration-200">
                      <label className="mb-2 block text-[14px] font-medium text-[#0f0f10]">
                        {item.title} 가격
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={item.price > 0 ? formatNumber(item.price) : ""}
                          onChange={(e) => handlePriceChange(item.type, e.target.value)}
                          placeholder="가격을 입력해주세요"
                          className="h-[52px] w-full rounded-[8px] border border-[#e1e2e4] px-4 text-[16px] text-[#0f0f10] placeholder:text-[#C9CDD4] focus:border-[#181818] focus:outline-none"
                        />
                        <span className="absolute right-10 top-1/2 -translate-y-1/2 text-[16px] text-[#0f0f10]">
                          원
                        </span>
                        {item.price > 0 && (
                          <button
                            onClick={() => clearPrice(item.type)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#C9CDD4]"
                          >
                            <XCircle className="w-5 h-5 fill-[#878a93] text-white" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="fixed bottom-0 left-0 w-full bg-white px-5 pb-8 pt-2 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
            <button
              onClick={handleSave}
              className="flex h-[52px] w-full items-center justify-center rounded-[8px] bg-[#181818] text-[16px] font-bold text-white transition active:scale-[0.99]"
            >
              등록 완료
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
