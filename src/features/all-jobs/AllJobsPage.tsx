import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePageNavigation } from "../../hooks/usePageNavigation";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import JobsSidebar from "./components/JobsSidebar";
import { getJobPostings, JobPostingListResponse } from "../../api/job";
import {
  createApply,
  getMyApplies,
  type ApplyCreateRequest,
} from "../../api/apply";

// 👇 필터 컴포넌트와 타입 가져오기
import JobSearchFilter, { SearchFilters } from "./components/JobSearchFilter";

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
  thumbnailUrl?: string;
};

export default function AllJobsPage() {
  const navigate = useNavigate();
  const { activeMenu, handleMenuClick } = usePageNavigation("job", "job-sub-1");
  const { user } = useAuth();

  // ✅ [수정됨] status 제거함. SearchFilters 인터페이스와 완벽 일치.
  const [filters, setFilters] = useState<SearchFilters>({
    keyword: "",
    regions: [],
    jobCategories: [],
    status: "전체",
  });

  // 🔍 검색 및 페이징 상태
  const [searchQuery, setSearchQuery] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [selectedResumeId, setSelectedResumeId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // ✅ 백엔드 데이터 관리
  const [apiJobListings, setApiJobListings] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [appliedJobIds, setAppliedJobIds] = useState<Set<number>>(new Set());

  // ✅ AppContext 데이터
  const { resumes, addJobApplication } = useApp();

  const handleFilterChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  // ✅ 1. 사용자의 지원 내역 조회
  useEffect(() => {
    const fetchMyApplications = async () => {
      if (!user?.userId) return;

      try {
        const applies = await getMyApplies(user.userId);
        const jobIds = new Set(applies.map((apply) => apply.jobId));
        setAppliedJobIds(jobIds);
      } catch (error) {
        console.error("지원 내역 조회 실패:", error);
      }
    };

    fetchMyApplications();
  }, [user?.userId]);

  // 2. 채용공고 데이터 조회 (필터 적용)
  useEffect(() => {
    const fetchJobPostings = async () => {
      try {
        setLoading(true);
        setError(null);

        // API 파라미터 구성
        const params: any = {
          page: 0,
          size: 1000,
        };

        // 필터 적용 (변수명 일치)
        if (filters.keyword) {
          params.keyword = filters.keyword;
        }

        if (filters.regions.length > 0) {
          params.regions = filters.regions.join(",");
        }

        if (filters.jobCategories.length > 0) {
          params.jobCategories = filters.jobCategories.join(",");
        }

        if (filters.status && filters.status !== "전체") {
          params.status = filters.status;
        }

        // API 호출
        const response = await getJobPostings(params);

        // 데이터 변환
        const convertedJobs: JobListing[] = response.content.map(
          (job: JobPostingListResponse) => {
            const deadline = new Date(job.deadline);
            const today = new Date();
            const diffTime = deadline.getTime() - today.getTime();
            const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            return {
              id: job.jobId,
              company: job.companyName || "회사명",
              title: job.title,
              requirements: [],
              tags: [job.jobCategory],
              location: job.location,
              deadline: job.deadline,
              daysLeft: daysLeft > 0 ? daysLeft : 0,
              thumbnailUrl: job.thumbnailUrl,
            };
          },
        );

        setApiJobListings(convertedJobs);
      } catch (err) {
        console.error("채용공고 조회 실패:", err);
        setError("채용공고를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobPostings();
  }, [filters]);

  // ✅ 검색 필터링 + 페이징 처리
  const allJobListings = apiJobListings.filter((job) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      job.title.toLowerCase().includes(query) ||
      job.company.toLowerCase().includes(query)
    );
  });
  const totalJobs = allJobListings.length;
  const totalPages = Math.ceil(totalJobs / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalJobs);
  const currentJobs = allJobListings.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ✅ 지원하기 관련 핸들러들
  const handleApply = (jobId: number) => {
    if (confirm("입사지원 하시겠습니까?")) {
      setSelectedJobId(jobId);
      setShowResumeModal(true);
    }
  };

  const handleResumeSelect = (resumeId: number) =>
    setSelectedResumeId(resumeId);

  const handleCancelResume = () => {
    setShowResumeModal(false);
    setSelectedJobId(null);
    setSelectedResumeId(null);
  };

  const handleFinalSubmit = async () => {
    if (!selectedResumeId || !selectedJobId) {
      alert("이력서를 선택해주세요.");
      return;
    }

    if (!user?.userId) {
      alert("로그인이 필요합니다.");
      navigate("/user/login");
      return;
    }

    const selectedResume = resumes.find((r) => r.id === selectedResumeId);
    const selectedJob = allJobListings.find((j) => j.id === selectedJobId);

    if (!selectedJob) {
      alert("공고 정보를 찾을 수 없습니다.");
      return;
    }

    if (!confirm(`"${selectedResume?.title}"로 지원하시겠습니까?`)) {
      return;
    }

    try {
      setSubmitting(true);

      const applyRequest: ApplyCreateRequest = {
        jobId: selectedJob.id,
        resumeId: selectedResumeId,
      };

      await createApply(user.userId, applyRequest);

      // 로컬 스토리지 업데이트 (UI용)
      const today = new Date();
      const applicationId = Date.now();

      addJobApplication({
        id: applicationId,
        jobId: selectedJob.id,
        resumeId: selectedResumeId,
        date: today.toISOString().split("T")[0].replace(/-/g, "."),
        company: selectedJob.company,
        position: selectedJob.title,
        jobType: "정규직",
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

      // 지원 내역 갱신
      if (user?.userId) {
        const applies = await getMyApplies(user.userId);
        const jobIds = new Set(applies.map((apply) => apply.jobId));
        setAppliedJobIds(jobIds);
      }
    } catch (error: any) {
      console.error("지원 실패:", error);
      if (
        error.response?.status === 409 ||
        error.response?.data?.message?.includes("이미 지원")
      ) {
        alert("이미 지원한 공고입니다.");
      } else {
        alert(error.response?.data?.message || "지원에 실패했습니다.");
      }
    } finally {
      setSubmitting(false);
    }
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
      {/* 이력서 선택 모달 */}
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
                    disabled={submitting}
                    className="flex-1 px-6 py-3 font-medium text-white transition bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {submitting ? "지원 중..." : "지원하기"}
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
              {/* 필터 컴포넌트 */}
              <JobSearchFilter onFilterChange={handleFilterChange} />

              <section className="p-8 bg-white border-2 border-gray-200 rounded-2xl">
                {/* 검색 헤더 */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">
                    전체 채용정보{" "}
                    <span className="text-blue-600">{totalJobs}</span>건
                  </h2>

                  {/* 검색창 + 개수 선택 */}
                  <div className="flex items-center gap-3">
                    {/* 검색창 */}
                    <div className="relative">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setCurrentPage(1); // 검색 시 1페이지로 초기화
                        }}
                        placeholder="기업명, 공고제목 등 검색"
                        className="w-80 pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                      <svg
                        className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>

                    {/* 개수 선택 드롭다운 */}
                    <select
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        setCurrentPage(1); // 개수 변경 시 1페이지로 초기화
                      }}
                      className="px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer"
                    >
                      <option value={10}>10개씩</option>
                      <option value={20}>20개씩</option>
                      <option value={30}>30개씩</option>
                      <option value={40}>40개씩</option>
                      <option value={50}>50개씩</option>
                    </select>
                  </div>
                </div>

                {loading ? (
                  <div className="p-12 text-center text-gray-500">
                    <div className="mb-4 text-4xl">⏳</div>
                    <p>채용공고를 불러오는 중...</p>
                  </div>
                ) : error ? (
                  <div className="p-12 text-center text-red-500">
                    <div className="mb-4 text-4xl">⚠️</div>
                    <p>{error}</p>
                  </div>
                ) : allJobListings.length === 0 ? (
                  <div className="p-12 text-center text-gray-500">
                    <div className="mb-4 text-4xl">📋</div>
                    <p>조건에 맞는 채용공고가 없습니다.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {currentJobs.map((job) => {
                      const isApplied = appliedJobIds.has(job.id);

                      return (
                        <div
                          key={job.id}
                          className="flex flex-col overflow-hidden transition bg-white border border-gray-300 shadow-sm rounded-xl hover:shadow-xl hover:border-purple-400"
                        >
                          {/* 로고 영역 */}
                          <div className="flex items-center justify-center h-20 bg-gradient-to-br from-gray-50 to-gray-100">
                            {job.thumbnailUrl ? (
                              <img
                                src={job.thumbnailUrl}
                                alt={job.company}
                                className="object-contain w-full h-full"
                                onError={(e) => {
                                  e.currentTarget.src =
                                    "https://via.placeholder.com/150?text=No+Logo";
                                }}
                              />
                            ) : (
                              <div className="flex items-center justify-center w-16 h-16 text-2xl font-bold text-gray-400 bg-white rounded-lg">
                                {job.company.charAt(0)}
                              </div>
                            )}
                          </div>

                          {/* 내용 영역 */}
                          <div className="flex flex-col flex-1 p-5">
                            {/* 직무명 */}
                            <h3
                              className="mb-2 text-lg font-bold text-gray-900 line-clamp-2"
                            >
                              {job.title}
                            </h3>

                            {/* 회사명 */}
                            <p className="mb-3 text-sm font-medium text-gray-600">
                              {job.company}
                            </p>

                            {/* 정보 태그 */}
                            <div className="flex flex-wrap gap-2 mb-4">
                              <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full">
                                {job.location}
                              </span>
                              {job.tags.map((tag, i) => (
                                <span
                                  key={i}
                                  className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>

                            {/* 하단 정보 */}
                            <div className="flex items-center justify-between pt-4 mt-auto border-t border-gray-100">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-600">
                                  ~ {job.deadline}
                                </span>
                              </div>
                              <span
                                className={`text-sm font-bold ${
                                  job.daysLeft <= 7
                                    ? "text-red-600"
                                    : "text-blue-600"
                                }`}
                              >
                                D-{job.daysLeft}
                              </span>
                            </div>

                            {/* 지원 버튼 */}
                            <button
                              onClick={() =>
                                isApplied ? null : handleApply(job.id)
                              }
                              disabled={isApplied}
                              className={`w-full py-2.5 mt-4 text-sm font-semibold transition rounded-lg ${
                                isApplied
                                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                  : "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 transform hover:scale-105"
                              }`}
                            >
                              {isApplied ? "지원완료" : "입사지원"}
                            </button>
                          </div>
                        </div>
                      );
                    })}
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
