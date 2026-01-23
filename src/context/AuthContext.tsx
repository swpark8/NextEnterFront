import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface User {
  userId: number;
  email: string;
  name: string;
  userType?: "personal" | "company";
  companyId?: number;
  companyName?: string;
  businessNumber?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 초기 로드 시 localStorage에서 데이터 복원
  useEffect(() => {
    const initAuth = () => {
      try {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        console.log("🔍 AuthContext 초기화");
        console.log("📦 저장된 토큰:", storedToken ? "있음" : "없음");
        console.log("📦 저장된 유저:", storedUser);

        if (storedToken && storedUser) {
          const parsedUser = JSON.parse(storedUser);
          
          // ✅ userType 검증 및 기본값 설정
          if (!parsedUser.userType) {
            console.warn("⚠️ userType이 없습니다. personal로 설정합니다.");
            parsedUser.userType = "personal";
          }
          
          setToken(storedToken);
          setUser(parsedUser);
          console.log("✅ 토큰 복원 완료:", parsedUser);
        } else {
          console.log("ℹ️ 저장된 토큰 없음");
        }
      } catch (error) {
        console.error("❌ 토큰 복원 실패:", error);
        localStorage.clear();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = (userData: User, userToken: string) => {
    // ✅ userType 기본값 보장
    if (!userData.userType) {
      console.warn("⚠️ login 시 userType이 없습니다. personal로 설정합니다.");
      userData.userType = "personal";
    }

    console.log("🔐 로그인 실행:", userData);
    
    setUser(userData);
    setToken(userToken);
    localStorage.setItem("token", userToken);
    localStorage.setItem("user", JSON.stringify(userData));
    
    console.log("✅ 로그인 완료 - localStorage 저장:");
    console.log("📦 Token:", userToken.substring(0, 20) + "...");
    console.log("📦 User:", userData);
  };

  const logout = () => {
    console.log("🚨 LOGOUT 호출됨");
    setUser(null);
    setToken(null);
    localStorage.clear();
    sessionStorage.clear();
    console.log("✅ 로그아웃 완료");
  };

  const isAuthenticated = !!user && !!token;

  // ✅ 디버깅 로그
  useEffect(() => {
    console.log("🔒 인증 상태 변경:", {
      isAuthenticated,
      hasUser: !!user,
      hasToken: !!token,
      userType: user?.userType,
      isLoading
    });
  }, [isAuthenticated, user, token, isLoading]);

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};