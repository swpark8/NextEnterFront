import LeftSidebar from "../../../components/LeftSidebar";

interface AISidebarProps {
  activeMenu: string;
  onMenuClick: (menuId: string) => void;
}

export default function AISidebar({ activeMenu, onMenuClick }: AISidebarProps) {
  return <LeftSidebar activeMenu={activeMenu} onMenuClick={onMenuClick} />;
}
