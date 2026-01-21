import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getJobPosting, deleteJobPosting, type JobPostingResponse } from "../../api/job";

export default function JobPostingDetailPage() {
  const navigate = useNavigate();
  const { jobId } = useParams<{ jobId: string }>();
  const { isAuthenticated, user, logout } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [job, setJob] = useState<JobPostingResponse | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // 공고 데이터 로드
  useEffect(() => {
    const loadJobPosting = async () => {
      if (!jobId) {
        alert("잘못된 접근입니다.");
        navigate("/company/jobs");
        return;
      }

      try {
        setLoading(true);
        const jobData = await getJobPosting(parseInt(jobId));
        setJob(jobData);
      } catch (error: any) {
        console.error("공고 조회 실패:", error);
        alert(error.response?.data?.message || "공고를 불러오는데 실패했습니다.");
        navigate("/company/jobs");
      } finally {
        setLoading(false);
      }
    };

    loadJobPosting();
  }, [jobId, navigate]);

  const handleApplicantsClick = () => {
    if (job?.jobId) {
      // 해당 공고의 지원자 목록으로 이동
      navigate(`/company/applicants?jobId=${job.jobId}&jobTitle=${encodeURIComponent(job.title)}`);
    }
  };

  const handleBackClick = () => {
    navigate("/company/jobs");
  };

  // 헤더 삭제로 인해 사용되지 않지만 인터페이스 유지를 위해 남겨둠
  const handleLogoClick = () => {
    navigate("/company");
  };

  const handleEditClick = () => {
    if (jobId) {
      navigate(`/company/jobs/edit/${jobId}`);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!jobId || !user?.companyId) {
      alert("삭제 권한이 없습니다.");
      return;
    }

    try {
      await deleteJobPosting(parseInt(jobId), user.companyId);
      alert("공고가 삭제되었습니다.");
      setShowDeleteConfirm(false);
      navigate("/company/jobs");
    } catch (error: any) {
      console.error("공고 삭제 실패:", error);
      alert(error.response?.data?.message || "공고 삭제에 실패했습니다.");
      setShowDeleteConfirm(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold text-gray-600">로딩 중...</div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold text-gray-600">공고를 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
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
              onClick={handleEditClick}
              className="px-6 py-2 font-semibold text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              수정
            </button>
            <button
              onClick={handleDeleteClick}
              disabled={job.status === "CLOSED" || job.status === "EXPIRED"}
              className={`px-6 py-2 font-semibold text-white transition rounded-lg ${
                job.status === "CLOSED" || job.status === "EXPIRED"
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              삭제
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
          <button
            onClick={handleApplicantsClick}
            className="p-6 bg-white rounded-lg shadow transition hover:shadow-lg hover:border-blue-300 border-2 border-transparent cursor-pointer text-left"
          >
            <div className="mb-1 text-sm text-gray-500">지원자 클릭 시 목록보기</div>
            <div className="text-3xl font-bold text-blue-600">
              {job.applicantCount}
            </div>
          </button>
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

      {/* 삭제 확인 모달 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 mx-4 bg-white rounded-lg">
            <h3 className="mb-2 text-lg font-bold text-gray-900">공고 삭제</h3>
            <p className="mb-6 text-gray-600">
              정말로 이 공고를 삭제하시겠습니까?<br />
              공고 상태가 "마감"으로 변경되며, 이 작업은 되돌릴 수 없습니다.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleCancelDelete}
                className="flex-1 px-4 py-2 text-gray-700 transition bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                취소
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 px-4 py-2 text-white transition bg-red-600 rounded-lg hover:bg-red-700"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ❌ 푸터 삭제됨 */}
    </div>
  );
}
