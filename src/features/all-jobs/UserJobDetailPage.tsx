import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getJobPosting, type JobPostingResponse } from "../../api/job";
import {
  createApply,
  getMyApplies,
  type ApplyCreateRequest,
} from "../../api/apply";
import { toggleBookmark, checkBookmark } from "../../api/bookmark";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";

export default function UserJobDetailPage() {
  const navigate = useNavigate();
  const { jobId } = useParams<{ jobId: string }>();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [job, setJob] = useState<JobPostingResponse | null>(null);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [selectedResumeId, setSelectedResumeId] = useState<number | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [resumesLoading, setResumesLoading] = useState(false);
  const [localResumes, setLocalResumes] = useState<any[]>([]);

  const { addJobApplication } = useApp();

  // 공고 데이터 로드
  useEffect(() => {
    const loadJobPosting = async () => {
      if (!jobId) {
        console.error("jobId가 없습니다:", jobId);
        alert("잘못된 접근입니다.");
        navigate("/user/jobs/all");
        return;
      }

      try {
        setLoading(true);
        console.log("공고 조회 시작 - jobId:", jobId);
        console.log("백엔드 URL:", "http://localhost:8080/api/jobs/" + jobId);

        const jobData = await getJobPosting(parseInt(jobId));
        console.log("공고 조회 성공:", jobData);
        setJob(jobData);

        // 로그인한 경우에만 지원 여부와 북마크 확인
        if (user?.userId) {
          try {
            console.log("지원 내역 조회 시작 - userId:", user.userId);
            const applies = await getMyApplies(user.userId);
            console.log("지원 내역 조회 성공:", applies);
            const appliedJobIds = new Set(applies.map((apply) => apply.jobId));
            setIsApplied(appliedJobIds.has(jobData.jobId));

            // 북마크 여부 확인
            console.log("북마크 상태 조회 시작");
            const bookmarkStatus = await checkBookmark(
              user.userId,
              jobData.jobId,
            );
            console.log("북마크 상태 조회 성공:", bookmarkStatus);
            setIsBookmarked(bookmarkStatus.isBookmarked);
          } catch (subError: any) {
            console.error("지원/북마크 조회 실패 (무시할 수 있음):", subError);
            // 지원/북마크 조회 실패는 전체 로딩을 멈추지 않음
          }
        }
      } catch (error: any) {
        console.error("공고 조회 실패 상세:", {
          message: error.message,
          response: error.response,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            baseURL: error.config?.baseURL,
          },
        });

        let errorMessage = "공고를 불러오는데 실패했습니다.";

        if (error.code === "ERR_NETWORK") {
          errorMessage =
            "백엔드 서버에 연결할 수 없습니다. \n백엔드 서버(http://localhost:8080)가 실행 중인지 확인해주세요.";
        } else if (error.response?.status === 404) {
          errorMessage = "해당 공고를 찾을 수 없습니다.";
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }

        alert(errorMessage);
        navigate("/user/jobs/all");
      } finally {
        setLoading(false);
      }
    };

    loadJobPosting();
  }, [jobId, navigate, user?.userId]);

  // 모달이 열릴 때 이력서 목록 로드
  useEffect(() => {
    if (showResumeModal) {
      const fetchResumes = () => {
        setResumesLoading(true);
        try {
          // localStorage에서 이력서 데이터 로드
          const savedResumes = localStorage.getItem("nextenter_resumes");
          if (savedResumes) {
            const parsedResumes = JSON.parse(savedResumes);
            console.log("이력서 로드 성공:", parsedResumes);
            setLocalResumes(parsedResumes);
          } else {
            console.log("저장된 이력서 없음");
            setLocalResumes([]);
          }
        } catch (error) {
          console.error("이력서 로드 실패:", error);
          setLocalResumes([]);
        } finally {
          // 로딩 상태를 약간의 딸레이로 해제 (사용자 경험 개선)
          setTimeout(() => {
            setResumesLoading(false);
          }, 300);
        }
      };
      fetchResumes();
    }
  }, [showResumeModal]);

  const handleBackClick = () => {
    navigate("/user/jobs/all");
  };

  const handleApplyClick = () => {
    setShowResumeModal(true);
  };

  const handleResumeSelect = (resumeId: number) => {
    setSelectedResumeId(resumeId);
  };

  const handleFinalSubmit = async () => {
    if (!selectedResumeId || !job) {
      alert("이력서를 선택해주세요.");
      return;
    }

    if (!user?.userId) {
      alert("로그인이 필요합니다.");
      navigate("/user/login");
      return;
    }

    const selectedResume = localResumes.find((r) => r.id === selectedResumeId);

    if (!confirm(`"${selectedResume?.title}"로 지원하시겠습니까?`)) {
      return;
    }

    try {
      setSubmitting(true);

      // 백엔드 API 호출
      const applyRequest: ApplyCreateRequest = {
        jobId: job.jobId,
        resumeId: selectedResumeId,
      };

      await createApply(user.userId, applyRequest);

      // localStorage에도 저장 (화면 표시용)
      const today = new Date();
      const applicationId = Date.now();

      addJobApplication({
        id: applicationId,
        jobId: job.jobId,
        resumeId: selectedResumeId,
        date: today.toISOString().split("T")[0].replace(/-/g, "."),
        company: job.companyName,
        position: job.title,
        jobType: "정규직",
        location: job.location,
        deadline: job.deadline,
        viewed: false,
        status: "지원완료",
        canCancel: true,
      });

      alert("지원이 완료되었습니다!");
      setShowResumeModal(false);
      setSelectedResumeId(null);
      setIsApplied(true); // 지원 완료 상태로 변경
    } catch (error: any) {
      console.error("지원 실패:", error);
      if (
        error.response?.status === 409 ||
        error.response?.data?.message?.includes("이미 지원")
      ) {
        alert("이미 지원한 공고입니다.");
      } else {
        alert(error.response?.data?.message || "지원에 실패했습니다.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelResume = () => {
    setShowResumeModal(false);
    setSelectedResumeId(null);
  };

  const handleBookmarkToggle = async () => {
    if (!user?.userId || !job) {
      alert("로그인이 필요합니다.");
      navigate("/user/login");
      return;
    }

    try {
      const result = await toggleBookmark(user.userId, job.jobId);
      setIsBookmarked(result.isBookmarked);

      // 공고 데이터 새로고침하여 북마크 수 업데이트
      const updatedJob = await getJobPosting(job.jobId);
      setJob(updatedJob);

      if (result.isBookmarked) {
        alert("스크랩한 공고에 추가되었습니다.");
      } else {
        alert("스크랩한 공고에서 제거되었습니다.");
      }
    } catch (error: any) {
      console.error("북마크 토글 실패:", error);
      if (
        error.response?.status === 409 ||
        error.response?.data?.message?.includes("이미")
      ) {
        alert("이미 북마크한 공고입니다.");
      } else {
        alert(error.response?.data?.message || "북마크 처리에 실패했습니다.");
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
        return "bg-gray-100 text-gray-700";
      case "EXPIRED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-xl font-semibold text-gray-600">로딩 중...</div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-xl font-semibold text-gray-600">
          공고를 찾을 수 없습니다.
        </div>
      </div>
    );
  }

  return (
    <>
      {/* 이력서 선택 모달 - 기존과 동일 */}
      {showResumeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <h3 className="mb-6 text-2xl font-bold text-gray-900">
              지원할 이력서를 선택해주세요
            </h3>
            {resumesLoading ? (
              <div className="p-8 text-center">
                <div className="mb-4 text-xl font-semibold text-gray-600">
                  로딩 중...
                </div>
                <div className="text-sm text-gray-500">
                  이력서 목록을 불러오고 있습니다
                </div>
              </div>
            ) : localResumes.length === 0 ? (
              <div className="p-8 text-center">
                <p className="mb-4 text-gray-600">등록된 이력서가 없습니다.</p>
                <button
                  onClick={() => {
                    setShowResumeModal(false);
                    navigate("/user/resume");
                  }}
                  className="px-6 py-2 text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  이력서 작성하기
                </button>
              </div>
            ) : (
              <>
                <div className="mb-6 space-y-4">
                  {localResumes.map((resume) => (
                    <div
                      key={resume.id}
                      onClick={() => handleResumeSelect(resume.id)}
                      className={`p-5 border-2 rounded-lg cursor-pointer transition ${
                        selectedResumeId === resume.id
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-200 hover:border-blue-300 bg-white"
                      }`}
                    >
                      <h4 className="text-lg font-bold text-gray-900">
                        {resume.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        산업: {resume.industry}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={handleCancelResume}
                    className="flex-1 px-6 py-3 font-medium text-gray-700 transition bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleFinalSubmit}
                    disabled={submitting}
                    className="flex-1 px-6 py-3 font-medium text-white transition bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {submitting ? "지원 중..." : "지원하기"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-blue-50/30">
        <div className="max-w-6xl px-4 py-8 mx-auto">
          {/* 뒤로가기 버튼 */}
          <button
            onClick={handleBackClick}
            className="flex items-center mb-6 text-gray-600 transition hover:text-purple-600 group"
          >
            <svg
              className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="font-medium">목록으로 돌아가기</span>
          </button>

          {/* 헤더 카드 */}
          <div className="p-8 mb-6 bg-white shadow-2xl rounded-3xl">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <h1 className="text-4xl font-bold text-gray-900">
                    {job.title}
                  </h1>
                  <span
                    className={`px-4 py-1.5 text-sm font-bold rounded-full ${getStatusColor(job.status)}`}
                  >
                    {getStatusText(job.status)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xl font-semibold text-purple-600">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  <span>{job.companyName}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleBookmarkToggle}
                  className={`flex items-center gap-2 px-6 py-3 font-semibold transition rounded-xl shadow-lg ${
                    isBookmarked
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700"
                      : "bg-white text-orange-600 border-2 border-orange-500 hover:bg-orange-50"
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill={isBookmarked ? "currentColor" : "none"}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                    />
                  </svg>
                  {isBookmarked ? "스크랩한 공고" : "스크랩"}
                </button>
                <button
                  onClick={handleApplyClick}
                  disabled={job.status !== "ACTIVE" || isApplied}
                  className={`flex items-center gap-2 px-8 py-3 font-bold transition rounded-xl shadow-lg ${
                    job.status !== "ACTIVE" || isApplied
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 transform hover:scale-105"
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  {isApplied ? "지원완료" : "입사지원"}
                </button>
              </div>
            </div>

            {/* 주요 통계 */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-6 transition bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl hover:shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-blue-700">
                    조회수
                  </div>
                  <svg
                    className="w-5 h-5 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </div>
                <div className="text-3xl font-bold text-blue-700">
                  {job.viewCount.toLocaleString()}
                </div>
              </div>
              <div className="p-6 transition bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl hover:shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-purple-700">
                    지원자
                  </div>
                  <svg
                    className="w-5 h-5 text-purple-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <div className="text-3xl font-bold text-purple-700">
                  {job.applicantCount.toLocaleString()}
                </div>
              </div>
              <div className="p-6 transition bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl hover:shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-orange-700">
                    북마크
                  </div>
                  <svg
                    className="w-5 h-5 text-orange-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </div>
                <div className="text-3xl font-bold text-orange-700">
                  {job.bookmarkCount.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* 공고 기본 정보 */}
          <div className="p-8 mb-6 bg-white shadow-xl rounded-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-purple-100 rounded-xl">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">공고 정보</h2>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-start gap-4 p-4 transition bg-gray-50 rounded-xl hover:bg-gray-100">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <svg
                    className="w-5 h-5 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="mb-1 text-sm font-medium text-gray-500">
                    회사명
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    {job.companyName}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 transition bg-gray-50 rounded-xl hover:bg-gray-100">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <svg
                    className="w-5 h-5 text-blue-600"
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
                </div>
                <div className="flex-1">
                  <div className="mb-1 text-sm font-medium text-gray-500">
                    직무
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    {job.jobCategory}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 transition bg-gray-50 rounded-xl hover:bg-gray-100">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <svg
                    className="w-5 h-5 text-green-600"
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
                </div>
                <div className="flex-1">
                  <div className="mb-1 text-sm font-medium text-gray-500">
                    근무지
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    {job.location}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 transition bg-gray-50 rounded-xl hover:bg-gray-100">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <svg
                    className="w-5 h-5 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="mb-1 text-sm font-medium text-gray-500">
                    경력
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    {formatExperience(job.experienceMin, job.experienceMax)}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 transition bg-gray-50 rounded-xl hover:bg-gray-100">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <svg
                    className="w-5 h-5 text-yellow-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="mb-1 text-sm font-medium text-gray-500">
                    급여
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    {formatSalary(job.salaryMin, job.salaryMax)}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 transition bg-gray-50 rounded-xl hover:bg-gray-100">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <svg
                    className="w-5 h-5 text-gray-600"
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
                </div>
                <div className="flex-1">
                  <div className="mb-1 text-sm font-medium text-gray-500">
                    등록일 / 마감일
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    {job.createdAt} ~ {job.deadline}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 공고 설명 */}
          {job.description && (
            <div className="p-8 mb-6 bg-white shadow-xl rounded-3xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">공고 설명</h2>
              </div>
              <div className="p-6 bg-gray-50 rounded-xl">
                <p className="text-lg leading-relaxed text-gray-700 whitespace-pre-wrap">
                  {job.description}
                </p>
              </div>
            </div>
          )}

          {/* 홍보 이미지 */}
          {job.detailImageUrl && (
            <div className="p-8 mb-6 bg-white shadow-xl rounded-3xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">채용 포스터</h2>
              </div>
              <div className="overflow-hidden rounded-xl">
                <img
                  src={job.detailImageUrl}
                  alt="채용 포스터"
                  className="object-contain w-full"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/800x1200?text=Image+Not+Available';
                  }}
                />
              </div>
            </div>
          )}

          {/* 필수 스킬 */}
          {job.requiredSkills && (
            <div className="p-8 mb-6 bg-white shadow-xl rounded-3xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-red-100 rounded-xl">
                  <svg
                    className="w-6 h-6 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">필수 스킬</h2>
                <span className="px-3 py-1 text-sm font-semibold text-red-700 bg-red-100 rounded-full">
                  Required
                </span>
              </div>
              <div className="p-6 bg-red-50 rounded-xl">
                <div className="text-lg leading-relaxed text-gray-700 whitespace-pre-wrap">
                  {job.requiredSkills}
                </div>
              </div>
            </div>
          )}

          {/* 우대 스킬 */}
          {job.preferredSkills && (
            <div className="p-8 bg-white shadow-xl rounded-3xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-green-100 rounded-xl">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">우대 스킬</h2>
                <span className="px-3 py-1 text-sm font-semibold text-green-700 bg-green-100 rounded-full">
                  Preferred
                </span>
              </div>
              <div className="p-6 bg-green-50 rounded-xl">
                <div className="text-lg leading-relaxed text-gray-700 whitespace-pre-wrap">
                  {job.preferredSkills}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
