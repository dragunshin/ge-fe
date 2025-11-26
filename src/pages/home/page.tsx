import { useState } from 'react';
import { Search, Heart } from 'lucide-react';

// 임시 데이터 타입 (추후 백엔드 API 타입으로 교체)
interface Expert {
  id: number;
  name: string;
  category: string;
  rating: number;
  image?: string;
}

const HomePage = () => {
  const [selectedReviewTab, setSelectedReviewTab] = useState('헤어');

  // 카테고리 데이터
  const categories = [
    { id: 'hair', name: 'Hair', icon: '💇' },
    { id: 'fashion', name: 'Fashion', icon: '👔' },
    { id: 'makeup', name: 'Makeup', icon: '💄' },
    { id: 'skin', name: 'Skin', icon: '✨' },
  ];

  // 후기 탭
  const reviewTabs = ['헤어', '스킨케어', '패션', '메이크업'];

  // 임시 전문가 데이터 (추후 백엔드 API에서 가져올 예정)
  const topExperts: Expert[] = [
    { id: 1, name: '전문가 이름', category: '메이크업', rating: 4.7 },
    { id: 2, name: '전문가 이름', category: '메이크업', rating: 4.7 },
    { id: 3, name: '전문가 이름', category: '메이크업', rating: 4.7 },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <header className="sticky top-0 bg-white z-10 px-4 py-3 flex items-center justify-between">
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
      <main className="pb-20">
        {/* 가로 스크롤 배너 영역 */}
        <section className="px-4 py-4">
          <div className="flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
            {/* 배너 1 */}
            <div className="min-w-[52px] h-[140px] bg-gray-200 rounded-lg shrink-0 snap-start" />
            {/* 배너 2 (중앙 큰 배너) */}
            <div className="min-w-[260px] h-[140px] bg-gray-300 rounded-lg shrink-0 snap-center" />
            {/* 배너 3 */}
            <div className="min-w-[52px] h-[140px] bg-gray-200 rounded-lg shrink-0 snap-start" />
          </div>
        </section>

        {/* 카테고리 섹션 */}
        <section className="px-4 py-2">
          <div className="flex justify-between items-center gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                className="flex flex-col items-center gap-1.5 flex-1"
              >
                <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center text-xl hover:bg-gray-200 transition-colors">
                  {category.icon}
                </div>
                <span className="text-xs text-gray-500">{category.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* 전문가 TOP3 섹션 */}
        <section className="px-4 py-6">
          <h2 className="text-base font-bold mb-3">지금 가장 인기있는 전문가 TOP3</h2>
          <div className="space-y-3">
            {topExperts.map((expert, index) => (
              <div
                key={expert.id}
                className="flex items-start gap-3 p-3 bg-white border border-gray-200 rounded-lg"
              >
                {/* 순위 */}
                <div className="text-lg font-bold text-gray-400 min-w-[20px] pt-0.5">
                  {index + 1}
                </div>

                {/* 전문가 이미지 */}
                <div className="w-12 h-12 bg-gray-200 rounded-full shrink-0" />

                {/* 전문가 정보 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <h3 className="text-sm font-semibold">{expert.name}</h3>
                    <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                      {expert.category}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2">
                    컨비닝보낼 위한 솔루션지가 도 직절이구. 24시간 내에 전문가의 솔루션을...
                  </p>
                </div>

                {/* 좋아요 버튼 */}
                <button className="p-1 hover:bg-gray-50 rounded-full transition-colors shrink-0">
                  <Heart className="w-4 h-4" />
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

          {/* 전문가 카드 가로 스크롤 */}
          <div className="px-4">
            <div className="flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="min-w-[160px] shrink-0 snap-start"
                >
                  {/* 전문가 이미지 */}
                  <div className="w-[160px] h-[200px] bg-gray-200 rounded-lg mb-2" />
                  {/* 전문가 정보 */}
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
          </div>
        </section>
      </main>

      {/* 하단 네비게이션 바 */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 flex justify-around items-center">
        <button className="flex flex-col items-center gap-0.5 text-black">
          <span className="text-xl">🏠</span>
          <span className="text-[10px]">홈</span>
        </button>
        <button className="flex flex-col items-center gap-0.5 text-gray-400">
          <span className="text-xl">💬</span>
          <span className="text-[10px]">채팅</span>
        </button>
        <button className="flex flex-col items-center gap-0.5 text-gray-400">
          <span className="text-xl">📝</span>
          <span className="text-[10px]">작성</span>
        </button>
        <button className="flex flex-col items-center gap-0.5 text-gray-400">
          <span className="text-xl">👤</span>
          <span className="text-[10px]">마이</span>
        </button>
      </nav>
    </div>
  );
};

export default HomePage;
