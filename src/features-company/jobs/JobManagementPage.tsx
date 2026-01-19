import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";
import CompanyLeftSidebar from "../components/CompanyLeftSidebar";
import { useCompanyPageNavigation } from "../hooks/useCompanyPageNavigation";

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

export default function JobManagementPage() {
  const navigate = useNavigate();
  const { activeMenu, handleMenuClick } = useCompanyPageNavigation("jobs", "jobs-sub-1");
  
  const [selectedStatus, setSelectedStatus] = useState("전체");
  const [selectedRegion, setSelectedRegion] = useState("전체");
  const [searchQuery, setSearchQuery] = useState("");

  const { businessJobs, updateBusinessJob } = useApp();
  const jobs = businessJobs;

  const handleNewJob = () => {
    navigate("/company/jobs/create");
  };

  const handleJobClick = (jobId: number) => {
    navigate(`/company/jobs/${jobId}`);
  };

  const handleEdit = (jobId: number) => {
    const job = jobs.find((j) => j.id === jobId);
    if (!job) return;

    if (window.confirm(`"${job.title}" 공고를 수정하시겠습니까?`)) {
      console.log(`공고 ${jobId} 수정`);
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
      const updatedJob = jobs.find((j) => j.id === jobId);
      if (updatedJob) {
        updateBusinessJob(jobId, { ...updatedJob, status: "CLOSED" as const });
        alert("공고가 마감되었습니다.");
      }
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

  const calculateAverageScore = (applicantCount: number) => {
    if (applicantCount === 0) return 0;
    return (80 + Math.random() * 15).toFixed(1);
  };

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
      <div className="flex px-4 py-8 mx-auto max-w-7xl">
        {/* 왼쪽 사이드바 */}
        <CompanyLeftSidebar
          activeMenu={activeMenu}
          onMenuClick={handleMenuClick}
        />

        {/* 메인 컨텐츠 */}
        <div className="flex-1 pl-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">공고 관리</h1>
            <button
              onClick={handleNewJob}
              className="px-6 py-2 text-white transition bg-purple-600 rounded-lg hover:bg-purple-700"
            >
              + 새 공고 등록
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                상태
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                onClick={() => handleJobClick(job.id)}
                className="p-6 transition bg-white border border-gray-200 cursor-pointer rounded-xl hover:shadow-lg"
              >
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

                <div className="mb-4 text-sm text-gray-500">
                  등록일: {job.created_at}
                </div>

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

                <div className="pt-4 mb-4 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-purple-600">
                        {job.applicant_count}
                      </div>
                      <div className="text-sm text-gray-500">지원자</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">
                        {calculateAverageScore(job.applicant_count)}
                      </div>
                      <div className="text-sm text-gray-500">평균 점수</div>
                    </div>
                  </div>
                </div>

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

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(job.id);
                    }}
                    className="px-4 py-2 text-gray-700 transition bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    수정
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClose(job.id);
                    }}
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

          {filteredJobs.length === 0 && (
            <div className="py-20 text-center text-gray-500">
              <div className="mb-4 text-4xl">📭</div>
              <div className="text-lg font-medium">검색 결과가 없습니다</div>
              <div className="text-sm">다른 조건으로 검색해보세요</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
