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

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {jobPostings.length === 0 ? (
                <div className="col-span-full py-20 text-center text-gray-500">
                  <div className="mb-4 text-4xl">📋</div>
                  <div className="text-lg font-medium">공고가 없습니다</div>
                  <div className="text-sm">
                    다른 검색 조건으로 시도해보세요
                  </div>
                </div>
              ) : (
                jobPostings.map((job) => {
                  const deadline = new Date(job.deadline);
                  const today = new Date();
                  const diffTime = deadline.getTime() - today.getTime();
                  const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  
                  return (
                    <div
                      key={job.jobId}
                      onClick={() => handleJobClick(job.jobId)}
                      className="flex flex-col overflow-hidden transition bg-white border border-gray-300 rounded-xl shadow-sm hover:shadow-xl hover:border-purple-400 cursor-pointer"
                    >
                      {/* 로고 영역 */}
                      <div className="flex items-center justify-center h-20 bg-gradient-to-br from-gray-50 to-gray-100">
                        {job.logoUrl ? (
                          <img
                            src={job.logoUrl}
                            alt={job.companyName}
                            className="object-contain w-16 h-16"
                            onError={(e) => {
                              e.currentTarget.src = 'https://via.placeholder.com/150?text=No+Logo';
                            }}
                          />
                        ) : (
                          <div className="flex items-center justify-center w-16 h-16 text-2xl font-bold text-gray-400 bg-white rounded-lg">
                            {job.companyName?.charAt(0) || '회'}
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
                          {job.companyName}
                        </p>

                        {/* 썸네일 이미지 */}
                        <div className="mb-3 overflow-hidden rounded-lg">
                          {job.thumbnailUrl ? (
                            <img
                              src={job.thumbnailUrl}
                              alt={`${job.title} 썸네일`}
                              className="object-cover w-full h-32"
                              onError={(e) => {
                                e.currentTarget.src = 'https://via.placeholder.com/400x200?text=No+Image';
                              }}
                            />
                          ) : (
                            <div className="flex items-center justify-center w-full h-32 bg-gradient-to-br from-purple-50 to-blue-50">
                              <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>

                        {/* 정보 태그 */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {job.location}
                          </span>
                          <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            {formatExperience(job.experienceMin, job.experienceMax)}
                          </span>
                          {getStatusBadge(job.status)}
                        </div>

                        {/* 통계 정보 */}
                        <div className="flex items-center gap-3 mb-3 text-xs text-gray-500">
                          <span>👁️ {job.viewCount}</span>
                          <span>📝 {job.applicantCount}</span>
                          <span>⭐ {job.bookmarkCount}</span>
                        </div>

                        {/* 하단 정보 */}
                        <div className="flex items-center justify-between pt-4 mt-auto border-t border-gray-100">
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-xs text-gray-600">
                              ~ {job.deadline || "상시채용"}
                            </span>
                          </div>
                          <span className={`text-sm font-bold ${
                            daysLeft <= 7 ? 'text-red-600' : 'text-blue-600'
                          }`}>
                            {daysLeft > 0 ? `D-${daysLeft}` : '마감'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
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
