import { useState } from "react";
import Header from "./components/Header";
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
  const [accountType, setAccountType] = useState<"personal" | "business">("personal");
  const [selectedApplicantId, setSelectedApplicantId] = useState<number>(1);
  const [targetMenu, setTargetMenu] = useState<string | undefined>(undefined);

  const handleTabChange = (tabId: string, menuId?: string) => {
    setActiveTab(tabId);
    setTargetMenu(menuId);
    console.log(`${tabId} 탭으로 이동, 타겟메뉴: ${menuId}`);
  };

  const handleLogoClick = () => {
    handleTabChange("job");
  };

  const handleLoginClick = () => {
    setActiveTab("login");
    setAccountType("personal");
  };

  const handleSignupClick = () => {
    setActiveTab("signup");
  };

  const handleBusinessServiceClick = () => {
    setActiveTab("businessService");
  };

  const handleJobManagementClick = () => {
    setActiveTab("jobManagement");
  };

  const handleJobPostingCreateClick = () => {
    setActiveTab("jobPostingCreate");
  };

  const handleApplicantManagementClick = () => {
    setActiveTab("applicantManagement");
  };

  const handleApplicantDetailClick = (applicantId: number) => {
    setSelectedApplicantId(applicantId);
    setActiveTab("applicantDetail");
  };

  const handleCreditManagementClick = () => {
    setActiveTab("creditManagement");
  };

  const handleTalentSearchClick = () => {
    setActiveTab("applicantManagement");
  };

  const handleBusinessCreditClick = () => {
    setActiveTab("businessCredit");
  };

  const handleCreditChargeClick = () => {
    setActiveTab("creditCharge");
  };

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
        return <ResumePage initialMenu={targetMenu} />;
      case "ai-recommend":
        return <AIRecommendationPage />;
      case "matching":
        return <MatchingPage onEditResume={() => handleTabChange('resume')} />;
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
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
      {renderPage()}
      <Footer />
    </div>
  );
}

export default App;
