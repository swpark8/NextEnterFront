import { useState } from 'react';

interface InterviewSidebarProps {
  activeMenu: string;
  onMenuClick: (menuId: string) => void;
}

const menuItems = [
  { id: 'home', label: 'MY 홈', icon: '🏠' },
  { id: 'resume', label: '이력서/자소서', icon: '📄' },
  { id: 'application', label: '지원 내역', icon: '📋' },
  { id: 'offer', label: '받은 제안', icon: '💼' },
  { id: 'interview', label: '모의 면접', icon: '🎤' },
  { id: 'credit', label: '크레딧', icon: '💳' },
];

export default function InterviewSidebar({ activeMenu, onMenuClick }: InterviewSidebarProps) {
  return (
    <aside className="w-48 space-y-2">
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
    </aside>
  );
}
