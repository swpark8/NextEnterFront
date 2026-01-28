import { useState } from "react";
import Footer from "../../../components/Footer";
import InterviewSidebar from "./InterviewSidebar";
import MockInterviewHistoryPage from "./MockInterviewHistoryPage";
import { useApp } from "../../../context/AppContext";

interface MockInterviewResultPageProps {
  onNavigateToInterview?: () => void;
  activeMenu: string;
  onMenuClick: (menuId: string) => void;
}

export default function MockInterviewResultPage({
  onNavigateToInterview,
  activeMenu,
  onMenuClick,
}: MockInterviewResultPageProps) {
  const [selectedInterviewId, setSelectedInterviewId] = useState<number | null>(
    null,
  );

  // Context에서 실제 면접 결과 데이터 가져오기
  const { interviewResults, clearInterviewResults, clearInterviewHistories } =
    useApp();

  // 전체 삭제 핸들러 (이중 확인)
  const handleClearAll = () => {
    // 첫 번째 확인
    if (
      window.confirm(
        "모든 면접 결과와 히스토리를 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.",
      )
    ) {
      // 두 번째 확인
      if (
        window.confirm(
          "⚠️ 정말 삭제하시겠습니까?\n모든 면접 데이터가 영구적으로 삭제됩니다.",
        )
      ) {
        clearInterviewResults();
        clearInterviewHistories();
        alert("모든 면접 데이터가 삭제되었습니다.");
      }
    }
  };

  // 통계 계산
  const calculateStatistics = () => {
    if (interviewResults.length === 0) {
      return {
        maxScore: 0,
        minScore: 0,
        avgScore: 0,
      };
    }

    const scores = interviewResults.map((record) => record.score);
    const maxScore = Math.max(...scores);
    const minScore = Math.min(...scores);
    const avgScore = Math.round(
      scores.reduce((a, b) => a + b, 0) / scores.length,
    );

    return { maxScore, minScore, avgScore };
  };

  const { maxScore, minScore, avgScore } = calculateStatistics();

  const statistics = [
    {
      title: "최고 점수",
      value: maxScore,
      icon: "📈",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-300",
    },
    {
      title: "최저 점수",
      value: minScore,
      icon: "📉",
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-300",
    },
    {
      title: "평균 점수",
      value: avgScore,
      icon: "📊",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-300",
    },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-50 border-green-300";
    if (score >= 80) return "text-blue-600 bg-blue-50 border-blue-300";
    if (score >= 70) return "text-yellow-600 bg-yellow-50 border-yellow-300";
    return "text-red-600 bg-red-50 border-red-300";
  };

  const handleViewHistory = (id: number) => {
    console.log(`면접 기록 ${id} 히스토리 보기`);
    setSelectedInterviewId(id);
  };

  const handleBackToList = () => {
    setSelectedInterviewId(null);
  };

  const handleNewInterview = () => {
    console.log("새 모의 면접 시작 - InterviewPage로 이동");
    if (onNavigateToInterview) {
      onNavigateToInterview();
    }
  };

  // 히스토리 상세 페이지 표시
  if (selectedInterviewId !== null) {
    return (
      <MockInterviewHistoryPage
        interviewId={selectedInterviewId}
        onBack={handleBackToList}
        activeMenu={activeMenu}
        onMenuClick={onMenuClick}
      />
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="px-4 py-8 mx-auto max-w-7xl">
          {/* AI 모의 면접 타이틀 */}
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-bold">AI 모의 면접 결과</h2>
          </div>

          <div className="flex gap-6">
            {/* 왼쪽 사이드바 */}
            <InterviewSidebar
              activeMenu={activeMenu}
              onMenuClick={onMenuClick}
            />

            {/* 메인 컨텐츠 */}
            <div className="flex-1 space-y-6">
              {interviewResults.length === 0 ? (
                /* 면접 결과 없을 때 */
                <div className="p-16 text-center bg-white border-2 border-gray-200 rounded-2xl">
                  <div className="mb-4 text-6xl">🎤</div>
                  <h3 className="mb-2 text-2xl font-bold text-gray-400">
                    면접 결과가 없습니다
                  </h3>
                  <p className="mb-6 text-gray-500">
                    AI 모의 면접을 시작하여 결과를 확인해보세요
                  </p>
                  <button
                    onClick={handleNewInterview}
                    className="px-8 py-3 font-semibold text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    AI 모의 면접 시작하기
                  </button>
                </div>
              ) : (
                <>
                  {/* 면접 통계 카드 */}
                  <div className="p-6 bg-white border-2 border-blue-400 rounded-2xl">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold">면접 통계</h3>
                      {/* 전체 삭제 버튼 */}
                      <button
                        onClick={handleClearAll}
                        className="px-4 py-2 text-sm font-semibold text-red-600 transition border-2 border-red-600 rounded-lg hover:bg-red-50"
                      >
                        전체 삭제
                      </button>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      {statistics.map((stat, index) => (
                        <div
                          key={index}
                          className={`${stat.bgColor} border-2 ${stat.borderColor} rounded-xl p-6`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="mb-2 text-sm text-gray-600">
                                {stat.title}
                              </p>
                              <p className={`text-4xl font-bold ${stat.color}`}>
                                {stat.value}
                                <span className="ml-1 text-xl">점</span>
                              </p>
                            </div>
                            <div className="flex items-center justify-center w-16 h-16 bg-white rounded-full">
                              <span className="text-3xl">{stat.icon}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 히스토리 바로 아래에 상세 리포트 카드 추가 */}
                  {interviewResults[0]?.detailedReport && (
                    <div className="p-6 bg-white border-2 border-purple-400 rounded-2xl mb-6">
                      <h3 className="text-xl font-bold mb-6">
                        📝 AI 상세 분석 리포트
                      </h3>

                      {/* 역량 점수 & STARR */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div>
                          <h4 className="font-bold text-gray-700 mb-4">
                            핵심 역량 평가
                          </h4>
                          <div className="space-y-3">
                            {Object.entries(
                              interviewResults[0].detailedReport
                                .competency_scores,
                            ).map(([key, score]) => (
                              <div
                                key={key}
                                className="flex items-center gap-4"
                              >
                                <span
                                  className="w-24 font-medium text-gray-600 truncate"
                                  title={key}
                                >
                                  {key}
                                </span>
                                <div className="flex-1 bg-gray-200 rounded-full h-3">
                                  <div
                                    className="bg-purple-600 h-3 rounded-full"
                                    style={{ width: `${(score / 5) * 100}%` }}
                                  ></div>
                                </div>
                                <span className="font-bold text-purple-700">
                                  {score.toFixed(1)}/5.0
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-bold text-gray-700 mb-4">
                            STARR 답변 구조 분석
                          </h4>
                          <div className="grid grid-cols-3 gap-3">
                            {[
                              "situation",
                              "task",
                              "action",
                              "result",
                              "reflection",
                            ].map((key) => {
                              const covered =
                                interviewResults[0].detailedReport
                                  ?.starr_coverage[key];
                              return (
                                <div
                                  key={key}
                                  className={`border-2 rounded-lg p-3 text-center ${covered ? "border-green-400 bg-green-50" : "border-gray-200 bg-gray-50 opacity-50"}`}
                                >
                                  <div
                                    className={`text-2xl mb-1 ${covered ? "" : "grayscale"}`}
                                  >
                                    {key === "situation"
                                      ? "🧩"
                                      : key === "task"
                                        ? "📋"
                                        : key === "action"
                                          ? "🏃"
                                          : key === "result"
                                            ? "🏆"
                                            : "🤔"}
                                  </div>
                                  <div
                                    className={`font-bold capitalize ${covered ? "text-green-700" : "text-gray-400"}`}
                                  >
                                    {key}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          <p className="text-xs text-gray-500 mt-2 text-center">
                            * 답변에 포함된 STARR 요소가 활성화됩니다.
                          </p>
                        </div>
                      </div>

                      {/* 강점 & 보완점 */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-blue-50 p-5 rounded-xl border border-blue-200">
                          <h4 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                            <span>👍</span> 강점 (Strengths)
                          </h4>
                          <ul className="list-disc list-inside space-y-1 text-gray-700">
                            {interviewResults[0].detailedReport.strengths
                              .length > 0 ? (
                              interviewResults[0].detailedReport.strengths.map(
                                (s, i) => <li key={i}>{s}</li>,
                              )
                            ) : (
                              <li className="text-gray-400 list-none">
                                분석된 강점이 없습니다.
                              </li>
                            )}
                          </ul>
                        </div>
                        <div className="bg-orange-50 p-5 rounded-xl border border-orange-200">
                          <h4 className="font-bold text-orange-800 mb-3 flex items-center gap-2">
                            <span>💡</span> 보완점 (Gaps)
                          </h4>
                          <ul className="list-disc list-inside space-y-1 text-gray-700">
                            {interviewResults[0].detailedReport.gaps.length >
                            0 ? (
                              interviewResults[0].detailedReport.gaps.map(
                                (g, i) => <li key={i}>{g}</li>,
                              )
                            ) : (
                              <li className="text-gray-400 list-none">
                                특별한 보완점이 발견되지 않았습니다.
                              </li>
                            )}
                          </ul>
                        </div>
                      </div>

                      {/* 종합 피드백 */}
                      {interviewResults[0].detailedReport.feedback && (
                        <div className="mt-6 p-4 bg-gray-100 rounded-xl">
                          <h4 className="font-bold text-gray-800 mb-2">
                            종합 피드백
                          </h4>
                          <p className="text-gray-700 leading-relaxed">
                            {interviewResults[0].detailedReport.feedback}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 최근 면접 기록 - 스크롤 가능 */}
                  <div className="p-6 bg-white border-2 border-blue-400 rounded-2xl">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold">최근 면접 기록</h3>
                      <span className="text-sm text-gray-600">
                        총 {interviewResults.length}개의 면접 기록
                      </span>
                    </div>

                    {/* 스크롤 가능한 컨테이너 */}
                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                      {interviewResults.map((record) => (
                        <div
                          key={record.id}
                          className="p-5 transition border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <span
                                  className={`px-4 py-1.5 text-base font-bold rounded-lg ${
                                    record.level === "주니어"
                                      ? "bg-blue-100 text-blue-700"
                                      : "bg-purple-100 text-purple-700"
                                  }`}
                                >
                                  {record.level}
                                </span>
                                <span
                                  className={`px-3 py-1 text-sm font-semibold border-2 rounded-full ${getScoreColor(
                                    record.score,
                                  )}`}
                                >
                                  {record.score}점
                                </span>
                                <span
                                  className={`px-3 py-1 text-sm font-semibold rounded-full ${
                                    record.result === "합격"
                                      ? "bg-green-100 text-green-700"
                                      : "bg-red-100 text-red-700"
                                  }`}
                                >
                                  {record.result}
                                </span>
                              </div>

                              <div className="flex items-center gap-2 mb-3">
                                <span className="text-xl">✓</span>
                                <span className="text-base font-semibold text-gray-900">
                                  {record.totalQuestions}개 질문 중{" "}
                                  {record.goodAnswers}개 질문에 대한 좋은 답변
                                </span>
                              </div>

                              <div className="flex items-center gap-6 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                  <span>📅</span>
                                  <span>{record.date}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span>🕐</span>
                                  <span>{record.time}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span>⏱️</span>
                                  <span>소요시간: {record.duration}</span>
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={() => handleViewHistory(record.id)}
                              className="flex items-center gap-2 px-4 py-2 ml-4 text-blue-600 transition rounded-lg hover:bg-blue-100"
                            >
                              히스토리
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

                  {/* 액션 버튼 - 새 모의 면접만 표시 */}
                  <div className="flex justify-center">
                    <button
                      onClick={handleNewInterview}
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
      <Footer />
    </>
  );
}
