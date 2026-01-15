import LeftSidebar from "../../../components/LeftSidebar";

interface MatchingSidebarProps {
  activeMenu: string;
  onMenuClick: (menuId: string) => void;
}

const menuItems = [
  { id: 'home', label: 'MY 홈', icon: '🏠' },
  { id: 'resume', label: '이력서/자소서', icon: '📄' },
  { id: 'application', label: '지원 내역', icon: '📋' },
  { id: 'offer', label: '받은 제안', icon: '💼' },
  { id: 'matching', label: '매칭 분석', icon: '📊' },
  { id: 'history', label: '매칭 히스토리', icon: '📋' },
  { id: 'credit', label: '크레딧', icon: '💳' },
];
export default function MatchingSidebar({
  activeMenu,
  onMenuClick,
}: MatchingSidebarProps) {
  return <LeftSidebar activeMenu={activeMenu} onMenuClick={onMenuClick} />;
}
