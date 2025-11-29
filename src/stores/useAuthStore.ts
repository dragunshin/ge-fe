import { create } from 'zustand';

// 사용자 정보 타입
export interface User {
  nickname: string;
  userType: 'MENUAL' | 'EXPERT';
}

// Auth Store 상태 타입
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;

  // 액션
  login: (user: User) => void;
  logout: () => void;
  initializeAuth: () => void;
}

// localStorage 키
const AUTH_STORAGE_KEY = 'auth_user';

// Auth Store 생성
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  // 로그인: 사용자 정보 저장
  login: (user: User) => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    set({ user, isAuthenticated: true });
  },

  // 로그아웃: 사용자 정보 제거
  logout: () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    set({ user: null, isAuthenticated: false });
  },

  // 초기화: localStorage에서 사용자 정보 복원
  initializeAuth: () => {
    try {
      const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
      if (storedUser) {
        const user = JSON.parse(storedUser) as User;
        set({ user, isAuthenticated: true });
      }
    } catch {
      // localStorage 파싱 실패 시 제거
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  },
}));
