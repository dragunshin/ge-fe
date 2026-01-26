// API 공통 응답 타입
export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

export type ApiUserType = 'MEMBER' | 'TMP_USER' | 'EXPERT';

// 로그인 API
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  nickname: string;
  userType: ApiUserType;
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
  userType: ApiUserType;
}

// 소셜 로그인 API
export interface SocialLoginRequest {
  code: string;
  provider: 'KAKAO';
}

export interface SocialLoginResponse {
  nickname: string;
  role: ApiUserType;
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
  userType: ApiUserType;
}

export interface EmailVerificationRequest {
  email: string;
}

export interface EmailVerificationConfirmRequest {
  email: string;
  code: string;
}

export interface EmailVerificationResponse {
  email: string;
  verified: boolean;
  message: string;
}

// 에러 타입
export interface ApiErrorResponse {
  statusCode: number;
  message: string;
}

export interface ExpertRanking {
  name: string;
  category: string;
  profileImage: string;
  introduction: string;
}

export interface PopularExpertsResponse {
  top3: ExpertRanking[];
}

export interface ExpertInfoResponse {
  userId: number;
  nickname: string;
  profileImage: string;
  backgroundImage?: string;
  category: string;
  specialities: string[];
  introduction: string;
  profileLink: string;
  careerInfo: string;
  likes: number;
}

export interface ExpertScheduleResponse {
  consultationType: 'VIDEO' | 'MESSAGE';
  price: number;
  isActive: boolean;
}

export interface ExpertPortfolioResponse {
  id: number;
  title: string;
  concern: string;
  solution: string;
  isRepresentative: boolean;
  beforeImage?: string;
  afterImage?: string;
  hashtags?: string[];
}

export interface ReviewSummaryResponse {
  reviewId: number;
  expertNickname?: string;
  expertProfileImage?: string;
  expertRatingAverage?: number;
  rating: number;
  content: string;
  mediaUrls: string[];
  likeCount: number;
  category: string;
  createdAt: string;
}

export interface ExpertSummaryResponse {
  expertId: number;
  nickname: string;
  category: string;
  profileImage: string;
  introduction: string;
  ratingAverage: number;
  reviewCount: number;
  representativeReviewImages: string[];
}

export interface PointApplicationResponse {
  originalPrice: number;
  pointsUsed: number;
  finalPrice: number;
  remainingPoints: number;
}
