import { useEffect, useMemo, useState } from 'react';
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
import heartIcon from '../../../images/mypage/heart.svg';
import { portfolioItems } from './portfolio-data';
import { expertService } from '../../../services/expert.service';
import { reviewService } from '../../../services/review.service';
import type { ExpertInfoResponse } from '../../../lib/api/types';
import {
  getLabelFromApiCategory,
  getRouteCategoryFromApi,
  type ApiCategory,
} from '../../../lib/utils/category';

type ReviewCard = {
  id: number;
  title: string;
  content: string;
  rating: number;
};

type RelatedExpert = {
  id: number;
  name: string;
  summary: string;
};

const ExpertInfoPage = () => {
  const navigate = useNavigate();
  const { expertId } = useParams();
  const expertIdNumber = useMemo(() => (expertId ? Number(expertId) : undefined), [expertId]);
  const portfolioPath = `/experts/${expertId ?? '1'}/portfolio`;
  const [expandedPortfolio, setExpandedPortfolio] = useState<
    Record<number, { concern: boolean; solution: boolean }>
  >({});
  const [expertInfo, setExpertInfo] = useState<ExpertInfoResponse | null>(null);
  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [reviewCards, setReviewCards] = useState<ReviewCard[]>([]);
  const [reviewAverage, setReviewAverage] = useState(0);

  const handleTogglePortfolio = (id: number, field: 'concern' | 'solution') => {
    setExpandedPortfolio((prev) => ({
      ...prev,
      [id]: {
        concern: prev[id]?.concern ?? false,
        solution: prev[id]?.solution ?? false,
        [field]: !(prev[id]?.[field] ?? false),
      },
    }));
  };

  const portfolioCards = portfolioItems;

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

    fetchExpertInfo();

    return () => {
      isActive = false;
    };
  }, [expertIdNumber]);

  useEffect(() => {
    if (!expertInfo?.category) {
      return;
    }

    let isActive = true;

    const fetchReviews = async () => {
      try {
        const response = await reviewService.getRecentReviews({
          category: expertInfo.category as ApiCategory,
          page: 0,
          size: 5,
        });
        if (!isActive) {
          return;
        }
        const nextCards = response.data.map((review, index) => ({
          id: review.reviewId,
          title: `후기 ${index + 1}`,
          content: review.content,
          rating: review.rating,
        }));
        setReviewCards(nextCards);
        const average =
          response.data.length === 0
            ? 0
            : response.data.reduce((sum, review) => sum + review.rating, 0) /
              response.data.length;
        setReviewAverage(Number(average.toFixed(1)));
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      }
    };

    fetchReviews();

    return () => {
      isActive = false;
    };
  }, [expertInfo?.category]);

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
      console.error('Failed to toggle like:', error);
    }
  };

  const categoryLabel = getLabelFromApiCategory(expertInfo?.category);
  const reviewCategoryRoute = getRouteCategoryFromApi(expertInfo?.category) ?? 'hair';

  return (
    <div className="flex h-full flex-col bg-white">
      <main className="relative flex-1 overflow-x-hidden overflow-y-auto pb-[120px] scrollbar-hide">
        <div className="relative mx-auto min-h-[2545px] w-full max-w-[375px] bg-white">
          <div className="absolute left-[16px] top-0 flex items-center gap-[15px] pt-[14px]">
            <button
              onClick={() => navigate(-1)}
              className="flex h-[24px] w-[24px] items-center justify-center"
            >
              <ChevronLeft className="h-[24px] w-[24px]" />
            </button>
            <h1 className="text-[20px] font-semibold text-[#0f0f10]">전문가 프로필</h1>
          </div>

          <div className="absolute left-0 top-[100px] h-[220px] w-[375px] bg-[#d2d4d8]" />

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
                <img src={heartIcon} alt="찜" className="h-[24px] w-[24px]" />
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

            <div className="absolute left-[16px] top-[380px] flex h-[40px] w-[342px] items-center justify-center gap-[4px] rounded-[8px] border border-[#f4f4f5]">
              <span className="text-[12px] font-medium text-[#666]">더보기</span>
              <ChevronDown className="h-[24px] w-[24px] text-[#666]" />
            </div>
          </div>

          <div className="absolute left-0 top-[771px] h-[8px] w-[375px] bg-[#f4f4f5]" />

          <div className="absolute left-0 top-[779px] h-[216px] w-[375px]">
            <div className="absolute left-[17px] top-[30px] flex w-[342px] items-center justify-between">
              <div className="flex items-center gap-[6px] text-[18px] font-semibold">
                <span className="text-[#0f0f10]">시술 후기</span>
                <span className="text-[#429ff0]">{reviewCards.length}</span>
              </div>
              <button
                className="flex items-center gap-[2px] text-[14px] text-[#70737c]"
                onClick={() => navigate(`/category/${reviewCategoryRoute}/reviews`)}
              >
                전체보기
                <ChevronRight className="h-[24px] w-[24px]" />
              </button>
            </div>
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
                  <div className="h-[57px] w-[57px] rounded-[4px] bg-[#e1e2e4]" />
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
          </div>

          <div className="absolute left-0 top-[1003px] h-[8px] w-[375px] bg-[#f4f4f5]" />

          <div className="absolute left-0 top-[1011px] h-[610px] w-[375px] bg-white">
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
            <div className="absolute left-[16px] top-[86px] flex w-[343px] gap-[12px] overflow-x-auto scrollbar-hide">
              {portfolioCards.map((card) => {
                const concernExpanded = expandedPortfolio[card.id]?.concern ?? false;
                const solutionExpanded = expandedPortfolio[card.id]?.solution ?? false;
                return (
                  <article
                    key={card.id}
                    className="h-[439px] w-[322px] shrink-0 rounded-[12px] border border-[#e1e2e4] bg-white p-[16px]"
                  >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[14px] font-semibold text-[#292a2d]">{card.title}</p>
                      <p className="mt-[4px] text-[13px] text-[#878a93]">Before / After</p>
                    </div>
                    <button className="rounded-full p-1 text-[#aeb0b6]">
                      <ChevronRight className="h-[20px] w-[20px]" />
                    </button>
                  </div>
                  <div className="mt-[12px] flex h-[164px] items-center gap-[8px]">
                    <div className="relative h-[164px] w-[167.5px] overflow-hidden rounded-[12px] bg-[#e1e2e4]">
                      <span className="absolute bottom-[8px] left-[8px] rounded-[4px] bg-black/40 px-[6px] py-[2px] text-[14px] text-white">
                        전
                      </span>
                    </div>
                    <div className="relative h-[164px] w-[167.5px] overflow-hidden rounded-[12px] bg-[#e1e2e4]">
                      <span className="absolute bottom-[8px] right-[8px] rounded-[4px] bg-black/40 px-[6px] py-[2px] text-[14px] text-white">
                        후
                      </span>
                    </div>
                  </div>
                  <div className="mt-[12px] flex flex-wrap gap-[6px]">
                    {card.tags.map((tag) => (
                      <span
                        key={`${card.id}-${tag}`}
                        className="rounded-[2px] bg-[#f4f4f5] px-[6px] py-[4px] text-[12px] text-[#46474c]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-[12px] space-y-[6px]">
                    <p className="text-[14px] font-semibold text-[#292a2d]">고객의 고민</p>
                    <div
                      className={`text-[13px] leading-[1.4] text-[#505158] ${
                        concernExpanded
                          ? 'max-h-[90px] overflow-y-auto scrollbar-hide'
                          : 'max-h-[36px] overflow-hidden'
                      }`}
                    >
                      {card.concern}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleTogglePortfolio(card.id, 'concern')}
                      className="text-left text-[13px] text-[#c2c4c8]"
                    >
                      {concernExpanded ? '접기' : '더보기'}
                    </button>
                  </div>
                  <div className="mt-[12px] space-y-[6px]">
                    <p className="text-[14px] font-semibold text-[#292a2d]">솔루션</p>
                    <div
                      className={`text-[13px] leading-[1.4] text-[#505158] ${
                        solutionExpanded
                          ? 'max-h-[90px] overflow-y-auto scrollbar-hide'
                          : 'max-h-[36px] overflow-hidden'
                      }`}
                    >
                      {card.solution}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleTogglePortfolio(card.id, 'solution')}
                      className="text-left text-[13px] text-[#c2c4c8]"
                    >
                      {solutionExpanded ? '접기' : '더보기'}
                    </button>
                  </div>
                </article>
              );
              })}
            </div>
            <div className="absolute left-1/2 top-[551px] h-[3px] w-[55px] -translate-x-1/2 bg-[#e1e2e4]">
              <div className="h-[3px] w-[18px] bg-[#429ff0]" />
            </div>
          </div>

          <div className="absolute left-0 top-[1621px] w-[375px]">
            <div className="h-[8px] w-full bg-[#f4f4f5]" />
            <div className="mx-auto mt-[40px] w-[343px] space-y-[12px]">
              <h2 className="text-[18px] font-semibold text-[#0f0f10]">가능한 상담 종류</h2>
              <div className="rounded-[12px] border border-[#e1e2e4] bg-white p-[16px]">
                <p className="text-[16px] font-semibold text-[#292a2d]">실시간 화상 상담</p>
                <p className="mt-[4px] text-[13px] leading-[1.4] text-[#878a93]">
                  전문가와 화상으로 15분 상담을 진행합니다. 상담한 내용을 바탕으로 전문가가 작성한 솔루션지는 상담이 끝나고 한 시간 내로 전송해드립니다.
                </p>
                <div className="my-[12px] h-px bg-[#e1e2e4]" />
                <div className="flex items-center justify-between text-[13px] text-[#878a93]">
                  <span>상담 비용</span>
                  <span className="text-[14px] font-semibold text-[#008bff]">10만원</span>
                </div>
              </div>
              <div className="rounded-[12px] border border-[#e1e2e4] bg-white p-[16px]">
                <p className="text-[16px] font-semibold text-[#292a2d]">메세지 상담</p>
                <p className="mt-[4px] text-[13px] leading-[1.4] text-[#878a93]">
                  상담 신청 시 진행되는 설문조사 답변을 바탕으로 전문가가 24시간 내로 솔루션지를 보내드립니다. 솔루션지를 읽고
                  생기는 추가 질문은 채팅을 통해 한 번 더 문의할 수 있습니다.
                </p>
                <div className="my-[12px] h-px bg-[#e1e2e4]" />
                <div className="flex items-center justify-between text-[13px] text-[#878a93]">
                  <span>상담 비용</span>
                  <span className="text-[14px] font-semibold text-[#008bff]">10만원</span>
                </div>
              </div>
            </div>
          </div>

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
                      <p className="text-[14px] font-semibold text-[#292a2d]">{expert.name}</p>
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
        </div>
      </main>

      <div className="app-footer bg-white px-[16px] py-[10px]">
        <button className="h-[44px] w-full rounded-[4px] bg-[#008bff] text-[16px] font-semibold text-white">
          상담 신청하기
        </button>
      </div>
    </div>
  );
};

export default ExpertInfoPage;
