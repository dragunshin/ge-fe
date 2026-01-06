import { Upload, X } from "lucide-react";
import type { OutfitImage } from "./types";
import type { RefObject } from "react";

export function Step3OutfitPhotos({
  outfits,
  outfitInputRef,
  onUploadOutfits,
  onRemoveOutfit,
}: {
  outfits: OutfitImage[];
  outfitInputRef: RefObject<HTMLInputElement | null>;
  onUploadOutfits: (files: FileList | null) => void;
  onRemoveOutfit: (id: string) => void;
}) {
  return (
    <section className="pt-[8px]">
      <p className="text-[16px] font-medium text-[#008bff]">3/9</p>
      <h1 className="mt-[6px] text-[20px] font-semibold leading-[1.4] text-black">
        본인 사진 중 <span className="text-[#429ff0]">가장 마음에 들었던 착장</span>을
        올려주세요.
      </h1>

      {outfits.length === 0 && (
        <div className="mt-[16px] flex gap-[8px]">
          <div className="h-[167px] w-[168px] rounded-[8px] bg-[#e1e2e4]" />
          <div className="h-[167px] w-[168px] rounded-[8px] bg-[#e1e2e4]" />
        </div>
      )}

      <div className="mt-[16px] rounded-[12px] bg-[#eff7fd] px-[16px] py-[12px]">
        <ul className="list-disc pl-[20px] text-[14px] leading-[1.5] text-[#008bff]">
          <li>최소 2장에서 최대 5장까지 올려주세요.</li>
        </ul>
      </div>

      <div className="mt-[16px] flex flex-wrap gap-[8px]">
        {outfits.map((item) => (
          <div
            key={item.id}
            className="relative h-[167px] w-[168px] overflow-hidden rounded-[8px]"
          >
            <img src={item.url} alt="착장 사진" className="h-full w-full object-cover" />
            <button
              type="button"
              className="absolute right-[10px] top-[10px] flex h-[24px] w-[24px] items-center justify-center rounded-full bg-black/70"
              onClick={() => onRemoveOutfit(item.id)}
            >
              <X className="h-[14px] w-[14px] text-white" />
            </button>
          </div>
        ))}
      </div>

      <input
        ref={outfitInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        multiple
        onChange={(event) => {
          onUploadOutfits(event.target.files);
          event.currentTarget.value = "";
        }}
      />
      <button
        type="button"
        className="mt-[16px] flex h-[52px] w-[306px] items-center justify-center gap-[8px] rounded-[12px] border border-[#dbdcdf] text-[16px] font-medium text-[#46474c]"
        onClick={() => outfitInputRef.current?.click()}
      >
        <Upload className="h-[20px] w-[20px]" />
        사진 업로드
      </button>
    </section>
  );
}
