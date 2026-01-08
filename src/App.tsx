import { useState } from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import MyPage from './pages/MyPage';
import CreditPage from './pages/CreditPage';

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

  // 크레딧 페이지는 독립적인 레이아웃을 사용
  if (activeTab === 'credit') {
    return <CreditPage onLogoClick={handleLogoClick} />;
  }

  // 현재 활성 탭에 따라 페이지 렌더링
  const renderPage = () => {
    switch (activeTab) {
      case 'mypage':
        return <MyPage />;
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
