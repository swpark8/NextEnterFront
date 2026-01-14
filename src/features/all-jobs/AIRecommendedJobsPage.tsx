import { useState } from "react";

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
  matchScore: number; // AI 매칭 점수
};

export default function AIRecommendedJobsPage({
  onLogoClick,
  onNavigateToAll,
  onNavigateToPosition,
  onNavigateToLocation,
}: AIRecommendedJobsPageProps) {
  const [hasAccess, setHasAccess] = useState(false); // 크레딧 차감 후 접근 가능
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [userCredit, setUserCredit] = useState(150); // 사용자 보유 크레딧
  const [activeTab, setActiveTab] = useState("ai"); // all, ai, position, location
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [selectedResumeId, setSelectedResumeId] = useState<number | null>(null);

  // 이력서 목록 샘플 데이터
  const resumes = [
    {
      id: 1,
      title: "프론트엔드 개발자 이력서",
      lastUpdated: "2024-01-10",
      isDefault: true,
    },
    {
      id: 2,
      title: "풀스택 개발자 경력 이력서",
      lastUpdated: "2024-01-05",
      isDefault: false,
    },
    {
      id: 3,
      title: "신입 개발자 이력서",
      lastUpdated: "2023-12-20",
      isDefault: false,
    },
  ];

  // AI 추천 공고 데이터 (매칭 점수 포함)
  const jobListings: JobListing[] = [
    {
      id: 1,
      company: "(주)테크이노베이션",
      title: "프론트엔드 개발자 (React, TypeScript 전문가)",
      requirements: ["경력 2-4년", "대졸이상", "React 필수", "정규직"],
      tags: ["연봉상위 10%", "재택근무"],
      location: "서울 강남구",
      deadline: "~ 02.15(목)",
      daysLeft: 32,
      matchScore: 95,
    },
    {
      id: 2,
      company: "AI 스타트업",
      title: "풀스택 개발자 (Node.js + React 우대)",
      requirements: ["경력 1-3년", "정규직"],
      tags: ["스톡옵션", "유연근무"],
      location: "서울 판교",
      deadline: "~ 02.20(화)",
      daysLeft: 37,
      matchScore: 92,
    },
    {
      id: 3,
      company: "(주)핀테크솔루션",
      title: "백엔드 개발자 (Java/Spring 경력자)",
      requirements: ["경력 3-5년", "대졸이상", "Spring Boot", "정규직"],
      tags: ["4대보험", "퇴직금"],
      location: "서울 여의도",
      deadline: "~ 02.28(금)",
      daysLeft: 45,
      matchScore: 88,
    },
  ];

  const handleAccessRequest = () => {
    setShowConfirmModal(true);
  };

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

  const handleCancelAccess = () => {
    setShowConfirmModal(false);
  };

  const handleTabClick = (tab: string) => {
    if (tab === "all" && onNavigateToAll) {
      onNavigateToAll();
    } else if (tab === "position" && onNavigateToPosition) {
      onNavigateToPosition();
    } else if (tab === "location" && onNavigateToLocation) {
      onNavigateToLocation();
    } else {
      setActiveTab(tab);
    }
  };

  const handleApply = (jobId: number) => {
    const confirmed = confirm("입사지원 하시겠습니까?");
    if (confirmed) {
      setSelectedJobId(jobId);
      setShowResumeModal(true);
    }
  };

  const handleResumeSelect = (resumeId: number) => {
    setSelectedResumeId(resumeId);
  };

  const handleFinalSubmit = () => {
    if (!selectedResumeId) {
      alert("이력서를 선택해주세요.");
      return;
    }
    
    const selectedResume = resumes.find(r => r.id === selectedResumeId);
    const confirmed = confirm(`"${selectedResume?.title}"로 지원하시겠습니까?`);
    
    if (confirmed) {
      console.log(`공고 ${selectedJobId}에 이력서 ${selectedResumeId}로 지원하기`);
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

  // 크레딧 차감 전 - 안내 화면
  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="px-6 py-8 mx-auto max-w-[1400px]">
          {/* 탭 메뉴 */}
          <div className="mb-6">
            <div className="flex border-b-2 border-gray-200">
              <button
                onClick={() => handleTabClick("all")}
                className="px-6 py-3 font-medium text-gray-600 transition hover:text-blue-600"
              >
                전체공고
              </button>
              <button
                onClick={() => setActiveTab("ai")}
                className="px-6 py-3 font-medium text-blue-600 border-b-2 border-blue-600 -mb-0.5"
              >
                AI 추천 공고
              </button>
              <button
                onClick={() => handleTabClick("position")}
                className="px-6 py-3 font-medium text-gray-600 transition hover:text-blue-600"
              >
                직무별 공고
              </button>
              <button
                onClick={() => handleTabClick("location")}
                className="px-6 py-3 font-medium text-gray-600 transition hover:text-blue-600"
              >
                지역별 공고
              </button>
            </div>
          </div>

          {/* 안내 화면 */}
          <div className="flex items-center justify-center min-h-[600px]">
            <div className="max-w-2xl p-12 text-center bg-white border-2 border-blue-500 rounded-2xl shadow-xl">
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
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                      clipRule="evenodd"
                    />
                  </svg>
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
                className="px-12 py-4 text-xl font-bold text-white transition bg-blue-600 rounded-xl hover:bg-blue-700 shadow-lg"
              >
                AI 공고 보기
              </button>

              <p className="mt-6 text-sm text-gray-500">
                현재 보유 크레딧: <span className="font-bold">{userCredit}</span>
              </p>
            </div>
          </div>
        </main>

        {/* 확인 모달 */}
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="max-w-md p-8 bg-white rounded-2xl shadow-2xl">
              <div className="mb-6 text-center">
                <svg
                  className="w-16 h-16 mx-auto mb-4 text-yellow-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <h3 className="mb-2 text-xl font-bold text-gray-900">
                  크레딧 차감 확인
                </h3>
                <p className="mb-4 text-gray-600">
                  AI 추천 공고를 확인하시려면
                </p>
                <p className="mb-4 text-gray-600">
                  <span className="text-2xl font-bold text-blue-600">10 크레딧</span>이 차감됩니다
                </p>
                <p className="text-sm text-gray-500">
                  현재 보유: {userCredit} → 차감 후: {userCredit - 10}
                </p>
              </div>

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
      </div>
    );
  }

  // 크레딧 차감 후 - 공고 리스트 화면
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 메인 컨텐츠 */}
      <main className="px-6 py-8 mx-auto max-w-[1400px]">
        {/* 탭 메뉴 */}
        <div className="mb-6">
          <div className="flex border-b-2 border-gray-200">
            <button
              onClick={() => handleTabClick("all")}
              className="px-6 py-3 font-medium text-gray-600 transition hover:text-blue-600"
            >
              전체공고
            </button>
            <button
              onClick={() => setActiveTab("ai")}
              className="px-6 py-3 font-medium text-blue-600 border-b-2 border-blue-600 -mb-0.5"
            >
              AI 추천 공고
            </button>
            <button
              onClick={() => handleTabClick("position")}
              className="px-6 py-3 font-medium text-gray-600 transition hover:text-blue-600"
            >
              직무별 공고
            </button>
            <button
              onClick={() => handleTabClick("location")}
              className="px-6 py-3 font-medium text-gray-600 transition hover:text-blue-600"
            >
              지역별 공고
            </button>
          </div>
        </div>

        {/* 안내 배너 */}
        <div className="p-4 mb-6 text-center text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
          <p className="text-lg font-bold">
            🎯 회원님께 최적화된 AI 맞춤 추천 공고입니다
          </p>
        </div>

        {/* 공고 수 및 필터 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-bold text-gray-800">
              AI 추천 채용정보{" "}
              <span className="text-blue-600">{jobListings.length}</span>건
            </h2>
            <button className="flex items-center px-4 py-2 space-x-2 text-sm text-gray-700 transition bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              <span>매칭순</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* 공고 리스트 */}
        <div className="space-y-4">
          {jobListings.map((job) => (
            <div
              key={job.id}
              className="relative p-6 transition bg-white border-2 border-blue-500 rounded-lg shadow-md hover:shadow-xl cursor-pointer"
            >
              {/* AI 매칭 점수 배지 */}
              <div className="absolute top-4 right-4">
                <div className="flex flex-col items-center">
                  <div className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
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
                  {/* 회사명 */}
                  <div className="flex items-center mb-2 space-x-2">
                    <span className="text-sm font-medium text-gray-600">
                      {job.company}
                    </span>
                  </div>

                  {/* 공고 제목 */}
                  <h3 className="mb-3 text-lg font-bold text-gray-900">
                    {job.title}
                  </h3>

                  {/* 요구사항 태그 */}
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

                  {/* 추가 태그 */}
                  {job.tags.length > 0 && (
                    <div className="flex gap-2 mb-3">
                      {job.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 text-xs text-blue-600 bg-blue-50 rounded font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* 하단 정보 */}
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>{job.deadline}</span>
                    </div>
                  </div>
                </div>

                {/* 오른쪽: 상태 및 지원 버튼 */}
                <div className="flex flex-col items-end space-y-2">
                  <button
                    onClick={() => handleApply(job.id)}
                    className="px-6 py-2 text-sm font-medium text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    입사지원
                  </button>

                  <div className="text-sm text-gray-500">
                    <span className="text-blue-600 font-medium">
                      D-{job.daysLeft}
                    </span>
                    <span className="ml-1">
                      {job.daysLeft} 일 {job.daysLeft > 30 ? "이상" : ""} 남음
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* 이력서 선택 모달 */}
      {showResumeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              지원할 이력서를 선택해주세요
            </h3>

            <div className="space-y-4 mb-6">
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
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="text-lg font-bold text-gray-900">
                          {resume.title}
                        </h4>
                        {resume.isDefault && (
                          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded">
                            기본 이력서
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        마지막 수정: {resume.lastUpdated}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          selectedResumeId === resume.id
                            ? "border-blue-600 bg-blue-600"
                            : "border-gray-300"
                        }`}
                      >
                        {selectedResumeId === resume.id && (
                          <svg
                            className="w-4 h-4 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleCancelResume}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
              >
                취소
              </button>
              <button
                onClick={handleFinalSubmit}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                지원하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
