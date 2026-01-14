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
import ApplicationStatusPage from "./features/application-status/ApplicationStatusPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/Signup";
import BusinessServicePage from "./pages/BusinessServicePage";
import JobManagementPage from "./pages/JobManagementPage";
import JobPostingCreatePage from "./pages/JobPostingCreatePage";
import ApplicantManagementPage from "./pages/ApplicantManagementPage";
import ApplicantDetailPage from "./pages/ApplicantDetailPage";
import ApplicantCompatibilityPage from "./pages/ApplicantCompatibilityPage";
import CreditManagementPage from "./pages/CreditManagementPage";
import TalentSearchPage from "./pages/TalentSearchPage";
import BusinessCreditPage from "./pages/BusinessCreditPage";
import ProfilePage from "./pages/ProfilePage";
import AdvertisementManagementPage from "./pages/AdvertisementManagementPage";
import AdvertisementCreatePage from "./pages/AdvertisementCreatePage";
import AdvertisementDetailPage from "./pages/AdvertisementDetailPage";
import JobPostingDetailPage from "./pages/JobPostingDetailPage";
import InterviewResultPage from "./pages/InterviewResultPage";
import AllJobsPage from "./features/all-jobs/AllJobsPage";
import AIRecommendedJobsPage from "./features/all-jobs/AIRecommendedJobsPage";
import PositionJobsPage from "./features/all-jobs/PositionJobsPage";
import LocationJobsPage from "./features/all-jobs/LocationJobsPage";

function App() {
  const [activeTab, setActiveTab] = useState("job");
  const [previousTab, setPreviousTab] = useState("job"); // ✅ 이전 탭 추적
  const [accountType, setAccountType] = useState<"personal" | "business">(
    "personal"
  );
  const [selectedApplicantId, setSelectedApplicantId] = useState<number>(1);
  const [selectedAdvertisementId, setSelectedAdvertisementId] =
    useState<number>(1);
  const [selectedJobId, setSelectedJobId] = useState<number>(1);
  const [targetMenu, setTargetMenu] = useState<string | undefined>(undefined);

  const handleTabChange = (tabId: string, menuId?: string) => {
    // ✅ 현재 탭을 이전 탭으로 저장
    setPreviousTab(activeTab);
    setActiveTab(tabId);
    setTargetMenu(menuId);
    console.log(`${tabId} 탭으로 이동, 이전 탭: ${activeTab}, 메뉴: ${menuId}`);
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

  const handleJobDetailClick = (jobId: number) => {
    setSelectedJobId(jobId);
    setActiveTab("jobDetail");
  };

  const handleApplicantManagementClick = () => {
    setActiveTab("applicantManagement");
  };

  const handleApplicantDetailClick = (applicantId: number) => {
    setSelectedApplicantId(applicantId);
    setActiveTab("applicantDetail");
  };

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

  if (activeTab === "login") {
    return (
      <LoginPage
        onLogoClick={handleLogoClick}
        onSignupClick={handleSignupClick}
        onAccountTypeChange={setAccountType}
        onLoginSuccess={() => handleTabChange("job")}
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
        onAdvertisementManagementClick={handleAdvertisementManagementClick}
        onJobDetailClick={handleJobDetailClick}
      />
    );
  }

  if (activeTab === "jobManagement") {
    return (
      <JobManagementPage
        onNewJobClick={handleJobPostingCreateClick}
        onLogoClick={handleBusinessServiceClick}
        onJobDetailClick={handleJobDetailClick}
      />
    );
  }

  if (activeTab === "jobPostingCreate") {
    return (
      <JobPostingCreatePage
        onBackClick={handleJobManagementClick}
        onLogoClick={handleBusinessServiceClick}
      />
    );
  }

  if (activeTab === "jobDetail") {
    return (
      <JobPostingDetailPage
        jobId={selectedJobId}
        onBackClick={handleJobManagementClick}
        onLogoClick={handleBusinessServiceClick}
        onEditClick={handleJobPostingCreateClick}
      />
    );
  }

  if (activeTab === "talentSearch") {
    return <TalentSearchPage onLogoClick={handleBusinessServiceClick} />;
  }

  if (activeTab === "businessCredit") {
    return (
      <BusinessCreditPage
        onLogoClick={handleBusinessServiceClick}
        onChargeClick={handleBusinessCreditChargeClick}
      />
    );
  }

  if (activeTab === "profile") {
    // ✅ 이전 페이지로 돌아가도록 수정
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
  }

  if (activeTab === "applicantDetail") {
    return (
      <ApplicantDetailPage
        applicantId={selectedApplicantId}
        onBackClick={handleApplicantManagementClick}
        onLogoClick={handleBusinessServiceClick}
        onCompatibilityClick={handleApplicantCompatibilityClick}
      />
    );
  }

  if (activeTab === "applicantCompatibility") {
    return (
      <ApplicantCompatibilityPage
        applicantId={selectedApplicantId}
        onBackClick={handleApplicantDetailClick.bind(null, selectedApplicantId)}
        onLogoClick={handleBusinessServiceClick}
      />
    );
  }

  if (activeTab === "creditManagement") {
    return <CreditManagementPage onLogoClick={handleBusinessServiceClick} />;
  }

  if (activeTab === "advertisementManagement") {
    return (
      <AdvertisementManagementPage
        onNewAdClick={handleAdvertisementCreateClick}
        onLogoClick={handleBusinessServiceClick}
        onAdDetailClick={handleAdvertisementDetailClick}
      />
    );
  }

  if (activeTab === "advertisementCreate") {
    return (
      <AdvertisementCreatePage
        onBackClick={handleAdvertisementManagementClick}
        onLogoClick={handleBusinessServiceClick}
      />
    );
  }

  if (activeTab === "advertisementDetail") {
    return (
      <AdvertisementDetailPage
        advertisementId={selectedAdvertisementId}
        onBackClick={handleAdvertisementManagementClick}
        onLogoClick={handleBusinessServiceClick}
        onEditClick={handleAdvertisementCreateClick}
      />
    );
  }

  const renderPage = () => {
    console.log("현재 activeTab:", activeTab, "targetMenu:", targetMenu); // 디버깅용
    
    switch (activeTab) {
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
        return (
          <MyPage
            onNavigate={handleTabChange}
            onEditProfile={() => handleTabChange("profile")}
          />
        );
      case "interview":
        // 🆕 면접 결과 서브메뉴 처리
        console.log("interview 탭 진입, targetMenu:", targetMenu); // 디버깅용
        if (targetMenu === "5-3") {
          console.log("면접 결과 페이지 렌더링"); // 디버깅용
          return <InterviewResultPage onNavigateToInterview={() => handleTabChange("interview")} />;
        }
        if (targetMenu === "5-1" || targetMenu === "5-2") {
          return <InterviewPage />;
        }
        // targetMenu가 없으면 기본 면접 페이지
        return <InterviewPage />;
      case "credit":
        return <CreditPage onCharge={handleCreditChargeClick} />;
      case "creditCharge":
        return <CreditChargePage onBack={() => handleTabChange("credit")} />;
      case "resume":
        return <ResumePage 
          initialMenu={targetMenu} 
          onApplicationStatusClick={() => handleTabChange("application-status")}
        />;
      case "ai-recommend":
        return <AIRecommendationPage />;
      case "matching":
        // 매칭 히스토리 서브메뉴 처리
        console.log("matching 탭, targetMenu:", targetMenu); // 디버깅용
        if (targetMenu === "4-2") {
          console.log("매칭 히스토리 페이지로 이동"); // 디버깅용
          return <MatchingPage key="history" onEditResume={() => handleTabChange("resume")} initialMenu="history" />;
        }
        return <MatchingPage key="matching" onEditResume={() => handleTabChange("resume")} />;
      case "application-status":
        return <ApplicationStatusPage />;
      default:
        return <HomePage onLoginClick={handleLoginClick} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onLogoClick={handleLogoClick}
        onLoginClick={handleLoginClick}
        onSignupClick={handleSignupClick}
        onBusinessServiceClick={handleBusinessServiceClick}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
      {renderPage()}
      <Footer />
    </div>
  );
}

export default App;
