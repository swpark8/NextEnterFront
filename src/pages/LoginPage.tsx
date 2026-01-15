import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { login as loginApi } from "../api/auth";
import { loginCompany } from "../api/company";
import { useAuth } from "../context/AuthContext";

interface LoginPageProps {
  initialAccountType?: "personal" | "business";
}

export default function LoginPage({
  initialAccountType = "personal",
}: LoginPageProps) {
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  const [accountType, setAccountType] = useState<"personal" | "business">(
    initialAccountType
  );

  useEffect(() => {
    setAccountType(initialAccountType);
  }, [initialAccountType]);

  // 입력 필드 상태 관리
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessNumber, setBusinessNumber] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 로그인 처리
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // 유효성 검사
    if (!email || !password) {
      setError("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    // 기업회원 로그인 시 사업자번호 필수
    if (accountType === "business" && !businessNumber) {
      setError("사업자번호를 입력해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      // 개인회원 로그인
      if (accountType === "personal") {
        const response = await loginApi({ email, password });

        if (response.success && response.data) {
          const { userId, token, email: userEmail, name } = response.data;

          authLogin(
            { userId, email: userEmail, name, userType: "personal" },
            token
          );

          navigate("/user", { replace: true });
        } else {
          setError(response.message || "로그인에 실패했습니다.");
        }
      }
      // 기업회원 로그인
      else {
        const response = await loginCompany({
          email,
          password,
          businessNumber,
        });

        if (response.success && response.data) {
          const {
            companyId,
            token,
            email: userEmail,
            name,
            companyName,
            businessNumber: bn,
          } = response.data;

          authLogin(
            {
              userId: companyId,
              email: userEmail,
              name,
              userType: "company",
              companyName,
              businessNumber: bn,
            },
            token
          );

          navigate("/company", { replace: true });
        } else {
          setError(response.message || "로그인에 실패했습니다.");
        }
      }
    } catch (err: any) {
      console.error("로그인 오류:", err);
      setError(err.response?.data?.message || "로그인 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 소셜 로그인 핸들러 (개인회원 전용)
  const handleSocialLogin = (provider: "naver" | "kakao" | "google") => {
    const backendUrl = "http://localhost:8080";
    window.location.href = `${backendUrl}/oauth2/authorization/${provider}`;
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
                  setError("");
                  navigate("/user/login");
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
                  setError("");
                  navigate("/company/login");
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

            {/* 에러 메시지 */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* 로그인 폼 */}
            <form onSubmit={handleLogin} className="space-y-3">
              {/* 이메일 입력 */}
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
                  type="email"
                  placeholder="이메일"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-900 placeholder-gray-400 text-sm disabled:bg-gray-100"
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
                  disabled={isLoading}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-900 placeholder-gray-400 text-sm disabled:bg-gray-100"
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
                    disabled={isLoading}
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-900 placeholder-gray-400 text-sm disabled:bg-gray-100"
                  />
                </div>
              )}

              {/* 로그인 버튼 */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-blue-600 text-white text-base font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isLoading ? "로그인 중..." : "로그인"}
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
                onClick={() =>
                  navigate(
                    accountType === "personal"
                      ? "/user/signup"
                      : "/company/signup"
                  )
                }
                className="text-blue-600 hover:text-blue-700 transition"
              >
                회원가입
              </button>
            </div>

            {/* ✅ 소셜 로그인 섹션 - 개인회원일 때만 표시 */}
            {accountType === "personal" && (
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gray-50 text-gray-500">
                      간편로그인
                    </span>
                  </div>
                </div>

                {/* 소셜 로그인 버튼들 */}
                <div className="flex justify-center mt-3 space-x-4">
                  <button
                    onClick={() => handleSocialLogin("naver")}
                    className="flex items-center justify-center w-10 h-10 rounded-full overflow-hidden hover:opacity-80 transition-opacity shadow-md"
                    title="네이버 로그인"
                  >
                    <img
                      src="/images/naver-icon.png"
                      alt="네이버 로그인"
                      className="w-full h-full object-cover"
                    />
                  </button>

                  <button
                    onClick={() => handleSocialLogin("kakao")}
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-[#FEE500] hover:opacity-80 transition-opacity shadow-md"
                    title="카카오 로그인"
                  >
                    <img
                      src="/images/kakao-icon.png"
                      alt="카카오 로그인"
                      className="w-12 h-12 object-contain"
                    />
                  </button>

                  <button
                    onClick={() => handleSocialLogin("google")}
                    className="flex items-center justify-center w-10 h-10 rounded-full overflow-hidden hover:opacity-80 transition-opacity shadow-md"
                    title="구글 로그인"
                  >
                    <img
                      src="/images/google-icon.png"
                      alt="구글 로그인"
                      className="w-full h-full object-cover"
                    />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
