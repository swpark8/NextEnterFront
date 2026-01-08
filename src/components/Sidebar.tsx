export default function Sidebar() {
  return (
    <aside className="w-64 space-y-4">
      {/* 오늘의 한줄 꿀팁 */}
      <div className="bg-white border-2 border-blue-500 rounded-lg p-6">
        <h3 className="font-bold text-lg mb-3">오늘의 한줄 꿀팁</h3>
        <p className="text-gray-700 mb-4 leading-relaxed">
          왜 경쟁자는 합격하고,
          <br />
          나는 탈락할까?
          <br />
          그 이유를 알고 싶다면?
        </p>
        <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
          확인하기
        </button>
      </div>

      {/* AI 분석 */}
      <div className="bg-white border-2 border-blue-500 rounded-lg p-6">
        <p className="text-gray-700 font-medium text-center">
          AI가 분석해주는 이력서
        </p>
      </div>
    </aside>
  );
}
