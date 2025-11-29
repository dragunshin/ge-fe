import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backIcon from '../../images/login/back.svg';
import googleIcon from '../../images/login/google.svg';
import kakaoIcon from '../../images/login/kakao.svg';
import separateIcon from '../../images/login/seperate.svg';
import { authService } from '../../services/auth.service';
import { getErrorMessage } from '../../lib/api/error-handler';
import { redirectToKakaoLogin } from '../../lib/utils/kakao';
import { loginSchema } from '../../lib/schemas/auth.schema';
import { useAuthStore } from '../../stores/useAuthStore';

type UserType = 'login' | 'expert';

export function LoginForm() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [userType, setUserType] = useState<UserType>('login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // 입력 시 해당 필드의 에러 메시지 초기화
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    // 일반 에러도 초기화
    if (errors.general) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.general;
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      // 1차 검증: Zod 스키마로 클라이언트 측 검증
      const validatedData = loginSchema.parse({
        email: formData.email,
        password: formData.password,
      });

      // 검증 통과 후 API 호출
      const response = await authService.login(validatedData);

      // 로그인 성공
      if (response.statusCode === 0) {
        const { nickname, userType } = response.data;

        // 로그인 정보 저장
        login({ nickname, userType });

        // 홈 페이지로 이동
        navigate('/');
      }
    } catch (err) {
      // Zod 검증 에러 처리
      if (err && typeof err === 'object' && 'issues' in err) {
        const zodError = err as { issues: Array<{ path: string[]; message: string }> };
        const fieldErrors: Record<string, string> = {};

        zodError.issues.forEach((issue) => {
          const fieldName = issue.path[0] as string;
          if (!fieldErrors[fieldName]) {
            fieldErrors[fieldName] = issue.message;
          }
        });

        setErrors(fieldErrors);
      } else {
        // API 에러 처리: 백엔드에서 전송한 에러 메시지 (보안상 통합 메시지)
        const errorMessage = getErrorMessage(err);
        setErrors({ general: errorMessage });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      {/* Header */}
      <header className="shrink-0 flex items-center px-6 py-4">
        <button onClick={() => navigate(-1)} className="mr-3">
          <img src={backIcon} alt="back" className="w-2.5 h-[18px]" />
        </button>
        <h1 className="text-xl font-semibold">회원가입/로그인</h1>
      </header>

      {/* Tabs */}
      <div className="shrink-0 flex">
        <button
          onClick={() => setUserType('login')}
          className={`flex-1 py-4 text-base font-medium transition-all relative ${
            userType === 'login' ? 'text-black' : 'text-gray-400'
          }`}
        >
          로그인
          {userType === 'login' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
          )}
        </button>
        <button
          onClick={() => setUserType('expert')}
          className={`flex-1 py-4 text-base font-medium transition-all relative ${
            userType === 'expert' ? 'text-black' : 'text-gray-400'
          }`}
        >
          전문가 로그인
          {userType === 'expert' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
          )}
        </button>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-6 pt-10 pb-8">
          {/* Email Input */}
          <div>
            <input
              name="email"
              type="text"
              placeholder="이메일 입력"
              value={formData.email}
              onChange={handleChange}
              className={`w-full h-12 px-5 border rounded focus:outline-none placeholder:text-gray-400 text-[13px] bg-white transition-colors ${
                errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-gray-300'
              }`}
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1 px-1">{errors.email}</p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <input
              name="password"
              type="password"
              placeholder="패스워드 입력"
              value={formData.password}
              onChange={handleChange}
              className={`w-full h-12 px-5 border rounded focus:outline-none placeholder:text-gray-400 text-[13px] bg-white transition-colors ${
                errors.password ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-gray-300'
              }`}
              disabled={isLoading}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1 px-1">{errors.password}</p>
            )}
          </div>

          {/* 일반 에러 메시지 (로그인 실패 등) */}
          {errors.general && (
            <div className="text-red-500 text-sm px-1">
              {errors.general}
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-14 flex items-center justify-center mt-2 font-semibold text-base bg-black text-white hover:bg-gray-800 transition-colors rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </button>

          {/* Password Reset / Sign Up Links */}
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <button type="button" className="hover:text-black transition-colors">
              비밀번호 찾기
            </button>
            <img src={separateIcon} alt="separator" className="w-px h-3" />
            <button
              type="button"
              onClick={() => navigate('/auth/signup')}
              className="hover:text-black transition-colors"
            >
              이메일로 회원가입
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 pt-[78px] pb-5">
            <div className="flex-1 border-t border-gray-200" />
            <span className="text-sm text-gray-500">SNS 계정으로 간편로그인</span>
            <div className="flex-1 border-t border-gray-200" />
          </div>

          {/* Social Login Buttons */}
          <div className="flex flex-col gap-3 pb-8">
            <button
              type="button"
              disabled={isLoading}
              className="w-full h-14 flex items-center justify-center gap-3 border border-gray-200 bg-white hover:bg-gray-50 transition-colors rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <img src={googleIcon} alt="Google" className="w-5 h-5" />
              <span className="text-base font-medium text-gray-900">Google 로그인</span>
            </button>
            <button
              type="button"
              onClick={redirectToKakaoLogin}
              disabled={isLoading}
              className="w-full h-14 flex items-center justify-center gap-3 hover:opacity-90 transition-opacity rounded disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#FEE500' }}
            >
              <img src={kakaoIcon} alt="Kakao" className="w-5 h-5" />
              <span className="text-base font-semibold" style={{ color: '#3C1E1E' }}>
                {isLoading ? '로그인 중...' : '카카오톡 로그인'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
