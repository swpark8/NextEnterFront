import { useState } from 'react';
import Footer from '../../components/Footer';
import MatchingSidebar from './components/MatchingSidebar';

interface MatchingPageProps {
  onEditResume?: () => void;
}

export default function MatchingPage({ onEditResume }: MatchingPageProps) {
  const [activeMenu, setActiveMenu] = useState('home');
  const [selectedResume, setSelectedResume] = useState('');
  const [selectedJob, setSelectedJob] = useState('');
  const [currentCredit, setCurrentCredit] = useState(200);
  const [hasAnalysis, setHasAnalysis] = useState(false);
  const [matchingScore, setMatchingScore] = useState(0);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // 샘플 이력서 목록
  const resumes = [
    { id: '1', name: '김유연_2025 개발자 이력서' },
    { id: '2', name: '김유연_프론트엔드 포지션' },
    { id: '3', name: '김유연_풀스택 개발자' },
    { id: '4', name: '김유연_신입 개발자 이력서' },
  ];

  // 샘플 공고 목록
  const jobs = [
    { id: '1', name: '네이버 - 프론트엔드 개발자', company: '네이버' },
    { id: '2', name: '카카오 - React 개발자', company: '카카오' },
    { id: '3', name: '토스 - 풀스택 엔지니어', company: '토스' },
    { id: '4', name: '당근마켓 - 웹 개발자', company: '당근마켓' },
    { id: '5', name: '쿠팡 - Frontend Developer', company: '쿠팡' },
  ];

  const handleCreditClick = () => {
    console.log('보유 크레딧 클릭됨');
  };

  const handleAnalyze = () => {
    if (!selectedResume) {
      alert('이력서를 먼저 선택해주세요!');
      return;
    }
    if (!selectedJob) {
      alert('분석할 공고를 선택해주세요!');
      return;
    }
    if (currentCredit < 30) {
      alert('크레딧이 부족합니다!');
      return;
    }

    // 확인 다이얼로그 표시
    setShowConfirmDialog(true);
  };

  const handleConfirmAnalysis = () => {
    console.log('매칭 분석 실행');
    setCurrentCredit(currentCredit - 30);
    
    // 랜덤 점수 생성 (85-95 사이)
    const score = Math.floor(Math.random() * 11) + 85;
    setMatchingScore(score);
    setHasAnalysis(true);
    setShowConfirmDialog(false);
  };

  const handleCancelAnalysis = () => {
    setShowConfirmDialog(false);
  };

  const handleAddResume = () => {
    console.log('이력서 추가하기 클릭됨');
    alert('이력서 작성 페이지로 이동합니다.');
  };

  // 지원 적합 여부 결정
  const getSuitability = (score: number) => {
    if (score >= 75) return { suitable: true, message: '매우 적합', emoji: '🎉' };
    return { suitable: false, message: '부적합', emoji: '⚠️' };
  };

  const suitabilityInfo = getSuitability(matchingScore);

  return (
    <>
      {/* 확인 다이얼로그 */}
      {showConfirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-8 mx-4 bg-white shadow-2xl rounded-2xl">
            <div className="mb-6 text-center">
              <div className="mb-4 text-5xl">💳</div>
              <h3 className="mb-4 text-2xl font-bold">정말 크레딧을 사용하시겠습니까?</h3>
              <p className="mt-2 text-gray-500">AI 매칭 분석에 크레딧 50이 차감됩니다.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleCancelAnalysis}
                className="flex-1 px-6 py-3 font-semibold text-gray-700 transition bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                아니요
              </button>
              <button
                onClick={handleConfirmAnalysis}
                className="flex-1 px-6 py-3 font-semibold text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                예
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-8 mx-auto max-w-7xl">
        <div className="flex gap-6">
          {/* 왼쪽 사이드바 */}
          <MatchingSidebar activeMenu={activeMenu} onMenuClick={setActiveMenu} />

          {/* 메인 컨텐츠 */}
          <div className="flex-1">
            {/* 상단 헤더 */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-full">
                  📊
                </div>
                <h1 className="text-2xl font-bold">AI 매칭 분석</h1>
              </div>
              <button
                onClick={handleCreditClick}
                className="flex items-center gap-2 px-6 py-3 font-semibold text-white transition bg-blue-600 rounded-full hover:bg-blue-700"
              >
                <span>💳</span>
                <span>보유 크레딧 : {currentCredit}</span>
              </button>
            </div>

            {/* 선택 카드 */}
            <div className="p-8 mb-6 bg-white border-2 border-blue-400 rounded-2xl">
              <h2 className="mb-6 text-xl font-bold">분석 대상 선택</h2>
              
              <div className="mb-6 space-y-4">
                {/* 이력서 선택 */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    이력서 선택
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={selectedResume}
                      onChange={(e) => setSelectedResume(e.target.value)}
                      className="flex-1 p-4 text-gray-700 bg-white border-2 border-gray-300 outline-none cursor-pointer rounded-xl"
                    >
                      <option value="">이력서를 선택하세요</option>
                      {resumes.map((resume) => (
                        <option key={resume.id} value={resume.id}>
                          {resume.name}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={handleAddResume}
                      className="px-6 py-4 font-medium text-gray-700 transition bg-gray-200 rounded-xl hover:bg-gray-300 whitespace-nowrap"
                    >
                      + 이력서 추가
                    </button>
                  </div>
                </div>

                {/* 공고 선택 */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    분석할 공고 선택
                  </label>
                  <select
                    value={selectedJob}
                    onChange={(e) => setSelectedJob(e.target.value)}
                    className="w-full p-4 text-gray-700 bg-white border-2 border-gray-300 outline-none cursor-pointer rounded-xl"
                  >
                    <option value="">공고를 선택하세요</option>
                    {jobs.map((job) => (
                      <option key={job.id} value={job.id}>
                        {job.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 분석 시작 버튼 */}
              <button
                onClick={handleAnalyze}
                className="flex items-center justify-center w-full gap-2 py-4 text-lg font-bold text-white transition bg-blue-600 rounded-xl hover:bg-blue-700"
              >
                <span>🔍</span>
                <span>AI 매칭 분석 시작</span>
                <span className="text-sm">(크레딧 30)</span>
              </button>

              {/* 안내 메시지 */}
              <div className="p-4 mt-4 border-2 border-blue-200 bg-blue-50 rounded-xl">
                <div className="flex items-center gap-2 text-blue-700">
                  <span>💡</span>
                  <span className="font-medium">
                    AI가 이력서와 공고를 분석하여 매칭률, 강점, 개선사항을 알려드립니다
                  </span>
                </div>
              </div>
            </div>

            {/* 분석 결과 영역 */}
            {!hasAnalysis ? (
              <div className="p-16 text-center bg-white border-2 border-gray-200 rounded-2xl">
                <div className="mb-4 text-6xl">📊</div>
                <h3 className="mb-2 text-2xl font-bold text-gray-400">분석 결과가 없습니다</h3>
                <p className="text-gray-500">이력서와 공고를 선택하고 AI 매칭 분석을 시작해보세요</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* 매칭 결과 카드 */}
                <div className={`rounded-2xl p-8 text-white ${suitabilityInfo.suitable ? 'bg-blue-600' : 'bg-red-600'}`}>
                  <div className="text-center">
                    <h2 className="mb-6 text-2xl font-bold">종합 매칭 점수</h2>
                    <div className="mb-6 text-8xl">{suitabilityInfo.emoji}</div>
                    <div className="mb-4 text-4xl font-bold">
                      이 공고에 지원하기 <span className="underline">{suitabilityInfo.message}</span>합니다!
                    </div>
                  </div>
                </div>

                {/* 세부 분석 */}
                <div className="grid grid-cols-2 gap-6">
                  {/* 강점 분석 */}
                  <div className="p-6 bg-white border-2 border-green-400 rounded-2xl">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-2xl">✅</span>
                      <h3 className="text-xl font-bold text-green-600">강점 분석</h3>
                    </div>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <span className="mt-1 text-green-500">•</span>
                        <span>React, TypeScript 경력 3년으로 요구사항을 완벽히 충족</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1 text-green-500">•</span>
                        <span>대규모 프로젝트 경험이 풍부하여 팀 리딩 가능</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1 text-green-500">•</span>
                        <span>UI/UX 개선 경험이 포지션과 매우 적합</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1 text-green-500">•</span>
                        <span>협업 도구 사용 경험 풍부 (Git, Jira, Slack)</span>
                      </li>
                    </ul>
                  </div>

                  {/* 약점 분석 */}
                  <div className="p-6 bg-white border-2 border-yellow-400 rounded-2xl">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-2xl">⚠️</span>
                      <h3 className="text-xl font-bold text-yellow-600">개선 필요 사항</h3>
                    </div>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <span className="mt-1 text-yellow-500">•</span>
                        <span>Next.js 프레임워크 경험 추가 권장</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1 text-yellow-500">•</span>
                        <span>테스트 코드 작성 경험을 이력서에 추가하면 좋음</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1 text-yellow-500">•</span>
                        <span>성능 최적화 경험 구체적으로 기술 필요</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* 기술 스택 매칭 */}
                <div className="p-6 bg-white border-2 border-blue-400 rounded-2xl">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">💻</span>
                    <h3 className="text-xl font-bold text-blue-600">기술 스택 매칭률</h3>
                  </div>
                  <div className="space-y-4">
                    {[
                      { name: 'React', match: 100 },
                      { name: 'TypeScript', match: 95 },
                      { name: 'JavaScript', match: 100 },
                      { name: 'CSS/SASS', match: 90 },
                      { name: 'Git', match: 100 },
                      { name: 'Next.js', match: 60 },
                    ].map((skill) => (
                      <div key={skill.name}>
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">{skill.name}</span>
                          <span className="font-bold text-blue-600">{skill.match}%</span>
                        </div>
                        <div className="w-full h-3 bg-gray-200 rounded-full">
                          <div
                            className={`h-3 rounded-full transition-all ${
                              skill.match >= 80 ? 'bg-green-500' : 'bg-yellow-500'
                            }`}
                            style={{ width: `${skill.match}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI 추천 개선 사항 */}
                <div className="p-6 bg-white border-2 border-blue-400 rounded-2xl">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">🤖</span>
                    <h3 className="text-xl font-bold text-blue-600">AI 추천 개선 사항</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-blue-50">
                      <h4 className="mb-2 font-bold">📝 이력서 수정 제안</h4>
                      <p className="text-gray-700">
                        "프로젝트 성과를 정량적으로 표현하면 좋습니다. 예: '웹 성능 30% 개선', '사용자 수 2배 증가' 등"
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-blue-50">
                      <h4 className="mb-2 font-bold">🎯 자기소개서 작성 팁</h4>
                      <p className="text-gray-700">
                        "해당 회사의 기술 스택과 문화에 맞춰 협업 경험과 문제 해결 능력을 강조하세요"
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-blue-50">
                      <h4 className="mb-2 font-bold">📚 학습 추천</h4>
                      <p className="text-gray-700">
                        "Next.js 공식 문서와 튜토리얼을 학습하여 SSR/SSG 경험을 쌓으면 합격률이 높아집니다"
                      </p>
                    </div>
                  </div>
                </div>

                {/* 하단 버튼 */}
                <div className="flex gap-4">
                  <button
                    onClick={() => setHasAnalysis(false)}
                    className="flex-1 py-4 font-bold text-gray-700 transition bg-gray-200 rounded-xl hover:bg-gray-300"
                  >
                    다시 분석하기
                  </button>
                  <button
                    onClick={() => {
                      if (onEditResume) {
                        onEditResume();
                      } else {
                        alert('이력서 수정 페이지로 이동합니다');
                      }
                    }}
                    className="flex-1 py-4 font-bold text-white transition bg-blue-600 rounded-xl hover:bg-blue-700"
                  >
                    이력서 수정하기
                  </button>
                  <button
                    onClick={() => alert('지원하기 페이지로 이동합니다')}
                    className="flex-1 py-4 font-bold text-white transition bg-blue-600 rounded-xl hover:bg-blue-700"
                  >
                    🚀 지금 지원하기
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
      <Footer />
    </>
  );
}
