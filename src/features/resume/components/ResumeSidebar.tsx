import { useState } from 'react';

interface ResumeSidebarProps {
  activeMenu: string;
  onMenuClick: (menuId: string) => void;
}

const menuItems = [
  { id: 'home', label: 'MY 홈', icon: '🏠' },
  { id: 'resume', label: '이력서/자소서', icon: '📄', hasSubmenu: true },
  { id: 'application', label: '지원 내역', icon: '📋' },
  { id: 'offer', label: '받은 제안', icon: '💼' },
  { id: 'interview', label: '모의 면접', icon: '🎤' },
  { id: 'credit', label: '크레딧', icon: '💳' },
];

const resumeSubmenu = [
  { id: 'resume-manage', label: '이력서 관리' },
  { id: 'resume-write', label: '자소서 관리' },
];

export default function ResumeSidebar({ activeMenu, onMenuClick }: ResumeSidebarProps) {
  const [showResumeSubmenu, setShowResumeSubmenu] = useState(true);

  return (
    <aside className="w-48 space-y-2">
      {menuItems.map((item) => (
        <div key={item.id}>
          <button
            onClick={() => {
              onMenuClick(item.id);
              if (item.id === 'resume') {
                setShowResumeSubmenu(!showResumeSubmenu);
              }
            }}
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
                activeMenu === item.id || (item.id === 'resume' && showResumeSubmenu) ? 'rotate-90' : ''
              }`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          {/* 서브메뉴 */}
          {item.id === 'resume' && showResumeSubmenu && (
            <div className="ml-8 mt-1 space-y-1">
              {resumeSubmenu.map((subItem) => (
                <button
                  key={subItem.id}
                  onClick={() => onMenuClick(subItem.id)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition text-sm ${
                    activeMenu === subItem.id
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {subItem.label}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </aside>
  );
}
