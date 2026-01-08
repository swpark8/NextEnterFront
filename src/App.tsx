import { useState } from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import HomePage from './features/home/HomePage';
import MyPage from './features/mypage/MyPage';
import CreditPage from './features/credit/CreditPage';
import InterviewPage from './features/interview/InterviewPage';
import ResumePage from './features/resume/ResumePage';
import AIRecommendationPage from './features/ai-recommendation/AIRecommendationPage';
import MatchingPage from './features/matching/MatchingPage';

function App() {
  const [activeTab, setActiveTab] = useState('job');

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    console.log(`${tabId} 탭으로 이동`);
  };

  const handleLogoClick = () => {
    setActiveTab('job');
    console.log('로고 클릭 - 홈으로 이동');
  };

  // 현재 활성 탭에 따라 페이지 렌더링
  const renderPage = () => {
    switch (activeTab) {
      case 'mypage':
        return <MyPage />;
      case 'interview':
        return <InterviewPage />;
      case 'credit':
        return <CreditPage />;
      case 'resume':
        return <ResumePage />;
      case 'ai-recommend':
        return <AIRecommendationPage />;
      case 'matching':
        return <MatchingPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onLogoClick={handleLogoClick} />
      <Navigation activeTab={activeTab} onTabChange={handleTabChange} />
      {renderPage()}
    </div>
  );
}

export default App;
