import LeftSidebar from "../../../components/LeftSidebar";

interface InterviewSidebarProps {
  activeMenu: string;
  onMenuClick: (menuId: string) => void;
}

const menuItems = [
  { id: 'home', label: 'MY 홈', icon: '🏠' },
  { id: 'resume', label: '이력서/자소서', icon: '📄' },
  { id: 'application', label: '지원 내역', icon: '📋' },
  { id: 'interview', label: '모의 면접', icon: '🎤' },
  { id: 'offer', label: '받은 제안', icon: '💼' },
  { id: 'results', label: '면접 결과', icon: '📊' },
  { id: 'credit', label: '크레딧', icon: '💳' },
];
export default function InterviewSidebar({
  activeMenu,
  onMenuClick,
}: InterviewSidebarProps) {
  return <LeftSidebar activeMenu={activeMenu} onMenuClick={onMenuClick} />;
}
