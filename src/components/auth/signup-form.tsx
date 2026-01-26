import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backIcon from '../../images/login/back.svg';
import { authService } from '../../services/auth.service';
import { getErrorMessage } from '../../lib/api/error-handler';
import { signupSchema } from '../../lib/schemas/auth.schema';
import { useAuthStore } from '../../stores/useAuthStore';

type UserType = 'customer' | 'expert';

export function SignUpForm() {
  const AGREEMENTS_STORAGE_KEY = 'signup_terms_agreements_v1';
  const STORAGE_KEY = 'signup_form_state_v1';
  const defaultState = {
    userType: 'customer' as UserType,
    formData: {
      nickname: '',
      birthDate: '',
      email: '',
      password: '',
      passwordConfirm: '',
    },
  };
  const defaultAgreements = {
    age: false,
    service: false,
    privacy: false,
    marketing: false,
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
  const initialAgreements = (() => {
    if (typeof window === 'undefined') {
      return defaultAgreements;
    }
    const stored = sessionStorage.getItem(AGREEMENTS_STORAGE_KEY);
    if (!stored) {
      return defaultAgreements;
    }
    try {
      const parsed = JSON.parse(stored) as Partial<typeof defaultAgreements>;
      return {
        ...defaultAgreements,
        ...parsed,
      };
    } catch {
      sessionStorage.removeItem(AGREEMENTS_STORAGE_KEY);
      return defaultAgreements;
    }
  })();
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [userType, setUserType] = useState<UserType>(initialState.userType);
  const [formData, setFormData] = useState(initialState.formData);
  const [agreements] = useState(initialAgreements);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isVerificationRequested, setIsVerificationRequested] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationError, setVerificationError] = useState('');

  useEffect(() => {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ userType, formData }),
    );
  }, [userType, formData]);

  const isAgreementsValid =
    agreements.age &&
    agreements.service &&
    agreements.privacy;

  useEffect(() => {
    if (!isAgreementsValid) {
      navigate('/auth/terms-agreement');
    }
  }, [isAgreementsValid, navigate]);

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

  const handleRequestVerification = () => {
    setIsVerificationRequested(true);
    setVerificationError('');
  };

  const handleConfirmVerification = () => {
    if (!verificationCode) {
      return;
    }
    if (verificationCode !== '123456') {
      setVerificationError('인증번호가 일치하지 않아요');
      return;
    }
    setVerificationError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAgreementsValid) {
      navigate('/auth/terms-agreement');
      return;
    }
    setErrors({});
    setIsLoading(true);

    try {
      // 1차 검증: Zod 스키마로 클라이언트 측 검증
      const apiUserType = userType === 'customer' ? 'MEMBER' : 'EXPERT';
      const validatedData = signupSchema.parse({
        nickname: formData.nickname,
        birth: formData.birthDate, // YYYYMMDD 형식 그대로 전송
        email: formData.email,
        password: formData.password,
        passwordConfirm: formData.passwordConfirm,
        userType: apiUserType,
        agreeTerms: agreements.service,
        agreePrivacy: agreements.privacy,
      });

      // 검증 통과 후 API 호출
      const response = await authService.signup(validatedData);

      // 회원가입 성공
      if (response.statusCode === 0 || response.statusCode === 200) {
        const { nickname, userType: responseUserType } = response.data;

        // 로그인 정보 저장
        login({
          nickname,
          userType: responseUserType,
        });

        sessionStorage.removeItem(STORAGE_KEY);
        sessionStorage.removeItem(AGREEMENTS_STORAGE_KEY);

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
    formData.password &&
    formData.passwordConfirm;

  return (
    <div className="min-h-full bg-white flex flex-col">
      {/* Header */}
      <header className="app-header shrink-0 flex items-center px-4 py-4">
        <button onClick={() => navigate(-1)} className="mr-3">
          <img src={backIcon} alt="back" className="w-2.5 h-[18px]" />
        </button>
        <h1 className="text-[20px] font-semibold">회원가입</h1>
      </header>

      {/* Tabs */}
      <div className="shrink-0 flex">
        <button
          onClick={() => setUserType('customer')}
          className={`flex-1 py-4 text-base font-medium transition-all border-b ${
            userType === 'customer' ? 'text-black border-black border-b-2' : 'text-gray-400 border-[#f4f4f5]'
          }`}
        >
          일반
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
        <form onSubmit={handleSubmit} className="px-4 pt-6 pb-6 flex flex-col gap-6">
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
            <div className="relative">
              <input
                name="email"
                type="text"
                placeholder="example@gmail.com"
                value={formData.email}
                onChange={handleChange}
                className={`w-full h-12 px-5 pr-[78px] border rounded focus:outline-none placeholder:text-gray-400 text-[13px] bg-white transition-colors ${
                  errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-gray-300'
                }`}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={handleRequestVerification}
                className="absolute right-[16px] top-1/2 -translate-y-1/2 text-[13px] font-semibold text-[#008bff]"
                disabled={isLoading || !formData.email}
              >
                인증요청
              </button>
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1 px-1">{errors.email}</p>
            )}
            <div className="mt-2 flex gap-2">
              <input
                name="verificationCode"
                type="text"
                placeholder="인증번호 입력"
                value={verificationCode}
                onChange={(event) => {
                  setVerificationCode(event.target.value);
                  if (verificationError) {
                    setVerificationError('');
                  }
                }}
                className="flex-1 h-12 px-5 border rounded focus:outline-none placeholder:text-gray-400 text-[13px] bg-white transition-colors border-gray-200 focus:border-gray-300"
                disabled={isLoading || !isVerificationRequested}
              />
              <button
                type="button"
                onClick={handleConfirmVerification}
                disabled={isLoading || !verificationCode || !isVerificationRequested}
                className={`h-12 w-[104px] rounded text-[14px] font-semibold text-white ${
                  verificationCode && isVerificationRequested ? 'bg-[#0f0f10]' : 'bg-[#aeb0b6]'
                }`}
              >
                인증번호 확인
              </button>
            </div>
            {verificationError && (
              <p className="mt-2 text-[13px] text-[#f02929]">{verificationError}</p>
            )}
          </div>

          {/* 비밀번호 */}
          <div>
            <label className="block text-base font-medium text-black mb-3">비밀번호</label>
            <input
              name="password"
              type="password"
              placeholder="영문+숫자 조합 8자리 이상 입력해주세요."
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

          {/* 비밀번호 재확인 */}
          <div>
            <label className="block text-base font-medium text-black mb-3">비밀번호 재확인</label>
            <input
              name="passwordConfirm"
              type="password"
              placeholder="비밀번호를 한 번 더 입력해주세요."
              value={formData.passwordConfirm}
              onChange={handleChange}
              className={`w-full h-12 px-5 border rounded focus:outline-none placeholder:text-gray-400 text-[13px] bg-white transition-colors ${
                errors.passwordConfirm ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-gray-300'
              }`}
              disabled={isLoading}
            />
            {errors.passwordConfirm && (
              <p className="text-red-500 text-xs mt-1 px-1">{errors.passwordConfirm}</p>
            )}
          </div>

          {/* 일반 에러 메시지 */}
          {errors.general && (
            <div className="text-red-500 text-sm px-1">
              {errors.general}
            </div>
          )}
        </form>
      </div>

      {/* Submit Button - 하단 고정 */}
      <div className="shrink-0">
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={isLoading || !isFormValid}
          className={`w-full h-[56px] text-[16px] font-semibold text-white transition-colors ${
            isFormValid ? 'bg-[#0f0f10]' : 'bg-[#aeb0b6]'
          }`}
        >
          {isLoading ? '처리 중...' : '다음'}
        </button>
      </div>
    </div>
  );
}
