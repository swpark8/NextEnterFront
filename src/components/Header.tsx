import { useState, useRef } from "react";
import HoverMenu from "../features/navigation-menu/components/HoverMenu";
import DropdownMenu from "../features/navigation-menu/components/DropdownMenu";

const MENU_CLOSE_DELAY = 150;

interface HeaderProps {
  onLogoClick?: () => void;
  onLoginClick?: () => void;
  onSignupClick?: () => void;
  activeTab: string;
  onTabChange: (tabId: string, menuId?: string) => void;
}

const navItems = [
  { id: "job", label: "채용정보" },
  { id: "resume", label: "이력서" },
  { id: "matching", label: "매칭분석" },
  { id: "interview", label: "모의면접" },
  { id: "mypage", label: "마이페이지" },
  { id: "credit", label: "크레딧" },
];

export default function Header({
  onLogoClick,
  onLoginClick,
  onSignupClick,
  activeTab,
  onTabChange,
}: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
                onClick={onLogoClick}
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
              <button
                onClick={onLoginClick}
                className="px-4 py-2 text-gray-700 transition hover:text-blue-600"
              >
                로그인
              </button>
              <button
                onClick={onSignupClick}
                className="px-4 py-2 text-gray-700 transition hover:text-blue-600"
              >
                회원가입
              </button>
              <button className="px-4 py-2 transition bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
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
                  onClick={() => onTabChange(item.id)}
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
                    onSubMenuClick={(tabId, subId) => onTabChange(tabId, subId)}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </nav>

      <div className="relative z-[45]">
        <DropdownMenu isOpen={isDropdownOpen} />
      </div>
    </>
  );
}
