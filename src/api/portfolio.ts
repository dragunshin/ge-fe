export type PostExpertPortfolioBody = {
  title: string;
  concern: string;
  solution: string;
  beforeImage: string;
  afterImage: string;
  hashtags: string[];
};

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL ?? "";

export async function postExpertPortfolio(body: PostExpertPortfolioBody) {
  const res = await fetch(`${API_BASE}/expert/portfolios`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `포트폴리오 등록 실패 (HTTP ${res.status})`);
  }

  return res.json();
}
