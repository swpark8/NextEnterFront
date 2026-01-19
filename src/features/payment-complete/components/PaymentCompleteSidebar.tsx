import LeftSidebar from "../../../components/LeftSidebar";

interface PaymentCompleteSidebarProps {
  activeMenu: string;
  onMenuClick: (menuId: string) => void;
}

export default function PaymentCompleteSidebar({
  activeMenu,
  onMenuClick,
}: PaymentCompleteSidebarProps) {
  return <LeftSidebar activeMenu={activeMenu} onMenuClick={onMenuClick} />;
}
