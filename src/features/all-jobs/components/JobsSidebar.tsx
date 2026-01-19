import LeftSidebar from "../../../components/LeftSidebar";

interface JobsSidebarProps {
  activeMenu: string;
  onMenuClick: (menuId: string) => void;
}

export default function JobsSidebar({
  activeMenu,
  onMenuClick,
}: JobsSidebarProps) {
  // menuItems를 전달하지 않으면 LeftSidebar가 기본값으로 전체 메뉴를 사용합니다
  return <LeftSidebar activeMenu={activeMenu} onMenuClick={onMenuClick} />;
}
