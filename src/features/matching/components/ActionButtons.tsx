interface ActionButtonsProps {
  onReanalyze: () => void;
  onEditResume: () => void;
  onApply: () => void;
}

export default function ActionButtons({ onReanalyze, onEditResume, onApply }: ActionButtonsProps) {
  return (
    <div className="flex gap-4">
      <button
        onClick={onReanalyze}
        className="flex-1 py-4 font-bold text-gray-700 transition bg-gray-200 rounded-xl hover:bg-gray-300"
      >
        다시 분석하기
      </button>
      <button
        onClick={onEditResume}
        className="flex-1 py-4 font-bold text-white transition bg-blue-600 rounded-xl hover:bg-blue-700"
      >
        이력서 수정하기
      </button>
      <button
        onClick={onApply}
        className="flex-1 py-4 font-bold text-white transition bg-blue-600 rounded-xl hover:bg-blue-700"
      >
        🚀 지금 지원하기
      </button>
    </div>
  );
}
