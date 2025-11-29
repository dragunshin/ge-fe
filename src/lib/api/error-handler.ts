import type { AxiosError } from 'axios';
import type { ApiErrorResponse } from './types';

// API 에러 코드별 메시지 매핑
export const ERROR_MESSAGES: Record<number, string> = {
  // 회원가입 에러 (1001-1008)
  1001: '닉네임 형식이 올바르지 않습니다.',
  1002: '이미 사용 중인 닉네임입니다.',
  1003: '비밀번호 형식이 올바르지 않습니다.',
  1004: '생년월일 형식이 올바르지 않습니다.',
  1005: '이메일 형식이 올바르지 않습니다.',
  1006: '이미 가입된 이메일입니다.',
  1007: '필수 약관 및 개인정보 처리에 동의해야 합니다.',
  1008: '비밀번호가 일치하지 않습니다.',

  // 로그인 에러 (1101-1102) - 보안상 통합된 메시지 사용
  1101: '이메일 또는 비밀번호가 일치하지 않습니다.',
  1102: '이메일 또는 비밀번호가 일치하지 않습니다.',

  // 소셜 로그인 에러 (1103)
  1103: '인가 코드가 유효하지 않습니다.',
};

// 에러 메시지 추출 함수
export function getErrorMessage(error: unknown): string {
  // AxiosError 타입 체크
  if (isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorResponse>;

    // 서버 응답이 있는 경우
    if (axiosError.response?.data) {
      const { statusCode, message } = axiosError.response.data;

      // 에러 코드에 해당하는 메시지가 있으면 반환
      if (statusCode && ERROR_MESSAGES[statusCode]) {
        return ERROR_MESSAGES[statusCode];
      }

      // 서버에서 제공한 메시지가 있으면 반환
      if (message) {
        return message;
      }
    }

    // 네트워크 에러
    if (axiosError.code === 'ERR_NETWORK') {
      return '네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.';
    }

    // 타임아웃 에러
    if (axiosError.code === 'ECONNABORTED') {
      return '요청 시간이 초과되었습니다. 다시 시도해주세요.';
    }

    // 401 Unauthorized
    if (axiosError.response?.status === 401) {
      return '인증이 만료되었습니다. 다시 로그인해주세요.';
    }

    // 403 Forbidden
    if (axiosError.response?.status === 403) {
      return '접근 권한이 없습니다.';
    }

    // 404 Not Found
    if (axiosError.response?.status === 404) {
      return '요청한 리소스를 찾을 수 없습니다.';
    }

    // 500 Internal Server Error
    if (axiosError.response?.status === 500) {
      return '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
    }

    // 502 Bad Gateway
    if (axiosError.response?.status === 502) {
      return '서버와 통신 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.';
    }

    // 503 Service Unavailable
    if (axiosError.response?.status === 503) {
      return '서비스를 일시적으로 사용할 수 없습니다. 잠시 후 다시 시도해주세요.';
    }
  }

  // 기본 에러 메시지
  return '알 수 없는 오류가 발생했습니다. 다시 시도해주세요.';
}

// AxiosError 타입 가드
function isAxiosError(error: unknown): error is AxiosError {
  return (error as AxiosError).isAxiosError === true;
}

// 에러 핸들러 훅에서 사용할 수 있는 유틸리티
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// 에러를 ApiError로 변환
export function handleApiError(error: unknown): ApiError {
  const message = getErrorMessage(error);

  if (isAxiosError(error)) {
    const statusCode = error.response?.data?.statusCode || error.response?.status || 0;
    return new ApiError(statusCode, message, error);
  }

  return new ApiError(0, message, error);
}
