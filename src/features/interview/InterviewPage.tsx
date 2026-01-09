import { useState } from 'react';
import InterviewSidebar from './components/InterviewSidebar';
import InterviewChatPage from './components/InterviewChatPage';

export default function InterviewPage() {
  const [activeMenu, setActiveMenu] = useState('interview');
  const [selectedLevel, setSelectedLevel] = useState<'junior' | 'senior'>('junior');
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);

  const handleStartInterview = () => {
    console.log(`${selectedLevel} 면접 시작하기 클릭됨`);
    setIsInterviewStarted(true);
  };

  const handleBackToPreparation = () => {
    setIsInterviewStarted(false);
  };

  const handleLevelClick = (level: 'junior' | 'senior') => {
    setSelectedLevel(level);
    console.log(`${level} 선택됨`);
  };

  const handleCreditUsageClick = (id: number) => {
    console.log(`크레딧 사용 내역 ${id} 클릭됨`);
  };

  const creditUsages = [
    { id: 1, title: 'AI 모의 면접 (주니어 차감 - 10)', date: '2025.12.15' },
    { id: 2, title: 'AI 모의 면접 (시니어 차감 - 20)', date: '2024.12.10' },
  ];

  const recentInterviews = [
    { id: 1, title: '1회차 - 주니어 합격(93점)', color: 'text-green-600' },
    { id: 2, title: '1회차 - 주니어 합격(88점)', color: 'text-green-600' },
    { id: 3, title: '1회차 - 시니어 불합격(67점)', color: 'text-red-600' },
    { id: 4, title: '1회차 - 주니어 합격(79점)', color: 'text-green-600' },
  ];

  // 면접이 시작되면 채팅 화면 표시
  if (isInterviewStarted) {
    return (
      <InterviewChatPage 
        onBack={handleBackToPreparation} 
        level={selectedLevel}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 목록 헤더 */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-blue-600 border-b-4 border-blue-600 pb-2 inline-block">
            목록
          </h1>
        </div>

        {/* AI 모의 면접 타이틀 */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
            <span className="text-2xl">🎤</span>
          </div>
          <h2 className="text-2xl font-bold">AI 모의 면접</h2>
        </div>

        <div className="flex gap-6">
          {/* 왼쪽 사이드바 */}
          <InterviewSidebar activeMenu={activeMenu} onMenuClick={setActiveMenu} />

          {/* 메인 컨텐츠 */}
          <div className="flex-1 space-y-6">
            {/* 면접 설정 카드 */}
            <div className="bg-white border-2 border-blue-400 rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-4">면접 설정</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  onClick={() => handleLevelClick('junior')}
                  className={`p-6 rounded-xl border-2 transition ${
                    selectedLevel === 'junior'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-blue-300'
                  }`}
                >
                  <div className="font-bold text-lg mb-1">주니어</div>
                  <div className="text-sm text-gray-600">0~3년 경력</div>
                </button>

                <button
                  onClick={() => handleLevelClick('senior')}
                  className={`p-6 rounded-xl border-2 transition ${
                    selectedLevel === 'senior'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-blue-300'
                  }`}
                >
                  <div className="font-bold text-lg mb-1">시니어</div>
                  <div className="text-sm text-gray-600">4년 이상 경력</div>
                </button>
              </div>

              {/* 면접 시작 박스 */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-8 text-white text-center">
                <div className="mb-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full mx-auto flex items-center justify-center mb-4">
                    <span className="text-4xl">💬</span>
                  </div>
                </div>
                <p className="text-lg mb-6 leading-relaxed">
                  AI 면접관과 실전 같은 면접을 경험하세요
                  <br />
                  난이도를 선택하고 시작 버튼을 눌러주세요
                </p>
                <button
                  onClick={handleStartInterview}
                  className="px-8 py-3 bg-white text-blue-600 rounded-full font-bold hover:bg-blue-50 transition text-lg"
                >
                  면접 시작하기
                </button>
              </div>
            </div>

            {/* 크레딧 사용 내역 */}
            <div className="bg-white border-2 border-blue-400 rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-4">크레딧 사용 내역</h3>
              <div className="space-y-3">
                {creditUsages.map((usage) => (
                  <button
                    key={usage.id}
                    onClick={() => handleCreditUsageClick(usage.id)}
                    className="w-full text-left p-4 border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition"
                  >
                    <div className="font-semibold mb-1">{usage.title}</div>
                    <div className="text-sm text-gray-500">{usage.date}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 오른쪽 사이드 */}
          <div className="w-80 space-y-6">
            {/* 면접 통계 */}
            <div className="bg-white border-2 border-blue-400 rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-4">면접 통계</h3>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="border-2 border-blue-300 rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">최고 점수</div>
                  <div className="text-3xl font-bold text-green-600">93점</div>
                </div>
                <div className="border-2 border-blue-300 rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">최저 점수</div>
                  <div className="text-3xl font-bold text-red-600">67점</div>
                </div>
              </div>

              <div className="border-2 border-blue-300 rounded-lg p-4 text-center">
                <div className="text-sm text-gray-600 mb-1">평균 점수</div>
                <div className="text-3xl font-bold text-blue-600">82점</div>
              </div>
            </div>

            {/* 최근 면접 기록 */}
            <div className="bg-white border-2 border-blue-400 rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-4">최근 면접 기록</h3>
              
              <div className="space-y-3">
                {recentInterviews.map((interview) => (
                  <div
                    key={interview.id}
                    className="p-3 border-2 border-gray-200 rounded-lg"
                  >
                    <div className={`font-medium ${interview.color}`}>
                      {interview.title}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
