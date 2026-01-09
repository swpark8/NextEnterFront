import { useState } from "react";

interface MyPageProps {
  onNavigate?: (page: string) => void;
}

export default function MyPage({ onNavigate }: MyPageProps) {
  const [resumeCount] = useState(2);

  const handleClick = (item: string) => {
    console.log(`${item} 클릭됨`);
    
    if (!onNavigate) return;
    
    // 각 항목에 대한 페이지 이동
    switch(item) {
      case '프로필 수정':
        onNavigate('resume'); // 이력서 생성 페이지로 이동
        break;
      case '입사 지원 현황':
        onNavigate('job'); // 입사지원현황 페이지 (홈으로 임시 설정)
        break;
      case '모의 면접':
        onNavigate('interview');
        break;
      case '이력서 열람':
        onNavigate('resume');
        break;
      case 'AI 맞춤 공고':
        onNavigate('ai-recommend');
        break;
      default:
        break;
    }
  };

  const mainCards = [
    { id: 1, title: "입사\n지원\n현황", icon: "📋" },
    { id: 2, title: "모의 면접", icon: "🎤" },
    { id: 3, title: "이력서\n열람", icon: "📄" },
    { id: 4, title: "AI\n맞춤 공고", icon: "🔔" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-8 mx-auto max-w-7xl">
        <div className="flex gap-6">
          {/* 왼쪽 사이드바 */}
          <aside className="w-52">
            <div className="p-6 space-y-4 bg-white border-2 border-purple-500 rounded-lg">
              {/* 프로필 이미지 */}
              <div className="flex flex-col items-center space-y-2">
                <div className="relative flex items-center justify-center w-20 h-20 bg-gray-200 border-2 border-blue-400 rounded-full">
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                  <button 
                    onClick={() => handleClick('프로필 수정')}
                    className="absolute bottom-0 right-0 flex items-center justify-center w-6 h-6 text-xs text-white bg-orange-400 rounded-full hover:bg-orange-500 transition cursor-pointer"
                  >
                    ✏️
                  </button>
                </div>
                <div className="px-8 py-1 border-2 border-blue-400 rounded-full">
                  <span className="text-sm">이름</span>
                </div>
              </div>

              {/* 버튼들 */}
              <button
                onClick={() => handleClick("스크랩 현황")}
                className="flex items-center justify-center w-full gap-2 py-3 transition bg-white border-2 border-blue-400 rounded-lg hover:bg-blue-50"
              >
                <span>⭐</span>
                <span className="font-medium">스크랩 현황</span>
              </button>

              <button
                onClick={() => handleClick("관심 기업")}
                className="flex items-center justify-center w-full gap-2 py-3 transition bg-white border-2 border-blue-400 rounded-lg hover:bg-blue-50"
              >
                <span>🏢</span>
                <span className="font-medium">관심 기업</span>
              </button>
            </div>
          </aside>

          {/* 메인 컨텐츠 */}
          <main className="flex-1">
            {/* 이력서 섹션 */}
            <div className="p-8 mb-6 bg-white border-2 border-blue-500 rounded-lg">
              <h2 className="mb-6 text-2xl font-bold text-center">이력서</h2>

              <div className="grid grid-cols-4 gap-4">
                {mainCards.map((card) => (
                  <button
                    key={card.id}
                    onClick={() => handleClick(card.title.replace(/\n/g, " "))}
                    className="flex flex-col items-center justify-center h-32 p-6 transition bg-white border-2 border-blue-400 rounded-lg cursor-pointer hover:shadow-lg"
                  >
                    <span className="mb-2 text-3xl">{card.icon}</span>
                    <span className="text-sm font-medium text-center whitespace-pre-line">
                      {card.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 내 이력서 섹션 */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">📁</span>
                <h3 className="text-lg font-bold">
                  내 이력서 ({resumeCount}개) &gt;
                </h3>
              </div>

              <div className="space-y-4">
                {/* 이력서 목록 카드 1 */}
                <div className="p-6 bg-white border-2 border-blue-400 rounded-lg">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-bold">이력서 목록</h4>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => onNavigate && onNavigate('resume')}
                        className="px-4 py-2 text-sm bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition cursor-pointer"
                      >
                        수정
                      </button>
                      <button className="px-6 py-2 text-sm text-white transition bg-blue-500 rounded-lg hover:bg-blue-600">
                        이력서 공개
                      </button>
                    </div>
                  </div>
                </div>

                {/* 이력서 목록 카드 2 */}
                <div className="p-6 bg-white border-2 border-blue-400 rounded-lg">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-bold">이력서 목록</h4>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => onNavigate && onNavigate('resume')}
                        className="px-4 py-2 text-sm bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition cursor-pointer"
                      >
                        수정
                      </button>
                      <button className="px-6 py-2 text-sm text-white transition bg-blue-500 rounded-lg hover:bg-blue-600">
                        이력서 공개
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
