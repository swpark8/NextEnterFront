import LeftSidebar from "../../../components/LeftSidebar";

interface CreditSidebarProps {
  activeMenu: string;
  onMenuClick: (menuId: string) => void;
}

export default function CreditSidebar({
  activeMenu,
  onMenuClick,
}: CreditSidebarProps) {
  return <LeftSidebar activeMenu={activeMenu} onMenuClick={onMenuClick} />;
}
