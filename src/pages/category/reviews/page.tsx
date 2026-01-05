import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, MoreHorizontal } from 'lucide-react';
import starIcon from '../../../images/reviews/star.svg';
import { reviewService } from '../../../services/review.service';
import {
  getApiCategoryFromRoute,
  getLabelFromApiCategory,
} from '../../../lib/utils/category';
import BottomNav from '@/components/navigation/bottom-nav';

type ReviewItem = {
  id: number;
  author: string;
  rating: number;
  date: string;
  content: string;
  tags: string[];
  images: string[];
};

const CategoryBestReviewsPage = () => {
  const navigate = useNavigate();
  const { category } = useParams();
  const apiCategory = getApiCategoryFromRoute(category);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

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
    setReviews([]);
    setPage(0);
    setHasMore(true);
  }, [apiCategory]);

  useEffect(() => {
    let isActive = true;

    const fetchReviews = async () => {
      if (!hasMore || isLoading) {
        return;
      }
      setIsLoading(true);
      try {
        const response = await reviewService.getRecentReviews({
          category: apiCategory,
          page,
          size: 5,
        });
        if (!isActive) {
          return;
        }
        const mapped = response.data.map((review) => ({
          id: review.reviewId,
          author: '익명',
          rating: review.rating,
          date: formatDate(review.createdAt),
          content: review.content,
          tags: review.category
            ? [getLabelFromApiCategory(review.category)]
            : [],
          images: parseMediaUrls(review.mediaUrls),
        }));
        setReviews((prev) => (page === 0 ? mapped : [...prev, ...mapped]));
        setHasMore(mapped.length === 5);
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    fetchReviews();

    return () => {
      isActive = false;
    };
  }, [apiCategory, page, hasMore, isLoading]);

  useEffect(() => {
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
      <header className="flex items-center gap-[15px] px-4 pt-[14px]">
        <button
          onClick={() => navigate(-1)}
          className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-50"
        >
          <ChevronLeft className="h-6 w-6 text-[#0f0f10]" />
        </button>
        <h1 className="text-[20px] font-semibold text-[#0f0f10]">후기 리스트</h1>
      </header>

      <main className="flex-1 overflow-y-auto pb-8 scrollbar-hide">
        <section className="px-4 pt-4">
          <div className="rounded-[8px] bg-[#e5f4ff] px-4 py-[12px] text-[13px] text-[#505158]">
            가장 많은 조회수를 기록한 리뷰입니다.
          </div>
        </section>

        <section className="space-y-[24px] px-4 pt-[24px]">
          {reviews.map((review, index) => (
            <div key={review.id}>
              <article className="space-y-[8px]">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[14px] font-semibold text-[#878a93]">{review.author}</p>
                    <div className="mt-[4px] flex items-center gap-[12px] text-[13px] text-[#989ba2]">
                      <div className="flex items-center gap-[2px]">
                        {Array.from({ length: 5 }).map((_, starIndex) => (
                          <img
                            key={`star-${review.id}-${starIndex}`}
                            src={starIcon}
                            alt=""
                            className="h-[16px] w-[16px]"
                          />
                        ))}
                      </div>
                      <div className="h-[14px] w-px bg-[#e1e2e4]" />
                      <span>{review.date}</span>
                    </div>
                  </div>
                  <button className="rounded-full p-1 text-[#aeb0b6] hover:bg-gray-50">
                    <MoreHorizontal className="h-6 w-6 rotate-90" />
                  </button>
                </div>

                <div className="flex gap-[6px]">
                  {review.images.map((image, imageIndex) => (
                    <div
                      key={`${review.id}-image-${imageIndex}`}
                      className="h-[130px] w-[130px] overflow-hidden rounded-[4px] bg-[#e1e2e4]"
                    >
                      {image && (
                        <img src={image} alt="" className="h-full w-full object-cover" />
                      )}
                    </div>
                  ))}
                </div>

                <p className="text-[14px] leading-[1.5] text-[#505158]">
                  {review.content}
                </p>

                <div className="flex flex-wrap gap-[8px]">
                  {review.tags.map((tag) => (
                    <span
                      key={`${review.id}-${tag}`}
                      className={
                        tag === '헤어'
                          ? 'rounded-[2px] bg-[#e5f4ff] px-[8px] py-[4px] text-[12px] text-[#008bff]'
                          : 'rounded-[2px] bg-[#f4f4f5] px-[8px] py-[4px] text-[12px] text-[#46474c]'
                      }
                    >
                      {tag}
                    </span>
                  ))}
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
      <BottomNav />
    </div>
  );
};

export default CategoryBestReviewsPage;
