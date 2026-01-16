import Footer from "../components/Footer";
import { useApp } from "../context/AppContext";
import type { InterviewOffer } from "../context/AppContext";

interface ApplicantDetailPageProps {
  applicantId?: number;
  onBackClick?: () => void;
  onLogoClick?: () => void;
  onCompatibilityClick?: (applicantId: number) => void;
}

export default function ApplicantDetailPage({
  applicantId = 1,
  onBackClick,
  onLogoClick,
  onCompatibilityClick,
}: ApplicantDetailPageProps) {
  const { addInterviewOffer } = useApp();
  
  // 지원자 상세 데이터 (실제로는 API에서 가져올 데이터)
  const applicantData = {
    1: {
      name: "김민준",
      email: "kiminjun.com@gmail.com",
      experience: "3년 경력",
      totalScore: 93,
      scores: {
        skill: 95,
        job: 92,
        experience: 90,
        project: 96,
      },
      strengths: [
        { name: "React & TypeScript", score: 95 },
        { name: "Node.js & Express", score: 89 },
        { name: "Next.js", score: 93 },
      ],
      aiAnalysis: [
        {
          type: "positive",
          text: "핵심 역량 매칭: React, TypeScript, Next.js 등 기술 스택과 완벽한 일치하며 직접적 실무 경험을 보유하고 있습니다.",
        },
        {
          type: "info",
          text: "우수한 프로젝트 경험: 대규모 서비스 운영과 개발 경험이 있으며, GraphQL, Kubernetes를 활용한 마이크로서비스 아키텍처 구축 등 다양한 경험을 보유하고 있습니다.",
        },
        {
          type: "warning",
          text: "성장 가능성: 빠른 기술 스택별 지속 학습과 적응도 기술 분야 신흥을 보여주는 성장 역량이 우수합니다.",
        },
      ],
    },
    2: {
      name: "이서윤",
      email: "leeseoyun@email.com",
      experience: "3년 경력",
      totalScore: 88,
      scores: {
        skill: 90,
        job: 88,
        experience: 85,
        project: 89,
      },
      strengths: [
        { name: "Vue.js & JavaScript", score: 92 },
        { name: "CSS & Tailwind", score: 88 },
        { name: "Webpack", score: 85 },
      ],
      aiAnalysis: [
        {
          type: "positive",
          text: "프론트엔드 전문성: Vue.js 생태계에 대한 깊은 이해와 실무 경험을 보유하고 있습니다.",
        },
        {
          type: "info",
          text: "디자인 시스템 구축: 재사용 가능한 컴포넌트 라이브러리 구축 경험이 있습니다.",
        },
        {
          type: "warning",
          text: "React 학습 필요: 현재 프로젝트에서 주로 사용하는 React에 대한 추가 학습이 필요할 수 있습니다.",
        },
      ],
    },
  };

  const data =
    applicantData[applicantId as keyof typeof applicantData] ||
    applicantData[1];

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    }
  };

  const handleLogoClick = () => {
    if (onLogoClick) {
      onLogoClick();
    }
  };

  const handleCompatibilityClick = () => {
    if (onCompatibilityClick) {
      onCompatibilityClick(applicantId);
    }
  };

  const handleInterviewRequest = () => {
    if (window.confirm(`${data.name}님에게 면접 요청을 하시겠습니까?`)) {
      // 면접 제안 데이터 생성
      const newInterviewOffer: InterviewOffer = {
        id: Date.now(),
        company: "(주)등록기업", // 실제로는 기업명을 저장해야 함
        position: "프론트엔드 개발자", // 실제로는 공고 정보에서 가져와야 함
        date: new Date().toISOString().split('T')[0],
        status: "면접 대기",
        content: `안녕하세요 ${data.name}님, (주)등록기업 채용 담당자입니다.\n\n귀하의 이력서를 보고 큰 인상을 받아 면접 제안을 드립니다. 저희 팀과 적합한 분이라고 판단되며, 자세한 내용은 면접에서 말씩드리고 싶습니다.`,
        location: "서울특별시 강남구 테헤란로 123", // 실제로는 기업 위치
        jobId: undefined, // 실제 공고 ID
      };
      
      // AppContext에 면접 제안 추가
      addInterviewOffer(newInterviewOffer);
      
      alert("면접 요청이 성공적으로 전송되었습니다.\n개인 회원은 '받은 제안' 페이지에서 확인할 수 있습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-4 py-4 mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            {/* 왼쪽: 뒤로가기 + 로고 */}
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackClick}
                className="text-2xl text-gray-600 transition hover:text-gray-900"
              >
                ←
              </button>
              <div
                onClick={handleLogoClick}
                className="transition-opacity cursor-pointer hover:opacity-80"
              >
                <span className="text-xl font-bold text-blue-600">Next </span>
                <span className="text-xl font-bold text-blue-800">Enter</span>
              </div>
            </div>

            {/* 오른쪽: 메뉴 */}
            <div className="flex items-center space-x-6">
              <button className="text-gray-600 hover:text-gray-900">
                대시보드
              </button>
              <button className="text-gray-600 hover:text-gray-900">
                채용관리
              </button>
              <button
                onClick={handleLogoClick}
                className="px-4 py-2 text-gray-700 transition bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                개인 회원
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <div className="max-w-5xl px-4 py-8 mx-auto">
        <div className="p-8 bg-white border-4 border-purple-500 shadow-lg rounded-2xl">
          {/* 상단: 뒤로가기 & 보호모드 */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handleBackClick}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <span>←</span>
              <span>뒤로가기</span>
            </button>
            <span className="text-sm text-gray-500">보호모드</span>
          </div>

          {/* 지원자 프로필 & 종합 점수 */}
          <div className="flex items-start justify-between mb-8">
            {/* 왼쪽: 프로필 */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-16 h-16 text-2xl font-bold text-white rounded-full bg-gradient-to-br from-blue-500 to-blue-600">
                {data.name.charAt(0)}
              </div>
              <div>
                <h1 className="mb-1 text-2xl font-bold text-gray-900">
                  {data.name}
                </h1>
                <p className="flex items-center space-x-1 text-sm text-gray-500">
                  <span>📧</span>
                  <span>{data.email}</span>
                </p>
                <p className="text-sm text-gray-500">🏢 {data.experience}</p>
              </div>
            </div>

            {/* 오른쪽: 종합 점수 */}
            <div className="text-right">
              <div className="text-5xl font-bold text-blue-600">
                {data.totalScore}
              </div>
              <div className="text-sm text-gray-500">종합 / 100점</div>
            </div>
          </div>

          {/* 상세 점수 */}
          <div className="mb-8">
            <h2 className="mb-4 text-lg font-bold text-gray-900">상세 점수</h2>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="mb-2 text-sm text-gray-500">스킬 평가</div>
                <div className="pb-2 text-3xl font-bold text-blue-600 border-b-4 border-blue-600">
                  {data.scores.skill}
                </div>
              </div>
              <div className="text-center">
                <div className="mb-2 text-sm text-gray-500">직무 평가</div>
                <div className="pb-2 text-3xl font-bold text-blue-600 border-b-4 border-blue-600">
                  {data.scores.job}
                </div>
              </div>
              <div className="text-center">
                <div className="mb-2 text-sm text-gray-500">경험 평가</div>
                <div className="pb-2 text-3xl font-bold text-blue-600 border-b-4 border-blue-600">
                  {data.scores.experience}
                </div>
              </div>
              <div className="text-center">
                <div className="mb-2 text-sm text-gray-500">프로젝트 평가</div>
                <div className="pb-2 text-3xl font-bold text-blue-600 border-b-4 border-blue-600">
                  {data.scores.project}
                </div>
              </div>
            </div>
          </div>

          {/* 강점 스킬 */}
          <div className="mb-8">
            <h2 className="mb-4 text-lg font-bold text-gray-900">강점 스킬</h2>
            <div className="space-y-3">
              {data.strengths.map((skill, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 border-l-4 border-blue-500 rounded-lg bg-gray-50"
                >
                  <span className="font-medium text-gray-900">
                    {skill.name}
                  </span>
                  <span className="px-4 py-1 font-bold text-white bg-blue-600 rounded-full">
                    {skill.score}점
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* AI 적합도 분석 */}
          <div className="mb-8">
            <h2 className="mb-4 text-lg font-bold text-gray-900">
              AI 적합도 분석
            </h2>
            <div className="space-y-3">
              {data.aiAnalysis.map((analysis, idx) => (
                <div
                  key={idx}
                  className={`flex items-start space-x-3 p-4 rounded-lg ${
                    analysis.type === "positive"
                      ? "bg-green-50"
                      : analysis.type === "info"
                      ? "bg-blue-50"
                      : "bg-orange-50"
                  }`}
                >
                  <span className="flex-shrink-0 text-xl">
                    {analysis.type === "positive"
                      ? "✓"
                      : analysis.type === "info"
                      ? "ℹ"
                      : "⚠"}
                  </span>
                  <p className="text-sm leading-relaxed text-gray-700">
                    {analysis.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 하단 버튼 */}
          <div className="flex gap-4">
            <button
              onClick={handleInterviewRequest}
              className="flex-1 px-6 py-3 font-semibold text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              면접 요청
            </button>
            <button
              onClick={handleCompatibilityClick}
              className="flex-1 px-6 py-3 font-semibold text-gray-700 transition bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              적합성 상세
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
