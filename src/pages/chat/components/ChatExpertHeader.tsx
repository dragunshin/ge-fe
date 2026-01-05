import { format } from "date-fns";
import { ko } from "date-fns/locale";

export function ChatExpertHeader() {
  const formattedDate = format(new Date(), "yyyy년 M월 d일 EEEE", { locale: ko });

  return (
    <section className="bg-[#F4F4F5] px-4 py-3">
      <div className="flex items-center gap-3 mt-3">
        <div className="h-px flex-1 bg-[#E1E2E4]" />
        <span className="pre_body_reg_13 text-[#656870]">{formattedDate}</span>
        <div className="h-px flex-1 bg-[#E1E2E4]" />
      </div>
    </section>
  );
}
