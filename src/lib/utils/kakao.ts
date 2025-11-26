// 카카오 OAuth 설정
const KAKAO_REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;
const KAKAO_REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;
const KAKAO_AUTH_URL = 'https://kauth.kakao.com/oauth/authorize';

/**
 * 카카오 로그인 페이지로 리다이렉트
 */
export function redirectToKakaoLogin() {
  // 카카오 OAuth 요청 URL 생성
  const params = new URLSearchParams({
    client_id: KAKAO_REST_API_KEY,
    redirect_uri: KAKAO_REDIRECT_URI,
    response_type: 'code',
  });

  const kakaoAuthUrl = `${KAKAO_AUTH_URL}?${params.toString()}`;

  // 카카오 로그인 페이지로 리다이렉트
  window.location.href = kakaoAuthUrl;
}

/**
 * URL에서 인가 코드 추출
 */
export function getKakaoCodeFromUrl(): string | null {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('code');
}

/**
 * URL에서 에러 정보 추출
 */
export function getKakaoErrorFromUrl(): { error: string; error_description: string } | null {
  const urlParams = new URLSearchParams(window.location.search);
  const error = urlParams.get('error');
  const errorDescription = urlParams.get('error_description');

  if (error) {
    return {
      error,
      error_description: errorDescription || '알 수 없는 오류',
    };
  }

  return null;
}
