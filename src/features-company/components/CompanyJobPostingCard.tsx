// 백엔드 API 응답 구조에 맞춘 인터페이스
export interface JobPostingData {
  jobId: number;
  title: string;
  companyName: string;
  location: string;
  jobCategory: string;
  deadline: string;
  status: string;
  applicantCount: number;
  thumbnailUrl?: string;
}

interface CompanyJobPostingCardProps {
  job: JobPostingData;
  onDetailClick: (jobId: number) => void;
}

// D-Day 계산 함수
const calculateDaysLeft = (deadline: string): number => {
  const today = new Date();
  const end = new Date(deadline);
  const diff = end.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

// 배지 정보 생성 함수
const getBadgeInfo = (job: JobPostingData) => {
  const daysLeft = calculateDaysLeft(job.deadline);
  
  // 급구 (3일 이하)
  if (daysLeft <= 3 && daysLeft > 0) {
    return { text: "급구", color: "bg-red-500" };
  }
  
  // 인기 급상승 (지원자 30명 이상)
  if (job.applicantCount >= 30) {
    return { text: "인기 급상승", color: "bg-orange-500" };
  }
  
  // 프리미엄 (status가 PREMIUM인 경우)
  if (job.status === "PREMIUM") {
    return { text: "프리미엄 추천", color: "bg-purple-500" };
  }
  
  return null;
};

export default function CompanyJobPostingCard({
  job,
  onDetailClick,
}: CompanyJobPostingCardProps) {
  const daysLeft = calculateDaysLeft(job.deadline);
  const badgeInfo = getBadgeInfo(job);

  return (
    <div
      onClick={() => onDetailClick(job.jobId)}
      className="p-6 transition-all duration-200 bg-white border-2 border-gray-200 rounded-lg shadow-md cursor-pointer hover:shadow-xl hover:border-blue-400"
    >
      {/* 배지 (조건부 렌더링) */}
      {badgeInfo && (
        <div className="mb-3">
          <span
            className={`inline-block px-3 py-1 text-xs font-semibold text-white rounded-full ${badgeInfo.color}`}
          >
            {badgeInfo.text}
          </span>
        </div>
      )}

      {/* 썸네일 이미지 (있는 경우) */}
      {job.thumbnailUrl && (
        <div className="mb-4">
          <img
            src={job.thumbnailUrl}
            alt={job.companyName}
            className="object-cover w-full h-32 rounded-lg"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}

      {/* 제목 */}
      <h3 className="mb-2 text-lg font-bold text-gray-900 line-clamp-2">
        {job.title}
      </h3>

      {/* 직무 카테고리 */}
      <div className="mb-3">
        <span className="inline-block px-3 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded-full">
          {job.jobCategory}
        </span>
      </div>

      {/* 회사 정보 */}
      <div className="pt-3 mt-3 border-t border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">
            🏢 {job.companyName}
          </span>
        </div>
        <div className="flex items-center justify-between mb-2 text-xs text-gray-600">
          <span>📍 {job.location}</span>
          <span className="font-semibold text-blue-600">
            👥 지원자 {job.applicantCount}명
          </span>
        </div>
        <div className="text-xs text-gray-600">
          <span>📅 마감: {job.deadline}</span>
          <span
            className={`ml-2 font-bold ${
              daysLeft <= 7 ? "text-red-600" : "text-blue-600"
            }`}
          >
            {daysLeft > 0 ? `D-${daysLeft}` : "마감"}
          </span>
        </div>
      </div>

      {/* 상세보기 버튼 */}
      <button className="w-full px-4 py-2 mt-4 text-sm font-semibold text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700">
        상세보기 →
      </button>
    </div>
  );
}
