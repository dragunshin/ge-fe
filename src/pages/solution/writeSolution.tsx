import { useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }],
    ["link"],
    ["clean"],
  ],
};

const quillFormats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "color",
  "background",
  "list",
  "bullet",
  "align",
  "link",
];

export default function EditorPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const send = () => {
    console.log({ title, content });
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <Card className="w-full max-w-3xl border-slate-200 shadow-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-lg font-semibold text-slate-900">
            "박오징"님에 대한 솔루션지 작성
          </CardTitle>
          <CardDescription className="text-sm text-slate-500">
            제가 왜 깡마른이에요? 그리고 그런 옷 입으면 더 말라보이는거 아니에요? 이론 옷은 안
            돼요?제가 왜 깡마른이에요? 그리고 그런 옷 입으면 더 말라보이는거 아니에요? 이론 옷은 안
            돼요?제가 왜 깡마른이에요? 그리고 그런 옷 입으면 더 말라보이는거 아니에요? 이론 옷은 안
            돼요?제가 왜 깡마른이에요? 그리고 그런 옷 입으면 더 말라보이는거 아니에요? 이론 옷은 안
            돼요?
          </CardDescription>
        </CardHeader>

        <Separator />

        <CardContent className="space-y-6 pt-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium text-slate-700">
              제목
            </Label>
            <Input
              id="title"
              placeholder="제목을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-slate-200 text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">내용</Label>

            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              modules={quillModules}
              formats={quillFormats}
              placeholder="내용을 입력하세요..."
              className="
                mt-1
                rounded-xl border border-slate-200 bg-white
                [&_.ql-toolbar]:rounded-t-xl
                [&_.ql-toolbar]:border-b-slate-200
                [&_.ql-toolbar]:bg-slate-50
                [&_.ql-container]:rounded-b-xl
                [&_.ql-container]:border-0
                [&_.ql-editor]:min-h-[260px]
                [&_.ql-editor]:text-sm
              "
            />
          </div>

          <div className="flex items-center justify-end pt-2">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                className="h-9 rounded-lg border-slate-200 px-4 text-xs font-medium text-slate-600"
              >
                임시 저장
              </Button>
              <Button
                type="button"
                onClick={send}
                className="h-9 rounded-lg bg-slate-900 px-5 text-xs font-semibold text-white hover:bg-slate-800"
              >
                전송하기
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
