import { useNavigate } from 'react-router-dom';
import backIcon from '../../../images/login/back.svg';

export function TermsOfServicePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="flex items-center px-6 py-4">
        <button onClick={() => navigate(-1)} className="mr-3">
          <img src={backIcon} alt="back" className="w-2.5 h-[18px]" />
        </button>
        <h1 className="text-xl font-semibold">서비스 이용약관</h1>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-none space-y-6">
          <section>
            <h2 className="text-black font-semibold text-base leading-[140%] mb-3">
              제1조 (목적)
            </h2>
            <p className="text-[#70737C] text-sm font-normal leading-[150%]">
              본 약관은 Menual(이하 "회사")이 제공하는 남성 맞춤형 1:1 뷰티 컨설팅 플랫폼(이하 "서비스")의 이용과 관련하여 회사와 회원 간의 권리, 의무, 책임사항 및 기타 필요한 사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section>
            <h2 className="text-black font-semibold text-base leading-[140%] mb-3">
              제2조 (정의)
            </h2>
            <div className="text-[#70737C] text-sm font-normal leading-[150%] space-y-2">
              <p>"서비스"란 이용자가 헤어, 패션, 스킨케어, 메이크업 등 분야의 전문가와 1:1 맞춤형 컨설팅을 진행할 수 있도록 회사가 제공하는 모든 플랫폼 기능을 의미합니다.</p>
              <p>"회원"이란 본 약관에 따라 서비스에 가입하고 회사가 제공하는 서비스를 이용하는 자를 말합니다.</p>
              <p>"전문가"란 회사와 별도의 계약을 체결하고 서비스를 통해 컨설팅을 제공하는 자를 말합니다.</p>
              <p>"이용자"란 회원 또는 비회원으로서 서비스를 이용하는 모든 사람을 의미합니다.</p>
              <p>"중개자"란 Menual이 전문가와 이용자 간의 연결을 제공하되, 개별 상담의 내용이나 결과에 대해 법적 책임을 지지 않는 역할을 의미합니다.</p>
            </div>
          </section>

          <section>
            <h2 className="text-black font-semibold text-base leading-[140%] mb-3">
              제3조 (약관의 효력 및 변경)
            </h2>
            <div className="text-[#70737C] text-sm font-normal leading-[150%] space-y-2">
              <p>본 약관은 서비스를 이용하고자 하는 모든 회원에게 적용됩니다.</p>
              <p>회사는 관련 법령을 위반하지 않는 범위에서 본 약관을 개정할 수 있습니다.</p>
              <p>약관이 변경되는 경우 회사는 공지사항을 통해 사전 공지하며, 이용자가 개정된 약관에 동의하지 않을 경우 회원 탈퇴를 통해 이용계약을 해지할 수 있습니다.</p>
            </div>
          </section>

          <section>
            <h2 className="text-black font-semibold text-base leading-[140%] mb-3">
              제4조 (이용계약의 체결)
            </h2>
            <div className="text-[#70737C] text-sm font-normal leading-[150%] space-y-2">
              <p>회원가입은 이용자가 본 약관에 동의하고 필요한 정보를 입력한 후 회사가 이를 승인함으로써 성립됩니다.</p>
              <p>회원가입 시 수집되는 정보는 이메일, 닉네임, 비밀번호, 생년월일, 관심분야, 프로필사진 등입니다.</p>
              <p>회사는 자체 회원가입 및 카카오, 구글 계정을 통한 소셜 로그인 기능을 제공합니다.</p>
            </div>
          </section>

          <section>
            <h2 className="text-black font-semibold text-base leading-[140%] mb-3">
              제5조 (서비스의 성격 및 역할 한계)
            </h2>
            <div className="text-[#70737C] text-sm font-normal leading-[150%] space-y-2">
              <p>회사는 전문가와 이용자 간의 상담을 중개하는 플랫폼 제공자이며, 개별 컨설팅의 품질, 정확성, 효과 등에 대한 법적 책임을 지지 않습니다.</p>
              <p>다만 회사는 서비스가 원활히 이루어지도록 플랫폼 안정성과 정보보호를 위해 최선을 다합니다.</p>
            </div>
          </section>

          <section>
            <h2 className="text-black font-semibold text-base leading-[140%] mb-3">
              제6조 (결제 및 환불 정책)
            </h2>
            <div className="text-[#70737C] text-sm font-normal leading-[150%] space-y-2">
              <p>본 서비스의 결제는 PG 결제 대신 직접 계좌이체 방식으로 진행됩니다.</p>
              <p>결제 후 전문가가 상담을 취소할 경우, 이용자에게 전액 환불됩니다.</p>
              <p>이용자 사정으로 취소 시,</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>예약 후 1시간 이내 취소 시: 전액 환불</li>
                <li>예약 후 1시간 경과 후 취소 시: 10,000원 차감 후 환불</li>
              </ul>
              <p>결제 및 환불 과정에서 발생하는 은행 수수료는 이용자 부담으로 합니다.</p>
              <p>회사는 결제 정보를 일정 기간 보존할 수 있으며, 관련 법령에 따라 5년간 보관됩니다.</p>
            </div>
          </section>

          <section>
            <h2 className="text-black font-semibold text-base leading-[140%] mb-3">
              제7조 (이용자의 의무)
            </h2>
            <div className="text-[#70737C] text-sm font-normal leading-[150%] space-y-2">
              <p>회원은 본인의 계정 정보를 관리할 책임이 있습니다.</p>
              <p>타인의 정보 도용, 허위 정보 입력, 부정 결제 등 불법 행위를 해서는 안 됩니다.</p>
              <p>회원은 서비스 내 타 이용자 및 전문가를 존중하며, 욕설, 비방, 허위 리뷰 등을 금지합니다.</p>
            </div>
          </section>

          <section>
            <h2 className="text-black font-semibold text-base leading-[140%] mb-3">
              제8조 (회사의 의무)
            </h2>
            <div className="text-[#70737C] text-sm font-normal leading-[150%] space-y-2">
              <p>회사는 안정적 서비스 제공을 위해 최선을 다합니다.</p>
              <p>개인정보 보호와 관련된 사항은 개인정보 처리방침(수집 및 이용 동의서)에 따릅니다.</p>
              <p>회사는 불가피한 사유(서버 점검, 법령 변경 등)로 서비스의 전부 또는 일부를 중단할 수 있습니다.</p>
            </div>
          </section>

          <section>
            <h2 className="text-black font-semibold text-base leading-[140%] mb-3">
              제9조 (게시물의 관리 및 저작권)
            </h2>
            <div className="text-[#70737C] text-sm font-normal leading-[150%] space-y-2">
              <p>회원이 작성한 게시물(후기, 사진 등)의 저작권은 회원에게 귀속됩니다.</p>
              <p>회사는 서비스 운영, 홍보, 콘텐츠 개선 등의 목적으로 해당 게시물을 비상업적·비독점적 범위 내에서 사용할 수 있습니다.</p>
            </div>
          </section>

          <section>
            <h2 className="text-black font-semibold text-base leading-[140%] mb-3">
              제10조 (서비스 이용 제한 및 계약 해지)
            </h2>
            <div className="text-[#70737C] text-sm font-normal leading-[150%] space-y-2">
              <p>회사는 회원이 다음 각 호에 해당할 경우 사전 통보 없이 서비스 이용을 제한하거나 계약을 해지할 수 있습니다.</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>타인의 정보를 도용하거나 부정 사용한 경우</li>
                <li>서비스 운영을 고의로 방해한 경우</li>
                <li>기타 법령을 위반한 경우</li>
              </ul>
              <p>이용제한 및 해지 후에도 이용자의 불법행위에 대한 법적 책임은 소멸하지 않습니다.</p>
            </div>
          </section>

          <section>
            <h2 className="text-black font-semibold text-base leading-[140%] mb-3">
              제11조 (책임의 제한)
            </h2>
            <div className="text-[#70737C] text-sm font-normal leading-[150%] space-y-2">
              <p>회사는 다음 각 호의 사유로 발생한 손해에 대해 책임을 지지 않습니다.</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>천재지변, 서버 장애 등 불가항력적 사유</li>
                <li>회원 또는 전문가의 귀책사유로 인한 손해</li>
                <li>회사가 제공하지 않은 외부 서비스나 네트워크 장애로 인한 문제</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-black font-semibold text-base leading-[140%] mb-3">
              제12조 (분쟁 해결 및 관할법원)
            </h2>
            <div className="text-[#70737C] text-sm font-normal leading-[150%] space-y-2">
              <p>회사는 이용자의 불만사항을 신속히 처리하기 위해 최선을 다합니다.</p>
              <p>본 약관 및 서비스 이용과 관련하여 분쟁이 발생한 경우 서울중앙지방법원을 전속 관할법원으로 합니다.</p>
            </div>
          </section>

          <section>
            <h2 className="text-black font-semibold text-base leading-[140%] mb-3">
              제13조 (공지 및 고지의 방법)
            </h2>
            <div className="text-[#70737C] text-sm font-normal leading-[150%] space-y-2">
              <p>회사는 서비스 내 공지사항을 통해 본 약관 및 개인정보 관련 안내를 상시 게시합니다.</p>
            </div>
          </section>

          <section>
            <h2 className="text-black font-semibold text-base leading-[140%] mb-3">
              부칙
            </h2>
            <div className="text-[#70737C] text-sm font-normal leading-[150%] space-y-2">
              <p>본 약관은 2025년 ○월 ○일부터 시행합니다.</p>
              <p>본 약관에 명시되지 않은 사항은 관계 법령 및 상관례에 따릅니다.</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
