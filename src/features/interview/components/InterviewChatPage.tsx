import { useState, useRef, useEffect } from "react";
import InterviewSidebar from "./InterviewSidebar";
import { useApp } from "../../../context/AppContext";
import {
  interviewService,
  InterviewReport,
  InterviewRequest,
} from "../../../api/interviewService";

interface Message {
  id: number;
  sender: "ai" | "user";
  text: string;
  timestamp: string;
}

interface InterviewChatPageProps {
  onBack: () => void;
  level: "junior" | "senior";
  activeMenu?: string;
  onMenuClick?: (menuId: string) => void;
}

export default function InterviewChatPage({
  onBack,
  level,
  activeMenu = "interview-sub-2",
  onMenuClick,
}: InterviewChatPageProps) {
  const {
    addInterviewResult,
    addInterviewHistory,
    detailedResumes,
    currentResume,
  } = useApp();

  // 메시지 상태
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);

  // 인터뷰 진행 상태
  const [interviewId] = useState(Date.now().toString());
  const [startTime] = useState(Date.now());
  const [turnCount, setTurnCount] = useState(0);
  const totalQuestions = level === "junior" ? 5 : 7;

  // 리포트 누적 (매 턴마다 AI가 분석한 결과)
  const [reports, setReports] = useState<InterviewReport[]>([]);

  // 스크롤 관련
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);

  // 이력서 데이터 매핑
  const getInterviewPayload = (): InterviewRequest => {
    // 1순위: 현재 선택된 이력서, 2순위: 목록의 첫번째 이력서
    const targetResume =
      currentResume || (detailedResumes.length > 0 ? detailedResumes[0] : null);

    if (!targetResume) {
      // 이력서가 아예 없는 경우 기본값
      return {
        id: interviewId,
        target_role: "frontend",
        resume_content: {
          skills: { essential: [], additional: [] },
        },
      };
    }

    // ResumeSections -> InterviewRequest 매핑
    const skills = targetResume.skills || []; // 문자열 배열이라고 가정 (DetailedResume 정의 참조)

    // 섹션 데이터 파싱 (JSON 문자열일 수 있으므로 주의 필요했으나, AppContext 타입을 보니 객체로 되어있음.
    // 하지만 DetailedResume의 sections는 ResumeSections 타입이므로 바로 사용 가능.)
    const sections = targetResume.sections;

    return {
      id: interviewId,
      target_role: targetResume.jobCategory || "frontend",
      resume_content: {
        skills: {
          essential: skills,
          additional: [],
        },
        professional_experience:
          sections.experiences?.map((exp) => ({
            role: exp.title || "Unknown Role",
            period: exp.period || "",
            key_tasks: exp.content ? [exp.content] : [],
          })) || [],
        education:
          sections.educations?.map((edu) => ({
            major: edu.school || "", // 전공 필드가 없으면 학교명이라도
          })) || [],
      },
    };
  };

  // 초기 실행: 첫 질문 가져오기
  useEffect(() => {
    const startInterview = async () => {
      setLoading(true);
      try {
        const payload = getInterviewPayload();
        // 첫 요청에는 last_answer 없음
        const response = await interviewService.getNextQuestion(payload);

        const welcomeMessage: Message = {
          id: 1,
          sender: "ai",
          text: response.realtime.next_question,
          timestamp: new Date().toLocaleTimeString("ko-KR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setMessages([welcomeMessage]);
        setTurnCount(1);
      } catch (error) {
        console.error("면접 시작 실패:", error);
        setMessages([
          {
            id: 1,
            sender: "ai",
            text: "죄송합니다. 서버 연결에 실패하여 면접을 시작할 수 없습니다.",
            timestamp: new Date().toLocaleTimeString(),
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    startInterview();
  }, []); // Mount 시 1회 실행

  // 스크롤 핸들링
  const handleScroll = () => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
    setIsUserScrolling(!isAtBottom);
  };

  const scrollToBottom = () => {
    if (!isUserScrolling) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.sender === "ai" && !isUserScrolling) {
      scrollToBottom();
    }
  }, [messages, isUserScrolling]);

  // 완료 처리
  const handleCompleteInterview = () => {
    const duration = Math.round((Date.now() - startTime) / 60000);
    const durationText = `${duration}분`;

    // 점수 합산 (단순 평균)
    let totalScore = 0;
    let validReports = 0;
    const competencySums: Record<string, number> = {};
    const starrCoverage: Record<string, boolean> = {
      situation: false,
      task: false,
      action: false,
      result: false,
      reflection: false,
    };
    const allStrengths = new Set<string>();
    const allGaps = new Set<string>();

    reports.forEach((report) => {
      if (report.competency_scores) {
        Object.entries(report.competency_scores).forEach(([key, val]) => {
          competencySums[key] = (competencySums[key] || 0) + val;
        });
        validReports++;
      }
      if (report.starr_coverage) {
        Object.entries(report.starr_coverage).forEach(([key, val]) => {
          if (val) starrCoverage[key] = true;
        });
      }
      report.strengths?.forEach((s) => allStrengths.add(s));
      report.gaps?.forEach((g) => allGaps.add(g));
    });

    // 5점 만점 -> 100점 환산
    const avgCompetencyScore =
      validReports > 0
        ? Object.values(competencySums).reduce((a, b) => a + b, 0) /
          (Object.keys(competencySums).length * validReports)
        : 3.5;

    const finalScore = Math.min(100, Math.round(avgCompetencyScore * 20));

    // ✅ 합격 기준 완화 (80 -> 70)
    const resultStatus = finalScore >= 70 ? "합격" : "불합격";

    // 평균 역량 점수 계산
    const finalCompetencyScores: Record<string, number> = {};
    Object.keys(competencySums).forEach((key) => {
      finalCompetencyScores[key] = parseFloat(
        (competencySums[key] / validReports).toFixed(1),
      );
    });

    // 현재 시간
    const now = new Date();
    const date = now
      .toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .replace(/\. /g, ".")
      .replace(/\.$/, "");
    const time = now.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    const resultId = Date.now();

    // 결과 저장
    addInterviewResult({
      id: resultId,
      date,
      time,
      level: level === "junior" ? "주니어" : "시니어",
      totalQuestions: turnCount,
      goodAnswers: Math.floor(turnCount * 0.7), // 임의 추정
      score: finalScore,
      duration: durationText,
      result: resultStatus,
      // 상세 리포트 저장
      detailedReport: {
        competency_scores: finalCompetencyScores,
        starr_coverage: starrCoverage,
        strengths: Array.from(allStrengths),
        gaps: Array.from(allGaps),
        feedback:
          finalScore >= 70
            ? "전반적으로 훌륭한 역량을 보여주셨습니다."
            : "일부 역량에서 보완이 필요합니다. 상세 리포트를 참고하세요.",
      },
    });

    // 히스토리 저장
    addInterviewHistory({
      id: resultId,
      date,
      time,
      level: level === "junior" ? "주니어" : "시니어",
      score: finalScore,
      result: resultStatus,
      qaList: messages
        .filter((m) => m.sender === "user")
        .map((m, idx) => ({
          question:
            messages.find((msg) => msg.id < m.id && msg.sender === "ai")
              ?.text || "질문 없음",
          answer: m.text,
          score: finalScore, // 개별 점수는 리포트 매칭이 복잡하므로 전체 평균 대입
        })),
    });

    alert(`면접이 완료되었습니다! 점수: ${finalScore}점 (${resultStatus})`);
    onBack();
  };

  const handleSend = async () => {
    if (!inputText.trim() || loading) return;

    const userText = inputText;
    setInputText("");

    // 1. 사용자 메시지 표시
    const userMsg: Message = {
      id: messages.length + 1,
      sender: "user",
      text: userText,
      timestamp: new Date().toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => [...prev, userMsg]);

    // 마지막 질문이었으면 종료 처리
    if (turnCount >= totalQuestions) {
      setLoading(true);
      // 마지막 답변도 분석을 위해 보낼 수 있지만, UI상 여기서 마무리 멘트
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: prev.length + 2,
            sender: "ai",
            text: "모든 질문이 완료되었습니다. 수고하셨습니다!",
            timestamp: new Date().toLocaleTimeString("ko-KR", {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);
        setTimeout(handleCompleteInterview, 2000);
      }, 1000);
      return;
    }

    setLoading(true);

    try {
      // 2. AI에게 답변 전송 및 다음 질문 요청
      const payload = getInterviewPayload();
      payload.last_answer = userText;

      const response = await interviewService.getNextQuestion(payload);

      // 리포트 저장
      if (response.realtime.report) {
        setReports((prev) => [...prev, response.realtime.report!]);
      }

      // 3. AI 리액션 (Clarify 등)이 있으면 먼저 표시
      if (response.realtime.reaction && response.realtime.reaction.text) {
        const reactionMsg: Message = {
          id: messages.length + 2, // ID 증가 주의
          sender: "ai",
          text: `[면접관 반응] ${response.realtime.reaction.text}`,
          timestamp: new Date().toLocaleTimeString("ko-KR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        // 리액션 보여주고 잠시 후 다음 질문 보여줄 수도 있고, 바로 보여줄 수도 있음.
        // 여기서는 한 번에 보여주기보다 순차적으로 보여주는 것이 자연스러움.
        setMessages((prev) => [...prev, reactionMsg]);
      }

      // 4. 다음 질문 표시
      setTimeout(() => {
        const nextQMsg: Message = {
          id: Date.now(), // ID 충돌 방지
          sender: "ai",
          text: response.realtime.next_question,
          timestamp: new Date().toLocaleTimeString("ko-KR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setMessages((prev) => [...prev, nextQMsg]);
        setTurnCount((prev) => prev + 1);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("답변 전송 실패:", error);
      setLoading(false);
      alert("서버 통신 중 오류가 발생했습니다.");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="inline-block mb-6 text-2xl font-bold">
          모의면접 진행 (AI Real-time)
        </h2>

        <div className="flex gap-6">
          <InterviewSidebar
            activeMenu={activeMenu}
            onMenuClick={(menuId) => {
              if (confirm("면접을 종료하시겠습니까? 저장되지 않습니다.")) {
                if (onMenuClick) onMenuClick(menuId);
              }
            }}
          />

          <div className="flex-1 space-y-6">
            {/* Header */}
            <div className="bg-white border-2 border-blue-400 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={onBack}
                    className="text-blue-600 hover:scale-105 transition font-semibold flex items-center gap-2"
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
                    나가기
                  </button>
                  <div>
                    <h2 className="font-bold text-lg">
                      AI 면접관 {level === "junior" ? "(Junior)" : "(Senior)"}
                    </h2>
                    <p className="text-sm text-gray-500">
                      실시간 답변 분석 및 꼬리질문 엔진 가동 중
                    </p>
                  </div>
                </div>
                <div className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-bold">
                  Q. {turnCount}/{totalQuestions}
                </div>
              </div>
            </div>

            {/* Chat Area */}
            <div
              ref={chatContainerRef}
              onScroll={handleScroll}
              className="bg-white border-2 border-blue-400 rounded-2xl p-6 h-[500px] overflow-y-auto space-y-4"
            >
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0 ${msg.sender === "ai" ? "bg-blue-100" : "bg-gray-200"}`}
                  >
                    {msg.sender === "ai" ? "🤖" : "👤"}
                  </div>
                  <div
                    className={`max-w-[70%] p-4 rounded-2xl whitespace-pre-wrap ${msg.sender === "ai" ? "bg-gray-50 border border-gray-200 text-gray-800" : "bg-blue-600 text-white"}`}
                  >
                    {msg.text}
                    <div
                      className={`text-xs mt-2 ${msg.sender === "ai" ? "text-gray-400" : "text-blue-200"}`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    🤖
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl text-gray-500 animate-pulse">
                    답변을 분석하고 다음 질문을 생각하는 중입니다...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-white border-2 border-blue-400 rounded-2xl p-4 flex gap-4">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="답변을 입력하세요..."
                className="flex-1 resize-none border-none outline-none p-2 text-lg"
                rows={2}
                disabled={loading}
              />
              <button
                onClick={handleSend}
                disabled={!inputText.trim() || loading}
                className="bg-blue-600 text-white px-8 py-2 rounded-xl font-bold hover:bg-blue-700 disabled:bg-gray-300 transition"
              >
                전송
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
