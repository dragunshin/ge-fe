import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
//import googleIcon from '../../images/login/google.svg';
import kakaoIcon from '../../images/login/kakao.svg';
import separateIcon from '../../images/login/seperate.svg';
import menualLogo from '../../images/home/menual.svg';
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
      if (response.statusCode === 0 || response.statusCode === 200) {
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
    <div className="min-h-full bg-white flex flex-col">
      <header className="app-header flex items-center px-4 pt-4">
        <button
          onClick={() => navigate(-1)}
          className="h-7 w-7 flex items-center justify-center"
          aria-label="닫기"
        >
          <X className="h-6 w-6 text-[#0f0f10]" />
        </button>
      </header>

      <div className="flex justify-center pt-4">
        <img src={menualLogo} alt="MENUAL" className="h-[32px] w-[172px]" />
      </div>

      <main className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="mx-auto w-full max-w-[343px] pt-[56px] pb-8">
          {/* Tabs */}
          <div className="flex">
            <button
              onClick={() => setUserType('login')}
              className={`flex-1 h-[40px] text-[16px] transition-all ${
                userType === 'login'
                  ? 'border-b-2 border-[#0f0f10] font-semibold text-[#0f0f10]'
                  : 'border-b border-[#f4f4f5] font-normal text-[#0f0f10]'
              }`}
            >
              로그인
            </button>
            <button
              onClick={() => setUserType('expert')}
              className={`flex-1 h-[40px] text-[16px] transition-all ${
                userType === 'expert'
                  ? 'border-b-2 border-[#0f0f10] font-semibold text-[#0f0f10]'
                  : 'border-b border-[#f4f4f5] font-normal text-[#0f0f10]'
              }`}
            >
              전문가 로그인
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-[28px]">
            <div>
              <input
                name="email"
                type="text"
                placeholder="이메일 입력"
                value={formData.email}
                onChange={handleChange}
                className={`w-full h-12 px-5 border rounded-[4px] focus:outline-none placeholder:text-[#989ba2] text-[13px] bg-white transition-colors ${
                  errors.email
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-[#dbdcdf] focus:border-[#c9cbd1]'
                }`}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1 px-1">{errors.email}</p>
              )}
            </div>

            <div>
              <input
                name="password"
                type="password"
                placeholder="패스워드 입력"
                value={formData.password}
                onChange={handleChange}
                className={`w-full h-12 px-5 border rounded-[4px] focus:outline-none placeholder:text-[#989ba2] text-[13px] bg-white transition-colors ${
                  errors.password
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-[#dbdcdf] focus:border-[#c9cbd1]'
                }`}
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1 px-1">{errors.password}</p>
              )}
            </div>

            {errors.general && (
              <div className="text-red-500 text-sm px-1">
                {errors.general}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 flex items-center justify-center mt-[12px] font-semibold text-[16px] bg-[#0f0f10] text-white hover:bg-[#1a1a1a] transition-colors rounded-[4px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '로그인 중...' : '로그인'}
            </button>

            <div className="flex items-center justify-center gap-[10px] text-[12px] text-[#656870]">
              <button type="button" className="hover:text-black transition-colors">
                비밀번호 찾기
              </button>
              <img src={separateIcon} alt="separator" className="w-px h-3" />
              <button
                type="button"
                onClick={() => navigate('/auth/terms-agreement')}
                className="hover:text-black transition-colors"
              >
                이메일로 회원가입
              </button>
            </div>

            <div className="flex items-center gap-[12px] pt-[78px] pb-5">
              <div className="flex-1 border-t border-[#e1e2e4]" />
              <span className="text-[14px] font-medium text-[#70737c]">
                SNS 계정으로 간편로그인
              </span>
              <div className="flex-1 border-t border-[#e1e2e4]" />
            </div>

            <div className="flex flex-col gap-3 pb-8">
              {/* <button
                type="button"
                disabled={isLoading}
                className="w-full h-12 flex items-center justify-center gap-3 border border-[#dbdcdf] bg-white hover:bg-gray-50 transition-colors rounded-[4px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <img src={googleIcon} alt="Google" className="w-5 h-5" />
                <span className="text-[14px] font-semibold text-[#0f0f10]">Google 로그인</span>
              </button> */}
              <button
                type="button"
                onClick={redirectToKakaoLogin}
                disabled={isLoading}
                className="w-full h-12 flex items-center justify-center gap-3 hover:opacity-90 transition-opacity rounded-[4px] disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#FFE809' }}
              >
                <img src={kakaoIcon} alt="Kakao" className="w-5 h-5" />
                <span className="text-[14px] font-semibold text-[#0f0f10]">
                  {isLoading ? '로그인 중...' : '카카오톡 로그인'}
                </span>
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
