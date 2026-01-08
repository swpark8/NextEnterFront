import { useState } from "react";

interface LoginPageProps {
  onLogoClick?: () => void;
  onSignupClick?: () => void;
  onAccountTypeChange?: (type: "personal" | "business") => void;
}

export default function LoginPage({
  onSignupClick,
  onAccountTypeChange,
}: LoginPageProps) {
  // 개인회원/기업회원 탭 상태 관리
  const [accountType, setAccountType] = useState<"personal" | "business">(
    "personal"
  );

  // 입력 필드 상태 관리
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [businessNumber, setBusinessNumber] = useState("");

  // 로그인 처리
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("로그인 시도:", {
      accountType,
      loginId,
      password,
      businessNumber,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 메인 컨텐츠 */}
      <div
        className="flex-1 flex flex-col items-center px-4 pt-18 pb-4 gap-6"
        style={{ paddingTop: "4.5rem" }}
      >
        {/* 로고가 들어갈 이미지 위치 */}
        <div className="w-full max-w-lg h-48 border-2 border-gray-300 rounded-lg flex items-center justify-center bg-white">
          <p className="text-gray-500 text-lg">로고가 들어갈 이미지 위치</p>
        </div>

        {/* 가로 배치: 이미지 슬라이드 배너 + 로그인 폼 */}
        <div className="w-full max-w-6xl flex items-center justify-center gap-12">
          {/* 왼쪽: 이미지 슬라이드 배너 생성 위치 */}
          <div className="flex-1 max-w-lg h-96 border-2 border-gray-300 rounded-lg flex flex-col items-center justify-center bg-white p-6">
            <p className="text-gray-700 text-base font-medium mb-2">
              이미지 슬라이드 배너
            </p>
            <p className="text-gray-500 text-sm">생성 위치</p>
            <p className="text-gray-400 text-xs mt-2">
              (회색 박스로 공간 표시만 할 것)
            </p>
          </div>

          {/* 오른쪽: 로그인 폼 */}
          <div className="w-full max-w-xs">
            {/* 탭 메뉴 */}
            <div className="flex border-b border-gray-300 mb-6">
              <button
                onClick={() => {
                  setAccountType("personal");
                  onAccountTypeChange?.("personal");
                }}
                className={`flex-1 py-3 text-center font-medium transition-all ${
                  accountType === "personal"
                    ? "text-gray-900 border-b-2 border-gray-900"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                개인회원
              </button>
              <button
                onClick={() => {
                  setAccountType("business");
                  onAccountTypeChange?.("business");
                }}
                className={`flex-1 py-3 text-center font-medium transition-all ${
                  accountType === "business"
                    ? "text-gray-900 border-b-2 border-gray-900"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                기업회원
              </button>
            </div>

            {/* 로그인 폼 */}
            <form onSubmit={handleLogin} className="space-y-3">
              {/* 아이디 입력 */}
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="아이디"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-900 placeholder-gray-400 text-sm"
                />
              </div>

              {/* 비밀번호 입력 */}
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <input
                  type="password"
                  placeholder="비밀번호"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-900 placeholder-gray-400 text-sm"
                />
              </div>

              {/* 사업자번호 입력 (기업회원일 때만 표시) */}
              {accountType === "business" && (
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="사업자번호"
                    value={businessNumber}
                    onChange={(e) => setBusinessNumber(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-900 placeholder-gray-400 text-sm"
                  />
                </div>
              )}

              {/* 로그인 버튼 */}
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white text-base font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                로그인
              </button>
            </form>

            {/* 하단 링크 */}
            <div className="flex items-center justify-center space-x-3 mt-6 text-xs text-gray-600">
              <button className="hover:text-blue-600 transition">
                아이디 찾기
              </button>
              <span className="text-gray-300">|</span>
              <button className="hover:text-blue-600 transition">
                비밀번호 찾기
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={onSignupClick}
                className="text-blue-600 hover:text-blue-700 transition"
              >
                회원가입
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
