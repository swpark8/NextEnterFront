import LeftSidebar from "../../../components/LeftSidebar";

interface MyPageSidebarProps {
  activeMenu: string;
  onMenuClick: (menuId: string) => void;
}

export default function MyPageSidebar({
  activeMenu,
  onMenuClick,
}: MyPageSidebarProps) {
  return <LeftSidebar activeMenu={activeMenu} onMenuClick={onMenuClick} />;
}
