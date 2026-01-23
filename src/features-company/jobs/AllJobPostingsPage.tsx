import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CompanyLeftSidebar from "../components/CompanyLeftSidebar";
import { useCompanyPageNavigation } from "../hooks/useCompanyPageNavigation";
import { getJobPostings, type JobPostingListResponse } from "../../api/job";

export default function AllJobPostingsPage() {
  const navigate = useNavigate();
  const { activeMenu, handleMenuClick } = useCompanyPageNavigation(
    "jobs",
    "jobs-sub-1",
  );

  const [jobPostings, setJobPostings] = useState<JobPostingListResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // 실제 검색에 사용할 값
  const [selectedStatus, setSelectedStatus] = useState("전체");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]); // 다중 선택
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]); // 다중 선택
  const [activeTab, setActiveTab] = useState<"job" | "region" | "search">(
    "job",
  ); // 탭 상태
  const [expandedRegion, setExpandedRegion] = useState<string | null>(null); // 펼쳐진 지역

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

        if (searchQuery) {
          params.keyword = searchQuery;
        }
        if (selectedStatus !== "전체") {
          params.status = selectedStatus;
        }
        if (selectedCategories.length > 0) {
          params.jobCategories = selectedCategories.join(",");
        }
        if (selectedRegions.length > 0) {
          params.regions = selectedRegions.join(","); // 여러 지역을 콤마로 구분
        }

        const response = await getJobPostings(params);
        setJobPostings(response.content);
        setTotalPages(response.totalPages);
      } catch (error: any) {
        console.error("공고 목록 조회 실패:", error);
        alert(
          error.response?.data?.message ||
            "공고 목록을 불러오는데 실패했습니다.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadJobPostings();
  }, [
    currentPage,
    searchQuery,
    selectedStatus,
    selectedCategories,
    selectedRegions,
  ]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchKeyword); // 검색 버튼 클릭 시에만 검색어 업데이트
    setCurrentPage(0);
  };

  const handleJobClick = (jobId: number) => {
    navigate(`/company/jobs/${jobId}`);
  };

  // 직무 체크박스 토글
  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  // 지역 체크박스 토글
  const handleRegionToggle = (region: string) => {
    setSelectedRegions((prev) =>
      prev.includes(region)
        ? prev.filter((r) => r !== region)
        : [...prev, region],
    );
  };

  // 서울 구 전체 선택/해제 (개별 구 선택용)
  const handleSeoulDistrictToggle = (district: string) => {
    handleRegionToggle(`서울 ${district}`);
  };

  const seoulDistricts = [
    "강남구",
    "강동구",
    "강북구",
    "강서구",
    "관악구",
    "광진구",
    "구로구",
    "금천구",
    "노원구",
    "도봉구",
    "동대문구",
    "동작구",
    "마포구",
    "서대문구",
    "서초구",
    "성동구",
    "성북구",
    "송파구",
    "양천구",
    "영등포구",
    "용산구",
    "은평구",
    "종로구",
    "중구",
    "중랑구",
  ];

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

            {/* 탭 네비게이션 */}
            <div className="flex w-full border-b border-gray-200">
              <button
                onClick={() => setActiveTab("job")}
                className={`flex-1 py-3 text-center font-semibold transition ${
                  activeTab === "job"
                    ? "text-purple-600 border-b-2 border-purple-600"
                    : "text-gray-600 hover:text-purple-600 hover:bg-gray-50"
                }`}
              >
                직업 선택
              </button>
              <button
                onClick={() => setActiveTab("region")}
                className={`flex-1 py-3 text-center font-semibold transition ${
                  activeTab === "region"
                    ? "text-purple-600 border-b-2 border-purple-600"
                    : "text-gray-600 hover:text-purple-600 hover:bg-gray-50"
                }`}
              >
                지역 선택
              </button>
              <button
                onClick={() => setActiveTab("search")}
                className={`flex-1 py-3 text-center font-semibold transition ${
                  activeTab === "search"
                    ? "text-purple-600 border-b-2 border-purple-600"
                    : "text-gray-600 hover:text-purple-600 hover:bg-gray-50"
                }`}
              >
                검색어 입력
              </button>
            </div>

            {/* 탭 컨텐츠 */}
            <div className="mt-12">
              {/* 직업 선택 탭 */}
              {activeTab === "job" && (
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <p className="text-sm text-gray-600">
                      원하시는 직무를 선택해주세요
                    </p>
                    <button
                      onClick={() => setSelectedCategories([])}
                      className="text-sm text-purple-600 hover:text-purple-700"
                    >
                      전체해제
                    </button>
                  </div>
                  <div className="flex flex-wrap justify-center gap-6 py-4">
                    {[
                      "프론트엔드 개발자",
                      "백엔드 개발자",
                      "풀스택 개발자",
                      "PM",
                      "데이터 분석가",
                      "디자이너",
                    ].map((category) => (
                      <button
                        key={category}
                        onClick={() => handleCategoryToggle(category)}
                        className={`px-4 py-3 text-sm font-medium rounded-lg border transition min-w-[120px] ${
                          selectedCategories.includes(category)
                            ? "bg-purple-50 border-purple-600 text-purple-600"
                            : "bg-white border-gray-300 text-gray-700 hover:border-purple-400"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 지역 선택 탭 */}
              {activeTab === "region" && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-gray-600">
                      원하시는 지역을 선택해주세요 (다중 선택 가능)
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedRegions([])}
                        className="text-sm text-purple-600 hover:text-purple-700"
                      >
                        전체해제
                      </button>
                    </div>
                  </div>

                  {/* 지역 검색 */}
                  <div className="mb-4">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="지역명 입력"
                        className="w-full px-4 py-2 pl-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                      />
                      <svg
                        className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2"
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
                  </div>

                  <div
                    className="grid gap-4"
                    style={{ gridTemplateColumns: "3fr 7fr" }}
                  >
                    {/* 왼쪽: 주요 지역 (2열) */}
                    <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <h3 className="mb-3 text-sm font-semibold text-gray-700">
                        지역
                      </h3>
                      <div className="grid grid-cols-2 overflow-y-auto gap-x-2 gap-y-1 max-h-96">
                        {[
                          { name: "서울", count: "62,055" },
                          { name: "경기", count: "51,552" },
                          { name: "인천", count: "8,486" },
                          { name: "부산", count: "13,276" },
                          { name: "대구", count: "8,208" },
                          { name: "광주", count: "3,531" },
                          { name: "대전", count: "4,825" },
                          { name: "울산", count: "3,289" },
                          { name: "세종", count: "1,453" },
                          { name: "강원", count: "1,721" },
                          { name: "경남", count: "11,845" },
                          { name: "경북", count: "8,029" },
                          { name: "전남", count: "3,837" },
                          { name: "전북", count: "4,965" },
                          { name: "충남", count: "8,502" },
                          { name: "충북", count: "6,875" },
                          { name: "제주", count: "1,615" },
                        ].map((region) => {
                          // ✅ 수정된 로직: 서울 버튼의 색깔 유지 조건 강화
                          const isSelected =
                            expandedRegion === region.name || // 1. 현재 펼쳐져 있거나
                            selectedRegions.includes(region.name) || // 2. (타지역) 이름이 목록에 있거나
                            (region.name === "서울" &&
                              selectedRegions.some((r) => r.includes("서울"))); // 3. (서울) "서울..."로 시작하는 데이터가 하나라도 있거나

                          return (
                            <button
                              key={region.name}
                              onClick={() => {
                                if (region.name === "서울") {
                                  // 서울 토글 로직
                                  if (expandedRegion === "서울") {
                                    // 닫을 때: 패널 닫고 + '서울 전체' 체크 해제
                                    setExpandedRegion(null);
                                    setSelectedRegions((prev) =>
                                      prev.filter((r) => r !== "서울 전체"),
                                    );
                                  } else {
                                    // 열 때: 패널 열고 + '서울 전체' 체크 추가 (기존 선택 유지하면서 추가)
                                    setExpandedRegion("서울");
                                    setSelectedRegions((prev) =>
                                      prev.includes("서울 전체")
                                        ? prev
                                        : [...prev, "서울 전체"],
                                    );
                                  }
                                } else {
                                  // 타지역 토글 로직 (다중 선택 보장)
                                  setExpandedRegion(null); // 서울 패널만 닫음 (데이터는 건드리지 않음)
                                  handleRegionToggle(region.name);
                                }
                              }}
                              className={`flex items-center justify-between w-full px-2 py-1 text-xs text-left transition rounded ${
                                isSelected
                                  ? "bg-purple-100 text-purple-700 font-semibold"
                                  : "hover:bg-white"
                              }`}
                            >
                              <span className="font-medium">{region.name}</span>
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-gray-500">
                                  ({region.count})
                                </span>
                                {region.name === "서울" && (
                                  <svg
                                    className={`w-3 h-3 transition-transform ${
                                      expandedRegion === "서울"
                                        ? "rotate-90"
                                        : ""
                                    }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M9 5l7 7-7 7"
                                    />
                                  </svg>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* 오른쪽: 상세 지역 (3열) */}
                    <div className="p-4 bg-white border border-gray-200 rounded-lg">
                      <h3 className="mb-3 text-sm font-semibold text-gray-700">
                        {expandedRegion === "서울"
                          ? "서울 상세 지역"
                          : "상세 지역"}
                      </h3>
                      <div className="grid grid-cols-3 overflow-y-auto gap-x-2 gap-y-1 max-h-96">
                        {expandedRegion === "서울" ? (
                          <>
                            {/* ✅ "서울 전체" 단일 체크박스 */}
                            <label className="flex items-center justify-between col-span-3 px-2 py-1 pb-2 mb-1 text-xs border-b border-gray-200 rounded hover:bg-gray-50">
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={selectedRegions.includes(
                                    "서울 전체",
                                  )}
                                  onChange={() =>
                                    handleRegionToggle("서울 전체")
                                  }
                                  className="w-3.5 h-3.5 text-purple-600"
                                />
                                <span className="font-medium">서울전체</span>
                              </div>
                            </label>
                            {seoulDistricts.map((district) => (
                              <label
                                key={district}
                                className="flex items-center justify-between px-2 py-1 text-xs rounded hover:bg-gray-50"
                              >
                                <div className="flex items-center gap-1">
                                  <input
                                    type="checkbox"
                                    checked={selectedRegions.includes(
                                      `서울 ${district}`,
                                    )}
                                    onChange={() =>
                                      handleSeoulDistrictToggle(district)
                                    }
                                    className="w-3.5 h-3.5 text-purple-600"
                                  />
                                  <span>{district}</span>
                                </div>
                                <span className="text-xs text-gray-500">
                                  (615)
                                </span>
                              </label>
                            ))}
                          </>
                        ) : (
                          <div className="flex items-center justify-center col-span-3 py-12 text-sm text-gray-400">
                            지역을 선택하면 상세 지역이 표시됩니다
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 검색어 입력 탭 */}
              {activeTab === "search" && (
                <div>
                  <p className="mb-4 text-sm text-gray-600">
                    직무, 회사명, 키워드로 검색해보세요
                  </p>
                  <form onSubmit={handleSearch}>
                    <div className="relative">
                      <input
                        type="text"
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        placeholder="직업(직무) 또는 전문분야 입력"
                        className="w-full px-4 py-3 pr-24 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                      />
                      <button
                        type="submit"
                        className="absolute px-6 py-2 text-sm font-semibold text-white transition -translate-y-1/2 bg-purple-600 rounded-lg right-2 top-1/2 hover:bg-purple-700"
                      >
                        검색
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* 상태 필터 */}
            <div className="flex items-center gap-2 pt-6 mt-6 border-t">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
              >
                <option value="전체">전체 상태</option>
                <option value="ACTIVE">진행중</option>
                <option value="CLOSED">마감</option>
                <option value="EXPIRED">기간만료</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 mt-12 md:grid-cols-2 lg:grid-cols-3">
            {jobPostings.length === 0 ? (
              <div className="py-20 text-center text-gray-500 col-span-full">
                <div className="mb-4 text-4xl">📋</div>
                <div className="text-lg font-medium">공고가 없습니다</div>
                <div className="text-sm">다른 검색 조건으로 시도해보세요</div>
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
                    className="flex flex-col overflow-hidden transition bg-white border border-gray-300 shadow-sm rounded-xl hover:shadow-xl hover:border-purple-400 cursor-pointer"
                  >
                    {/* 로고 영역 */}
                    <div className="flex items-center justify-center h-12 bg-gradient-to-br from-gray-50 to-gray-100">
                      {job.logoUrl ? (
                        <img
                          src={job.logoUrl}
                          alt={job.companyName}
                          className="object-contain w-16 h-16"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://via.placeholder.com/150?text=No+Logo";
                          }}
                        />
                      ) : (
                        <div className="flex items-center justify-center w-16 h-16 text-2xl font-bold text-gray-400 bg-white rounded-lg">
                          {job.companyName?.charAt(0) || "회"}
                        </div>
                      )}
                    </div>

                    {/* 내용 영역 */}
                    <div className="flex flex-col flex-1 p-5">
                      {/* 직무명 */}
                      <h3
                        className="mb-2 text-lg font-bold text-gray-900 line-clamp-2 hover:text-purple-600"
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
                            className="object-cover w-full h-50"
                            onError={(e) => {
                              e.currentTarget.src =
                                "https://via.placeholder.com/400x200?text=No+Image";
                            }}
                          />
                        ) : (
                          <div className="flex items-center justify-center w-full h-32 bg-gradient-to-br from-purple-50 to-blue-50">
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

                      {/* 정보 태그 */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full">
                          <svg
                            className="w-3 h-3"
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
                          {job.location}
                        </span>
                        <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                          {formatExperience(
                            job.experienceMin,
                            job.experienceMax,
                          )}
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
                          <svg
                            className="w-4 h-4 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <span className="text-xs text-gray-600">
                            ~ {job.deadline || "상시채용"}
                          </span>
                        </div>
                        <span
                          className={`text-sm font-bold ${
                            daysLeft <= 7 ? "text-red-600" : "text-blue-600"
                          }`}
                        >
                          {daysLeft > 0 ? `D-${daysLeft}` : "마감"}
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
        </main>
      </div>
    </div>
  );
}
