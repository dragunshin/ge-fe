import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Heart } from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';

// 임시 데이터 타입 (추후 백엔드 API 타입으로 교체)
interface Expert {
  id: number;
  name: string;
  category: string;
  rating: number;
  image?: string;
}

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, initializeAuth } = useAuthStore();
  const [selectedReviewTab, setSelectedReviewTab] = useState('헤어');

  // 페이지 로드 시 Auth 초기화 (localStorage에서 복원)
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);
  
  // 카테고리 데이터
  const categories = [
    { id: 'hair', name: 'Hair', icon: '' },
    { id: 'fashion', name: 'Fashion', icon: '' },
    { id: 'makeup', name: 'Makeup', icon: '' },
    { id: 'skin', name: 'Skin', icon: '' },
  ];

  // 후기 탭
  const reviewTabs = ['헤어', '스킨케어', '패션', '메이크업'];

  // 임시 전문가 데이터 (추후 백엔드 API에서 가져올 예정)
  const topExperts: Expert[] = [
    { id: 1, name: '전문가 이름', category: '메이크업', rating: 4.7 },
    { id: 2, name: '전문가 이름', category: '메이크업', rating: 4.7 },
    { id: 3, name: '전문가 이름', category: '메이크업', rating: 4.7 },
  ];

  // 마이페이지 클릭 핸들러
  const handleMyPageClick = () => {
    if (isAuthenticated) {
      navigate('/profile');
    } else {
      navigate('/auth/login');
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      {/* 헤더 */}
      <header className="flex-shrink-0 bg-white z-10 px-4 py-3 flex items-center justify-between border-b border-gray-100">
        <h1 className="text-xl font-bold">Menual</h1>
        <div className="flex items-center gap-2">
          <button className="p-1.5 hover:bg-gray-50 rounded-full transition-colors">
            <Search className="w-5 h-5" />
          </button>
          <button className="p-1.5 hover:bg-gray-50 rounded-full transition-colors">
            <Heart className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="flex-1 overflow-y-auto scrollbar-hide">
        {/* 가로 스크롤 배너 영역 */}
        <section className="px-4 py-4">
          <div className="flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
            {/* 배너 1 */}
            <div className="w-60 h-60 bg-gray-200 rounded-lg shrink-0 snap-start" />
            {/* 배너 2 */}
            <div className="w-60 h-60 bg-gray-200 rounded-lg shrink-0 snap-center" />
            {/* 배너 3 */}
            <div className="w-60 h-60 bg-gray-200 rounded-lg shrink-0 snap-start" />
          </div>
        </section>

        {/* 카테고리 섹션 */}
        <section className="px-4 py-4">
          <div className="flex justify-between items-center gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                className="flex flex-col items-center gap-2 flex-1"
              >
                <div className="w-[50px] h-[50px] bg-gray-200 rounded-full flex items-center justify-center text-xl hover:bg-gray-300 transition-colors">
                  {category.icon}
                </div>
                <span className="text-[11px] text-gray-600">{category.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* 전문가 TOP3 섹션 */}
        <section className="px-4 py-6">
          <h2 className="text-base font-bold mb-4">지금 가장 인기있는 전문가 TOP3</h2>
          <div className="space-y-3">
            {topExperts.map((expert, index) => (
              <div
                key={expert.id}
                className="flex items-center gap-3 p-3 bg-white rounded-xl"
              >
                {/* 순위 */}
                <div className="text-base font-bold text-gray-400 min-w-4">
                  {index + 1}
                </div>

                {/* 전문가 이미지 */}
                <div className="w-[60px] h-[60px] bg-gray-200 rounded-full shrink-0" />

                {/* 전문가 정보 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <h3 className="text-sm font-semibold">{expert.name}</h3>
                    <span className="text-[10px] text-[#008BFF] bg-[#E5F4FF] px-2 py-1 rounded-[2px]">
                      {expert.category}
                    </span>
                  </div>
                  <p className="text-[13px] text-gray-500 line-clamp-2 leading-relaxed">
                    김바보님을 위한 솔루션지가 도착했어요. 24시간 내에 전문가님께 질문이 가능하며 시간이 지나면 질문이 불가능해요.
                  </p>
                </div>

                {/* 좋아요 버튼 */}
                <button className="p-1 hover:bg-gray-50 rounded-full transition-colors shrink-0">
                  <Heart className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* 실시간 후기 확인하기 섹션 */}
        <section className="py-6">
          <div className="px-4 flex items-center justify-between mb-3">
            <h2 className="text-base font-bold">실시간 후기 확인하기</h2>
            <button className="text-xs text-gray-400">
              전체보기 &gt;
            </button>
          </div>

          {/* 탭 메뉴 */}
          <div className="px-4 mb-3">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {reviewTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedReviewTab(tab)}
                  className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
                    selectedReviewTab === tab
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* <div className="px-4">
            <div className="flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="min-w-[160px] shrink-0 snap-start"
                >
                  <div className="w-[160px] h-[200px] bg-gray-200 rounded-lg mb-2" />
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-semibold truncate">고객 닉네임</span>
                      <span className="text-yellow-500 text-xs">⭐</span>
                      <span className="text-xs font-medium">4.7</span>
                    </div>
                    <p className="text-[11px] text-gray-500 line-clamp-2 leading-tight">
                      고객이 직접한 후기 써주기 포트폴리오 받기 위해 써놓은 엉뚱한 글들이 여기서 보여요는 건 이명바꿔요?
                    </p>
                    <div className="flex gap-1 mt-1.5">
                      <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded">헤어</span>
                      <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded truncate">세부고민 #1</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div> */}
        </section>
      </main>

      {/* 하단 네비게이션 바 */}
      <nav className="flex-shrink-0 bg-white border-t border-gray-200 px-4 py-3 flex justify-around items-center">
        <button onClick={() => navigate('/')} className="flex flex-col items-center gap-1 text-gray-600">
          <div className="w-12 h-12 bg-gray-200 rounded-full" />
          <span className="text-[10px]">홈</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-gray-400">
          <div className="w-12 h-12 bg-gray-200 rounded-full" />
          <span className="text-[10px]">탐색</span>
        </button>
        <button onClick={() => navigate('/chat')} className="flex flex-col items-center gap-1 text-gray-400">
          <div className="w-12 h-12 bg-gray-200 rounded-full" />
          <span className="text-[10px]">채팅</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-gray-400">
          <div className="w-12 h-12 bg-gray-200 rounded-full" />
          <span className="text-[10px]">커뮤니티</span>
        </button>
        <button onClick={handleMyPageClick} className="flex flex-col items-center gap-1 text-gray-400">
          <div className="w-12 h-12 bg-gray-200 rounded-full" />
          <span className="text-[10px]">마이페이지</span>
        </button>
      </nav>
    </div>
  );
};

export default HomePage;
