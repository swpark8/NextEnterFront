import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

interface OAuth2CallbackPageProps {
  onLoginSuccess: () => void;
}

export default function OAuth2CallbackPage({
  onLoginSuccess,
}: OAuth2CallbackPageProps) {
  const { login } = useAuth();

  useEffect(() => {
    // URL에서 토큰과 사용자 정보 추출
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const email = params.get("email");
    const name = params.get("name");

    console.log("OAuth2 콜백 - token:", token, "email:", email, "name:", name);

    if (token && email && name) {
      // ✅ URL 디코딩 추가
      const decodedEmail = decodeURIComponent(email);
      const decodedName = decodeURIComponent(name);

      console.log("디코딩된 이메일:", decodedEmail);
      console.log("디코딩된 이름:", decodedName);

      // JWT 토큰 디코딩하여 userId 추출
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const userId = payload.userId;

        console.log("JWT payload:", payload);
        console.log("userId:", userId);

        // AuthContext에 로그인 정보 저장
        login({ userId, email: decodedEmail, name: decodedName }, token);

        // 메인 페이지로 이동
        alert(`${decodedName}님, 환영합니다!`);
        onLoginSuccess();
      } catch (error) {
        console.error("JWT 토큰 파싱 오류:", error);
        alert("로그인 처리 중 오류가 발생했습니다.");
        window.location.href = "/";
      }
    } else {
      console.error("토큰 또는 사용자 정보가 없습니다.");
      alert("로그인에 실패했습니다.");
      window.location.href = "/";
    }
  }, [login, onLoginSuccess]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="mb-4 text-6xl">🔄</div>
        <h2 className="text-2xl font-bold mb-2">로그인 처리 중...</h2>
        <p className="text-gray-600">잠시만 기다려주세요.</p>
      </div>
    </div>
  );
}
