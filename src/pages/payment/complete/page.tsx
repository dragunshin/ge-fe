import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

const OrderChevron = ({ expanded }: { expanded: boolean }) => (
  <svg
    aria-hidden="true"
    className={`h-[24px] w-[24px] ${expanded ? 'rotate-270' : 'rotate-90'}`}
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M9 6L15 12L9 18"
      stroke="#70737C"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export function PaymentCompletePage() {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="min-h-screen bg-white text-[#0f0f10]">
      <header className="flex items-center gap-[15px] px-4 pt-[53px]">
        <button onClick={() => navigate('/')} className="h-6 w-6">
          <img src={backIcon} alt="뒤로가기" className="h-6 w-6" />
        </button>
        <h1 className="text-[20px] font-semibold leading-[1.4]">주문하기</h1>
      </header>

      <div className="mt-[24px] flex flex-col items-center gap-[16px]">
        <div className="flex items-center gap-[13px]">
          <div className="flex items-center gap-[8px]">
            <div className="flex h-[18px] w-[18px] items-center justify-center rounded-[9.6px] bg-[#e1e2e4]">
              <span className="text-[12px] font-medium leading-[1.4] text-[#656870]">1</span>
            </div>
            <span className="text-[14px] font-medium leading-[1.4] text-[#989ba2]">
              주문 확인 및 결제
            </span>
          </div>
          <StepArrow />
          <div className="flex items-center gap-[8px]">
            <div className="flex h-[18px] w-[18px] items-center justify-center rounded-[9.6px] bg-[#008bff]">
              <span className="text-[12px] font-medium leading-[1.4] text-white">2</span>
            </div>
            <span className="text-[14px] font-semibold leading-[1.4] text-[#0f0f10]">
              주문 완료
            </span>
          </div>
        </div>
        <div className="h-[8px] w-full bg-[#f4f4f5]" />
      </div>

      <div className="px-4 pt-[32px] text-center">
        <p className="text-[20px] font-semibold leading-[1.4] text-[#008bff]">
          상담 주문이 완료되었어요.
        </p>
        <p className="mx-auto mt-[8px] w-[260px] text-[13px] leading-[1.4] text-[#989ba2]">
          상담 확정을 위해{' '}
          <span className="font-semibold text-[#171719]">2025년 12월 13일 23:59</span>
          까지 입금을 완료해주세요.
        </p>
      </div>

      <div className="px-4 pt-[50px]">
        <div className="flex items-center gap-[28px] text-[16px] font-semibold leading-[1.4]">
          <span>결제 금액</span>
          <span>00,000원</span>
        </div>
        <div className="mt-[18px] h-px w-full bg-[#e1e2e4]" />
        <div className="mt-[16px] flex items-center gap-[28px] text-[16px] leading-[1.4]">
          <span className="font-semibold">입금 계좌</span>
          <div className="flex items-center gap-[6px] text-[#70737c]">
            <span>우리</span>
            <span className="border-b border-[#70737c] pb-[2px]">
              0000-0000-0000-0000
            </span>
          </div>
        </div>
        <div className="mt-[18px] h-px w-full bg-[#e1e2e4]" />
        <div className="mt-[16px] flex items-center gap-[28px] text-[16px] leading-[1.4]">
          <span className="font-semibold">상담 일자</span>
          <span className="text-[#70737c]">2025년 12월 14일 00시 00분</span>
        </div>
        <div className="mt-[18px] h-px w-full bg-[#e1e2e4]" />
      </div>

      <div className="px-4 pt-[16px]">
        <button
          onClick={() => setIsExpanded((prev) => !prev)}
          className="flex w-full items-center"
        >
          <div className="flex w-[315px] items-center gap-[28px]">
            <span className="text-[16px] font-semibold leading-[1.4]">주문 정보</span>
            <span
              className={`w-[225px] overflow-hidden text-ellipsis whitespace-nowrap text-[16px] leading-[1.4] text-[#70737c] ${
                isExpanded ? 'pointer-events-none opacity-0' : ''
              }`}
            >
              메세지 상담 | 성정수 상담사 (헤어 전문)
            </span>
          </div>
          <OrderChevron expanded={isExpanded} />
        </button>

        {isExpanded && (
          <div className="mt-[16px] flex flex-col gap-[12px] text-[14px] leading-[1.4]">
            <div className="flex items-center justify-between">
              <span className="text-[#505158]">상담 종류</span>
              <span className="font-semibold text-[#0f0f10]">메세지 상담</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#505158]">상담사명/카테고리</span>
              <span className="font-semibold text-[#0f0f10]">성정수 상담사 | 헤어</span>
            </div>
          </div>
        )}
      </div>

      <div className="px-4 pt-[24px]">
        <div className="flex gap-[12px]">
          <button
            onClick={() => navigate('/chat')}
            className="flex h-[44px] flex-1 items-center justify-center rounded-[4px] border border-[#dbdcdf] text-[14px] leading-[1.4] text-[#171719]"
          >
            채팅으로 이동
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex h-[44px] flex-1 items-center justify-center rounded-[4px] bg-[#181818] text-[14px] font-medium leading-[1.4] text-white"
          >
            홈으로
          </button>
        </div>
      </div>

      <div className="mt-[28px] h-[8px] w-full bg-[#f4f4f5]" />

      <div className="px-4 pb-[40px] pt-[40px]">
        <p className="text-[18px] font-semibold leading-[1.4]">인기 많은 상담사 추천</p>
      </div>
    </div>
  );
}
