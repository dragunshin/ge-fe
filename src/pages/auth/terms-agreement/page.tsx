import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backIcon from '../../../images/login/back.svg';

const STORAGE_KEY = 'signup_terms_agreements_v1';

export function TermsAgreementPage() {
  const navigate = useNavigate();
  const [agreements, setAgreements] = useState(() => {
    const defaultAgreements = {
      all: false,
      age: false,
      service: false,
      privacy: false,
      marketing: false,
    };
    if (typeof window === 'undefined') {
      return defaultAgreements;
    }
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return defaultAgreements;
    }
    try {
      const parsed = JSON.parse(stored) as Partial<typeof defaultAgreements>;
      return {
        ...defaultAgreements,
        ...parsed,
      };
    } catch {
      sessionStorage.removeItem(STORAGE_KEY);
      return defaultAgreements;
    }
  });

  const handleAllCheck = (checked: boolean) => {
    setAgreements({
      all: checked,
      age: checked,
      service: checked,
      privacy: checked,
      marketing: checked,
    });
  };

  const handleIndividualCheck = (key: keyof typeof agreements, checked: boolean) => {
    const newAgreements = { ...agreements, [key]: checked };
    newAgreements.all =
      newAgreements.age &&
      newAgreements.service &&
      newAgreements.privacy &&
      newAgreements.marketing;
    setAgreements(newAgreements);
  };

  const handleSubmit = () => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(agreements));
    navigate('/auth/signup');
  };

  const isAllChecked =
    agreements.age &&
    agreements.service &&
    agreements.privacy &&
    agreements.marketing;
  const isRequiredChecked =
    agreements.age &&
    agreements.service &&
    agreements.privacy;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="app-header flex items-center gap-[15px] px-4 py-4">
        <button onClick={() => navigate(-1)}>
          <img src={backIcon} alt="back" className="w-2.5 h-[18px]" />
        </button>
        <h1 className="text-[20px] font-semibold text-black">약관 동의</h1>
      </header>

      {/* Content */}
      <div className="flex-1 px-4 pt-6">
        <h2 className="text-[16px] font-semibold text-black mb-6">약관 동의</h2>

        {/* All Agreement */}
        <div className="border-b border-[#f4f4f5] pb-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isAllChecked}
              onChange={(e) => handleAllCheck(e.target.checked)}
              className="h-[14px] w-[14px] rounded border-[#c2c4c8]"
            />
            <div className="flex items-center gap-2 text-[14px]">
              <span className="font-semibold text-[#171719]">전체 동의</span>
              <span className="font-normal text-[#70737c]">선택 항목에 대한 동의 포함</span>
            </div>
          </label>
        </div>

        {/* Individual Agreements */}
        <div className="space-y-4 pt-4">
          {/* Age Agreement */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreements.age}
                onChange={(e) => handleIndividualCheck('age', e.target.checked)}
                className="h-[14px] w-[14px] rounded border-[#c2c4c8]"
              />
              <span className="text-[14px] leading-[1.5] text-[#70737c]">
                만 14세 이상입니다.<span className="text-[#429ff0]">(필수)</span>
              </span>
            </label>
            <button
              type="button"
              className="inline-flex text-[14px] leading-[1.5] text-[#70737c] border-b border-[#70737c] pb-[3px]"
            >
              자세히
            </button>
          </div>

          {/* Service Agreement */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreements.service}
                onChange={(e) => handleIndividualCheck('service', e.target.checked)}
                className="h-[14px] w-[14px] rounded border-[#c2c4c8]"
              />
              <span className="text-[14px] leading-[1.5] text-[#70737c]">
                서비스 이용약관 동의<span className="text-[#429ff0]">(필수)</span>
              </span>
            </label>
            <button
              type="button"
              onClick={() => navigate('/auth/terms-of-service')}
              className="inline-flex text-[14px] leading-[1.5] text-[#70737c] border-b border-[#70737c] pb-[3px]"
            >
              자세히
            </button>
          </div>

          {/* Privacy Agreement */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreements.privacy}
                onChange={(e) => handleIndividualCheck('privacy', e.target.checked)}
                className="h-[14px] w-[14px] rounded border-[#c2c4c8]"
              />
              <span className="text-[14px] leading-[1.5] text-[#70737c]">
                개인정보 수집 및 이용 동의<span className="text-[#429ff0]">(필수)</span>
              </span>
            </label>
            <button
              type="button"
              onClick={() => navigate('/auth/privacy-policy')}
              className="inline-flex text-[14px] leading-[1.5] text-[#70737c] border-b border-[#70737c] pb-[3px]"
            >
              자세히
            </button>
          </div>

          {/* Marketing Agreement */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreements.marketing}
                onChange={(e) => handleIndividualCheck('marketing', e.target.checked)}
                className="h-[14px] w-[14px] rounded border-[#c2c4c8]"
              />
              <span className="text-[14px] leading-[1.5] text-[#70737c]">
                마케팅 목적의 개인정보 수집 및 이용 동의<span className="text-[#70737c]">(선택)</span>
              </span>
            </label>
            <button
              type="button"
              className="inline-flex text-[14px] leading-[1.5] text-[#70737c] border-b border-[#70737c] pb-[3px]"
            >
              자세히
            </button>
          </div>
        </div>
      </div>

      {/* Submit Button - 하단 고정 */}
      <div className="mt-auto">
        <button
          onClick={handleSubmit}
          disabled={!isRequiredChecked}
          className={`w-full h-[90px] text-[16px] font-semibold text-white transition-colors ${
            isRequiredChecked ? 'bg-[#0f0f10]' : 'bg-[#aeb0b6]'
          }`}
        >
          다음
        </button>
      </div>
    </div>
  );
}
