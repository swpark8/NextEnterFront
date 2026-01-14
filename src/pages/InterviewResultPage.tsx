import MockInterviewResultPage from '../features/interview/components/MockInterviewResultPage';

interface InterviewResultPageProps {
  onNavigateToInterview?: () => void;
}

export default function InterviewResultPage({ onNavigateToInterview }: InterviewResultPageProps) {
  return <MockInterviewResultPage onNavigateToInterview={onNavigateToInterview} />;
}
