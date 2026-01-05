import { useEffect, useMemo, useState, type KeyboardEvent } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ChevronRight, Search } from 'lucide-react';
import heartIcon from '../../images/mypage/heart.svg';
import BottomNav from '@/components/navigation/bottom-nav';
import Logo from '@/components/ui/logo';
import starIcon from '../../images/reviews/star.svg';
import { expertService } from '../../services/expert.service';
import { reviewService } from '../../services/review.service';
import {
  getApiCategoryFromRoute,
  getLabelFromApiCategory,
} from '../../lib/utils/category';

type TabItem = {
  id: string;
  label: string;
  route?: string;
  underlineLeft: number;
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

type ExpertListCard = {
  id: number;
  name: string;
  rating: number;
  reviewCount: string;
  summary: string;
  avatar?: string;
  tags: string[];
  reviewTags: string[];
  images: string[];
};

type StyleCard = {
  id: number;
  title: string;
  description: string;
  badge: string;
  image?: string;
};

type ImmediateCard = {
  id: number;
  expertId?: number;
  title: string;
  subtitle: string;
  expert: string;
  rating: number;
  reviewCount: string;
  times: string[];
  image?: string;
  avatar?: string;
};

const CategoryLandingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const categoryKey = params.category ?? 'hair';
  const apiCategory = getApiCategoryFromRoute(categoryKey);
  const [selectedStyleFilter, setSelectedStyleFilter] = useState('전체');
  const [reviews, setReviews] = useState<ReviewCard[]>([]);
  const [expertCards, setExpertCards] = useState<ExpertListCard[]>([]);

  const categoryLabel = useMemo(() => {
    const map: Record<string, string> = {
      hair: '헤어',
      fashion: '패션',
      makeup: '메이크업',
      skin: '스킨',
    };
    return map[categoryKey] ?? '헤어';
  }, [categoryKey]);

  const handleExpertProfile = (expertId: number) => {
    navigate(`/experts/${expertId}`);
  };

  const handleExpertKeyDown = (
    event: KeyboardEvent<HTMLDivElement>,
    expertId: number,
  ) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleExpertProfile(expertId);
    }
  };

  const handleReservationSchedule = () => {
    navigate("/sheetTest");
  };

  const formatDate = (value?: string) => {
    if (!value) {
      return '';
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return '';
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  };

  const parseMediaUrls = (value?: string) => {
    if (!value) {
      return [];
    }
    const trimmed = value.trim();
    if (!trimmed) {
      return [];
    }
    if (trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parsed.filter(Boolean);
        }
      } catch {
        return [];
      }
    }
    return trimmed
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  };

  useEffect(() => {
    let isActive = true;

    const fetchReviews = async () => {
      try {
        const response = await reviewService.getRecentReviews({
          category: apiCategory,
          page: 0,
          size: 5,
        });
        if (!isActive) {
          return;
        }
        const mapped = response.data.map((review) => ({
          id: review.reviewId,
          name: '익명',
          rating: review.rating,
          date: formatDate(review.createdAt),
          content: review.content,
          category: getLabelFromApiCategory(review.category),
          concern: '후기',
          images: parseMediaUrls(review.mediaUrls).slice(0, 2),
        }));
        setReviews(mapped);
      } catch (error) {
        console.error('Failed to fetch category reviews:', error);
      }
    };

    fetchReviews();

    return () => {
      isActive = false;
    };
  }, [apiCategory]);

  useEffect(() => {
    let isActive = true;

    const fetchExperts = async () => {
      try {
        const response = await expertService.getExpertList({
          category: apiCategory,
          page: 0,
          size: 3,
        });
        if (!isActive) {
          return;
        }
        const mapped = response.data.map((expert) => {
          const images = expert.representativeReviewImages ?? [];
          const tags = expert.category ? [getLabelFromApiCategory(expert.category)] : [];
          return {
            id: expert.expertId,
            name: expert.nickname,
            rating: Number(expert.ratingAverage?.toFixed?.(1) ?? expert.ratingAverage ?? 0),
            reviewCount: `(${expert.reviewCount?.toLocaleString?.() ?? expert.reviewCount ?? 0})`,
            summary: expert.introduction,
            avatar: expert.profileImage,
            tags,
            reviewTags: images.map(() => tags[0] ?? '후기'),
            images,
          };
        });
        setExpertCards(mapped);
      } catch (error) {
        console.error('Failed to fetch category experts:', error);
      }
    };

    fetchExperts();

    return () => {
      isActive = false;
    };
  }, [apiCategory]);

  const categoryTabs: TabItem[] = useMemo(
    () => [
      { id: 'all', label: '전체', route: '/', underlineLeft: 16 },
      { id: 'hair', label: '헤어', route: '/category/hair', underlineLeft: 85 },
      { id: 'makeup', label: '메이크업', route: '/category/makeup', underlineLeft: 153 },
      { id: 'fashion', label: '패션', route: '/category/fashion', underlineLeft: 249 },
      { id: 'skin', label: '스킨', route: '/category/skin', underlineLeft: 317 },
    ],
    [],
  );

  const quickTopics = [
    { label: '펌으로 이미지 변신' },
    { label: '탈모 콤플렉스' },
    { label: '헤어라인 정리' },
    { label: '데일리 헤어 손질법' },
  ];

  const styleFilters = ['전체', '컷', '펌', '염색', '클리닉', '스타일링', '탈모'];

  const styleCards: StyleCard[] = [
    {
      id: 1,
      badge: '인기 1위',
      title: '스핀 스왈로브 펌',
      description: '과하지 않고 자연스러운 펌으로 이목구비를 강조하는 가벼운 곡선형 펌',
    },
    {
      id: 2,
      badge: '인기 1위',
      title: '스핀 스왈로브 펌',
      description: '과하지 않고 자연스러운 펌으로 이목구비를 강조하는 펌',
    },
  ];

  const immediateCards: ImmediateCard[] = [
    {
      id: 1,
      expertId: 1,
      title: '소개팅 필승 펌',
      subtitle: '“여심을 흔들만한 스핀 스왈로브펌”',
      expert: '성정수 상담사',
      rating: 4.7,
      reviewCount: '(1,130)',
      times: ['오전 11:00', '오후 12:30', '오후 1:00'],
    },
    {
      id: 2,
      expertId: 2,
      title: '여심 저격 컷',
      subtitle: '“콧대가 높아보이는 가일컷”',
      expert: '성정수 상담사',
      rating: 4.7,
      reviewCount: '(1,130)',
      times: ['오전 11:00', '오후 12:30', '오후 1:00'],
    },
  ];

  const underlineLeft = categoryTabs.find((tab) => tab.label === categoryLabel)?.underlineLeft ?? 85;
  const scrollToSection = (section?: string | null) => {
    if (!section) {
      return;
    }
    const target =
      section === 'immediate'
        ? document.getElementById('immediate-section')
        : section === 'experts'
          ? document.getElementById('expert-section')
          : null;
    if (target) {
      requestAnimationFrame(() => {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  };

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    scrollToSection(query.get('section'));
  }, [location.search]);

  return (
    <div className="flex h-full flex-col bg-white">
      <header className="flex h-[56px] items-center justify-between px-4">
        <Logo />
        <div className="flex items-center gap-4">
          <button className="flex h-6 w-6 items-center justify-center">
            <Search className="h-6 w-6 text-[#0f0f10]" />
          </button>
          <button className="flex h-6 w-6 items-center justify-center">
            <img src={heartIcon} alt="찜" className="h-6 w-6" />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-6 scrollbar-hide">
        <section className="pt-[4px]">
          <div className="flex items-center justify-between px-4 text-[16px] font-semibold">
            {categoryTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => tab.route && navigate(tab.route)}
                className={
                  tab.label === categoryLabel
                    ? 'text-[#0f0f10]'
                    : 'text-[#989ba2]'
                }
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="relative mt-[12px] h-px bg-[#e1e2e4]">
            <span className="absolute top-0 h-px w-[41px] bg-[#0f0f10]" style={{ left: underlineLeft }} />
          </div>
        </section>

        <section className="relative mt-[20px] h-[246px] w-full overflow-hidden">
          <div className="absolute left-[-25px] top-[-8px] h-[262px] w-[400px] rounded-[12px] bg-[#d2d4d8]" />
          <div className="absolute bottom-0 left-[-20px] h-[144.5px] w-[416px] bg-gradient-to-b from-transparent to-black/50" />
          <div className="absolute left-[19.5px] top-[125px] w-[165px] text-white">
            <p className="text-[12px] leading-[1.4]">이제 슬슬 준비해야지</p>
            <p className="mt-1 text-[18px] font-semibold leading-[1.35]">
              소개팅 필수 헤어스타일
              <br />‘스핀 스왈로브펌’
            </p>
            <div className="mt-3 inline-flex h-[22px] items-center gap-[4px] bg-[#008bff] px-[8px] text-[12px] font-semibold">
              <span>박서령</span>
              <span className="h-[7px] w-px bg-white/80" />
              <span className="text-[10px] font-medium">헤어디자이너</span>
            </div>
          </div>
          <div className="absolute right-[15px] top-[205px] flex h-[20px] w-[36px] items-center justify-center rounded-[37px] bg-black/50 text-[12px] text-white">
            1/12
          </div>
        </section>

        <section className="mt-[16px] px-4">
          <div className="flex gap-[6px] overflow-x-auto pb-[2px] scrollbar-hide">
            {quickTopics.map((topic) => (
              <div
                key={topic.label}
                className="flex h-[44px] shrink-0 items-center gap-[10px] rounded-[4px] bg-white p-[10px] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.2)]"
              >
                <div className="h-[24px] w-[24px] bg-[#d9d9d9]" />
                <span className="text-[13px] font-semibold text-[#292a2d]">
                  {topic.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="px-4 pt-[32px]">
          <div className="flex items-center justify-between">
            <h2 className="text-[18px] font-semibold text-[#0f0f10]">
              전문가들이 많이 추천하는 스타일
            </h2>
            <button className="flex items-center gap-[2px] text-[14px] text-[#70737c]">
              전체보기
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-[12px] flex gap-[8px] overflow-x-auto pb-2 scrollbar-hide">
            {styleFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedStyleFilter(filter)}
                className={`flex h-[30px] shrink-0 items-center justify-center whitespace-nowrap rounded-[4px] px-[12px] py-[6px] text-[13px] leading-[1.4] ${
                  selectedStyleFilter === filter
                    ? 'bg-[#46474c] text-white font-semibold'
                    : 'border border-[#dbdcdf] bg-white text-[#46474c] font-normal'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
          <div className="mt-[16px] flex gap-[16px] overflow-x-auto pb-2 scrollbar-hide">
            {styleCards.map((card) => (
              <article
                key={card.id}
                className="relative h-[240px] w-[267px] shrink-0 overflow-hidden rounded-[8px] bg-white shadow-[0px_2px_12px_0px_rgba(0,0,0,0.13)]"
              >
                <div className="h-[142px] w-full overflow-hidden bg-[#d2d4d8]">
                  {card.image && (
                    <img src={card.image} alt="" className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="absolute left-[10px] top-[155px] flex items-center gap-[8px]">
                  <span className="inline-flex items-center rounded-[2px] bg-[#e5f4ff] px-[8px] py-[4px] text-[12px] text-[#008bff]">
                    {card.badge}
                  </span>
                  <p className="text-[14px] font-semibold text-black">{card.title}</p>
                </div>
                <p className="absolute left-[15px] top-[187px] w-[201px] text-[12px] font-medium leading-[1.4] text-[#656870]">
                  {card.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-[32px] bg-[#f4f8fb]">
          <div className="px-4 pt-[22px]">
            <div className="flex items-center justify-between">
              <h2 className="text-[18px] font-semibold text-[#0f0f10]">실시간 후기 확인하기</h2>
              <button
                onClick={() => navigate(`/category/${categoryKey}/reviews`)}
                className="flex items-center gap-[2px] text-[14px] text-[#70737c]"
              >
                전체보기
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="mt-4 flex gap-2 overflow-x-auto px-4 pb-2 scrollbar-hide snap-x snap-mandatory">
            {reviews.map((review) => (
              <article
                key={review.id}
                className="flex h-[393px] w-[300px] shrink-0 flex-col rounded-[8px] border border-[#e1e2e4] bg-white snap-start"
              >
                <div className="flex items-center justify-between px-4 pt-[14px]">
                  <div className="flex items-center gap-[10px]">
                    <div className="h-[36px] w-[36px] shrink-0 overflow-hidden rounded-full bg-[#e1e2e4]">
                      {review.avatar && (
                        <img src={review.avatar} alt="" className="h-full w-full object-cover" />
                      )}
                    </div>
                    <div className="flex flex-col gap-[4px]">
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
                  <button className="text-[14px] text-[#70737c]">프로필 보기</button>
                </div>
                <div className="px-4 pt-[14px]">
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
                <div className="mt-auto flex gap-[6px] px-4 pb-4 pt-2">
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
          <div className="mt-4 flex items-center justify-center pb-[12px]">
            <div className="h-[3px] w-[55px] rounded-full bg-[#e1e2e4]">
              <div className="h-[3px] w-[20px] rounded-full bg-[#429ff0]" />
            </div>
          </div>
        </section>

        <section id="immediate-section" className="px-4 pt-[32px]">
          <div className="flex items-center justify-between">
            <h2 className="text-[18px] font-semibold text-[#0f0f10]">즉시 상담이 가능한 전문가</h2>
            <button
              onClick={() => navigate(`/category/${categoryKey}?section=immediate`)}
              className="flex items-center gap-[2px] text-[14px] text-[#70737c]"
            >
              전체보기
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-[16px] flex gap-[12px] overflow-x-auto pb-2 scrollbar-hide">
            {immediateCards.map((card, index) => (
              <article
                key={card.id}
                onClick={() => {
                  const fallbackExpertId = expertCards[index]?.id ?? expertCards[0]?.id;
                  const targetId = card.expertId ?? fallbackExpertId;
                  if (targetId) {
                    navigate(`/experts/${targetId}`);
                  }
                }}
                className="relative h-[288px] w-[301px] shrink-0 rounded-[8px] bg-white shadow-[0px_2px_12px_0px_rgba(0,0,0,0.13)] cursor-pointer"
              >
                <div className="relative h-[170px] w-full overflow-hidden rounded-t-[8px] bg-[#d2d4d8]">
                  {card.image && (
                    <img src={card.image} alt="" className="h-full w-full object-cover" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" />
                  <p className="absolute bottom-[30px] left-[13px] text-[12px] text-white">
                    {card.subtitle}
                  </p>
                  <p className="absolute bottom-[50px] left-[13px] text-[14px] font-semibold text-white">
                    {card.title}
                  </p>
                </div>
                <div className="absolute left-[12px] top-[183px] flex items-center gap-[10px]">
                  <div className="h-[36px] w-[36px] rounded-full bg-[#e1e2e4]">
                    {card.avatar && (
                      <img src={card.avatar} alt="" className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-[#0f0f10]">{card.expert}</p>
                    <div className="mt-[4px] flex items-center gap-[4px] text-[13px] text-[#878a93]">
                      <img src={starIcon} alt="" className="h-[18px] w-[18px]" />
                      <span className="font-semibold text-[#505158]">{card.rating}</span>
                      <span>{card.reviewCount}</span>
                    </div>
                  </div>
                </div>
                <div className="absolute left-[12px] top-[238px] flex gap-[6px]">
                  {card.times.map((time) => (
                    <button
                      key={`${card.id}-${time}`}
                      type="button"
                      onClick={(event) => event.stopPropagation()}
                      className="flex h-[36px] w-[88px] items-center justify-center rounded-[6px] bg-[#008bff] text-[13px] text-white"
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="expert-section" className="px-4 pt-[32px]">
          <div className="flex items-center justify-between">
            <h2 className="text-[18px] font-semibold text-[#0f0f10]">헤어 전문가</h2>
            <button
              onClick={() => navigate(`/category/${categoryKey}?section=experts`)}
              className="flex items-center gap-[2px] text-[14px] text-[#70737c]"
            >
              전체보기
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-[16px] space-y-[16px]">
            {expertCards.map((expert) => (
              <article
                key={expert.id}
                role="button"
                tabIndex={0}
                onClick={() => handleExpertProfile(expert.id)}
                onKeyDown={(event) => handleExpertKeyDown(event, expert.id)}
                className="relative h-[253px] w-[343px] rounded-[8px] bg-white shadow-[0px_2px_12px_0px_rgba(0,0,0,0.13)] cursor-pointer"
              >
                <div className="absolute left-[13px] top-[23px] flex items-center gap-[10px] text-left">
                  <div className="h-[42px] w-[42px] shrink-0 rounded-full bg-[#e1e2e4]">
                    {expert.avatar && (
                      <img src={expert.avatar} alt="" className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div>
                    <p className="text-[16px] font-semibold leading-[1.1] text-[#292a2d]">
                      {expert.name}
                    </p>
                    <p className="mt-[6px] text-[13px] text-[#878a93]">{expert.summary}</p>
                  </div>
                </div>
                <div className="absolute right-[13px] top-[23px] flex items-center gap-[6px] text-[13px] text-[#878a93]">
                  <div className="flex items-center gap-[2px]">
                    <img src={starIcon} alt="" className="h-[18px] w-[18px]" />
                    <span className="font-semibold text-[#505158]">{expert.rating}</span>
                  </div>
                  <span>{expert.reviewCount}</span>
                </div>
                <div
                  className="absolute left-[12px] top-[79px] flex gap-[2px]"
                  onClick={() => handleExpertProfile(expert.id)}
                >
                  {expert.images.map((image, index) => (
                    <div
                      key={`${expert.id}-review-${index}`}
                      className="relative h-[105px] w-[105px] overflow-hidden rounded-[4px] bg-[#e1e2e4]"
                    >
                      {image && (
                        <img src={image} alt="" className="h-full w-full object-cover" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
                      <span className="absolute bottom-[10px] left-[10px] text-[12px] text-white">
                        {expert.reviewTags[index]}
                      </span>
                    </div>
                  ))}
                </div>
                <button
                  className="absolute right-[12px] top-[198px] h-[36px] w-[95px] rounded-[4px] bg-[#171719] text-[14px] font-medium text-white"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleReservationSchedule();
                  }}
                >
                  상담 예약
                </button>
                <div className="absolute left-[13px] top-[204px] flex gap-[6px]">
                  {expert.tags.map((tag, index) => (
                    <span
                      key={`${expert.id}-tag-${tag}-${index}`}
                      className={
                        tag === '헤어'
                          ? 'rounded-[2px] bg-[#f5f9fd] px-[6px] py-[4px] text-[12px] text-[#429ff0]'
                          : 'rounded-[2px] bg-[#f4f4f5] px-[8px] py-[4px] text-[12px] text-[#46474c]'
                      }
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
};

export default CategoryLandingPage;
