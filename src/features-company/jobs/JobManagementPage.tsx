import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import CompanyLeftSidebar from "../components/CompanyLeftSidebar";
import { useCompanyPageNavigation } from "../hooks/useCompanyPageNavigation";
import {
  getJobPostings,
  updateJobPostingStatus,
  deleteJobPosting,
  type JobPostingListResponse,
} from "../../api/job";

const cacheKey = (companyId: number) => `company_job_cache_v1_${companyId}`;
const deletedKey = (companyId: number) => `company_job_deleted_v1_${companyId}`;

function safeParse<T>(value: string | null, fallback: T): T {
  try {
    if (!value) return fallback;
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function loadCachedJobs(companyId: number): JobPostingListResponse[] {
  return safeParse<JobPostingListResponse[]>(
    localStorage.getItem(cacheKey(companyId)),
    [],
  );
}

function saveCachedJobs(companyId: number, jobs: JobPostingListResponse[]) {
  localStorage.setItem(cacheKey(companyId), JSON.stringify(jobs));
}

function loadDeletedIds(companyId: number): number[] {
  return safeParse<number[]>(localStorage.getItem(deletedKey(companyId)), []);
}

function saveDeletedIds(companyId: number, ids: number[]) {
  localStorage.setItem(deletedKey(companyId), JSON.stringify(ids));
}

/**
 * 서버 + 캐시 병합 (삭제 tombstone 반영)
 */
function mergeJobs(
  serverJobs: JobPostingListResponse[],
  cachedJobs: JobPostingListResponse[],
  deletedIds: number[],
) {
  const deletedSet = new Set(deletedIds);
  const map = new Map<number, JobPostingListResponse>();

  // 캐시 먼저 (삭제된 건 제외)
  for (const j of cachedJobs) {
    if (deletedSet.has(j.jobId)) continue;
    map.set(j.jobId, j);
  }

  // 서버로 덮기 (삭제된 건 제외)
  for (const j of serverJobs) {
    if (deletedSet.has(j.jobId)) continue;

    const prev = map.get(j.jobId);
    // 캐시가 CLOSED인데 서버가 ACTIVE만 주는 상황이면 CLOSED 유지
    if (prev?.status === "CLOSED" && j.status !== "CLOSED") {
      map.set(j.jobId, { ...j, status: "CLOSED" });
    } else {
      map.set(j.jobId, j);
    }
  }

  return Array.from(map.values()).sort((a, b) => {
    const da = new Date(a.createdAt).getTime();
    const db = new Date(b.createdAt).getTime();
    return db - da;
  });
}

export default function JobManagementPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const { activeMenu, handleMenuClick } = useCompanyPageNavigation(
    "jobs",
    "jobs-sub-2",
  );

  const reloadParam = searchParams.get("reload");

  const [selectedStatus, setSelectedStatus] = useState("전체");
  const [selectedRegion, setSelectedRegion] = useState("전체");
  const [searchQuery, setSearchQuery] = useState("");

  const [jobs, setJobs] = useState<JobPostingListResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 목록 로드
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

        const companyId = user.companyId;

        const cached = loadCachedJobs(companyId);
        const deletedIds = loadDeletedIds(companyId);

        let response: any;
        try {
          response = await getJobPostings({
            page: 0,
            size: 1000,
            status: "ALL",
          } as any);
        } catch {
          response = await getJobPostings({ page: 0, size: 1000 });
        }

        const all = Array.isArray(response) ? response : response.content ?? [];
        const myServerJobs = all.filter(
          (job: JobPostingListResponse) => job.companyId === companyId,
        );

        const merged = mergeJobs(myServerJobs, cached, deletedIds);

        setJobs(merged);
        saveCachedJobs(companyId, merged);
      } catch (err: any) {
        console.error("공고 목록 조회 실패:", err);
        setError("공고 목록을 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadJobPostings();
  }, [user, navigate, reloadParam]);

  const handleNewJob = () => navigate("/company/jobs/create");
  const handleJobClick = (jobId: number) => navigate(`/company/jobs/${jobId}`);

  const handleApplicantsClick = (
    e: React.MouseEvent,
    job: JobPostingListResponse,
  ) => {
    e.stopPropagation();
    navigate(
      `/company/applicants?jobId=${job.jobId}&jobTitle=${encodeURIComponent(
        job.title,
      )}`,
    );
  };

  const handleEdit = (jobId: number) => navigate(`/company/jobs/edit/${jobId}`);

  const handleClose = async (jobId: number) => {
    if (!user?.companyId) return;
    const companyId = user.companyId;

    const job = jobs.find((j) => j.jobId === jobId);
    if (!job) return;

    if (job.status === "CLOSED") return alert("이미 마감된 공고입니다.");
    if (job.status === "EXPIRED") return alert("기간만료된 공고입니다.");

    const applicantCount = job.applicantCount || 0;

    const ok = window.confirm(
      `"${job.title}" 공고를 마감하시겠습니까?\n\n` +
        `현재 지원자: ${applicantCount}명\n` +
        `마감 후에는 다시 활성화할 수 없습니다.`,
    );
    if (!ok) return;

    try {
      await updateJobPostingStatus(jobId, companyId, "CLOSED");

      setJobs((prev) => {
        const next = prev.map((j) =>
          j.jobId === jobId ? { ...j, status: "CLOSED" } : j,
        );
        saveCachedJobs(companyId, next);
        return next;
      });

      alert("공고가 마감되었습니다.");
    } catch (err: any) {
      console.error("공고 마감 실패:", err);
      alert(err.response?.data?.message || "공고 마감에 실패했습니다.");
    }
  };

  /**
   * ✅ 삭제: state 제거 + 캐시 제거 + tombstone(삭제 목록) 저장
   * - 서버가 실제로 삭제가 아니라 CLOSED로 바꾸더라도, 프론트에서는 "완전 삭제처럼" 안 보이게 유지 가능
   */
  const handleDelete = async (jobId: number) => {
    if (!user?.companyId) return;
    const companyId = user.companyId;

    const job = jobs.find((j) => j.jobId === jobId);
    if (!job) return;

    const ok = window.confirm(
      `"${job.title}" 공고를 삭제하시겠습니까?\n\n삭제 후 목록에서 완전히 사라집니다.`,
    );
    if (!ok) return;

    try {
      await deleteJobPosting(jobId, companyId);

      // tombstone 저장 + state/캐시 제거
      const prevDeleted = loadDeletedIds(companyId);
      const nextDeleted = Array.from(new Set([...prevDeleted, jobId]));
      saveDeletedIds(companyId, nextDeleted);

      setJobs((prev) => {
        const next = prev.filter((j) => j.jobId !== jobId);
        saveCachedJobs(companyId, next);
        return next;
      });

      alert("공고가 삭제되었습니다.");
    } catch (err: any) {
      console.error("공고 삭제 실패:", err);
      alert(err.response?.data?.message || "공고 삭제에 실패했습니다.");
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
        return "bg-gray-200 text-gray-700";
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

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
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
        searchQuery.trim() === "" ||
        job.title.toLowerCase().includes(searchQuery.toLowerCase());

      return statusMatch && regionMatch && searchMatch;
    });
  }, [jobs, selectedStatus, selectedRegion, searchQuery]);

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
        <CompanyLeftSidebar
          activeMenu={activeMenu}
          onMenuClick={handleMenuClick}
        />

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
            {filteredJobs.map((job) => {
              const isInactive = job.status === "CLOSED" || job.status === "EXPIRED";

              return (
                <div
                  key={job.jobId}
                  onClick={() => handleJobClick(job.jobId)}
                  className={[
                    "p-5 transition border rounded-lg shadow-sm cursor-pointer",
                    isInactive
                      ? "bg-gray-100 border-gray-200 opacity-80 hover:shadow-md"
                      : "bg-white border-gray-300 hover:shadow-lg hover:border-purple-400",
                  ].join(" ")}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center flex-1 gap-6">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-gray-900 truncate">
                            {job.title}
                          </h3>
                          <span
                            className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${getStatusColor(
                              job.status,
                            )}`}
                          >
                            {getStatusText(job.status)}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            {job.location}
                          </span>
                          <span className="flex items-center gap-1">
                            {formatExperience(job.experienceMin, job.experienceMax)}
                          </span>
                          <span className="flex items-center gap-1">
                            {formatSalary(job.salaryMin, job.salaryMax)}
                          </span>
                          <span className="flex items-center gap-1">
                            {new Date(job.createdAt).toLocaleDateString("ko-KR")}
                          </span>
                        </div>
                      </div>

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
                        disabled={isInactive}
                        className={`px-4 py-2 text-sm font-medium text-white transition rounded-lg ${
                          isInactive
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-red-500 hover:bg-red-600"
                        }`}
                      >
                        {isInactive ? "마감됨" : "마감"}
                      </button>

                      {/* ✅ 삭제 버튼 추가 */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(job.jobId);
                        }}
                        className="px-4 py-2 text-sm font-medium text-white transition bg-black rounded-lg hover:bg-gray-800"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
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
