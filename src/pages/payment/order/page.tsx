import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import backIcon from '../../../images/login/back.svg';

const StepArrow = () => (
  <svg
    aria-hidden="true"
    className="h-[18px] w-[18px] rotate-180"
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
  const backTarget = (location.state as { from?: string } | null)?.from;
  const [agreements, setAgreements] = useState({
    order: false,
    privacy: false,
    thirdParty: false,
  });
  const canPay = agreements.order && agreements.privacy && agreements.thirdParty;
  const orderPrice = 24000;
  const feePrice = 0;
  const couponDiscount = 0;
  const pointUsed = 0;
  const totalPrice = orderPrice + feePrice - couponDiscount - pointUsed;
  const availablePoints = 0;
  const totalPoints = 0;
  const formatCurrency = (value: number) => `${value.toLocaleString('ko-KR')}원`;
  const formatPoint = (value: number) => `${value.toLocaleString('ko-KR')}P`;

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
    if (backTarget) {
      navigate(backTarget);
      return;
    }
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-white text-[#0f0f10]">
      <header className="flex items-center gap-[15px] px-4 pt-[53px]">
        <button onClick={handleBack} className="h-6 w-6">
          <img src={backIcon} alt="뒤로가기" className="h-6 w-6" />
        </button>
        <h1 className="text-[20px] font-semibold leading-[1.4]">주문하기</h1>
      </header>

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
            <span className="font-semibold text-[#171719]">전문가 이름</span>
            <span className="text-[#aeb0b6]">헤어</span>
          </div>
          <div className="mt-[10px] rounded-[4px] border border-[#e1e2e4] bg-[#fafafa] px-[16px] py-[12px]">
            <div className="flex items-start justify-between text-[14px] font-semibold leading-[1.4] text-[#171719]">
              <span className="flex-1">실시간 화상 상담</span>
              <span>{formatCurrency(orderPrice)}</span>
            </div>
            <p className="mt-[6px] text-[13px] leading-[1.4] text-[#656870]">
              2025년 10월 28일 오전 11:30
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
          <div className="flex w-full items-center gap-[16px]">
            <span className="text-[14px] leading-[1.4] text-[#878a93]">포인트</span>
            <div className="flex flex-1 items-center gap-[8px]">
              <div className="flex flex-1 items-center justify-end rounded-[4px] border border-[#e1e2e4] px-[16px] py-[10px] text-[14px] font-semibold leading-[1.4]">
                {formatPoint(pointUsed)}
              </div>
              <button className="h-[40px] rounded-[4px] border border-[#dbdcdf] px-[16px] text-[14px] leading-[1.4] text-[#171719]">
                전액사용
              </button>
            </div>
          </div>
          <div className="flex items-center gap-[8px] text-[14px] leading-[1.4]">
            <span className="font-semibold text-[#0f0f10]">
              사용 가능 {formatPoint(availablePoints)}
            </span>
            <span className="text-[#878a93]">/</span>
            <span className="text-[#878a93]">보유 {formatPoint(totalPoints)}</span>
          </div>
        </div>
      </div>

      <div className="mt-[24px] h-[8px] w-full bg-[#f4f4f5]" />

      <div className="px-4 pt-[28px] opacity-30">
        <p className="text-[16px] font-semibold leading-[1.4] text-[#0f0f10]">결제 방법</p>
        <div className="mt-[13px] w-[247px] rounded-[4px] border border-[#e1e2e4] px-[20px] py-[16px]">
          <p className="text-[14px] leading-[1.4] text-[#878a93]">입금 계좌 번호</p>
          <p className="mt-[4px] text-[14px] font-semibold leading-[1.4] text-[#0f0f10]">
            {formatCurrency(totalPrice)}
          </p>
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
            <div className="flex items-center justify-between">
              <span className="text-[#505158]">쿠폰 할인</span>
              <span className="font-semibold text-[#0f0f10]">
                {formatCurrency(couponDiscount)}
              </span>
            </div>
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

      <div className="px-4 pt-[28px]">
        <div className="flex flex-col gap-[16px]">
          <label className="flex items-center gap-[8px] text-[14px] font-semibold leading-[1.4] text-[#171719]">
            <input
              type="checkbox"
              checked={agreements.order}
              onChange={(e) => handleOrderAgreementChange(e.target.checked)}
              className="h-[14px] w-[14px] rounded border-[#c2c4c8]"
            />
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
                  className="h-[14px] w-[14px] rounded border-[#c2c4c8]"
                />
                개인정보 수집 및 이용 동의<span className="text-[#429ff0]">(필수)</span>
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
                  className="h-[14px] w-[14px] rounded border-[#c2c4c8]"
                />
                개인정보 제3자 정보 제공 동의<span className="text-[#429ff0]">(필수)</span>
              </label>
              <button className="border-b border-[#70737c] text-[#70737c]">자세히</button>
            </div>
          </div>
        </div>
      </div>

      <div className="pb-[28px] pt-[24px]">
        <button
          onClick={() =>
            navigate('/payment/complete', {
              state: { from: `${location.pathname}${location.search}` },
            })
          }
          disabled={!canPay}
          className={`mx-auto block w-[342px] rounded-[4px] border py-[12px] text-center text-[16px] font-semibold leading-[1.4] ${
            canPay
              ? 'border-[#dadada] bg-[#0f0f10] text-white'
              : 'border-[#e1e2e4] bg-[#f4f4f5] text-[#aeb0b6]'
          }`}
        >
          {formatCurrency(totalPrice)} 결제하기
        </button>
      </div>
    </div>
  );
}
