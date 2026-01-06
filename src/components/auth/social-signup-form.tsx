import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backIcon from '../../images/login/back.svg';
import { authService } from '../../services/auth.service';
import { getErrorMessage } from '../../lib/api/error-handler';
import { socialSignupSchema } from '../../lib/schemas/auth.schema';
import { useAuthStore } from '../../stores/useAuthStore';

type UserType = 'customer' | 'expert';

export function SocialSignUpForm() {
  const STORAGE_KEY = 'social_signup_form_state_v1';
  const defaultState = {
    userType: 'customer' as UserType,
    formData: {
      nickname: '',
      birthDate: '',
      email: '',
    },
    agreed: false,
  };
  const initialState = (() => {
    if (typeof window === 'undefined') {
      return defaultState;
    }
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return defaultState;
    }
    try {
      const parsed = JSON.parse(stored) as Partial<typeof defaultState>;
      return {
        ...defaultState,
        ...parsed,
        formData: {
          ...defaultState.formData,
          ...parsed.formData,
        },
      };
    } catch {
      sessionStorage.removeItem(STORAGE_KEY);
      return defaultState;
    }
  })();
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [userType, setUserType] = useState<UserType>(initialState.userType);
  const [formData, setFormData] = useState(initialState.formData);
  const [agreed, setAgreed] = useState(initialState.agreed);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ userType, formData, agreed }),
    );
  }, [userType, formData, agreed]);

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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      // 1차 검증: Zod 스키마로 클라이언트 측 검증
      const apiUserType = userType === 'customer' ? 'MEMBER' : 'EXPERT';
      const validatedData = socialSignupSchema.parse({
        nickname: formData.nickname,
        birth: formData.birthDate, // YYYYMMDD 형식 그대로 전송
        email: formData.email,
        userType: apiUserType,
        agreeTerms: agreed,
        agreePrivacy: agreed,
      });

      // 검증 통과 후 API 호출
      const response = await authService.socialSignup(validatedData);

      // 소셜 회원가입 성공
      if (response.statusCode === 0 || response.statusCode === 200) {
        const { nickname, userType } = response.data;

        // 로그인 정보 저장
        login({ nickname, userType });

        sessionStorage.removeItem(STORAGE_KEY);

        // 관심 분야 선택 페이지로 이동
        navigate('/auth/interest-selection');
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
        // API 에러 처리: 백엔드에서 전송한 에러 메시지
        const errorMessage = getErrorMessage(err);
        setErrors({ general: errorMessage });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid =
    formData.nickname &&
    formData.birthDate &&
    formData.email &&
    agreed;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="app-header flex items-center px-4 py-4">
        <button onClick={() => navigate(-1)} className="mr-3">
          <img src={backIcon} alt="back" className="w-2.5 h-[18px]" />
        </button>
        <h1 className="text-[20px] font-semibold">회원가입</h1>
      </header>

      {/* Tabs */}
      <div className="flex">
        <button
          onClick={() => setUserType('customer')}
          className={`flex-1 py-4 text-base font-medium transition-all border-b ${
            userType === 'customer' ? 'text-black border-black border-b-2' : 'text-gray-400 border-[#f4f4f5]'
          }`}
        >
          그루머
        </button>
        <button
          onClick={() => setUserType('expert')}
          className={`flex-1 py-4 text-base font-medium transition-all border-b ${
            userType === 'expert' ? 'text-black border-black border-b-2' : 'text-gray-400 border-[#f4f4f5]'
          }`}
        >
          전문가
        </button>
      </div>

      {/* Form - 스크롤 가능 영역 */}
      <div className="flex-1 overflow-y-auto">
        <form onSubmit={handleSubmit} className="px-4 pt-6 flex flex-col gap-6">
          {/* 닉네임 */}
          <div>
            <label className="block text-base font-medium text-black mb-3">닉네임</label>
            <input
              name="nickname"
              placeholder="이름을 입력해주세요."
              value={formData.nickname}
              onChange={handleChange}
              className={`w-full h-12 px-5 border rounded focus:outline-none placeholder:text-gray-400 text-[13px] bg-white transition-colors ${
                errors.nickname ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-gray-300'
              }`}
              disabled={isLoading}
            />
            {errors.nickname && (
              <p className="text-red-500 text-xs mt-1 px-1">{errors.nickname}</p>
            )}
          </div>

          {/* 생년월일 */}
          <div>
            <label className="block text-base font-medium text-black mb-3">생년월일</label>
            <input
              name="birthDate"
              placeholder="ex) 19980101"
              value={formData.birthDate}
              onChange={handleChange}
              className={`w-full h-12 px-5 border rounded focus:outline-none placeholder:text-gray-400 text-[13px] bg-white transition-colors ${
                errors.birth ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-gray-300'
              }`}
              disabled={isLoading}
            />
            {errors.birth && (
              <p className="text-red-500 text-xs mt-1 px-1">{errors.birth}</p>
            )}
          </div>

          {/* 이메일 */}
          <div>
            <label className="block text-base font-medium text-black mb-3">이메일</label>
            <input
              name="email"
              type="text"
              placeholder="example@gmail.com"
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

          {/* 약관 동의 에러 */}
          {(errors.agreeTerms || errors.agreePrivacy) && (
            <div className="text-red-500 text-xs px-1">
              {errors.agreeTerms || errors.agreePrivacy}
            </div>
          )}

          {/* 일반 에러 메시지 */}
          {errors.general && (
            <div className="text-red-500 text-sm px-1">
              {errors.general}
            </div>
          )}
        </form>
      </div>

      {/* 약관 동의 - 하단 고정 */}
      <div className="px-4 py-6">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="h-[14px] w-[14px] rounded border-[#c2c4c8]"
          />
          <span className="text-[12px] leading-[1.4] text-[#70737c]">
            <button
              type="button"
              onClick={() => navigate('/auth/terms-of-service')}
              className="underline text-black"
            >
              이용약관
            </button>
            {' '}및{' '}
            <button
              type="button"
              onClick={() => navigate('/auth/privacy-policy')}
              className="underline text-black"
            >
              개인정보취급 방침
            </button>
            에 동의합니다. (필수)
          </span>
        </label>
      </div>

      {/* Submit Button - 하단 고정 */}
      <div>
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={isLoading || !isFormValid}
          className={`w-full h-[90px] text-[16px] font-semibold text-white transition-colors ${
            isFormValid ? 'bg-[#0f0f10]' : 'bg-[#aeb0b6]'
          }`}
        >
          {isLoading ? '처리 중...' : '다음'}
        </button>
      </div>
    </div>
  );
}
