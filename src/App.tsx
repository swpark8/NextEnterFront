import { useState } from "react";
import Header from "./components/Header";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import HomePage from "./features/home/HomePage";
import MyPage from "./features/mypage/MyPage";
import CreditPage from "./features/credit/CreditPage";
import CreditChargePage from "./features/credit-charge/CreditChargePage";
import InterviewPage from "./features/interview/InterviewPage";
import ResumePage from "./features/resume/ResumePage";
import AIRecommendationPage from "./features/ai-recommendation/AIRecommendationPage";
import MatchingPage from "./features/matching/MatchingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/Signup";
import BusinessServicePage from "./pages/BusinessServicePage";
import JobManagementPage from "./pages/JobManagementPage";
import JobPostingCreatePage from "./pages/JobPostingCreatePage";
import ApplicantManagementPage from "./pages/ApplicantManagementPage";
import ApplicantDetailPage from "./pages/ApplicantDetailPage";
import CreditManagementPage from "./pages/CreditManagementPage";
import TalentSearchPage from "./pages/TalentSearchPage";
import BusinessCreditPage from "./pages/BusinessCreditPage";

function App() {
  const [activeTab, setActiveTab] = useState("job");
  const [accountType, setAccountType] = useState<"personal" | "business">(
    "personal"
  );
  const [selectedApplicantId, setSelectedApplicantId] = useState<number>(1);

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

  const handleBusinessServiceClick = () => {
    setActiveTab("businessService");
    console.log("기업 서비스 페이지로 이동");
  };

  const handleJobManagementClick = () => {
    setActiveTab("jobManagement");
    console.log("공고 관리 페이지로 이동");
  };

  const handleJobPostingCreateClick = () => {
    setActiveTab("jobPostingCreate");
    console.log("새 공고 등록 페이지로 이동");
  };

  const handleApplicantManagementClick = () => {
    setActiveTab("applicantManagement");
    console.log("지원자 관리 페이지로 이동");
  };

  const handleApplicantDetailClick = (applicantId: number) => {
    setSelectedApplicantId(applicantId);
    setActiveTab("applicantDetail");
    console.log(`지원자 ${applicantId} 상세 페이지로 이동`);
  };

  const handleCreditManagementClick = () => {
    setActiveTab("creditManagement");
    console.log("크레딧 관리 페이지로 이동");
  };

  const handleTalentSearchClick = () => {
    setActiveTab("applicantManagement");
    console.log("지원자 관리 페이지로 이동");
  };

  const handleBusinessCreditClick = () => {
    setActiveTab("businessCredit");
    console.log("기업 크레딧 페이지로 이동");
  };

  const handleCreditChargeClick = () => {
    setActiveTab("creditCharge");
    console.log("크레딧 충전 페이지로 이동");
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

  if (activeTab === "businessService") {
    return (
      <BusinessServicePage 
        onJobManagementClick={handleJobManagementClick} 
        onLogoClick={handleBusinessServiceClick}
        onApplicantManagementClick={handleTalentSearchClick}
        onCreditManagementClick={handleBusinessCreditClick}
      />
    );
  }

  if (activeTab === "jobManagement") {
    return <JobManagementPage onNewJobClick={handleJobPostingCreateClick} onLogoClick={handleBusinessServiceClick} />;
  }

  if (activeTab === "jobPostingCreate") {
    return <JobPostingCreatePage onBackClick={handleJobManagementClick} onLogoClick={handleBusinessServiceClick} />;
  }

  if (activeTab === "talentSearch") {
    return <TalentSearchPage onLogoClick={handleBusinessServiceClick} />;
  }

  if (activeTab === "businessCredit") {
    return <BusinessCreditPage onLogoClick={handleBusinessServiceClick} />;
  }

  if (activeTab === "applicantManagement") {
    return (
      <ApplicantManagementPage 
        onLogoClick={handleBusinessServiceClick}
        onApplicantClick={handleApplicantDetailClick}
      />
    );
  }

  if (activeTab === "applicantDetail") {
    return (
      <ApplicantDetailPage 
        applicantId={selectedApplicantId}
        onBackClick={handleApplicantManagementClick}
        onLogoClick={handleBusinessServiceClick}
      />
    );
  }

  if (activeTab === "creditManagement") {
    return <CreditManagementPage onLogoClick={handleBusinessServiceClick} />;
  }

  // 현재 활성 탭에 따라 페이지 렌더링
  const renderPage = () => {
    switch (activeTab) {
      case "mypage":
        return <MyPage onNavigate={handleTabChange} />;
      case "interview":
        return <InterviewPage />;
      case "credit":
        return <CreditPage onCharge={handleCreditChargeClick} />;
      case "creditCharge":
        return <CreditChargePage onBack={() => handleTabChange('credit')} />;
      case "resume":
        return <ResumePage />;
      case "ai-recommend":
        return <AIRecommendationPage />;
      case "matching":
        return <MatchingPage onEditResume={() => handleTabChange('resume')} />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header
        onLogoClick={handleLogoClick}
        onLoginClick={handleLoginClick}
        onSignupClick={handleSignupClick}
        onBusinessServiceClick={handleBusinessServiceClick}
      />
      <Navigation activeTab={activeTab} onTabChange={handleTabChange} />
      <div className="flex-1">
        {renderPage()}
      </div>
      <Footer />
    </div>
  );
}

export default App;
