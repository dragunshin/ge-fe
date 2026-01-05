import { useEffect, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";
import { uploadImageViaPresign } from "@/lib/s3Upload";
import { cn } from "@/lib/utils";
import Camera from "@/images/reservationFlow/camera.svg?react";

type PreviewItem = { key: string; previewUrl: string };

export function MultiPhotoPicker({
  keys,
  max = 3,
  prefix,
  onAddKey,
  onRemoveKey,
}: {
  keys: string[];
  max?: number;
  prefix: string;
  onAddKey: (key: string) => void;
  onRemoveKey: (key: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [previews, setPreviews] = useState<PreviewItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // ✅ 여기: 생성한 objectURL들을 모아두는 Set
  const objectUrlsRef = useRef<Set<string>>(new Set());

  // ✅ 여기: 컴포넌트가 사라질 때 한 번에 revoke
  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      objectUrlsRef.current.clear();
    };
  }, []);

  const countLabel = useMemo(() => `${keys.length}/${max}`, [keys.length, max]);

  const pick = () => inputRef.current?.click();

  const addFile = async (file?: File | null) => {
    if (!file) return;
    if (keys.length >= max) return;

    const localUrl = URL.createObjectURL(file);
    objectUrlsRef.current.add(localUrl); // ✅ 생성한 프리뷰 URL 등록

    try {
      setIsUploading(true);
      const { key } = await uploadImageViaPresign({ file, prefix });
      onAddKey(key);

      setPreviews((p) => [...p, { key, previewUrl: localUrl }]);
    } catch {
      // 업로드 실패하면 방금 만든 localUrl도 바로 정리
      URL.revokeObjectURL(localUrl);
      objectUrlsRef.current.delete(localUrl);
      alert("업로드에 실패했어요. 다시 시도해주세요.");
    } finally {
      setIsUploading(false);
    }
  };

  const remove = (key: string) => {
    onRemoveKey(key); // ✅ zustand key 제거

    setPreviews((p) => {
      const target = p.find((x) => x.key === key);
      if (target?.previewUrl) {
        URL.revokeObjectURL(target.previewUrl); // ✅ 로컬 프리뷰 제거
        objectUrlsRef.current.delete(target.previewUrl);
      }
      return p.filter((x) => x.key !== key);
    });
  };

  const previewMap = new Map(previews.map((p) => [p.key, p.previewUrl]));

  return (
    <div className="mt-4 flex items-center gap-3">
      <button
        type="button"
        onClick={pick}
        disabled={isUploading || keys.length >= max}
        className={cn(
          "flex h-[108px] w-[108px] flex-col items-center justify-center rounded-[8px] border border-[#e1e2e4] bg-[#fafafa]",
          "active:bg-neutral-50",
          (isUploading || keys.length >= max) && "opacity-60",
        )}
      >
        <Camera className="h-6 w-6 text-[#878a93]" fill="#878a93" />
        <span className="mt-1 pre_cap_reg_14 text-[#878a93]">{countLabel}</span>
      </button>

      {keys.map((k) => {
        const url = previewMap.get(k);
        return (
          <div
            key={k}
            className="relative h-[74px] w-[74px] overflow-hidden rounded-[12px] bg-neutral-100"
          >
            {url ? (
              <img src={url} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-[11px] text-neutral-500">
                업로드 완료
              </div>
            )}

            <button
              type="button"
              onClick={() => remove(k)}
              className="absolute right-1 top-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-black/60"
              aria-label="삭제"
            >
              <X className="h-4 w-4 text-white" />
            </button>
          </div>
        );
      })}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => addFile(e.target.files?.[0] ?? null)}
      />
    </div>
  );
}
