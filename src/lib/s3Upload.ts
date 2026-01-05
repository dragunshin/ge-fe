type PresignResponse = {
  putUrl: string;
  key: string;
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
