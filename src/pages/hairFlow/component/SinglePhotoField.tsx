// import { useEffect, useRef, useState } from "react";
// import { X } from "lucide-react";
// import { uploadImageViaPresign } from "@/lib/s3Upload";
// import { cn } from "@/lib/utils";
// import Camera from "@/images/reservationFlow/camera.svg?react";

// export function SinglePhotoField({
//   title,
//   helper,
//   valueKey,
//   onUploadedKey,
//   onRemove,
//   prefix,
// }: {
//   title: string;
//   helper: string;
//   valueKey?: string;
//   onUploadedKey: (key: string) => void;
//   onRemove: () => void;
//   prefix: string;
// }) {
//   const inputRef = useRef<HTMLInputElement | null>(null);

//   const [previewUrl, setPreviewUrl] = useState<string | null>(null);
//   const [isUploading, setIsUploading] = useState(false);

//   const objectUrlRef = useRef<string | null>(null);
//   const abortRef = useRef<AbortController | null>(null);
//   const seqRef = useRef(0);

//   const showRemove = Boolean(previewUrl || valueKey);

//   const revokePreview = () => {
//     if (objectUrlRef.current) {
//       URL.revokeObjectURL(objectUrlRef.current);
//       objectUrlRef.current = null;
//     }
//   };

//   const clearLocalPreview = () => {
//     revokePreview();
//     setPreviewUrl(null);
//   };

//   const handleRemove = () => {
//     // 업로드 진행 중이면 중단 + 이후 결과 무시
//     seqRef.current += 1;
//     abortRef.current?.abort();
//     abortRef.current = null;

//     setIsUploading(false);
//     clearLocalPreview();
//     onRemove(); // ✅ zustand에서 key 제거
//   };

//   useEffect(() => {
//     return () => {
//       abortRef.current?.abort();
//       revokePreview();
//     };
//   }, []);

//   const pick = () => inputRef.current?.click();

//   const onChange = async (file?: File | null) => {
//     if (!file) return;

//     // 이전 업로드/프리뷰 정리
//     handleRemove(); // key까지 지우기 싫으면 아래 3줄로 대체 가능
//     // seqRef.current += 1;
//     // abortRef.current?.abort();
//     // clearLocalPreview();

//     // 새 프리뷰 생성(로컬)
//     const localUrl = URL.createObjectURL(file);
//     objectUrlRef.current = localUrl;
//     setPreviewUrl(localUrl);

//     const controller = new AbortController();
//     abortRef.current = controller;

//     const mySeq = ++seqRef.current;

//     try {
//       setIsUploading(true);
//       const { key } = await uploadImageViaPresign({
//         file,
//         prefix,
//         signal: controller.signal,
//       });

//       // X로 제거하거나 새로운 업로드가 시작된 경우 무시
//       if (seqRef.current !== mySeq) return;

//       onUploadedKey(key); // ✅ 업로드 성공 → zustand에 key 저장
//     } catch (e) {
//       if (controller.signal.aborted) return;
//       clearLocalPreview();
//       alert("업로드에 실패했어요. 다시 시도해주세요.");
//     } finally {
//       if (seqRef.current === mySeq) setIsUploading(false);
//     }
//   };

//   return (
//     <section className="mt-8 px-5">
//       <h3 className="pre_title_semi_20 text-[#000000]">{title}</h3>
//       <p className="mt-2 pre_cap_reg_13 leading-relaxed text-[#70737c]">{helper}</p>

//       <div className="mt-8">
//         <div className="w-[168px] h-[168px]">
//           <div className="relative overflow-hidden rounded-[8px] bg-neutral-100">
//             <div className="aspect-[4/3] w-full">
//               {previewUrl ? (
//                 <img src={previewUrl} alt="" className="h-full w-full object-cover" />
//               ) : (
//                 <div className="flex h-full w-full items-center justify-center text-[12px] text-neutral-500">
//                   {valueKey ? "업로드 완료" : "사진"}
//                 </div>
//               )}
//             </div>

//             {showRemove && (
//               <button
//                 type="button"
//                 onClick={handleRemove}
//                 className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/60"
//                 aria-label="삭제"
//               >
//                 <X className="h-4 w-4 text-white" />
//               </button>
//             )}

//             {isUploading && (
//               <div className="absolute inset-0 flex items-center justify-center bg-black/30 text-[12px] font-semibold text-white">
//                 업로드 중...
//               </div>
//             )}
//           </div>
//         </div>

//         <div className="mt-0 flex justify-center">
//           <button
//             type="button"
//             onClick={pick}
//             className={cn(
//               "inline-flex h-[52px] w-[306px] items-center justify-center gap-2 rounded-[12px] border border-neutral-200 bg-white pre_body_med_16 text-[#46474c]",
//               "active:bg-neutral-50",
//             )}
//           >
//             <Camera className="h-5 w-5" />
//             사진 업로드
//           </button>
//         </div>

//         <input
//           ref={inputRef}
//           type="file"
//           accept="image/*"
//           className="hidden"
//           onChange={(e) => onChange(e.target.files?.[0] ?? null)}
//         />
//       </div>
//     </section>
//   );
// }

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { uploadImageViaPresign } from "@/lib/s3Upload";
import { cn } from "@/lib/utils";
import Camera from "@/images/reservationFlow/camera.svg?react";

export function SinglePhotoField({
  title,
  helper,
  valueKey,
  onUploadedKey,
  onRemove,
  prefix,
}: {
  title: string;
  helper: string;
  valueKey?: string;
  onUploadedKey: (key: string) => void;
  onRemove: () => void;
  prefix: string;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const objectUrlRef = useRef<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const seqRef = useRef(0);

  const showRemove = Boolean(previewUrl || valueKey);

  const revokePreview = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  };

  const clearLocalPreview = () => {
    revokePreview();
    setPreviewUrl(null);
  };

  const handleRemove = () => {
    // 업로드 진행 중이면 중단 + 이후 결과 무시
    seqRef.current += 1;
    abortRef.current?.abort();
    abortRef.current = null;

    setIsUploading(false);
    clearLocalPreview();
    onRemove(); // zustand에서 key 제거
  };

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      revokePreview();
    };
  }, []);

  const pick = () => inputRef.current?.click();

  const onChange = async (file?: File | null) => {
    if (!file) return;

    // 같은 파일을 다시 선택해도 onChange가 다시 뜨도록 리셋
    if (inputRef.current) inputRef.current.value = "";

    // 이전 업로드/프리뷰 정리 (기존 동작 유지: key까지 제거)
    handleRemove();

    // 새 프리뷰 생성(로컬)
    const localUrl = URL.createObjectURL(file);
    objectUrlRef.current = localUrl;
    setPreviewUrl(localUrl);

    const controller = new AbortController();
    abortRef.current = controller;

    const mySeq = ++seqRef.current;

    try {
      setIsUploading(true);

      const { key } = await uploadImageViaPresign({
        file,
        prefix,
        signal: controller.signal,
      });

      // X로 제거하거나 새로운 업로드가 시작된 경우 무시
      if (seqRef.current !== mySeq) return;

      onUploadedKey(key); // 업로드 성공, zustand에 key 저장
    } catch (e) {
      // 중단이면 종료
      if (controller.signal.aborted) return;

      // 여기서 프리뷰를 지우지 않음: 업로드 실패해도 프리뷰 유지
      //alert("업로드에 실패했어요. 다시 시도해주세요.");
    } finally {
      if (seqRef.current === mySeq) setIsUploading(false);
    }
  };

  return (
    <section className="mt-8 px-5">
      <h3 className="pre_title_semi_20 text-[#000000]">{title}</h3>
      <p className="mt-2 pre_cap_reg_13 leading-relaxed text-[#70737c]">{helper}</p>

      <div className="mt-6">
        <div className="w-[168px] h-[168px]">
          <div className="relative overflow-hidden rounded-[8px] bg-neutral-100">
            <div className="w-[168px] h-[168px]">
              {previewUrl ? (
                <img src={previewUrl} alt="" className="w-[168px] h-[168px] object-cover" />
              ) : (
                <div className="flex w-[168px] h-[168px] items-center justify-center text-[12px] text-neutral-500">
                  {/* {valueKey ? "업로드 완료" : "사진"} */}
                  {valueKey ? "업로드 완료" : ""}
                </div>
              )}
            </div>

            {showRemove && (
              <button
                type="button"
                onClick={handleRemove}
                className="absolute right-2 top-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#292a2d]"
                aria-label="삭제"
              >
                <X className="h-3 w-3 text-white" />
              </button>
            )}

            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 text-[12px] font-semibold text-white">
                업로드 중...
              </div>
            )}
          </div>
        </div>

        <div className="!mt-5 flex justify-center">
          <button
            type="button"
            onClick={pick}
            className={cn(
              "inline-flex h-[52px] w-[306px] items-center justify-center gap-2 rounded-[12px] border border-neutral-200 bg-white pre_body_med_16 text-[#46474c]",
              "active:bg-neutral-50",
            )}
          >
            <Camera className="h-5 w-5" />
            사진 업로드
          </button>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => onChange(e.target.files?.[0] ?? null)}
        />
      </div>
    </section>
  );
}
