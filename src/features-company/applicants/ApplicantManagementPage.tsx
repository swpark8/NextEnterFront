import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import CompanyLeftSidebar from "../components/CompanyLeftSidebar";
import { useCompanyPageNavigation } from "../hooks/useCompanyPageNavigation";
import {
  getApplies,
  updateApplyStatus,
  type ApplyListResponse,
} from "../../api/apply";
import { getJobPostings, type JobPostingListResponse } from "../../api/job";
import { JOB_CATEGORIES } from "../../constants/jobConstants";

export default function ApplicantManagementPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  // URL에서 jobId와 jobTitle 가져오기
  const urlJobId = searchParams.get("jobId");
  const urlJobTitle = searchParams.get("jobTitle");
  const reloadParam = searchParams.get('reload'); 

  const { activeMenu, handleMenuClick } = useCompanyPageNavigation(
    "applicants",
    "applicants-sub-1",
  );

  const [selectedJobPosting, setSelectedJobPosting] = useState<string>(
    urlJobTitle ? decodeURIComponent(urlJobTitle) : "전체",
  );
  const [selectedJobCategory, setSelectedJobCategory] = useState("전체");
  const [experienceRange, setExperienceRange] = useState("전체");

  const [loading, setLoading] = useState(true);
  const [applicants, setApplicants] = useState<ApplyListResponse[]>([]);
  const [jobPostings, setJobPostings] = useState<JobPostingListResponse[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // 화면 맨 위로 올림
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 공고 목록 로드
  useEffect(() => {
    const loadJobPostings = async () => {
      if (!user?.companyId) return;

      try {
        const response = await getJobPostings({
          page: 0,
          size: 100,
        });

        // 해당 기업의 공고만 필터링
        const myJobs = response.content.filter(
          (job) => job.companyId === user.companyId,
        );
        setJobPostings(myJobs);
      } catch (error: any) {
        console.error("공고 목록 조회 실패:", error);
      }
    };

    loadJobPostings();
  }, [user?.companyId, reloadParam]);

  // 지원자 목록 로드
  useEffect(() => {
    const loadApplicants = async () => {
      if (!user?.companyId) {
        alert("기업 정보를 찾을 수 없습니다.");
        navigate("/company/login");
        return;
      }

      try {
        setLoading(true);

        const params: any = {
          page: currentPage,
          size: 100,
        };

        // 특정 공고가 선택된 경우
        if (selectedJobPosting !== "전체") {
          const selectedJob = jobPostings.find(
            (job) => job.title === selectedJobPosting,
          );
          if (selectedJob) {
            params.jobId = selectedJob.jobId;
          }
        }

        const response = await getApplies(user.companyId, params);
        setApplicants(response.content);
        setTotalPages(response.totalPages);
      } catch (error: any) {
        console.error("지원자 목록 조회 실패:", error);
        alert(
          error.response?.data?.message ||
            "지원자 목록을 불러오는데 실패했습니다.",
        );
      } finally {
        setLoading(false);
      }
    };

    if (user?.companyId) {
      loadApplicants();
    }
  }, [currentPage, user, navigate, selectedJobPosting, jobPostings, reloadParam]);

  const handleAccept = async (applyId: number) => {
    if (!user?.companyId) return;

    if (window.confirm("이 지원자를 합격 처리하시겠습니까?")) {
      try {
        await updateApplyStatus(applyId, user.companyId, {
          status: "ACCEPTED",
        });
        alert("합격 처리되었습니다.");

        // 목록 새로고침
        const response = await getApplies(user.companyId, {
          page: currentPage,
          size: 100,
        });
        setApplicants(response.content);
      } catch (error: any) {
        console.error("상태 변경 실패:", error);
        alert(error.response?.data?.message || "상태 변경에 실패했습니다.");
      }
    }
  };

  const handleReject = async (applyId: number) => {
    if (!user?.companyId) return;

    if (window.confirm("이 지원자를 불합격 처리하시겠습니까?")) {
      try {
        await updateApplyStatus(applyId, user.companyId, {
          status: "REJECTED",
        });
        alert("불합격 처리되었습니다.");

        // 목록 새로고침
        const response = await getApplies(user.companyId, {
          page: currentPage,
          size: 100,
        });
        setApplicants(response.content);
      } catch (error: any) {
        console.error("상태 변경 실패:", error);
        alert(error.response?.data?.message || "상태 변경에 실패했습니다.");
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";
      case "REVIEWING":
        return "bg-blue-100 text-blue-700";
      case "ACCEPTED":
        return "bg-green-100 text-green-700";
      case "REJECTED":
        return "bg-red-100 text-red-700";
      case "CANCELED":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "대기중";
      case "REVIEWING":
        return "검토중";
      case "ACCEPTED":
        return "합격";
      case "REJECTED":
        return "불합격";
      case "CANCELED":
        return "면접거절";
      default:
        return status;
    }
  };

  const handleApplicantClick = (applicantId: number) => {
    navigate(`/company/applicants/${applicantId}`);
  };

  const handleJobPostingClick = (jobTitle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedJobPosting(jobTitle);
  };

  // 클라이언트 측 필터링
  const filteredApplicants = applicants.filter((applicant) => {
    const jobCategoryMatch =
      selectedJobCategory === "전체" ||
      applicant.jobCategory === selectedJobCategory;

    const expYears = parseInt(applicant.experience) || 0;
    const experienceMatch =
      experienceRange === "전체" ||
      (experienceRange === "신입" && expYears === 0) ||
      (experienceRange === "1-3년" && expYears >= 1 && expYears <= 3) ||
      (experienceRange === "3-5년" && expYears >= 3 && expYears <= 5) ||
      (experienceRange === "5년+" && expYears >= 5);

    return jobCategoryMatch && experienceMatch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold text-gray-600">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="flex gap-10 px-6 py-8 mx-auto max-w-screen-2xl">
        {/* 왼쪽 사이드바 */}
        <aside className="flex-shrink-0 hidden w-64 lg:block">
          <CompanyLeftSidebar
            activeMenu={activeMenu}
            onMenuClick={handleMenuClick}
          />
        </aside>

        {/* 메인 컨텐츠 */}
        <main className="flex-1 min-w-0">
          <div className="p-8 bg-white shadow-lg rounded-2xl">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-bold">지원자 관리</h1>
              {urlJobTitle && (
                <div className="px-4 py-2 text-sm font-medium text-blue-700 rounded-lg bg-blue-50">
                  필터: {decodeURIComponent(urlJobTitle)} 공고의 지원자
                </div>
              )}
            </div>

            {/* 필터 섹션 */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  공고 선택
                </label>
                <select
                  value={selectedJobPosting}
                  onChange={(e) => setSelectedJobPosting(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                >
                  <option value="전체">전체</option>
                  {jobPostings.map((job) => (
                    <option key={job.jobId} value={job.title}>
                      {job.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  직무 선택
                </label>
                <select
                  value={selectedJobCategory}
                  onChange={(e) => setSelectedJobCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                >
                  <option value="전체">전체</option>
                  {JOB_CATEGORIES.map((job) => (
                    <option key={job} value={job}>
                      {job}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  경력 범위
                </label>
                <select
                  value={experienceRange}
                  onChange={(e) => setExperienceRange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                >
                  <option value="전체">전체</option>
                  <option value="신입">신입</option>
                  <option value="1-3년">1-3년</option>
                  <option value="3-5년">3-5년</option>
                  <option value="5년+">5년 이상</option>
                </select>
              </div>
            </div>

            {/* 지원자 테이블 */}
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-sm font-semibold text-left text-gray-700 whitespace-nowrap">
                      지원 공고
                    </th>
                    <th className="px-6 py-3 text-sm font-semibold text-left text-gray-700 whitespace-nowrap">
                      지원자
                    </th>
                    <th className="px-6 py-3 text-sm font-semibold text-left text-gray-700 whitespace-nowrap">
                      나이
                    </th>
                    <th className="px-6 py-3 text-sm font-semibold text-left text-gray-700 whitespace-nowrap">
                      주요 스킬
                    </th>
                    <th className="px-6 py-3 text-sm font-semibold text-left text-gray-700 whitespace-nowrap">
                      AI 점수
                    </th>
                    <th className="px-6 py-3 text-sm font-semibold text-left text-gray-700 whitespace-nowrap">
                      지원일
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredApplicants.map((applicant) => (
                    <tr
                      key={applicant.applyId}
                      onClick={() => handleApplicantClick(applicant.applyId)}
                      className="transition cursor-pointer hover:bg-purple-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={(e) =>
                            handleJobPostingClick(applicant.jobTitle, e)
                          }
                          className="px-3 py-1.5 text-sm font-medium text-purple-700 bg-purple-50 rounded-lg hover:bg-purple-100 transition"
                        >
                          {applicant.jobTitle}
                        </button>
                      </td>

                      {/* ✅ 지원자 이름 옆 동그라미(아바타) 제거 */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="font-medium text-gray-900">
                              {applicant.userName}
                            </div>
                            <span
                              className={`inline-block px-2 py-0.5 text-xs font-medium rounded ${getStatusColor(
                                applicant.status,
                              )}`}
                            >
                              {getStatusText(applicant.status)}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-semibold text-purple-600">
                          {applicant.userAge}세
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2 min-w-[200px]">
                          {applicant.skills && applicant.skills.length > 0 ? (
                            applicant.skills.map((skill, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 text-xs font-medium text-purple-700 bg-purple-100 rounded-full whitespace-nowrap"
                              >
                                {skill}
                              </span>
                            ))
                          ) : (
                            <span className="text-sm text-gray-400">-</span>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-center">
                          <span className="text-2xl font-bold text-purple-600">
                            {applicant.aiScore}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-500">
                          {new Date(applicant.appliedAt).toLocaleDateString(
                            "ko-KR",
                          )}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredApplicants.length === 0 && (
              <div className="py-20 text-center text-gray-500">
                <div className="mb-4 text-4xl">📭</div>
                <div className="text-lg font-medium">
                  {applicants.length === 0
                    ? "아직 지원자가 없습니다"
                    : "해당 조건의 지원자가 없습니다"}
                </div>
                <div className="text-sm">
                  {applicants.length === 0
                    ? "지원자를 기다려주세요"
                    : "다른 조건으로 검색해보세요"}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
