import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Search } from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';
import hairIcon from '../../images/home/Hair.svg';
import fashionIcon from '../../images/home/Fashion.svg';
import makeupIcon from '../../images/home/MakeUp.svg';
import skinIcon from '../../images/home/Skin.svg';
import heartIcon from '../../images/mypage/heart.svg';
import homeIcon from '../../images/home/home.svg';
import exploreIcon from '../../images/home/search.svg';
import chatIcon from '../../images/home/chat.svg';
import communityIcon from '../../images/home/community.svg';
import mypageIcon from '../../images/home/mypage.svg';

type Banner = {
  id: number;
  title: string;
  subtitle: string;
  image?: string;
};

type Category = {
  id: string;
  label: string;
  icon?: string;
  route: string;
};

type TopExpert = {
  id: number;
  name: string;
  category: string;
  summary: string;
  avatar?: string;
};

type ReviewCard = {
  id: number;
  name: string;
  rating: number;
  date: string;
  content: string;
  category: string;
  concern: string;
  avatar?: string;
  images: string[];
};

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, initializeAuth } = useAuthStore();
  const [selectedTopTab, setSelectedTopTab] = useState('전체');

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const banners: Banner[] = [
    {
      id: 1,
      title: '박철옹이 알려주는',
      subtitle: '진짜 남자의 메이크업',
    },
    {
      id: 2,
      title: '박철옹이 알려주는',
      subtitle: '진짜 남자의 메이크업',
    },
    {
      id: 3,
      title: '박철옹이 알려주는',
      subtitle: '진짜 남자의 메이크업',
    },
  ];

  const categories: Category[] = [
    { id: 'hair', label: 'Hair', route: '/category/hair', icon: hairIcon },
    { id: 'fashion', label: 'Fashion', route: '/category/fashion', icon: fashionIcon },
    { id: 'makeup', label: 'Makeup', route: '/category/makeup', icon: makeupIcon },
    { id: 'skin', label: 'Skin', route: '/category/skin', icon: skinIcon },
  ];

  const topTabs = [
    { label: '전체', minWidth: 47 },
    { label: '헤어', minWidth: 47 },
    { label: '시스루 댄디', minWidth: 84 },
    { label: '다운펌', minWidth: 58 },
    { label: '스킨', minWidth: 47 },
  ];

  const topExperts: TopExpert[] = [
    {
      id: 1,
      name: '강현우',
      category: '메이크업',
      summary:
        '김바보님을 위한 솔루션지가 도착했어요. 24시간 내에 질문이 가능하며 시간이 지나면 질문이 불가능해요.',
    },
    {
      id: 2,
      name: '최영인',
      category: '헤어',
      summary:
        '이지지원님을 위한 솔루션지가 도착했어요. 24시간 내에 질문이 가능하며 시간이 지나면 질문이 불가능해요.',
    },
    {
      id: 3,
      name: '김준영',
      category: '패션',
      summary:
        '윤나영님을 위한 솔루션지가 도착했어요. 24시간 내에 질문이 가능하며 시간이 지나면 질문이 불가능해요.',
    },
  ];

  const reviews: ReviewCard[] = [
    {
      id: 1,
      name: '옹민호 전문가',
      rating: 4.7,
      date: '2025.10.08',
      content:
        '머리가 악성곱슬이어서 너무 고민이었는데 옹민호 전문가님 만나고 광명 찾았어요~!!! 원래는 2주만 지나도 바로 곱슬곱슬해지는데 지금 한 달이 지나도 직모에요.',
      category: '헤어',
      concern: '탈모',
      images: ['', ''],
    },
    {
      id: 2,
      name: '옹민호 전문가',
      rating: 4.7,
      date: '2025.10.08',
      content:
        '평소에 여드름도 많아서 메이크업 받으면 둥둥 떴는데 성정수 상담가님 덕분에 너무 멋지게 프로필 사진 촬영하고 왔어요! 상세하게 알려주셔서 덕분에 메이크업 잘하고 갔습니다.',
      category: '메이크업',
      concern: '?',
      images: ['', ''],
    },
  ];

  const handleMyPageClick = () => {
    if (isAuthenticated) {
      navigate('/profile');
    } else {
      navigate('/auth/login');
    }
  };

  return (
    <div className="flex h-full flex-col bg-white">
      <header className="flex items-center justify-between px-4 pt-[14px]">
        <div className="flex items-center gap-1 text-[18px] font-semibold tracking-tight">
          <span>MENUAL</span>
          <span>.</span>
        </div>
        <div className="flex items-center gap-[14px]">
          <button className="flex h-6 w-6 items-center justify-center">
            <Search className="h-6 w-6 text-[#0f0f10]" />
          </button>
          <button className="flex h-6 w-6 items-center justify-center">
            <img src={heartIcon} alt="찜" className="h-6 w-6" />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-6 scrollbar-hide">
        <section className="px-4 pt-4">
          <div className="flex gap-[6px] overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
            {banners.map((banner) => (
              <article
                key={banner.id}
                className="relative h-[340px] w-[340px] shrink-0 overflow-hidden rounded-[12px] bg-[#c7c9cf] snap-start"
              >
                {banner.image && (
                  <img
                    src={banner.image}
                    alt=""
                    className="absolute inset-0 h-full w-full rounded-[11.333px] object-cover"
                  />
                )}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(180deg, rgba(111,111,111,0) 52.404%, rgba(89,89,89,0.9) 100%)',
                  }}
                />
                <div className="absolute left-6 top-[244px] w-[292px] text-[#f4f4f5]">
                  <p className="text-[25.5px] font-semibold leading-[1.5]">
                    {banner.title}
                  </p>
                  <p className="text-[25.5px] font-semibold leading-[1.5]">
                    {banner.subtitle}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="px-4 pt-[33px]">
          <div className="flex items-start gap-[5px]">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => navigate(category.route)}
                className={`flex flex-col items-center gap-[1px] ${
                  category.id === 'hair'
                    ? 'w-[80px]'
                    : category.id === 'skin'
                      ? 'w-[80px]'
                      : 'w-[84px]'
                }`}
              >
                {category.icon ? (
                  <img
                    src={category.icon}
                    alt=""
                    width={80}
                    height={80}
                    className="block h-[80px] w-[80px]"
                  />
                ) : (
                  <div className="flex h-[80px] w-[80px] items-center justify-center rounded-full bg-[#f4f4f5]" />
                )}
                <span className="text-[12px] leading-[1.4] text-[#989ba2]">
                  {category.label}
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="px-4 pt-7">
          <div className="flex items-center justify-between">
            <h2 className="text-[18px] font-semibold text-[#0f0f10]">
              지금 가장 인기있는 전문가 TOP3
            </h2>
          </div>
          <div className="mt-[16px] flex gap-[8px] overflow-x-auto pb-2 scrollbar-hide">
            {topTabs.map((tab) => (
              <button
                key={tab.label}
                onClick={() => setSelectedTopTab(tab.label)}
                className={`flex h-[30px] items-center justify-center whitespace-nowrap rounded-[4px] px-[12px] text-[13px] ${
                  selectedTopTab === tab.label
                    ? 'bg-[#46474c] text-white font-semibold'
                    : 'border border-[#dbdcdf] text-[#46474c] font-normal'
                }`}
                style={{ minWidth: tab.minWidth }}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="mt-4 space-y-4">
            {topExperts.map((expert, index) => (
              <div key={expert.id} className="flex h-[67px] w-[342px] items-center justify-between">
                <div className="flex items-center gap-[9px]">
                  <span className="w-[12px] text-center text-[18px] font-semibold leading-[1.1] text-[#656870]">
                    {index + 1}
                  </span>
                  <div className="flex items-center gap-[15px]">
                    <div className="h-[60px] w-[60px] shrink-0 overflow-hidden rounded-full bg-[#e1e2e4]">
                      {expert.avatar && (
                        <img src={expert.avatar} alt="" className="h-full w-full object-cover" />
                      )}
                    </div>
                    <div className="flex flex-col items-start">
                      <div className="flex items-center gap-[8px]">
                        <span className="rounded-[2px] bg-[#e5f4ff] px-[8px] py-[4px] text-[12px] text-[#008bff]">
                          {expert.category}
                        </span>
                        <span className="text-[14px] font-semibold text-[#292a2d]">
                          {expert.name}
                        </span>
                      </div>
                      <p className="mt-[6px] line-clamp-2 w-[184px] text-[13px] text-[#878a93]">
                        {expert.summary}
                      </p>
                    </div>
                  </div>
                </div>
                <button className="flex h-6 w-6 items-center justify-center">
                  <img src={heartIcon} alt="찜" className="h-6 w-6" />
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="pt-10">
          <div className="flex items-center justify-between px-4">
            <h2 className="text-[18px] font-semibold text-[#0f0f10]">실시간 후기 확인하기</h2>
            <button className="flex items-center gap-[2px] text-[14px] text-[#70737c]">
              전체보기
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-4 flex gap-2 overflow-x-auto px-4 pb-2 scrollbar-hide snap-x snap-mandatory">
            {reviews.map((review) => (
              <article
                key={review.id}
                className="flex h-[410px] w-[300px] shrink-0 flex-col rounded-[8px] border border-[#e1e2e4] bg-white snap-start"
              >
                <div className="flex items-center gap-[10px] border-b border-[#f4f4f5] px-4 py-[14px]">
                  <div className="h-[36px] w-[36px] shrink-0 overflow-hidden rounded-full bg-[#e1e2e4]">
                    {review.avatar && (
                      <img src={review.avatar} alt="" className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-[4px]">
                    <div className="flex items-center gap-[2px]">
                      <span className="text-[14px] font-semibold text-[#0f0f10]">
                        {review.name}
                      </span>
                      <ChevronRight className="h-4 w-4 text-[#0f0f10]" />
                    </div>
                    <div className="flex items-center gap-[8px] text-[13px] text-[#989ba2]">
                      <div className="flex items-center gap-1 text-[#ffb800]">★★★★★</div>
                      <span>{review.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="px-4 pt-4">
                  <div className="flex gap-[8px]">
                    {review.images.map((image, index) => (
                      <div
                        key={`${review.id}-image-${index}`}
                        className="h-[130px] w-[130px] overflow-hidden rounded-[4px] bg-[#e1e2e4]"
                      >
                        {image && (
                          <img src={image} alt="" className="h-full w-full object-cover" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="px-4 pt-3">
                  <div className="flex items-center gap-[12px] text-[13px] text-[#989ba2]">
                    <span className="font-semibold text-[#878a93]">박덕호</span>
                    <span>{review.date}</span>
                  </div>
                  <p className="mt-2 text-[13px] leading-[1.4] text-[#505158]">
                    {review.content}
                  </p>
                </div>
                <div className="flex gap-[6px] px-4 pb-4 pt-2">
                  <span className="rounded-[2px] bg-[#e5f4ff] px-[8px] py-[4px] text-[12px] text-[#008bff]">
                    {review.category}
                  </span>
                  <span className="rounded-[2px] bg-[#f4f4f5] px-[8px] py-[4px] text-[12px] text-[#46474c]">
                    {review.concern}
                  </span>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-center">
            <div className="h-[3px] w-[55px] rounded-full bg-[#e1e2e4]">
              <div className="h-[3px] w-[20px] rounded-full bg-[#429ff0]" />
            </div>
          </div>
        </section>
      </main>

      <nav className="flex h-[69px] items-center justify-between border-t border-[#f4f4f5] px-4 pb-[12px] pt-[12px]">
        <button className="flex flex-1 flex-col items-center gap-1 text-[#0f0f10]">
          <img src={homeIcon} alt="홈" className="h-6 w-6" />
          <span className="text-[12px] font-semibold">홈</span>
        </button>
        <button className="flex flex-1 flex-col items-center gap-1 text-[#aeb0b6]">
          <img src={exploreIcon} alt="탐색" className="h-6 w-6" />
          <span className="text-[12px]">탐색</span>
        </button>
        <button
          onClick={() => navigate('/chat')}
          className="flex flex-1 flex-col items-center gap-1 text-[#aeb0b6]"
        >
          <img src={chatIcon} alt="채팅" className="h-6 w-6" />
          <span className="text-[12px]">채팅</span>
        </button>
        <button className="flex flex-1 flex-col items-center gap-1 text-[#aeb0b6]">
          <img src={communityIcon} alt="커뮤니티" className="h-6 w-6" />
          <span className="text-[12px]">커뮤니티</span>
        </button>
        <button
          onClick={handleMyPageClick}
          className="flex flex-1 flex-col items-center gap-1 text-[#aeb0b6]"
        >
          <img src={mypageIcon} alt="마이페이지" className="h-6 w-6" />
          <span className="text-[12px]">마이페이지</span>
        </button>
      </nav>
    </div>
  );
};

export default HomePage;
