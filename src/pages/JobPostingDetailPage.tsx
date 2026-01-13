import { useState } from "react";
import Footer from "../components/Footer";

interface JobPostingDetailPageProps {
  jobId: number;
  onBackClick?: () => void;
  onLogoClick?: () => void;
  onEditClick?: (id: number) => void;
}

interface JobDetail {
  id: number;
  title: string;
  status: "진행중" | "마감" | "종료";
  company: string;
  location: string;
  jobCategory: string;
  experienceMin?: number;
  experienceMax?: number;
  salaryMin?: number;
  salaryMax?: number;
  employmentType: string;
  deadline: string;
  createdAt: string;
  viewCount: number;
  applicantCount: number;
  bookmarkCount: number;
  description: string;
  requirements: string[];
  benefits: string[];
  workingHours: string;
  recruits: number;
}

export default function JobPostingDetailPage({
  jobId,
  onBackClick,
  onLogoClick,
  onEditClick,
}: JobPostingDetailPageProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // 샘플 공고 상세 데이터
  const jobData: { [key: number]: JobDetail } = {
    1: {
      id: 1,
      title: "프론트엔드 개발자",
      status: "진행중",
      company: "테크 스타트업 A사",
      location: "서울 강남구",
      jobCategory: "프론트엔드 개발자",
      experienceMin: 5,
      salaryMin: 6000,
      salaryMax: 6000,
      employmentType: "정규직",
      deadline: "2024-12-31",
      createdAt: "2024-12-01",
      viewCount: 120,
      applicantCount: 42,
      bookmarkCount: 15,
      description:
        "저희는 혁신적인 웹 서비스를 개발하는 테크 스타트업입니다. React와 TypeScript를 활용한 최신 프론트엔드 개발 환경에서 함께 성장할 시니어 프론트엔드 개발자를 찾고 있습니다.",
      requirements: [
        "React, TypeScript 5년 이상 실무 경험",
        "반응형 웹 디자인 및 크로스 브라우징 경험",
        "RESTful API 연동 경험",
        "Git을 활용한 협업 경험",
        "웹 성능 최적화 경험",
      ],
      benefits: [
        "연봉 6,000만원",
        "4대 보험 완비",
        "연차 15일 + 리프레시 휴가 5일",
        "자유로운 연차 사용",
        "최신 장비 지원 (맥북 프로)",
        "도서 구입비 지원",
        "교육비 지원",
        "점심 식대 지원",
      ],
      workingHours: "주 5일 (월~금), 09:00 ~ 18:00 (유연근무제)",
      recruits: 2,
    },
    2: {
      id: 2,
      title: "백엔드 개발자",
      status: "진행중",
      company: "핀테크 기업 B사",
      location: "서울 강북구",
      jobCategory: "백엔드 개발자",
      experienceMin: 3,
      salaryMin: 5000,
      salaryMax: 7000,
      employmentType: "정규직",
      deadline: "2024-12-28",
      createdAt: "2024-11-28",
      viewCount: 98,
      applicantCount: 38,
      bookmarkCount: 12,
      description:
        "Node.js와 Express를 활용한 백엔드 개발자를 모집합니다. MSA 환경에서 확장 가능한 API를 설계하고 구현하실 분을 찾습니다.",
      requirements: [
        "Node.js, Express 3년 이상 경험",
        "RESTful API 설계 및 구현 경험",
        "데이터베이스 설계 및 최적화 경험",
        "MSA 아키텍처 이해",
        "AWS 클라우드 서비스 경험 우대",
      ],
      benefits: [
        "연봉 5,000~7,000만원 (협의)",
        "성과급 별도 지급",
        "4대 보험 완비",
        "재택근무 주 2회",
        "최신 개발 장비 지원",
        "컨퍼런스 참가 지원",
      ],
      workingHours: "주 5일 (월~금), 10:00 ~ 19:00",
      recruits: 3,
    },
    3: {
      id: 3,
      title: "풀스택 개발자",
      status: "진행중",
      company: "이커머스 C사",
      location: "서울 송파구",
      jobCategory: "풀스택 개발자",
      experienceMin: 3,
      salaryMin: 4500,
      salaryMax: 6500,
      employmentType: "정규직",
      deadline: "2024-12-25",
      createdAt: "2024-11-20",
      viewCount: 156,
      applicantCount: 29,
      bookmarkCount: 20,
      description:
        "React와 Spring Boot를 활용한 풀스택 개발자를 모집합니다. 프론트엔드부터 백엔드까지 전체 개발 프로세스에 참여하실 분을 찾습니다.",
      requirements: [
        "React 및 Spring Boot 경험",
        "프론트엔드 및 백엔드 개발 경험 3년 이상",
        "데이터베이스 설계 경험",
        "Git을 활용한 협업 경험",
        "신입/경력 모두 환영",
      ],
      benefits: [
        "연봉 4,500~6,500만원",
        "원격근무 주 2일 가능",
        "유연한 근무 환경",
        "교육 및 자기계발 지원",
        "점심 및 간식 제공",
      ],
      workingHours: "주 5일 (월~금), 09:00 ~ 18:00 (유연근무제)",
      recruits: 1,
    },
  };

  const job = jobData[jobId] || jobData[1];

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    }
  };

  const handleLogoClick = () => {
    if (onLogoClick) {
      onLogoClick();
    }
  };

  const handleEditClick = () => {
    if (onEditClick) {
      onEditClick(jobId);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    alert("공고가 삭제되었습니다.");
    setShowDeleteConfirm(false);
    handleBackClick();
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "진행중":
        return "bg-green-100 text-green-700";
      case "마감":
        return "bg-gray-100 text-gray-700";
      case "종료":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-4 py-4 mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <div
              onClick={handleLogoClick}
              className="cursor-pointer hover:opacity-80 transition-opacity"
            >
              <span className="text-2xl font-bold text-blue-600">Next </span>
              <span className="text-2xl font-bold text-blue-800">Enter</span>
            </div>

            <div className="flex items-center space-x-6">
              <button className="text-gray-600 hover:text-gray-900">
                대시보드
              </button>
              <button className="text-gray-600 hover:text-gray-900">
                채용관리
              </button>
              <button
                onClick={handleLogoClick}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition text-gray-700"
              >
                개인 회원
              </button>
            </div>
          </div>
        </div>
      </header>

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
              {job.status}
            </span>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleEditClick}
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              수정
            </button>
            <button
              onClick={handleDeleteClick}
              className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
            >
              삭제
            </button>
          </div>
        </div>

        {/* 주요 통계 */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-500 mb-1">조회수</div>
            <div className="text-3xl font-bold text-gray-900">
              {job.viewCount}
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-500 mb-1">지원자</div>
            <div className="text-3xl font-bold text-blue-600">
              {job.applicantCount}
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-500 mb-1">북마크</div>
            <div className="text-3xl font-bold text-orange-600">
              {job.bookmarkCount}
            </div>
          </div>
        </div>

        {/* 공고 기본 정보 */}
        <div className="bg-white rounded-lg shadow p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">공고 정보</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-gray-500 mb-1">회사명</div>
              <div className="text-base font-medium text-gray-900">
                {job.company}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">직무</div>
              <div className="text-base font-medium text-gray-900">
                {job.jobCategory}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">근무지</div>
              <div className="text-base font-medium text-gray-900">
                {job.location}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">고용 형태</div>
              <div className="text-base font-medium text-gray-900">
                {job.employmentType}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">경력</div>
              <div className="text-base font-medium text-gray-900">
                {job.experienceMin}년 이상
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">급여</div>
              <div className="text-base font-medium text-gray-900">
                {job.salaryMin}
                {job.salaryMax && job.salaryMax !== job.salaryMin
                  ? ` ~ ${job.salaryMax}`
                  : ""}
                만원
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">모집 인원</div>
              <div className="text-base font-medium text-gray-900">
                {job.recruits}명
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">근무 시간</div>
              <div className="text-base font-medium text-gray-900">
                {job.workingHours}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">등록일</div>
              <div className="text-base font-medium text-gray-900">
                {job.createdAt}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">마감일</div>
              <div className="text-base font-medium text-gray-900">
                {job.deadline}
              </div>
            </div>
          </div>
        </div>

        {/* 공고 설명 */}
        <div className="bg-white rounded-lg shadow p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            공고 설명
          </h2>
          <p className="text-gray-700 leading-relaxed">{job.description}</p>
        </div>

        {/* 자격 요건 */}
        <div className="bg-white rounded-lg shadow p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            자격 요건
          </h2>
          <ul className="space-y-3">
            {job.requirements.map((req, idx) => (
              <li key={idx} className="flex items-start space-x-3">
                <span className="text-blue-600 mt-1">✓</span>
                <span className="text-gray-700">{req}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 복리후생 */}
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            복리후생
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {job.benefits.map((benefit, idx) => (
              <div
                key={idx}
                className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg"
              >
                <span className="text-blue-600">•</span>
                <span className="text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 삭제 확인 모달 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              공고 삭제
            </h3>
            <p className="text-gray-600 mb-6">
              정말로 이 공고를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleCancelDelete}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                취소
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
