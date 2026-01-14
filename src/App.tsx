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
import OfferPage from "./features/offer/OfferPage";
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
import CoverLetterPage from "./features/coverletter/CoverLetterPage";

function App() {
  const [activeTab, setActiveTab] = useState("job");
  const [accountType, setAccountType] = useState<"personal" | "business">(
    "personal"
  );
  const [selectedApplicantId, setSelectedApplicantId] = useState<number>(1);
  const [targetMenu, setTargetMenu] = useState<string | undefined>(undefined);

  const handleTabChange = (tabId: string, menuId?: string) => {
    setActiveTab(tabId);
    setTargetMenu(menuId);
    console.log(`${tabId} 탭으로 이동, 타겟메뉴: ${menuId}`);
  };

  const handleLogoClick = () => handleTabChange("job");
  const handleLoginClick = () => {
    setActiveTab("login");
    setAccountType("personal");
  };
  const handleSignupClick = () => setActiveTab("signup");

  // 기업 서비스 관련 핸들러들
  const handleBusinessServiceClick = () => setActiveTab("businessService");
  const handleJobManagementClick = () => setActiveTab("jobManagement");
  const handleJobPostingCreateClick = () => setActiveTab("jobPostingCreate");
  const handleApplicantManagementClick = () =>
    setActiveTab("applicantManagement");
  const handleApplicantDetailClick = (applicantId: number) => {
    setSelectedApplicantId(applicantId);
    setActiveTab("applicantDetail");
  };
  const handleCreditManagementClick = () => setActiveTab("creditManagement");
  const handleTalentSearchClick = () => setActiveTab("applicantManagement");
  const handleBusinessCreditClick = () => setActiveTab("businessCredit");
  const handleCreditChargeClick = () => setActiveTab("creditCharge");

  // 페이지 렌더링 로직 (로그인/회원가입 등)
  if (activeTab === "login")
    return (
      <LoginPage
        onLogoClick={handleLogoClick}
        onSignupClick={handleSignupClick}
        onAccountTypeChange={setAccountType}
      />
    );
  if (activeTab === "signup")
    return (
      <SignupPage
        onLogoClick={handleLogoClick}
        onLoginClick={handleLoginClick}
        initialAccountType={accountType}
      />
    );

  // 기업 페이지 렌더링
  if (activeTab === "businessService")
    return (
      <BusinessServicePage
        onJobManagementClick={handleJobManagementClick}
        onLogoClick={handleBusinessServiceClick}
        onApplicantManagementClick={handleTalentSearchClick}
        onCreditManagementClick={handleBusinessCreditClick}
      />
    );
  if (activeTab === "jobManagement")
    return (
      <JobManagementPage
        onNewJobClick={handleJobPostingCreateClick}
        onLogoClick={handleBusinessServiceClick}
      />
    );
  if (activeTab === "jobPostingCreate")
    return (
      <JobPostingCreatePage
        onBackClick={handleJobManagementClick}
        onLogoClick={handleBusinessServiceClick}
      />
    );
  if (activeTab === "talentSearch")
    return <TalentSearchPage onLogoClick={handleBusinessServiceClick} />;
  if (activeTab === "businessCredit")
    return <BusinessCreditPage onLogoClick={handleBusinessServiceClick} />;
  if (activeTab === "applicantManagement")
    return (
      <ApplicantManagementPage
        onLogoClick={handleBusinessServiceClick}
        onApplicantClick={handleApplicantDetailClick}
      />
    );
  if (activeTab === "applicantDetail")
    return (
      <ApplicantDetailPage
        applicantId={selectedApplicantId}
        onBackClick={handleApplicantManagementClick}
        onLogoClick={handleBusinessServiceClick}
      />
    );
  if (activeTab === "creditManagement")
    return <CreditManagementPage onLogoClick={handleBusinessServiceClick} />;

  const renderPage = () => {
    switch (activeTab) {
      case "mypage":
        return <MyPage onNavigate={handleTabChange} initialMenu={targetMenu} />;
      case "interview":
        return (
          <InterviewPage
            initialMenu={targetMenu}
            onNavigate={handleTabChange}
          />
        );
      case "credit":
        return (
          <CreditPage
            onCharge={handleCreditChargeClick}
            initialMenu={targetMenu}
            onNavigate={handleTabChange}
          />
        );
      case "creditCharge":
        return <CreditChargePage onBack={() => handleTabChange("credit")} />;
      case "resume":
        // ResumePage는 이미 로직이 적용되어 있습니다.
        if (targetMenu === "resume-sub-2") {
          return (
            <CoverLetterPage
              initialMenu={targetMenu}
              onNavigate={handleTabChange}
            />
          );
        }
        return (
          <ResumePage initialMenu={targetMenu} onNavigate={handleTabChange} />
        );
      case "ai-recommend":
        return (
          <AIRecommendationPage
            initialMenu={targetMenu}
            onNavigate={handleTabChange}
          />
        );
      case "matching":
        return (
          <MatchingPage
            onEditResume={() => handleTabChange("resume")}
            initialMenu={targetMenu}
            onNavigate={handleTabChange}
          />
        );
      case "offer":
        return (
          <OfferPage initialMenu={targetMenu} onNavigate={handleTabChange} />
        );
      default:
        // ✅ [수정] 홈페이지(기본화면)에서도 사이드바 클릭이 되려면 props를 넘겨야 합니다.
        // (HomePage 코드에도 onNavigate 등을 받을 수 있게 수정이 필요할 수 있습니다)
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
