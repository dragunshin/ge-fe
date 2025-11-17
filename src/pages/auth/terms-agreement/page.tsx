import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backIcon from '../../../images/login/back.svg';

export function TermsAgreementPage() {
  const navigate = useNavigate();
  const [agreements, setAgreements] = useState({
    all: false,
    age: false,
    service: false,
    privacy: false,
    marketing: false,
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
    newAgreements.all = newAgreements.age && newAgreements.service && newAgreements.privacy && newAgreements.marketing;
    setAgreements(newAgreements);
  };

  const handleSubmit = () => {
    console.log('약관 동의:', agreements);
    // TODO: 다음 페이지로 이동
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="flex items-center px-4 py-4">
        <button onClick={() => navigate(-1)}>
          <img src={backIcon} alt="back" className="w-2.5 h-[18px]" />
        </button>
        <h1 className="text-[20px] font-bold ml-3">약관 동의</h1>
      </header>

      {/* Content */}
      <div className="flex-1 px-4 pt-8">
        <h2 className="text-[16px] font-bold mb-8">약관 동의</h2>

        {/* All Agreement */}
        <div className="mb-6 border-b pb-4 text-[#F4F4F5]">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreements.all}
              onChange={(e) => handleAllCheck(e.target.checked)}
              className="w-5 h-5 rounded border-gray-300"
            />
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-black">
                전체 동의 <span className="text-sm px-2 text-gray-600 font-normal">선택 항목에 대한 동의 포함</span>
              </span>
            </div>
          </label>
        </div>

        {/* Individual Agreements */}
        <div className="space-y-4">
          {/* Age Agreement */}
          <label className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={agreements.age}
                onChange={(e) => handleIndividualCheck('age', e.target.checked)}
                className="w-5 h-5 rounded border-gray-300"
              />
              <span className="text-sm text-gray-600 whitespace-nowrap">
                만 14세 이상입니다.<button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    // TODO: 필수 내용 표시
                  }}
                  className="text-blue-500 ml-1"
                >(필수)</button>
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                // TODO: 자세히 보기
              }}
              className="text-sm text-gray-500 underline whitespace-nowrap ml-2"
            >
              자세히
            </button>
          </label>

          {/* Service Agreement */}
          <label className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={agreements.service}
                onChange={(e) => handleIndividualCheck('service', e.target.checked)}
                className="w-5 h-5 rounded border-gray-300"
              />
              <span className="text-sm text-gray-600 whitespace-nowrap">
                서비스 이용약관 동의<button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/auth/terms-of-service');
                  }}
                  className="text-blue-500 ml-1"
                >(필수)</button>
              </span>
            </div>
            <button
              type="button"
              onClick={() => navigate('/auth/terms-of-service')}
              className="text-sm text-gray-500 underline whitespace-nowrap ml-2"
            >
              자세히
            </button>
          </label>

          {/* Privacy Agreement */}
          <label className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={agreements.privacy}
                onChange={(e) => handleIndividualCheck('privacy', e.target.checked)}
                className="w-5 h-5 rounded border-gray-300"
              />
              <span className="text-sm text-gray-600 whitespace-nowrap">
                개인정보 수집 및 이용 동의<button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/auth/privacy-policy');
                  }}
                  className="text-blue-500 ml-1"
                >(필수)</button>
              </span>
            </div>
            <button
              type="button"
              onClick={() => navigate('/auth/privacy-policy')}
              className="text-sm text-gray-500 underline whitespace-nowrap ml-2"
            >
              자세히
            </button>
          </label>

          {/* Marketing Agreement */}
          <label className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={agreements.marketing}
                onChange={(e) => handleIndividualCheck('marketing', e.target.checked)}
                className="w-5 h-5 rounded border-gray-300"
              />
              <span className="text-sm text-gray-600">
                마케팅 목적의 개인정보 수집 및 이용 동의<span className="text-gray-500">(선택)</span>
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                // TODO: 자세히 보기
              }}
              className="text-sm text-gray-500 underline whitespace-nowrap ml-2"
            >
              자세히
            </button>
          </label>
        </div>
      </div>

      {/* Submit Button - 하단 고정 */}
      <div className="mt-auto">
        <button
          onClick={handleSubmit}
          className="w-full h-14 font-medium transition-colors bg-black text-white"
        >
          다음
        </button>
      </div>
    </div>
  );
}
