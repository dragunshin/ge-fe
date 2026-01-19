import { MultiPhotoPicker } from "@/pages/hairFlow/component/MultiPhotoPicker";
import thumbnail2 from "@/images/reservationFlow/fashionFlow/thumbnail3.svg";
import thumbnail3 from "@/images/reservationFlow/fashionFlow/thumbnail3-2.svg";

export function Step3OutfitPhotos({
  keys,
  reservationId,
  onAddKey,
  onRemoveKey,
}: {
  keys: string[];
  reservationId: number | null;
  onAddKey: (key: string) => void;
  onRemoveKey: (key: string) => void;
}) {
  return (
    <section className="pt-[8px]">
      <p className="text-[16px] font-medium text-[#008bff]">3/8</p>
      <h1 className="mt-[6px] text-[20px] font-semibold leading-[1.4] text-black">
        <span className="text-[#008bff]">가장 좋아하는 본인 사진</span>을 올려주세요.
      </h1>

      {keys.length === 0 && (
        <div className="mt-[16px] flex gap-[8px]">
          <div className="h-[167px] w-[168px] overflow-hidden rounded-[8px] bg-[#e1e2e4]">
            <img
              src={thumbnail2}
              alt="착장 예시 1"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="h-[167px] w-[168px] overflow-hidden rounded-[8px] bg-[#e1e2e4]">
            <img
              src={thumbnail3}
              alt="착장 예시 2"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      )}

      <div className="mt-[16px] rounded-[12px] bg-[#eff7fd] px-[16px] py-[12px]">
        <ul className="list-disc pl-[20px] text-[14px] leading-[1.5] text-[#008bff]">
          <li>최소 2장에서 최대 5장까지 올려주세요.</li>
        </ul>
      </div>

      <div className="mt-[16px] flex items-center justify-center">
        <MultiPhotoPicker
          keys={keys}
          max={5}
          resourceType="consultation"
          resourceId={reservationId ?? 0}
          imageType="favorite"
          onAddKey={onAddKey}
          onRemoveKey={onRemoveKey}
        />
      </div>
    </section>
  );
}
