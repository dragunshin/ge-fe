import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import starIcon from '../../../images/reviews/star.svg';
import { reviewService } from '../../../services/review.service';
import { expertService } from '../../../services/expert.service';
import {
  getApiCategoryFromRoute,
  getLabelFromApiCategory,
} from '../../../lib/utils/category';

type ReviewItem = {
  id: number;
  author: string;
  expertId?: number;
  expertName: string;
  expertProfileImage?: string;
  expertRatingAverage: number;
  rating: number;
  date: string;
  content: string;
  tags: string[];
  images: string[];
  createdAt: string;
};

const getDisplayName = (value?: string) => {
  if (typeof value !== 'string') {
    return '';
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : '';
};

const getReviewAuthorName = (review: {
  reviewerNickname?: string;
  memberNickname?: string;
  authorNickname?: string;
  nickname?: string;
}) => {
  return getDisplayName(
    review.reviewerNickname ??
      review.memberNickname ??
      review.authorNickname ??
      review.nickname,
  );
};

const CategoryBestReviewsPage = () => {
  const navigate = useNavigate();
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const apiCategory = getApiCategoryFromRoute(category);
  const expertIdParam = searchParams.get('expertId');
  const expertId = expertIdParam ? Number(expertIdParam) : undefined;
  const isExpertReview = Number.isFinite(expertId);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const isFetchingRef = useRef(false);
  const requestIdRef = useRef(0);

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

  useEffect(() => {
    setReviews([]);
    setPage(0);
    setHasMore(true);
  }, [apiCategory, expertId]);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!hasMore || isFetchingRef.current) {
        return;
      }
      if (page > 0) {
        setHasMore(false);
        return;
      }
      isFetchingRef.current = true;
      setIsLoading(true);
      const requestId = (requestIdRef.current += 1);
      try {
        const response = isExpertReview
          ? await reviewService.getExpertReviews(expertId as number, { page: 0, size: 10 })
          : await reviewService.getRecentReviews({
              category: apiCategory ?? undefined,
              page: 0,
              size: 10,
            });
        if (requestId !== requestIdRef.current) {
          return;
        }
        const mapped = (Array.isArray(response.data) ? response.data : [])
          .map((review) => {
            const authorSource = review as typeof review & {
              reviewerNickname?: string;
              memberNickname?: string;
              authorNickname?: string;
              nickname?: string;
            };
            const expertIdCandidate =
              (review as { expertId?: number; expertUserId?: number }).expertId ??
              (review as { expertId?: number; expertUserId?: number }).expertUserId;
            const expertName =
              getDisplayName(
                review.expertNickname ??
                  (review as { expertName?: string }).expertName ??
                  (review as { expertUserName?: string }).expertUserName,
              ) || '전문가';
            const expertProfileImage =
              review.expertProfileImage ??
              (review as { expertImage?: string }).expertImage ??
              (review as { profileImage?: string }).profileImage;
            return {
              id: review.reviewId,
              author: getReviewAuthorName(authorSource),
              expertId: typeof expertIdCandidate === 'number' ? expertIdCandidate : undefined,
              expertName,
              expertProfileImage,
              expertRatingAverage: review.expertRatingAverage ?? review.rating,
              rating: review.rating,
              date: formatDate(review.createdAt),
              content: review.content,
              tags: review.category ? [getLabelFromApiCategory(review.category)] : [],
              images: parseMediaUrls(review.mediaUrls),
              createdAt: review.createdAt,
            };
          })
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        const missingExpertIds = Array.from(
          new Set(
            mapped
              .filter((item) => item.expertId && (!item.expertName || !item.expertProfileImage))
              .map((item) => item.expertId as number),
          ),
        );
        if (missingExpertIds.length === 0) {
          setReviews(mapped);
          setHasMore(false);
          return;
        }
        try {
          const expertResponses = await Promise.all(
            missingExpertIds.map((id) => expertService.getExpertInfo(id)),
          );
          const expertMap = new Map(
            expertResponses
              .map((res) => res.data)
              .filter(Boolean)
              .map((expert) => [expert.expertId, expert]),
          );
          const patched = mapped.map((item) => {
            if (!item.expertId) return item;
            const expert = expertMap.get(item.expertId);
            if (!expert) return item;
            return {
              ...item,
              expertName: item.expertName || expert.nickname || '전문가',
              expertProfileImage: item.expertProfileImage || expert.profileImage,
              expertRatingAverage: item.expertRatingAverage || expert.ratingAverage || item.rating,
            };
          });
          setReviews(patched);
        } catch (error) {
          console.error('Failed to hydrate expert info:', error);
          setReviews(mapped);
        }
        setHasMore(false);
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      } finally {
        if (requestId === requestIdRef.current) {
          setIsLoading(false);
          isFetchingRef.current = false;
        }
      }
    };

    fetchReviews();

    return () => {
      isFetchingRef.current = false;
    };
  }, [apiCategory, page, hasMore]);

  useEffect(() => {
    if (!apiCategory) {
      return;
    }
    if (!sentinelRef.current) {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry?.isIntersecting && hasMore && !isLoading) {
          setPage((prev) => prev + 1);
        }
      },
      { rootMargin: '200px' },
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, isLoading]);

  return (
    <div className="flex h-full flex-col bg-white">
      <header className="app-header flex items-center gap-[6px] px-4 pt-[14px]">
        <button
          onClick={() => navigate(-1)}
          className="flex h-[24px] w-[24px] items-center justify-center"
        >
          <ChevronLeft className="h-6 w-6 text-[#0f0f10]" />
        </button>
        <h1 className="text-[20px] font-semibold text-black">후기 리스트</h1>
      </header>

      <main className="flex-1 overflow-y-auto pb-8 scrollbar-hide">
        <section className="px-4 pt-[24px]">
          {reviews.map((review, index) => (
            <div key={review.id}>
              <article className="relative flex w-full flex-col overflow-hidden rounded-[8px] bg-white">
                <div className="flex items-center justify-between border-b border-[#f4f4f5] px-4 py-[14px]">
                  <div className="flex items-center gap-[10px]">
                    <div className="h-[36px] w-[36px] shrink-0 overflow-hidden rounded-full bg-[#e1e2e4]">
                      {review.expertProfileImage && (
                        <img
                          src={review.expertProfileImage}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex flex-col gap-[4px]">
                      <button
                        type="button"
                        onClick={() => {
                          if (review.expertId) {
                            navigate(`/experts/${review.expertId}`);
                          }
                        }}
                        disabled={!review.expertId}
                        className="flex items-center gap-[2px] disabled:cursor-default"
                      >
                        <span className="text-[14px] font-semibold text-[#0f0f10]">
                          {review.expertName}
                        </span>
                        <ChevronRight className="h-4 w-4 text-[#0f0f10]" />
                      </button>
                      <div className="flex items-center gap-[4px] text-[13px] text-[#989ba2]">
                        <img src={starIcon} alt="" className="h-[18px] w-[18px]" />
                        <span>{review.expertRatingAverage.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-4 pt-[14px]">
                  <div className="flex gap-[8px]">
                    {review.images.slice(0, 2).map((image, imageIndex) => (
                      <div
                        key={`${review.id}-image-${imageIndex}`}
                        className="h-[130px] w-[130px] overflow-hidden rounded-[4px] bg-[#e1e2e4]"
                      >
                        <img src={image} alt="" className="h-full w-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="px-4 pt-3">
                  <div className="flex items-center gap-[12px] text-[13px] text-[#989ba2]">
                    {review.author ? (
                      <>
                        <span className="font-semibold text-[#878a93]">{review.author}</span>
                        <span className="h-[14px] w-px bg-[#e1e2e4]" />
                      </>
                    ) : null}
                    <div className="flex items-center gap-[2px]">{renderStars(review.rating)}</div>
                    <span className="h-[14px] w-px bg-[#e1e2e4]" />
                    <span>{review.date}</span>
                  </div>
                  <p className="mt-2 text-[13px] leading-[1.4] text-[#505158]">
                    {review.content}
                  </p>
                </div>

                <div className="mt-auto flex gap-[6px] px-4 pb-4 pt-2">
                  {review.tags.map((tag, tagIndex) => (
                    <span
                      key={`${review.id}-${tag}-${tagIndex}`}
                      className={
                        tagIndex === 0
                          ? 'rounded-[2px] bg-[#e5f4ff] px-[8px] py-[4px] text-[12px] text-[#008bff]'
                          : 'rounded-[2px] bg-[#f4f4f5] px-[8px] py-[4px] text-[12px] text-[#46474c]'
                      }
                    >
                      {tag}
                    </span>
                  ))}
                  {review.tags.length === 1 && (
                    <span className="rounded-[2px] bg-[#f4f4f5] px-[8px] py-[4px] text-[12px] text-[#46474c]">
                      후기
                    </span>
                  )}
                </div>
              </article>
              {index < reviews.length - 1 && (
                <div className="mt-[24px] h-[8px] w-full bg-[#f4f4f5]" />
              )}
            </div>
          ))}
        </section>
        <div ref={sentinelRef} className="h-10" />
      </main>
    </div>
  );
};

export default CategoryBestReviewsPage;
