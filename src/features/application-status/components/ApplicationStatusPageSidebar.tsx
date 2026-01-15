import LeftSidebar from "../../../components/LeftSidebar";

interface ApplicationStautsSidebarProps {
  activeMenu: string;
  onMenuClick: (menuId: string) => void;
}

export default function ApplicationStautsSidebar({
  activeMenu,
  onMenuClick,
}: ApplicationStautsSidebarProps) {
  return <LeftSidebar activeMenu={activeMenu} onMenuClick={onMenuClick} />;
}
