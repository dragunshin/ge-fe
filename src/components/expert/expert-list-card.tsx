import starIcon from "@/images/reviews/star.svg";

export type ExpertListCardData = {
  id: number;
  name: string;
  rating: number;
  reviewCount: string;
  summary: string;
  avatar?: string;
  images: string[];
  tags: string[];
  reviewTags: string[];
};

type ExpertListCardProps = {
  expert: ExpertListCardData;
  categoryLabel: string;
  onClick: (expertId: number) => void;
  onReserve: (expertId: number) => void;
};

export default function ExpertListCard({
  expert,
  categoryLabel,
  onClick,
  onReserve,
}: ExpertListCardProps) {
  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => onClick(expert.id)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick(expert.id);
        }
      }}
      className="w-full min-h-[251px] cursor-pointer rounded-[8px] bg-white px-[12px] py-[20px] shadow-[0px_2px_12px_0px_rgba(0,0,0,0.13)]"
    >
      <div className="flex flex-col gap-[14px]">
        <div className="flex items-start justify-between gap-[8px]">
          <div className="min-w-0 flex items-center gap-[9px]">
            <div className="h-[42px] w-[42px] shrink-0 overflow-hidden rounded-full bg-[#e1e2e4]">
              {expert.avatar && <img src={expert.avatar} alt="" className="h-full w-full object-cover" />}
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
        <div className="flex gap-[2px]">
          {Array.from({ length: 3 }).map((_, index) => {
            const image = expert.images[index];
            const tag = expert.reviewTags[index];
            return (
              <div
                key={`${expert.id}-review-${index}`}
                className="relative h-[105px] w-[105px] overflow-hidden rounded-[4px] bg-[#e1e2e4]"
              >
                {image && <img src={image} alt="" className="h-full w-full object-cover" />}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
                {tag && (
                  <span className="absolute bottom-[27px] left-[10px] text-[12px] text-white">
                    {tag}
                  </span>
                )}
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-[6px]">
            {expert.tags.map((tag, index) => (
              <span
                key={`${expert.id}-tag-${tag}-${index}`}
                className={
                  tag === categoryLabel
                    ? "rounded-[2px] bg-[#f5f9fd] px-[6px] py-[4px] text-[12px] text-[#429ff0]"
                    : "rounded-[2px] bg-[#f4f4f5] px-[8px] py-[4px] text-[12px] text-[#46474c]"
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
              onReserve(expert.id);
            }}
            type="button"
          >
            상담 예약
          </button>
        </div>
      </div>
    </article>
  );
}
