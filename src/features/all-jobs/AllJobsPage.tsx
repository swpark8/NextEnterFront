import { useState } from "react";
import { usePageNavigation } from "../../hooks/usePageNavigation";

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

// ✅ [수정] 안 쓰는 props 제거
export default function AllJobsPage() {
  const { activeMenu, handleMenuClick } = usePageNavigation("job", "job-sub-1");

  const [locationFilter, setLocationFilter] = useState("위치기준 선택");
  const [sortOrder, setSortOrder] = useState("정렬순서 선택");
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [displayOrder, setDisplayOrder] = useState("주소순");
  const [currentPage, setCurrentPage] = useState(1);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [selectedResumeId, setSelectedResumeId] = useState<number | null>(null);

  const handleTabClick = (menuId: string) => {
    handleMenuClick(menuId);
  };

  // ... (데이터는 동일)
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

  const totalJobs = 567;
  const totalPages = Math.ceil(totalJobs / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalJobs);
  const currentJobs = allJobListings;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
      <main className="px-6 py-8 mx-auto max-w-[1400px]">
        <div className="mb-6">
          <div className="flex border-b-2 border-gray-200">
            <button
              className={`px-6 py-3 font-medium transition ${
                activeMenu === "job-sub-1"
                  ? "text-blue-600 border-b-2 border-blue-600 -mb-0.5"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              전체공고
            </button>
            <button
              onClick={() => handleTabClick("job-sub-2")}
              className={`px-6 py-3 font-medium transition ${
                activeMenu === "job-sub-2"
                  ? "text-blue-600 border-b-2 border-blue-600 -mb-0.5"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              AI 추천 공고
            </button>
            <button
              onClick={() => handleTabClick("job-sub-3")}
              className={`px-6 py-3 font-medium transition ${
                activeMenu === "job-sub-3"
                  ? "text-blue-600 border-b-2 border-blue-600 -mb-0.5"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              직무별 공고
            </button>
            <button
              onClick={() => handleTabClick("job-sub-4")}
              className={`px-6 py-3 font-medium transition ${
                activeMenu === "job-sub-4"
                  ? "text-blue-600 border-b-2 border-blue-600 -mb-0.5"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              지역별 공고
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-800">
            전체 채용정보 <span className="text-blue-600">{totalJobs}</span>건
          </h2>
          {/* ... 필터 UI ... */}
        </div>

        <div className="space-y-4">
          {currentJobs.map((job) => (
            <div
              key={job.id}
              className="p-6 transition bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2 space-x-2">
                    <span className="text-sm font-medium text-gray-600">
                      {job.company}
                    </span>
                  </div>
                  <h3 className="mb-3 text-lg font-bold text-gray-900 cursor-pointer hover:text-blue-600">
                    {job.title}
                  </h3>
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

        <div className="flex items-center justify-center mt-8 space-x-2">
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
        </div>
      </main>

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
    </div>
  );
}
