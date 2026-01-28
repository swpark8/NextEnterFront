import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getResumeList, getResumeDetail, ResumeSections } from "../../api/resume";
import { getJobPostings } from "../../api/job";
import { getAiRecommendation, CompanyInfo, AiRecommendRequest } from "../../api/ai";
import { generateResumeText } from "../../utils/resumeMapper";

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

/**
 * 한글 직무명을 영어로 변환 (AI 서버 및 백엔드 매칭용)
 */
const convertKoreanRole = (role: string): string => {
  const map: Record<string, string> = {
    "백엔드 개발자": "Backend Developer",
    "프론트엔드 개발자": "Frontend Developer",
    "풀스택 개발자": "Fullstack Developer",
    "UI/UX 디자이너": "UI/UX Designer",
    "디자이너": "Designer",
    "기획자": "Product Manager",
    "PM": "Product Manager",
  };
  return map[role] || role;
};

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

  const resumeOptions = resumes.map((resume) => ({
    id: resume.id.toString(),
    name: resume.title,
  }));

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

      // ✅ [수정] userId가 없는 경우 1로 고정하는 대신 에러 처리 (500 에러 방지)
      const userIdNum = user?.userId
        ? (typeof user.userId === 'string' ? parseInt(user.userId) : user.userId)
        : null;

      if (!userIdNum) {
        alert("로그인 정보가 올바르지 않습니다. 다시 로그인해주세요.");
        setIsLoading(false);
        return;
      }

      const resumeDetail = await getResumeDetail(resumeIdNum, userIdNum);

      console.log("🔍 [DEBUG] 백엔드 이력서 원본:", resumeDetail);

      // structuredData 파싱하여 필요한 정보 추출
      let skillsList: string[] = [];
      let experienceYears = 0;
      let educationList: any[] = []; // List<Map> structure
      let careerList: any[] = [];    // List<Map> structure
      let projectList: any[] = [];   // List<Map> structure
      let preferredLocation = "Seoul";

      // skills 파싱
      if (resumeDetail.skills) {
        try {
          // 이미 JSON 배열이거나, 문자열이면 파싱
          if (Array.isArray(resumeDetail.skills)) {
            skillsList = resumeDetail.skills;
          } else {
            const parsed = JSON.parse(resumeDetail.skills);
            skillsList = Array.isArray(parsed) ? parsed : [resumeDetail.skills];
          }
        } catch {
          skillsList = typeof resumeDetail.skills === 'string'
            ? resumeDetail.skills.split(',').map(s => s.trim())
            : [];
        }
      }

      // =================================================================================
      // [데이터 파싱] educations, careers 등이 JSON String으로 올 수도 있고, structuredData에 있을 수도 있음
      // =================================================================================

      // 1. 학력 (educations)
      if (resumeDetail.educations) {
        try {
          const parsed = JSON.parse(resumeDetail.educations);
          if (Array.isArray(parsed)) educationList = parsed;
        } catch (e) {
          console.warn("educations 파싱 실패 (JSON 아님):", e);
        }
      }

      // 2. 경력 (careers)
      if (resumeDetail.careers) {
        try {
          const parsed = JSON.parse(resumeDetail.careers);
          if (Array.isArray(parsed)) careerList = parsed;
        } catch (e) {
          console.warn("careers 파싱 실패 (JSON 아님):", e);
        }
      }

      // 3. 프로젝트/경험 (experiences -> projects로 매핑)
      if (resumeDetail.experiences) {
        try {
          const parsed = JSON.parse(resumeDetail.experiences);
          if (Array.isArray(parsed)) projectList = parsed;
        } catch (e) {
          console.warn("experiences 파싱 실패:", e);
        }
      }

      // 4. Legacy structuredData fallback (위에서 데이터가 없으면 여기서 추출)
      if (resumeDetail.structuredData && (educationList.length === 0 || careerList.length === 0)) {
        try {
          const sections: ResumeSections = JSON.parse(resumeDetail.structuredData);

          // 경력 계산 및 리스트 추출
          if (sections.careers && sections.careers.length > 0) {
            if (careerList.length === 0) careerList = sections.careers;

            // 총 경력 연차 계산
            let totalMonths = 0;
            sections.careers.forEach(career => {
              // ... (existing logic for calculation if needed, or just rely on backend to calc from list)
              // For now, let's keep the existing logic to populate experienceYears if needed by UI, 
              // but backend usually recalculates. We will send the list.
              const period = career.period || "";
              try {
                // Clean up logic mostly for display or basic checking
                if (period.includes("년") || period.includes("개월")) {
                  const y = period.match(/(\d+)년/);
                  const m = period.match(/(\d+)개월/);
                  totalMonths += (y ? parseInt(y[1]) * 12 : 0) + (m ? parseInt(m[1]) : 0);
                } else if (period.includes("-") || period.includes("~")) {
                  // simple diff logic if needed, but risky. 
                }
              } catch (e) { }
            });
            // If totalMonths was updated, use it. Otherwise 0.
            if (totalMonths > 0) experienceYears = Math.floor(totalMonths / 12);
          }

          if (sections.educations && sections.educations.length > 0 && educationList.length === 0) {
            educationList = sections.educations;
          }

          if (sections.experiences && sections.experiences.length > 0 && projectList.length === 0) {
            projectList = sections.experiences;
          }

          if (sections.personalInfo && sections.personalInfo.address) {
            preferredLocation = sections.personalInfo.address;
          }
        } catch (e) {
          console.warn("structuredData 파싱 실패:", e);
        }
      }

      // 5. 요청 객체 생성
      const aiRequest: AiRecommendRequest = {
        resumeId: resumeIdNum,
        userId: userIdNum,
        resumeText: generateResumeText(resumeDetail),
        jobCategory: convertKoreanRole(resumeDetail.jobCategory || "Backend Developer"),
        skills: skillsList,
        experience: experienceYears,
        experienceMonths: 0,
        educations: educationList,
        careers: careerList,
        projects: projectList,
        preferredLocation: preferredLocation,
        filePath: resumeDetail.filePath // ✅ 파일 경로 전달 (상위 필드)
      };

      // 만약 상위에 없고 structuredData 내부에 있을 경우 (legacy) - 드문 케이스
      if (!aiRequest.filePath && resumeDetail.structuredData) {
        try {
          // 필요하다면 여기서 structuredData 파싱해서 filePath 찾기 추가
          // const sections = JSON.parse(resumeDetail.structuredData);
          // if (sections.filePath) aiRequest.filePath = sections.filePath;
        } catch (e) { }
      }

      // AI 서버가 빈 데이터를 허용하는지 확인 후, 필요시에만 추가 검증
      console.log("🚀 [DEBUG] Final AI Request (sending to backend):", aiRequest);

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
          id: Date.now(), // 이 값이 timestamp로 사용됩니다.
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
          console.log("🔄 이전 히스토리 삭제 후 최신 기록으로 덮어썼습니다.");
        } else {
          addMatchingHistory(newHistory);
        }
      }

    } catch (error) {
      console.error("❌ AI 매칭 치명적 오류:", error);
      alert("AI 서버 연결에 실패했습니다. 백엔드(8080)와 파이썬 엔진(8000)이 켜져 있는지 확인해주세요.");
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

      <div className="min-h-screen bg-gray-50">
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