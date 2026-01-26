import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ChevronLeft, MoreHorizontal } from 'lucide-react';
import starIcon from '../../../images/reviews/star.svg';
import { reviewService } from '../../../services/review.service';
import {
  getApiCategoryFromRoute,
  getLabelFromApiCategory,
} from '../../../lib/utils/category';

type ReviewItem = {
  id: number;
  author: string;
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
  memberNickname?: string;
  authorNickname?: string;
  nickname?: string;
}) => {
  return getDisplayName(
    review.memberNickname ?? review.authorNickname ?? review.nickname,
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
        className={`h-[16px] w-[16px] ${index < filledCount ? '' : 'opacity-30 grayscale'}`}
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
          : apiCategory
            ? await reviewService.getBestReviews({ category: apiCategory })
            : await reviewService.getBestReviews();
        if (requestId !== requestIdRef.current) {
          return;
        }
        const mapped = (Array.isArray(response.data) ? response.data : [])
          .map((review) => {
            const authorSource = review as typeof review & {
              memberNickname?: string;
              authorNickname?: string;
              nickname?: string;
            };
            return {
              id: review.reviewId,
              author: getReviewAuthorName(authorSource),
              expertName: getDisplayName(review.expertNickname) || '전문가',
              expertProfileImage: review.expertProfileImage,
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
        setReviews(mapped);
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
              <article className="flex flex-col gap-[8px]">
                <div className="flex items-center gap-[3px]">
                  <div className="flex flex-1 flex-col gap-[3px]">
                    <span className="min-h-[20px] text-[14px] font-semibold text-[#878a93]">
                      {review.author}
                    </span>
                    <div className="flex items-center gap-[12px] text-[13px] text-[#989ba2]">
                      <div className="flex items-center gap-px">{renderStars(review.rating)}</div>
                      <div className="h-[14px] w-px bg-[#e1e2e4]" />
                      <span>{review.date}</span>
                    </div>
                  </div>
                  <button className="p-1 text-[#171719]">
                    <MoreHorizontal className="h-6 w-6 rotate-90" />
                  </button>
                </div>
                <div className="flex gap-[6px]">
                  {Array.from({ length: 3 }).map((_, imageIndex) => {
                    const image = review.images[imageIndex];
                    return (
                      <div
                        key={`${review.id}-image-${imageIndex}`}
                        className="h-[130px] w-[130px] overflow-hidden rounded-[4px] bg-[#e1e2e4]"
                      >
                        {image && (
                          <img src={image} alt="" className="h-full w-full object-cover" />
                        )}
                      </div>
                    );
                  })}
                </div>
                <p className="text-[14px] leading-[1.5] text-[#505158]">
                  {review.content}
                </p>
                <div className="flex flex-wrap gap-[8px]">
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
