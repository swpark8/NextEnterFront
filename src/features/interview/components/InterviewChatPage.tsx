import { useState, useRef, useEffect } from "react";
import InterviewSidebar from "./InterviewSidebar";
import InterviewSetup from "./InterviewSetup";
import { useApp } from "../../../context/AppContext";
import { useAuth } from "../../../context/AuthContext";
import {
  interviewService,
} from "../../../api/interviewService";
import { getResumeList } from "../../../api/resume";

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
    currentResume,
    resumes,
    setResumes,
  } = useApp();
  const { user } = useAuth();

  // 단계 관리: 'setup' | 'chat'
  const [step, setStep] = useState<"setup" | "chat">("setup");

  // 선택된 이력서 ID
  const [selectedResumeId, setSelectedResumeId] = useState<number | null>(null);

  // 메시지 상태
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);

  // 인터뷰 진행 상태
  const [startTime] = useState(Date.now());
  const [turnCount, setTurnCount] = useState(0);
  const totalQuestions = level === "junior" ? 5 : 7;

  // 백엔드 인터뷰 ID
  const [realInterviewId, setRealInterviewId] = useState<number | null>(null);

  // 스크롤 관련
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);

  // 1. 초기 로드: 이력서 목록이 없으면 로드
  useEffect(() => {
    const loadResumes = async () => {
      // 이미 resumes가 있고(length > 0) currentResume이 설정되어 있다면 초기값 세팅
      if (resumes.length > 0) {
        if (currentResume && !selectedResumeId) {
          setSelectedResumeId(currentResume.resumeId);
        }
        return;
      }

      if (user?.userId) {
        try {
          const data = await getResumeList(user.userId);
          if (Array.isArray(data)) {
            const contextResumes = data.map((resume) => ({
              id: resume.resumeId,
              title: resume.title,
              industry: resume.jobCategory || "미지정",
              applications: 0,
            }));
            setResumes(contextResumes);

            // 만약 현재 컨텍스트 이력서가 있다면 자동 선택
            if (currentResume) {
              setSelectedResumeId(currentResume.resumeId);
            }
          }
        } catch (error) {
          console.error("이력서 목록 로드 실패:", error);
        }
      }
    };
    loadResumes();
  }, [user?.userId, resumes.length, setResumes, currentResume]);

  // 2. 면접 시작 핸들러
  const handleStartInterview = async (portfolioText: string) => {
    if (!selectedResumeId) {
      alert("이력서를 선택해주세요.");
      return;
    }
    if (!user?.userId) {
      alert("로그인 정보가 없습니다.");
      return;
    }

    setLoading(true);

    try {
      const userIdNum =
        typeof user.userId === "string" ? parseInt(user.userId) : user.userId;

      // (1) Payload 구성 - Minimal data for V2.0 Backend
      const payload = {
        resumeId: selectedResumeId,
        jobCategory: resumes.find(r => r.id === selectedResumeId)?.industry || "backend",
        difficulty: (level === "junior" ? "JUNIOR" : "SENIOR") as "JUNIOR" | "SENIOR",
        portfolioText: portfolioText, // 사용자 입력 포트폴리오 텍스트만 전달
        totalTurns: totalQuestions,
      };

      // (2) API 호출
      const response = await interviewService.startInterview(userIdNum, payload);

      // (3) 상태 업데이트 및 화면 전환
      setRealInterviewId(response.interviewId);

      const welcomeMessage: Message = {
        id: 1,
        sender: "ai",
        text: response.realtime?.next_question || response.question,
        timestamp: new Date().toLocaleTimeString("ko-KR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages([welcomeMessage]);
      setTurnCount(1);
      setStep("chat");
    } catch (error) {
      console.error("면접 시작 오류:", error);
      alert(
        "면접을 시작할 수 없습니다. 이력서 정보를 불러오는데 실패했습니다.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ... scroll handling ...
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

  const handleCompleteInterview = (backendResult?: any) => {
    const duration = Math.round((Date.now() - startTime) / 60000);
    const durationText = `${duration}분`;

    // 백엔드에서 받은 최종 결과 사용 (V2.0 철학)
    const finalScore = backendResult?.finalScore ?? 0;
    const resultStatus = backendResult?.result ?? (finalScore >= 70 ? "합격" : "불합격");
    const finalFeedback = backendResult?.finalFeedback ?? (finalScore >= 70 ? "전반적으로 훌륭한 역량을 보여주셨습니다." : "일부 역량에서 보완이 필요합니다.");

    const now = new Date();
    // ... (날짜 시간 처리 동일)
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

    addInterviewResult({
      id: resultId,
      date,
      time,
      level: level === "junior" ? "주니어" : "시니어",
      totalQuestions: turnCount,
      goodAnswers: Math.floor(turnCount * 0.7),
      score: finalScore,
      duration: durationText,
      result: resultStatus,
      detailedReport: {
        competency_scores: backendResult?.competencyScores ?? {},
        starr_coverage: {},
        strengths: backendResult?.strengths ?? [],
        gaps: backendResult?.gaps ?? [],
        feedback: finalFeedback,
      },
    });

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
          score: finalScore,
        })),
    });

    alert(`면접이 완료되었습니다! 점수: ${finalScore}점 (${resultStatus})`);
    onBack();
  };

  const handleSend = async () => {
    if (!inputText.trim() || loading) return;

    if (!realInterviewId) {
      alert("면접 세션이 초기화되지 않았습니다.");
      return;
    }

    const userIdNum =
      typeof user?.userId === "string"
        ? parseInt(user.userId)
        : user?.userId || 0;

    const userText = inputText;
    setInputText("");

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

    if (turnCount >= totalQuestions) {
      setLoading(true);
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
      const submitPayload = {
        interviewId: realInterviewId,
        answer: userText,
      };

      console.log("🚀 [Frontend Debug] Sending Submit Payload:", submitPayload); // Debug log

      const response = await interviewService.submitAnswer(
        userIdNum,
        submitPayload,
      );

      if (response.isFinished) {
        handleCompleteInterview(response.finalResult);
        return;
      }

      if (response.realtime?.reaction && response.realtime.reaction.text) {
        const reactionMsg: Message = {
          id: messages.length + 2,
          sender: "ai",
          text: `[면접관 반응] ${response.realtime.reaction.text}`,
          timestamp: new Date().toLocaleTimeString("ko-KR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setMessages((prev) => [...prev, reactionMsg]);
      }

      setTimeout(() => {
        const nextQMsg: Message = {
          id: Date.now(),
          sender: "ai",
          text: response.realtime?.next_question || response.question,
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
              if (step === "chat") {
                if (confirm("면접을 종료하시겠습니까? 저장되지 않습니다.")) {
                  if (onMenuClick) onMenuClick(menuId);
                }
              } else {
                if (onMenuClick) onMenuClick(menuId);
              }
            }}
          />

          <div className="flex-1 space-y-6">
            {step === "setup" ? (
              <InterviewSetup
                resumes={resumes}
                selectedResumeId={selectedResumeId}
                onResumeChange={setSelectedResumeId}
                onStart={handleStartInterview}
                isLoading={loading}
              />
            ) : (
              <>
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
                          AI 면접관{" "}
                          {level === "junior" ? "(Junior)" : "(Senior)"}
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
