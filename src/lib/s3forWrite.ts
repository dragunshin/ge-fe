export type PresignedUploadReq = {
  resourceType: string;
  resourceId: number;
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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function stripQuery(url: string) {
  const i = url.indexOf("?");
  return i === -1 ? url : url.slice(0, i);
}

export async function uploadImageViaPresignedUrl(opts: {
  file: File;
  resourceType: "consultation" | string;
  resourceId: number;
  imageType: "hairstyle" | string;
  signal?: AbortSignal;
}): Promise<{ url: string; s3Key: string }> {
  const { file, resourceType, resourceId, imageType, signal } = opts;

  const presignRes = await fetch(`${API_BASE_URL}/presigned-urls/upload`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    signal,
    body: JSON.stringify({
      resourceType,
      resourceId,
      imageType,
      fileName: file.name,
    } satisfies PresignedUploadReq),
  });

  if (!presignRes.ok) throw new Error("presigned url 발급 실패");

  const { s3Key, uploadUrl, downloadUrl } = (await presignRes.json()) as PresignedUploadRes;

  const putRes = await fetch(uploadUrl, {
    method: "PUT",
    body: file,
    signal,
    // 서버가 Content-Type까지 서명에 포함했다면 반드시 일치
    headers: file.type ? { "Content-Type": file.type } : undefined,
  });

  if (!putRes.ok) throw new Error("S3 업로드 실패");

  const url = downloadUrl ?? stripQuery(uploadUrl);

  return { url, s3Key };
}
