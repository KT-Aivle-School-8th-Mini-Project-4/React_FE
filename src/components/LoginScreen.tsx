import { useState } from 'react';
import { User } from '../App';
import { BookOpen, LogIn, AlertCircle } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (user: User) => void;
}

const users: User[] = [
  { id: 'ADMIN', password: '1234', role: 'admin' },
  { id: 'KT', password: '1234', role: 'user' }
];

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const user = users.find(u => u.id === username && u.password === password);
    
    if (user) {
      onLogin(user);
    } else {
      setError('아이디 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  const handleSignUp = () => {
    alert('회원가입 기능은 곧 제공될 예정입니다.');
  };

  const handleFindId = () => {
    alert('아이디 찾기 기능은 곧 제공될 예정입니다.');
  };

  const handleFindPassword = () => {
    alert('비밀번호 찾기 기능은 곧 제공될 예정입니다.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl shadow-lg mb-4">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-gray-900 mb-2">도서 관리 시스템</h1>
          <p className="text-gray-600">AI 표지 자동 생성 서비스</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h2 className="text-xl text-gray-900 mb-6 text-center">로그인</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm text-gray-700 mb-2">
                아이디
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError('');
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="아이디를 입력하세요"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm text-gray-700 mb-2">
                비밀번호
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="비밀번호를 입력하세요"
                required
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <LogIn className="w-5 h-5" />
              <span>로그인</span>
            </button>
          </form>

          {/* Additional Links */}
          <div className="mt-6 flex items-center justify-center gap-3 text-sm">
            <button
              onClick={handleFindId}
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              아이디 찾기
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={handleFindPassword}
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              비밀번호 찾기
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={handleSignUp}
              className="text-blue-600 hover:text-blue-700 transition-colors"
            >
              회원가입
            </button>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-3 text-center">테스트 계정</p>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-gray-600">관리자</span>
                <span className="text-gray-700">ADMIN / 1234</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-gray-600">일반 회원</span>
                <span className="text-gray-700">KT / 1234</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          관리자는 모든 기능을 사용할 수 있습니다<br />
          일반 회원은 도서 조회 및 추가가 가능합니다
        </p>
      </div>
    </div>
  );
}
