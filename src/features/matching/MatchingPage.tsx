import { useState, useEffect } from "react";
import MatchingSidebar from "./components/MatchingSidebar";
import MatchingHistoryPage from "./components/MatchingHistoryPage";
import ConfirmDialog from "./components/ConfirmDialog";
import MatchingHeader from "./components/MatchingHeader";
import TargetSelection from "./components/TargetSelection";
import EmptyAnalysis from "./components/EmptyAnalysis";
import AnalysisResult from "./components/AnalysisResult";
import { useApp } from "../../context/AppContext";
import { usePageNavigation } from "../../hooks/usePageNavigation";
import {
  SAMPLE_STRENGTHS,
  SAMPLE_WEAKNESSES,
  SAMPLE_TECH_SKILLS,
  SAMPLE_RECOMMENDATIONS,
  CREDIT_COST,
} from "./data/sampleData";

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
  // [Auto-Merge] Incoming 브랜치의 usePageNavigation 훅 사용 (사이드바 연동)
  const { activeMenu, handleMenuClick, setActiveMenu } = usePageNavigation(
    "matching",
    initialMenu || "matching-sub-1",
    onNavigate
  );

  const [selectedResume, setSelectedResume] = useState("");
  const [selectedJob, setSelectedJob] = useState("");
  const [currentCredit, setCurrentCredit] = useState(200);
  const [hasAnalysis, setHasAnalysis] = useState(false);
  const [matchingScore, setMatchingScore] = useState(0);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Context에서 실제 데이터 가져오기 - 기업 공고 사용!
  const { resumes, businessJobs, addMatchingHistory } = useApp();

  // 이력서를 TargetSelection에서 사용할 수 있는 형식으로 변환
  const resumeOptions = resumes.map((resume) => ({
    id: resume.id.toString(),
    name: resume.title,
  }));

  // 기업 공고를 TargetSelection에서 사용할 수 있는 형식으로 변환
  // ACTIVE 상태인 공고만 선택 가능하도록 필터링
  const jobOptions = businessJobs
    .filter((job) => job.status === "ACTIVE")
    .map((job) => ({
      id: job.id.toString(),
      name: job.title,
      company: job.job_category, // 직무 카테고리를 회사명처럼 표시
    }));

  const handleCreditClick = () => {
    // 크레딧 충전 페이지로 이동 가능
  };

  const handleAnalyze = () => {
    try {
      if (!selectedResume) {
        alert("이력서를 먼저 선택해주세요!");
        return;
      }
      if (!selectedJob) {
        alert("분석할 공고를 선택해주세요!");
        return;
      }
      if (currentCredit < CREDIT_COST) {
        alert("크레딧이 부족합니다!");
        return;
      }
      // 확인 다이얼로그 표시
      setShowConfirmDialog(true);
    } catch (error) {
      console.error("분석 실행 중 오류:", error);
      alert("분석 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  const handleConfirmAnalysis = () => {
    try {
      setCurrentCredit(currentCredit - CREDIT_COST);

      // 랜덤 점수 생성 (85-95 사이)
      const score = Math.floor(Math.random() * 11) + 85;
      setMatchingScore(score);
      setHasAnalysis(true);
      setShowConfirmDialog(false);

      // 선택된 이력서와 공고 정보 가져오기
      const selectedResumeInfo = resumes.find(
        (r) => r.id.toString() === selectedResume
      );
      const selectedJobInfo = businessJobs.find(
        (j) => j.id.toString() === selectedJob
      );

      if (selectedResumeInfo && selectedJobInfo) {
        // 현재 날짜/시간
        const now = new Date();
        const date = now
          .toLocaleDateString("ko-KR")
          .replace(/\. /g, ".")
          .replace(".", "");
        const time = now.toTimeString().slice(0, 5);

        // 히스토리 데이터 생성
        const historyId = Date.now(); // 고유 ID
        const newHistory = {
          id: historyId,
          date: date,
          time: time,
          resume: selectedResumeInfo.title,
          resumeId: selectedResumeInfo.id,
          company: selectedJobInfo.job_category, // 직무 카테고리를 회사명처럼 사용
          position: selectedJobInfo.title,
          jobId: selectedJobInfo.id,
          score: score,
          suitable: score >= 75,
          techMatch: SAMPLE_TECH_SKILLS.reduce((acc, skill) => {
            acc[skill.name] = skill.match;
            return acc;
          }, {} as { [key: string]: number }),
          strengths: SAMPLE_STRENGTHS.map((s) => s.text),
          improvements: SAMPLE_WEAKNESSES.map((w) => w.text),
        };

        // Context에 히스토리 추가
        addMatchingHistory(newHistory);
      }
    } catch (error) {
      console.error("분석 완료 중 오류:", error);
      alert("분석을 완료하는 동안 오류가 발생했습니다.");
      setShowConfirmDialog(false);
    }
  };

  const handleCancelAnalysis = () => {
    setShowConfirmDialog(false);
  };

  const handleAddResume = () => {
    alert("이력서 작성 페이지로 이동합니다.");
  };

  // 지원 적합 여부 결정
  const getSuitability = (score: number) => {
    if (score >= 75)
      return { suitable: true, message: "매우 적합", emoji: "🎉" };
    return { suitable: false, message: "부적합", emoji: "⚠️" };
  };

  const suitabilityInfo = getSuitability(matchingScore);

  const handleBackToMatching = () => {
    setActiveMenu("matching");
  };

  const handleReanalyze = () => {
    setHasAnalysis(false);
  };

  const handleEditResume = () => {
    if (onEditResume) {
      onEditResume();
    } else {
      alert("이력서 수정 페이지로 이동합니다");
    }
  };

  const handleApply = () => {
    alert("지원하기 페이지로 이동합니다");
  };

  // 히스토리 페이지 표시
  if (activeMenu === "history" || activeMenu === "matching-sub-2") {
    return (
      <MatchingHistoryPage
        onBackToMatching={handleBackToMatching}
        activeMenu={activeMenu}
        onMenuClick={handleMenuClick}
      />
    );
  }

  return (
    <>
      {/* 확인 다이얼로그 */}
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
            {/* 왼쪽 사이드바 */}
            <MatchingSidebar
              activeMenu={activeMenu}
              onMenuClick={handleMenuClick}
            />

            {/* 메인 컨텐츠 */}
            <div className="flex-1">
              {/* 상단 헤더 */}
              <MatchingHeader
                currentCredit={currentCredit}
                onCreditClick={handleCreditClick}
              />

              {/* 선택 카드 */}
              <TargetSelection
                resumes={resumeOptions}
                jobs={jobOptions}
                selectedResume={selectedResume}
                selectedJob={selectedJob}
                onResumeChange={setSelectedResume}
                onJobChange={setSelectedJob}
                onAddResume={handleAddResume}
                onAnalyze={handleAnalyze}
              />

              {/* 분석 결과 영역 */}
              {!hasAnalysis ? (
                <EmptyAnalysis />
              ) : (
                <AnalysisResult
                  suitabilityInfo={suitabilityInfo}
                  strengths={SAMPLE_STRENGTHS}
                  weaknesses={SAMPLE_WEAKNESSES}
                  techSkills={SAMPLE_TECH_SKILLS}
                  recommendations={SAMPLE_RECOMMENDATIONS}
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
