import { useState, useEffect } from "react";
// ✅ [수정] LeftSidebar 사용
import LeftSidebar from "../../../components/LeftSidebar";
import { useAuth } from "../../../context/AuthContext";
import {
  interviewService,
  InterviewResultDTO,
} from "../../../api/interviewService";

interface MockInterviewHistoryPageProps {
  interviewId: number;
  onBack: () => void;
  activeMenu: string;
  onMenuClick: (menuId: string) => void;
}

interface InterviewQA {
  question: string;
  answer: string;
  score: number;
}

export default function MockInterviewHistoryPage({
  interviewId,
  onBack,
  activeMenu,
  onMenuClick,
}: MockInterviewHistoryPageProps) {
  // API 데이터 상태
  const [interview, setInterview] = useState<InterviewResultDTO | null>(null);
  const [qaList, setQaList] = useState<InterviewQA[]>([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  // API 호출
  useEffect(() => {
    const fetchDetail = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const userIdNum =
          typeof user.userId === "string"
            ? parseInt(user.userId)
            : user.userId || 1;
        const data = await interviewService.getInterviewResult(
          userIdNum,
          interviewId,
        );
        setInterview(data);

        // 메시지 가공 (Flat -> Q&A Pairs)
        const groupedQA: InterviewQA[] = [];
        // 턴 1부터 시작
        const maxTurn = data.currentTurn;

        for (let i = 1; i <= maxTurn; i++) {
          const qMsg = data.messages.find(
            (m) => m.turnNumber === i && m.role === "INTERVIEWER",
          );
          const aMsg = data.messages.find(
            (m) =>
              m.turnNumber === i &&
              (m.role === "APPLICANT" || m.role === "user"),
          ); // user for compatibility

          if (qMsg) {
            groupedQA.push({
              question: qMsg.message,
              answer: aMsg ? aMsg.message : "(답변 없음)",
              score: data.finalScore, // 개별 점수가 없으므로 전체 점수 표시 혹은 숨김
            });
          }
        }
        setQaList(groupedQA);
      } catch (error) {
        console.error("Failed to fetch interview detail:", error);
        setInterview(null); // Ensure interview is null if fetch fails
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [user, interviewId]);

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-blue-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  // 로딩 중
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl font-bold text-gray-500">
          데이터를 불러오는 중...
        </div>
      </div>
    );
  }

  // 면접 히스토리가 없으면 빈 화면 표시
  if (!interview) {
    return (
      <>
        <div className="min-h-screen bg-white">
          <div className="px-4 py-8 mx-auto max-w-7xl">
            {/* ✅ [수정] 제목(h2) 제거 (사이드바 타이틀로 이동) */}

            {/* ✅ [수정] 레이아웃 변경: items-start + gap-6 */}
            <div className="flex items-start gap-6">
              {/* ✅ [수정] LeftSidebar 교체 & Title 적용 */}
              <LeftSidebar
                title="AI 모의 면접 히스토리"
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

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="px-4 py-8 mx-auto max-w-7xl">
          <div className="flex items-start gap-6">
            <LeftSidebar
              title="AI 모의 면접 히스토리"
              activeMenu={activeMenu}
              onMenuClick={onMenuClick}
            />

            <div className="flex-1 space-y-6">
              {/* 상단 헤더: 뒤로가기 + 요약 정보 */}
              <div className="flex items-center justify-between">
                <button
                  onClick={onBack}
                  className="flex items-center gap-2 text-gray-600 transition hover:text-blue-600"
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
                      d="M10 19l-7-7 7-7"
                    />
                  </svg>
                  <span className="font-semibold">목록으로</span>
                </button>

                <div className="flex items-center gap-4">
                  <span className="text-gray-500">
                    {new Date(interview.createdAt).toLocaleDateString()}{" "}
                    {new Date(interview.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <div
                    className={`px-4 py-2 font-bold rounded-lg ${
                      interview.difficulty === "JUNIOR"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-purple-100 text-purple-700"
                    }`}
                  >
                    {interview.difficulty === "JUNIOR" ? "주니어" : "시니어"}
                  </div>
                </div>
              </div>

              {/* 점수 및 결과 카드 */}
              <div className="p-8 bg-white shadow-sm rounded-2xl">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h1 className="mb-2 text-3xl font-bold text-gray-900">
                      면접 결과 분석
                    </h1>
                    <p className="text-gray-500">
                      AI 면접관이 분석한 나의 역량 평가입니다
                    </p>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-5xl font-bold mb-2 ${getScoreColor(interview.finalScore)}`}
                    >
                      {interview.finalScore}점
                    </div>
                    <div
                      className={`text-xl font-bold ${
                        interview.status === "COMPLETED"
                          ? interview.finalScore >= 70
                            ? "text-green-600"
                            : "text-red-600"
                          : "text-gray-600"
                      }`}
                    >
                      {interview.status === "COMPLETED"
                        ? interview.finalScore >= 70
                          ? "합격"
                          : "불합격"
                        : "진행중"}
                    </div>
                  </div>
                </div>

                {/* 피드백 메시지 */}
                <div className="p-6 mb-8 bg-blue-50 rounded-xl">
                  <h3 className="mb-3 text-lg font-bold text-blue-900">
                    💡 종합 피드백
                  </h3>
                  <p className="leading-relaxed text-blue-800">
                    {interview.finalFeedback || "피드백 정보가 없습니다."}
                  </p>
                </div>

                {/* 상세 질문 & 답변 리스트 */}
                <div>
                  <h3 className="mb-6 text-xl font-bold text-gray-900">
                    상세 문답 내역
                  </h3>
                  <div className="space-y-6">
                    {qaList.map((qa, idx) => (
                      <div
                        key={idx}
                        className="pb-6 border-b border-gray-100 last:border-0"
                      >
                        {/* AI 질문 */}
                        <div className="flex items-start gap-3 mb-4">
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
                </div>
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
