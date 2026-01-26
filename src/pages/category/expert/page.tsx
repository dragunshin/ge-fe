import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Instagram,
  Star,
} from 'lucide-react';
import type { AxiosError } from 'axios';
import heartIcon from '../../../images/mypage/heart.svg';
import redHeartIcon from '../../../images/redHeart.svg';
import { portfolioItems, type PortfolioItem } from './portfolio-data';
import { expertService } from '../../../services/expert.service';
import { reviewService } from '../../../services/review.service';
import { reservationService } from '../../../services/reservation.service';
import ConsultationMethodSheet from '../../resevationFlow/reservationSheet/typeReservation';
import DateTimeBottomSheet from '../../resevationFlow/reservationSheet/calendar';
import { useAuthStore } from '../../../stores/useAuthStore';
import type {
  ExpertInfoResponse,
  ExpertPortfolioResponse,
  ExpertScheduleResponse,
} from '../../../lib/api/types';
import {
  getLabelFromApiCategory,
  getRouteCategoryFromApi,
} from '../../../lib/utils/category';

type ReviewCard = {
  id: number;
  title: string;
  content: string;
  rating: number;
  imageUrl?: string;
};

type RelatedExpert = {
  id: number;
  name: string;
  summary: string;
};

type ConsultType = 'MESSAGE' | 'VIDEO';

const mapPortfolioResponse = (portfolio: ExpertPortfolioResponse): PortfolioItem => ({
  id: portfolio.id,
  title: portfolio.title,
  tags: portfolio.hashtags ?? [],
  concern: portfolio.concern,
  solution: portfolio.solution,
  beforeImage: portfolio.beforeImage,
  afterImage: portfolio.afterImage,
});

const ExpertInfoPage = () => {
  const navigate = useNavigate();
  const { expertId } = useParams();
  const expertIdNumber = useMemo(() => (expertId ? Number(expertId) : undefined), [expertId]);
  const portfolioPath = `/experts/${expertId ?? '1'}/portfolio`;
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const [expertInfo, setExpertInfo] = useState<ExpertInfoResponse | null>(null);
  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [reviewCards, setReviewCards] = useState<ReviewCard[]>([]);
  const [reviewAverage, setReviewAverage] = useState(0);
  const [expertSchedules, setExpertSchedules] = useState<ExpertScheduleResponse[]>([]);
  const [portfolioCards, setPortfolioCards] = useState<PortfolioItem[]>([]);
  const [portfolioPage, setPortfolioPage] = useState(0);
  const [portfolioHasMore, setPortfolioHasMore] = useState(true);
  const [portfolioLoading, setPortfolioLoading] = useState(false);
  const portfolioListRef = useRef<HTMLDivElement | null>(null);
  const portfolioSentinelRef = useRef<HTMLDivElement | null>(null);
  const portfolioFetchingRef = useRef(false);
  const [openTypeSheet, setOpenTypeSheet] = useState(false);
  const [openCalendarSheet, setOpenCalendarSheet] = useState(false);
  const [selectedConsultType, setSelectedConsultType] = useState<ConsultType>('MESSAGE');

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
    initializeAuth();
  }, [initializeAuth]);

  const relatedExperts: RelatedExpert[] = [
    {
      id: 1,
      name: '이민지 전문가',
      summary:
        '누구보다 나다울 수 있도록 스타일에 당신의 온도를 담아드립니다. 자연스럽지만 분명히 특별한 당신만의 분위기를 만들어드릴게요',
    },
    {
      id: 2,
      name: '지규영 전문가',
      summary: '어울리는 머리가 뭔지 몰라서 고민이신 분들! 제가 인생머리 찾아드릴게요',
    },
    {
      id: 3,
      name: '김병철 전문가',
      summary:
        '짧은 머리부터 긴머리까지 남자머리의 정석, 오래 유지되는 디자인으로 얼굴형에 어울리는 맞춤형으로 디자인 해드리겠습니다.',
    },
  ];

  useEffect(() => {
    if (!expertIdNumber) {
      return;
    }

    setPortfolioCards([]);
    setPortfolioPage(0);
    setPortfolioHasMore(true);

    let isActive = true;

    const fetchExpertInfo = async () => {
      try {
        const response = await expertService.getExpertInfo(expertIdNumber);
        if (!isActive) {
          return;
        }
        setExpertInfo(response.data);
        setLikesCount(response.data.likes ?? 0);
      } catch (error) {
        console.error('Failed to fetch expert info:', error);
      }
    };

    const fetchLikeStatus = async () => {
      try {
        const response = await expertService.getLikedExperts({ page: 0, size: 100 });
        if (!isActive) {
          return;
        }
        const matched = response.data.some((expert) => expert.expertId === expertIdNumber);
        setIsLiked(matched);
      } catch (error) {
        console.error('Failed to fetch liked experts:', error);
      }
    };

    const fetchExpertSchedules = async () => {
      try {
        const response = await expertService.getExpertSchedules(expertIdNumber);
        if (!isActive) {
          return;
        }
        setExpertSchedules(response.data ?? []);
      } catch (error) {
        console.error('Failed to fetch expert schedules:', error);
      }
    };

    fetchExpertInfo();
    fetchLikeStatus();
    fetchExpertSchedules();

    return () => {
      isActive = false;
    };
  }, [expertIdNumber]);

  useEffect(() => {
    if (!expertIdNumber || !portfolioHasMore || portfolioFetchingRef.current) {
      return;
    }

    let isActive = true;
    const fetchExpertPortfolios = async () => {
      try {
        portfolioFetchingRef.current = true;
        setPortfolioLoading(true);
        const response = await expertService.getExpertPortfolios(expertIdNumber, {
          page: portfolioPage,
          size: 3,
        });
        if (!isActive) {
          return;
        }
        const mapped = response.data.map(mapPortfolioResponse);
        setPortfolioCards((prev) => (portfolioPage === 0 ? mapped : [...prev, ...mapped]));
        setPortfolioHasMore(mapped.length === 3);
      } catch (error) {
        console.error('Failed to fetch expert portfolios:', error);
        if (!isActive) {
          return;
        }
        if (portfolioPage === 0) {
          setPortfolioCards(portfolioItems);
        }
        setPortfolioHasMore(false);
      } finally {
        if (isActive) {
          setPortfolioLoading(false);
          portfolioFetchingRef.current = false;
        }
      }
    };

    fetchExpertPortfolios();

    return () => {
      isActive = false;
    };
  }, [expertIdNumber, portfolioHasMore, portfolioPage]);

  useEffect(() => {
    const container = portfolioListRef.current;
    const sentinel = portfolioSentinelRef.current;
    if (!container || !sentinel || !portfolioHasMore) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry?.isIntersecting && !portfolioLoading && portfolioHasMore) {
          setPortfolioPage((prev) => prev + 1);
        }
      },
      { root: container, rootMargin: '100px' },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [portfolioHasMore, portfolioLoading]);

  useEffect(() => {
    if (!expertIdNumber) {
      return;
    }

    let isActive = true;

    const fetchReviews = async () => {
      try {
        const response = await reviewService.getExpertReviews(expertIdNumber, {
          page: 0,
          size: 5,
        });
        if (!isActive) {
          return;
        }
        const reviewsData = Array.isArray(response.data) ? response.data : [];
        const nextCards = reviewsData.map((review, index) => ({
          id: review.reviewId,
          title: `후기 ${index + 1}`,
          content: review.content,
          rating: review.rating,
          imageUrl: parseMediaUrls(review.mediaUrls)[0],
        }));
        setReviewCards(nextCards);
        const average =
          reviewsData.length === 0
            ? 0
            : reviewsData.reduce((sum, review) => sum + review.rating, 0) /
              reviewsData.length;
        setReviewAverage(Number(average.toFixed(1)));
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      }
    };

    fetchReviews();

    return () => {
      isActive = false;
    };
  }, [expertIdNumber]);

  const handleToggleLike = async () => {
    if (!expertIdNumber) {
      return;
    }
    try {
      if (isLiked) {
        await expertService.unlikeExpert(expertIdNumber);
        setLikesCount((prev) => Math.max(0, prev - 1));
        setIsLiked(false);
        return;
      }
      await expertService.likeExpert(expertIdNumber);
      setLikesCount((prev) => prev + 1);
      setIsLiked(true);
    } catch (error) {
      const status = (error as AxiosError)?.response?.status;
      if (status === 409) {
        try {
          const [likedResponse, infoResponse] = await Promise.all([
            expertService.getLikedExperts({ page: 0, size: 100 }),
            expertService.getExpertInfo(expertIdNumber),
          ]);
          const matched = likedResponse.data.some(
            (expert) => expert.expertId === expertIdNumber,
          );
          setIsLiked(matched);
          setLikesCount(infoResponse.data.likes ?? 0);
        } catch (innerError) {
          console.error('Failed to refresh like status:', innerError);
        }
        return;
      }
      console.error('Failed to toggle like:', error);
    }
  };

  const categoryLabel = getLabelFromApiCategory(expertInfo?.category);
  const reviewCategoryRoute = getRouteCategoryFromApi(expertInfo?.category) ?? 'hair';
  const reviewListRoute = expertIdNumber
    ? `/reviews?expertId=${expertIdNumber}`
    : `/category/${reviewCategoryRoute}/reviews`;
  const activeSchedules = expertSchedules.filter((schedule) => schedule.isActive);
  const orderedSchedules = (["VIDEO", "MESSAGE"] as const)
    .map((type) => activeSchedules.find((schedule) => schedule.consultationType === type))
    .filter((schedule): schedule is ExpertScheduleResponse => Boolean(schedule));
  const hasReviews = reviewCards.length > 0;
  const reviewSectionHeight = hasReviews ? 216 : 72;
  const reviewSectionOffset = hasReviews ? 0 : -(216 - reviewSectionHeight);
  const hasPortfolios = portfolioCards.length > 0;
  const portfolioSectionHeight = hasPortfolios ? 610 : 72;
  const portfolioSectionOffset = hasPortfolios ? 0 : -(610 - portfolioSectionHeight);
  const layoutTops = {
    reviewDivider: 771,
    reviewSection: 779,
    portfolioDivider: 1003 + reviewSectionOffset,
    portfolioSection: 1011 + reviewSectionOffset,
    consultationSection: 1621 + reviewSectionOffset + portfolioSectionOffset,
  };
  const consultationCopy = {
    VIDEO: {
      title: '실시간 화상 상담',
      description:
        '전문가와 화상으로 30분 상담을 진행합니다. 상담한 내용을 바탕으로 전문가가 작성한 솔루션지는 상담이 끝나고 24시간 내로 전송해드립니다.',
    },
    MESSAGE: {
      title: '메세지 상담',
      description:
        '상담 신청 시 작성한 고민 설문지를 토대로 전문가가 24시간 내에 솔루션지를 전송해드립니다. 솔루션지를 읽고 생기는 추가 질문은 채팅을 통해 일주일 동안 질문할 수 있습니다.',
    },
  } as const;
  const formatPrice = (value: number) => `${value.toLocaleString('ko-KR')}원`;

  const getReservationRoute = () => {
    const routeKey = getRouteCategoryFromApi(expertInfo?.category);
    if (routeKey === 'fashion') {
      return '/reservation/fashion';
    }
    if (routeKey !== 'hair') {
      return '/service-ready';
    }
    return '/hair/setup';
  };

  const buildScheduledDateTime = (date: Date, timeId: string) => {
    const parsed = /^t-(\d{2})(\d{2})$/.exec(timeId);
    const hour24 = parsed ? Number(parsed[1]) : 0;
    const minute = parsed ? Number(parsed[2]) : 0;
    const value = new Date(date);
    value.setHours(hour24, minute, 0, 0);
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const day = String(value.getDate()).padStart(2, '0');
    const hour = String(value.getHours()).padStart(2, '0');
    const minuteStr = String(value.getMinutes()).padStart(2, '0');
    const second = String(value.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day}T${hour}:${minuteStr}:${second}`;
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

  const handleReservationStart = () => {
    if (!isAuthenticated) {
      navigate('/auth/login');
      return;
    }
    setOpenTypeSheet(true);
  };

  const handleTempReservation = async (date: Date, timeId: string) => {
    if (!expertIdNumber || !expertInfo?.category) {
      window.alert('전문가 정보가 없습니다. 다시 시도해주세요.');
      return null;
    }
    const consultationType = selectedConsultType;
    const matched = expertSchedules.find(
      (schedule) => schedule.consultationType === consultationType,
    );
    if (!matched) {
      window.alert('상담 가격 정보를 찾을 수 없습니다. 다시 시도해주세요.');
      return null;
    }
    const price = matched.price;
    sessionStorage.setItem('consult_expert_name', expertInfo.nickname ?? '전문가');
    sessionStorage.setItem('consult_category_label', categoryLabel);
    sessionStorage.setItem('consult_price', String(price));
    sessionStorage.setItem('consult_expert_id', String(expertIdNumber));

    const response = await reservationService.createTempReservation({
      expertId: expertIdNumber,
      category: expertInfo.category as 'HAIR' | 'FASHION' | 'SKIN' | 'MAKEUP',
      consultationType,
      scheduledDateTime:
        consultationType === 'VIDEO' ? buildScheduledDateTime(date, timeId) : null,
      price,
    });
    sessionStorage.setItem('consult_reservation_id', String(response.data.reservationId));
    return response.data.reservationId;
  };

  return (
    <div className="flex h-full flex-col bg-white">
      <main className="relative flex-1 overflow-x-hidden overflow-y-auto pb-[120px] scrollbar-hide">
        <div className="relative mx-auto min-h-[2050px] w-full max-w-[375px] bg-white">
          <div className="absolute left-[16px] top-0 flex items-center gap-[15px] pt-[14px]">
            <button
              onClick={() => navigate(-1)}
              className="flex h-[24px] w-[24px] items-center justify-center"
            >
              <ChevronLeft className="h-[24px] w-[24px]" />
            </button>
            <h1 className="text-[20px] font-semibold text-[#0f0f10]">전문가 프로필</h1>
          </div>

          <div className="absolute left-0 top-[100px] h-[220px] w-[375px] overflow-hidden bg-[#d2d4d8]">
            {expertInfo?.backgroundImage && (
              <img
                src={expertInfo.backgroundImage}
                alt=""
                className="h-full w-full object-cover"
              />
            )}
          </div>

          <div className="absolute left-0 top-[311px] h-[460px] w-[375px]">
            <div className="absolute left-[16px] top-[40px] flex w-[342px] items-end justify-between">
              <div className="flex items-end gap-[12px]">
                <div className="h-[52px] w-[52px] overflow-hidden rounded-full bg-[#e1e2e4]">
                  {expertInfo?.profileImage && (
                    <img
                      src={expertInfo.profileImage}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="flex flex-col gap-[4px]">
                  <span className="inline-flex rounded-[2px] bg-[#f5f9fd] px-[6px] py-[4px] text-[12px] text-[#429ff0]">
                    {categoryLabel || '카테고리'}
                  </span>
                  <span className="text-[18px] font-semibold text-[#292a2d]">
                    {expertInfo?.nickname ?? '전문가'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleToggleLike}
                className="flex flex-col items-center gap-[2px]"
              >
                <img
                  src={isLiked ? redHeartIcon : heartIcon}
                  alt="찜"
                  className="h-[24px] w-[24px]"
                />
                <span className="text-[13px] text-[#878a93]">{likesCount}</span>
              </button>
            </div>

            <div className="absolute left-[16px] top-[114px] h-px w-[343px] bg-[#f4f4f5]" />

            <div className="absolute left-[16px] top-[134px] flex w-[338px] flex-col gap-[14px]">
              <div className="flex items-start gap-[8px]">
                <CheckCircle2 className="h-[24px] w-[24px] text-[#008bff]" />
                <div className="flex flex-col gap-[6px]">
                  <p className="text-[16px] font-semibold text-[#292a2d]">전문분야</p>
                  <p className="text-[13px] leading-[1.4] text-[#878a93]">
                    {expertInfo?.introduction ?? '전문가 소개가 준비 중입니다.'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-[8px]">
                <Instagram className="h-[24px] w-[24px] text-[#292a2d]" />
                {expertInfo?.profileLink ? (
                  <a
                    href={expertInfo.profileLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[14px] text-[#429ff0]"
                  >
                    {expertInfo.profileLink}
                  </a>
                ) : (
                  <span className="text-[14px] text-[#429ff0]">링크 준비 중</span>
                )}
              </div>
              <div className="flex items-start gap-[8px]">
                <ClipboardList className="h-[24px] w-[24px] text-[#292a2d]" />
                <div className="flex flex-col gap-[6px]">
                  <p className="text-[16px] font-semibold text-[#292a2d]">경력 정보</p>
                  <div className="text-[14px] leading-[1.4] text-[#878a93]">
                    {(expertInfo?.careerInfo ? expertInfo.careerInfo.split('\n') : ['경력 정보가 준비 중입니다.']).map(
                      (line, index) => (
                        <p key={`${line}-${index}`}>{line}</p>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </div>


          </div>

          <>
            <div
              className="absolute left-0 h-[8px] w-[375px] bg-[#f4f4f5]"
              style={{ top: layoutTops.reviewDivider }}
            />
            <div
              className="absolute left-0 w-[375px]"
              style={{ top: layoutTops.reviewSection, height: reviewSectionHeight }}
            >
              <div className="absolute left-[17px] top-[30px] flex w-[342px] items-center justify-between">
                <div className="flex items-center gap-[6px] text-[18px] font-semibold">
                  <span className="text-[#0f0f10]">시술 후기</span>
                  <span className="text-[#429ff0]">{reviewCards.length}</span>
                </div>
                <button
                  className="flex items-center gap-[2px] text-[14px] text-[#70737c]"
                  onClick={() => navigate(reviewListRoute)}
                >
                  전체보기
                  <ChevronRight className="h-[24px] w-[24px]" />
                </button>
              </div>
              {hasReviews && (
                <>
                  <div className="absolute left-[16px] top-[60px] flex items-center gap-[8px]">
                    <Star className="h-[24px] w-[24px] text-[#ffb800]" />
                    <span className="text-[14px] font-semibold text-[#292a2d]">
                      {reviewAverage || 0}
                    </span>
                  </div>
                  <div className="absolute left-[16px] top-[100px] flex w-[335px] gap-[12px] overflow-x-auto scrollbar-hide">
                    {reviewCards.map((review) => (
                      <article
                        key={review.id}
                        className="flex h-[87px] w-[240px] shrink-0 items-center gap-[10px] rounded-[8px] border border-[#e1e2e4] bg-white p-[12px]"
                      >
                        <div className="h-[57px] w-[57px] overflow-hidden rounded-[4px] bg-[#e1e2e4]">
                          {review.imageUrl && (
                            <img
                              src={review.imageUrl}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>
                        <div className="flex flex-1 flex-col gap-[4px]">
                          <div className="flex items-center gap-[6px]">
                            <span className="rounded-[4px] bg-[#f5f9fd] px-[8px] py-[2px] text-[12px] text-[#429ff0]">
                              Best
                            </span>
                            <span className="text-[14px] font-medium text-[#46474c]">
                              {review.title}
                            </span>
                          </div>
                          <p className="line-clamp-2 text-[13px] leading-[1.3] text-[#878a93]">
                            {review.content}
                          </p>
                        </div>
                      </article>
                    ))}
                  </div>
                </>
              )}
            </div>
          </>

          <div
            className="absolute left-0 h-[8px] w-[375px] bg-[#f4f4f5]"
            style={{ top: layoutTops.portfolioDivider }}
          />

          <div
            className="absolute left-0 w-[375px] bg-white"
            style={{ top: layoutTops.portfolioSection, height: portfolioSectionHeight }}
          >
            <div className="absolute left-[15px] top-[40px] flex w-[343px] items-center justify-between">
              <h2 className="text-[18px] font-semibold text-[#0f0f10]">포트폴리오</h2>
              <button
                onClick={() => navigate(portfolioPath)}
                className="flex items-center gap-[2px] text-[14px] text-[#70737c]"
              >
                전체보기
                <ChevronRight className="h-[24px] w-[24px]" />
              </button>
            </div>
            {hasPortfolios && (
              <>
                <div
                  ref={portfolioListRef}
                  className="absolute left-[16px] top-[86px] flex w-[343px] gap-[12px] overflow-x-auto scrollbar-hide"
                >
                  {portfolioCards.map((card) => (
                    <article
                      key={card.id}
                      className="h-[439px] w-[322px] shrink-0 rounded-[12px] border border-[#e1e2e4] bg-white p-[20px]"
                    >
                      <p className="text-[16px] font-semibold leading-[1.4] text-[#292a2d]">
                        {card.title}
                      </p>
                      <div className="mt-[12px] flex gap-[8px]">
                        <div className="relative h-[130px] w-[130px] overflow-hidden rounded-[12px] bg-[#e1e2e4]">
                          {card.beforeImage && (
                            <img
                              src={card.beforeImage}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          )}
                          <span className="absolute bottom-[8px] left-[8px] rounded-[4px] bg-black/40 px-[6px] py-[2px] text-[14px] text-white">
                            전
                          </span>
                        </div>
                        <div className="relative h-[130px] w-[130px] overflow-hidden rounded-[12px] bg-[#e1e2e4]">
                          {card.afterImage && (
                            <img
                              src={card.afterImage}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          )}
                          <span className="absolute bottom-[8px] right-[8px] rounded-[4px] bg-black/40 px-[6px] py-[2px] text-[14px] text-white">
                            후
                          </span>
                        </div>
                      </div>
                      <div className="mt-[17px] flex gap-[8px] overflow-hidden">
                        {card.tags.map((tag, index) => (
                          <span
                            key={`${card.id}-${tag}-${index}`}
                            className="rounded-[2px] bg-[#f4f4f5] px-[6px] py-[4px] text-[12px] text-[#46474c]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="mt-[16px] space-y-[6px]">
                        <p className="text-[14px] font-semibold text-[#292a2d]">고객의 고민</p>
                        <p className="line-clamp-3 text-[13px] leading-[1.4] text-[#505158]">
                          {card.concern}
                        </p>
                      </div>
                      <div className="mt-[16px] space-y-[6px]">
                        <p className="text-[14px] font-semibold text-[#292a2d]">솔루션</p>
                        <p className="line-clamp-3 text-[13px] leading-[1.4] text-[#505158]">
                          {card.solution}
                        </p>
                      </div>
                    </article>
                  ))}
                  {portfolioHasMore && (
                    <div
                      ref={portfolioSentinelRef}
                      className="h-[1px] w-[1px] shrink-0"
                    />
                  )}
                </div>
                <div className="absolute left-1/2 top-[551px] h-[3px] w-[55px] -translate-x-1/2 bg-[#e1e2e4]">
                  <div className="h-[3px] w-[18px] bg-[#429ff0]" />
                </div>
              </>
            )}
          </div>

          <div className="absolute left-0 w-[375px]" style={{ top: layoutTops.consultationSection }}>
            <div className="h-[8px] w-full bg-[#f4f4f5]" />
            <div className="mx-auto mt-[40px] w-[343px] space-y-[12px]">
              <h2 className="text-[18px] font-semibold text-[#0f0f10]">가능한 상담 종류</h2>
              {orderedSchedules.length === 0 ? (
                <div className="rounded-[12px] border border-dashed border-[#e1e2e4] bg-[#fafafa] px-[16px] py-[20px] text-center text-[14px] font-medium text-[#878a93]">
                  전문가 상담 준비중
                </div>
              ) : (
                orderedSchedules.map((schedule) => {
                const copy = consultationCopy[schedule.consultationType];
                return (
                  <div
                    key={schedule.consultationType}
                    className="rounded-[12px] border border-[#e1e2e4] bg-white p-[16px]"
                  >
                    <p className="text-[16px] font-semibold text-[#292a2d]">{copy.title}</p>
                    <p className="mt-[4px] text-[13px] leading-[1.4] text-[#878a93]">
                      {copy.description}
                    </p>
                    <div className="my-[12px] h-px bg-[#e1e2e4]" />
                    <div className="flex items-center justify-between text-[13px] text-[#878a93]">
                      <span>상담 비용</span>
                      <span className="text-[14px] font-semibold text-[#008bff]">
                        {formatPrice(schedule.price)}
                      </span>
                    </div>
                  </div>
                );
              })
              )}
            </div>
          </div>

          {false && (
            <div className="absolute left-0 top-[2074px] w-[375px]">
              <div className="h-[8px] w-full bg-[#f4f4f5]" />
              <div className="mx-auto mt-[24px] flex w-[343px] items-center justify-between">
                <div className="flex items-center gap-[6px] text-[18px] font-semibold">
                  <span className="text-[#0f0f10]">Q&amp;A</span>
                  <span className="text-[#429ff0]">8</span>
                </div>
                <ChevronDown className="h-[24px] w-[24px] text-[#70737c]" />
              </div>
            </div>
          )}

          {false && (
            <>
              <div className="absolute left-0 top-[2154px] w-[375px]">
                <div className="h-[8px] w-full bg-[#f4f4f5]" />
                <div className="mx-auto mt-[40px] w-[343px]">
                  <h2 className="text-[18px] font-semibold text-[#0f0f10]">
                    이런 <span className="text-[#008bff]">헤어</span> 전문가는 어떠세요?
                  </h2>
                  <div className="mt-[12px] flex w-[343px] gap-[12px] overflow-x-auto scrollbar-hide">
                    {relatedExperts.map((expert) => (
                      <article
                        key={expert.id}
                        className="h-[163px] w-[156px] shrink-0 rounded-[12px] border border-[#e1e2e4] bg-white"
                      >
                        <div className="mx-auto mt-[16px] h-[52px] w-[52px] rounded-full bg-[#e1e2e4]" />
                        <div className="mt-[12px] px-[16px] text-center">
                          <p className="text-[14px] font-semibold text-[#292a2d]">
                            {expert.name}
                          </p>
                          <p className="mt-[6px] h-[36px] w-[124px] line-clamp-2 text-[13px] leading-[1.4] text-[#878a93]">
                            {expert.summary}
                          </p>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </div>

              <div className="absolute left-1/2 top-[2414px] h-[3px] w-[55px] -translate-x-1/2 bg-[#e1e2e4]">
                <div className="h-[3px] w-[18px] bg-[#429ff0]" />
              </div>
            </>
          )}
        </div>
      </main>

      <div className="app-footer bg-white px-[16px] py-[10px]">
        <button
          onClick={handleReservationStart}
          className="h-[44px] w-full rounded-[4px] bg-[#008bff] text-[16px] font-semibold text-white"
        >
          상담 신청하기
        </button>
      </div>

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
          const reservationId = await handleTempReservation(date, timeId);
          if (reservationId) {
            navigate(`${getReservationRoute()}?reservationId=${reservationId}`);
            return;
          }
          navigate(getReservationRoute());
        }}
      />
    </div>
  );
};

export default ExpertInfoPage;
