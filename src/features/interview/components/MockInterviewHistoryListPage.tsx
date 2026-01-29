import { useState } from "react";
import InterviewSidebar from "./InterviewSidebar";
import MockInterviewHistoryPage from "./MockInterviewHistoryPage";
import { useApp } from "../../../context/AppContext";

interface MockInterviewHistoryListPageProps {
  activeMenu: string;
  onMenuClick: (menuId: string) => void;
  onBackToInterview: () => void;
}

export default function MockInterviewHistoryListPage({
  activeMenu,
  onMenuClick,
  onBackToInterview,
}: MockInterviewHistoryListPageProps) {
  const [selectedHistoryId, setSelectedHistoryId] = useState<number | null>(
    null
  );

  // Context에서 면접 히스토리 데이터 가져오기
  const { interviewHistories, clearInterviewHistories, clearInterviewResults } = useApp();

  // 전체 삭제 핸들러 (이중 확인)
  const handleClearAll = () => {
    // 첫 번째 확인
    if (window.confirm('모든 면접 히스토리와 결과를 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.')) {
      // 두 번째 확인
      if (window.confirm('⚠️ 정말 삭제하시겠습니까?\n모든 면접 데이터가 영구적으로 삭제됩니다.')) {
        clearInterviewHistories();
        clearInterviewResults();
        alert('모든 면접 데이터가 삭제되었습니다.');
      }
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-50 border-green-300";
    if (score >= 80) return "text-blue-600 bg-blue-50 border-blue-300";
    if (score >= 70) return "text-yellow-600 bg-yellow-50 border-yellow-300";
    return "text-red-600 bg-red-50 border-red-300";
  };

  const handleViewHistory = (id: number) => {
    setSelectedHistoryId(id);
  };

  const handleBackToList = () => {
    setSelectedHistoryId(null);
  };

  // 히스토리 상세 페이지 표시
  if (selectedHistoryId !== null) {
    return (
      <MockInterviewHistoryPage
        interviewId={selectedHistoryId}
        onBack={handleBackToList}
        activeMenu={activeMenu}
        onMenuClick={onMenuClick}
      />
    );
  }

  return (
    <>
      <div className="min-h-screen bg-white">
        <div className="px-4 py-8 mx-auto max-w-7xl">
          {/* AI 모의 면접 타이틀 */}
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-bold">AI 모의 면접 히스토리</h2>
          </div>

          <div className="flex gap-6">
            {/* 왼쪽 사이드바 */}
            <InterviewSidebar
              activeMenu={activeMenu}
              onMenuClick={onMenuClick}
            />

            {/* 메인 컨텐츠 */}
            <div className="flex-1 space-y-6">
              {interviewHistories.length === 0 ? (
                /* 히스토리가 없을 때 */
                <div className="p-16 text-center bg-white border-2 border-gray-200 rounded-2xl">
                  <div className="mb-4 text-6xl">📋</div>
                  <h3 className="mb-2 text-2xl font-bold text-gray-400">
                    면접 히스토리가 없습니다
                  </h3>
                  <p className="mb-6 text-gray-500">
                    AI 모의 면접을 시작하여 히스토리를 만들어보세요
                  </p>
                  <button
                    onClick={onBackToInterview}
                    className="px-8 py-3 font-semibold text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    AI 모의 면접 시작하기
                  </button>
                </div>
              ) : (
                <>
                  {/* 히스토리 목록 - 스크롤 가능 */}
                  <div className="p-6 bg-white border-2 border-blue-400 rounded-2xl">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <h3 className="text-xl font-bold">면접 히스토리 목록</h3>
                        <span className="text-sm text-gray-600">
                          총 {interviewHistories.length}개의 면접 히스토리
                        </span>
                      </div>
                      {/* 전체 삭제 버튼 */}
                      <button
                        onClick={handleClearAll}
                        className="px-4 py-2 text-sm font-semibold text-red-600 transition border-2 border-red-600 rounded-lg hover:bg-red-50"
                      >
                        전체 삭제
                      </button>
                    </div>

                    {/* 스크롤 가능한 컨테이너 */}
                    <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2">
                      {interviewHistories.map((history) => (
                        <div
                          key={history.id}
                          className="p-5 transition border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 cursor-pointer"
                          onClick={() => handleViewHistory(history.id)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <span
                                  className={`px-4 py-1.5 text-base font-bold rounded-lg ${
                                    history.level === "주니어"
                                      ? "bg-blue-100 text-blue-700"
                                      : "bg-purple-100 text-purple-700"
                                  }`}
                                >
                                  {history.level}
                                </span>
                                <span
                                  className={`px-3 py-1 text-sm font-semibold border-2 rounded-full ${getScoreColor(
                                    history.score
                                  )}`}
                                >
                                  {history.score}점
                                </span>
                                <span
                                  className={`px-3 py-1 text-sm font-semibold rounded-full ${
                                    history.result === "합격"
                                      ? "bg-green-100 text-green-700"
                                      : "bg-red-100 text-red-700"
                                  }`}
                                >
                                  {history.result}
                                </span>
                              </div>

                              <div className="flex items-center gap-2 mb-3">
                                <span className="text-xl">✓</span>
                                <span className="text-base font-semibold text-gray-900">
                                  {history.qaList.length}개의 질문-답변
                                </span>
                              </div>

                              <div className="flex items-center gap-6 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                  <span>📅</span>
                                  <span>{history.date}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span>🕐</span>
                                  <span>{history.time}</span>
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewHistory(history.id);
                              }}
                              className="flex items-center gap-2 px-4 py-2 ml-4 text-blue-600 transition rounded-lg hover:bg-blue-100"
                            >
                              상세보기
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 액션 버튼 */}
                  <div className="flex justify-center">
                    <button
                      onClick={onBackToInterview}
                      className="px-8 py-3 font-semibold text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                      새 모의 면접 시작
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
