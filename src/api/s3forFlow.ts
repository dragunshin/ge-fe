const API_BASE = import.meta.env.VITE_API_BASE_URL;

export type PresignedUploadReq = {
  resourceType: string;
  resourceId: number | string;
  imageType: string;
  fileName: string;
};

export type PresignedUploadRes = {
  s3Key: string;
  uploadUrl: string;
  downloadUrl: string | null;
  expiresIn: number;
  message?: string;
};

// function safeFileName(original: string) {
//   // 공백/특수문자 최소 정리 (서버가 그대로 path로 쓰면 문제 생길 수 있어서)
//   const cleaned = original.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9._-]/g, "");
//   return cleaned.length ? cleaned : "image.jpg";
// }

// function withUniquePrefix(name: string) {
//   // 같은 파일명 업로드 시 overwrite 방지용 (원하면 제거 가능)
//   const ts = Date.now();
//   return `${ts}-${safeFileName(name)}`;
// }

export async function uploadImageViaPresign(opts: {
  file: File;
  resourceType: string;
  resourceId: number | string;
  imageType: string;
  signal?: AbortSignal;
}): Promise<{ key: string; downloadUrl: string | null }> {
  const { file, resourceType, resourceId, imageType, signal } = opts;

  const presignRes = await fetch(`${API_BASE}/presigned-urls/upload`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    signal,
    body: JSON.stringify({
      resourceType,
      resourceId,
      imageType,
      // fileName: withUniquePrefix(file.name),
      fileName: file.name,
    } satisfies PresignedUploadReq),
  });

  if (!presignRes.ok) {
    const text = await presignRes.text().catch(() => "");
    throw new Error(`presign 요청 실패: ${presignRes.status} ${text}`);
  }

  const { s3Key, uploadUrl, downloadUrl } = (await presignRes.json()) as PresignedUploadRes;

  const putRes = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type || "application/octet-stream" },
    body: file,
    signal,
  });

  if (!putRes.ok) {
    const text = await putRes.text().catch(() => "");
    throw new Error(`S3 업로드 실패: ${putRes.status} ${text}`);
  }

  return { key: s3Key, downloadUrl };
}
