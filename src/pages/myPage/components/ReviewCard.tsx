import * as React from "react";

export type ReviewCardProps = {
  reviewerName: string;
  rating: number; // 0-5
  date: string;
  content: string;
  avatarSrc?: string;
  className?: string;
};

function Star({ filled }: { filled: boolean }) {
  return (
    <svg
      className={`h-4 w-4 ${filled ? "text-[#F59E0B]" : "text-[#E5E7EB]"}`}
      viewBox="0 0 20 20"
      fill={filled ? "currentColor" : "none"}
      aria-hidden
    >
      <path
        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.286 3.97c.3.921-.755 1.688-1.54 1.118L10 15.347l-3.49 2.246c-.784.57-1.84-.197-1.54-1.118l1.286-3.97a1 1 0 00-.364-1.118L2.507 9.397c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.97z"
        stroke="currentColor"
        strokeWidth="0"
      />
    </svg>
  );
}

export default function ReviewCard({
  reviewerName,
  rating,
  date,
  content,
  avatarSrc,
  className = "",
}: ReviewCardProps) {
  const stars = [0, 1, 2, 3, 4];

  return (
    <article className={`rounded-2xl bg-white p-4 ${className}`}>
      <div className="flex items-start gap-3">
        {avatarSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarSrc} alt={reviewerName} className="h-10 w-10 rounded-full object-cover" />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E5E7EB] text-sm font-semibold text-[#0F172A]">
            {reviewerName ? reviewerName.charAt(0) : "U"}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[14px] font-semibold text-[#0F172A] truncate">{reviewerName}</p>
              <p className="mt-1 text-[12px] text-[#9CA3AF]">{date}</p>
            </div>
            <div className="flex items-center gap-1">
              {stars.map((_, i) => (
                <Star key={i} filled={i < Math.round(rating)} />
              ))}
            </div>
          </div>

          <p className="mt-3 text-[14px] text-[#374151] line-clamp-4">{content}</p>
        </div>
      </div>
    </article>
  );
}
