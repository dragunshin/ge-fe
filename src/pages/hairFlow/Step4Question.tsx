// import TopNav from "./component/TopNav";
// import Footer from "./component/Footer";
// import { MultiPhotoPicker } from "./component/MultiPhotoPicker";
// import { useStyleSetupStore } from "@/stores/useHairSetupStore";
// import { useNavigate } from "react-router-dom";

// // type SubmitPayload = {
// //   sideLeftKey: string;
// //   sideRightKey: string;
// //   desiredTags: string[];
// //   desiredOtherText: string;
// //   questionText: string;
// //   referenceImageKeys: string[];
// // };

// // async function submitAll(payload: SubmitPayload) {
// //   const res = await fetch("/api/v1/style-setup/submit", {
// //     method: "POST",
// //     headers: { "Content-Type": "application/json" },
// //     credentials: "include",
// //     body: JSON.stringify(payload),
// //   });
// //   if (!res.ok) throw new Error("제출 실패");
// //   return res.json();
// // }

// // export function Step3Question({ onBack, onDone }: { onBack?: () => void; onDone?: () => void }) {
// export function Step4Question({
//   reservationId,
//   onBack,
// }: {
//   reservationId: string;
//   onBack?: () => void;
//   onDone?: () => void;
// }) {
//   const s = useStyleSetupStore();
//   const nav = useNavigate();

//   const canSubmit =
//     Boolean(s.sidePhotoKeys.LEFT && s.sidePhotoKeys.RIGHT) && s.questionText.length <= 400;

//   // const handleSubmit = async () => {
//   //   if (!s.sidePhotoKeys.LEFT || !s.sidePhotoKeys.RIGHT) return;

//   //   try {
//   //     await submitAll({
//   //       sideLeftKey: s.sidePhotoKeys.LEFT,
//   //       sideRightKey: s.sidePhotoKeys.RIGHT,
//   //       desiredTags: s.desiredTags,
//   //       desiredOtherText: s.desiredOtherText,
//   //       questionText: s.questionText,
//   //       referenceImageKeys: s.referenceImageKeys,
//   //     });

//   //     // 필요하면 제출 후 초기화
//   //     // s.resetAll();

//   //     onDone?.();
//   //     alert("제출 완료!");
//   //   } catch {
//   //     alert("제출에 실패했어요. 다시 시도해주세요.");
//   //   }
//   // };

//   const handleSubmit = async () => {
//     // 라우팅 수정 신용섭: 원본
//     // nav("/payment/order");
//     // 라우팅 수정 신용섭: 결제에서 마지막 단계로 복귀할 수 있도록 step 전달
//     nav("/payment/order", { state: { from: "/hair/setup", step: 3 } });
//   };

//   return (
//     <div className="mx-auto bg-white">
//       <TopNav onBack={onBack} />

//       <div className="px-4">
//         <p className="pre_body_med_16 text-[#008bff]">7/7</p>

//         <p className="mt-2 pre_title_semi_20 text-[#0f0f10]">
//           스타일링 시 느낀 어려움이나 궁금증이 있다면 알려주세요.
//         </p>
//         <p className="mt-2 pre_body_reg_14 leading-relaxed text-[#656870]">
//           상담하실 전문가에게 전달해드려요.
//         </p>

//         <div className="mt-5">
//           <div className="relative">
//             <textarea
//               value={s.questionText}
//               onChange={(e) => s.setQuestionText(e.target.value)}
//               placeholder=""
//               className="h-[177px] w-full bg-[#f4f4f5] pre_body_reg_14 placeholder:text-[#989ba2] resize-none rounded-[8px] border border-[#e1e2e4] px-4 py-3 pb-8 outline-none"
//             />
//             <div className="absolute bottom-5 right-4 pre_body_reg_14">
//               <span className="text-[#008bff]">{s.questionText.length}</span>
//               <span className="text-[#656870]">/400</span>
//             </div>
//           </div>
//         </div>

//         <MultiPhotoPicker
//           keys={s.referenceImageKeys}
//           max={3}
//           prefix="style/reference"
//           onAddKey={s.addReferenceKey}
//           onRemoveKey={s.removeReferenceKey}
//         />
//       </div>

//       <Footer label="다음" disabled={canSubmit} onClick={handleSubmit} />
//       {/* <Footer label="다음" disabled={!canSubmit} onClick={handleSubmit} /> */}
//     </div>
//   );
// }

import TopNav from "./component/TopNav";
import Footer from "./component/Footer";
import { MultiPhotoPicker } from "./component/MultiPhotoPicker";
import { useStyleSetupStore } from "@/stores/useHairSetupStore";
import { useNavigate } from "react-router-dom";

export function Step4Question({
  reservationId,
  onBack,
}: {
  reservationId: string;
  onBack?: () => void;
  onDone?: () => void;
}) {
  const s = useStyleSetupStore();
  const nav = useNavigate();

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const canSubmit =
    Boolean(
      s.images.hairstyle?.[0] && s.images.front?.[0] && s.images.left?.[0] && s.images.right?.[0],
    ) && s.questionText.length <= 400;

  const handleSubmit = async () => {
    try {
      // 마지막에 persist에 모인 값으로 payload 생성
      const body = s.buildHairConcernBody();

      const res = await fetch(`${API_BASE}/reservations/${reservationId}/hair-concern`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`제출 실패: ${res.status} ${text}`);
      }

      // 저장 후 초기화: 결제에서 뒤로 돌아올 수 있다면 유지하는 것도 방법
      // s.resetAll();
      //reservationId 추가
      nav(`/payment/order?reservationId=${reservationId}`, {
        state: { from: `/hair/setup?reservationId=${reservationId}`, step: 3 },
      });
    } catch (e) {
      console.error(e);
      alert("제출에 실패했어요. 다시 시도해주세요.");
    }
  };

  return (
    <div className="mx-auto bg-white">
      <TopNav onBack={onBack} />

      <div className="px-4">
        <p className="pre_body_med_16 text-[#008bff]">7/7</p>

        <p className="mt-2 pre_title_semi_20 text-[#0f0f10]">
          스타일링 시 느낀 어려움이나 궁금증이 있다면 알려주세요.
        </p>
        <p className="mt-2 pre_body_reg_14 leading-relaxed text-[#656870]">
          상담하실 전문가에게 전달해드려요.
        </p>

        <div className="mt-5">
          <div className="relative">
            <textarea
              value={s.questionText}
              onChange={(e) => s.setQuestionText(e.target.value)}
              placeholder=""
              className="h-[177px] w-full bg-[#f4f4f5] pre_body_reg_14 placeholder:text-[#989ba2] resize-none rounded-[8px] border border-[#e1e2e4] px-4 py-3 pb-8 outline-none"
            />
            <div className="absolute bottom-5 right-4 pre_body_reg_14">
              <span className="text-[#008bff]">{s.questionText.length}</span>
              <span className="text-[#656870]">/400</span>
            </div>
          </div>
        </div>

        <MultiPhotoPicker
          keys={s.images.difficulty}
          max={3}
          resourceType="consultation"
          resourceId={reservationId}
          imageType="difficulty"
          onAddKey={(key) => s.addImage("difficulty", key, 3)}
          onRemoveKey={(key) => s.removeImage("difficulty", key)}
        />
      </div>

      <Footer label="다음" disabled={!canSubmit} onClick={handleSubmit} />
    </div>
  );
}
