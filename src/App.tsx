import { useState } from "react";
import Header from "./components/Header";
import Navigation from "./components/Navigation";
import HomePage from "./features/home/HomePage";
import MyPage from "./features/mypage/MyPage";
import CreditPage from "./features/credit/CreditPage";
import InterviewPage from "./features/interview/InterviewPage";
import ResumePage from "./features/resume/ResumePage";
import AIRecommendationPage from "./features/ai-recommendation/AIRecommendationPage";
import MatchingPage from "./features/matching/MatchingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/Signup";

function App() {
  const [activeTab, setActiveTab] = useState("job");
  const [accountType, setAccountType] = useState<"personal" | "business">(
    "personal"
  );

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    console.log(`${tabId} 탭으로 이동`);
  };

  const handleLogoClick = () => {
    setActiveTab("job");
    console.log("로고 클릭 - 홈으로 이동");
  };

  const handleLoginClick = () => {
    setActiveTab("login");
    setAccountType("personal"); // ← 이 줄 추가
    console.log("로그인 페이지로 이동");
  };

  const handleSignupClick = () => {
    setActiveTab("signup");
    console.log("회원가입 페이지로 이동");
  };

  // 독립적인 레이아웃을 사용하는 페이지들
  if (activeTab === "login") {
    return (
      <LoginPage
        onLogoClick={handleLogoClick}
        onSignupClick={handleSignupClick}
        onAccountTypeChange={setAccountType}
      />
    );
  }

  if (activeTab === "signup") {
    return (
      <SignupPage
        onLogoClick={handleLogoClick}
        onLoginClick={handleLoginClick}
        // onSignupClick={handleSignupClick}
        initialAccountType={accountType}
      />
    );
  }

  // 현재 활성 탭에 따라 페이지 렌더링
  const renderPage = () => {
    switch (activeTab) {
      case "mypage":
        return <MyPage />;
      case "interview":
        return <InterviewPage />;
      case "credit":
        return <CreditPage />;
      case "resume":
        return <ResumePage />;
      case "ai-recommend":
        return <AIRecommendationPage />;
      case "matching":
        return <MatchingPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onLogoClick={handleLogoClick}
        onLoginClick={handleLoginClick}
        onSignupClick={handleSignupClick}
      />
      <Navigation activeTab={activeTab} onTabChange={handleTabChange} />
      {renderPage()}
    </div>
  );
}

export default App;
