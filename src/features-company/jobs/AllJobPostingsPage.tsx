import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CompanyLeftSidebar from "../components/CompanyLeftSidebar";
import { useCompanyPageNavigation } from "../hooks/useCompanyPageNavigation";
import { getJobPostings, type JobPostingListResponse } from "../../api/job";

export default function AllJobPostingsPage() {
  const navigate = useNavigate();
  const { activeMenu, handleMenuClick } = useCompanyPageNavigation(
    "jobs",
    "jobs-sub-1"
  );

  const [jobPostings, setJobPostings] = useState<JobPostingListResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("전체");
  const [selectedCategory, setSelectedCategory] = useState("전체");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const loadJobPostings = async () => {
      try {
        setLoading(true);

        const params: any = {
          page: currentPage,
          size: 20,
        };

        if (searchKeyword) {
          params.keyword = searchKeyword;
        }
        if (selectedStatus !== "전체") {
          params.status = selectedStatus;
        }
        if (selectedCategory !== "전체") {
          params.jobCategory = selectedCategory;
        }

        const response = await getJobPostings(params);
        setJobPostings(response.content);
        setTotalPages(response.totalPages);
      } catch (error: any) {
        console.error("공고 목록 조회 실패:", error);
        alert(
          error.response?.data?.message ||
            "공고 목록을 불러오는데 실패했습니다."
        );
      } finally {
        setLoading(false);
      }
    };

    loadJobPostings();
  }, [currentPage, searchKeyword, selectedStatus, selectedCategory]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(0);
  };

  const handleJobClick = (jobId: number) => {
    navigate(`/company/jobs/${jobId}`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return (
          <span className="px-3 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full">
            진행중
          </span>
        );
      case "CLOSED":
        return (
          <span className="px-3 py-1 text-xs font-semibold text-gray-700 bg-gray-100 rounded-full">
            마감
          </span>
        );
      case "EXPIRED":
        return (
          <span className="px-3 py-1 text-xs font-semibold text-red-700 bg-red-100 rounded-full">
            기간만료
          </span>
        );
      default:
        return null;
    }
  };

  const formatExperience = (min?: number, max?: number) => {
    if (min === undefined && max === undefined) return "경력무관";
    if (min === 0) return "신입";
    if (max === undefined) return `${min}년 이상`;
    return `${min}~${max}년`;
  };

  const formatSalary = (min?: number, max?: number) => {
    if (min === undefined && max === undefined) return "협의";
    if (min === max) return `${min?.toLocaleString()}만원`;
    return `${min?.toLocaleString()} ~ ${max?.toLocaleString()}만원`;
  };

  if (loading && jobPostings.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold text-gray-600">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex gap-10 px-6 py-8 mx-auto max-w-screen-2xl">
        <aside className="flex-shrink-0 hidden w-64 lg:block">
          <CompanyLeftSidebar
            activeMenu={activeMenu}
            onMenuClick={handleMenuClick}
          />
        </aside>

        <main className="flex-1 min-w-0">
          <div className="p-8 bg-white shadow-lg rounded-2xl">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-bold">전체 공고 목록</h1>
              <p className="text-sm text-gray-500">
                전체 {jobPostings.length}개 공고
              </p>
            </div>

            <div className="mb-6 space-y-4">
              <form onSubmit={handleSearch} className="flex gap-2">
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder="공고명, 회사명으로 검색..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                />
                <button
                  type="submit"
                  className="px-6 py-2 font-semibold text-white transition bg-purple-600 rounded-lg hover:bg-purple-700"
                >
                  검색
                </button>
              </form>

              <div className="grid grid-cols-2 gap-4">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                >
                  <option value="전체">전체 상태</option>
                  <option value="ACTIVE">진행중</option>
                  <option value="CLOSED">마감</option>
                  <option value="EXPIRED">기간만료</option>
                </select>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                >
                  <option value="전체">전체 직무</option>
                  <option value="프론트엔드 개발자">프론트엔드 개발자</option>
                  <option value="백엔드 개발자">백엔드 개발자</option>
                  <option value="풀스택 개발자">풀스택 개발자</option>
                  <option value="PM">PM</option>
                  <option value="데이터 분석가">데이터 분석가</option>
                  <option value="디자이너">디자이너</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {jobPostings.length === 0 ? (
                <div className="py-20 text-center text-gray-500">
                  <div className="mb-4 text-4xl">📋</div>
                  <div className="text-lg font-medium">공고가 없습니다</div>
                  <div className="text-sm">
                    다른 검색 조건으로 시도해보세요
                  </div>
                </div>
              ) : (
                jobPostings.map((job) => (
                  <div
                    key={job.jobId}
                    onClick={() => handleJobClick(job.jobId)}
                    className="p-6 transition border border-gray-200 rounded-lg cursor-pointer hover:border-purple-300 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-gray-900">
                            {job.title}
                          </h3>
                          {getStatusBadge(job.status)}
                        </div>
                        <p className="text-sm font-medium text-purple-600">
                          {job.companyName}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm md:grid-cols-4">
                      <div>
                        <span className="text-gray-500">직무:</span>
                        <span className="ml-2 font-medium text-gray-900">
                          {job.jobCategory}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">근무지:</span>
                        <span className="ml-2 font-medium text-gray-900">
                          {job.location}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">경력:</span>
                        <span className="ml-2 font-medium text-gray-900">
                          {formatExperience(job.experienceMin, job.experienceMax)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">급여:</span>
                        <span className="ml-2 font-medium text-gray-900">
                          {formatSalary(job.salaryMin, job.salaryMax)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex gap-4 text-sm text-gray-500">
                        <span>👁️ 조회 {job.viewCount}</span>
                        <span>📝 지원자 {job.applicantCount}</span>
                        <span>⭐ 북마크 {job.bookmarkCount}</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        마감일: {job.deadline || "상시채용"}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  이전
                </button>
                <span className="flex items-center px-4 text-sm text-gray-700">
                  {currentPage + 1} / {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages - 1, currentPage + 1))
                  }
                  disabled={currentPage >= totalPages - 1}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  다음
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
