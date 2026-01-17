import { Camera, X } from "lucide-react";
import { SIDE_GUIDE } from "./constants";
import type { OutfitImage } from "./types";
import type { RefObject } from "react";

export function Step2SidePhotos({
  leftImage,
  rightImage,
  leftInputRef,
  rightInputRef,
  onRemoveLeft,
  onRemoveRight,
  onUploadLeft,
  onUploadRight,
}: {
  leftImage: OutfitImage | null;
  rightImage: OutfitImage | null;
  leftInputRef: RefObject<HTMLInputElement | null>;
  rightInputRef: RefObject<HTMLInputElement | null>;
  onRemoveLeft: () => void;
  onRemoveRight: () => void;
  onUploadLeft: (files: FileList | null) => void;
  onUploadRight: (files: FileList | null) => void;
}) {
  return (
    <section className="pt-[8px]">
      <h1 className="mt-[6px] text-[20px] font-semibold leading-[1.4] text-black">
        이제 <span className="text-[#429ff0]">전신 측면 사진</span>을 올려주세요.
      </h1>
      {!leftImage && !rightImage && (
        <div className="mt-[16px] flex gap-[8px]">
          <div className="h-[167px] w-[168px] rounded-[8px] bg-[#e1e2e4]" />
          <div className="h-[167px] w-[168px] rounded-[8px] bg-[#e1e2e4]" />
        </div>
      )}

      <div className="mt-[16px] rounded-[12px] bg-[#eff7fd] px-[16px] py-[12px]">
        <ul className="list-disc pl-[20px] text-[14px] leading-[1.5] text-[#008bff]">
          {SIDE_GUIDE.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="mt-[24px] space-y-[28px]">
        <div>
          <p className="text-[20px] font-semibold leading-[1.4]">왼쪽 전신을 올려주세요.</p>
          <p className="mt-[6px] text-[13px] leading-[1.4] text-[#70737c]">
            몸을 왼쪽으로 돌린 촬영본을 올려주세요.
          </p>
          {leftImage && (
            <div className="relative mt-[16px] h-[167px] w-[168px] overflow-hidden rounded-[8px]">
              <img src={leftImage.url} alt="왼쪽 전신" className="h-full w-full object-cover" />
              <button
                type="button"
                className="absolute right-[10px] top-[10px] flex h-[24px] w-[24px] items-center justify-center rounded-full bg-black/70"
                onClick={onRemoveLeft}
              >
                <X className="h-[14px] w-[14px] text-white" />
              </button>
            </div>
          )}
          <input
            ref={leftInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => {
              onUploadLeft(event.target.files);
              event.currentTarget.value = "";
            }}
          />
          <div className="mt-[16px] flex justify-center">
            <button
              type="button"
              className="flex h-[52px] w-[306px] items-center justify-center gap-[8px] rounded-[12px] border border-[#dbdcdf] text-[16px] font-medium text-[#46474c]"
              onClick={() => leftInputRef.current?.click()}
            >
              <Camera className="h-[20px] w-[20px]" />
              {leftImage ? "다시 업로드하기" : "사진 업로드"}
            </button>
          </div>
        </div>

        <div>
          <p className="text-[20px] font-semibold leading-[1.4]">오른쪽 전신을 올려주세요.</p>
          <p className="mt-[6px] text-[13px] leading-[1.4] text-[#70737c]">
            몸을 오른쪽으로 돌린 촬영본을 올려주세요.
          </p>
          {rightImage && (
            <div className="relative mt-[16px] h-[167px] w-[168px] overflow-hidden rounded-[8px]">
              <img src={rightImage.url} alt="오른쪽 전신" className="h-full w-full object-cover" />
              <button
                type="button"
                className="absolute right-[10px] top-[10px] flex h-[24px] w-[24px] items-center justify-center rounded-full bg-black/70"
                onClick={onRemoveRight}
              >
                <X className="h-[14px] w-[14px] text-white" />
              </button>
            </div>
          )}
          <input
            ref={rightInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => {
              onUploadRight(event.target.files);
              event.currentTarget.value = "";
            }}
          />
          <div className="mt-[16px] flex justify-center">
            <button
              type="button"
              className="flex h-[52px] w-[306px] items-center justify-center gap-[8px] rounded-[12px] border border-[#dbdcdf] text-[16px] font-medium text-[#46474c]"
              onClick={() => rightInputRef.current?.click()}
            >
              <Camera className="h-[20px] w-[20px]" />
              {rightImage ? "다시 업로드하기" : "사진 업로드"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
