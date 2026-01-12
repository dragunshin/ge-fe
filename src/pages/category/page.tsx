import { useEffect, useMemo, useState, type KeyboardEvent } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ChevronRight, Search } from 'lucide-react';
import heartIcon from '../../images/mypage/heart.svg';
import BottomNav from '@/components/navigation/bottom-nav';
import Logo from '@/components/ui/logo';
import starIcon from '../../images/reviews/star.svg';
import { expertService } from '../../services/expert.service';
import { reviewService } from '../../services/review.service';
import ConsultationMethodSheet from '../resevationFlow/reservationSheet/typeReservation';
import DateTimeBottomSheet from '../resevationFlow/reservationSheet/calendar';
import { reservationService } from '../../services/reservation.service';
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
  expertName?: string;
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

type ConsultType = 'MESSAGE' | 'VIDEO';

const CategoryLandingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const categoryKey = params.category ?? 'hair';
  const apiCategory = getApiCategoryFromRoute(categoryKey);
  const [selectedStyleFilter, setSelectedStyleFilter] = useState('전체');
  const [reviews, setReviews] = useState<ReviewCard[]>([]);
  const [expertCards, setExpertCards] = useState<ExpertListCard[]>([]);
  const [openTypeSheet, setOpenTypeSheet] = useState(false);
  const [openCalendarSheet, setOpenCalendarSheet] = useState(false);
  const [selectedConsultType, setSelectedConsultType] =
    useState<ConsultType>('MESSAGE');
  // 예약 시작 시 선택한 전문가 저장
  const [selectedReservationExpertId, setSelectedReservationExpertId] = useState<number | null>(
    null,
  );

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
    event: KeyboardEvent<HTMLElement>,
    expertId: number,
  ) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleExpertProfile(expertId);
    }
  };

  const handleReservationSchedule = () => {
    if (categoryKey === 'hair') {
      setOpenTypeSheet(true);
      return;
    }
    if (categoryKey === 'fashion') {
      setOpenTypeSheet(true);
      return;
    }
    navigate('/service-ready');
  };

  const getReservationRoute = () => {
    if (categoryKey === 'fashion') {
      return '/reservation/fashion';
    }
    return '/hair/setup';
  };

  // timeId를 예약 날짜/시간 ISO로 변환
  const buildScheduledDateTime = (date: Date, timeId: string) => {
    const parsed = /^t-(\d{2})(\d{2})$/.exec(timeId);
    const hour24 = parsed ? Number(parsed[1]) : 0;
    const minute = parsed ? Number(parsed[2]) : 0;
    const value = new Date(date);
    value.setHours(hour24, minute, 0, 0);
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const day = String(value.getDate()).padStart(2, "0");
    const hour = String(value.getHours()).padStart(2, "0");
    const minuteStr = String(value.getMinutes()).padStart(2, "0");
    const second = String(value.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day}T${hour}:${minuteStr}:${second}`;
  };

  // 패션 예약 임시 생성 후 reservationId 전달
  const handleTempReservation = async (date: Date, timeId: string) => {
    if (categoryKey !== 'fashion' && categoryKey !== 'hair') return null;
    if (!selectedReservationExpertId) {
      window.alert('전문가 정보가 없습니다. 다시 시도해주세요.');
      return null;
    }

    const consultationType = selectedConsultType;
    const schedulesResponse = await expertService.getExpertSchedules(
      selectedReservationExpertId,
    );
    const schedules = Array.isArray(schedulesResponse.data) ? schedulesResponse.data : [];
    const matched = schedules.find(
      (schedule) => schedule.consultationType === consultationType,
    );
    if (!matched) {
      window.alert('상담 가격 정보를 찾을 수 없습니다. 다시 시도해주세요.');
      return null;
    }
    const price = matched.price;
    // 카테고리별 임시 예약 생성
    const category = categoryKey === 'fashion' ? 'FASHION' : 'HAIR';

    const response = await reservationService.createTempReservation({
      expertId: selectedReservationExpertId,
      category,
      consultationType,
      // MESSAGE는 scheduledDateTime을 null로 전송
      scheduledDateTime:
        consultationType === 'VIDEO' ? buildScheduledDateTime(date, timeId) : null,
      price,
    });

    return response.data.reservationId;
  };

  const formatScheduleLabel = (date: Date, timeId: string) => {
    const parsed = /^t-(\d{2})(\d{2})$/.exec(timeId);
    const hour24 = parsed ? Number(parsed[1]) : 0;
    const minute = parsed ? Number(parsed[2]) : 0;
    const isAM = hour24 < 12;
    const meridiem = isAM ? '오전' : '오후';
    let hour12 = hour24 % 12;
    if (hour12 === 0) hour12 = 12;
    const mm = String(minute).padStart(2, '0');
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}년 ${month}월 ${day}일 ${meridiem} ${hour12}:${mm}`;
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

  const parseMediaUrls = (value?: string | string[]) => {
    if (!value) {
      return [];
    }
    if (Array.isArray(value)) {
      return value.filter(Boolean);
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
        const reviewsData = Array.isArray(response.data) ? response.data : [];
        const mapped = reviewsData.map((review) => ({
          id: review.reviewId,
          name: '익명',
          expertName: review.expertNickname,
          rating: review.rating,
          date: formatDate(review.createdAt),
          content: review.content,
          category: getLabelFromApiCategory(review.category),
          concern: '후기',
          avatar: review.expertProfileImage,
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
      { id: 'fashion', label: '패션', route: '/category/fashion', underlineLeft: 153 },
      { id: 'makeup', label: '메이크업', route: '/category/makeup', underlineLeft: 249 },
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
  const renderStars = (rating: number) => {
    const filledCount = Math.max(0, Math.min(5, Math.round(rating)));
    return Array.from({ length: 5 }).map((_, index) => (
      <img
        key={`star-${rating}-${index}`}
        src={starIcon}
        alt=""
        className={`h-[18px] w-[18px] ${index < filledCount ? '' : 'opacity-40 grayscale'}`}
      />
    ));
  };
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
        <div className="sticky top-0 z-40 bg-white">
          <section className="pt-[4px]">
          <div className="flex items-center justify-between px-4 text-[16px] font-semibold">
            {categoryTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  if (tab.id === 'makeup' || tab.id === 'skin') {
                    navigate('/service-ready');
                    return;
                  }
                  if (tab.route) {
                    navigate(tab.route);
                  }
                }}
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
        </div>

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

        {/* <section className="mt-[16px] px-4">
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
        </section> */}

        {false && (
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
        )}

        <section className="mt-[32px] bg-[#f4f4f5]">
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
                className="relative h-[393px] w-[300px] shrink-0 overflow-hidden rounded-[8px] bg-white snap-start"
              >
                <div className="border-b border-[#f4f4f5] px-4 py-[14px]">
                  <div className="flex items-center gap-[10px]">
                    <div className="h-[36px] w-[36px] shrink-0 overflow-hidden rounded-full bg-[#f4f4f5]">
                      {review.avatar && (
                        <img src={review.avatar} alt="" className="h-full w-full object-cover" />
                      )}
                    </div>
                    <div className="flex flex-col gap-[4px]">
                      <div className="flex items-center gap-[2px]">
                        <span className="text-[14px] font-semibold text-[#0f0f10]">
                          {review.expertName ?? '상담사'}
                        </span>
                        <ChevronRight className="h-4 w-4 text-[#0f0f10]" />
                      </div>
                      <div className="flex items-center gap-[2px] text-[13px] text-[#989ba2]">
                        <img src={starIcon} alt="" className="h-[18px] w-[18px]" />
                        <span className="font-semibold">{review.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-4 pt-[16px]">
                  <div className="flex gap-[8px]">
                    {Array.from({ length: 2 }).map((_, index) => {
                      const image = review.images[index];
                      return (
                        <div
                          key={`${review.id}-image-${index}`}
                          className="h-[130px] w-[130px] overflow-hidden rounded-[4px] bg-[#e1e2e4]"
                        >
                          {image && (
                            <img src={image} alt="" className="h-full w-full object-cover" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-[16px] flex items-center gap-[12px] text-[13px] text-[#989ba2]">
                    <span className="font-semibold text-[#878a93]">{review.name}</span>
                    <span className="h-[14px] w-px bg-[#e1e2e4]" />
                    <div className="flex items-center gap-[2px]">{renderStars(review.rating)}</div>
                    <span className="h-[14px] w-px bg-[#e1e2e4]" />
                    <span>{review.date}</span>
                  </div>
                  <p className="mt-[8px] line-clamp-2 text-[13px] leading-[1.4] text-[#505158]">
                    {review.content}
                  </p>
                </div>
                <div className="mt-[8px] flex gap-[6px] px-4 pb-[16px]">
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

        {false && (
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
        )}

        <section id="expert-section" className="px-4 pt-[32px]">
          <div className="flex items-center justify-between">
            <h2 className="text-[18px] font-semibold text-[#0f0f10]">
              {categoryLabel} 전문가
            </h2>
            <button
              onClick={() => navigate(`/category/${categoryKey}/experts`)}
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
                className="w-full min-h-[251px] cursor-pointer rounded-[8px] bg-white px-[12px] py-[20px] shadow-[0px_2px_12px_0px_rgba(0,0,0,0.13)]"
              >
                <div className="flex flex-col gap-[14px]">
                  <div className="flex items-start justify-between gap-[8px]">
                    <div className="min-w-0 flex items-center gap-[9px]">
                      <div className="h-[42px] w-[42px] shrink-0 overflow-hidden rounded-full bg-[#e1e2e4]">
                        {expert.avatar && (
                          <img src={expert.avatar} alt="" className="h-full w-full object-cover" />
                        )}
                      </div>
                      <div className="min-w-0 flex flex-col gap-[6px] text-left">
                        <p className="text-[16px] font-semibold leading-[1.1] text-[#292a2d]">
                          {expert.name}
                        </p>
                        <p className="line-clamp-1 text-[13px] text-[#878a93]">
                          {expert.summary}
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-[6px] text-[13px] text-[#878a93]">
                      <div className="flex items-center gap-[2px]">
                        <img src={starIcon} alt="" className="h-[18px] w-[18px]" />
                        <span className="font-semibold text-[#505158]">{expert.rating}</span>
                      </div>
                      <span className="whitespace-nowrap">{expert.reviewCount}</span>
                    </div>
                  </div>
                  <div className="flex gap-[2px]" onClick={() => handleExpertProfile(expert.id)}>
                    {Array.from({ length: 3 }).map((_, index) => {
                      const image = expert.images[index];
                      return (
                      <div
                        key={`${expert.id}-review-${index}`}
                        className="relative h-[105px] w-[105px] overflow-hidden rounded-[4px] bg-[#e1e2e4]"
                      >
                        {image && <img src={image} alt="" className="h-full w-full object-cover" />}
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
                        <span className="absolute bottom-[27px] left-[10px] text-[12px] text-white">
                          {expert.reviewTags[index]}
                        </span>
                      </div>
                      );
                    })}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-[6px]">
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
                    <button
                      className="h-[36px] w-[95px] rounded-[4px] bg-[#171719] text-[14px] font-medium text-white"
                      onClick={(event) => {
                        event.stopPropagation();
                        // 선택한 전문가 ID 저장
                        setSelectedReservationExpertId(expert.id ?? null);
                        handleReservationSchedule();
                      }}
                    >
                      상담 예약
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <BottomNav />

      <ConsultationMethodSheet
        open={openTypeSheet}
        onClose={() => setOpenTypeSheet(false)}
        defaultValue={selectedConsultType}
        onNext={(selected) => {
          setSelectedConsultType(selected);
          sessionStorage.setItem('consult_type', selected);
          setOpenTypeSheet(false);
          setOpenCalendarSheet(true);
        }}
      />

      <DateTimeBottomSheet
        open={openCalendarSheet}
        onClose={() => setOpenCalendarSheet(false)}
        onNext={async ({ date, timeId }) => {
          sessionStorage.setItem('consult_schedule_label', formatScheduleLabel(date, timeId));
          setOpenCalendarSheet(false);
          // 패션 예약 임시 생성 후 reservationId 전달
          if (categoryKey === 'fashion' || categoryKey === 'hair') {
            const reservationId = await handleTempReservation(date, timeId);
            if (reservationId) {
              navigate(`${getReservationRoute()}?reservationId=${reservationId}`);
              return;
            }
          }
          navigate(getReservationRoute());
        }}
      />
    </div>
  );
};

export default CategoryLandingPage;
