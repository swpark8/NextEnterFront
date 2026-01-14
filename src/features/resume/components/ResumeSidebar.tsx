import LeftSidebar from "../../../components/LeftSidebar";

interface ResumeSidebarProps {
  activeMenu: string;
  onMenuClick: (menuId: string) => void;
}

export default function ResumeSidebar({
  activeMenu,
  onMenuClick,
}: ResumeSidebarProps) {
  return <LeftSidebar activeMenu={activeMenu} onMenuClick={onMenuClick} />;
}
