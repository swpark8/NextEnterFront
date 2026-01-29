import InterviewSidebar from "./InterviewSidebar";
import { useApp } from "../../../context/AppContext";

interface MockInterviewHistoryPageProps {
  interviewId: number;
  onBack: () => void;
  activeMenu: string;
  onMenuClick: (menuId: string) => void;
}

export default function MockInterviewHistoryPage({
  interviewId,
  onBack,
  activeMenu,
  onMenuClick,
}: MockInterviewHistoryPageProps) {
  // Context에서 실제 면접 히스토리 데이터 가져오기
  const { interviewHistories } = useApp();

  // 해당 ID의 면접 히스토리 찾기
  const interview = interviewHistories.find((h) => h.id === interviewId);

  // 면접 히스토리가 없으면 빈 화면 표시
  if (!interview) {
    return (
      <>
        <div className="min-h-screen bg-white">
          <div className="px-4 py-8 mx-auto max-w-7xl">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-2xl font-bold">AI 모의 면접 히스토리</h2>
            </div>

            <div className="flex gap-6">
              <InterviewSidebar
                activeMenu={activeMenu}
                onMenuClick={onMenuClick}
              />

              <div className="flex-1 space-y-6">
                <button
                  onClick={onBack}
                  className="flex items-center gap-2 text-blue-600 transition hover:text-blue-700"
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
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  <span className="font-semibold">결과 목록으로 돌아가기</span>
                </button>

                <div className="p-16 text-center bg-white border-2 border-gray-200 rounded-2xl">
                  <div className="mb-4 text-6xl">🔍</div>
                  <h3 className="mb-2 text-2xl font-bold text-gray-400">
                    면접 히스토리를 찾을 수 없습니다
                  </h3>
                  <p className="mb-6 text-gray-500">
                    해당 면접 기록이 존재하지 않습니다
                  </p>
                  <button
                    onClick={onBack}
                    className="px-8 py-3 font-semibold text-gray-700 transition border-2 border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    목록으로 돌아가기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-blue-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
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
              {/* 뒤로가기 버튼 */}
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-blue-600 transition hover:text-blue-700"
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
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                <span className="font-semibold">결과 목록으로 돌아가기</span>
              </button>

              {/* 면접 정보 카드 */}
              <div className="p-6 bg-white border-2 border-blue-400 rounded-2xl">
                <div className="flex items-center gap-4 mb-4">
                  <span
                    className={`px-4 py-1.5 text-lg font-bold rounded-lg ${
                      interview.level === "주니어"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-purple-100 text-purple-700"
                    }`}
                  >
                    {interview.level}
                  </span>
                  <span className="text-gray-600">
                    {interview.date} {interview.time}
                  </span>
                  <span
                    className={`text-2xl font-bold ${getScoreColor(
                      interview.score
                    )}`}
                  >
                    총점: {interview.score}점
                  </span>
                  <span
                    className={`px-4 py-1.5 text-sm font-semibold rounded-full ${
                      interview.result === "합격"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {interview.result}
                  </span>
                </div>
                <p className="text-gray-600">
                  총 {interview.qaList.length}개의 질문에 답변하셨습니다.
                </p>
              </div>

              {/* 질문-답변 목록 */}
              <div className="space-y-6">
                {interview.qaList.map((qa, index) => (
                  <div
                    key={index}
                    className="p-6 bg-white border-2 border-gray-200 rounded-2xl"
                  >
                    {/* 질문 번호 및 점수 */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                          <span className="text-lg font-bold text-blue-600">
                            Q{index + 1}
                          </span>
                        </div>
                        <span className="text-sm text-gray-600">
                          질문 {index + 1}
                        </span>
                      </div>
                      <div
                        className={`px-4 py-2 rounded-lg font-bold text-lg ${
                          qa.score >= 90
                            ? "bg-green-50 text-green-600"
                            : qa.score >= 80
                            ? "bg-blue-50 text-blue-600"
                            : qa.score >= 70
                            ? "bg-yellow-50 text-yellow-600"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {qa.score}점
                      </div>
                    </div>

                    {/* AI 질문 */}
                    <div className="p-4 mb-4 border-l-4 border-blue-500 rounded-lg bg-blue-50">
                      <div className="flex items-start gap-3">
                        <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full">
                          <span className="text-sm font-bold text-white">
                            AI
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="mb-2 text-sm font-semibold text-blue-900">
                            AI 면접관
                          </p>
                          <p className="leading-relaxed text-gray-800">
                            {qa.question}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* 나의 답변 */}
                    <div className="p-4 border-l-4 border-gray-400 rounded-lg bg-gray-50">
                      <div className="flex items-start gap-3">
                        <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 bg-gray-400 rounded-full">
                          <span className="text-sm font-bold text-white">
                            ME
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="mb-2 text-sm font-semibold text-gray-900">
                            나의 답변
                          </p>
                          <p className="leading-relaxed text-gray-700 whitespace-pre-line">
                            {qa.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 하단 버튼 */}
              <div className="flex justify-center gap-4">
                <button
                  onClick={onBack}
                  className="px-8 py-3 font-semibold text-gray-700 transition border-2 border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  목록으로 돌아가기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
