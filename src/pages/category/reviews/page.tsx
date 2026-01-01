import { useNavigate } from 'react-router-dom';
import { ChevronLeft, MoreHorizontal } from 'lucide-react';
import starIcon from '../../../images/reviews/star.svg';

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

  const reviews: ReviewItem[] = [
    {
      id: 1,
      author: '박덕호',
      rating: 4.7,
      date: '2025.10.08',
      content:
        '머리가 악성곱슬이어서 너무 고민이었는데 옹민호 전문가님 만나고 광명 찾았어요~!!! 원래는 2주만 지나도 바로 곱슬곱슬해지는데 지금 한 달이 지나도 직모에요. ',
      tags: ['헤어', '메세지 상담', '탈모'],
      images: ['', '', ''],
    },
    {
      id: 2,
      author: '김민준',
      rating: 5.0,
      date: '2025.06.12',
      content:
        '자꾸 앞머리가 휘어서 고민이 많았는데 가영쌤 덕분에 멋있게 앞머리 내릴 수 있어서 너무 만족스러워요. 다음에도 방문해서 모류교정 받을게요!',
      tags: ['헤어', '메세지 상담', '모류교정'],
      images: ['', '', ''],
    },
  ];

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
      </main>
    </div>
  );
};

export default CategoryBestReviewsPage;
