import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import CompanyLeftSidebar from "../components/CompanyLeftSidebar";
import { useCompanyPageNavigation } from "../hooks/useCompanyPageNavigation";
import {
  getJobPostings,
  updateJobPostingStatus,
  type JobPostingListResponse,
} from "../../api/job";

export default function JobManagementPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { activeMenu, handleMenuClick } = useCompanyPageNavigation(
    "jobs",
    "jobs-sub-2"
  );

  const [selectedStatus, setSelectedStatus] = useState("전체");
  const [selectedRegion, setSelectedRegion] = useState("전체");
  const [searchQuery, setSearchQuery] = useState("");

  const [jobs, setJobs] = useState<JobPostingListResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 공고 목록 로드
  useEffect(() => {
    const loadJobPostings = async () => {
      if (!user?.companyId) {
        alert("기업 정보를 찾을 수 없습니다.");
        navigate("/company/login");
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await getJobPostings({
          page: 0,
          size: 1000,
        });

        // 현재 기업의 공고만 필터링
        const myJobs = response.content.filter(
          (job) => job.companyId === user.companyId
        );

        setJobs(myJobs);
      } catch (err: any) {
        console.error("공고 목록 조회 실패:", err);
        setError("공고 목록을 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadJobPostings();
  }, [user, navigate]);

  const handleNewJob = () => {
    navigate("/company/jobs/create");
  };

  const handleJobClick = (jobId: number) => {
    navigate(`/company/jobs/${jobId}`);
  };

  const handleApplicantsClick = (e: React.MouseEvent, job: JobPostingListResponse) => {
    e.stopPropagation(); // 카드 클릭 이벤트 방지
    navigate(`/company/applicants?jobId=${job.jobId}&jobTitle=${encodeURIComponent(job.title)}`);
  };

  const handleEdit = (jobId: number) => {
    navigate(`/company/jobs/edit/${jobId}`);
  };

  const handleClose = async (jobId: number) => {
    if (!user?.companyId) return;

    const job = jobs.find((j) => j.jobId === jobId);
    if (!job) return;

    if (job.status === "CLOSED") {
      alert("이미 마감된 공고입니다.");
      return;
    }

    const applicantCount = 0; // TODO: 실제 지원자 수 가져오기

    if (
      window.confirm(
        `"${job.title}" 공고를 마감하시겠습니까?\n\n` +
          `현재 지원자: ${applicantCount}명\n` +
          `마감 후에는 다시 활성화할 수 없습니다.`
      )
    ) {
      try {
        await updateJobPostingStatus(jobId, user.companyId, "CLOSED");
        alert("공고가 마감되었습니다.");

        // 목록 새로고침
        const response = await getJobPostings({
          page: 0,
          size: 1000,
        });
        const myJobs = response.content.filter(
          (job) => job.companyId === user.companyId
        );
        setJobs(myJobs);
      } catch (error: any) {
        console.error("공고 마감 실패:", error);
        alert(error.response?.data?.message || "공고 마감에 실패했습니다.");
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

  const calculateAverageScore = () => {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold text-gray-600">로딩 중...</div>
      </div>
    );
  }

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
            <h1 className="text-2xl font-bold">내 공고 관리</h1>
            <button
              onClick={handleNewJob}
              className="px-6 py-2 text-white transition bg-purple-600 rounded-lg hover:bg-purple-700"
            >
              + 새 공고 등록
            </button>
          </div>

          {error && (
            <div className="p-4 mb-6 text-red-700 bg-red-100 rounded-lg">
              {error}
            </div>
          )}

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

          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <div
                key={job.jobId}
                onClick={() => handleJobClick(job.jobId)}
                className="p-5 transition bg-white border border-gray-300 cursor-pointer rounded-lg shadow-sm hover:shadow-lg hover:border-purple-400"
              >
                <div className="flex items-center justify-between">
                  {/* 왼쪽: 공고 정보 */}
                  <div className="flex items-center flex-1 gap-6">
                    {/* 제목 & 상태 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900 truncate">
                          {job.title}
                        </h3>
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${getStatusColor(
                            job.status
                          )}`}
                        >
                          {getStatusText(job.status)}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          {formatExperience(job.experienceMin, job.experienceMax)}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {formatSalary(job.salaryMin, job.salaryMax)}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(job.createdAt).toLocaleDateString("ko-KR")}
                        </span>
                      </div>
                    </div>

                    {/* 통계 */}
                    <div className="flex items-center gap-6 px-6 py-3 border-l border-r border-gray-200">
                      <button
                        onClick={(e) => handleApplicantsClick(e, job)}
                        className="text-center transition group hover:scale-105"
                      >
                        <div className="text-2xl font-bold text-purple-600 group-hover:text-purple-700">
                          {job.applicantCount || 0}
                        </div>
                        <div className="text-xs text-gray-500 group-hover:text-purple-600">
                          지원자 →
                        </div>
                      </button>
                      <div className="text-center">
                        <div className="text-xl font-bold text-gray-700">
                          {job.viewCount || 0}
                        </div>
                        <div className="text-xs text-gray-500">조회수</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-gray-700">
                          {job.bookmarkCount || 0}
                        </div>
                        <div className="text-xs text-gray-500">북마크</div>
                      </div>
                    </div>
                  </div>

                  {/* 오른쪽: 액션 버튼 */}
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(job.jobId);
                      }}
                      className="px-4 py-2 text-sm font-medium text-gray-700 transition bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                      수정
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClose(job.jobId);
                      }}
                      disabled={
                        job.status === "CLOSED" || job.status === "EXPIRED"
                      }
                      className={`px-4 py-2 text-sm font-medium text-white transition rounded-lg ${
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
              </div>
            ))}
          </div>

          {filteredJobs.length === 0 && !loading && (
            <div className="py-20 text-center text-gray-500">
              <div className="mb-4 text-4xl">📭</div>
              <div className="text-lg font-medium">
                {jobs.length === 0
                  ? "등록된 공고가 없습니다"
                  : "검색 결과가 없습니다"}
              </div>
              <div className="text-sm">
                {jobs.length === 0
                  ? "새 공고를 등록해주세요"
                  : "다른 조건으로 검색해보세요"}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
