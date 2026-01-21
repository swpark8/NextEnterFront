export interface JobPostingData {
  id: number;
  badge: string;
  badgeColor: string;
  title: string;
  description: string;
  tags: string[];
  company: string;
  period: string;
  salary: string;
}

interface CompanyJobPostingCardProps {
  job: JobPostingData;
  onDetailClick: (jobId: number) => void;
}

export default function CompanyJobPostingCard({
  job,
  onDetailClick,
}: CompanyJobPostingCardProps) {
  return (
    <div
      onClick={() => onDetailClick(job.id)}
      className="p-6 transition-all duration-200 border-4 border-red-500 rounded-lg shadow-lg cursor-pointer bg-yellow-50 hover:shadow-2xl hover:scale-105"
      style={{
        background: "linear-gradient(135deg, #fff9c4 0%, #fff59d 100%)",
      }}
    >
      {/* 🔥 임시 표시 - 나중에 제거하세요 */}
      <div className="px-3 py-1 mb-4 text-sm font-bold text-center text-white bg-red-600 rounded-full">
        🚧 임시 CompanyJobPostingCard 컴포넌트 🚧
      </div>

      {/* 배지 */}
      <div className="mb-3">
        <span
          className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
            job.badgeColor === "orange"
              ? "bg-orange-500 text-white"
              : job.badgeColor === "purple"
              ? "bg-purple-500 text-white"
              : "bg-blue-500 text-white"
          }`}
        >
          {job.badge}
        </span>
      </div>

      {/* 제목 */}
      <h3 className="mb-2 text-xl font-bold text-gray-900">{job.title}</h3>

      {/* 설명 */}
      <p className="mb-3 text-sm text-gray-600">{job.description}</p>

      {/* 태그들 */}
      <div className="flex flex-wrap gap-2 mb-4">
        {job.tags.slice(0, 3).map((tag, index) => (
          <span
            key={index}
            className="px-2 py-1 text-xs bg-white border border-gray-300 rounded-full"
          >
            {tag}
          </span>
        ))}
        {job.tags.length > 3 && (
          <span className="px-2 py-1 text-xs text-gray-500 bg-white border border-gray-300 rounded-full">
            +{job.tags.length - 3}
          </span>
        )}
      </div>

      {/* 회사 정보 */}
      <div className="pt-3 mt-3 border-t border-gray-300">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">
            🏢 {job.company}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>📅 {job.period}</span>
          <span className="font-semibold text-blue-600">💰 {job.salary}</span>
        </div>
      </div>

      {/* 상세보기 버튼 */}
      <button className="w-full px-4 py-2 mt-4 text-sm font-semibold text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700">
        상세보기 →
      </button>
    </div>
  );
}
