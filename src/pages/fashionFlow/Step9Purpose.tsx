import { Camera, X } from "lucide-react";
import type { OutfitImage } from "./types";
import type { RefObject } from "react";

export function Step9Purpose({
  purposeText,
  purposeImages,
  purposeInputRef,
  onPurposeTextChange,
  onUploadPurpose,
  onRemovePurpose,
}: {
  purposeText: string;
  purposeImages: OutfitImage[];
  purposeInputRef: RefObject<HTMLInputElement | null>;
  onPurposeTextChange: (value: string) => void;
  onUploadPurpose: (files: FileList | null) => void;
  onRemovePurpose: (id: string) => void;
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

      <div className="mt-[16px] flex gap-[8px]">
        <input
          ref={purposeInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(event) => {
            onUploadPurpose(event.target.files);
            event.currentTarget.value = "";
          }}
        />
        <button
          type="button"
          className="flex h-[108px] w-[108px] flex-col items-center justify-center rounded-[8px] border border-[#e1e2e4] bg-[#fafafa] text-[14px] text-[#656870]"
          onClick={() => purposeInputRef.current?.click()}
        >
          <Camera className="h-[24px] w-[24px] text-[#656870]" />
          <span className="mt-[6px]">{purposeImages.length}/3</span>
        </button>
        {purposeImages.map((image) => (
          <div
            key={image.id}
            className="relative h-[108px] w-[108px] overflow-hidden rounded-[8px]"
          >
            <img src={image.url} alt="추가 이미지" className="h-full w-full object-cover" />
            <button
              type="button"
              className="absolute right-[6px] top-[6px] flex h-[24px] w-[24px] items-center justify-center rounded-full bg-black/80"
              onClick={() => onRemovePurpose(image.id)}
            >
              <X className="h-[14px] w-[14px] text-white" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
