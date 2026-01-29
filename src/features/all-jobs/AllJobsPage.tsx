import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePageNavigation } from "../../hooks/usePageNavigation";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import JobsSidebar from "./components/JobsSidebar";
import { getJobPostings, JobPostingListResponse } from "../../api/job";
import { getResumeList } from "../../api/resume";
import {
  createApply,
  getMyApplies,
  type ApplyCreateRequest,
} from "../../api/apply";

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
  logoUrl?: string;
  status: string; // ✅ 추가: ACTIVE/CLOSED/EXPIRED
};

export default function AllJobsPage() {
  const navigate = useNavigate();
  const { activeMenu, handleMenuClick } = usePageNavigation("job", "job-sub-1");
  const { user } = useAuth();

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

  // ✅ AppContext 데이터 (setResumes 추가)
  const { resumes, addJobApplication, setResumes } = useApp();

  const handleFilterChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  useEffect(() => {
    const fetchResumesIfNeeded = async () => {
      if (user?.userId && resumes.length === 0) {
        try {
          const data = await getResumeList(user.userId);

          const mappedResumes = data.map((item) => ({
            id: item.resumeId,
            title: item.title,
            industry: item.jobCategory,
            applications: 0,
          }));

          setResumes(mappedResumes);
        } catch (error) {
          console.error("이력서 목록 로드 실패:", error);
        }
      }
    };

    fetchResumesIfNeeded();
  }, [user?.userId, resumes.length, setResumes]);

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

  // ✅ 2. 채용공고 데이터 조회 (필터 적용)
  useEffect(() => {
    const fetchJobPostings = async () => {
      try {
        setLoading(true);
        setError(null);

        const params: any = {
          page: 0,
          size: 1000,
        };

        if (filters.keyword) params.keyword = filters.keyword;
        if (filters.regions.length > 0)
          params.regions = filters.regions.join(",");
        if (filters.jobCategories.length > 0)
          params.jobCategories = filters.jobCategories.join(",");

        /**
         * ✅ 핵심 수정:
         * 개인 회원 "전체 공고 조회"에서는 기업이 삭제(실제로는 CLOSED)한 공고가 보이면 안 되므로
         * 서버가 CLOSED까지 내려주더라도 프론트에서 ACTIVE만 남깁니다.
         *
         * (옵션) 서버가 status 파라미터를 제대로 지원하면 아래 한 줄로도 충분:
         * params.status = "ACTIVE";
         *
         * 그런데 현재 filters.status 값이 '전체' 같은 한글일 수 있어
         * 서버 규격과 불일치 가능성이 있어, 안전하게 프론트 필터를 강제합니다.
         */
        // params.status = "ACTIVE"; // ✅ 서버가 ACTIVE 필터를 지원하면 주석 해제 권장

        const response = await getJobPostings(params);

        const convertedJobs: JobListing[] = response.content
          // ✅ ACTIVE만 노출 (삭제/마감된 공고는 숨김)
          .filter((job: JobPostingListResponse) => job.status === "ACTIVE")
          .map((job: JobPostingListResponse) => {
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
              logoUrl: job.logoUrl,
              status: job.status, // ✅ 추가
            };
          });

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

  const handleApply = (jobId: number) => {
    if (confirm("입사지원 하시겠습니까?")) {
      setSelectedJobId(jobId);
      setShowResumeModal(true);
    }
  };

  const handleResumeSelect = (resumeId: number) => setSelectedResumeId(resumeId);

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
    for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);
    return pageNumbers;
  };

  // ✅ 카드 전체 클릭으로 상세 이동
  const handleCardClick = (jobId: number) => {
    navigate(`/user/jobs/${jobId}`);
  };

  // ✅ "입사지원" 버튼 누르면 카드 클릭(상세 이동) 이벤트가 같이 안 타게
  const stopCardNavigation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <>
      {/* 이력서 선택 모달 */}
      {showResumeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto ">
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
                <div className="mb-6 space-y-4 ">
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

      <div className="min-h-screen bg-white">
        <div className="px-4 py-8 mx-auto max-w-7xl">
          <h1 className="mb-6 text-2xl font-bold">채용정보</h1>
          <div className="flex gap-6">
            <JobsSidebar activeMenu={activeMenu} onMenuClick={handleMenuClick} />

            <div className="flex-1 space-y-8">
              <JobSearchFilter onFilterChange={handleFilterChange} />

              <section className="p-8 bg-white border-2 border-gray-200 rounded-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">
                    전체 채용정보{" "}
                    <span className="text-blue-600">{totalJobs}</span>건
                  </h2>

                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setCurrentPage(1);
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

                    <select
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        setCurrentPage(1);
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
                          role="button"
                          tabIndex={0}
                          onClick={() => handleCardClick(job.id)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              handleCardClick(job.id);
                            }
                          }}
                          className="flex flex-col overflow-hidden transition bg-white border border-gray-300 shadow-sm rounded-xl hover:shadow-xl hover:border-purple-400 cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-400"
                        >
                          <div className="flex items-center justify-center h-12 bg-gradient-to-br from-gray-50 to-gray-100">
                            {job.logoUrl ? (
                              <img
                                src={job.logoUrl}
                                alt={job.company}
                                className="object-contain w-16 h-16"
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

                          <div className="flex flex-col flex-1 p-5">
                            <h3 className="mb-2 text-lg font-bold text-gray-900 transition-colors line-clamp-2 hover:text-blue-600">
                              {job.title}
                            </h3>

                            <p className="mb-3 text-sm font-medium text-gray-600">
                              {job.company}
                            </p>

                            <div className="mb-3 overflow-hidden rounded-lg">
                              {job.thumbnailUrl ? (
                                <img
                                  src={job.thumbnailUrl}
                                  alt={`${job.title} 썸네일`}
                                  className="object-cover w-full h-40"
                                  onError={(e) => {
                                    e.currentTarget.src =
                                      "https://via.placeholder.com/400x200?text=No+Image";
                                  }}
                                />
                              ) : (
                                <div className="flex items-center justify-center w-full h-40 bg-gradient-to-br from-purple-50 to-blue-50">
                                  <svg
                                    className="w-12 h-12 text-gray-300"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={1.5}
                                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                  </svg>
                                </div>
                              )}
                            </div>

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

                            <div className="flex items-center justify-between pt-4 mt-auto border-t border-gray-100">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-600">
                                  ~ {job.deadline}
                                </span>
                              </div>
                              <span
                                className={`text-sm font-bold ${
                                  job.daysLeft <= 7 ? "text-red-600" : "text-blue-600"
                                }`}
                              >
                                D-{job.daysLeft}
                              </span>
                            </div>

                            <button
                              onClick={(e) => {
                                stopCardNavigation(e);
                                if (!isApplied) handleApply(job.id);
                              }}
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
