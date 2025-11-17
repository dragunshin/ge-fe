import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backIcon from '../../images/login/back.svg';
import { authService } from '../../services/auth.service';
import type { ApiErrorResponse } from '../../lib/api/types';
import { AxiosError } from 'axios';

type UserType = 'customer' | 'expert';

export function SignUpForm() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<UserType>('customer');
  const [formData, setFormData] = useState({
    nickname: '',
    birthDate: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // 입력 시 에러 메시지 초기화
    if (error) setError('');
  };

  const formatBirthDate = (date: string): string => {
    // YYYYMMDD -> YYYY-MM-DD 변환
    if (date.length === 8) {
      return `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`;
    }
    return date;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!agreed) {
      setError('필수 약관 및 개인정보 처리에 동의해야 합니다.');
      return;
    }

    if (formData.password !== formData.passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.signup({
        nickname: formData.nickname,
        birth: formatBirthDate(formData.birthDate),
        email: formData.email,
        password: formData.password,
        passwordConfirm: formData.passwordConfirm,
        userType: userType === 'customer' ? 'GROOMER' : 'EXPERT',
        agreeTerms: agreed,
        agreePrivacy: agreed,
      });

      // 회원가입 성공
      if (response.statusCode === 0) {
        console.log('회원가입 성공:', response.data);
        // 관심 분야 선택 페이지로 이동
        navigate('/auth/interest-selection');
      }
    } catch (err) {
      // 에러 처리
      const axiosError = err as AxiosError<ApiErrorResponse>;
      if (axiosError.response) {
        const { statusCode, message } = axiosError.response.data;

        // API 명세서 에러 코드 처리
        switch (statusCode) {
          case 1001:
            setError('닉네임 형식이 올바르지 않습니다.');
            break;
          case 1002:
            setError('이미 사용 중인 닉네임입니다.');
            break;
          case 1003:
            setError('비밀번호 형식이 올바르지 않습니다.');
            break;
          case 1004:
            setError('생년월일 형식이 올바르지 않습니다.');
            break;
          case 1005:
            setError('이메일 형식이 올바르지 않습니다.');
            break;
          case 1006:
            setError('이미 가입된 이메일입니다.');
            break;
          case 1007:
            setError('필수 약관 및 개인정보 처리에 동의해야 합니다.');
            break;
          case 1008:
            setError('비밀번호가 일치하지 않습니다.');
            break;
          default:
            setError(message || '회원가입에 실패했습니다. 다시 시도해주세요.');
        }
      } else {
        setError('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
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
    formData.passwordConfirm &&
    agreed;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="flex items-center px-6 py-4">
        <button onClick={() => navigate(-1)} className="mr-3">
          <img src={backIcon} alt="back" className="w-2.5 h-[18px]" />
        </button>
        <h1 className="text-xl font-semibold">회원가입</h1>
      </header>

      {/* Tabs */}
      <div className="flex">
        <button
          onClick={() => setUserType('customer')}
          className={`flex-1 py-4 text-base font-medium transition-all relative ${
            userType === 'customer' ? 'text-black' : 'text-gray-400'
          }`}
        >
          그루머
          {userType === 'customer' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
          )}
        </button>
        <button
          onClick={() => setUserType('expert')}
          className={`flex-1 py-4 text-base font-medium transition-all relative ${
            userType === 'expert' ? 'text-black' : 'text-gray-400'
          }`}
        >
          전문가
          {userType === 'expert' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
          )}
        </button>
      </div>

      {/* Form - 스크롤 가능 영역 */}
      <div className="flex-1 overflow-y-auto">
        <form onSubmit={handleSubmit} className="px-6 pt-7 flex flex-col gap-6">
          {/* 닉네임 */}
          <div>
            <label className="block text-base font-medium text-black mb-3">닉네임</label>
            <input
              name="nickname"
              placeholder="이름을 입력해주세요."
              value={formData.nickname}
              onChange={handleChange}
              className="w-full h-12 px-5 border border-gray-200 rounded focus:outline-none focus:border-gray-300 placeholder:text-gray-400 text-[12px] bg-white"
            />
          </div>

          {/* 생년월일 */}
          <div>
            <label className="block text-base font-medium text-black mb-3">생년월일</label>
            <input
              name="birthDate"
              placeholder="ex) 19980101"
              value={formData.birthDate}
              onChange={handleChange}
              className="w-full h-12 px-5 border border-gray-200 rounded focus:outline-none focus:border-gray-300 placeholder:text-gray-400 text-[12px] bg-white"
            />
          </div>

          {/* 이메일 */}
          <div>
            <label className="block text-base font-medium text-black mb-3">이메일</label>
            <input
              name="email"
              type="email"
              placeholder="example@gmail.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full h-12 px-5 border border-gray-200 rounded focus:outline-none focus:border-gray-300 placeholder:text-gray-400 text-[12px] bg-white"
            />
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
              className="w-full h-12 px-5 border border-gray-200 rounded focus:outline-none focus:border-gray-300 placeholder:text-gray-400 text-[12px] bg-white"
            />
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
              className="w-full h-12 px-5 border border-gray-200 rounded focus:outline-none focus:border-gray-300 placeholder:text-gray-400 text-[12px] bg-white"
              disabled={isLoading}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-500 text-sm px-1">
              {error}
            </div>
          )}
        </form>
      </div>

      {/* 약관 동의 - 하단 고정 */}
      <div className="px-6 py-6">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="w-5 h-5 rounded border-gray-300"
          />
          <span className="text-[12px] text-gray-600">
            <button
              type="button"
              onClick={() => navigate('/auth/terms-of-service')}
              className="underline text-black hover:font-bold"
            >
              이용약관
            </button>
            {' '}및{' '}
            <button
              type="button"
              onClick={() => navigate('/auth/privacy-policy')}
              className="underline text-black hover:font-bold"
            >
              개인정보 취급방침
            </button>
            에 동의합니다. (필수)
          </span>
        </label>
      </div>
      {/* Submit Button - 하단 고정 */}
      <div className="mt-auto">
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={isLoading || !isFormValid}
          className="w-full h-14 font-medium transition-colors bg-black text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? '처리 중...' : '다음'}
        </button>
      </div>
    </div>
  );
}
