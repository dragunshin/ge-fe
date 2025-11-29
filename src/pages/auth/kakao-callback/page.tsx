import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../../services/auth.service';
import { getErrorMessage } from '../../../lib/api/error-handler';
import { getKakaoCodeFromUrl, getKakaoErrorFromUrl } from '../../../lib/utils/kakao';
import { useAuthStore } from '../../../stores/useAuthStore';

export default function KakaoCallbackPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  useEffect(() => {
    const handleKakaoCallback = async () => {
      // URL에서 에러 확인
      const kakaoError = getKakaoErrorFromUrl();
      if (kakaoError) {
        alert(`카카오 로그인 실패: ${kakaoError.error_description}`);
        navigate('/auth/login');
        return;
      }

      // URL에서 인가 코드 추출
      const code = getKakaoCodeFromUrl();
      if (!code) {
        alert('인가 코드를 찾을 수 없습니다.');
        navigate('/auth/login');
        return;
      }

      try {
        // 백엔드에 인가 코드 전송
        const response = await authService.socialLogin({
          code,
          provider: 'KAKAO',
        });

        if (response.statusCode === 0) {
          const { userType, nickname } = response.data;

          // TMP_USER인 경우 추가 정보 입력 페이지로 이동
          if (userType === 'TMP_USER') {
            navigate('/auth/social-signup', { state: { nickname } });
          } else {
            // 정상 사용자는 로그인 정보 저장 후 홈으로 이동
            login({ nickname, userType });
            navigate('/');
          }
        }
      } catch (err) {
        const errorMessage = getErrorMessage(err);
        alert(`로그인 처리 중 오류가 발생했습니다: ${errorMessage}`);
        navigate('/auth/login');
      }
    };

    handleKakaoCallback();
  }, [navigate, login]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="mb-4">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        </div>
        <p className="text-lg font-medium">카카오 로그인 중...</p>
      </div>
    </div>
  );
}
