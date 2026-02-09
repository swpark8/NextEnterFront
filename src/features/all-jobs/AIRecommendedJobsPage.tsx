import { useState } from "react";
import { usePageNavigation } from "../../hooks/usePageNavigation";
import { useResumeStore } from "../../stores/resumeStore";
import { useJobStore } from "../../stores/jobStore";
// ✅ [수정] LeftSidebar 사용
import LeftSidebar from "../../components/LeftSidebar";

// ✅ 인터페이스는 유지 (App.tsx 에러 방지용)
interface AIRecommendedJobsPageProps {
  onLogoClick?: () => void;
  onNavigateToAll?: () => void;
  onNavigateToPosition?: () => void;
  onNavigateToLocation?: () => void;
}

type JobListing = {
  id: number;
  company: string;
  title: string;
  requirements: string[];
  tags: string[];
  location: string;
  deadline: string;
  daysLeft: number;
  matchScore: number;
};

// ✅ [수정] 안 쓰는 props를 괄호에서 제거했습니다. (빨간 줄 해결)
export default function AIRecommendedJobsPage() {
  // 훅 사용 (기본값: job-sub-2)
  const { activeMenu, handleMenuClick } = usePageNavigation("job", "job-sub-2");

  const [hasAccess, setHasAccess] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [userCredit, setUserCredit] = useState(150);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [selectedResumeId, setSelectedResumeId] = useState<number | null>(null);

  // AppContext에서 데이터 가져오기
  const { resumes } = useResumeStore();
  const { jobListings, businessJobs } = useJobStore();

  // businessJobs를 JobListing 형식으로 변환
  const convertedBusinessJobs: JobListing[] = businessJobs.map((job) => {
    const deadline = new Date(job.deadline);
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return {
      id: job.id,
      company: "등록 기업",
      title: job.title,
      requirements: [],
      tags: [job.job_category],
      location: job.location,
      deadline: job.deadline,
      daysLeft: daysLeft > 0 ? daysLeft : 0,
      matchScore: Math.floor(Math.random() * 30) + 70, // 70-100 사이 랜덤 점수
    };
  });

  // 기업 공고와 일반 공고 통합
  const combinedJobListings = [...jobListings, ...convertedBusinessJobs];

  const handleAccessRequest = () => setShowConfirmModal(true);

  const handleConfirmAccess = () => {
    if (userCredit >= 10) {
      setUserCredit(userCredit - 10);
      setHasAccess(true);
      setShowConfirmModal(false);
    } else {
      alert("크레딧이 부족합니다!");
      setShowConfirmModal(false);
    }
  };

  const handleCancelAccess = () => setShowConfirmModal(false);

  const handleApply = (jobId: number) => {
    if (confirm("입사지원 하시겠습니까?")) {
      setSelectedJobId(jobId);
      setShowResumeModal(true);
    }
  };

  const handleResumeSelect = (resumeId: number) =>
    setSelectedResumeId(resumeId);

  const handleFinalSubmit = () => {
    if (!selectedResumeId) {
      alert("이력서를 선택해주세요.");
      return;
    }
    const selectedResume = resumes.find((r) => r.id === selectedResumeId);
    if (confirm(`"${selectedResume?.title}"로 지원하시겠습니까?`)) {
      console.log(
        `공고 ${selectedJobId}에 이력서 ${selectedResumeId}로 지원하기`,
      );
      alert("완료되었습니다");
      setShowResumeModal(false);
      setSelectedJobId(null);
      setSelectedResumeId(null);
    }
  };

  const handleCancelResume = () => {
    setShowResumeModal(false);
    setSelectedJobId(null);
    setSelectedResumeId(null);
  };

  if (!hasAccess) {
    return (
      <>
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="max-w-md p-8 bg-white shadow-2xl rounded-2xl">
              <h3 className="mb-2 text-xl font-bold text-center text-gray-900">
                크레딧 차감 확인
              </h3>
              <p className="mb-4 text-center text-gray-600">
                AI 추천 공고를 확인하시려면{" "}
                <span className="text-2xl font-bold text-blue-600">
                  10 크레딧
                </span>
                이 차감됩니다
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={handleCancelAccess}
                  className="flex-1 px-6 py-3 font-medium text-gray-700 transition bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  취소
                </button>
                <button
                  onClick={handleConfirmAccess}
                  className="flex-1 px-6 py-3 font-medium text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  확인
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="min-h-screen bg-white">
          <div className="px-4 py-8 mx-auto max-w-7xl">
            {/* ✅ [수정] 제목(h1) 제거 (사이드바 title로 이동) */}

            {/* ✅ [수정] items-start 추가 (Sticky 적용) */}
            <div className="flex items-start gap-6">
              {/* ✅ [수정] JobsSidebar -> LeftSidebar 교체 & Title 적용 */}
              <LeftSidebar
                title="채용정보"
                activeMenu={activeMenu}
                onMenuClick={handleMenuClick}
              />

              {/* 메인 컨텐츠 */}
              <div className="flex-1 space-y-8">
                <section className="p-8 bg-white border-2 border-gray-200 rounded-2xl">
                  <div className="flex items-center justify-center min-h-[600px]">
                    <div className="max-w-2xl p-12 text-center bg-white border-2 border-blue-500 shadow-xl rounded-2xl">
                      <div className="mb-6">
                        <svg
                          className="w-24 h-24 mx-auto text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                          />
                        </svg>
                      </div>
                      <h2 className="mb-4 text-3xl font-bold text-gray-900">
                        AI 맞춤 추천 공고
                      </h2>
                      <p className="mb-3 text-lg text-gray-600">
                        회원님의 이력서와 선호도를 분석하여
                      </p>
                      <p className="mb-8 text-lg text-gray-600">
                        최적의 채용공고를 추천해 드립니다
                      </p>
                      <div className="p-6 mb-8 bg-blue-50 rounded-xl">
                        <div className="flex items-center justify-center mb-4 space-x-2">
                          <span className="text-2xl font-bold text-blue-600">
                            크레딧 10개
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          AI 추천 공고를 확인하시려면 크레딧이 필요합니다
                        </p>
                      </div>
                      <button
                        onClick={handleAccessRequest}
                        className="px-12 py-4 text-xl font-bold text-white transition bg-blue-600 shadow-lg rounded-xl hover:bg-blue-700"
                      >
                        AI 공고 보기
                      </button>
                      <p className="mt-6 text-sm text-gray-500">
                        현재 보유 크레딧:{" "}
                        <span className="font-bold">{userCredit}</span>
                      </p>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {showResumeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <h3 className="mb-6 text-2xl font-bold text-gray-900">
              지원할 이력서를 선택해주세요
            </h3>
            <div className="mb-6 space-y-4">
              {resumes.map((resume) => (
                <div
                  key={resume.id}
                  onClick={() => handleResumeSelect(resume.id)}
                  className={`p-5 border-2 rounded-lg cursor-pointer transition ${
                    selectedResumeId === resume.id
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300 bg-white"
                  }`}
                >
                  <h4 className="text-lg font-bold text-gray-900">
                    {resume.title}
                  </h4>
                </div>
              ))}
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handleCancelResume}
                className="flex-1 px-6 py-3 font-medium text-gray-700 transition bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                취소
              </button>
              <button
                onClick={handleFinalSubmit}
                className="flex-1 px-6 py-3 font-medium text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                지원하기
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gray-50">
        <div className="px-4 py-8 mx-auto max-w-7xl">
          {/* ✅ [수정] 제목(h1) 제거 (사이드바 title로 이동) */}

          {/* ✅ [수정] items-start 추가 (Sticky 적용) */}
          <div className="flex items-start gap-6">
            {/* ✅ [수정] JobsSidebar -> LeftSidebar 교체 & Title 적용 */}
            <LeftSidebar
              title="채용정보"
              activeMenu={activeMenu}
              onMenuClick={handleMenuClick}
            />

            {/* 메인 컨텐츠 */}
            <div className="flex-1 space-y-8">
              <section className="p-8 bg-white border-2 border-gray-200 rounded-2xl">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold">AI 추천 공고</h2>
                </div>

                <div className="space-y-4">
                  {combinedJobListings.map((job) => (
                    <div
                      key={job.id}
                      className="relative p-6 transition bg-white border-2 border-blue-500 rounded-lg shadow-md cursor-pointer hover:shadow-xl"
                    >
                      <div className="absolute top-4 right-4">
                        <div className="flex flex-col items-center">
                          <div className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600">
                            <span className="text-xl font-bold text-white">
                              {job.matchScore}%
                            </span>
                          </div>
                          <span className="mt-1 text-xs font-medium text-gray-600">
                            AI 매칭
                          </span>
                        </div>
                      </div>
                      <div className="flex items-start justify-between pr-24">
                        <div className="flex-1">
                          <div className="flex items-center mb-2 space-x-2">
                            <span className="text-sm font-medium text-gray-600">
                              {job.company}
                            </span>
                          </div>
                          <h3 className="mb-3 text-lg font-bold text-gray-900">
                            {job.title}
                          </h3>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {job.requirements.map((req, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 text-xs text-gray-700 bg-gray-100 rounded-full"
                              >
                                {req}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>{job.location}</span>
                            <span>{job.deadline}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <button
                            onClick={() => handleApply(job.id)}
                            className="px-6 py-2 text-sm font-medium text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
                          >
                            입사지원
                          </button>
                          <div className="text-sm text-gray-500">
                            <span className="font-medium text-blue-600">
                              D-{job.daysLeft}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
