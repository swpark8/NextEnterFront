import { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import HoverMenu from "../features/navigation-menu/components/HoverMenu";
import DropdownMenu from "../features/navigation-menu/components/DropdownMenu";
import { useAuth } from "../context/AuthContext";
import { logout as logoutApi } from "../api/auth";
// ✅ [추가 1] 방어 로직 임포트
import { checkNavigationBlocked } from "../utils/navigationBlocker";

const MENU_CLOSE_DELAY = 150;

const LOGIN_REQUIRED_MENUS = [
  "resume",
  "matching",
  "interview",
  "mypage",
  "credit",
];

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getActiveTab = () => {
    const path = location.pathname;
    // 홈페이지일 때는 아무것도 선택되지 않음
    if (path === "/user" || path === "/user/") return "";
    if (path.startsWith("/user/jobs")) return "job";
    if (path.startsWith("/user/mypage") || path.startsWith("/user/profile"))
      return "mypage";
    if (path.startsWith("/user/credit")) return "credit";
    if (path.startsWith("/user/interview")) return "interview";
    if (path.startsWith("/user/resume") || path.startsWith("/user/coverletter"))
      return "resume";
    if (path.startsWith("/user/matching")) return "matching";
    if (path.startsWith("/user/offers")) return "offer";
    return "";
  };

  const activeTab = getActiveTab();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("검색:", searchQuery);
  };

  const handleMouseEnter = (tabId: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setHoveredTab(tabId);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setHoveredTab(null);
    }, MENU_CLOSE_DELAY);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = async () => {
    // ✅ [추가 2] 로그아웃 시에도 방어 로직 체크
    if (checkNavigationBlocked()) return;

    try {
      await logoutApi();
    } catch (error) {
      console.error("로그아웃 API 오류:", error);
    } finally {
      logout();
      setIsUserMenuOpen(false);
      window.location.href = "/user";
    }
  };

  const handleMenuClick = (tabId: string, menuId?: string) => {
    // ✅ [추가 3] 메뉴 이동 전 방어 로직 체크! (여기서 막히면 아래 코드 실행 안 됨)
    if (checkNavigationBlocked()) return;

    const checkTabId = menuId ? menuId.split("-sub-")[0] : tabId;
    if (LOGIN_REQUIRED_MENUS.includes(checkTabId) && !isAuthenticated) {
      alert("로그인이 필요한 기능입니다.");
      navigate("/user/login");
      return;
    }

    const defaultSubMenus: { [key: string]: string } = {
      job: "job-sub-1",
      resume: "resume-sub-1",
      matching: "matching-sub-1",
      interview: "interview-sub-1",
      offer: "offer-sub-1",
      mypage: "mypage-home",
      credit: "credit-sub-1",
    };

    const baseRoutes: { [key: string]: string } = {
      job: "/user",
      resume: "/user/resume",
      matching: "/user/matching",
      interview: "/user/interview",
      offer: "/user/offers",
      mypage: "/user/mypage",
      credit: "/user/credit",
    };

    const separateRoutes: { [key: string]: string } = {
      "job-sub-1": "/user/jobs/all",
      "job-sub-2": "/user/jobs/ai",
      "job-sub-3": "/user/jobs/position",
      "job-sub-4": "/user/jobs/location",
      "resume-sub-2": "/user/coverletter",
      "offer-sub-2": "/user/offers/interview",
      "credit-sub-2": "/user/credit/charge",
      "mypage-sub-2": "/user/profile",
    };

    const targetMenuId = menuId || defaultSubMenus[tabId];
    const targetPath = separateRoutes[targetMenuId] || baseRoutes[tabId];

    if (targetPath) {
      navigate(`${targetPath}?menu=${targetMenuId}`);
    }
  };

  // ✅ [추가 4] 로고 클릭 핸들러 (로고 눌러서 도망가는 것 방지)
  const handleLogoClick = () => {
    if (checkNavigationBlocked()) return;
    navigate("/user");
  };

  const navItems = [
    { id: "job", label: "채용정보" },
    { id: "resume", label: "이력서" },
    { id: "matching", label: "매칭분석" },
    { id: "interview", label: "모의면접" },
    { id: "offer", label: "받은 제안" },
    { id: "mypage", label: "마이페이지" },
    { id: "credit", label: "크레딧" },
  ];

  return (
    <>
      <header className="bg-white border-b border-gray-200">
        <div className="px-4 py-4 mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button className="lg:hidden">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              <div
                onClick={handleLogoClick} // ✅ 수정됨
                className="transition cursor-pointer hover:opacity-80"
              >
                <span className="text-2xl font-bold text-blue-600">
                  NextEnter
                </span>
              </div>
            </div>

            <form onSubmit={handleSearch} className="flex-1 max-w-md mx-8">
              <div className="relative">
                <svg
                  className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="나에게 딱 맞는 커리어와 매칭!"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500"
                />
              </div>
            </form>

            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center px-4 py-2 space-x-2 text-gray-700 transition hover:text-blue-600"
                  >
                    <svg
                      className="w-5 h-5"
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
                    <span className="font-medium">{user?.name}님</span>
                    <svg
                      className={`w-4 h-4 transition-transform ${
                        isUserMenuOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-[9999]">
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          if (!checkNavigationBlocked())
                            navigate("/user/profile");
                        }}
                        className="w-full px-4 py-2 text-left text-gray-700 transition hover:bg-gray-50"
                      >
                        내 정보
                      </button>
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          if (!checkNavigationBlocked())
                            navigate("/user/mypage?menu=mypage-home");
                        }}
                        className="w-full px-4 py-2 text-left text-gray-700 transition hover:bg-gray-50"
                      >
                        마이페이지
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left text-red-600 transition hover:bg-gray-50"
                      >
                        로그아웃
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <button
                    onClick={() => navigate("/user/login")}
                    className="px-4 py-2 text-gray-700 transition hover:text-blue-600"
                  >
                    로그인
                  </button>
                  <button
                    onClick={() => navigate("/user/signup")}
                    className="px-4 py-2 text-gray-700 transition hover:text-blue-600"
                  >
                    회원가입
                  </button>
                </>
              )}
              <button
                onClick={() => navigate("/company")}
                className="px-4 py-2 transition bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
              >
                기업 서비스
              </button>
            </div>
          </div>
        </div>
      </header>

      <nav className="relative z-50 bg-white border-b border-blue-600">
        <div className="px-4 mx-auto max-w-7xl">
          <div className="flex items-center space-x-8">
            <button
              onClick={toggleDropdown}
              className="p-4 transition hover:bg-gray-50"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isDropdownOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>

            {navItems.map((item) => (
              <div
                key={item.id}
                className="relative"
                onMouseEnter={() => handleMouseEnter(item.id)}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  onClick={() => handleMenuClick(item.id)}
                  className={`relative py-4 px-2 font-medium transition whitespace-nowrap ${
                    activeTab === item.id
                      ? "text-blue-600"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  {item.label}
                  {activeTab === item.id && (
                    <span className="absolute -bottom-[1px] left-0 w-full h-0.5 bg-blue-600" />
                  )}
                </button>
                {hoveredTab === item.id && (
                  <HoverMenu
                    tabId={item.id}
                    onSubMenuClick={(tabId, subId) =>
                      handleMenuClick(tabId, subId)
                    }
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </nav>

      <div className="relative z-[45]">
        <DropdownMenu
          isOpen={isDropdownOpen}
          onMenuClick={(menuId) => {
            // DropdownMenu 내부에서 클릭 시에도 handleMenuClick이 호출되므로 방어 로직 적용됨
            setIsDropdownOpen(false);
            const tabId = menuId.split("-sub-")[0];
            handleMenuClick(tabId, menuId);
          }}
        />
      </div>
    </>
  );
}
