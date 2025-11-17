import { useNavigate } from 'react-router-dom';
import backIcon from '../../../images/login/back.svg';

export function PrivacyPolicyPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="flex items-center px-6 py-4">
        <button onClick={() => navigate(-1)} className="mr-3">
          <img src={backIcon} alt="back" className="w-2.5 h-[18px]" />
        </button>
        <h1 className="text-xl font-semibold">개인정보 동의서</h1>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-none space-y-6">
          <section>
            <h2 className="text-black font-semibold text-base leading-[140%] mb-3">
              1. 수집 항목
            </h2>
            <div className="text-[#70737C] text-sm font-normal leading-[150%]">
              <ul className="list-disc pl-5 space-y-1">
                <li>이메일, 닉네임, 비밀번호, 생년월일, 관심분야, 프로필사진</li>
                <li>(유료 결제 시) 결제자 이름, 계좌 정보, 거래 내역</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-black font-semibold text-base leading-[140%] mb-3">
              2. 수집 목적
            </h2>
            <div className="text-[#70737C] text-sm font-normal leading-[150%]">
              <ul className="list-disc pl-5 space-y-1">
                <li>회원 식별 및 서비스 이용 관리</li>
                <li>전문가 매칭 및 예약 서비스 제공</li>
                <li>결제 및 환불 처리</li>
                <li>맞춤형 컨설팅 추천 및 마케팅 푸시 발송</li>
                <li>서비스 품질 향상, 고객 문의 응대</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-black font-semibold text-base leading-[140%] mb-3">
              3. 보유 및 이용 기간
            </h2>
            <div className="text-[#70737C] text-sm font-normal leading-[150%]">
              <ul className="list-disc pl-5 space-y-1">
                <li>회원 탈퇴 시 즉시 파기</li>
                <li>단, 전자상거래법 등 관련 법령에 따라 거래기록은 5년간 보관</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-black font-semibold text-base leading-[140%] mb-3">
              4. 개인정보의 제3자 제공
            </h2>
            <div className="text-[#70737C] text-sm font-normal leading-[150%] space-y-2">
              <p>회사는 원칙적으로 회원의 개인정보를 외부에 제공하지 않습니다.</p>
              <p>다만, 다음의 경우 예외적으로 제공할 수 있습니다.</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>이용자가 사전에 동의한 경우</li>
                <li>법령에 따라 수사기관의 요구가 있는 경우</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-black font-semibold text-base leading-[140%] mb-3">
              5. 개인정보 처리 위탁
            </h2>
            <p className="text-[#70737C] text-sm font-normal leading-[150%]">
              회사는 서비스 운영을 위해 아래와 같이 개인정보 처리를 위탁할 수 있습니다.
            </p>
            <p className="text-[#70737C] text-sm font-normal leading-[150%] mt-2">
              수탁업체위탁업무 내용카카오, 구글소셜 로그인 인증AWS데이터 서버 운영 및 보관(미정)마케팅 메시지 발송 서비스
            </p>
          </section>

          <section>
            <h2 className="text-black font-semibold text-base leading-[140%] mb-3">
              6. 이용자의 권리
            </h2>
            <div className="text-[#70737C] text-sm font-normal leading-[150%] space-y-2">
              <p>회원은 언제든지 본인의 개인정보를 열람, 수정, 삭제 요청할 수 있으며,</p>
              <p>회원 탈퇴 시 즉시 모든 개인정보가 삭제됩니다(법령 보존 항목 제외).</p>
            </div>
          </section>

          <section>
            <h2 className="text-black font-semibold text-base leading-[140%] mb-3">
              7. 개인정보 보호 담당자
            </h2>
            <div className="text-[#70737C] text-sm font-normal leading-[150%]">
              <ul className="list-disc pl-5 space-y-1">
                <li>개인정보보호 담당자: Menual 개인정보 보호 담당자</li>
                <li>이메일: menual1001@gmail.com</li>
                <li>문의 시 7일 이내 답변을 제공합니다.</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-black font-semibold text-base leading-[140%] mb-3">
              8. 동의 거부 권리 및 불이익 안내
            </h2>
            <div className="text-[#70737C] text-sm font-normal leading-[150%] space-y-2">
              <p>이용자는 개인정보 수집 및 이용에 대한 동의를 거부할 수 있습니다.</p>
              <p>다만, 이 경우 서비스 이용(예약, 결제 등)이 제한될 수 있습니다.</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
