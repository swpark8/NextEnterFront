import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import UserLayout from "./layouts/UserLayout";
import CompanyLayout from "./layouts/CompanyLayout";

// 공통 페이지
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/Signup";
import OAuth2CallbackPage from "./pages/OAuth2CallbackPage";

// 개인회원 페이지들
import HomePage from "./features/home/HomePage";
import MyPage from "./features/mypage/MyPage";
import ProfilePage from "./features/mypage/ProfilePage";
import CreditPage from "./features/credit/CreditPage";
import CreditChargePage from "./features/credit-charge/CreditChargePage";
import InterviewPage from "./features/interview/InterviewPage";
import InterviewResultPage from "./features/interview/InterviewResultPage";
import ResumePage from "./features/resume/ResumePage";
import CoverLetterPage from "./features/coverletter/CoverLetterPage";
import AIRecommendationPage from "./features/ai-recommendation/AIRecommendationPage";
import MatchingPage from "./features/matching/MatchingPage";
import OfferPage from "./features/offer/OfferPage";
import InterviewOfferPage from "./features/offer/InterViewOfferPage";
import ApplicationStatusPage from "./features/application-status/ApplicationStatusPage";
import AllJobsPage from "./features/all-jobs/AllJobsPage";
import AIRecommendedJobsPage from "./features/all-jobs/AIRecommendedJobsPage";
import PositionJobsPage from "./features/all-jobs/PositionJobsPage";
import LocationJobsPage from "./features/all-jobs/LocationJobsPage";

// 기업회원 페이지들
import CompanyHomePage from "./features-company/home/CompanyHomePage";
import JobManagementPage from "./features-company/jobs/JobManagementPage";
import JobPostingCreatePage from "./features-company/jobs/JobPostingCreatePage";
import JobPostingDetailPage from "./features-company/jobs/JobPostingDetailPage";
import ApplicantManagementPage from "./features-company/applicants/ApplicantManagementPage";
import ApplicantDetailPage from "./features-company/applicants/ApplicantDetailPage";
import ApplicantCompatibilityPage from "./features-company/applicants/ApplicantCompatibilityPage";
import TalentSearchPage from "./features-company/talent-search/TalentSearchPage";
import BusinessCreditPage from "./features-company/credit/BusinessCreditPage";
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* 루트 경로 - /user로 리다이렉트 */}
          <Route path="/" element={<Navigate to="/user" replace />} />

          {/* OAuth2 콜백 */}
          <Route path="/oauth2/redirect" element={<OAuth2CallbackPage />} />

          {/* ===== 개인회원 영역 (/user) ===== */}
          <Route path="/user" element={<UserLayout />}>
            {/* 공개 페이지 */}
            <Route index element={<HomePage />} />
            <Route
              path="login"
              element={<LoginPage initialAccountType="personal" />}
            />
            <Route
              path="signup"
              element={<SignupPage initialAccountType="personal" />}
            />

            {/* 채용정보 서브 페이지 */}
            <Route path="jobs/all" element={<AllJobsPage />} />
            <Route path="jobs/ai" element={<AIRecommendedJobsPage />} />
            <Route path="jobs/position" element={<PositionJobsPage />} />
            <Route path="jobs/location" element={<LocationJobsPage />} />

            {/* 보호된 페이지 (로그인 필요 + 개인회원만) */}
            <Route
              path="mypage"
              element={
                <ProtectedRoute allowedUserType="personal">
                  <MyPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="profile"
              element={
                <ProtectedRoute allowedUserType="personal">
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="credit"
              element={
                <ProtectedRoute allowedUserType="personal">
                  <CreditPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="credit/charge"
              element={
                <ProtectedRoute allowedUserType="personal">
                  <CreditChargePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="interview"
              element={
                <ProtectedRoute allowedUserType="personal">
                  <InterviewPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="interview/result"
              element={
                <ProtectedRoute allowedUserType="personal">
                  <InterviewResultPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="resume"
              element={
                <ProtectedRoute allowedUserType="personal">
                  <ResumePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="coverletter"
              element={
                <ProtectedRoute allowedUserType="personal">
                  <CoverLetterPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="ai-recommend"
              element={
                <ProtectedRoute allowedUserType="personal">
                  <AIRecommendationPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="matching"
              element={
                <ProtectedRoute allowedUserType="personal">
                  <MatchingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="offers"
              element={
                <ProtectedRoute allowedUserType="personal">
                  <OfferPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="offers/interview"
              element={
                <ProtectedRoute allowedUserType="personal">
                  <InterviewOfferPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="application-status"
              element={
                <ProtectedRoute allowedUserType="personal">
                  <ApplicationStatusPage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* ===== 기업회원 영역 (/company) ===== */}
          <Route path="/company" element={<CompanyLayout />}>
            {/* 공개 페이지 */}
            <Route index element={<CompanyHomePage />} />
            <Route
              path="login"
              element={<LoginPage initialAccountType="business" />}
            />
            <Route
              path="signup"
              element={<SignupPage initialAccountType="business" />}
            />

            {/* 보호된 페이지 (로그인 필요 + 기업회원만) */}
            <Route
              path="jobs"
              element={
                <ProtectedRoute allowedUserType="company">
                  <JobManagementPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="jobs/create"
              element={
                <ProtectedRoute allowedUserType="company">
                  <JobPostingCreatePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="jobs/:jobId"
              element={
                <ProtectedRoute allowedUserType="company">
                  <JobPostingDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="applicants"
              element={
                <ProtectedRoute allowedUserType="company">
                  <ApplicantManagementPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="applicants/:applicantId"
              element={
                <ProtectedRoute allowedUserType="company">
                  <ApplicantDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="applicants/:applicantId/compatibility"
              element={
                <ProtectedRoute allowedUserType="company">
                  <ApplicantCompatibilityPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="talent-search"
              element={
                <ProtectedRoute allowedUserType="company">
                  <TalentSearchPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="credit"
              element={
                <ProtectedRoute allowedUserType="company">
                  <BusinessCreditPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="credit/charge"
              element={
                <ProtectedRoute allowedUserType="company">
                  <CreditChargePage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* 404 페이지 */}
          <Route path="*" element={<Navigate to="/user" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
