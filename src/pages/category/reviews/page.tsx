import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
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

  const [firstReview, secondReview] = reviews;

  return (
    <div className="flex h-full flex-col bg-white">
      <header className="flex items-center gap-[15px] px-4 pt-[14px]">
        <button
          onClick={() => navigate(-1)}
          className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-50"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <h1 className="text-[20px] font-semibold text-[#0f0f10]">베스트 후기</h1>
      </header>

      <main className="flex-1 overflow-y-auto pb-8 scrollbar-hide">
        <section className="px-4 pt-4">
          <div className="rounded-[8px] bg-[#e5f4ff] px-4 py-3 text-[13px] text-[#505158]">
            가장 많은 조회수를 기록한 리뷰입니다.
          </div>
        </section>

        <section className="px-4 pt-4">
          <button
            onClick={() => navigate('/experts/1')}
            className="flex w-full items-center justify-between rounded-[6px] border-[1.4px] border-[#f4f4f5] bg-white px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-[#e1e2e4]" />
              <div className="text-left">
                <p className="text-[12px] font-medium text-[#008bff]">최근 후기 63건</p>
                <div className="flex items-center gap-2 text-[13px]">
                  <span className="font-semibold text-[#0f0f10]">옹민호 전문가</span>
                  <img src={starIcon} alt="" className="h-[18px] w-[18px]" />
                  <span className="text-[#989ba2]">4.7</span>
                </div>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-[#aeb0b6]" />
          </button>
        </section>

        <section className="px-4 pt-6 space-y-8">
          {firstReview && (
            <article className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[14px] font-semibold text-[#878a93]">{firstReview.author}</p>
                  <div className="flex items-center gap-2 text-[13px] text-[#989ba2]">
                    <div className="flex items-center gap-[2px]">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <img
                          key={`star-${secondReview.id}-${index}`}
                          src={starIcon}
                          alt=""
                          className="h-[16px] w-[16px]"
                        />
                      ))}
                    </div>
                    <span>{firstReview.rating}</span>
                    <span className="text-[#e1e2e4]">|</span>
                    <span>{firstReview.date}</span>
                  </div>
                </div>
                <button className="rounded-full p-1 text-[#aeb0b6] hover:bg-gray-50">
                  <MoreHorizontal className="h-6 w-6 rotate-90" />
                </button>
              </div>

              <div className="flex gap-[6px]">
                {firstReview.images.map((image, index) => (
                  <div
                    key={`${firstReview.id}-image-${index}`}
                    className="h-[130px] w-[130px] overflow-hidden rounded-[4px] bg-[#e1e2e4]"
                  >
                    {image && (
                      <img src={image} alt="" className="h-full w-full object-cover" />
                    )}
                  </div>
                ))}
              </div>

              <p className="text-[14px] leading-[1.5] text-[#505158]">
                {firstReview.content}
              </p>

              <div className="flex flex-wrap gap-2">
                {firstReview.tags.map((tag) => (
                  <span
                    key={`${firstReview.id}-${tag}`}
                    className={`rounded-[2px] px-2 py-1 text-[12px] ${
                      tag === '헤어'
                        ? 'bg-[#e5f4ff] text-[#008bff]'
                        : 'bg-[#f4f4f5] text-[#505158]'
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          )}

          <button
            onClick={() => navigate('/experts/1')}
            className="flex w-full items-center justify-between rounded-[6px] border-[1.4px] border-[#f4f4f5] bg-white px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-[#e1e2e4]" />
              <div className="text-left">
                <p className="text-[12px] font-medium text-[#008bff]">최근 후기 121건</p>
                <div className="flex items-center gap-2 text-[13px]">
                  <span className="font-semibold text-[#0f0f10]">이가영 전문가</span>
                  <img src={starIcon} alt="" className="h-[18px] w-[18px]" />
                  <span className="text-[#989ba2]">5.0</span>
                </div>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-[#aeb0b6]" />
          </button>

          {secondReview && (
            <article className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[14px] font-semibold text-[#878a93]">{secondReview.author}</p>
                  <div className="flex items-center gap-2 text-[13px] text-[#989ba2]">
                    <div className="flex items-center gap-[2px]">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <img
                          key={`star-${secondReview.id}-${index}`}
                          src={starIcon}
                          alt=""
                          className="h-[16px] w-[16px]"
                        />
                      ))}
                    </div>
                    <span>{secondReview.rating}</span>
                    <span className="text-[#e1e2e4]">|</span>
                    <span>{secondReview.date}</span>
                  </div>
                </div>
                <button className="rounded-full p-1 text-[#aeb0b6] hover:bg-gray-50">
                  <MoreHorizontal className="h-6 w-6 rotate-90" />
                </button>
              </div>

              <div className="flex gap-[6px]">
                {secondReview.images.map((image, index) => (
                  <div
                    key={`${secondReview.id}-image-${index}`}
                    className="h-[130px] w-[130px] overflow-hidden rounded-[4px] bg-[#e1e2e4]"
                  >
                    {image && (
                      <img src={image} alt="" className="h-full w-full object-cover" />
                    )}
                  </div>
                ))}
              </div>

              <p className="text-[14px] leading-[1.5] text-[#505158]">
                {secondReview.content}
              </p>

              <div className="flex flex-wrap gap-2">
                {secondReview.tags.map((tag) => (
                  <span
                    key={`${secondReview.id}-${tag}`}
                    className={`rounded-[2px] px-2 py-1 text-[12px] ${
                      tag === '헤어'
                        ? 'bg-[#e5f4ff] text-[#008bff]'
                        : 'bg-[#f4f4f5] text-[#505158]'
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          )}
        </section>
      </main>
    </div>
  );
};

export default CategoryBestReviewsPage;
