import { useEffect, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Check, ChevronLeft, X } from "lucide-react";
import { getUserMe } from '@/api/mypage';
import { reservationService } from '@/services/reservation.service';

const StepArrow = () => (
  <svg
    aria-hidden="true"
    className="h-[18px] w-[18px]"
    viewBox="0 0 18 18"
    fill="none"
  >
    <path
      d="M7 4.5L11.5 9L7 13.5"
      stroke="#989BA2"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export function PaymentOrderPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const state = location.state as {
    consultType?: "MESSAGE" | "VIDEO";
    from?: string;
    flowFrom?: string;
    step?: number;
    expertName?: string;
    categoryLabel?: string;
    scheduleLabel?: string;
    price?: number;
    reservationId?: number;
    fromComplete?: boolean;
  } | null;
  const scheduleLabel =
    state?.scheduleLabel ??
    sessionStorage.getItem("consult_schedule_label") ??
    "2025년 10월 28일 오전 11:30";
  const consultTypeFromState = state?.consultType;
  const consultTypeFromStorage = state?.from === "/hair/setup"
    ? sessionStorage.getItem("consult_type")
    : null;
  const consultType =
    consultTypeFromState === "MESSAGE" || consultTypeFromState === "VIDEO"
      ? consultTypeFromState
      : consultTypeFromStorage === "MESSAGE" || consultTypeFromStorage === "VIDEO"
        ? consultTypeFromStorage
        : "MESSAGE";
  const consultLabel = consultType === "VIDEO" ? "실시간 화상 상담" : "메세지 상담";
  const storedPrice = Number(sessionStorage.getItem("consult_price"));
  const orderPriceFromState = typeof state?.price === "number" ? state.price : null;
  const consultPriceMap: Record<"MESSAGE" | "VIDEO", number> = {
    MESSAGE: 24000,
    VIDEO: 40000,
  };
  const orderPrice =
    orderPriceFromState ??
    (Number.isFinite(storedPrice) && storedPrice > 0 ? storedPrice : null) ??
    consultPriceMap[consultType];
  const [agreements, setAgreements] = useState({
    order: false,
    privacy: false,
    thirdParty: false,
  });
  const canPay = agreements.order && agreements.privacy && agreements.thirdParty;
  const feePrice = 0;
  const couponDiscount = 0;
  const reservationIdParam =
    searchParams.get("reservationId") ??
    searchParams.get("reservation_id") ??
    (state?.reservationId ? String(state.reservationId) : null);
  const reservationId = reservationIdParam ? Number(reservationIdParam) : Number.NaN;
  const hasReservationId = Number.isFinite(reservationId);
  const [pointInput, setPointInput] = useState("0");
  const [pointUsed, setPointUsed] = useState(0);
  const [pointBalance, setPointBalance] = useState(0);
  const [isApplyingPoints, setIsApplyingPoints] = useState(false);
  const maxUsablePoints = Math.min(pointBalance, orderPrice);
  const remainingPoints = Math.max(maxUsablePoints - pointUsed, 0);
  const totalPoints = pointBalance;
  const hasPointApplied = pointUsed > 0;
  const totalPrice = Math.max(orderPrice + feePrice - couponDiscount - pointUsed, 0);
  const formatCurrency = (value: number) => `${value.toLocaleString('ko-KR')}원`;
  const formatPoint = (value: number) => `${value.toLocaleString('ko-KR')}P`;
  const appendStep = (path: string, step?: number) => {
    if (!step || path.includes('step=')) return path;
    const joiner = path.includes('?') ? '&' : '?';
    return `${path}${joiner}step=${step}`;
  };

  const handleOrderAgreementChange = (checked: boolean) => {
    setAgreements({
      order: checked,
      privacy: checked,
      thirdParty: checked,
    });
  };

  const handleRequiredAgreementChange = (
    key: 'privacy' | 'thirdParty',
    checked: boolean,
  ) => {
    setAgreements((prev) => {
      const next = { ...prev, [key]: checked };
      return {
        ...next,
        order: next.privacy && next.thirdParty,
      };
    });
  };

  const handleBack = () => {
    if (state?.fromComplete && state?.flowFrom) {
      const withReservationId =
        hasReservationId && !state.flowFrom.includes("reservationId=")
          ? appendStep(
            `${state.flowFrom}${state.flowFrom.includes("?") ? "&" : "?"}reservationId=${reservationId}`,
            state.step,
          )
          : appendStep(state.flowFrom, state.step);
      navigate(withReservationId, { state });
      return;
    }
    if (state?.from) {
      const withReservationId =
        hasReservationId && !state.from.includes("reservationId=")
          ? appendStep(`${state.from}${state.from.includes("?") ? "&" : "?"}reservationId=${reservationId}`, state.step)
          : appendStep(state.from, state.step);
      navigate(withReservationId, { state });
      return;
    }
    navigate(-1);
  };

  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        const me = await getUserMe({ signal: ac.signal });
        setPointBalance(me.points ?? 0);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        console.error(error);
      }
    })();
    return () => ac.abort();
  }, []);

  const clampPoints = (value: number) =>
    Math.min(Math.max(value, 0), maxUsablePoints);

  const applyPoints = async (points: number) => {
    if (!hasReservationId) {
      window.alert("예약 ID가 없습니다. 다시 시도해주세요.");
      return;
    }
    const clamped = clampPoints(points);
    setIsApplyingPoints(true);
    try {
      const response = await reservationService.applyPoints(reservationId, {
        pointsToUse: clamped,
      });
      const data = response.data;
      setPointUsed(data.pointsUsed);
      setPointInput(String(data.pointsUsed));
      if (typeof data.remainingPoints === "number") {
        setPointBalance(data.remainingPoints + data.pointsUsed);
      }
    } catch (error) {
      console.error(error);
      window.alert("포인트 적용에 실패했어요. 다시 시도해주세요.");
    } finally {
      setIsApplyingPoints(false);
    }
  };

  const handlePointInputChange = (value: string) => {
    const numeric = value.replace(/\D/g, "");
    const parsed = numeric ? Number(numeric) : 0;
    const clamped = clampPoints(parsed);
    setPointInput(String(clamped));
    setPointUsed(clamped);
  };

  const handlePointInputBlur = () => {
    void applyPoints(pointUsed);
  };

  const handlePointClear = () => {
    handlePointInputChange("0");
    void applyPoints(0);
  };

  const handlePointInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      void applyPoints(pointUsed);
    }
  };

  const expertName =
    state?.expertName ?? sessionStorage.getItem("consult_expert_name") ?? "전문가";
  const categoryLabel =
    state?.categoryLabel ?? sessionStorage.getItem("consult_category_label") ?? "헤어";

  return (
    <div className="flex min-h-full flex-col bg-white text-[#0f0f10]">
      <header className="app-header sticky top-0 z-20 flex h-[44px] items-center gap-[15px] bg-white px-4">
        <button onClick={handleBack} aria-label="뒤로가기">
          <ChevronLeft className="h-[24px] w-[24px]" />
        </button>
        <h1 className="text-[20px] font-semibold leading-[1.4]">주문하기</h1>
      </header>

      <main className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="mt-[24px] flex flex-col items-center gap-[16px]">
          <div className="flex items-center gap-[13px]">
            <div className="flex items-center gap-[8px]">
              <div className="flex h-[18px] w-[18px] items-center justify-center rounded-[9.6px] bg-[#008bff]">
                <span className="text-[12px] font-medium leading-[1.4] text-white">1</span>
              </div>
              <span className="text-[14px] font-semibold leading-[1.4] text-[#0f0f10]">
                주문 확인 및 결제
              </span>
            </div>
            <StepArrow />
            <div className="flex items-center gap-[8px]">
              <div className="flex h-[18px] w-[18px] items-center justify-center rounded-[9.6px] bg-[#e1e2e4]">
                <span className="text-[12px] font-medium leading-[1.4] text-[#656870]">2</span>
              </div>
              <span className="text-[14px] font-medium leading-[1.4] text-[#989ba2]">
                주문 완료
              </span>
            </div>
          </div>
          <div className="h-[8px] w-full bg-[#f4f4f5]" />
        </div>

        <div className="px-4 pt-[28px]">
          <p className="text-[16px] font-semibold leading-[1.4] text-[#0f0f10]">주문 내용</p>
          <div className="mt-[16px] rounded-[4px] border border-[#e1e2e4] px-[16px] py-[14px]">
            <div className="flex items-center gap-[8px] text-[14px] leading-[1.4]">
              <span className="font-semibold text-[#171719]">{expertName}</span>
              <span className="text-[#aeb0b6]">{categoryLabel}</span>
            </div>
            <div className="mt-[10px] rounded-[4px] border border-[#e1e2e4] bg-[#fafafa] px-[16px] py-[12px]">
              <div className="flex items-start justify-between text-[14px] font-semibold leading-[1.4] text-[#171719]">
                <span className="flex-1">{consultLabel}</span>
                <span>{formatCurrency(orderPrice)}</span>
              </div>
              <p className="mt-[6px] text-[13px] leading-[1.4] text-[#656870]">
                {scheduleLabel}
              </p>
            </div>
          </div>
          <ul className="mt-[14px] list-disc pl-[19.5px] text-[13px] leading-[1.4] text-[#aeb0b6]">
            <li>
              주문 내용은 앱 내 채팅 메세지를 통해 다시 공지될
              <br />
              예정입니다.
            </li>
          </ul>
        </div>

        <div className="mt-[34px] h-[8px] w-full bg-[#f4f4f5]" />

        <div className="px-4 pt-[28px]">
          <p className="text-[16px] font-semibold leading-[1.4] text-[#0f0f10]">할인</p>
          <div className="mt-[16px] flex flex-col items-end gap-[12px]">
            <div className="flex w-full flex-wrap items-center gap-x-[16px] gap-y-[8px]">
              <span className="shrink-0 text-[14px] leading-[1.4] text-[#878a93]">
                포인트
              </span>
              <div className="flex min-w-0 flex-1 flex-wrap items-center gap-[8px]">
                <div className="relative min-w-[140px] flex-1">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={pointInput}
                    onChange={(e) => handlePointInputChange(e.target.value)}
                    onBlur={handlePointInputBlur}
                    onKeyDown={handlePointInputKeyDown}
                    disabled={isApplyingPoints || !hasReservationId}
                    className="flex h-[40px] w-full items-center justify-end rounded-[4px] border border-[#e1e2e4] px-[16px] pr-[40px] text-right text-[14px] font-semibold leading-[1.4] text-[#0f0f10] disabled:bg-[#f4f4f5]"
                  />
                  {hasPointApplied && (
                    <button
                      type="button"
                      onClick={handlePointClear}
                      disabled={isApplyingPoints || !hasReservationId}
                      aria-label="포인트 사용 취소"
                      className="absolute right-[12px] top-1/2 flex h-[18px] w-[18px] -translate-y-1/2 items-center justify-center rounded-full bg-[#e1e2e4] text-[#878a93] disabled:opacity-50"
                    >
                      <X className="h-[12px] w-[12px]" />
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    handlePointInputChange(String(maxUsablePoints));
                    void applyPoints(maxUsablePoints);
                  }}
                  disabled={maxUsablePoints <= 0 || isApplyingPoints || !hasReservationId}
                  className="h-[40px] rounded-[4px] border border-[#dbdcdf] px-[16px] text-[14px] leading-[1.4] text-[#171719] disabled:text-[#b5b7bd]"
                >
                  전액사용
                </button>
              </div>
            </div>
            <div className="flex items-center gap-[8px] text-[14px] leading-[1.4]">
              <span className="font-semibold text-[#0f0f10]">
                사용 가능 {formatPoint(remainingPoints)}
              </span>
              <span className="text-[#878a93]">/</span>
              <span className="text-[#878a93]">보유 {formatPoint(totalPoints)}</span>
            </div>
          </div>
        </div>

        <div className="mt-[24px] h-[8px] w-full bg-[#f4f4f5]" />

        <div className="px-4 pt-[28px]">
          <div className="flex items-center justify-between text-[16px] font-semibold leading-[1.4] text-[#0f0f10]">
            <span>결제 방법</span>
            <span className="text-[14px] font-semibold text-right">무통장 입금</span>
          </div>
          <div className="mt-[13px] w-full rounded-[4px] border border-[#e1e2e4] px-[20px] py-[16px]">
            <div className="flex items-center justify-between text-[14px] leading-[1.4]">
              <span className="text-[#878a93]">입금 계좌</span>
              <span className="font-semibold text-[#171719]">
                신한 110-578-261003
              </span>
            </div>
          </div>
        </div>

        <div className="mt-[24px] h-[8px] w-full bg-[#f4f4f5]" />

        <div className="px-4 pt-[28px]">
          <div className="flex flex-col gap-[16px]">
            <p className="text-[16px] font-semibold leading-[1.4] text-[#0f0f10]">결제 금액</p>
            <div className="flex flex-col gap-[12px] text-[14px] leading-[1.4]">
              <div className="flex items-center justify-between">
                <span className="text-[#505158]">주문 금액</span>
                <span className="font-semibold text-[#0f0f10]">
                  {formatCurrency(orderPrice)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#505158]">수수료</span>
                <span className="font-semibold text-[#0f0f10]">
                  {formatCurrency(feePrice)}
                </span>
              </div>
              {/* <div className="flex items-center justify-between">
                <span className="text-[#505158]">쿠폰 할인</span>
                <span className="font-semibold text-[#0f0f10]">
                  {formatCurrency(couponDiscount)}
                </span>
              </div> */}
              <div className="flex items-center justify-between">
                <span className="text-[#505158]">포인트 사용</span>
                <span className="font-semibold text-[#0f0f10]">
                  {formatCurrency(pointUsed)}
                </span>
              </div>
              <div className="h-px w-full bg-[#dbdcdf]" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-[4px]">
                  <span className="font-semibold text-[#505158]">총 결제 금액</span>
                  <span className="text-[#aeb0b6]">(VAT 포함)</span>
                </div>
                <span className="font-semibold text-[#0f0f10]">
                  {formatCurrency(totalPrice)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-[24px] h-[8px] w-full bg-[#f4f4f5]" />

        <div className="px-4 pt-[28px]">
          <p className="text-[16px] font-semibold leading-[1.4] text-[#0f0f10]">구매 혜택</p>
          <div className="mt-[16px] flex items-center justify-between text-[14px] leading-[1.4]">
            <span className="text-[#505158]">리뷰 작성 포인트</span>
            <span className="font-semibold text-[#008bff]">최대~</span>
          </div>
        </div>

        <div className="mt-[24px] h-[8px] w-full bg-[#f4f4f5]" />

        <div className="px-4 pb-[28px] pt-[28px]">
          <div className="flex flex-col gap-[16px]">
            <label className="flex items-center gap-[8px] text-[14px] font-semibold leading-[1.4] text-[#171719]">
              <input
                type="checkbox"
                checked={agreements.order}
                onChange={(e) => handleOrderAgreementChange(e.target.checked)}
                className="sr-only"
              />
              <span
                className={`flex h-[12px] w-[12px] items-center justify-center rounded-[2px] border ${
                  agreements.order ? "border-[#0f0f10] bg-[#0f0f10]" : "border-[#dbdcdf] bg-white"
                }`}
                aria-hidden="true"
              >
                {agreements.order && <Check className="h-[10px] w-[10px] text-white" />}
              </span>
              주문 내용 확인 및 결제 동의
            </label>
            <div className="h-px w-full bg-[#f4f4f5]" />
            <div className="flex flex-col gap-[10px] text-[14px] leading-[1.5] text-[#70737c]">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-[8px]">
                  <input
                    type="checkbox"
                    checked={agreements.privacy}
                    onChange={(e) =>
                      handleRequiredAgreementChange('privacy', e.target.checked)
                    }
                    className="sr-only"
                  />
                  <span
                    className={`flex h-[12px] w-[12px] items-center justify-center rounded-[2px] border ${
                      agreements.privacy
                        ? "border-[#0f0f10] bg-[#0f0f10]"
                        : "border-[#dbdcdf] bg-white"
                    }`}
                    aria-hidden="true"
                  >
                    {agreements.privacy && <Check className="h-[10px] w-[10px] text-white" />}
                  </span>
                  개인정보 수집 및 이용 동의<span className="text-[#008bff]">(필수)</span>
                </label>
                <button className="border-b border-[#70737c] text-[#70737c]">자세히</button>
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-[8px]">
                  <input
                    type="checkbox"
                    checked={agreements.thirdParty}
                    onChange={(e) =>
                      handleRequiredAgreementChange('thirdParty', e.target.checked)
                    }
                    className="sr-only"
                  />
                  <span
                    className={`flex h-[12px] w-[12px] items-center justify-center rounded-[2px] border ${
                      agreements.thirdParty
                        ? "border-[#0f0f10] bg-[#0f0f10]"
                        : "border-[#dbdcdf] bg-white"
                    }`}
                    aria-hidden="true"
                  >
                    {agreements.thirdParty && <Check className="h-[10px] w-[10px] text-white" />}
                  </span>
                  개인정보 제3자 정보 제공 동의<span className="text-[#008bff]">(필수)</span>
                </label>
                <button className="border-b border-[#70737c] text-[#70737c]">자세히</button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="app-footer border-t border-[#f4f4f5] px-4 py-[16px]">
        <button
          onClick={() =>
            navigate('/payment/complete', {
              state: {
                from: `${location.pathname}${location.search}`,
                step: state?.step,
                flowFrom: state?.from,
                paymentAmount: totalPrice,
                consultType,
                consultLabel,
                expertName,
                categoryLabel,
                scheduleLabel,
              },
            })
          }
          disabled={!canPay || isApplyingPoints}
          className={`w-full rounded-[4px] border py-[12px] text-center text-[16px] font-semibold leading-[1.4] ${
            canPay && !isApplyingPoints
              ? 'border-[#dadada] bg-[#0f0f10] text-white'
              : 'border-[#e1e2e4] bg-[#f4f4f5] text-[#aeb0b6]'
          }`}
        >
          {formatCurrency(totalPrice)} 결제하기
        </button>
      </footer>
    </div>
  );
}
