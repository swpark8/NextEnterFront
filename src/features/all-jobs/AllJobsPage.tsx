import { useState } from "react";

interface AllJobsPageProps {
  onLogoClick?: () => void;
  onNavigateToAI?: () => void;
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
};

export default function AllJobsPage({
  onLogoClick,
  onNavigateToAI,
  onNavigateToPosition,
  onNavigateToLocation,
}: AllJobsPageProps) {
  const [activeTab, setActiveTab] = useState("all");
  const [locationFilter, setLocationFilter] = useState("위치기준 선택");
  const [sortOrder, setSortOrder] = useState("정렬순서 선택");
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [displayOrder, setDisplayOrder] = useState("주소순");
  const [currentPage, setCurrentPage] = useState(1);
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

  // 전체 공고 데이터 (더 많은 샘플 데이터)
  const allJobListings: JobListing[] = [
    {
      id: 1,
      company: "(주)스포츠와이드넷",
      title:
        "경제통계팀(천연가스 사업자) (주)스포츠와이드넷 안내포스 직원 모집",
      requirements: ["인턴/수습", "고졸이상", "경력무관", "정규직/계약직"],
      tags: ["세후", "주휴 급여"],
      location: "서울 강북구",
      deadline: "~ 01.31(금)",
      daysLeft: 20,
    },
    {
      id: 2,
      company: "24시간다줌홈빌",
      title: "[주4일/아파트 경비원캐디/파트타임종합판매] 본사 직영사 모집 공고",
      requirements: ["인턴/수습", "정규직/계약"],
      tags: ["1일(근무)시간", "19개월 주 휴무"],
      location: "서울 마포구",
      deadline: "~ 02.14(금)",
      daysLeft: 39,
    },
    {
      id: 3,
      company: "(주)비에이치씨",
      title: "[삼성전자 수리/서비스] 서비스센터 매뉴얼집 제공자님",
      requirements: ["프로필", "학력", "사회", "경험없어도 무관"],
      tags: ["일주 4-5일 근무 금일고", "내일고 주 휴무"],
      location: "경기 화성",
      deadline: "~ 02.11(화)",
      daysLeft: 34,
    },
    {
      id: 4,
      company: "(주)테크솔루션",
      title: "백엔드 개발자 (Java/Spring) 경력 3년 이상",
      requirements: ["경력 3년↑", "대졸이상", "정규직"],
      tags: ["4대보험", "연봉협상"],
      location: "서울 강남구",
      deadline: "~ 02.28(금)",
      daysLeft: 45,
    },
    {
      id: 5,
      company: "AI 스타트업",
      title: "프론트엔드 개발자 React 전문가 모집",
      requirements: ["경력 2년↑", "대졸이상", "정규직"],
      tags: ["재택근무", "스톡옵션"],
      location: "서울 판교",
      deadline: "~ 02.20(화)",
      daysLeft: 37,
    },
    {
      id: 6,
      company: "(주)핀테크",
      title: "DevOps 엔지니어 모집",
      requirements: ["경력 4년↑", "대졸이상", "정규직"],
      tags: ["연봉상위 10%", "복지우수"],
      location: "서울 여의도",
      deadline: "~ 02.25(일)",
      daysLeft: 42,
    },
  ];

  // 페이지네이션 계산
  const totalJobs = 567; // 전체 공고 수
  const totalPages = Math.ceil(totalJobs / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalJobs);

  // 현재 페이지에 표시할 공고 (실제로는 API에서 가져와야 함)
  const currentJobs = allJobListings;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
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

    const selectedResume = resumes.find((r) => r.id === selectedResumeId);
    const confirmed = confirm(`"${selectedResume?.title}"로 지원하시겠습니까?`);

    if (confirmed) {
      console.log(
        `공고 ${selectedJobId}에 이력서 ${selectedResumeId}로 지원하기`
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

  const handleTabClick = (tab: string) => {
    if (tab === "ai" && onNavigateToAI) {
      onNavigateToAI();
    } else if (tab === "position" && onNavigateToPosition) {
      onNavigateToPosition();
    } else if (tab === "location" && onNavigateToLocation) {
      onNavigateToLocation();
    } else {
      setActiveTab(tab);
    }
  };

  // 페이지 번호 생성 (최대 10개씩 표시)
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 10;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 메인 컨텐츠 */}
      <main className="px-6 py-8 mx-auto max-w-[1400px]">
        {/* 탭 메뉴 */}
        <div className="mb-6">
          <div className="flex border-b-2 border-gray-200">
            <button
              onClick={() => handleTabClick("all")}
              className={`px-6 py-3 font-medium transition ${
                activeTab === "all"
                  ? "text-blue-600 border-b-2 border-blue-600 -mb-0.5"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              전체공고
            </button>
            <button
              onClick={() => handleTabClick("ai")}
              className={`px-6 py-3 font-medium transition ${
                activeTab === "ai"
                  ? "text-blue-600 border-b-2 border-blue-600 -mb-0.5"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              AI 추천 공고
            </button>
            <button
              onClick={() => handleTabClick("position")}
              className={`px-6 py-3 font-medium transition ${
                activeTab === "position"
                  ? "text-blue-600 border-b-2 border-blue-600 -mb-0.5"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              직무별 공고
            </button>
            <button
              onClick={() => handleTabClick("location")}
              className={`px-6 py-3 font-medium transition ${
                activeTab === "location"
                  ? "text-blue-600 border-b-2 border-blue-600 -mb-0.5"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              지역별 공고
            </button>
          </div>
        </div>

        {/* 공고 수 및 필터 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-bold text-gray-800">
              전체 채용정보 <span className="text-blue-600">{totalJobs}</span>건
            </h2>

            {/* 위치기준 선택 */}
            <div className="relative">
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="px-4 py-2 pr-8 text-sm text-gray-700 transition bg-white border border-gray-300 rounded-lg appearance-none cursor-pointer hover:bg-gray-50"
              >
                <option value="위치기준 선택">위치기준 선택</option>
                <option value="서울 전체">서울 전체</option>
                <option value="서울 강남구">서울 강남구</option>
                <option value="서울 강북구">서울 강북구</option>
                <option value="서울 마포구">서울 마포구</option>
              </select>
              <svg
                className="absolute w-4 h-4 transform -translate-y-1/2 pointer-events-none right-2 top-1/2"
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
            </div>

            {/* 정렬순서 선택 */}
            <div className="relative">
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="px-4 py-2 pr-8 text-sm text-gray-700 transition bg-white border border-gray-300 rounded-lg appearance-none cursor-pointer hover:bg-gray-50"
              >
                <option value="정렬순서 선택">정렬순서 선택</option>
                <option value="최신순">최신순</option>
                <option value="마감임박순">마감임박순</option>
                <option value="높은연봉순">높은연봉순</option>
              </select>
              <svg
                className="absolute w-4 h-4 transform -translate-y-1/2 pointer-events-none right-2 top-1/2"
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
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* 50개씩 선택 */}
            <div className="flex items-center space-x-2">
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-3 py-1 text-sm border border-gray-300 rounded cursor-pointer"
              >
                <option value={50}>50개씩</option>
                <option value={100}>100개씩</option>
              </select>
            </div>

            {/* 주소순 선택 */}
            <div className="flex items-center space-x-2">
              <select
                value={displayOrder}
                onChange={(e) => setDisplayOrder(e.target.value)}
                className="px-3 py-1 text-sm border border-gray-300 rounded cursor-pointer"
              >
                <option value="주소순">주소순</option>
                <option value="최신순">최신순</option>
              </select>
            </div>
          </div>
        </div>

        {/* 공고 리스트 */}
        <div className="space-y-4">
          {currentJobs.map((job) => (
            <div
              key={job.id}
              className="p-6 transition bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* 회사명 */}
                  <div className="flex items-center mb-2 space-x-2">
                    <span className="text-sm font-medium text-gray-600">
                      {job.company}
                    </span>
                  </div>

                  {/* 공고 제목 */}
                  <h3 className="mb-3 text-lg font-bold text-gray-900 cursor-pointer hover:text-blue-600">
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
                          className="px-2 py-1 text-xs text-red-600 rounded bg-red-50"
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
                  <div className="flex items-center space-x-2">
                    <button className="flex items-center space-x-1 text-sm text-gray-600 transition hover:text-blue-600">
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
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <span>지원 관련정</span>
                    </button>
                    <button className="flex items-center space-x-1 text-sm text-gray-600 transition hover:text-blue-600">
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
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      <span>관심공고</span>
                    </button>
                  </div>

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
                    <span className="ml-1">
                      {job.daysLeft} 일 {job.daysLeft > 30 ? "이상" : ""} 남음
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 페이지네이션 */}
        <div className="flex items-center justify-center mt-8 space-x-2">
          {/* 이전 페이지 */}
          <button
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={`px-3 py-2 rounded ${
              currentPage === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
            }`}
          >
            이전
          </button>

          {/* 페이지 번호 */}
          {getPageNumbers().map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              className={`px-4 py-2 rounded ${
                currentPage === pageNum
                  ? "bg-blue-600 text-white font-bold"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
              }`}
            >
              {pageNum}
            </button>
          ))}

          {/* 다음 페이지 */}
          <button
            onClick={() =>
              handlePageChange(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}
            className={`px-3 py-2 rounded ${
              currentPage === totalPages
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
            }`}
          >
            다음
          </button>
        </div>

        {/* 페이지 정보 */}
        <div className="mt-4 text-sm text-center text-gray-600">
          전체 {totalJobs}건 중 {startIndex + 1} -{" "}
          {Math.min(endIndex, totalJobs)}번째 공고 ({currentPage} / {totalPages}{" "}
          페이지)
        </div>
      </main>

      {/* 이력서 선택 모달 */}
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
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2 space-x-2">
                        <h4 className="text-lg font-bold text-gray-900">
                          {resume.title}
                        </h4>
                        {resume.isDefault && (
                          <span className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded">
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
    </div>
  );
}
