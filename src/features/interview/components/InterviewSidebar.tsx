import LeftSidebar from "../../../components/LeftSidebar";

interface InterviewSidebarProps {
  activeMenu: string;
  onMenuClick: (menuId: string) => void;
}

export default function InterviewSidebar({
  activeMenu,
  onMenuClick,
}: InterviewSidebarProps) {
  return <LeftSidebar activeMenu={activeMenu} onMenuClick={onMenuClick} />;
}
