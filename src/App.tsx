import { useState } from "react";
import Header from "./components/Header";
import Navigation from "./components/Navigation";
import CreditPage from "./pages/CreditPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import MyPage from "./pages/MyPage";
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
  if (activeTab === "credit") {
    return <CreditPage onLogoClick={handleLogoClick} />;
  }

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
