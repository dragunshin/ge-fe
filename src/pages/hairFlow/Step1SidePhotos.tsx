import TopNav from "./component/TopNav";
import Footer from "./component/Footer";
import { SinglePhotoField } from "./component/SinglePhotoField";
import { useStyleSetupStore } from "@/stores/useHairSetupStore";
import thumbnail from "@/images/reservationFlow/thumbnail.png";
import thumbnail2 from "@/images/reservationFlow/thumbnail2.png";
import thumbnail3 from "@/images/reservationFlow/thumbnail3.png";
import thumbnail4 from "@/images/reservationFlow/thumbnail4.png";

export function Step1SidePhotos({
  reservationId,
  onNext,
  onBack,
}: {
  reservationId: string;
  onNext: () => void;
  onBack?: () => void;
}) {
  //const { sidePhotoKeys, setSidePhotoKey, removeSidePhotoKey } = useStyleSetupStore();
  const { images, setSingleImage, clearSingleImage } = useStyleSetupStore();

  //const canNext = Boolean(sidePhotoKeys.LEFT && sidePhotoKeys.RIGHT);
  const canNext = Boolean(
    images.hairstyle?.[0] && images.front?.[0] && images.left?.[0] && images.right?.[0],
  );

  return (
    <div className="mx-auto min-h-[100dvh] w-full max-w-[420px] bg-white pb-28">
      <TopNav onBack={onBack} />

      {/* 1/7 */}
      <div className="px-4">
        <p className="text-[14px] font-semibold text-[#008bff]">1/7</p>

        {/* <div className="mt-2">
          <p className="pre_title_semi_20 text-[#429ff0]">평상시의 헤어스타일</p>
          <p className="pre_title_semi_20 text-neutral-900">을 1장 업로드해주세요.</p>
        </div> */}

        <div className="mt-2">
          <p className="pre_title_semi_20 text-black">
            <span className="text-[#429ff0]">평상시의 헤어스타일</span>을 1장 업로드해주세요.
          </p>
        </div>
      </div>

      <div className="mt-4 px-5">
        <div className="relative overflow-hidden rounded-[8px]">
          <div className="w-[168px] h-[168px]">
            <img src={thumbnail} alt="" className="w-[168px] h-[168px] object-cover" />
          </div>
        </div>

        <div className="mx-auto w-[343px] bg-white mt-[16px]">
          <div className="mt-5 rounded-[12px] bg-[#EEF7Fd] px-4 py-3">
            <p className="pre_body_reg_14 leading-relaxed text-[#008bff]">
              • 예시 이미지처럼 정면에서 촬영한 사진을 권장드려요.
            </p>
          </div>
        </div>
      </div>

      <SinglePhotoField
        title=""
        helper=""
        valueKey={images.hairstyle[0]}
        resourceType="consultation"
        resourceId={reservationId}
        imageType="hairstyle"
        onUploadedKey={(key) => setSingleImage("hairstyle", key)}
        onRemove={() => clearSingleImage("hairstyle")}
      />

      {/* 2/7 */}
      <div className="px-4 mt-[36px]">
        <p className="text-[14px] font-semibold text-[#008bff]">2/7</p>

        <div className="mt-2">
          <p className="pre_title_semi_20 text-black">
            <span className="text-[#429ff0]">머리를 올린 상태의 정면 사진</span>을
          </p>
          <p className="pre_title_semi_20 text-neutral-900">1장 업로드해 주세요.</p>
        </div>
      </div>

      <div className="mt-4 px-5">
        <div className="relative overflow-hidden rounded-[8px]">
          <div className="w-[168px] h-[168px]">
            <img src={thumbnail2} alt="" className="w-[168px] h-[168px] object-cover" />
          </div>
        </div>

        <div className="mx-auto w-[343px] bg-white mt-[16px]">
          <div className="mt-5 rounded-[12px] bg-[#EEF7Fd] px-4 py-3">
            <div className="flex items-start gap-1">
              <span className="text-[#008bff] shrink-0 -translate-y-[3px]">•</span>

              <p className="pre_body_reg_14 leading-relaxed text-[#008bff]">
                예시 이미지처럼 안경을 착용하지 않은 상태에서
                <br />
                헤어라인이 모두 보이도록 촬영해 주세요.
              </p>
            </div>
          </div>
        </div>
      </div>

      <SinglePhotoField
        title=""
        helper=""
        valueKey={images.front[0]}
        resourceType="consultation"
        resourceId={reservationId}
        imageType="front"
        onUploadedKey={(key) => setSingleImage("front", key)}
        onRemove={() => clearSingleImage("front")}
      />

      {/* 3/7 */}

      <div className="px-4 mt-[36px]">
        <p className="text-[14px] font-semibold text-[#008bff]">3/7</p>

        <div className="mt-2">
          <p className="pre_title_semi_20 text-[#429ff0]">머리를 올린 상태의 측면 사진을</p>
          <p className="pre_title_semi_20 text-neutral-900">좌우 1장씩 업로드해 주세요.</p>
        </div>
      </div>

      <div className="mt-4 px-5">
        <div className="flex justify-center gap-[8px]">
          <div className="h-[168px] w-[168px] overflow-hidden rounded-[8px]">
            <img src={thumbnail3} alt="example1" className="h-full w-full object-cover" />
          </div>

          <div className="h-[168px] w-[168px] overflow-hidden rounded-[8px]">
            <img src={thumbnail4} alt="example2" className="h-full w-full object-cover" />
          </div>
        </div>

        <div className="mx-auto w-[343px] bg-white mt-[16px]">
          <div className="mt-5 rounded-[12px] bg-[#EEF7Fd] px-4 py-3">
            <div className="flex items-start gap-1">
              <span className="text-[#008bff] shrink-0 -translate-y-[3px]">•</span>

              <p className="pre_body_reg_14 leading-relaxed text-[#008bff]">
                안경을 착용하지 않은 상태에서 헤어라인이 모두
                <br />
                보이도록 촬영해 주세요.
              </p>
            </div>
          </div>
        </div>
      </div>

      <SinglePhotoField
        title="왼쪽 측면 사진을 올려주세요."
        helper="얼굴을 왼쪽으로 45도 돌린 촬영본을 올려주세요."
        valueKey={images.left[0]}
        resourceType="consultation"
        resourceId={reservationId}
        imageType="left"
        onUploadedKey={(key) => setSingleImage("left", key)}
        onRemove={() => clearSingleImage("left")}
      />

      <SinglePhotoField
        title="오른쪽 측면 사진을 올려주세요."
        helper="얼굴을 오른쪽으로 45도 돌린 촬영본을 올려주세요."
        valueKey={images.right[0]}
        resourceType="consultation"
        resourceId={reservationId}
        imageType="right"
        onUploadedKey={(key) => setSingleImage("right", key)}
        onRemove={() => clearSingleImage("right")}
      />

      <Footer
        disabled={!canNext}
        //disabled={canNext}
        onClick={onNext}
      />
    </div>
  );
}
