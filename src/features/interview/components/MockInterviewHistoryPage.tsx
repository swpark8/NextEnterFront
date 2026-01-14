import { useState } from "react";
import Footer from "../../../components/Footer";
import InterviewSidebar from "./InterviewSidebar";

interface QA {
  question: string;
  answer: string;
  score: number;
}

interface InterviewHistoryDetailPageProps {
  interviewId: number;
  onBack: () => void;
}

export default function MockInterviewHistoryPage({
  interviewId,
  onBack,
}: InterviewHistoryDetailPageProps) {
  const [activeMenu] = useState("results");

  // 면접별 질문-답변 데이터
  const interviewDetails: { [key: number]: { 
    level: string; 
    date: string; 
    time: string;
    score: number;
    result: string;
    qaList: QA[] 
  }} = {
    1: {
      level: "주니어",
      date: "2025.01.10",
      time: "14:30",
      score: 92,
      result: "합격",
      qaList: [
        {
          question: "자기소개를 해주세요. 본인의 강점과 약점을 포함해서 말씀해주시면 됩니다.",
          answer: "안녕하세요. 저는 3년차 프론트엔드 개발자입니다. React와 TypeScript를 주로 사용하며, 사용자 경험을 최우선으로 생각하는 개발자입니다. 제 강점은 빠른 학습 능력과 커뮤니케이션 능력입니다. 새로운 기술을 배우는 것을 즐기며, 팀원들과의 협업을 중요하게 생각합니다. 약점은 때때로 완벽주의 성향으로 인해 작은 부분에 너무 많은 시간을 할애하는 경향이 있습니다. 이를 개선하기 위해 우선순위를 정하고 시간 관리를 하는 연습을 하고 있습니다.",
          score: 95,
        },
        {
          question: "프로젝트 중 가장 어려웠던 기술적 문제는 무엇이었고, 어떻게 해결하셨나요?",
          answer: "이전 프로젝트에서 대용량 데이터를 처리하면서 성능 이슈가 발생했습니다. 리스트에 수천 개의 아이템을 렌더링할 때 스크롤이 끊기는 문제였습니다. 이를 해결하기 위해 React의 가상화 라이브러리인 react-window를 도입했고, 무한 스크롤과 lazy loading을 함께 적용했습니다. 그 결과 초기 렌더링 시간을 70% 단축시켰고, 메모리 사용량도 크게 줄일 수 있었습니다.",
          score: 90,
        },
        {
          question: "팀 내에서 의견 충돌이 발생했을 때 어떻게 해결하시나요?",
          answer: "의견 충돌은 다양한 관점이 존재한다는 긍정적인 신호라고 생각합니다. 먼저 상대방의 의견을 경청하고, 각자의 관점이 왜 다른지 이해하려고 노력합니다. 그 후 데이터나 사용자 피드백 같은 객관적인 근거를 바탕으로 토론하며, 필요하다면 프로토타입을 만들어 실제로 비교해봅니다. 최종적으로는 프로젝트의 목표와 사용자 경험에 가장 부합하는 방향으로 결정을 내립니다.",
          score: 88,
        },
        {
          question: "최근에 학습한 새로운 기술이나 개념이 있다면 설명해주세요.",
          answer: "최근에 Next.js의 Server Components와 App Router를 깊이 있게 학습했습니다. 기존의 Client-side Rendering과 달리 서버에서 직접 데이터를 가져와 렌더링하는 방식이 흥미로웠습니다. 이를 통해 초기 로딩 속도를 개선하고 SEO를 최적화할 수 있었습니다. 실제 프로젝트에 적용해본 결과, Lighthouse 점수가 20점 이상 향상되었고, 사용자 만족도도 높아졌습니다.",
          score: 92,
        },
        {
          question: "5년 후 본인의 모습은 어떨 것 같나요? 커리어 목표를 말씀해주세요.",
          answer: "5년 후에는 프론트엔드 아키텍처를 설계하고 주도할 수 있는 시니어 개발자가 되고 싶습니다. 단순히 기능을 구현하는 것을 넘어, 확장 가능하고 유지보수가 쉬운 시스템을 설계하는 능력을 갖추고 싶습니다. 또한 주니어 개발자들을 멘토링하며 팀의 기술적 성장에 기여하고 싶습니다. 궁극적으로는 사용자에게 가치 있는 제품을 만드는 것을 최우선으로 하는 개발자로 성장하고 싶습니다.",
          score: 95,
        },
      ],
    },
    2: {
      level: "주니어",
      date: "2025.01.09",
      time: "10:15",
      score: 88,
      result: "합격",
      qaList: [
        {
          question: "React의 Virtual DOM이 무엇이고, 어떻게 동작하는지 설명해주세요.",
          answer: "Virtual DOM은 실제 DOM의 가벼운 복사본입니다. React는 상태가 변경되면 새로운 Virtual DOM 트리를 생성하고, 이전 트리와 비교하는 diffing 알고리즘을 통해 변경된 부분만 찾아냅니다. 그 후 실제 DOM에 최소한의 변경만 적용하여 성능을 최적화합니다.",
          score: 85,
        },
        {
          question: "useState와 useReducer의 차이점과 언제 각각을 사용해야 하는지 설명해주세요.",
          answer: "useState는 간단한 상태 관리에 적합하고, useReducer는 복잡한 상태 로직이나 여러 하위 값이 있는 경우에 유용합니다. useState는 값을 직접 업데이트하지만, useReducer는 액션을 dispatch하여 reducer 함수에서 상태를 계산합니다. 저는 보통 여러 연관된 상태를 관리하거나 복잡한 업데이트 로직이 필요할 때 useReducer를 사용합니다.",
          score: 90,
        },
        {
          question: "웹 성능 최적화를 위해 어떤 방법들을 사용해보셨나요?",
          answer: "이미지 최적화를 위해 WebP 포맷을 사용하고, lazy loading을 적용했습니다. 코드 스플리팅으로 번들 크기를 줄였고, React.memo와 useMemo를 사용해 불필요한 리렌더링을 방지했습니다. 또한 CDN을 활용하고, Lighthouse를 통해 성능을 모니터링하며 개선했습니다.",
          score: 88,
        },
        {
          question: "REST API와 GraphQL의 차이점을 설명해주세요.",
          answer: "REST API는 여러 엔드포인트를 사용하여 리소스별로 데이터를 가져오지만, GraphQL은 단일 엔드포인트에서 클라이언트가 필요한 데이터만 정확히 요청할 수 있습니다. REST는 over-fetching이나 under-fetching 문제가 있을 수 있지만, GraphQL은 이를 해결할 수 있습니다.",
          score: 85,
        },
        {
          question: "본인만의 코드 작성 철학이나 개발 원칙이 있나요?",
          answer: "가독성과 유지보수성을 최우선으로 생각합니다. 클린 코드를 작성하기 위해 의미 있는 변수명을 사용하고, 함수는 하나의 책임만 갖도록 합니다. 또한 주석보다는 코드 자체로 의도를 표현하려고 노력하며, 테스트 코드 작성을 통해 코드의 안정성을 확보합니다.",
          score: 92,
        },
      ],
    },
    // 나머지 ID들에 대한 기본 데이터
  };

  const interview = interviewDetails[interviewId] || {
    level: "주니어",
    date: "2025.01.01",
    time: "10:00",
    score: 85,
    result: "합격",
    qaList: [
      {
        question: "샘플 질문 1",
        answer: "샘플 답변 1",
        score: 85,
      },
      {
        question: "샘플 질문 2",
        answer: "샘플 답변 2",
        score: 85,
      },
      {
        question: "샘플 질문 3",
        answer: "샘플 답변 3",
        score: 85,
      },
      {
        question: "샘플 질문 4",
        answer: "샘플 답변 4",
        score: 85,
      },
      {
        question: "샘플 질문 5",
        answer: "샘플 답변 5",
        score: 85,
      },
    ],
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-blue-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="px-4 py-8 mx-auto max-w-7xl">
          {/* 목록 헤더 */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="inline-block pb-2 text-2xl font-bold text-blue-600 border-b-4 border-blue-600">
              목록
            </h1>
          </div>

          {/* AI 모의 면접 타이틀 */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg">
              <span className="text-2xl">🎤</span>
            </div>
            <h2 className="text-2xl font-bold">AI 모의 면접 히스토리</h2>
          </div>

          <div className="flex gap-6">
            {/* 왼쪽 사이드바 */}
            <InterviewSidebar
              activeMenu={activeMenu}
              onMenuClick={() => {}}
            />

            {/* 메인 컨텐츠 */}
            <div className="flex-1 space-y-6">
              {/* 뒤로가기 버튼 */}
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition"
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

              {/* 면접 정보 카드 */}
              <div className="p-6 bg-white border-2 border-blue-400 rounded-2xl">
                <div className="flex items-center gap-4 mb-4">
                  <span
                    className={`px-4 py-1.5 text-lg font-bold rounded-lg ${
                      interview.level === "주니어"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-purple-100 text-purple-700"
                    }`}
                  >
                    {interview.level}
                  </span>
                  <span className="text-gray-600">
                    {interview.date} {interview.time}
                  </span>
                  <span className={`text-2xl font-bold ${getScoreColor(interview.score)}`}>
                    총점: {interview.score}점
                  </span>
                  <span
                    className={`px-4 py-1.5 text-sm font-semibold rounded-full ${
                      interview.result === "합격"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {interview.result}
                  </span>
                </div>
                <p className="text-gray-600">
                  총 {interview.qaList.length}개의 질문에 답변하셨습니다.
                </p>
              </div>

              {/* 질문-답변 목록 */}
              <div className="space-y-6">
                {interview.qaList.map((qa, index) => (
                  <div
                    key={index}
                    className="p-6 bg-white border-2 border-gray-200 rounded-2xl"
                  >
                    {/* 질문 번호 및 점수 */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                          <span className="text-lg font-bold text-blue-600">
                            Q{index + 1}
                          </span>
                        </div>
                        <span className="text-sm text-gray-600">
                          질문 {index + 1}
                        </span>
                      </div>
                      <div
                        className={`px-4 py-2 rounded-lg font-bold text-lg ${
                          qa.score >= 90
                            ? "bg-green-50 text-green-600"
                            : qa.score >= 80
                            ? "bg-blue-50 text-blue-600"
                            : qa.score >= 70
                            ? "bg-yellow-50 text-yellow-600"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {qa.score}점
                      </div>
                    </div>

                    {/* AI 질문 */}
                    <div className="p-4 mb-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">AI</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-blue-900 mb-2">
                            AI 면접관
                          </p>
                          <p className="text-gray-800 leading-relaxed">
                            {qa.question}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* 나의 답변 */}
                    <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-gray-400">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">ME</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900 mb-2">
                            나의 답변
                          </p>
                          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                            {qa.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
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
      <Footer />
    </>
  );
}
