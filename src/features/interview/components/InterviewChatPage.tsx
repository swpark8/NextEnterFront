import { useState, useRef, useEffect } from 'react';

interface Message {
  id: number;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

interface InterviewChatPageProps {
  onBack: () => void;
  level: 'junior' | 'senior';
}

export default function InterviewChatPage({ onBack, level }: InterviewChatPageProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'ai',
      text: '안녕하세요! AI 면접관입니다. 편안하게 답변해 주시기 바랍니다. 준비되셨나요?',
      timestamp: '오전 9:41'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    // 사용자 메시지 추가
    const userMessage: Message = {
      id: messages.length + 1,
      sender: 'user',
      text: inputText,
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, userMessage]);
    setInputText('');

    // AI 응답 시뮬레이션 (2초 후)
    setTimeout(() => {
      const aiResponses = [
        '좋습니다. 잘 답변하셨습니다.',
        'React에서 useReducer를 사용한 경험은 어떠셨나요? 구체적인 예를 들어주실 수 있나요?',
        'useReducer와 useContext를 사용한 상태 관리가 Redux와 차이가 크지 않다고 생각하시는군요. 각각의 장단점을 비교해 주실 수 있을까요?',
        '좋은 답변입니다. 다 같이 협업하면 위한 이런 방법들을 사용하셨나요? 구체적인 경험을 들려주시면 감사하겠습니다.',
        '흥륭합니다. 마지막 질문입니다.'
      ];

      const aiMessage: Message = {
        id: messages.length + 2,
        sender: 'ai',
        text: aiResponses[currentQuestion % aiResponses.length],
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMessage]);
      setCurrentQuestion(prev => prev + 1);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="bg-white border-2 border-blue-400 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="text-blue-600 hover:text-blue-700 flex items-center gap-2 font-semibold"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                뒤로가기
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
                1/3 질문
              </div>
              <span className="text-gray-500">05:41</span>
            </div>
          </div>
        </div>

        {/* 메시지 영역 */}
        <div className="bg-white border-2 border-blue-400 rounded-2xl p-6 mb-6" style={{ minHeight: '600px', maxHeight: '600px', overflowY: 'auto' }}>
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
  );
}
