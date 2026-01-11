type PresignResponse = {
  putUrl: string;
  key: string;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

type PresignV2Response = {
  s3Key: string;
  uploadUrl: string;
};

export async function uploadImageViaPresign(opts: {
  file: File;
  prefix: string;
  signal?: AbortSignal;
}): Promise<{ key: string }> {
  const { file, prefix, signal } = opts;

  const presignRes = await fetch("/api/v1/uploads/presign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    signal,
    body: JSON.stringify({
      contentType: file.type,
      prefix,
      filename: file.name,
    }),
  });

  if (!presignRes.ok) throw new Error("presign 요청 실패");

  const { putUrl, key } = (await presignRes.json()) as PresignResponse;

  const putRes = await fetch(putUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
    signal,
  });

  if (!putRes.ok) throw new Error("S3 업로드 실패");

  return { key };
}

export async function uploadImageViaPresignV2(opts: {
  file: File;
  resourceType: string;
  imageType: string;
  signal?: AbortSignal;
}): Promise<{ key: string }> {
  const { file, resourceType, imageType, signal } = opts;

  const presignRes = await fetch(`${API_BASE_URL}/presigned-urls/upload`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    signal,
    body: JSON.stringify({
      resourceType,
      imageType,
      fileName: file.name,
    }),
  });

  if (!presignRes.ok) throw new Error("presign 요청 실패");

  const { s3Key, uploadUrl } = (await presignRes.json()) as PresignV2Response;

  const putRes = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
    signal,
  });

  if (!putRes.ok) throw new Error("S3 업로드 실패");

  return { key: s3Key };
}
