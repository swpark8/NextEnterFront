interface JobSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobs: Array<{
    jobId: number;
    title: string;
    jobCategory: string;
    deadline: string;
    status: string;
  }>;
  onSelectJob: (jobId: number) => void;
  talentName: string;
}

export default function JobSelectionModal({
  isOpen,
  onClose,
  jobs,
  onSelectJob,
  talentName,
}: JobSelectionModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl p-6 bg-white rounded-2xl shadow-2xl max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            면접 제안할 공고 선택
          </h2>
          <p className="mt-2 text-gray-600">
            <span className="font-semibold text-purple-600">{talentName}</span>님에게 면접을 제안할 공고를 선택하세요
          </p>
        </div>

        {jobs.length === 0 ? (
          <div className="py-12 text-center">
            <div className="mb-4 text-4xl">📋</div>
            <p className="mb-4 text-gray-600">사용 가능한 공고가 없습니다.</p>
            <p className="text-sm text-gray-500">
              먼저 채용공고를 등록하고 마감일을 확인해주세요.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => (
              <button
                key={job.jobId}
                onClick={() => onSelectJob(job.jobId)}
                className="w-full p-4 text-left transition border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="mb-2 text-lg font-bold text-gray-900">
                      {job.title}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <span className="px-2 py-1 text-xs font-medium text-purple-600 bg-purple-100 rounded">
                        {job.jobCategory}
                      </span>
                      <span>마감: {job.deadline}</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <span className="px-3 py-1 text-sm font-medium text-green-600 bg-green-100 rounded-full">
                      모집중
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-700 transition bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
