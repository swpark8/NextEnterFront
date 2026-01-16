import { useState } from "react";
import InterviewSidebar from "./InterviewSidebar";
import MockInterviewHistoryPage from "./MockInterviewHistoryPage";

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
    null
  );

  // 모의 면접 기록 데이터 - 주니어/시니어 구분 (스크롤 가능하도록 더 많은 데이터)
  const interviewRecords = [
    {
      id: 1,
      date: "2025.01.10",
      time: "14:30",
      level: "주니어",
      totalQuestions: 5,
      goodAnswers: 5,
      score: 92,
      duration: "45분",
      result: "합격",
    },
    {
      id: 2,
      date: "2025.01.09",
      time: "10:15",
      level: "주니어",
      totalQuestions: 5,
      goodAnswers: 4,
      score: 88,
      duration: "50분",
      result: "합격",
    },
    {
      id: 3,
      date: "2025.01.08",
      time: "16:20",
      level: "시니어",
      totalQuestions: 7,
      goodAnswers: 6,
      score: 95,
      duration: "40분",
      result: "합격",
    },
    {
      id: 4,
      date: "2025.01.07",
      time: "11:00",
      level: "시니어",
      totalQuestions: 7,
      goodAnswers: 4,
      score: 67,
      duration: "35분",
      result: "불합격",
    },
    {
      id: 5,
      date: "2025.01.06",
      time: "15:45",
      level: "주니어",
      totalQuestions: 5,
      goodAnswers: 3,
      score: 79,
      duration: "42분",
      result: "합격",
    },
    {
      id: 6,
      date: "2025.01.05",
      time: "09:30",
      level: "주니어",
      totalQuestions: 5,
      goodAnswers: 4,
      score: 85,
      duration: "38분",
      result: "합격",
    },
    {
      id: 7,
      date: "2025.01.04",
      time: "14:20",
      level: "시니어",
      totalQuestions: 7,
      goodAnswers: 5,
      score: 78,
      duration: "52분",
      result: "합격",
    },
    {
      id: 8,
      date: "2025.01.03",
      time: "11:15",
      level: "주니어",
      totalQuestions: 5,
      goodAnswers: 5,
      score: 90,
      duration: "41분",
      result: "합격",
    },
    {
      id: 9,
      date: "2025.01.02",
      time: "16:00",
      level: "시니어",
      totalQuestions: 7,
      goodAnswers: 6,
      score: 93,
      duration: "48분",
      result: "합격",
    },
    {
      id: 10,
      date: "2025.01.01",
      time: "10:30",
      level: "주니어",
      totalQuestions: 5,
      goodAnswers: 2,
      score: 65,
      duration: "35분",
      result: "불합격",
    },
    {
      id: 11,
      date: "2024.12.31",
      time: "15:15",
      level: "시니어",
      totalQuestions: 7,
      goodAnswers: 5,
      score: 82,
      duration: "45분",
      result: "합격",
    },
    {
      id: 12,
      date: "2024.12.30",
      time: "13:40",
      level: "주니어",
      totalQuestions: 5,
      goodAnswers: 4,
      score: 87,
      duration: "39분",
      result: "합격",
    },
  ];

  // 통계 계산
  const scores = interviewRecords.map((record) => record.score);
  const maxScore = Math.max(...scores);
  const minScore = Math.min(...scores);
  const avgScore = Math.round(
    scores.reduce((a, b) => a + b, 0) / scores.length
  );

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
              {/* 면접 통계 카드 */}
              <div className="p-6 bg-white border-2 border-blue-400 rounded-2xl">
                <h3 className="mb-6 text-xl font-bold">면접 통계</h3>
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

              {/* 최근 면접 기록 - 스크롤 가능 */}
              <div className="p-6 bg-white border-2 border-blue-400 rounded-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">최근 면접 기록</h3>
                  <span className="text-sm text-gray-600">
                    총 {interviewRecords.length}개의 면접 기록
                  </span>
                </div>

                {/* 스크롤 가능한 컨테이너 */}
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  {interviewRecords.map((record) => (
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
                                record.score
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
