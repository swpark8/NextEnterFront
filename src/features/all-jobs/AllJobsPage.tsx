import { useState } from "react";
import { usePageNavigation } from "../../hooks/usePageNavigation";
import { useApp } from "../../context/AppContext";
import JobsSidebar from "./components/JobsSidebar";

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

  // ✅ AppContext에서 데이터 가져오기 (addJobApplication 추가)
  const { resumes, jobListings, businessJobs, addJobApplication } = useApp();
  
  // businessJobs를 JobListing 형식으로 변환
  const convertedBusinessJobs: JobListing[] = businessJobs.map(job => {
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
    };
  });
  
  const allJobListings = [...jobListings, ...convertedBusinessJobs];

  const totalJobs = allJobListings.length;
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

  // ✅ 지원하기 함수 수정 - 지원 내역 저장
  const handleFinalSubmit = () => {
    if (!selectedResumeId || !selectedJobId) {
      alert("이력서를 선택해주세요.");
      return;
    }

    const selectedResume = resumes.find((r) => r.id === selectedResumeId);
    const selectedJob = allJobListings.find((j) => j.id === selectedJobId);

    if (!selectedJob) {
      alert("공고 정보를 찾을 수 없습니다.");
      return;
    }

    if (confirm(`"${selectedResume?.title}"로 지원하시겠습니까?`)) {
      // ✅ 지원 내역 생성 및 저장
      const today = new Date();
      const applicationId = Date.now(); // 임시 ID 생성

      addJobApplication({
        id: applicationId,
        jobId: selectedJob.id,
        resumeId: selectedResumeId,
        date: today.toISOString().split('T')[0].replace(/-/g, '.'),
        company: selectedJob.company,
        position: selectedJob.title,
        jobType: "정규직", // 실제로는 공고에서 가져와야 함
        location: selectedJob.location,
        deadline: selectedJob.deadline,
        viewed: false,
        status: "지원완료",
        canCancel: true,
      });

      alert("지원이 완료되었습니다!");
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
    <>
      {/* 이력서 선택 다이얼로그 */}
      {showResumeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <h3 className="mb-6 text-2xl font-bold text-gray-900">
              지원할 이력서를 선택해주세요
            </h3>
            {resumes.length === 0 ? (
              <div className="p-8 text-center">
                <p className="mb-4 text-gray-600">등록된 이력서가 없습니다.</p>
                <button
                  onClick={() => {
                    setShowResumeModal(false);
                    handleMenuClick("resume-sub-1");
                  }}
                  className="px-6 py-2 text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  이력서 작성하기
                </button>
              </div>
            ) : (
              <>
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
                      <p className="text-sm text-gray-600">
                        산업: {resume.industry}
                      </p>
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
              </>
            )}
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gray-50">
        <div className="px-4 py-8 mx-auto max-w-7xl">
          <h1 className="mb-6 text-2xl font-bold">채용정보</h1>
          <div className="flex gap-6">
            {/* 왼쪽 사이드바 */}
            <JobsSidebar
              activeMenu={activeMenu}
              onMenuClick={handleMenuClick}
            />

            {/* 메인 컨텐츠 */}
            <div className="flex-1 space-y-8">
              <section className="p-8 bg-white border-2 border-gray-200 rounded-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">
                    전체 채용정보 <span className="text-blue-600">{totalJobs}</span>건
                  </h2>
                </div>

                {allJobListings.length === 0 ? (
                  <div className="p-12 text-center text-gray-500">
                    <div className="mb-4 text-4xl">📋</div>
                    <p>등록된 채용공고가 없습니다.</p>
                  </div>
                ) : (
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
                )}

                {totalPages > 1 && (
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
                )}
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
