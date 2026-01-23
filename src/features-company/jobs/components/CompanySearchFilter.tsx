import { useState } from "react";

// 필터 상태 타입 정의
export interface CompanySearchFilters {
  keyword: string;
  regions: string[];
  jobCategories: string[];
  status: string;
}

interface CompanyJobSearchFilterProps {
  onFilterChange: (filters: CompanySearchFilters) => void;
}

export default function CompanyJobSearchFilter({
  onFilterChange,
}: CompanyJobSearchFilterProps) {
  // 상태 관리
  const [activeTab, setActiveTab] = useState<"job" | "region" | "search">(
    "job",
  );

  // 입력값 상태 (부모 전송 전)
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState("전체");
  const [expandedRegion, setExpandedRegion] = useState<string | null>(null);

  // 서울 구 목록 데이터
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

  // 검색 버튼 클릭 시 실행되는 함수
  const handleApplyFilter = () => {
    onFilterChange({
      keyword: searchKeyword,
      regions: selectedRegions,
      jobCategories: selectedCategories,
      status: selectedStatus,
    });
  };

  // 엔터키 입력 시 검색 적용
  const handleSearchEnter = (e: React.FormEvent) => {
    e.preventDefault();
    handleApplyFilter();
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  const handleRegionToggle = (region: string) => {
    setSelectedRegions((prev) =>
      prev.includes(region)
        ? prev.filter((r) => r !== region)
        : [...prev, region],
    );
  };

  const handleSeoulDistrictToggle = (district: string) => {
    handleRegionToggle(`서울 ${district}`);
  };

  // 초기화 핸들러
  const handleReset = () => {
    setSelectedRegions([]);
    setSelectedCategories([]);
    setSearchKeyword("");
    setSelectedStatus("전체");

    // 초기화는 즉시 반영
    onFilterChange({
      keyword: "",
      regions: [],
      jobCategories: [],
      status: "전체",
    });
  };

  return (
    <div className="p-8 bg-white shadow-lg rounded-2xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">전체 공고 목록</h1>
        {/* 공고 개수는 부모에서 처리하므로 여기선 텍스트만 유지하거나 제거 가능 */}
        <p className="text-sm text-gray-500">공고 검색 및 필터</p>
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
                    const isSelected =
                      expandedRegion === region.name ||
                      selectedRegions.includes(region.name) ||
                      (region.name === "서울" &&
                        selectedRegions.some((r) => r.includes("서울")));

                    return (
                      <button
                        key={region.name}
                        onClick={() => {
                          if (region.name === "서울") {
                            if (expandedRegion === "서울") {
                              setExpandedRegion(null);
                              setSelectedRegions((prev) =>
                                prev.filter((r) => r !== "서울 전체"),
                              );
                            } else {
                              setExpandedRegion("서울");
                              setSelectedRegions((prev) =>
                                prev.includes("서울 전체")
                                  ? prev
                                  : [...prev, "서울 전체"],
                              );
                            }
                          } else {
                            setExpandedRegion(null);
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
                                expandedRegion === "서울" ? "rotate-90" : ""
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
                  {expandedRegion === "서울" ? "서울 상세 지역" : "상세 지역"}
                </h3>
                <div className="grid grid-cols-3 overflow-y-auto gap-x-2 gap-y-1 max-h-96">
                  {expandedRegion === "서울" ? (
                    <>
                      <label className="flex items-center justify-between col-span-3 px-2 py-1 pb-2 mb-1 text-xs border-b border-gray-200 rounded hover:bg-gray-50">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedRegions.includes("서울 전체")}
                            onChange={() => handleRegionToggle("서울 전체")}
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
                          <span className="text-xs text-gray-500">(615)</span>
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
            <form onSubmit={handleSearchEnter}>
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

      {/* 하단 액션 바 */}
      <div className="pt-4 mt-6 space-y-4 border-t border-gray-100">
        {/* 선택된 필터 태그 */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-500">선택된 필터</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {selectedRegions.map((region) => (
              <div
                key={region}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-purple-700 bg-purple-50 border border-purple-100 rounded-full"
              >
                <span>{region}</span>
                <button
                  onClick={() => handleRegionToggle(region)}
                  className="p-0.5 hover:bg-purple-100 rounded-full transition-colors"
                >
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}

            {selectedCategories.map((cat) => (
              <div
                key={cat}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-purple-700 bg-purple-50 border border-purple-100 rounded-full"
              >
                <span>{cat}</span>
                <button
                  onClick={() =>
                    setSelectedCategories((prev) =>
                      prev.filter((c) => c !== cat),
                    )
                  }
                  className="p-0.5 hover:bg-purple-100 rounded-full transition-colors"
                >
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}

            {selectedStatus !== "전체" && (
              <div className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-purple-700 bg-purple-50 border border-purple-100 rounded-full">
                <span>{selectedStatus}</span>
                <button
                  onClick={() => setSelectedStatus("전체")}
                  className="p-0.5 hover:bg-purple-100 rounded-full transition-colors"
                >
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 하단: 상태 필터 + 조건 검색하기 버튼 + 초기화 버튼 */}
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-3">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
            >
              <option value="전체">전체 상태</option>
              <option value="ACTIVE">진행중</option>
              <option value="CLOSED">마감</option>
              <option value="EXPIRED">기간만료</option>
            </select>

            <button
              onClick={handleApplyFilter}
              className="px-8 py-3 text-sm font-bold text-white transition-transform bg-gray-900 rounded-lg shadow-lg hover:bg-black active:scale-95"
            >
              조건 검색하기
            </button>
          </div>

          <button
            onClick={handleReset}
            className="text-xs text-gray-400 underline hover:text-gray-600"
          >
            초기화
          </button>
        </div>
      </div>
    </div>
  );
}
