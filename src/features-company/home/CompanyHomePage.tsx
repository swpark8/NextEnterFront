import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function CompanyHomePage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // 로그인 필요한 페이지 이동 처리
  const handleProtectedNavigation = (path: string) => {
    if (!isAuthenticated) {
      alert("로그인이 필요한 기능입니다.");
      navigate("/company/login");
      return;
    }
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 메인 컨텐츠 */}
      <div className="px-4 py-12 mx-auto max-w-7xl">
        <div className="grid grid-cols-12 gap-6 mb-12">
          {/* 왼쪽 히어로 카드 */}
          <div className="col-span-6">
            <div className="relative overflow-hidden bg-purple-300 rounded-3xl p-8 h-full">
              <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:30px_30px]"></div>
              <div className="relative h-full">
                <div className="flex items-center mb-5">
                  <div className="bg-white/40 backdrop-blur-sm rounded-xl p-2 mr-2">
                    <svg className="w-6 h-6 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="bg-white/40 backdrop-blur-sm rounded-xl p-2">
                    <svg className="w-6 h-6 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
                <h2 className="text-3xl font-black text-purple-900 mb-3 leading-tight">
                  채용의 모든 과정을<br />한 곳에서!
                </h2>
                <p className="text-base text-purple-800 mb-2">
                  NextEnter 기업 채용 플랫펼
                </p>
                <p className="text-sm text-purple-700 mb-5">
                  AI 기반 인재 매칭부터 체계적인 자원자 관리까지
                </p>
                <div className="flex flex-col space-y-3">
                  <button
                    onClick={() => handleProtectedNavigation('/company/jobs')}
                    className="px-5 py-2.5 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-all shadow-lg text-sm"
                  >
                    공고 등록하기
                  </button>
                  <button
                    onClick={() => handleProtectedNavigation('/company/talent-search')}
                    className="px-5 py-2.5 bg-white/60 backdrop-blur-sm text-purple-700 font-semibold rounded-xl hover:bg-white/80 transition-all border border-purple-300 text-sm"
                  >
                    인재 찾기
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 오른쪽 서비스 카드 */}
          <div className="col-span-6 grid grid-cols-2 gap-4">
            {/* 공고 등록 */}
            <div 
              onClick={() => handleProtectedNavigation('/company/jobs')}
              className="bg-white border border-gray-200 rounded-2xl p-5 cursor-pointer hover:shadow-lg transition-all"
            >
              <div className="flex items-center mb-3">
                <div className="bg-blue-100 rounded-full p-2 mr-3">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900">공고 등록</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                채용 정보 관리
              </p>
              <div className="space-y-1.5 mb-3 text-xs text-gray-500">
                <div className="flex items-center">
                  <svg className="w-3 h-3 mr-1.5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  공고 작성
                </div>
                <div className="flex items-center">
                  <svg className="w-3 h-3 mr-1.5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  지원자 확인
                </div>
                <div className="flex items-center">
                  <svg className="w-3 h-3 mr-1.5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  공고 수정/삭제
                </div>
              </div>
            </div>

            {/* 인재 검색 */}
            <div 
              onClick={() => handleProtectedNavigation('/company/talent-search')}
              className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="flex items-center mb-3">
                <div className="bg-indigo-100 rounded-full p-2 mr-3">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900">인재 검색</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                인재 풀 검색
              </p>
              <div className="space-y-1.5 text-xs text-gray-500">
                <div className="flex items-center">
                  <svg className="w-3 h-3 mr-1.5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  조건별 검색
                </div>
                <div className="flex items-center">
                  <svg className="w-3 h-3 mr-1.5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  이력서 열람
                </div>
                <div className="flex items-center">
                  <svg className="w-3 h-3 mr-1.5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  스크랩 관리
                </div>
              </div>
            </div>

            {/* 지원자 관리 */}
            <div 
              onClick={() => handleProtectedNavigation('/company/applicants')}
              className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="flex items-center mb-3">
                <div className="bg-violet-100 rounded-full p-2 mr-3">
                  <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900">지원자 관리</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                지원 현황 및 분석
              </p>
              <div className="space-y-1.5 text-xs text-gray-500">
                <div className="flex items-center">
                  <svg className="w-3 h-3 mr-1.5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  지원자 목록
                </div>
                <div className="flex items-center">
                  <svg className="w-3 h-3 mr-1.5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  적합도 분석
                </div>
                <div className="flex items-center">
                  <svg className="w-3 h-3 mr-1.5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  기업의 요청
                </div>
              </div>
            </div>

            {/* 크레딧 */}
            <div 
              onClick={() => handleProtectedNavigation('/company/credit')}
              className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-5 cursor-pointer hover:shadow-lg transition-all"
            >
              <div className="flex items-center mb-3">
                <div className="bg-emerald-500 rounded-full p-2 mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900">크레딧</h3>
              </div>
              <p className="text-sm text-gray-700 mb-3">
                크레딧 충전 및 관리
              </p>
              <button className="text-sm text-emerald-600 font-bold hover:underline">
                자세히 보기 →
              </button>
            </div>
          </div>
        </div>

        {/* 하단 섹션 - 통계 & 공고 */}
        <div className="grid grid-cols-2 gap-6">
          {/* 지원자 통계 */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="inline-block px-4 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold text-xs mb-2">
                  STATISTICS
                </div>
                <h3 className="text-xl font-black text-gray-900">지원자 통계</h3>
              </div>
            </div>
            
            {/* 통계 카드 3개 */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-blue-700 font-semibold">총 지원자</span>
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                </div>
                <div className="text-3xl font-black text-blue-900">0</div>
                <div className="text-xs text-blue-600 mt-1">전체 지원</div>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-green-700 font-semibold">신규 지원</span>
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-3xl font-black text-green-900">0</div>
                <div className="text-xs text-green-600 mt-1">이번 주</div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-purple-700 font-semibold">합격률</span>
                  <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-3xl font-black text-purple-900">0%</div>
                <div className="text-xs text-purple-600 mt-1">서류 통과율</div>
              </div>
            </div>
            
            {/* 간단한 그래프 */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-gray-700">지원자 추이</span>
                <span className="text-xs text-gray-500">최근 7일</span>
              </div>
              <div className="flex items-end justify-between h-32 gap-2">
                {[20, 35, 28, 45, 38, 52, 30].map((height, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-gradient-to-t from-purple-500 to-purple-300 rounded-t-lg transition-all hover:from-purple-600 hover:to-purple-400"
                      style={{ height: `${height}%` }}
                    ></div>
                    <span className="text-xs text-gray-500 mt-2">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][idx]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 내가 올린 공고 */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="inline-block px-4 py-1 bg-purple-100 text-purple-700 rounded-full font-semibold text-xs mb-2">
                  MY JOBS
                </div>
                <h3 className="text-xl font-black text-gray-900">내가 올린 공고</h3>
              </div>
              <button
                onClick={() => handleProtectedNavigation('/company/jobs')}
                className="px-4 py-2 text-purple-600 border border-purple-300 font-semibold text-sm rounded-lg hover:bg-purple-50 transition-all"
              >
                전체보기
              </button>
            </div>

            <div className="space-y-3">
              {/* 공고 없을 때 */}
              <div className="py-12 text-center">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-500 text-sm mb-4">등록된 공고가 없습니다</p>
                <button
                  onClick={() => handleProtectedNavigation('/company/jobs')}
                  className="px-5 py-2.5 bg-purple-600 text-white font-semibold text-sm rounded-lg hover:bg-purple-700 transition-all"
                >
                  공고 등록하기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
