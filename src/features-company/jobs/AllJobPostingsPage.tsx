import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CompanyLeftSidebar from "../components/CompanyLeftSidebar";
import { useCompanyPageNavigation } from "../hooks/useCompanyPageNavigation";
import { getJobPostings, type JobPostingListResponse } from "../../api/job";

import CompanyJobSearchFilter, {
  CompanySearchFilters,
} from "./components/CompanySearchFilter";

export default function AllJobPostingsPage() {
  const navigate = useNavigate();
  const { activeMenu, handleMenuClick } = useCompanyPageNavigation(
    "jobs",
    "jobs-sub-1",
  );

  // 데이터 상태
  const [jobPostings, setJobPostings] = useState<JobPostingListResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // 필터 상태
  const [filters, setFilters] = useState<CompanySearchFilters>({
    keyword: "",
    regions: [],
    jobCategories: [],
    status: "전체",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 필터 변경 핸들러
  const handleFilterChange = (newFilters: CompanySearchFilters) => {
    setFilters(newFilters);
    setCurrentPage(0);
  };

  // 공고 목록 조회 API 호출
  useEffect(() => {
    const loadJobPostings = async () => {
      try {
        setLoading(true);

        const params: any = {
          page: currentPage,
          size: itemsPerPage,
        };

        // 필터 적용
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

        const response = await getJobPostings(params);
        setJobPostings(response.content);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error("공고 목록 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    loadJobPostings();
  }, [currentPage, filters, itemsPerPage]);

  // D-Day 계산 함수
  const getDaysLeft = (deadline: string) => {
    const today = new Date();
    const end = new Date(deadline);
    const diff = end.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex gap-6 px-4 py-8 mx-auto max-w-7xl">
        {/* 사이드바 */}
        <div className="w-64 shrink-0">
          <CompanyLeftSidebar
            activeMenu={activeMenu}
            onMenuClick={handleMenuClick}
          />
        </div>

        {/* 메인 컨텐츠 */}
        <main className="flex-1 space-y-8">
          {/* 필터 컴포넌트 */}
          <CompanyJobSearchFilter onFilterChange={handleFilterChange} />

          {/* 공고 리스트 섹션 */}
          <div className="p-8 bg-white border border-gray-200 shadow-sm rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                전체 채용공고{" "}
                <span className="text-purple-600">{jobPostings.length}</span>건
              </h2>
              <div className="flex items-center gap-3">
                {/* 검색창 */}
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setFilters({ ...filters, keyword: searchQuery });
                        setCurrentPage(0);
                      }
                    }}
                    placeholder="기업명, 공고제목 등 검색"
                    className="w-80 pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
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
                    setCurrentPage(0);
                  }}
                  className="px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 cursor-pointer"
                >
                  <option value={10}>10개씩</option>
                  <option value={20}>20개씩</option>
                  <option value={30}>30개씩</option>
                  <option value={40}>40개씩</option>
                  <option value={50}>50개씩</option>
                </select>
              </div>
            </div>

            <div className="grid gap-4">
              {loading ? (
                <div className="py-20 text-center text-gray-500">
                  로딩 중...
                </div>
              ) : jobPostings.length === 0 ? (
                <div className="py-20 text-center text-gray-500">
                  등록된 공고가 없습니다.
                </div>
              ) : (
                jobPostings.map((job) => {
                  const daysLeft = getDaysLeft(job.deadline);
                  return (
                    <div
                      key={job.jobId}
                      onClick={() => navigate(`/company/jobs/${job.jobId}`)}
                      className="flex items-center justify-between p-6 transition-all bg-white border border-gray-100 cursor-pointer rounded-xl hover:shadow-md hover:border-purple-200"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-1 text-xs font-medium text-purple-700 rounded-lg bg-purple-50">
                            {job.jobCategory}
                          </span>
                          <span className="text-xs text-gray-500">
                            {job.companyName}
                          </span>
                        </div>
                        <h3 className="mb-1 text-lg font-bold text-gray-900">
                          {job.title}
                        </h3>
                        <div className="flex gap-4 text-sm text-gray-500">
                          <span>{job.location}</span>
                          <span>•</span>
                          <span>마감일 {job.deadline}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="mb-1 text-sm text-gray-500">
                            지원자
                          </div>
                          <div className="font-bold text-purple-600">
                            {job.applicantCount}명
                          </div>
                        </div>
                        <div
                          className={`px-4 py-2 text-sm font-bold rounded-lg ${
                            daysLeft <= 7
                              ? "bg-red-50 text-red-600"
                              : "bg-blue-50 text-blue-600"
                          }`}
                        >
                          {daysLeft > 0 ? `D-${daysLeft}` : "마감"}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
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
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
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
