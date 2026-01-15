import { useState, useEffect } from "react";
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
import ProfilePage from "./pages/ProfilePage";
import AdvertisementManagementPage from "./pages/AdvertisementManagementPage";
import AdvertisementCreatePage from "./pages/AdvertisementCreatePage";
import AdvertisementDetailPage from "./pages/AdvertisementDetailPage";
import JobPostingDetailPage from "./pages/JobPostingDetailPage";
import OAuth2CallbackPage from "./pages/OAuth2CallbackPage";
import InterviewResultPage from "./pages/InterviewResultPage";
import AllJobsPage from "./features/all-jobs/AllJobsPage";
import AIRecommendedJobsPage from "./features/all-jobs/AIRecommendedJobsPage";
import PositionJobsPage from "./features/all-jobs/PositionJobsPage";
import LocationJobsPage from "./features/all-jobs/LocationJobsPage";
import InterviewOfferPage from "./features/offer/InterViewOfferPage";
import ApplicationStatusPage from "./features/application-status/ApplicationStatusPage";

function App() {
  const [activeTab, setActiveTab] = useState("job");
  const [previousTab, setPreviousTab] = useState("job");
  const [accountType, setAccountType] = useState<"personal" | "business">(
    "personal"
  );
  const [selectedApplicantId, setSelectedApplicantId] = useState<number>(1);
  const [targetMenu, setTargetMenu] = useState<string | undefined>(undefined);

  // OAuth2 리다이렉트 감지
  useEffect(() => {
    const path = window.location.pathname;
    const search = window.location.search;

    if (path === "/oauth2/redirect" && search.includes("token=")) {
      setActiveTab("oauth2-callback");
    }
  }, []);

  const handleTabChange = (tabId: string, menuId?: string) => {
    setPreviousTab(activeTab);
    setActiveTab(tabId);
    setTargetMenu(menuId);
    console.log(`${tabId} 탭으로 이동, 이전 탭: ${activeTab}, 메뉴: ${menuId}`);
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
  const handleCreditChargeClick = () => handleTabChange("credit", "credit-sub-2");

  const handleApplicantCompatibilityClick = (applicantId: number) => {
    setSelectedApplicantId(applicantId);
    setActiveTab("applicantCompatibility");
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

  const handleAdvertisementManagementClick = () => {
    setActiveTab("advertisementManagement");
  };

  const handleAdvertisementCreateClick = () => {
    setActiveTab("advertisementCreate");
  };

  const handleAdvertisementDetailClick = (id: number) => {
    setSelectedAdvertisementId(id);
    setActiveTab("advertisementDetail");
  };

  const handleCreditChargeClick = () => {
    setActiveTab("creditCharge");
  };

  const handleBusinessCreditChargeClick = () => {
    setActiveTab("businessCreditCharge");
  };

  // OAuth2 콜백 처리
  if (activeTab === "oauth2-callback") {
    return <OAuth2CallbackPage onLoginSuccess={() => handleTabChange("job")} />;
  }

  if (activeTab === "login") {
    return (
      <LoginPage
        onLogoClick={handleLogoClick}
        onSignupClick={handleSignupClick}
        onAccountTypeChange={setAccountType}
        onLoginSuccess={() => handleTabChange("job")}
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
      <BusinessCreditPage
        onLogoClick={handleBusinessServiceClick}
        onChargeClick={handleBusinessCreditChargeClick}
      />
    );
  }

  if (activeTab === "profile") {
    return <ProfilePage onBack={() => handleTabChange(previousTab)} />;
  }

  if (activeTab === "businessCreditCharge") {
    return <CreditChargePage onBack={handleBusinessCreditClick} />;
  }

  if (activeTab === "applicantManagement") {
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
    console.log("현재 activeTab:", activeTab, "targetMenu:", targetMenu); // 디버깅용
    
    switch (activeTab) {
      case "profile":
        return <ProfilePage onBack={() => handleTabChange("mypage")} />;
      case "application-status":
        return (
          <ApplicationStatusPage
            initialMenu={targetMenu}
            onNavigate={handleTabChange}
          />
        );
      case "job":
        // 채용정보 서브메뉴 처리
        if (targetMenu === "1-1") {
          // 전체 공고 페이지
          return (
            <AllJobsPage
              onLogoClick={handleLogoClick}
              onNavigateToAI={() => handleTabChange("job", "1-2")}
              onNavigateToPosition={() => handleTabChange("job", "1-3")}
              onNavigateToLocation={() => handleTabChange("job", "1-4")}
            />
          );
        }
        if (targetMenu === "1-2") {
          // AI 추천 공고 페이지
          return (
            <AIRecommendedJobsPage
              onLogoClick={handleLogoClick}
              onNavigateToAll={() => handleTabChange("job", "1-1")}
              onNavigateToPosition={() => handleTabChange("job", "1-3")}
              onNavigateToLocation={() => handleTabChange("job", "1-4")}
            />
          );
        }
        if (targetMenu === "1-3") {
          // 직무별 공고 페이지
          return (
            <PositionJobsPage
              onLogoClick={handleLogoClick}
              onNavigateToAll={() => handleTabChange("job", "1-1")}
              onNavigateToAI={() => handleTabChange("job", "1-2")}
              onNavigateToLocation={() => handleTabChange("job", "1-4")}
            />
          );
        }
        if (targetMenu === "1-4") {
          // 지역별 공고 페이지
          return (
            <LocationJobsPage
              onLogoClick={handleLogoClick}
              onNavigateToAll={() => handleTabChange("job", "1-1")}
              onNavigateToAI={() => handleTabChange("job", "1-2")}
              onNavigateToPosition={() => handleTabChange("job", "1-3")}
            />
          );
        }
        // 기본 홈페이지
        return <HomePage onLoginClick={handleLoginClick} />;
      case "mypage":
        // targetMenu가 mypage-sub-3(지원 이력)이면 ApplicationStatusPage
        if (targetMenu === "mypage-sub-3") {
          return (
            <ApplicationStatusPage
              initialMenu={targetMenu}
              onNavigate={handleTabChange}
            />
          );
        }
        return (
          <MyPage
            onNavigate={handleTabChange}
            onEditProfile={() => handleTabChange("profile")}
            initialMenu={targetMenu}
          />
        );
      case "interview":
        return (
          <InterviewPage
            initialMenu={targetMenu}
            onNavigate={handleTabChange}
          />
        );
      case "credit":
        if (targetMenu === "credit-sub-2") {
          return (
            <CreditChargePage
              onBack={() => handleTabChange("credit")}
              initialMenu={targetMenu}
              onNavigate={handleTabChange}
            />
          );
        }
        return (
          <CreditPage
            onCharge={handleCreditChargeClick}
            initialMenu={targetMenu}
            onNavigate={handleTabChange}
          />
        );
      case "resume":
        // targetMenu가 자소서 관련이면 CoverLetterPage, 아니면 ResumePage
        if (targetMenu === "resume-sub-2") {
          return (
            <CoverLetterPage
              key="coverletter"
              initialMenu={targetMenu}
              onNavigate={handleTabChange}
            />
          );
        }
        // targetMenu가 없거나 resume-sub-1이면 ResumePage (기본값)
        // ✅ key prop: targetMenu 변경 시 컴포넌트를 완전히 새로 마운트하여 내부 상태(isCreating) 초기화
        return (
          <ResumePage
            key={targetMenu || "resume-default"}
            initialMenu={targetMenu}
            onNavigate={handleTabChange}
          />
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
        if (targetMenu === "offer-sub-2") {
          return (
            <InterviewOfferPage
              key="interview-offer"
              initialMenu={targetMenu}
              onNavigate={handleTabChange}
            />
          );
        }
        return (
          <OfferPage
            key={targetMenu || "offer-default"}
            initialMenu={targetMenu}
            onNavigate={handleTabChange}
          />
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
