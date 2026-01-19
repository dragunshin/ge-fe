import { MultiPhotoPicker } from "@/pages/hairFlow/component/MultiPhotoPicker";

export function Step9Purpose({
  purposeText,
  keys,
  reservationId,
  onPurposeTextChange,
  onAddKey,
  onRemoveKey,
}: {
  purposeText: string;
  keys: string[];
  reservationId: number | null;
  onPurposeTextChange: (value: string) => void;
  onAddKey: (key: string) => void;
  onRemoveKey: (key: string) => void;
}) {
  return (
    <section className="pt-[8px]">
      <p className="text-[16px] font-medium text-[#008bff]">8/8</p>
      <h1 className="mt-[6px] text-[20px] font-semibold leading-[1.4] text-black">
        전문가 상담 목적을 알려주세요.
      </h1>
      <p className="mt-[4px] text-[14px] leading-[1.5] text-[#656870]">
        상담 목적을 구체적으로 작성해 주세요.
        <br />
        매치하고 싶은 옷이 있다면 사진을 추가해 주세요.
      </p>

      <div className="relative mt-[16px] h-[177px] rounded-[8px] border border-[#e1e2e4] bg-[#f4f4f5]">
        <textarea
          value={purposeText}
          onChange={(event) => onPurposeTextChange(event.target.value)}
          maxLength={400}
          placeholder="ex. 이번주에 데이트가 있어서 최대한 댄디한 룩으로 입고 싶어요."
          className="h-full w-full resize-none bg-transparent px-[14px] py-[15px] text-[14px] leading-[1.5] text-[#0f0f10] placeholder:text-[#656870]"
        />
        <span className="absolute bottom-[12px] right-[12px] text-[14px] text-[#656870]">
          <span className={purposeText.length > 0 ? "text-[#008bff]" : ""}>
            {purposeText.length}
          </span>
          /400
        </span>
      </div>

      <div className="mt-[16px]">
        <MultiPhotoPicker
          keys={keys}
          max={3}
          resourceType="consultation"
          resourceId={reservationId ?? 0}
          imageType="purpose"
          onAddKey={onAddKey}
          onRemoveKey={onRemoveKey}
        />
      </div>
    </section>
  );
}
