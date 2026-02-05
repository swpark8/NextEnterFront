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

  // ✅ 현재 경로가 기업용인지 사용자용인지 판단
  const isCompanyPath = () => {
    return window.location.pathname.startsWith('/company');
  };

  // ✅ userType에 따라 localStorage 키 반환
  const getStorageKeys = (userType: "personal" | "company") => {
    if (userType === "company") {
      return { tokenKey: "company_token", userKey: "company_user" };
    }
    return { tokenKey: "user_token", userKey: "user_user" };
  };

  // 초기 로드 시 localStorage에서 데이터 복원
  useEffect(() => {
    const initAuth = () => {
      try {
        // ✅ 현재 경로에 맞는 데이터만 로드
        const isCompany = isCompanyPath();
        const { tokenKey, userKey } = getStorageKeys(isCompany ? "company" : "personal");

        const storedToken = localStorage.getItem(tokenKey);
        const storedUser = localStorage.getItem(userKey);

        if (storedToken && storedUser) {
          const parsedUser = JSON.parse(storedUser);
          
          // ✅ userType 검증
          if (isCompany && parsedUser.userType !== "company") {
            console.warn("⚠️ 기업 페이지에서 개인 사용자 토큰 발견 - 무시");
            localStorage.removeItem(tokenKey);
            localStorage.removeItem(userKey);
            return;
          }
          
          if (!isCompany && parsedUser.userType === "company") {
            console.warn("⚠️ 사용자 페이지에서 기업 토큰 발견 - 무시");
            localStorage.removeItem(tokenKey);
            localStorage.removeItem(userKey);
            return;
          }
          
          setToken(storedToken);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error("❌ 토큰 복원 실패:", error);
        // ✅ 에러 시 현재 타입의 데이터만 삭제
        const isCompany = isCompanyPath();
        const { tokenKey, userKey } = getStorageKeys(isCompany ? "company" : "personal");
        localStorage.removeItem(tokenKey);
        localStorage.removeItem(userKey);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = (userData: User, userToken: string) => {
    // ✅ userType 검증
    if (!userData.userType) {
      userData.userType = "personal";
    }
    
    // ✅ userType에 맞는 키에 저장
    const { tokenKey, userKey } = getStorageKeys(userData.userType);
    
    setUser(userData);
    setToken(userToken);
    localStorage.setItem(tokenKey, userToken);
    localStorage.setItem(userKey, JSON.stringify(userData));
    
    console.log(`✅ ${userData.userType} 로그인 완료:`, { tokenKey, userKey });
  };

  const logout = () => {
    // ✅ 현재 로그인된 사용자의 타입에 맞는 데이터만 삭제
    if (user?.userType) {
      const { tokenKey, userKey } = getStorageKeys(user.userType);
      localStorage.removeItem(tokenKey);
      localStorage.removeItem(userKey);
      console.log(`✅ ${user.userType} 로그아웃:`, { tokenKey, userKey });
    } else {
      // ✅ userType을 알 수 없는 경우 모두 삭제
      localStorage.clear();
      sessionStorage.clear();
    }
    
    setUser(null);
    setToken(null);
  };

  const isAuthenticated = !!user && !!token;

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};