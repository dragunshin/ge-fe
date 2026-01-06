import TopNav from "./component/TopNav";
import Footer from "./component/Footer";
import { SinglePhotoField } from "./component/SinglePhotoField";
import { useStyleSetupStore } from "@/stores/useHairSetupStore";

export function Step1SidePhotos({ onNext, onBack }: { onNext: () => void; onBack?: () => void }) {
  const { sidePhotoKeys, setSidePhotoKey, removeSidePhotoKey } = useStyleSetupStore();

  return (
    <div className="relative mx-auto flex h-full w-full max-w-[420px] flex-col bg-white overflow-hidden">
      <TopNav onBack={onBack} />

      <div className="flex-1 overflow-y-auto px-5 pb-[120px] scrollbar-hide">
        <p className="text-[14px] font-semibold text-[#008bff]">1/3</p>

        <div className="mt-2">
          <p className="pre_title_semi_20 text-[#429ff0]">머리를 올린 상태의 측면 사진을</p>
          <p className="pre_title_semi_20 text-neutral-900">업로드해 주세요.</p>
        </div>

        <div className="mt-5 rounded-[12px] bg-[#EEF7Fd] px-4 py-3">
          {/* <p className="pre_body_reg_14 leading-relaxed text-[#008bff]">
            • 안경을 착용하지 않은 상태에서 헤어라인이 모두 보이도록 촬영해 주세요.
          </p> */}
          <p className="pre_body_reg_14 leading-relaxed text-[#008bff]">
            안경을 착용하지 않은 상태에서 헤어라인이 모두 보이도록 촬영해 주세요.
          </p>
        </div>
        <SinglePhotoField
          title="왼쪽 측면 사진을 올려주세요."
          helper="얼굴을 왼쪽으로 45도 돌린 촬영본을 올려주세요."
          valueKey={sidePhotoKeys.LEFT}
          prefix="style/side-left"
          onUploadedKey={(key) => setSidePhotoKey("LEFT", key)}
          onRemove={() => removeSidePhotoKey("LEFT")}
        />

        <SinglePhotoField
          title="오른쪽 측면 사진을 올려주세요."
          helper="얼굴을 오른쪽으로 45도 돌린 촬영본을 올려주세요."
          valueKey={sidePhotoKeys.RIGHT}
          prefix="style/side-right"
          onUploadedKey={(key) => setSidePhotoKey("RIGHT", key)}
          onRemove={() => removeSidePhotoKey("RIGHT")}
        />
      </div>

      <Footer onClick={onNext} />
    </div>
  );
}
