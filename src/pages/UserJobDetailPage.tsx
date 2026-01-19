import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getJobPosting, type JobPostingResponse } from "../api/job";
import { createApply, type ApplyCreateRequest } from "../api/apply";
import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";

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

  const { resumes, addJobApplication } = useApp();

  // 공고 데이터 로드
  useEffect(() => {
    const loadJobPosting = async () => {
      if (!jobId) {
        alert("잘못된 접근입니다.");
        navigate("/user/jobs/all");
        return;
      }

      try {
        setLoading(true);
        const jobData = await getJobPosting(parseInt(jobId));
        setJob(jobData);
      } catch (error: any) {
        console.error("공고 조회 실패:", error);
        alert(error.response?.data?.message || "공고를 불러오는데 실패했습니다.");
        navigate("/user/jobs/all");
      } finally {
        setLoading(false);
      }
    };

    loadJobPosting();
  }, [jobId, navigate]);

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

    const selectedResume = resumes.find((r) => r.id === selectedResumeId);

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
        date: today.toISOString().split('T')[0].replace(/-/g, '.'),
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
    } catch (error: any) {
      console.error("지원 실패:", error);
      if (error.response?.status === 409 || error.response?.data?.message?.includes("이미 지원")) {
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

  const handleBookmarkToggle = () => {
    setIsBookmarked(!isBookmarked);
    if (!isBookmarked) {
      alert("북마크에 추가되었습니다.");
    } else {
      alert("북마크에서 제거되었습니다.");
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
        <div className="text-xl font-semibold text-gray-600">공고를 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <>
      {/* 이력서 선택 모달 */}
      {showResumeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <h3 className="mb-6 text-2xl font-bold text-gray-900">
              지원할 이력서를 선택해주세요
            </h3>
            {resumes.length === 0 ? (
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
                  {resumes.map((resume) => (
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

      <div className="min-h-screen bg-gray-50">
        {/* 메인 콘텐츠 */}
        <div className="px-4 py-8 mx-auto max-w-7xl">
          {/* 상단: 뒤로가기 & 제목 */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackClick}
                className="text-2xl text-gray-600 hover:text-gray-900"
              >
                ←
              </button>
              <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
              <span
                className={`px-4 py-1 text-sm font-semibold rounded-full ${getStatusColor(
                  job.status
                )}`}
              >
                {getStatusText(job.status)}
              </span>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleBookmarkToggle}
                className={`px-6 py-2 font-semibold transition rounded-lg ${
                  isBookmarked
                    ? "bg-orange-600 text-white hover:bg-orange-700"
                    : "bg-white text-orange-600 border-2 border-orange-600 hover:bg-orange-50"
                }`}
              >
                {isBookmarked ? "★ 북마크됨" : "☆ 북마크"}
              </button>
              <button
                onClick={handleApplyClick}
                disabled={job.status !== "ACTIVE"}
                className={`px-6 py-2 font-semibold text-white transition rounded-lg ${
                  job.status !== "ACTIVE"
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                입사지원
              </button>
            </div>
          </div>

          {/* 주요 통계 */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-6 bg-white rounded-lg shadow">
              <div className="mb-1 text-sm text-gray-500">조회수</div>
              <div className="text-3xl font-bold text-gray-900">
                {job.viewCount}
              </div>
            </div>
            <div className="p-6 bg-white rounded-lg shadow">
              <div className="mb-1 text-sm text-gray-500">지원자</div>
              <div className="text-3xl font-bold text-blue-600">
                {job.applicantCount}
              </div>
            </div>
            <div className="p-6 bg-white rounded-lg shadow">
              <div className="mb-1 text-sm text-gray-500">북마크</div>
              <div className="text-3xl font-bold text-orange-600">
                {job.bookmarkCount}
              </div>
            </div>
          </div>

          {/* 공고 기본 정보 */}
          <div className="p-8 mb-6 bg-white rounded-lg shadow">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">공고 정보</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="mb-1 text-sm text-gray-500">회사명</div>
                <div className="text-base font-medium text-gray-900">
                  {job.companyName}
                </div>
              </div>
              <div>
                <div className="mb-1 text-sm text-gray-500">직무</div>
                <div className="text-base font-medium text-gray-900">
                  {job.jobCategory}
                </div>
              </div>
              <div>
                <div className="mb-1 text-sm text-gray-500">근무지</div>
                <div className="text-base font-medium text-gray-900">
                  {job.location}
                </div>
              </div>
              <div>
                <div className="mb-1 text-sm text-gray-500">경력</div>
                <div className="text-base font-medium text-gray-900">
                  {formatExperience(job.experienceMin, job.experienceMax)}
                </div>
              </div>
              <div>
                <div className="mb-1 text-sm text-gray-500">급여</div>
                <div className="text-base font-medium text-gray-900">
                  {formatSalary(job.salaryMin, job.salaryMax)}
                </div>
              </div>
              <div>
                <div className="mb-1 text-sm text-gray-500">등록일</div>
                <div className="text-base font-medium text-gray-900">
                  {job.createdAt}
                </div>
              </div>
              <div>
                <div className="mb-1 text-sm text-gray-500">마감일</div>
                <div className="text-base font-medium text-gray-900">
                  {job.deadline}
                </div>
              </div>
            </div>
          </div>

          {/* 공고 설명 */}
          {job.description && (
            <div className="p-8 mb-6 bg-white rounded-lg shadow">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">공고 설명</h2>
              <p className="leading-relaxed text-gray-700 whitespace-pre-wrap">
                {job.description}
              </p>
            </div>
          )}

          {/* 필수 스킬 */}
          {job.requiredSkills && (
            <div className="p-8 mb-6 bg-white rounded-lg shadow">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">필수 스킬</h2>
              <div className="leading-relaxed text-gray-700 whitespace-pre-wrap">
                {job.requiredSkills}
              </div>
            </div>
          )}

          {/* 우대 스킬 */}
          {job.preferredSkills && (
            <div className="p-8 bg-white rounded-lg shadow">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">우대 스킬</h2>
              <div className="leading-relaxed text-gray-700 whitespace-pre-wrap">
                {job.preferredSkills}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
