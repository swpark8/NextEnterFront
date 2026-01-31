import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getResumeList } from "../../api/resume";
import { getJobPostings } from "../../api/job";
import { getAiRecommendation, CompanyInfo, AiRecommendRequest } from "../../api/ai";

import MatchingSidebar from "./components/MatchingSidebar";
import MatchingHistoryPage from "./components/MatchingHistoryPage";
import ConfirmDialog from "./components/ConfirmDialog";
import MatchingHeader from "./components/MatchingHeader";
import TargetSelection from "./components/TargetSelection";
import EmptyAnalysis from "./components/EmptyAnalysis";
import AnalysisResult from "./components/AnalysisResult";
import { useApp } from "../../context/AppContext";
import { usePageNavigation } from "../../hooks/usePageNavigation";
import { CREDIT_COST } from "./data/sampleData";

// ✅ [설정] 히스토리 자동 삭제 시간 (현재: 3분)
// 테스트 성공 후 나중에 이 값을 늘리시면 됩니다. (예: 30일 = 30 * 24 * 60 * 60 * 1000)
const HISTORY_EXPIRATION_MS = 3 * 60 * 1000;


interface MatchingPageProps {
  onEditResume?: () => void;
  initialMenu?: string;
  onNavigate?: (page: string, subMenu?: string) => void;
}

export default function MatchingPage({
  onEditResume,
  initialMenu = "matching",
  onNavigate,
}: MatchingPageProps) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { activeMenu, handleMenuClick, setActiveMenu } = usePageNavigation(
    "matching",
    initialMenu || "matching-sub-1",
    onNavigate
  );

  const [selectedResume, setSelectedResume] = useState("");
  const [currentCredit, setCurrentCredit] = useState(200);
  const [hasAnalysis, setHasAnalysis] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [recommendedCompanies, setRecommendedCompanies] = useState<CompanyInfo[]>([]);
  const [aiReport, setAiReport] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // AppContext에서 히스토리 상태와 setter 가져오기
  const {
    resumes,
    businessJobs,
    addMatchingHistory,
    // @ts-ignore
    matchingHistory,
    // @ts-ignore
    setMatchingHistory,
    setResumes,
    setBusinessJobs
  } = useApp();

  // ========================================================================
  // 🕒 [기능 1] 히스토리 자동 삭제 로직 (Auto Delete)
  // ========================================================================
  useEffect(() => {
    // 10초마다 검사 실행
    const interval = setInterval(() => {
      if (!matchingHistory || matchingHistory.length === 0) return;

      const now = Date.now();
      // 유효기간(3분)이 지나지 않은 '신선한' 기록만 남김
      const freshHistory = matchingHistory.filter((item: any) => {
        // item.id는 생성 시점의 timestamp(Date.now())입니다.
        return (now - item.id) < HISTORY_EXPIRATION_MS;
      });

      // 만약 지워야 할 오래된 기록이 있다면 상태 업데이트
      if (freshHistory.length < matchingHistory.length) {
        if (setMatchingHistory) {
          setMatchingHistory(freshHistory);
          console.log(`🧹 [Auto Clean] ${matchingHistory.length - freshHistory.length}개의 오래된 히스토리가 자동 삭제되었습니다.`);
        }
      }
    }, 10000); // 10초 주기

    return () => clearInterval(interval);
  }, [matchingHistory, setMatchingHistory]);

  // ========================================================================
  // 🗑️ [기능 2] 히스토리 수동 삭제 함수 (Manual Delete)
  // MatchingHistoryPage 컴포넌트에 prop으로 전달해서 버튼 클릭 시 실행
  // ========================================================================
  const handleDeleteHistory = (historyId: number) => {
    if (!matchingHistory || !setMatchingHistory) return;

    if (window.confirm("정말 이 히스토리를 삭제하시겠습니까?")) {
      const updatedHistory = matchingHistory.filter((h: any) => h.id !== historyId);
      setMatchingHistory(updatedHistory);
    }
  };

  // 1. 이력서 목록 로드
  useEffect(() => {
    const loadResumes = async () => {
      if (user?.userId) {
        try {
          console.log('🔄 [MatchingPage] 이력서 목록 동기화 시작 (userId: ' + user.userId + ')');
          const data = await getResumeList(user.userId);
          if (Array.isArray(data)) {
            const contextResumes = data.map((resume) => ({
              id: resume.resumeId,
              title: resume.title,
              industry: resume.jobCategory || '미지정',
              applications: 0,
            }));
            setResumes(contextResumes);
            console.log('✅ [MatchingPage] 이력서 목록 동기화 완료:', contextResumes.length + '개');
          }
        } catch (error) {
          console.error('❌ [MatchingPage] 이력서 로드 오류:', error);
        }
      }
    };
    loadResumes();
  }, [user?.userId, setResumes]);

  // 2. 공고 목록 로드
  useEffect(() => {
    const loadJobsIfEmpty = async () => {
      if (businessJobs.length === 0) {
        try {
          const response = await getJobPostings({ size: 100 });
          if (response.content && response.content.length > 0) {
            const jobs = response.content.map((job: any) => ({
              id: job.jobId,
              title: job.title,
              status: job.status as "ACTIVE" | "CLOSED" | "EXPIRED",
              job_category: job.jobCategory,
              location: job.location,
              experience_min: job.experienceMin,
              experience_max: job.experienceMax,
              salary_min: job.salaryMin,
              salary_max: job.salaryMax,
              deadline: job.deadline,
              view_count: job.viewCount,
              applicant_count: job.applicantCount,
              bookmark_count: 0,
              created_at: job.createdAt
            }));
            setBusinessJobs(jobs);
          }
        } catch (error) {
          console.error('공고 로드 오류:', error);
        }
      }
    };
    loadJobsIfEmpty();
  }, [businessJobs.length, setBusinessJobs]);

  const resumeOptions = (resumes ?? []).map((resume) => ({
    id: String(resume.resumeId ?? resume.id ?? ""),
    name: resume.title ?? "",
  })).filter((opt) => opt.id);

  const handleAnalyze = () => {
    if (!selectedResume) {
      alert("이력서를 먼저 선택해주세요!");
      return;
    }
    setShowConfirmDialog(true);
  };

  // 3. 실제 AI 분석 실행 함수
  const handleConfirmAnalysis = async () => {
    setShowConfirmDialog(false);
    setIsLoading(true);

    try {
      const resumeIdNum = parseInt(selectedResume);

      const userIdNum = user?.userId
        ? (typeof user.userId === 'string' ? parseInt(user.userId) : user.userId)
        : null;

      if (!userIdNum) {
        alert("로그인 정보가 올바르지 않습니다. 다시 로그인해주세요.");
        setIsLoading(false);
        return;
      }

      // 5. 요청 객체 생성 (Dumb Component: ID만 전송)
      const aiRequest: AiRecommendRequest = {
        resumeId: resumeIdNum,
        userId: userIdNum,
        // jobCategory: ... (선택 사항)
      };

      console.log("🚀 [Front] Simple AI Matching Request:", aiRequest);

      const aiResult = await getAiRecommendation(aiRequest);

      setRecommendedCompanies(aiResult.companies);
      setAiReport(aiResult.ai_report);
      setHasAnalysis(true);

      if (currentCredit >= CREDIT_COST) {
        setCurrentCredit(currentCredit - CREDIT_COST);
      }

      // 히스토리 추가 (이전 동일 이력서 기록 덮어쓰기 로직 포함)
      if (aiResult.companies.length > 0) {
        const topCompany = aiResult.companies[0];
        const newHistory = {
          id: Date.now(),
          date: new Date().toLocaleDateString(),
          time: new Date().toTimeString().slice(0, 5),
          resume: resumes.find(r => r.id.toString() === selectedResume)?.title || "이력서",
          resumeId: resumeIdNum,
          company: topCompany.company_name,
          position: topCompany.role,
          jobId: 0,
          score: topCompany.score,
          suitable: topCompany.match_level === "BEST" || topCompany.match_level === "HIGH",
          techMatch: {},
          strengths: ["AI 분석 완료"],
          improvements: []
        };

        if (matchingHistory && setMatchingHistory) {
          const filteredHistory = matchingHistory.filter((h: any) => h.resumeId !== resumeIdNum);
          setMatchingHistory([...filteredHistory, newHistory]);
        } else {
          addMatchingHistory(newHistory);
        }
      }

    } catch (error) {
      console.error("❌ AI 매칭 치명적 오류:", error);
      alert("AI 매칭 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelAnalysis = () => setShowConfirmDialog(false);
  const handleBackToMatching = () => setActiveMenu("matching");
  const handleReanalyze = () => {
    setHasAnalysis(false);
    setRecommendedCompanies([]);
    setAiReport("");
  };

  const handleCreditClick = () => navigate('/user/credit/charge');
  const handleAddResume = () => navigate('/user/resume');
  const handleEditResume = () => navigate('/user/resume');
  const handleApply = () => navigate('/user/jobs/all');

  if (activeMenu === "history" || activeMenu === "matching-sub-2") {
    return (
      <MatchingHistoryPage
        onBackToMatching={handleBackToMatching}
        activeMenu={activeMenu}
        onMenuClick={handleMenuClick}
        // [중요] 수동 삭제 함수를 자식 컴포넌트로 전달합니다.
        // MatchingHistoryPage 내부에서 이 props를 받아서 버튼에 연결해야 합니다.
        // 예: <button onClick={() => onDelete(history.id)}>삭제</button>
        // @ts-ignore
        onDelete={handleDeleteHistory}
      />
    );
  }

  return (
    <>
      {showConfirmDialog && (
        <ConfirmDialog
          onConfirm={handleConfirmAnalysis}
          onCancel={handleCancelAnalysis}
        />
      )}

      <div className="min-h-screen bg-white">
        <div className="px-4 py-8 mx-auto max-w-7xl">
          <h2 className="inline-block mb-6 text-2xl font-bold">매칭현황</h2>
          <div className="flex gap-6">
            <MatchingSidebar
              activeMenu={activeMenu}
              onMenuClick={handleMenuClick}
            />

            <div className="flex-1">
              <MatchingHeader
                currentCredit={currentCredit}
                onCreditClick={handleCreditClick}
              />

              <TargetSelection
                resumes={resumeOptions}
                selectedResume={selectedResume}
                onResumeChange={setSelectedResume}
                onAddResume={handleAddResume}
                onAnalyze={handleAnalyze}
              />

              {!hasAnalysis ? (
                <EmptyAnalysis />
              ) : isLoading ? (
                <div className="p-12 text-center bg-white border-2 border-gray-200 rounded-2xl">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-xl font-bold text-gray-700">AI가 분석 중입니다...</p>
                    <p className="text-gray-500">이력서를 분석하고 최적의 기업을 찾고 있습니다.</p>
                  </div>
                </div>
              ) : (
                <AnalysisResult
                  recommendedCompanies={recommendedCompanies}
                  aiReport={aiReport}
                  onReanalyze={handleReanalyze}
                  onEditResume={handleEditResume}
                  onApply={handleApply}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}