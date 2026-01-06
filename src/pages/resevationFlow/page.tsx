import { useEffect, useMemo, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ConsultationMethodSheet from "./reservationSheet/typeReservation";
import DateTimeBottomSheet from "./reservationSheet/calendar";

type ConsultType = "MESSAGE" | "LIVE";

type ConsultLog = {
  at: string;
  value: ConsultType;
};

type DateTimeLog = {
  at: string;
  dateLabel: string;
  timeId: string;
};

function nowLabel() {
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

function formatKoDate(date: Date) {
  // 2025. 10. 28. 같은 형태
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export default function ConsultationSheetTestPage() {
  const navigate = useNavigate();
  const STORAGE_KEY = "reservation_sheet_logs_v1";
  // 상담방식 시트
  const [openConsult, setOpenConsult] = useState(false);
  const [defaultConsult, setDefaultConsult] = useState<ConsultType>("MESSAGE");
  const [consultLog, setConsultLog] = useState<ConsultLog[]>([]);

  // 날짜/시간 시트
  const [openDateTime, setOpenDateTime] = useState(false);
  const [dateTimeLog, setDateTimeLog] = useState<DateTimeLog[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return;
    }
    try {
      const parsed = JSON.parse(stored) as {
        consultLog?: ConsultLog[];
        dateTimeLog?: DateTimeLog[];
      };
      if (parsed.consultLog) {
        setConsultLog(parsed.consultLog);
      }
      if (parsed.dateTimeLog) {
        setDateTimeLog(parsed.dateTimeLog);
      }
    } catch {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ consultLog, dateTimeLog }),
    );
  }, [consultLog, dateTimeLog]);

  const containerMax = useMemo(() => "max-w-[420px]", []);

  return (
    <div className="min-h-dvh bg-[#F5F6F8]">
      <div className={["mx-auto w-full px-5 py-8", containerMax].join(" ")}>
        <header className="app-header flex items-center gap-2 pb-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-[#e7e9ed]"
            aria-label="뒤로가기"
          >
            <ChevronLeft className="h-5 w-5 text-[#111827]" />
          </button>
          <span className="text-[16px] font-semibold text-[#111827]">상담 예약</span>
        </header>
        <h1 className="text-[20px] font-semibold text-[#111827]">Bottom Sheet 테스트</h1>
        <p className="mt-2 text-[13px] leading-5 text-[#6B7280]">
          아래 카드에서 각각 시트를 열어보고 동작(선택/닫기/다음)을 확인하세요.
        </p>

        {/* 1) 상담 방식 시트 테스트 */}
        <div className="mt-6 rounded-[14px] bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[14px] font-semibold text-[#111827]">상담 방식 시트</div>
              <div className="mt-1 text-[12px] text-[#6B7280]">
                기본 선택값을 바꿔서 시트가 열릴 때 선택 상태를 확인하세요.
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setDefaultConsult("MESSAGE")}
                className={[
                  "h-9 rounded-[10px] px-3 text-[13px] font-semibold transition",
                  defaultConsult === "MESSAGE"
                    ? "bg-[#0B0B0C] text-white"
                    : "bg-[#F3F4F6] text-[#111827]",
                ].join(" ")}
              >
                MESSAGE
              </button>
              <button
                type="button"
                onClick={() => setDefaultConsult("LIVE")}
                className={[
                  "h-9 rounded-[10px] px-3 text-[13px] font-semibold transition",
                  defaultConsult === "LIVE"
                    ? "bg-[#0B0B0C] text-white"
                    : "bg-[#F3F4F6] text-[#111827]",
                ].join(" ")}
              >
                LIVE
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setOpenDateTime(false); // 동시에 안 뜨게
              setOpenConsult(true);
            }}
            className="mt-4 h-[52px] w-full rounded-[12px] bg-[#0B0B0C] text-[15px] font-semibold text-white active:scale-[0.99]"
          >
            상담 방식 시트 열기
          </button>

          <div className="mt-4 rounded-[12px] bg-[#F9FAFB] p-3">
            <div className="flex items-center justify-between">
              <div className="text-[13px] font-semibold text-[#111827]">선택 로그</div>
              <button
                type="button"
                onClick={() => setConsultLog([])}
                className="text-[12px] font-semibold text-[#6B7280] hover:text-[#111827]"
              >
                비우기
              </button>
            </div>

            {consultLog.length === 0 ? (
              <div className="mt-2 text-[13px] text-[#9CA3AF]">아직 로그가 없습니다.</div>
            ) : (
              <ul className="mt-2 space-y-2">
                {consultLog.map((item, idx) => (
                  <li
                    key={`${item.at}-${idx}`}
                    className="flex items-center justify-between rounded-[10px] bg-white px-3 py-2"
                  >
                    <span className="text-[12px] text-[#6B7280]">{item.at}</span>
                    <span className="text-[13px] font-semibold text-[#111827]">{item.value}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* 2) 날짜/시간 시트 테스트 */}
        <div className="mt-6 rounded-[14px] bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[14px] font-semibold text-[#111827]">날짜/시간 시트</div>
              <div className="mt-1 text-[12px] text-[#6B7280]">
                달력 + 시간 pill 선택 후 “다음” 눌러 payload가 오는지 확인하세요.
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setOpenConsult(false); // 동시에 안 뜨게
              setOpenDateTime(true);
            }}
            className="mt-4 h-[52px] w-full rounded-[12px] bg-[#0B0B0C] text-[15px] font-semibold text-white active:scale-[0.99]"
          >
            날짜/시간 시트 열기
          </button>

          <div className="mt-4 rounded-[12px] bg-[#F9FAFB] p-3">
            <div className="flex items-center justify-between">
              <div className="text-[13px] font-semibold text-[#111827]">선택 로그</div>
              <button
                type="button"
                onClick={() => setDateTimeLog([])}
                className="text-[12px] font-semibold text-[#6B7280] hover:text-[#111827]"
              >
                비우기
              </button>
            </div>

            {dateTimeLog.length === 0 ? (
              <div className="mt-2 text-[13px] text-[#9CA3AF]">아직 로그가 없습니다.</div>
            ) : (
              <ul className="mt-2 space-y-2">
                {dateTimeLog.map((item, idx) => (
                  <li
                    key={`${item.at}-${idx}`}
                    className="grid grid-cols-[52px_1fr] gap-3 rounded-[10px] bg-white px-3 py-2"
                  >
                    <span className="text-[12px] text-[#6B7280]">{item.at}</span>
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] font-semibold text-[#111827]">
                        {item.dateLabel}
                      </span>
                      <span className="text-[12px] font-semibold text-[#111827]/70">
                        {item.timeId}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* 상담 방식 시트 */}
      <ConsultationMethodSheet
        open={openConsult}
        onClose={() => setOpenConsult(false)}
        defaultValue={defaultConsult}
        onNext={(selected) => {
          setConsultLog((prev) => [{ at: nowLabel(), value: selected }, ...prev]);
          setOpenConsult(false);
        }}
      />

      {/* 날짜/시간 시트 */}
      <DateTimeBottomSheet
        open={openDateTime}
        onClose={() => setOpenDateTime(false)}
        onNext={({ date, timeId }) => {
          setDateTimeLog((prev) => [
            { at: nowLabel(), dateLabel: formatKoDate(date), timeId },
            ...prev,
          ]);
          setOpenDateTime(false);
          navigate("/reservation/fashion");
        }}
      />
    </div>
  );
}
