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
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  // 인증이 필요한데 로그인하지 않은 경우
  if (requireAuth && !isAuthenticated) {
    // 현재 경로가 /company로 시작하면 기업 로그인으로
    if (location.pathname.startsWith("/company")) {
      return (
        <Navigate to="/company/login" state={{ from: location }} replace />
      );
    }
    // 그 외는 개인 로그인으로
    return <Navigate to="/user/login" state={{ from: location }} replace />;
  }

  // userType 체크
  if (allowedUserType && user?.userType !== allowedUserType) {
    // 잘못된 userType으로 접근 시
    if (allowedUserType === "personal") {
      // 개인회원 페이지인데 기업회원이 접근
      alert("개인회원 전용 페이지입니다. 기업 페이지로 이동합니다.");
      return <Navigate to="/company" replace />;
    } else {
      // 기업회원 페이지인데 개인회원이 접근
      alert("기업회원 전용 페이지입니다. 개인 페이지로 이동합니다.");
      return <Navigate to="/user" replace />;
    }
  }

  return <>{children}</>;
}
