import { X } from "lucide-react";
import Camera from "@/images/reservationFlow/camera.svg?react";
import thumbnail1 from "@/images/reservationFlow/fashionFlow/thumbnail.svg";
import { IMAGE_GUIDE, SIDE_GUIDE } from "./constants";
import type { OutfitImage } from "./types";
import type { RefObject } from "react";

export function Step1Guide({
  introStage,
  frontImage,
  frontInputRef,
  onRemoveFront,
  onUploadFront,
}: {
  introStage: 1 | 2;
  frontImage: OutfitImage | null;
  frontInputRef: RefObject<HTMLInputElement | null>;
  onRemoveFront: () => void;
  onUploadFront: (files: FileList | null) => void;
}) {
  if (introStage === 1) {
    return (
      <section className="pt-[8px]">
        <p className="text-[16px] font-medium text-[#008bff]">1/8</p>
        <h1 className="mt-[6px] text-[20px] font-semibold leading-[1.4] text-black">
          맨유얼에서 정확한 컨설팅을
          <br />
          위한 사진 등록 가이드
        </h1>
        <p className="mt-[10px] text-[13px] leading-[1.4] text-[#70737c]">
          제출한 사진은 마케팅이나 외부 공개 목적으로 일정
          <br />
          활용하지 않습니다.
        </p>

        <div className="mt-[24px] rounded-[12px] bg-[#eff7fd] px-[16px] py-[12px]">
          <p className="text-[14px] font-semibold text-[#008bff]">좋은 사진의 예</p>
          <ul className="mt-[6px] list-disc space-y-[4px] pl-[20px] text-[14px] leading-[1.5] text-[#008bff]">
            {IMAGE_GUIDE.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-[8px]">
      <p className="text-[16px] font-medium text-[#008bff]">1/8</p>
      <h1 className="mt-[6px] text-[20px] font-semibold leading-[1.4] text-black">
        <span className="text-[#008bff]">전신 정면 사진</span>을 1장 업로드해 주세요.
      </h1>
      {!frontImage && (
        <div className="mt-[16px]">
          <div className="h-[167px] w-[168px] overflow-hidden rounded-[8px] bg-[#e1e2e4]">
            <img
              src={thumbnail1}
              alt="전신 정면 예시"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      )}

      <div className="mt-[16px] rounded-[12px] bg-[#eff7fd] px-[16px] py-[12px]">
        <ul className="list-disc pl-[20px] text-[14px] leading-[1.5] text-[#008bff]">
          {SIDE_GUIDE.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      {frontImage && (
        <div className="relative mt-[16px] h-[167px] w-[168px] overflow-hidden rounded-[8px]">
          <img src={frontImage.url} alt="전신 정면" className="h-full w-full object-cover" />
          <button
            type="button"
            className="absolute right-[10px] top-[10px] flex h-[24px] w-[24px] items-center justify-center rounded-full bg-black/70"
            onClick={onRemoveFront}
          >
            <X className="h-[14px] w-[14px] text-white" />
          </button>
        </div>
      )}

      <div className="mt-[16px] flex justify-center">
        <input
          ref={frontInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => {
            onUploadFront(event.target.files);
            event.currentTarget.value = "";
          }}
        />
        <button
          type="button"
          className="flex h-[52px] w-[306px] items-center justify-center gap-[8px] rounded-[12px] border border-[#dbdcdf] text-[16px] font-medium text-[#46474c]"
          onClick={() => frontInputRef.current?.click()}
        >
          <Camera className="h-[20px] w-[20px]" />
          {frontImage ? "다시 업로드하기" : "사진 업로드"}
        </button>
      </div>
    </section>
  );
}
