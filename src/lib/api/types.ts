// API 공통 응답 타입
export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

// 로그인 API
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  nickname: string;
  userType: 'MENUAL' | 'EXPERT';
}

// 회원가입 API
export interface SignupRequest {
  nickname: string;
  birth: string; // YYYY-MM-DD
  email: string;
  password: string;
  passwordConfirm: string;
  userType: string;
  agreeTerms: boolean;
  agreePrivacy: boolean;
}

export interface SignupResponse {
  userId: number;
  email: string;
  nickname: string;
  createdAt: string;
  userType: string;
}

// 소셜 로그인 API
export interface SocialLoginRequest {
  code: string;
  provider: 'KAKAO';
}

export interface SocialLoginResponse {
  nickname: string;
  userType: 'TMP_USER' | 'MENUAL' | 'EXPERT';
}

// 소셜 회원 추가정보 입력 API
export interface SocialSignupRequest {
  nickname: string;
  birth: string; // YYYY-MM-DD
  email: string;
  userType: string;
  agreeTerms: boolean;
  agreePrivacy: boolean;
}

export interface SocialSignupResponse {
  nickname: string;
  userType: 'MENUAL' | 'EXPERT';
}

// 에러 타입
export interface ApiErrorResponse {
  statusCode: number;
  message: string;
}
