import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backIcon from '../../images/login/back.svg';
import googleIcon from '../../images/login/google.svg';
import kakaoIcon from '../../images/login/kakao.svg';
import separateIcon from '../../images/login/seperate.svg';
import { authService } from '../../services/auth.service';
import type { ApiErrorResponse } from '../../lib/api/types';
import { AxiosError } from 'axios';

type UserType = 'login' | 'expert';

export function LoginForm() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<UserType>('login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // 입력 시 에러 메시지 초기화
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await authService.login({
        email: formData.email,
        password: formData.password,
      });

      // 로그인 성공
      if (response.statusCode === 0) {
        console.log('로그인 성공:', response.data);
        // 홈 페이지로 이동
        navigate('/');
      }
    } catch (err) {
      // 에러 처리
      const axiosError = err as AxiosError<ApiErrorResponse>;
      if (axiosError.response) {
        const { statusCode, message } = axiosError.response.data;

        // API 명세서 에러 코드 처리
        switch (statusCode) {
          case 1101:
            setError('이메일이 일치하지 않습니다.');
            break;
          case 1102:
            setError('비밀번호가 일치하지 않습니다.');
            break;
          default:
            setError(message || '로그인에 실패했습니다. 다시 시도해주세요.');
        }
      } else {
        setError('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="flex items-center px-6 py-4">
        <button onClick={() => navigate(-1)} className="mr-3">
          <img src={backIcon} alt="back" className="w-2.5 h-[18px]" />
        </button>
        <h1 className="text-xl font-semibold">회원가입/로그인</h1>
      </header>

      {/* Tabs */}
      <div className="flex">
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
      <div className="flex-1 overflow-y-auto">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-6 pt-10">
          {/* Email Input */}
          <input
            name="email"
            type="email"
            placeholder="이메일 입력"
            value={formData.email}
            onChange={handleChange}
            className="w-full h-12 px-5 border border-gray-200 rounded focus:outline-none focus:border-gray-300 placeholder:text-gray-400 text-[13px] bg-white transition-colors"
            required
            disabled={isLoading}
          />

          {/* Password Input */}
          <input
            name="password"
            type="password"
            placeholder="패스워드 입력"
            value={formData.password}
            onChange={handleChange}
            className="w-full h-12 px-5 border border-gray-200 rounded focus:outline-none focus:border-gray-300 placeholder:text-gray-400 text-[13px] bg-white transition-colors"
            required
            disabled={isLoading}
          />

          {/* Error Message */}
          {error && (
            <div className="text-red-500 text-sm px-1">
              {error}
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
              className="w-full h-14 flex items-center justify-center gap-3 border border-gray-200 bg-white hover:bg-gray-50 transition-colors rounded"
            >
              <img src={googleIcon} alt="Google" className="w-5 h-5" />
              <span className="text-base font-medium text-gray-900">Google 로그인</span>
            </button>
            <button
              type="button"
              className="w-full h-14 flex items-center justify-center gap-3 hover:opacity-90 transition-opacity rounded"
              style={{ backgroundColor: '#FEE500' }}
            >
              <img src={kakaoIcon} alt="Kakao" className="w-5 h-5" />
              <span className="text-base font-semibold" style={{ color: '#3C1E1E' }}>카카오톡 로그인</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
