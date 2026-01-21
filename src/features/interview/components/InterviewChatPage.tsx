import { useState, useRef, useEffect } from 'react';
import InterviewSidebar from './InterviewSidebar';
import { useApp } from '../../../context/AppContext';

interface Message {
  id: number;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

interface InterviewChatPageProps {
  onBack: () => void;
  level: 'junior' | 'senior';
  activeMenu?: string;
  onMenuClick?: (menuId: string) => void;
}

export default function InterviewChatPage({ 
  onBack, 
  level,
  activeMenu = "interview-sub-2",
  onMenuClick,
}: InterviewChatPageProps) {
  const { addInterviewResult, addInterviewHistory } = useApp();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'ai',
      text: '안녕하세요! AI 면접관입니다. 편안하게 답변해 주시기 바랍니다. 준비되셨나요?',
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [startTime] = useState(Date.now());
  const [userAnswerCount, setUserAnswerCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  
  // 질문-답변 쌍 저장용 (히스토리에 저장할 데이터)
  const [qaList, setQaList] = useState<Array<{question: string, answer: string, score: number}>>([]);
  const [currentQA, setCurrentQA] = useState<{question: string, answer: string} | null>(null);

  // 난이도에 따른 질문 수
  const totalQuestions = level === 'junior' ? 5 : 7;

  // 사용자가 스크롤을 위로 올렸는지 확인
  const handleScroll = () => {
    if (!chatContainerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 50; // 50px 여유
    
    setIsUserScrolling(!isAtBottom);
  };

  const scrollToBottom = () => {
    // 사용자가 스크롤을 위로 올린 상태면 자동 스크롤 하지 않음
    if (!isUserScrolling) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 메시지가 추가될 때 조건부 스크롤 (AI 응답일 때만)
  useEffect(() => {
    // 마지막 메시지가 AI 메시지이고, 사용자가 하단에 있을 때만 스크롤
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.sender === 'ai' && !isUserScrolling) {
      scrollToBottom();
    }
  }, [messages, isUserScrolling]);

  // 면접 완료 처리
  const handleCompleteInterview = () => {
    // 소요 시간 계산 (분 단위)
    const duration = Math.round((Date.now() - startTime) / 60000);
    const durationText = `${duration}분`;

    // 점수 계산 (랜덤 75-95)
    const score = Math.floor(Math.random() * 21) + 75;
    
    // 좋은 답변 개수 (랜덤)
    const goodAnswers = Math.floor(Math.random() * (totalQuestions - Math.floor(totalQuestions * 0.6))) + Math.floor(totalQuestions * 0.6);

    // 결과 판정 (80점 이상 합격)
    const result = score >= 80 ? "합격" : "불합격";

    // 현재 날짜/시간
    const now = new Date();
    const date = now.toLocaleDateString('ko-KR', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    }).replace(/\. /g, '.').replace(/\.$/, '');
    const time = now.toLocaleTimeString('ko-KR', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });

    const interviewId = Date.now();

    // Context에 면접 결과 저장
    const newResult = {
      id: interviewId,
      date: date,
      time: time,
      level: level === 'junior' ? '주니어' as const : '시니어' as const,
      totalQuestions: totalQuestions,
      goodAnswers: goodAnswers,
      score: score,
      duration: durationText,
      result: result,
    };

    addInterviewResult(newResult);

    // ✅ 면접 히스토리 저장 (질문-답변 상세 포함)
    const newHistory = {
      id: interviewId, // 결과와 동일한 ID 사용
      date: date,
      time: time,
      level: level === 'junior' ? '주니어' as const : '시니어' as const,
      score: score,
      result: result,
      qaList: qaList, // 저장된 질문-답변 리스트
    };

    addInterviewHistory(newHistory);

    // 완료 알림
    alert(`면접이 완료되었습니다!\n점수: ${score}점 (${result})\n소요 시간: ${durationText}`);
    
    // 뒤로 가기
    onBack();
  };

  const handleSend = () => {
    if (!inputText.trim()) return;

    // 사용자 메시지 추가
    const userMessage: Message = {
      id: messages.length + 1,
      sender: 'user',
      text: inputText,
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
    };

    // ✅ 사용자 메시지 추가 시 스크롤 방지
    const prevScrollPos = chatContainerRef.current?.scrollTop || 0;
    setMessages([...messages, userMessage]);
    
    // 입력창 초기화
    setInputText('');
    
    // ✅ 이전 스크롤 위치 유지
    setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = prevScrollPos;
      }
    }, 0);
    
    // ✅ 현재 질문에 대한 답변 저장
    if (currentQA && currentQA.question) {
      const answerScore = Math.floor(Math.random() * 21) + 75; // 75-95점 랜덤
      const completedQA = {
        question: currentQA.question,
        answer: inputText,
        score: answerScore
      };
      setQaList(prev => [...prev, completedQA]);
      setCurrentQA(null); // 현재 QA 초기화
    }
    
    // 사용자 답변 카운트 증가
    const newUserAnswerCount = userAnswerCount + 1;
    setUserAnswerCount(newUserAnswerCount);

    // AI 응답 시뮬레이션 (2초 후)
    setTimeout(() => {
      // 마지막 질문 체크
      if (currentQuestion >= totalQuestions) {
        const finalMessage: Message = {
          id: messages.length + 2,
          sender: 'ai',
          text: '모든 질문이 완료되었습니다. 수고하셨습니다!',
          timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, finalMessage]);
        
        // 3초 후 면접 완료 처리
        setTimeout(() => {
          handleCompleteInterview();
        }, 3000);
        return;
      }

      const aiQuestions = [
        'React에서 useReducer를 사용한 경험은 어떠셨나요? 구체적인 예를 들어주실 수 있나요?',
        'useReducer와 useContext를 사용한 상태 관리가 Redux와 차이가 크지 않다고 생각하시는군요. 각각의 장단점을 비교해 주실 수 있을까요?',
        '좋은 답변입니다. 팀과 협업하면서 어떤 방법들을 사용하셨나요? 구체적인 경험을 들려주시면 감사하겠습니다.',
        '성능 최적화를 위해 어떤 기법들을 사용해 보셨나요?',
        'TypeScript를 프로젝트에 도입한 경험이 있으신가요? 어떤 점이 좋았고, 어려운 점은 무엇이었나요?',
        '코드 리뷰 시 중요하게 생각하는 부분은 무엇인가요?',
        '마지막 질문입니다. 본인의 강점과 앞으로의 목표를 말씀해 주세요.'
      ];

      const nextQuestion = aiQuestions[currentQuestion % aiQuestions.length];
      
      const aiMessage: Message = {
        id: messages.length + 2,
        sender: 'ai',
        text: nextQuestion,
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // ✅ 새로운 질문 저장
      setCurrentQA({ question: nextQuestion, answer: '' });
      
      setCurrentQuestion(prev => prev + 1);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // 사이드바 클릭 시 확인 후 이동
  const handleSidebarClick = (menuId: string) => {
    if (window.confirm("면접을 종료하고 페이지를 이동하시겠습니까?\n진행 중인 면접 내용은 저장되지 않습니다.")) {
      if (onMenuClick) {
        onMenuClick(menuId);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="inline-block mb-6 text-2xl font-bold">모의면접 진행</h2>
        
        <div className="flex gap-6">
          {/* 왼쪽 사이드바 */}
          <InterviewSidebar
            activeMenu={activeMenu}
            onMenuClick={handleSidebarClick}
          />

          {/* 메인 컨텐츠 */}
          <div className="flex-1 space-y-6">
            {/* 헤더 */}
            <div className="bg-white border-2 border-blue-400 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={onBack}
                    className="text-blue-600 hover:text-blue-700 flex items-center gap-2 font-semibold"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    면접 종료
                  </button>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-xl">🤖</span>
                    </div>
                    <div>
                      <h2 className="font-bold text-lg">AI 모의 면접</h2>
                      <p className="text-sm text-gray-500">
                        {level === 'junior' ? '주니어 난이도' : '시니어 난이도'} - 프론트엔드 개발자
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="px-4 py-2 bg-blue-600 text-white rounded-full font-semibold">
                    {currentQuestion}/{totalQuestions} 질문
                  </div>
                  <span className="text-gray-500">
                    {Math.floor((Date.now() - startTime) / 60000).toString().padStart(2, '0')}:
                    {Math.floor(((Date.now() - startTime) % 60000) / 1000).toString().padStart(2, '0')}
                  </span>
                </div>
              </div>
            </div>

            {/* 메시지 영역 */}
            <div 
              ref={chatContainerRef}
              onScroll={handleScroll}
              className="bg-white border-2 border-blue-400 rounded-2xl p-6" 
              style={{ minHeight: '500px', maxHeight: '500px', overflowY: 'auto' }}
            >
              <div className="space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-3 ${
                    message.sender === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  {/* 아바타 */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.sender === 'ai' ? 'bg-blue-500' : 'bg-gray-400'
                    }`}
                  >
                    <span className="text-xl text-white">
                      {message.sender === 'ai' ? '🤖' : '👤'}
                    </span>
                  </div>

                  {/* 메시지 박스 */}
                  <div
                    className={`flex flex-col max-w-2xl ${
                      message.sender === 'user' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div className="text-xs text-gray-500 mb-1">
                      {message.sender === 'ai' ? 'AI 면접관' : '지원자'}
                    </div>
                    <div
                      className={`px-5 py-4 rounded-2xl ${
                        message.sender === 'ai'
                          ? 'bg-white border border-gray-200'
                          : 'bg-blue-600 text-white'
                      }`}
                    >
                      <p className="leading-relaxed">{message.text}</p>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">{message.timestamp}</div>
                  </div>
                </div>
              ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* 입력 영역 */}
            <div className="bg-white border-2 border-blue-400 rounded-2xl p-6">
              <div className="flex items-end gap-3">
              <button className="p-3 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
              
              <div className="flex-1 relative">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="답변을 입력해주세요... (Enter로 전송, Shift+Enter로 줄바꿈)"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl resize-none focus:outline-none focus:border-blue-500"
                  rows={1}
                  style={{
                    minHeight: '50px',
                    maxHeight: '150px'
                  }}
                />
              </div>

              <button
                onClick={handleSend}
                disabled={!inputText.trim()}
                className={`px-6 py-3 rounded-xl font-semibold transition ${
                  inputText.trim()
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                전송
              </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
