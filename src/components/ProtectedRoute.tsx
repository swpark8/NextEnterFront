import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  allowedUserType?: "personal" | "company";
}

export default function ProtectedRoute({
  children,
  requireAuth = true,
  allowedUserType,
}: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  console.log("🛡️ ProtectedRoute 검사:", {
    path: location.pathname,
    isLoading,
    isAuthenticated,
    userType: user?.userType,
    allowedUserType,
    requireAuth
  });

  // ✅ 로딩 중일 때는 로딩 화면 표시
  if (isLoading) {
    console.log("⏳ 로딩 중...");
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  // 인증이 필요한데 로그인하지 않은 경우
  if (requireAuth && !isAuthenticated) {
    console.warn("❌ 인증 필요 - 로그인 페이지로 리다이렉트");
    
    if (location.pathname.startsWith("/company")) {
      return (
        <Navigate to="/company/login" state={{ from: location }} replace />
      );
    }
    return <Navigate to="/user/login" state={{ from: location }} replace />;
  }

  // ✅ userType 체크 - undefined는 personal로 간주
  if (allowedUserType && user?.userType && user.userType !== allowedUserType) {
    console.error("❌ userType 불일치:", {
      required: allowedUserType,
      actual: user?.userType
    });
    
    if (allowedUserType === "personal") {
      alert("개인회원 전용 페이지입니다. 기업 페이지로 이동합니다.");
      return <Navigate to="/company" replace />;
    } else {
      alert("기업회원 전용 페이지입니다. 개인 페이지로 이동합니다.");
      return <Navigate to="/user" replace />;
    }
  }

  // ✅ userType이 undefined인 경우 경고만 표시하고 통과
  if (allowedUserType && !user?.userType) {
    console.warn("⚠️ userType이 없습니다. 경로를 기반으로 판단합니다.");
    // /user로 시작하면 personal, /company로 시작하면 company
    const inferredType = location.pathname.startsWith("/company") ? "company" : "personal";
    if (inferredType !== allowedUserType) {
      console.error("❌ 경로와 요구 타입 불일치");
      if (allowedUserType === "personal") {
        return <Navigate to="/company" replace />;
      } else {
        return <Navigate to="/user" replace />;
      }
    }
  }

  console.log("✅ ProtectedRoute 통과");
  return <>{children}</>;
}
