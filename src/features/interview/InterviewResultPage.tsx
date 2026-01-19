import MockInterviewResultPage from "./components/MockInterviewResultPage";
import { usePageNavigation } from "../../hooks/usePageNavigation";

interface InterviewResultPageProps {
  onNavigateToInterview?: () => void;
}

export default function InterviewResultPage({
  onNavigateToInterview,
}: InterviewResultPageProps) {
  // "interview" 카테고리의 "interview-sub-3"(면접 결과) 메뉴로 설정
  const { activeMenu, handleMenuClick } = usePageNavigation(
    "interview",
    "interview-sub-3"
  );

  return (
    <MockInterviewResultPage
      onNavigateToInterview={onNavigateToInterview}
      activeMenu={activeMenu}
      onMenuClick={handleMenuClick}
    />
  );
}
