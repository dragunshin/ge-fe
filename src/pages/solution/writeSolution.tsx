// import { useCallback, useMemo, useRef, useState, useEffect } from "react";
// import ReactQuill from "react-quill-new";
// import "react-quill-new/dist/quill.snow.css";

// import { useConsultationConcern } from "@/hooks/useConsulation";
// import { ConcernContent } from "./component/ConcernContent";

// import { uploadImageViaPresignedUrl } from "@/lib/s3forWrite";

// import { postConsultationSolution } from "@/api/solution";
// import { useNavigate } from "react-router-dom";

// import { Button } from "@/components/ui/button";
// import { Card, CardHeader, CardContent } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";
// import { useParams } from "react-router-dom";
// import Back from "@/images/login/back.svg?react";
// import { HAIR_SOLUTION_TEMPLATE_HTML, FASHION_SOLUTION_TEMPLATE_HTML } from "./solutionTemplates";

// const quillFormats = [
//   "header",
//   "bold",
//   "italic",
//   "underline",
//   "strike",
//   "color",
//   "background",
//   "list",
//   "align",
//   "link",
//   "image",
// ];

// /**
//  * ✅ “헤어 솔루션 문항” 기본 템플릿 (HTML)
//  * - ReactQuill value는 HTML 문자열이므로 이 형태가 가장 안정적입니다.
//  * - 필요하면 텍스트(XXX 등)만 수정해서 디폴트 문구를 바꿀 수 있어요.
//  */
// const DEFAULT_SOLUTION_TEMPLATE_HTML = `
//   <h2>헤어 솔루션 문항</h2>
//   <p><br/></p>

//   <h3>0. 목차</h3>
//   <p>나의 유형, 얼굴 분석, 헤어스타일 추천, 참고, 전문가의 조언</p>
//   <p><br/></p>

//   <h3>1. 나의 유형</h3>
//   <p><strong>- 얼굴형:</strong> XXX 타입</p>
//   <p><strong>- 주요 키워드:</strong> (예: 직모 / 장발 / 중안부)</p>
//   <p><strong>- 추천 헤어 포인트(한 줄):</strong> (한 줄 소개)</p>
//   <p><strong>- 이미지 컬러:</strong> (예: Warm / Cool / Natural / Trendy 등)</p>
//   <p><strong>- 얼굴 유형 분류:</strong> Mood + Type (예: Cute + Rectangle)</p>
//   <p><br/></p>

//   <h3>2-1. 얼굴 비율 분석</h3>
//   <p>- 얼굴의 가로폭과 세로폭 비율을 황금비율과 비교</p>
//   <p>- 좌우 비대칭 여부</p>
//   <p>- 상안부 / 중안부 / 하안부 비율</p>
//   <p><strong>→ 얼굴 비율에 따른 특징 및 인상:</strong> (서술)</p>
//   <p><br/></p>

//   <h3>2-2. 얼굴 특징 분석</h3>
//   <p><strong>- 선택한 장점 특징:</strong> (예: 눈 / 얼굴형 등)</p>
//   <p><strong>- 선택한 단점 특징:</strong> (예: 광대 / 넓은 이마 등)</p>
//   <p><strong>- 실제 본인 얼굴 장/단점 정리:</strong> (서술)</p>
//   <p><strong>- 장점을 살리고 단점을 보완하는 추천 헤어스타일(이름만):</strong></p>
//   <ul>
//     <li>(헤어스타일 이름 1)</li>
//     <li>(헤어스타일 이름 2)</li>
//     <li>(헤어스타일 이름 3)</li>
//   </ul>
//   <p><strong>- 이목구비에 따른 풍기는 이미지 분석:</strong> (서술)</p>
//   <p><br/></p>

//   <h3>3. 헤어스타일 추천</h3>
//   <p><strong>원하는 이미지:</strong> (예: sexy / clean / cute / strong / reliable / bold / natural / warm / cool / trendy)</p>
//   <p><strong>추천 이미지:</strong> (추가로 어울리는 이미지)</p>
//   <p><br/></p>

//   <h4>3-1) 베스트 헤어스타일 #1</h4>
//   <p><strong>- 스타일명:</strong> (예: 리프컷, 투블럭 가르마펌 등)</p>
//   <p><strong>- 참고 사진:</strong> (이미지 첨부)</p>
//   <p><strong>- 스타일 상세 설명:</strong></p>
//   <ul>
//     <li>가르마 비율: (예: 6:4 / 7:3)</li>
//     <li>앞머리 기장: (예: 눈썹 덮음 / 눈썹 위)</li>
//     <li>다운펌/볼륨펌/아이롱/매직 등: (유/무)</li>
//     <li>다른 헤어와 비교 포인트: (서술)</li>
//   </ul>
//   <p><strong>- 왜 이 이미지에 베스트인지:</strong> (서술)</p>
//   <p><strong>- 왜 얼굴형에 어울리는지:</strong> (서술)</p>
//   <p><strong>- 스타일링 가이드:</strong></p>
//   <ul>
//     <li>드라이 방법: (서술)</li>
//     <li>제품 추천: (예: 왁스/무스/스프레이/오일 등)</li>
//     <li>고데기 사용 시: (각도/방향/컬 크기 등)</li>
//     <li>참고 영상: (링크/키워드)</li>
//   </ul>
//   <p><strong>- 미용실에서 이렇게 말하기:</strong> (요청 문장 예시)</p>
//   <p><br/></p>

//   <h4>3-2) 베스트 헤어스타일 #2</h4>
//   <p><strong>- 스타일명:</strong> (예: ...)</p>
//   <p><strong>- 참고 사진:</strong> (이미지 첨부)</p>
//   <p><strong>- 스타일 상세 설명 / 이유 / 가이드 / 미용실 멘트:</strong> (위와 동일한 포맷으로 작성)</p>
//   <p><br/></p>

//   <h4>3-3) 워스트 헤어스타일</h4>
//   <p><strong>- 워스트 스타일명:</strong> (예: ...)</p>
//   <p><strong>- 왜 비추천인지:</strong> 얼굴형에서 어떤 단점이 더 부각되는지 (서술)</p>
//   <p><br/></p>

//   <h3>4. 참고</h3>
//   <ul>
//     <li>참고할만한 스타일링 영상: (링크/키워드)</li>
//     <li>추천 받은 머리를 한 사람들 사진: (이미지 첨부)</li>
//     <li>추천 제품: (제품명/용도/사용법)</li>
//   </ul>
//   <p><br/></p>

//   <h3>5. 전문가의 조언</h3>
//   <ul>
//     <li>내용 요약: (핵심 요약)</li>
//     <li>스타일링 시 명심할 것: (주의점/습관)</li>
//     <li>기타 전문가의 말: (추가 팁)</li>
//   </ul>

//   <p><br/></p>
//   <hr/>
//   <p><strong>얼굴 유형 분류 예시</strong></p>
//   <p><strong>Mood:</strong> sexy, clean, cute, strong, reliable, bold, natural, warm, cool, trendy</p>
//   <p><strong>Type:</strong> Rectangle, Oval, Square, Heart, Diamond, Round, Triangle, Oblong</p>
// `;

// export default function EditorPage() {
//   const [content, setContent] = useState<string>(DEFAULT_SOLUTION_TEMPLATE_HTML);
//   const [isUploadingImage, setIsUploadingImage] = useState(false);
//   const { consultationId } = useParams();

//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const submitAbortRef = useRef<AbortController | null>(null);
//   const nav = useNavigate();

//   const consultationIdNum = useMemo(() => {
//     const n = Number(consultationId);
//     return Number.isFinite(n) ? n : null;
//   }, [consultationId]);

//   // 업로드용 id는 0 fallback
//   const resourceId = consultationIdNum ?? 0;

//   //  고민지 fetch (nickname/title에 씀)
//   const {
//     data: concern,
//     loading: concernLoading,
//     error: concernError,
//   } = useConsultationConcern(consultationIdNum);

//   const memberNickname = concern?.nickname;

//   const quillRef = useRef<ReactQuill | null>(null);
//   const fileInputRef = useRef<HTMLInputElement | null>(null);
//   const abortRef = useRef<AbortController | null>(null);

//   //  consultationId를 number로 안전 변환 (없거나 NaN이면 0)
//   // const resourceId = useMemo(() => {
//   //   const n = Number(consultationId);
//   //   return Number.isFinite(n) ? n : 0;
//   // }, [consultationId]);

//   useEffect(() => {
//     return () => {
//       abortRef.current?.abort();
//     };
//   }, []);

//   const insertImage = useCallback(
//     async (file: File) => {
//       abortRef.current?.abort();
//       const ac = new AbortController();
//       abortRef.current = ac;

//       setIsUploadingImage(true);
//       try {
//         const { url } = await uploadImageViaPresignedUrl({
//           file,
//           resourceType: "consultation",
//           imageType: "hairstyle",
//           resourceId,
//           signal: ac.signal,
//         });

//         const editor = quillRef.current?.getEditor?.();
//         if (!editor) return;

//         const range = editor.getSelection?.(true);
//         const index = range?.index ?? editor.getLength?.() ?? 0;

//         editor.insertEmbed(index, "image", url, "user");
//         editor.setSelection(index + 1, 0, "silent");
//       } catch (e) {
//         if ((e as any)?.name !== "AbortError") {
//           console.error(e);
//           alert(
//             "이미지 업로드에 실패했어요. (버킷이 private면 downloadUrl 발급이 필요할 수 있어요)",
//           );
//         }
//       } finally {
//         setIsUploadingImage(false);
//       }
//     },
//     [resourceId],
//   );

//   const onToolbarImage = useCallback(() => {
//     fileInputRef.current?.click();
//   }, []);

//   const quillModules = useMemo(
//     () => ({
//       toolbar: {
//         container: [
//           [{ header: [1, 2, 3, false] }],
//           ["bold", "italic", "underline", "strike"],
//           [{ color: [] }, { background: [] }],
//           [{ list: "ordered" }, { list: "bullet" }],
//           [{ align: [] }],
//           ["link", "image"],
//         ],
//         handlers: {
//           image: onToolbarImage,
//         },
//       },
//     }),
//     [onToolbarImage],
//   );

//   const onPickImage = useCallback(
//     async (e: React.ChangeEvent<HTMLInputElement>) => {
//       const file = e.target.files?.[0];
//       e.target.value = "";
//       if (!file) return;

//       if (!file.type.startsWith("image/")) {
//         alert("이미지 파일만 업로드할 수 있어요.");
//         return;
//       }

//       const MAX_MB = 10;
//       if (file.size > MAX_MB * 1024 * 1024) {
//         alert(`이미지는 최대 ${MAX_MB}MB까지 업로드할 수 있어요.`);
//         return;
//       }

//       await insertImage(file);
//     },
//     [insertImage],
//   );

//   const send = useCallback(async () => {
//     if (!consultationIdNum) {
//       alert("consultationId가 올바르지 않아요.");
//       return;
//     }

//     // Quill 기본 빈 값 방어 (원하면 더 엄격하게)
//     const trimmed = content.replace(/<(.|\n)*?>/g, "").trim(); // 태그 제거 후 텍스트만
//     if (!trimmed) {
//       alert("내용을 입력해 주세요.");
//       return;
//     }

//     // 이전 전송 중이면 취소
//     submitAbortRef.current?.abort();
//     const ac = new AbortController();
//     submitAbortRef.current = ac;

//     setIsSubmitting(true);
//     try {
//       await postConsultationSolution(consultationIdNum, content, ac.signal);

//       alert("솔루션이 전송되었어요.");
//       // 필요하면 이동
//       nav("/");
//     } catch (e) {
//       if (ac.signal.aborted) return;
//       const msg = e instanceof Error ? e.message : "Unknown error";
//       alert(`전송 실패: ${msg}`);
//     } finally {
//       if (!ac.signal.aborted) setIsSubmitting(false);
//     }
//   }, [consultationIdNum, content]);

//   useEffect(() => {
//     return () => {
//       abortRef.current?.abort(); // 이미지 업로드
//       submitAbortRef.current?.abort(); // 솔루션 전송
//     };
//   }, []);

//   return (
//     <main className="min-h-full flex items-center justify-center py-1 px-[0px] overflow-y-auto scrollbar-hide">
//       <Card className="w-full border-none shadow-none px-4">
//         <CardHeader className="space-y-1 px-0">
//           {/* Top bar */}
//           <header className="px-0">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center px-0">
//                 <button onClick={() => nav(-1)} className="mr-[8px]">
//                   <Back className="w-[18px] h-[18px]" />
//                 </button>
//                 <p className="pre_title_semi_18 ml-1">{memberNickname}님에 대한 솔루션지 작성</p>
//               </div>
//             </div>
//           </header>
//           {/* <CardTitle className="text-lg font-semibold text-slate-900">
//             {memberNickname ? `"${memberNickname}"님에 대한 솔루션지 작성` : "솔루션지 작성"}
//           </CardTitle> */}

//           <div className="mt-4">
//             {concernLoading && (
//               <div className="rounded-2xl border border-[#dbdcdf] bg-white p-4 text-sm text-slate-500">
//                 고민지 불러오는 중…
//               </div>
//             )}

//             {concernError && (
//               <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
//                 고민지 로드 실패: {concernError}
//               </div>
//             )}

//             {!concernLoading && !concernError && concern?.hair && (
//               <div className="rounded-xl bg-white p-0">
//                 <ConcernContent hair={concern.hair} />
//               </div>
//             )}
//           </div>
//         </CardHeader>

//         <Separator />

//         <CardContent className="space-y-6 px-1 pt-6">
//           <div className="space-y-2">
//             <div className="flex items-center justify-between">
//               {isUploadingImage && (
//                 <span className="text-xs text-slate-500">이미지 업로드 중…</span>
//               )}
//             </div>

//             <input
//               ref={fileInputRef}
//               type="file"
//               accept="image/*"
//               className="hidden"
//               onChange={onPickImage}
//             />

//             <ReactQuill
//               ref={quillRef}
//               theme="snow"
//               value={content}
//               onChange={setContent}
//               modules={quillModules}
//               formats={quillFormats}
//               placeholder="내용을 입력해 주세요"
//               className="
//                w-full
//                 mt-1
//                 rounded-xl border border-[#dbdcdf] bg-white
//                 [&_.ql-toolbar]:rounded-t-xl
//                 [&_.ql-toolbar]:border-[#dbdcdf]
//                 [&_.ql-toolbar]:bg-[#F6F6F7]
//                 [&_.ql-container]:rounded-b-xl
//                 [&_.ql-container]:border-0
//                 [&_.ql-editor]:min-h-[260px]
//                 [&_.ql-editor]:text-sm
//               "
//             />
//           </div>

//           <div className="flex items-center justify-center pt-2">
//             <div className="flex items-center gap-2">
//               {/* <Button
//                 type="button"
//                 onClick={send}
//                 className="h-9 rounded-lg bg-slate-900 px-5 text-xs font-semibold text-white hover:bg-slate-800"
//                 disabled={isUploadingImage}
//               >
//                 전송하기
//               </Button> */}

//               <Button
//                 type="button"
//                 onClick={send}
//                 className="w-[325px] h-11 rounded-sm bg-slate-900 px-5 pre_body_med_14 text-white hover:bg-slate-800"
//                 disabled={isUploadingImage || isSubmitting}
//               >
//                 {isSubmitting ? "전송 중..." : "솔루션 작성"}
//               </Button>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </main>
//   );
// }

import { useCallback, useMemo, useRef, useState, useEffect } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

import { useConsultationConcern } from "@/hooks/useConsulation";
import { ConcernContent } from "./component/ConcernContent";

import { uploadImageViaPresignedUrl } from "@/lib/s3forWrite";

import { postConsultationSolution } from "@/api/solution";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useParams } from "react-router-dom";
import Back from "@/images/login/back.svg?react";
import { HAIR_SOLUTION_TEMPLATE_HTML, FASHION_SOLUTION_TEMPLATE_HTML } from "./solutionTemplates";
import { FashionConcernContent } from "./component/FashionConcernContent";

const quillFormats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "color",
  "background",
  "list",
  "align",
  "link",
  "image",
];

export default function EditorPage() {
  // ✅ 초기 템플릿: 헤어로 시작(이후 concern.type에 따라 자동 교체)
  const [content, setContent] = useState<string>(HAIR_SOLUTION_TEMPLATE_HTML);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const { consultationId } = useParams();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitAbortRef = useRef<AbortController | null>(null);
  const nav = useNavigate();

  const consultationIdNum = useMemo(() => {
    const n = Number(consultationId);
    return Number.isFinite(n) ? n : null;
  }, [consultationId]);

  const resourceId = consultationIdNum ?? 0;

  const {
    data: concern,
    loading: concernLoading,
    error: concernError,
  } = useConsultationConcern(consultationIdNum);

  // const memberNickname = concern?.nickname;

  const quillRef = useRef<ReactQuill | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // ✅ 유저가 에디터를 한 번이라도 수정했는지 (자동 템플릿 교체 방지)
  const dirtyRef = useRef(false);

  // ✅ Quill onChange 전용 (dirty 표시)
  // const onChangeContent = useCallback((v: string) => {
  //   dirtyRef.current = true;
  //   setContent(v);
  // }, []);

  const onChangeContent = useCallback(
    (v: string, _delta: any, source: "user" | "api" | "silent") => {
      if (source === "user") dirtyRef.current = true; // ✅ 유저 입력만 dirty
      setContent(v);
    },
    [],
  );

  // ✅ consultationId 바뀌면 상태 초기화(다른 상담으로 이동 시)
  useEffect(() => {
    dirtyRef.current = false;
    setContent(HAIR_SOLUTION_TEMPLATE_HTML);
  }, [consultationIdNum]);

  const concernType = concern?.type === "FASHION" ? "FASHION" : "HAIR";

  // const concernType = useMemo<"HAIR" | "FASHION">(() => {
  //   const t = (concern as any)?.type;
  //   if (t === "FASHION") return "FASHION";
  //   if (t === "HAIR") return "HAIR";
  //   // type이 없을 수도 있으니 키로 추론
  //   if (concern && "fashion" in (concern as any) && (concern as any).fashion) return "FASHION";
  //   return "HAIR";
  // }, [concern]);

  //const concernType = concern?.type === "FASHION" ? "FASHION" : "HAIR";
  const memberNickname = concern?.nickname;

  useEffect(() => {
    if (!concern) return;
    if (dirtyRef.current) return;

    const next =
      concernType === "FASHION" ? FASHION_SOLUTION_TEMPLATE_HTML : HAIR_SOLUTION_TEMPLATE_HTML;

    setContent(next);
  }, [concern, concernType]);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const insertImage = useCallback(
    async (file: File) => {
      abortRef.current?.abort();
      const ac = new AbortController();
      abortRef.current = ac;

      setIsUploadingImage(true);
      try {
        const { url } = await uploadImageViaPresignedUrl({
          file,
          resourceType: "consultation",
          imageType: "hairstyle",
          resourceId,
          signal: ac.signal,
        });

        const editor = quillRef.current?.getEditor?.();
        if (!editor) return;

        const range = editor.getSelection?.(true);
        const index = range?.index ?? editor.getLength?.() ?? 0;

        editor.insertEmbed(index, "image", url, "user");
        editor.setSelection(index + 1, 0, "silent");
      } catch (e) {
        if ((e as any)?.name !== "AbortError") {
          console.error(e);
          alert(
            "이미지 업로드에 실패했어요. (버킷이 private면 downloadUrl 발급이 필요할 수 있어요)",
          );
        }
      } finally {
        setIsUploadingImage(false);
      }
    },
    [resourceId],
  );

  const onToolbarImage = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const quillModules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ color: [] }, { background: [] }],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ align: [] }],
          ["link", "image"],
        ],
        handlers: {
          image: onToolbarImage,
        },
      },
    }),
    [onToolbarImage],
  );

  const onPickImage = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = "";
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        alert("이미지 파일만 업로드할 수 있어요.");
        return;
      }

      const MAX_MB = 10;
      if (file.size > MAX_MB * 1024 * 1024) {
        alert(`이미지는 최대 ${MAX_MB}MB까지 업로드할 수 있어요.`);
        return;
      }

      await insertImage(file);
    },
    [insertImage],
  );

  const send = useCallback(async () => {
    if (!consultationIdNum) {
      alert("consultationId가 올바르지 않아요.");
      return;
    }

    const trimmed = content.replace(/<(.|\n)*?>/g, "").trim();
    if (!trimmed) {
      alert("내용을 입력해 주세요.");
      return;
    }

    submitAbortRef.current?.abort();
    const ac = new AbortController();
    submitAbortRef.current = ac;

    setIsSubmitting(true);
    try {
      await postConsultationSolution(consultationIdNum, content, ac.signal);
      alert("솔루션이 전송되었어요.");
      nav(-1);
    } catch (e) {
      if (ac.signal.aborted) return;
      const msg = e instanceof Error ? e.message : "Unknown error";
      alert(`전송 실패: ${msg}`);
    } finally {
      if (!ac.signal.aborted) setIsSubmitting(false);
    }
  }, [consultationIdNum, content, nav]);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      submitAbortRef.current?.abort();
    };
  }, []);

  return (
    <main className="min-h-full flex items-center justify-center py-1 px-[0px] overflow-y-auto scrollbar-hide">
      <Card className="w-full border-none shadow-none px-4">
        <CardHeader className="space-y-1 px-0">
          {/* Top bar */}
          <header className="px-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center px-0">
                <button onClick={() => nav(-1)} className="mr-[8px]">
                  <Back className="w-[18px] h-[18px]" />
                </button>
                {/* ✅ 디자인 유지: 텍스트만 undefined 방지 */}
                <p className="pre_title_semi_18 ml-1">
                  {(memberNickname ?? "") + "님에 대한 솔루션지 작성"}
                </p>
              </div>
            </div>
          </header>

          <div className="mt-4">
            {concernLoading && (
              <div className="rounded-2xl border border-[#dbdcdf] bg-white p-4 text-sm text-slate-500">
                고민지 불러오는 중…
              </div>
            )}
            {concernError && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                고민지 로드 실패: {concernError}
              </div>
            )}
            {/* ✅ HAIR일 때 */}
            {!concernLoading &&
              !concernError &&
              concernType === "HAIR" &&
              (concern as any)?.hair && (
                <div className="rounded-xl bg-white p-0">
                  <ConcernContent hair={(concern as any).hair} />
                </div>
              )}
            {/* ✅ FASHION일 때 (패션 컴포넌트가 있을 경우 활성화) */}
            {!concernLoading &&
              !concernError &&
              concernType === "FASHION" &&
              (concern as any)?.fashion && (
                <div className="rounded-xl bg-white p-0">
                  <FashionConcernContent fashion={(concern as any).fashion} />
                </div>
              )}
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="space-y-6 px-1 pt-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              {isUploadingImage && (
                <span className="text-xs text-slate-500">이미지 업로드 중…</span>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onPickImage}
            />

            <ReactQuill
              ref={quillRef}
              theme="snow"
              value={content}
              // ✅ setContent 대신 dirty 처리되는 핸들러
              onChange={onChangeContent}
              modules={quillModules}
              formats={quillFormats}
              placeholder="내용을 입력해 주세요"
              className="
               w-full
                mt-1
                rounded-xl border border-[#dbdcdf] bg-white
                [&_.ql-toolbar]:rounded-t-xl
                [&_.ql-toolbar]:border-[#dbdcdf]
                [&_.ql-toolbar]:bg-[#F6F6F7]
                [&_.ql-container]:rounded-b-xl
                [&_.ql-container]:border-0
                [&_.ql-editor]:min-h-[260px]
                [&_.ql-editor]:text-sm
              "
            />
          </div>

          <div className="flex items-center justify-center pt-2">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                onClick={send}
                className="w-[325px] h-11 rounded-sm bg-slate-900 px-5 pre_body_med_14 text-white hover:bg-slate-800"
                disabled={isUploadingImage || isSubmitting}
              >
                {isSubmitting ? "전송 중..." : "솔루션 작성"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
