import { api } from '../lib/api/client';
import type {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
  SocialLoginRequest,
  SocialLoginResponse,
  SocialSignupRequest,
  SocialSignupResponse,
} from '../lib/api/types';

// 인증 관련 API 서비스
export const authService = {
  // 로그인
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return await api.post<ApiResponse<LoginResponse>>('/auth/login', credentials);
  },

  // 회원가입
  async signup(data: SignupRequest): Promise<ApiResponse<SignupResponse>> {
    return await api.post<ApiResponse<SignupResponse>>('/user/signup', data);
  },

  // 소셜 로그인 (카카오)
  async socialLogin(data: SocialLoginRequest): Promise<ApiResponse<SocialLoginResponse>> {
    return await api.post<ApiResponse<SocialLoginResponse>>('/auth/social-login', data);
  },

  // 소셜 회원 추가정보 입력
  async socialSignup(data: SocialSignupRequest): Promise<ApiResponse<SocialSignupResponse>> {
    return await api.post<ApiResponse<SocialSignupResponse>>('/auth/social-signup', data);
  },

  // 로그아웃
  async logout(): Promise<void> {
    // HttpOnly 쿠키는 서버에서 제거
    await api.post('/auth/logout');
  },
};
