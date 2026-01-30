import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
      // 🔍 디버깅용 로그
      console.log(`🚀 [로그인 시도] 타입: ${accountType}, 이메일: ${email}`);

      // 개인회원 로그인
      if (accountType === "personal") {
        const response = await loginApi({ email, password });
        console.log("✅ [로그인 응답 데이터]:", response);

        // data가 존재하면 success 필드가 없더라도 로그인 성공으로 간주 (임시 DB 대응)
        if (response.data && (response.success || response.data.token)) {
          const { userId, token, email: userEmail, name } = response.data;

          authLogin(
            { userId, email: userEmail, name, userType: "personal" },
            token
          );

          console.log("🎉 [로그인 성공] 사용자 페이지로 이동");
          navigate("/user", { replace: true });
        } else {
          console.warn("⚠️ [로그인 실패] 서버 메시지:", response.message);
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
        console.log("✅ [기업 로그인 응답 데이터]:", response);

        // data가 존재하면 success 필드가 없더라도 로그인 성공으로 간주
        const actualData = response.data || response;
        const isSuccess = response.success || actualData.token;

        if (isSuccess && actualData) {
          const {
            companyId,
            token,
            email: userEmail,
            name,
            companyName,
            businessNumber: bn,
          } = actualData;

          authLogin(
            {
              userId: companyId,
              email: userEmail,
              name,
              userType: "company",
              companyId,
              companyName,
              businessNumber: bn,
            },
            token
          );

          console.log("🎉 [기업 로그인 성공] 기업 페이지로 이동");
          navigate("/company", { replace: true });
        } else {
          console.warn("⚠️ [기업 로그인 실패] 서버 메시지:", response.message);
          setError(response.message || "로그인에 실패했습니다.");
        }
      }
    } catch (err: any) {
      console.error("❌ [로그인 오류 상세]:", err);
      
      if (err.code === "ERR_NETWORK") {
        setError("서버에 연결할 수 없습니다. (localhost:8080 서버가 켜져 있는지 확인해 주세요)");
      } else {
        setError(err.response?.data?.message || "로그인 중 오류가 발생했습니다.");
      }
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
    <div className="flex flex-col min-h-screen bg-white">
      {/* 메인 컨텐츠 */}
      <div
        className="flex flex-col items-center flex-1 gap-6 px-4 pb-4 pt-18"
        style={{ paddingTop: "4.5rem" }}
      >
        {/* 로고가 들어갈 이미지 위치 */}
        <div className="flex items-center justify-center w-full h-48 max-w-lg bg-white border-2 border-gray-300 rounded-lg">
          <p className="text-lg text-gray-500">로고가 들어갈 이미지 위치</p>
        </div>

        {/* 가로 배치: 이미지 슬라이드 배너 + 로그인 폼 */}
        <div className="flex items-center justify-center w-full max-w-6xl gap-12">
          {/* 왼쪽: 이미지 슬라이드 배너 생성 위치 */}
          <div className="flex flex-col items-center justify-center flex-1 max-w-lg p-6 bg-white border-2 border-gray-300 rounded-lg h-96">
            <p className="mb-2 text-base font-medium text-gray-700">
              이미지 슬라이드 배너
            </p>
            <p className="text-sm text-gray-500">생성 위치</p>
            <p className="mt-2 text-xs text-gray-400">
              (회색 박스로 공간 표시만 할 것)
            </p>
          </div>

          {/* 오른쪽: 로그인 폼 */}
          <div className="w-full max-w-xs">
            {/* 탭 메뉴 */}
            <div className="flex mb-6 border-b border-gray-300">
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
              <div className="p-3 mb-4 border border-red-200 rounded-lg bg-red-50">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* 로그인 폼 */}
            <form onSubmit={handleLogin} className="space-y-3">
              {/* 이메일 입력 */}
              <div className="relative">
                <div className="absolute transform -translate-y-1/2 left-3 top-1/2">
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
                  className="w-full py-3 pl-10 pr-3 text-sm text-gray-900 placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                />
              </div>

              {/* 비밀번호 입력 */}
              <div className="relative">
                <div className="absolute transform -translate-y-1/2 left-3 top-1/2">
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
                  className="w-full py-3 pl-10 pr-3 text-sm text-gray-900 placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                />
              </div>

              {/* 사업자번호 입력 (기업회원일 때만 표시) */}
              {accountType === "business" && (
                <div className="relative">
                  <div className="absolute transform -translate-y-1/2 left-3 top-1/2">
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
                    className="w-full py-3 pl-10 pr-3 text-sm text-gray-900 placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                  />
                </div>
              )}

              {/* 로그인 버튼 */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 text-base font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isLoading ? "로그인 중..." : "로그인"}
              </button>
            </form>

            {/* 하단 링크 */}
            <div className="flex items-center justify-center mt-6 space-x-3 text-xs text-gray-600">
              <button className="transition hover:text-blue-600">
                아이디 찾기
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={() => navigate("/user/forgot-password")}
                className="transition hover:text-blue-600"
              >
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
                className="text-blue-600 transition hover:text-blue-700"
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
                    <span className="px-2 text-gray-500 bg-gray-50">
                      간편로그인
                    </span>
                  </div>
                </div>

                {/* 소셜 로그인 버튼들 */}
                <div className="flex justify-center mt-3 space-x-4">
                  <button
                    onClick={() => handleSocialLogin("naver")}
                    className="flex items-center justify-center w-10 h-10 overflow-hidden transition-opacity rounded-full shadow-md hover:opacity-80"
                    title="네이버 로그인"
                  >
                    <img
                      src="/images/naver-icon.png"
                      alt="네이버 로그인"
                      className="object-cover w-full h-full"
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
                      className="object-contain w-12 h-12"
                    />
                  </button>

                  <button
                    onClick={() => handleSocialLogin("google")}
                    className="flex items-center justify-center w-10 h-10 overflow-hidden transition-opacity rounded-full shadow-md hover:opacity-80"
                    title="구글 로그인"
                  >
                    <img
                      src="/images/google-icon.png"
                      alt="구글 로그인"
                      className="object-cover w-full h-full"
                    />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
