import { useState } from 'react';

interface SidebarProps {
  activeMenu: string;
  onMenuClick: (menuId: string) => void;
  onLogoClick?: () => void;
}

const menuItems = [
  { id: 'home', label: 'MY 홈', icon: '🏠' },
  { id: 'resume', label: '이력서/자소서', icon: '📄' },
  { id: 'application', label: '지원 내역', icon: '📋' },
  { id: 'offer', label: '받은 제안', icon: '💼' },
  { id: 'interview', label: '모의 면접', icon: '🎤' },
  { id: 'credit', label: '크레딧', icon: '💳' },
];

export default function Sidebar2({ activeMenu, onMenuClick, onLogoClick }: SidebarProps) {
  return (
    <aside className="w-64 bg-white border-r-2 border-gray-200 min-h-screen p-6">
      {/* 로고 */}
      <div className="mb-8">
        <button
          onClick={onLogoClick}
          className="w-full text-2xl font-bold text-blue-600 border-2 border-blue-600 rounded-lg p-3 text-center hover:bg-blue-50 transition cursor-pointer"
        >
          NextEnter
        </button>
      </div>

      {/* 메뉴 */}
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onMenuClick(item.id)}
            className={`w-full text-left px-4 py-3 rounded-lg transition flex items-center gap-3 ${
              activeMenu === item.id
                ? 'bg-blue-100 text-blue-600 font-semibold'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
            <svg 
              className={`ml-auto w-4 h-4 transition-transform ${
                activeMenu === item.id ? 'rotate-90' : ''
              }`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ))}
      </nav>
    </aside>
  );
}
