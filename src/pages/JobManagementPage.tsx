import { useState } from "react";
import Footer from "../components/Footer";

interface Job {
  id: number;
  title: string;
  status: "ACTIVE" | "CLOSED" | "EXPIRED";
  job_category: string;
  location: string;
  experience_min?: number;
  experience_max?: number;
  salary_min?: number;
  salary_max?: number;
  deadline: string;
  view_count: number;
  applicant_count: number;
  bookmark_count: number;
  created_at: string;
}

interface JobManagementPageProps {
  onNewJobClick?: () => void;
  onLogoClick?: () => void;
}

export default function JobManagementPage({
  onNewJobClick,
  onLogoClick,
}: JobManagementPageProps) {
  const [selectedStatus, setSelectedStatus] = useState("전체");
  const [selectedRegion, setSelectedRegion] = useState("전체");
  const [searchQuery, setSearchQuery] = useState("");
  const [jobs, setJobs] = useState<Job[]>([
    {
      id: 1,
      title: "프론트엔드 개발자",
      status: "ACTIVE",
      job_category: "프론트엔드 개발자",
      location: "서울 강남구",
      experience_min: 5,
      experience_max: undefined,
      salary_min: 6000,
      salary_max: 6000,
      deadline: "2024-12-31",
      view_count: 120,
      applicant_count: 42,
      bookmark_count: 15,
      created_at: "2024-12-01",
    },
    {
      id: 2,
      title: "백엔드 개발자",
      status: "ACTIVE",
      job_category: "백엔드 개발자",
      location: "서울 강북구",
      experience_min: 3,
      experience_max: undefined,
      salary_min: 5000,
      salary_max: 7000,
      deadline: "2024-12-28",
      view_count: 98,
      applicant_count: 38,
      bookmark_count: 12,
      created_at: "2024-11-28",
    },
    {
      id: 3,
      title: "풀스택 개발자",
      status: "ACTIVE",
      job_category: "풀스택 개발자",
      location: "서울 송파구",
      experience_min: 3,
      experience_max: undefined,
      salary_min: 4500,
      salary_max: 6500,
      deadline: "2024-12-25",
      view_count: 156,
      applicant_count: 29,
      bookmark_count: 20,
      created_at: "2024-11-20",
    },
    {
      id: 4,
      title: "DevOps 엔지니어",
      status: "CLOSED",
      job_category: "DevOps",
      location: "서울 마포구",
      experience_min: 5,
      experience_max: undefined,
      salary_min: 6500,
      salary_max: 8500,
      deadline: "2024-11-30",
      view_count: 245,
      applicant_count: 67,
      bookmark_count: 32,
      created_at: "2024-11-15",
    },
  ]);

  const handleNewJob = () => {
    if (onNewJobClick) {
      onNewJobClick();
    } else {
      console.log("새 공고 등록 클릭");
    }
  };

  const handleEdit = (jobId: number) => {
    const job = jobs.find((j) => j.id === jobId);
    if (!job) return;

    if (window.confirm(`"${job.title}" 공고를 수정하시겠습니까?`)) {
      console.log(`공고 ${jobId} 수정`);
      // 여기에 수정 페이지로 이동하는 로직 추가
      // onEditJobClick?.(jobId);
    }
  };

  const handleClose = (jobId: number) => {
    const job = jobs.find((j) => j.id === jobId);
    if (!job) return;

    if (job.status === "CLOSED") {
      alert("이미 마감된 공고입니다.");
      return;
    }

    if (
      window.confirm(
        `"${job.title}" 공고를 마감하시겠습니까?\n\n` +
          `현재 지원자: ${job.applicant_count}명\n` +
          `마감 후에는 다시 활성화할 수 없습니다.`
      )
    ) {
      // 상태를 CLOSED로 변경
      setJobs(
        jobs.map((j) =>
          j.id === jobId ? { ...j, status: "CLOSED" as const } : j
        )
      );
      alert("공고가 마감되었습니다.");
    }
  };

  const handleLogoClick = () => {
    if (onLogoClick) {
      onLogoClick();
    } else {
      console.log("메인 페이지로 이동");
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "진행중";
      case "CLOSED":
        return "마감";
      case "EXPIRED":
        return "기간만료";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-700";
      case "CLOSED":
        return "bg-gray-100 text-gray-600";
      case "EXPIRED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-600";
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

  // 평균 점수 계산 (임시로 랜덤 값 사용)
  const calculateAverageScore = (applicantCount: number) => {
    if (applicantCount === 0) return 0;
    return (80 + Math.random() * 15).toFixed(1);
  };

  // 필터링
  const filteredJobs = jobs.filter((job) => {
    const statusMatch =
      selectedStatus === "전체" ||
      (selectedStatus === "진행중" && job.status === "ACTIVE") ||
      (selectedStatus === "마감" && job.status === "CLOSED") ||
      (selectedStatus === "기간만료" && job.status === "EXPIRED");

    const regionMatch =
      selectedRegion === "전체" || 
      (selectedRegion === "서울 전체" && job.location.startsWith("서울")) ||
      job.location === selectedRegion;

    const searchMatch =
      searchQuery === "" ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase());

    return statusMatch && regionMatch && searchMatch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-4 py-4 mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            {/* 로고 */}
            <div
              onClick={handleLogoClick}
              className="flex items-center space-x-2 transition-opacity cursor-pointer hover:opacity-80"
            >
              <span className="text-2xl font-bold text-blue-600">Next </span>
              <span className="text-2xl font-bold text-blue-800">Enter</span>
            </div>

            {/* 네비게이션 */}
            <nav className="flex space-x-8">
              <button className="px-4 py-2 text-gray-700 hover:text-blue-600">
                ■ 채용공고
              </button>
              <button className="px-4 py-2 text-gray-700 hover:text-blue-600">
                자료
              </button>
              <button className="px-4 py-2 text-gray-700 hover:text-blue-600">
                홍보
              </button>
            </nav>

            {/* 오른쪽 버튼 */}
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 text-gray-700 hover:text-blue-600">
                로그인
              </button>
              <button className="px-4 py-2 text-gray-700 hover:text-blue-600">
                회원가입
              </button>
              <button
                onClick={handleLogoClick}
                className="px-4 py-2 transition bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                개인 회원
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <div className="px-4 py-8 mx-auto max-w-7xl">
        {/* 타이틀과 버튼 */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">공고 관리</h1>
          <button
            onClick={handleNewJob}
            className="px-6 py-2 text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            + 새 공고 등록
          </button>
        </div>

        {/* 필터 섹션 */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              상태
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="전체">전체</option>
              <option value="진행중">진행중</option>
              <option value="마감">마감</option>
              <option value="기간만료">기간만료</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              지역
            </label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="전체">전체</option>
              <option value="서울 전체">서울 전체</option>
              <option value="서울 강남구">서울 강남구</option>
              <option value="서울 강동구">서울 강동구</option>
              <option value="서울 강북구">서울 강북구</option>
              <option value="서울 강서구">서울 강서구</option>
              <option value="서울 관악구">서울 관악구</option>
              <option value="서울 광진구">서울 광진구</option>
              <option value="서울 구로구">서울 구로구</option>
              <option value="서울 금천구">서울 금천구</option>
              <option value="서울 노원구">서울 노원구</option>
              <option value="서울 도봉구">서울 도봉구</option>
              <option value="서울 동대문구">서울 동대문구</option>
              <option value="서울 동작구">서울 동작구</option>
              <option value="서울 마포구">서울 마포구</option>
              <option value="서울 서대문구">서울 서대문구</option>
              <option value="서울 서초구">서울 서초구</option>
              <option value="서울 성동구">서울 성동구</option>
              <option value="서울 성북구">서울 성북구</option>
              <option value="서울 송파구">서울 송파구</option>
              <option value="서울 양천구">서울 양천구</option>
              <option value="서울 영등포구">서울 영등포구</option>
              <option value="서울 용산구">서울 용산구</option>
              <option value="서울 은평구">서울 은평구</option>
              <option value="서울 종로구">서울 종로구</option>
              <option value="서울 중구">서울 중구</option>
              <option value="서울 중랑구">서울 중랑구</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              검색
            </label>
            <input
              type="text"
              placeholder="공고명으로 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* 공고 그리드 */}
        <div className="grid grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="p-6 transition bg-white border border-gray-200 rounded-xl hover:shadow-lg"
            >
              {/* 제목과 상태 */}
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-bold">{job.title}</h3>
                <span
                  className={`px-3 py-1 text-sm font-medium rounded ${getStatusColor(
                    job.status
                  )}`}
                >
                  {getStatusText(job.status)}
                </span>
              </div>

              {/* 등록일 */}
              <div className="mb-4 text-sm text-gray-500">
                등록일: {job.created_at}
              </div>

              {/* 상세 정보 */}
              <div className="mb-4 space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-red-500">●</span>
                  <span className="text-gray-700">{job.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500">📋</span>
                  <span className="text-gray-700">
                    {formatExperience(job.experience_min, job.experience_max)}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-500">💰</span>
                  <span className="text-gray-700">
                    {formatSalary(job.salary_min, job.salary_max)}
                  </span>
                </div>
              </div>

              {/* 지원자 통계 */}
              <div className="pt-4 mb-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {job.applicant_count}
                    </div>
                    <div className="text-sm text-gray-500">지원자</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {calculateAverageScore(job.applicant_count)}
                    </div>
                    <div className="text-sm text-gray-500">평균 점수</div>
                  </div>
                </div>
              </div>

              {/* 추가 통계 */}
              <div className="flex justify-around py-2 mb-4 text-xs text-gray-600 rounded-lg bg-gray-50">
                <div className="text-center">
                  <div className="font-semibold">조회수</div>
                  <div>{job.view_count}</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">북마크</div>
                  <div>{job.bookmark_count}</div>
                </div>
              </div>

              {/* 버튼들 */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleEdit(job.id)}
                  className="px-4 py-2 text-gray-700 transition bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  수정
                </button>
                <button
                  onClick={() => handleClose(job.id)}
                  disabled={job.status === "CLOSED" || job.status === "EXPIRED"}
                  className={`px-4 py-2 text-white transition rounded-lg ${
                    job.status === "CLOSED" || job.status === "EXPIRED"
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-red-500 hover:bg-red-600"
                  }`}
                >
                  {job.status === "CLOSED" || job.status === "EXPIRED"
                    ? "마감됨"
                    : "마감"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 검색 결과 없음 */}
        {filteredJobs.length === 0 && (
          <div className="py-20 text-center text-gray-500">
            <div className="mb-4 text-4xl">📭</div>
            <div className="text-lg font-medium">검색 결과가 없습니다</div>
            <div className="text-sm">다른 조건으로 검색해보세요</div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
