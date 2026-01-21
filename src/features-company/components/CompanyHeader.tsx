import { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CompanyHoverMenu from "../navigation-menu/components/CompanyHoverMenu";
import CompanyDropdownMenu from "../navigation-menu/components/CompanyDropdownMenu";
import { useAuth } from "../../context/AuthContext";
import { logout as logoutApi } from "../../api/auth";
import { checkNavigationBlocked } from "../../utils/navigationBlocker";

const MENU_CLOSE_DELAY = 150;

const LOGIN_REQUIRED_MENUS = ["jobs", "applicants", "talent", "ads", "credit"];

export default function CompanyHeader() {
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
    if (path.startsWith("/company/jobs")) return "jobs";
    if (path.startsWith("/company/applicants")) return "applicants";
    if (path.startsWith("/company/talent-search")) return "talent";
    if (path.startsWith("/company/ads")) return "ads";
    if (path.startsWith("/company/credit")) return "credit";
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
    if (checkNavigationBlocked()) return;

    try {
      await logoutApi();
    } catch (error) {
      console.error("로그아웃 API 오류:", error);
    } finally {
      logout();
      setIsUserMenuOpen(false);
      window.location.href = "/company";
    }
  };

  const handleMenuClick = (tabId: string, menuId?: string) => {
    if (checkNavigationBlocked()) return;

    const checkTabId = menuId ? menuId.split("-sub-")[0] : tabId;
    if (LOGIN_REQUIRED_MENUS.includes(checkTabId) && !isAuthenticated) {
      alert("로그인이 필요한 기능입니다.");
      navigate("/company/login");
      return;
    }

    const defaultSubMenus: { [key: string]: string } = {
      jobs: "jobs-sub-1",
      applicants: "applicants-sub-1",
      talent: "talent-sub-1",
      ads: "ads-sub-1",
      credit: "credit-sub-1",
    };

    const baseRoutes: { [key: string]: string } = {
      jobs: "/company/jobs",
      applicants: "/company/applicants",
      talent: "/company/talent-search",
      ads: "/company/ads",
      credit: "/company/credit",
    };

    const separateRoutes: { [key: string]: string } = {
      "jobs-sub-2": "/company/jobs/create",
      "credit-sub-2": "/company/credit/charge",
      "applicants-sub-2": "/company/applicants/1/compatibility",
    };

    const targetMenuId = menuId || defaultSubMenus[tabId];
    const targetPath = separateRoutes[targetMenuId] || baseRoutes[tabId];

    if (targetPath) {
      navigate(`${targetPath}?menu=${targetMenuId}`);
    }
  };

  const handleLogoClick = () => {
    if (checkNavigationBlocked()) return;
    navigate("/company");
  };

  const navItems = [
    { id: "jobs", label: "채용공고 관리" },
    { id: "applicants", label: "지원자 관리" },
    { id: "talent", label: "인재 검색" },
    { id: "companyMy", label: "마이페이지" },
    { id: "credit", label: "크레딧" },
  ];

  return (
    <>
      {/* Top Header (Logo Area) */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-4 py-4 mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            {/* Logo */}
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
                onClick={handleLogoClick}
                className="flex items-center transition cursor-pointer hover:opacity-80"
              >
                <span className="text-2xl font-bold text-purple-600">
                  NextEnter
                </span>
                <span className="ml-2 text-sm font-medium text-purple-400">
                  기업
                </span>
              </div>
            </div>

            {/* Search Bar */}
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
                  placeholder="인재를 검색하세요"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-full focus:outline-none focus:border-purple-500"
                />
              </div>
            </form>

            {/* Right Buttons */}
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center px-4 py-2 space-x-2 text-gray-700 transition hover:text-purple-600"
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
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                    <span className="font-medium">
                      {user?.name || "기업"}님
                    </span>
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
                            navigate("/company/credit");
                        }}
                        className="w-full px-4 py-2 text-left text-gray-700 transition hover:bg-gray-50"
                      >
                        크레딧 관리
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
                    onClick={() => navigate("/company/login")}
                    className="px-4 py-2 text-gray-700 transition hover:text-purple-600"
                  >
                    로그인
                  </button>
                  <button
                    onClick={() => navigate("/company/signup")}
                    className="px-4 py-2 text-gray-700 transition hover:text-purple-600"
                  >
                    회원가입
                  </button>
                </>
              )}
              <button
                onClick={() => navigate("/user")}
                className="px-4 py-2 transition bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
              >
                개인 서비스
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Bar (Category) */}
      <nav className="relative z-50 bg-white border-b border-purple-600">
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
                      ? "text-purple-600"
                      : "text-gray-700 hover:text-purple-600"
                  }`}
                >
                  {item.label}
                  {activeTab === item.id && (
                    <span className="absolute -bottom-[1px] left-0 w-full h-0.5 bg-purple-600" />
                  )}
                </button>
                {hoveredTab === item.id && (
                  <CompanyHoverMenu
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
        <CompanyDropdownMenu
          isOpen={isDropdownOpen}
          onMenuClick={(menuId) => {
            setIsDropdownOpen(false);
            const tabId = menuId.split("-sub-")[0];
            handleMenuClick(tabId, menuId);
          }}
        />
      </div>
    </>
  );
}
