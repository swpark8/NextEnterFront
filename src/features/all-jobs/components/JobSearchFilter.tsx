import { useState } from "react";

export interface SearchFilters {
  keyword: string;
  regions: string[];
  jobCategories: string[];
  status: string;
}

interface JobSearchFilterProps {
  onFilterChange: (filters: SearchFilters) => void;
}

export default function JobSearchFilter({
  onFilterChange,
}: JobSearchFilterProps) {
  const [activeTab, setActiveTab] = useState<"job" | "region">("job");

  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState("전체");
  const [expandedRegion, setExpandedRegion] = useState<string | null>(null);

  // ✅ 모든 지역의 하위지역 데이터
  const regionDistricts: Record<string, string[]> = {
    "서울": [
      "강남구", "강동구", "강북구", "강서구", "관악구", "광진구",
      "구로구", "금천구", "노원구", "도봉구", "동대문구", "동작구",
      "마포구", "서대문구", "서초구", "성동구", "성북구", "송파구",
      "양천구", "영등포구", "용산구", "은평구", "종로구", "중구", "중랑구"
    ],
    "부산": [
      "강서구", "금정구", "기장군", "남구", "동구", "동래구",
      "부산진구", "북구", "사상구", "사하구", "서구", "수영구",
      "연제구", "영도구", "해운대구", "중구"
    ],
    "대구": [
      "남구", "달서구", "동구", "북구",
      "서구", "수성구", "중구", "달성군"
    ],
    "인천": [
      "강화구", "계양구", "미추홀구", "남동구", "동구",
      "부평구", "서구", "연수구", "옹진군", "중구"
    ],
    "광주": [
      "광산구", "남구", "동구", "북구", "서구"
    ],
    "대전": [
      "대덕구", "동구", "서구", "유성구", "중구"
    ],
    "울산": [
      "남구", "동구", "북구", "중구", "울주군"
    ],
    "경기": [
      "가평시", "고양시", "과천시", "광명시", "광주시", "구리시",
      "군포시", "김포시", "남양주시", "동두천시", "부천시", "성남시",
      "수원시", "시흥시", "안산시", "안성시", "안양시", "양주시",
      "여주시", "오산시", "용인시", "의정부시", "이천시", "파주시",
      "평택시", "포천시", "하남시", "화성시", "가평군", "연천군", "양평군"
    ],
    "강원": [
      "강릉시", "동해시", "삼척시", "속초시", "원주시", "춘천시",
      "태백시", "고성군", "양구군", "영월군", "평창군", "정선군",
      "철원군", "화천군", "양양군", "인제군", "황성군", "가평군"
    ],
    "경남": [
      "창원시", "진주시", "통영시", "사천시", "김해시", "밀양시",
      "거제시", "양산시", "의령군", "함안군", "창녕군", "고성군",
      "남해군", "하동군", "산청군", "함양군", "거창군", "합천군"
    ],
    "경북": [
      "포항시", "경주시", "김천시", "안동시", "구미시", "영주시",
      "영천시", "상주시", "문경시", "경산시", "군위군", "의성군",
      "청송군", "영양군", "영덕군", "청도군", "고령군", "성주군",
      "칠곡군", "예천군", "봉화군", "울진군", "울릉군"
    ],
    "전남": [
      "목포시", "여수시", "순천시", "나주시", "광양시",
      "담양군", "곱성군", "구례군", "고흥군", "보성군",
      "화순군", "장흥군", "강진군", "해남군", "영암군",
      "무안군", "함평군", "영광군", "장성군", "완도군",
      "진도군", "신안군"
    ],
    "전북": [
      "전주시", "군산시", "익산시", "정읍시", "남원시",
      "김제시", "완주군", "진안군", "무주군", "고창군",
      "부안군", "순창군", "임실군", "장수군"
    ],
    "충남": [
      "천안시", "공주시", "보령시", "아산시", "서산시",
      "논산시", "계룡시", "당진시", "금산군", "부여군",
      "서천군", "청양군", "홍성군", "예산군", "태안군"
    ],
    "충북": [
      "청주시", "충주시", "제천시", "보은군", "옥천군",
      "영동군", "진천군", "괴산군", "음성군", "단양군", "증평군"
    ],
    "제주": [
      "제주시", "서귀포시"
    ]
  };

  // ✅ 랜덤 공고 수 생성 함수
  const getRandomJobCount = () => {
    return Math.floor(Math.random() * 900) + 100; // 100~999 사이
  };

  const handleApplyFilter = () => {
    onFilterChange({
      keyword: searchKeyword,
      regions: selectedRegions,
      jobCategories: selectedCategories,
      status: selectedStatus,
    });
  };

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

  // ✅ 하위지역 토글 (범용적)
  const handleDistrictToggle = (regionName: string, district: string) => {
    handleRegionToggle(`${regionName} ${district}`);
  };

  const handleReset = () => {
    setSelectedRegions([]);
    setSelectedCategories([]);
    setSearchKeyword("");
    setSelectedStatus("전체");

    onFilterChange({
      keyword: "",
      regions: [],
      jobCategories: [],
      status: "전체",
    });
  };

  return (
    <div className="p-8 mb-8 bg-white shadow-lg rounded-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">공고 검색</h2>
      </div>

      {/* 탭 + 검색창 한 줄 배치 - 동일한 너비 */}
      <div className="flex w-full border-b border-gray-200">
        {/* 직업 선택 탭 */}
        <button
          onClick={() => setActiveTab("job")}
          // 👇 [수정] relative 추가, border-b-2 제거
          className={`relative flex-1 py-3 text-center font-semibold transition ${
            activeTab === "job"
              ? "text-blue-600"
              : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
          }`}
        >
          직업 선택
          {/* 👇 [추가] 둥근 밑줄 div */}
          {activeTab === "job" && (
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-blue-500 rounded-full" />
          )}
        </button>

        {/* 지역 선택 탭 */}
        <button
          onClick={() => setActiveTab("region")}
          // 👇 [수정] relative 추가, border-b-2 제거
          className={`relative flex-1 py-3 text-center font-semibold transition ${
            activeTab === "region"
              ? "text-blue-600"
              : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
          }`}
        >
          지역 선택
          {/* 👇 [추가] 둥근 밑줄 div */}
          {activeTab === "region" && (
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-blue-500 rounded-full" />
          )}
        </button>

        {/* 검색창 - 탭처럼 보이게 */}
        <div className="relative flex-1">
          <form onSubmit={handleSearchEnter} className="h-full">
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="직업(직무) 또는 전문분야 입력"
              className="w-full h-full px-4 py-3 pr-24 text-sm text-left border border-blue-500 rounded-md focus:outline-none focus:border-blue-600"
            />
            <button
              type="submit"
              className="absolute px-5 py-2 text-sm font-semibold text-white transition -translate-y-1/2 bg-blue-600 rounded right-2 top-1/2 hover:bg-blue-700"
            >
              검색
            </button>
          </form>
        </div>
      </div>

      {/* 탭 컨텐츠 */}
      <div className="mt-8">
        {/* 직업 선택 탭 */}
        {activeTab === "job" && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <p className="text-sm text-gray-600">
                원하시는 직무를 선택해주세요
              </p>
              <button
                onClick={() => setSelectedCategories([])}
                className="text-sm text-blue-600 hover:text-blue-700"
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
                      ? "bg-blue-50 border-blue-600 text-blue-600"
                      : "bg-white border-gray-300 text-gray-700 hover:border-blue-400"
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
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  전체해제
                </button>
              </div>
            </div>

            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="지역명 입력"
                  className="w-full px-4 py-2 pl-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
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
                    const hasDistricts = regionDistricts[region.name]; // ✅ 하위지역 있는지 확인
                    const isSelected =
                      expandedRegion === region.name ||
                      selectedRegions.includes(region.name) ||
                      selectedRegions.some((r) => r.startsWith(`${region.name} `)); // ✅ 모든 지역 대상

                    return (
                      <button
                        key={region.name}
                        onClick={() => {
                          if (hasDistricts) {
                            // 하위지역 있으면 펼치기/접기
                            if (expandedRegion === region.name) {
                              setExpandedRegion(null);
                            } else {
                              setExpandedRegion(region.name);
                              // 전체 선택 추가
                              if (!selectedRegions.includes(`${region.name} 전체`)) {
                                setSelectedRegions((prev) => [...prev, `${region.name} 전체`]);
                              }
                            }
                          } else {
                            // 하위지역 없으면 (세종) 그냥 선택
                            setExpandedRegion(null);
                            handleRegionToggle(region.name);
                          }
                        }}
                        className={`flex items-center justify-between w-full px-2 py-1 text-xs text-left transition rounded ${
                          isSelected
                            ? "bg-blue-100 text-blue-700 font-semibold"
                            : "hover:bg-white"
                        }`}
                      >
                        <span className="font-medium">{region.name}</span>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-gray-500">
                            ({region.count})
                          </span>
                          {hasDistricts && (
                            <svg
                              className={`w-3 h-3 transition-transform ${expandedRegion === region.name ? "rotate-90" : ""}`}
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

              <div className="p-4 bg-white border border-gray-200 rounded-lg">
                <h3 className="mb-3 text-sm font-semibold text-gray-700">
                  {expandedRegion ? `${expandedRegion} 상세 지역` : "상세 지역"}
                </h3>
                <div className="grid grid-cols-3 overflow-y-auto gap-x-2 gap-y-1 max-h-96">
                  {expandedRegion && regionDistricts[expandedRegion] ? (
                    <>
                      {/* 전체 선택 */}
                      <label className="flex items-center justify-between col-span-3 px-2 py-1 pb-2 mb-1 text-xs border-b border-gray-200 rounded hover:bg-gray-50">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedRegions.includes(`${expandedRegion} 전체`)}
                            onChange={() => handleRegionToggle(`${expandedRegion} 전체`)}
                            className="w-3.5 h-3.5 text-blue-600"
                          />
                          <span className="font-medium">{expandedRegion}전체</span>
                        </div>
                      </label>
                      {/* 하위지역 목록 */}
                      {regionDistricts[expandedRegion].map((district) => (
                        <label
                          key={district}
                          className="flex items-center justify-between px-2 py-1 text-xs rounded hover:bg-gray-50"
                        >
                          <div className="flex items-center gap-1">
                            <input
                              type="checkbox"
                              checked={selectedRegions.includes(
                                `${expandedRegion} ${district}`,
                              )}
                              onChange={() =>
                                handleDistrictToggle(expandedRegion, district)
                              }
                              className="w-3.5 h-3.5 text-blue-600"
                            />
                            <span>{district}</span>
                          </div>
                          <span className="text-xs text-gray-500">({getRandomJobCount()})</span>
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
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-100 rounded-full"
              >
                <span>{region}</span>
                <button
                  onClick={() => handleRegionToggle(region)}
                  className="p-0.5 hover:bg-blue-100 rounded-full transition-colors"
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
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-100 rounded-full"
              >
                <span>{cat}</span>
                <button
                  onClick={() =>
                    setSelectedCategories((prev) =>
                      prev.filter((c) => c !== cat),
                    )
                  }
                  className="p-0.5 hover:bg-blue-100 rounded-full transition-colors"
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
              <div className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-100 rounded-full">
                <span>
                  {selectedStatus === "ACTIVE"
                    ? "진행중"
                    : selectedStatus === "CLOSED"
                      ? "마감"
                      : "기간만료"}
                </span>
                <button
                  onClick={() => setSelectedStatus("전체")}
                  className="p-0.5 hover:bg-blue-100 rounded-full transition-colors"
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
              className="px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
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
