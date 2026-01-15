import { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import HoverMenu from "../features/navigation-menu/components/HoverMenu";
import DropdownMenu from "../features/navigation-menu/components/DropdownMenu";
import { navigationMenuData } from "../features/navigation-menu/data/menuData";
import { useAuth } from "../context/AuthContext";
import { logout as logoutApi } from "../api/auth";

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

  // 현재 활성 탭 결정
  const getActiveTab = () => {
    const path = location.pathname;
    if (path.startsWith("/user/jobs")) return "job";
    if (path.startsWith("/user/mypage")) return "mypage";
    if (path.startsWith("/user/credit")) return "credit";
    if (path.startsWith("/user/interview")) return "interview";
    if (path.startsWith("/user/resume") || path.startsWith("/user/coverletter"))
      return "resume";
    if (path.startsWith("/user/matching")) return "matching";
    if (path.startsWith("/user/offers")) return "offer";
    return "job";
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
    if (LOGIN_REQUIRED_MENUS.includes(tabId) && !isAuthenticated) {
      alert("로그인이 필요한 기능입니다.");
      navigate("/user/login");
      return;
    }

    // 메뉴별 라우팅
    const routes: { [key: string]: string } = {
      job: "/user",
      "job-sub-1": "/user/jobs/all",
      "job-sub-2": "/user/jobs/ai",
      "job-sub-3": "/user/jobs/position",
      "job-sub-4": "/user/jobs/location",
      mypage: "/user/mypage",
      credit: "/user/credit",
      "credit-sub-2": "/user/credit/charge",
      interview: "/user/interview",
      resume: "/user/resume",
      "resume-sub-2": "/user/coverletter",
      matching: "/user/matching",
      offer: "/user/offers",
      "offer-sub-2": "/user/offers/interview",
    };

    const route = menuId ? routes[menuId] : routes[tabId];
    if (route) {
      navigate(route);
    }
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
                onClick={() => navigate("/user")}
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
                    className="flex items-center space-x-2 px-4 py-2 text-gray-700 transition hover:text-blue-600"
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
                          navigate("/user/profile");
                        }}
                        className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition"
                      >
                        내 정보
                      </button>
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          navigate("/user/mypage");
                        }}
                        className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition"
                      >
                        마이페이지
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left text-red-600 hover:bg-gray-50 transition"
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
                className="px-4 py-2 transition bg-white border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                기업 서비스
              </button>
            </div>
          </div>
        </div>
      </header>

      <nav className="relative z-50 bg-white border-b-2 border-blue-600">
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
                  className={`py-4 px-2 font-medium transition whitespace-nowrap ${
                    activeTab === item.id
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  {item.label}
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
            setIsDropdownOpen(false);
            handleMenuClick(menuId);
          }}
        />
      </div>
    </>
  );
}
