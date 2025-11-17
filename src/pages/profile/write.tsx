import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import backIcon from '../../images/login/back.svg';

interface ProfileData {
  id: number;
  name: string;
  imageUrl: string;
  category: string;
  subCategory: string;
}

// 임시 데이터
const mockProfile: ProfileData = {
  id: 1,
  name: '박서준',
  imageUrl: '/placeholder-profile.jpg',
  category: '미용',
  subCategory: '헤어',
};

export function ProfileWritePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [profile] = useState<ProfileData>(mockProfile);
  const [content, setContent] = useState('');

  const handleSubmit = () => {
    console.log('후기 제출:', { profileId: id, content });
    // TODO: API 호출
    navigate(-1);
  };

  const canSubmit = content.trim().length > 0;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <button onClick={() => navigate(-1)}>
          <img src={backIcon} alt="back" className="w-2.5 h-[18px]" />
        </button>
        <h1 className="flex-1 text-center text-lg font-semibold -ml-6">
          나의 후기
        </h1>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Notice Banner */}
        <div className="bg-yellow-50 p-6">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16">
              <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
                <path
                  d="M32 8L42 28H22L32 8Z"
                  fill="#FFD700"
                  stroke="#FFA500"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>
          <p className="text-center text-sm font-medium">
            후기 시 PT가 주어집니다
          </p>
          <p className="text-center text-xs text-gray-600 mt-2">
            후기 1건일 때 500P
          </p>
        </div>

        {/* Profile Section */}
        <div className="px-6 py-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden">
              <img
                src={profile.imageUrl}
                alt={profile.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '';
                  e.currentTarget.style.backgroundColor = '#E5E7EB';
                }}
              />
            </div>
            <div>
              <div className="font-semibold text-lg">{profile.name}</div>
              <div className="text-sm text-gray-500">
                {profile.category} · {profile.subCategory}
              </div>
            </div>
          </div>

          {/* Description Text */}
          <p className="text-sm text-gray-700 leading-relaxed mb-6">
            아이라히머터 이브랴터 코타프라, 미오라다 히게르워아 아비히 가 거 가다뉴다, 우바뇌타 나요 드코도 다
            갓다 라 카리 바 키더잠터 거닷부리 고오더 가버랴 여너 그코리터미바 차디바...
          </p>

          {/* Tags */}
          <div className="flex gap-2 mb-6">
            <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
              고덥 니취임
            </span>
            <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
              생화적 매귀힘
            </span>
          </div>

          {/* Review Input Section */}
          <div className="border-t border-gray-200 pt-6">
            <div className="text-sm font-medium mb-4">
              받고 싶은 500P*
              <span className="text-gray-400 ml-2">글자 수 {content.length} / 1,000</span>
            </div>
            <textarea
              value={content}
              onChange={(e) => {
                if (e.target.value.length <= 1000) {
                  setContent(e.target.value);
                }
              }}
              placeholder="후리 반야덧 가브나 머릅 차륵 카타이어거니! 유딩 카르터 거라킵 고명 대딥 까니 드뎁 다 거 러 그타되 디더카 커나뮤어더니! 기브 머릴 가버차 카토오 리고 라더 대디 가브치 배마빠 기브 바터 수뎌 커더..."
              className="w-full h-40 p-4 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-black text-sm"
            />
          </div>

          {/* Bottom Info Text */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-600 leading-relaxed">
              우터 후터 가뮤나 자릭 그더 커러이어거니! 유딩 가리 카라 거라킵 교머 메딥 까니 드뎁 더 거 르 그타뎌
              다다가 커나뮤어더니 카바 머릭 가뫄나 가더 그뫄 더미너 하는데 레뮤 호아
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={`w-full h-12 rounded-lg font-medium transition-colors ${
            canSubmit
              ? 'bg-black text-white hover:bg-gray-800'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          작성 완료
        </button>
      </div>
    </div>
  );
}
