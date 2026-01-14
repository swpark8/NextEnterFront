import LeftSidebar from "../../../components/LeftSidebar";

interface OfferSidebarProps {
  activeMenu: string;
  onMenuClick: (menuId: string) => void;
}

export default function OfferSidebar({ activeMenu, onMenuClick }: OfferSidebarProps) {
  return <LeftSidebar activeMenu={activeMenu} onMenuClick={onMenuClick} />;
}
