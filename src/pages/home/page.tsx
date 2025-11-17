import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth.service';

const HomePage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    if (!confirm('로그아웃 하시겠습니까?')) {
      return;
    }

    setIsLoading(true);
    try {
      await authService.logout();
      alert('로그아웃 되었습니다.');
      navigate('/auth/login');
    } catch (error) {
      console.error('로그아웃 실패:', error);
      alert('로그아웃에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">홈 페이지</h1>

        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">사용자 메뉴</h2>
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="px-6 py-3 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
          >
            {isLoading ? '로그아웃 중...' : '로그아웃'}
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">인증 페이지</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate('/auth/login')}
              className="px-6 py-3 bg-black text-white rounded hover:bg-gray-800"
            >
              로그인 페이지
            </button>
            <button
              onClick={() => navigate('/auth/signup')}
              className="px-6 py-3 bg-gray-800 text-white rounded hover:bg-gray-700"
            >
              회원가입 페이지
            </button>
            <button
              onClick={() => navigate('/auth/social-signup')}
              className="px-6 py-3 bg-gray-600 text-white rounded hover:bg-gray-500"
            >
              소셜 회원가입 페이지
            </button>
            <button
              onClick={() => navigate('/auth/interest-selection')}
              className="px-6 py-3 bg-gray-400 text-white rounded hover:bg-gray-300"
            >
              관심 분야 선택 페이지
            </button>
            <button
              onClick={() => navigate('/auth/terms-agreement')}
              className="px-6 py-3 bg-gray-300 text-black rounded hover:bg-gray-200"
            >
              약관 동의 페이지
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">프로필/후기 페이지</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate('/profile/writing-list')}
              className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              나의 후기 목록
            </button>
            <button
              onClick={() => navigate('/profile/detail/1')}
              className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              후기 상세
            </button>
            <button
              onClick={() => navigate('/profile/write/1')}
              className="px-6 py-3 bg-blue-400 text-white rounded hover:bg-blue-500"
            >
              후기 작성
            </button>
            <button
              onClick={() => navigate('/profile/evaluation/1')}
              className="px-6 py-3 bg-blue-300 text-white rounded hover:bg-blue-400"
            >
              평가 페이지
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
