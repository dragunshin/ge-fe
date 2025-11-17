import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import backIcon from '../../images/login/back.svg';

interface ProfileData {
  id: number;
  name: string;
  imageUrl: string;
  service: string;
}

// 임시 데이터
const mockProfile: ProfileData = {
  id: 1,
  name: '고수 님',
  imageUrl: '/placeholder-profile.jpg',
  service: '미용 서비스',
};

export function ProfileEvaluationPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [profile] = useState<ProfileData>(mockProfile);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [photoConsent, setPhotoConsent] = useState(false);
  const [serviceQuality, setServiceQuality] = useState(false);

  const handleSubmit = () => {
    if (rating === 0) {
      alert('별점을 선택해주세요');
      return;
    }
    console.log('평가 제출:', {
      profileId: id,
      rating,
      photoConsent,
      serviceQuality,
    });
    // TODO: API 호출
    navigate('/profile/write/' + id);
  };

  const canSubmit = rating > 0;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="flex items-center px-6 py-4 border-b border-gray-100">
        <button onClick={() => navigate(-1)}>
          <img src={backIcon} alt="back" className="w-2.5 h-[18px]" />
        </button>
        <h1 className="flex-1 text-center text-lg font-semibold -ml-6">
          후기 작성
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
            후기 작성 시 포인트가 주어집니다
          </p>
          <p className="text-center text-xs text-gray-600 mt-2">
            사진과이 함께 남던 잉아주세요
          </p>
          <p className="text-center text-xs text-gray-600">
            올린모이어 만든지를 만들수있어요
          </p>
        </div>

        {/* Profile Section */}
        <div className="px-6 py-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 bg-gray-200 rounded-full overflow-hidden mb-4">
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
            <div className="text-lg font-semibold">{profile.name}</div>
          </div>

          {/* Star Rating Section */}
          <div className="mb-12">
            <div className="text-center text-sm font-medium mb-4">
              서비스가 만족 하셨나요?
            </div>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 48 48"
                    fill="none"
                    className="w-12 h-12"
                  >
                    <path
                      d="M24 4L29.09 18.26L44 20.27L33.45 29.97L36.18 44.73L24 37.27L11.82 44.73L14.55 29.97L4 20.27L18.91 18.26L24 4Z"
                      fill={
                        star <= (hoveredRating || rating)
                          ? '#FFD700'
                          : '#E5E7EB'
                      }
                      stroke={
                        star <= (hoveredRating || rating)
                          ? '#FFA500'
                          : '#D1D5DB'
                      }
                      strokeWidth="2"
                    />
                  </svg>
                </button>
              ))}
            </div>
            {rating > 0 && (
              <div className="text-center mt-4 text-gray-600">
                <span className="text-lg font-semibold">{rating}</span>점
              </div>
            )}
          </div>

          {/* Service Quality Section */}
          <div className="mb-8">
            <div className="text-sm font-medium mb-4">서비스는요1</div>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={photoConsent}
                    onChange={(e) => setPhotoConsent(e.target.checked)}
                    className="w-5 h-5 border-2 border-gray-300 rounded appearance-none checked:bg-black checked:border-black cursor-pointer"
                  />
                  {photoConsent && (
                    <svg
                      className="absolute top-0 left-0 w-5 h-5 text-white pointer-events-none"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
                <span className="text-sm text-gray-700">
                  사전 고객 뻘소 &프래스트 반영에서 서야군영?
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={serviceQuality}
                    onChange={(e) => setServiceQuality(e.target.checked)}
                    className="w-5 h-5 border-2 border-gray-300 rounded appearance-none checked:bg-black checked:border-black cursor-pointer"
                  />
                  {serviceQuality && (
                    <svg
                      className="absolute top-0 left-0 w-5 h-5 text-white pointer-events-none"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
                <span className="text-sm text-gray-700">
                  서비스 시사엔 콘덧 콘치엡 봉지드 양실가요?
                </span>
              </label>
            </div>
          </div>

          {/* Photo Upload Section */}
          <div className="mb-8">
            <div className="text-sm font-medium mb-4">사진/영상</div>
            <button className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-gray-400 transition-colors">
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                className="text-gray-400"
              >
                <path
                  d="M16 8v16M8 16h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <span className="text-sm text-gray-500">사진</span>
            </button>
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
