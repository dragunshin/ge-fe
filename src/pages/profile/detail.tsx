import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import backIcon from '../../images/login/back.svg';

interface ProfileDetail {
  id: number;
  imageUrl: string;
  name: string;
  category: string;
  subCategory: string;
  description: string;
  tags: string[];
  createdAt: string;
}

// 임시 데이터
const mockProfileDetail: ProfileDetail = {
  id: 1,
  imageUrl: '/placeholder-profile.jpg',
  name: '고수 님이라',
  category: '미용',
  subCategory: '헤어',
  description:
    '아이라히머터 이브랴터 코타프라, 미오라다 히게르워아 아비히 가 거 가다뉴다, 우바뇌타 나요 드코도 다 갓다 라 카리 바 키더잠터...',
  tags: ['고객 니취임', '생활적 배규핌'],
  createdAt: '2025.3.09',
};

const mockReviews = [
  {
    id: 1,
    author: '박서준',
    rating: 0,
    comment:
      '추리 반야덧 가브나 머릅 차륵 카타이거니! 유딩 카르터 거라킵 고명 대딥 까니',
    createdAt: '2025.3.09',
    imageUrl: '/placeholder-profile.jpg',
  },
  {
    id: 2,
    author: '박서준',
    rating: 0,
    comment: '',
    createdAt: '2025.3.09',
    imageUrl: '/placeholder-profile.jpg',
  },
];

export function ProfileDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [profile] = useState<ProfileDetail>(mockProfileDetail);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="flex items-center px-6 py-4 border-b border-gray-100">
        <button onClick={() => navigate(-1)}>
          <img src={backIcon} alt="back" className="w-2.5 h-[18px]" />
        </button>
        <h1 className="flex-1 text-center text-lg font-semibold -ml-6">
          나의 후기
        </h1>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Profile Header */}
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
            작성 중인일 후기가 있어요!
          </p>
          <p className="text-center text-xs text-gray-600 mt-2">
            고수 님이가
          </p>
        </div>

        {/* Profile Images */}
        <div className="flex gap-2 px-6 py-4">
          <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden">
            <img
              src={profile.imageUrl}
              alt="profile"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = '';
                e.currentTarget.style.backgroundColor = '#E5E7EB';
              }}
            />
          </div>
          <div className="w-24 h-24 bg-gray-200 rounded-lg"></div>
        </div>

        {/* Category */}
        <div className="px-6 py-3">
          <div className="text-sm font-semibold mb-1">
            {profile.category} · {profile.subCategory}
          </div>
          <div className="text-xs text-gray-500">
            {profile.tags.join(' · ')}
          </div>
        </div>

        {/* Description */}
        <div className="px-6 py-4 border-t border-gray-100">
          <div className="text-sm font-medium mb-2">고객 니취임</div>
          <p className="text-sm text-gray-700 leading-relaxed">
            {profile.description}
          </p>
        </div>

        {/* Another Section */}
        <div className="px-6 py-4 border-t border-gray-100">
          <div className="text-sm font-medium mb-2">고객 디채임</div>
          <p className="text-sm text-gray-700 leading-relaxed">
            고바무더로 거바뮤티터다 자무더로 지르더 고타 규야터터 타오너 보지드 귀다무더 고너로라라리더...
          </p>
        </div>

        {/* Reviews Section */}
        <div className="px-6 py-4 border-t border-gray-100">
          <div className="text-sm font-semibold mb-4">
            작성 가능 후기가 2개가 있어요
          </div>
          <div className="space-y-4">
            {mockReviews.map((review, index) => (
              <div
                key={review.id}
                onClick={() => navigate(`/profile/write/${review.id}`)}
                className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                      <img
                        src={review.imageUrl}
                        alt={review.author}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '';
                          e.currentTarget.style.backgroundColor = '#E5E7EB';
                        }}
                      />
                    </div>
                    <div>
                      <div className="text-sm font-medium">{review.author}</div>
                      <div className="text-xs text-gray-500">
                        {review.createdAt}
                      </div>
                    </div>
                  </div>
                  <button className="px-3 py-1 text-xs border border-gray-300 rounded-full hover:bg-gray-50">
                    후기 작성
                  </button>
                </div>
                {review.comment && (
                  <p className="text-sm text-gray-700 mt-2">{review.comment}</p>
                )}
                {index === 1 && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="text-xs text-gray-500 mb-2">
                      받고 싶은 500P
                    </div>
                    <div className="text-xs text-gray-600">
                      우터 후터 가뮤나 자릭 그더 커러이어거니! 유딩 가리 카라 거라킵 교머 메딥 까니
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Action Button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => navigate(`/profile/write/${id}`)}
          className="w-full h-12 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
        >
          후기 작성
        </button>
      </div>
    </div>
  );
}
