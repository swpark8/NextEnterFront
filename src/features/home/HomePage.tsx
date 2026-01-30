import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getJobPostings, JobPostingListResponse } from "../../api/job";

type JobCategory = {
  id: number;
  icon: string;
  label: string;
  color: string;
};

interface HomePageProps {
  onLoginClick?: () => void;
}

// ✅ 광고 이미지 배열 (public/images 폴더)
const advertisementImages = [
  "/images/ad1.png",
  "/images/ad2.png",
  "/images/ad3.png",
];

// ✅ 카드 상단 그라데이션 색상 배열
const cardBorderColors = [
  "from-purple-400 to-purple-600", // 보라색
  "from-blue-400 to-blue-600",     // 파란색
  "from-green-400 to-green-600",   // 초록색
  "from-lime-400 to-lime-600",     // 연두색
];

export default function HomePage({ onLoginClick }: HomePageProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // ✅ 실제 공고 데이터 상태
  const [recommendedJobs, setRecommendedJobs] = useState<JobPostingListResponse[]>([]);
  const [moreJobs, setMoreJobs] = useState<JobPostingListResponse[]>([]);
  const [allJobs, setAllJobs] = useState<JobPostingListResponse[]>([]); // ✅ 모든 공고
  const [isLoading, setIsLoading] = useState(true);

  // ✅ 광고 배너 슬라이드 상태
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  // ✅ 호버된 카드 ID 추적
  const [hoveredCardId, setHoveredCardId] = useState<number | null>(null);

  // ✅ 광고 배너 자동 페이드 (3초마다)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentAdIndex((prevIndex) => (prevIndex + 1) % advertisementImages.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  // ✅ 공고 데이터 가져오기
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        
        // 추천 공고 3개
        const recommendedResponse = await getJobPostings({
          page: 0,
          size: 3,
          status: "OPEN"
        });
        setRecommendedJobs(recommendedResponse.content);

        // 더 많은 공고 3개
        const moreResponse = await getJobPostings({
          page: 0,
          size: 3,
          status: "OPEN"
        });
        setMoreJobs(moreResponse.content);

        // ✅ 모든 공고 가져오기 (최대 100개)
        const allResponse = await getJobPostings({
          page: 0,
          size: 100,
          status: "OPEN"
        });
        setAllJobs(allResponse.content);
      } catch (error) {
        console.error("공고 데이터 로딩 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleJobClick = (jobId: number) => {
    navigate(`/user/jobs/${jobId}`);
  };

  // ✅ 소셜 로그인 핸들러
  const handleSocialLogin = (provider: "naver" | "kakao" | "google") => {
    const backendUrl = "http://localhost:8080";
    window.location.href = `${backendUrl}/oauth2/authorization/${provider}`;
  };

  const jobCategories: JobCategory[] = [
    { id: 1, icon: "/images/react.png", label: "프론트", color: "bg-purple-100" },
    { id: 2, icon: "/images/spring boot.png", label: "백엔드", color: "bg-blue-100" },
    { id: 4, icon: "/images/풀스텍.png", label: "풀스택", color: "bg-red-100" },
    { id: 6, icon: "/images/notion.png", label: "PM", color: "bg-gray-100" },
    { id: 8, icon: "/images/AI.png", label: "AI 엔지니어", color: "bg-cyan-100" },
    { id: 5, icon: "/images/Figma.png", label: "디자이너", color: "bg-orange-100" },
  ];

  // ✅ D-day 계산 함수
  const calculateDday = (deadline: string): string => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return "마감";
    } else if (diffDays === 0) {
      return "D-day";
    } else {
      return `D-${diffDays}`;
    }
  };

  // ✅ 회사 로고 첫 글자 추출
  const getCompanyInitial = (companyName: string): string => {
    return companyName?.charAt(0) || "C";
  };

  // ✅ 카드 색상 가져오기 (인덱스 기반)
  const getCardBorderColor = (index: number): string => {
    return cardBorderColors[index % cardBorderColors.length];
  };

  return (
    <main className="px-6 py-8 mx-auto max-w-[1600px] bg-white">
      {/* 상단 영역 */}
      <div className="flex gap-6 mb-6">
        {/* 왼쪽: 오늘의 합격 꿀팁 */}
        <aside className="w-64 space-y-4">
          {/* 꿀팁 박스 */}
          <div className="h-52 p-6 bg-yellow-50 border-2 border-yellow-200 rounded-xl shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-12 h-12 mr-3 bg-yellow-300 rounded-full">
                  <span className="text-2xl">📝</span>
                </div>
                <h2 className="text-lg font-bold text-gray-900">
                  오늘의 합격 꿀팁
                </h2>
              </div>
              <p className="text-sm leading-relaxed text-gray-700">
                붙는 취업을 위해
                <br />
                전략을 세우는 사이트가 있어요.
              </p>
            </div>
            <button className="text-sm font-semibold text-blue-600 hover:underline text-left">
              확인하기
            </button>
          </div>

          {/* 인적성검사 */}
          <div className="h-24 p-6 bg-white border-2 border-gray-200 rounded-xl shadow-sm flex flex-col justify-center">
            <div className="flex items-center mb-3">
              <span className="mr-3 text-2xl">💡</span>
              <h3 className="text-base font-bold">인적성검사</h3>
            </div>
            <p className="text-sm text-blue-600 hover:underline cursor-pointer">
              사람인적성 UP
            </p>
          </div>

          {/* 외국인 채용은 KoMate */}
          <div className="h-24 p-6 bg-white border-2 border-gray-200 rounded-xl shadow-sm flex flex-col justify-center">
            <div className="flex items-center mb-3">
              <span className="mr-3 text-2xl">✨</span>
              <h3 className="text-base font-bold">외국인 채용은 KoMate</h3>
            </div>
            <p className="text-sm text-gray-600">외국인 전용 채용 플랫폼</p>
          </div>

          {/* 커리어 마켓플레이스 */}
          <div className="h-27 p-6 bg-white border-2 border-gray-200 rounded-xl shadow-sm flex flex-col justify-center">
            <div className="flex items-center">
              <span className="mr-3 text-2xl">📬</span>
              <h3 className="text-sm font-bold leading-tight">커리어 마켓플레이스 앱은 포지션 제안</h3>
            </div>
          </div>
        </aside>

        {/* 중앙: 회원님을 위한 추천 공고 */}
        <div className="flex-1 space-y-6">
          {/* 추천 공고 헤더 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔥</span>
              <h2 className="text-2xl font-bold">회원님을 위한 추천 공고</h2>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-50 border border-blue-600 rounded-lg hover:bg-blue-100">
                🔍 지금 핫한 기업 공고
              </button>
            </div>
          </div>

          {/* ✅ 로딩 상태 */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-600">공고를 불러오는 중...</p>
              </div>
            </div>
          ) : (
            <>
              {/* ✅ 추천 공고 카드 3개 */}
              <div className="grid grid-cols-3 gap-4">
                {recommendedJobs.length > 0 ? (
                  recommendedJobs.map((job) => (
                    <div
                      key={job.jobId}
                      onClick={() => handleJobClick(job.jobId)}
                      className="flex flex-col p-6 bg-white border-2 border-gray-200 rounded-xl cursor-pointer transition hover:shadow-lg hover:border-blue-400"
                    >
                      <div className="flex items-center justify-center w-16 h-16 mb-4 overflow-hidden bg-white border border-gray-200 rounded-lg">
                        {job.logoUrl ? (
                          <img 
                            src={job.logoUrl} 
                            alt={job.companyName} 
                            className="w-full h-full object-contain p-1"
                          />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full text-2xl font-bold text-white bg-gradient-to-br from-blue-500 to-purple-600">
                            {getCompanyInitial(job.companyName)}
                          </div>
                        )}
                      </div>
                      <h4 className="mb-3 text-sm font-bold text-gray-900 line-clamp-2" style={{ minHeight: "40px" }}>
                        {job.title}
                      </h4>
                      <p className="mb-2 text-xs text-gray-600">{job.companyName}</p>
                      <p className="mb-2 text-xs text-gray-500">{job.location}</p>
                      <p className="text-xs font-semibold text-blue-600">{calculateDday(job.deadline)}</p>
                    </div>
                  ))
                ) : (
                  <div className="col-span-3 py-12 text-center text-gray-500">
                    <p className="text-4xl mb-4">📭</p>
                    <p>등록된 공고가 없습니다</p>
                  </div>
                )}
              </div>

              {/* ✅ 회원님이 꼭 봐야 할 공고 */}
              <div className="p-6 bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-xl">
                <h3 className="mb-3 text-lg font-bold text-orange-900">
                  🎯 회원님이 꼭 봐야 할 공고 (플래티넘)
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  {moreJobs.length > 0 ? (
                    moreJobs.map((job) => (
                      <div
                        key={job.jobId}
                        onClick={() => handleJobClick(job.jobId)}
                        className="p-4 bg-white border border-gray-200 rounded-lg cursor-pointer hover:shadow-md transition"
                      >
                        <div className="flex items-center mb-3">
                          <div className="flex items-center justify-center w-10 h-10 mr-2 overflow-hidden bg-white border border-gray-200 rounded">
                            {job.logoUrl ? (
                              <img 
                                src={job.logoUrl} 
                                alt={job.companyName} 
                                className="w-full h-full object-contain p-0.5"
                              />
                            ) : (
                              <div className="flex items-center justify-center w-full h-full text-sm font-bold text-white bg-gradient-to-br from-blue-500 to-purple-600">
                                {getCompanyInitial(job.companyName)}
                              </div>
                            )}
                          </div>
                          <h5 className="text-sm font-bold text-gray-900 line-clamp-1 flex-1">{job.title}</h5>
                        </div>
                        <p className="mb-1 text-xs text-gray-600">{job.companyName}</p>
                        <p className="mb-1 text-xs text-gray-500">{job.location}</p>
                        <p className="text-xs font-semibold text-orange-600">{calculateDday(job.deadline)}</p>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-3 py-8 text-center text-gray-500">
                      <p>등록된 공고가 없습니다</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* 오른쪽: 광고 배너 */}
        <aside className="w-80 space-y-4">
          {/* 로그인 박스 */}
          {!isAuthenticated && (
            <div className="p-6 text-center bg-white border-2 border-gray-200 shadow-lg rounded-xl">
              <p className="mb-4 text-sm text-gray-600">
                아이디 · 비밀번호 찾기 |{" "}
                <span
                  onClick={() => navigate("/user/signup")}
                  className="text-blue-600 cursor-pointer hover:underline"
                >
                  회원가입
                </span>
              </p>
              <button
                onClick={() => navigate("/user/login")}
                className="w-full px-6 py-3 font-bold text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                로그인
              </button>
              <div className="mt-4 text-xs text-gray-500">간편로그인</div>

              {/* 소셜 로그인 버튼들 */}
              <div className="flex justify-center mt-3 space-x-4">
                <button
                  onClick={() => handleSocialLogin("naver")}
                  className="flex items-center justify-center w-10 h-10 overflow-hidden transition-opacity rounded-full shadow-md hover:opacity-80"
                  title="네이버 로그인"
                >
                  <img src="/images/naver-icon.png" alt="네이버" className="object-cover w-full h-full" />
                </button>

                <button
                  onClick={() => handleSocialLogin("kakao")}
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-[#FEE500] hover:opacity-80 transition-opacity shadow-md"
                  title="카카오 로그인"
                >
                  <img src="/images/kakao-icon.png" alt="카카오" className="object-contain w-12 h-12" />
                </button>

                <button
                  onClick={() => handleSocialLogin("google")}
                  className="flex items-center justify-center w-10 h-10 overflow-hidden transition-opacity rounded-full shadow-md hover:opacity-80"
                  title="구글 로그인"
                >
                  <img src="/images/google-icon.png" alt="구글" className="object-cover w-full h-full" />
                </button>
              </div>
            </div>
          )}

          {/* 광고 배너들 */}
          <div className="relative h-48 p-5 overflow-hidden text-white shadow-lg bg-gradient-to-br from-teal-700 to-teal-900 rounded-xl">
            <h3 className="mb-2 text-lg font-bold">구직자 대상</h3>
            <h3 className="mb-4 text-lg font-bold">
              해외 취업 사기에 주의하세요!
            </h3>
            <button className="px-4 py-2 text-sm text-white transition bg-white rounded-lg bg-opacity-20 hover:bg-opacity-30">
              바로가기 →
            </button>
            <div className="absolute text-xs bottom-2 right-3">5/5</div>
          </div>

          <div className="relative h-46 p-5 text-white shadow-lg bg-gradient-to-br from-orange-500 to-orange-700 rounded-xl">
            <h3 className="mb-2 text-base font-bold">쿠팡로지스틱스</h3>
            <h3 className="mb-3 text-lg font-bold">
              쿠팡 CLS 플렉스 어시스턴트 채용
            </h3>
            <div className="mb-2 text-xl font-bold">coupang</div>
            <div className="text-xs">logistics services</div>
            <div className="absolute text-xs bottom-2 right-3">5/8</div>
          </div>

          <div className="relative h-40 p-5 bg-white border border-gray-200 shadow-lg rounded-xl">
            <h3 className="mb-2 text-base font-bold">SK 하이닉스 채용 공고</h3>
            <p className="mb-3 text-xs text-gray-600">
              연봉 5500만원~7500만원
            </p>
            <div className="absolute bottom-4 right-4">
              <div className="flex items-center justify-center w-14 h-14 font-bold text-white bg-purple-600 rounded-full">
                SK
              </div>
            </div>
            <div className="absolute text-xs text-gray-500 bottom-2 right-3">
              1/6
            </div>
          </div>
        </aside>
      </div>

      {/* ✅ 하단 광고 배너 */}
      {!isLoading && (
        <div className="relative h-24 rounded-xl shadow-lg overflow-hidden bg-gray-100 mb-8">
          {advertisementImages.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`광고 ${index + 1}`}
              className={`absolute inset-0 w-full h-full object-fill transition-opacity duration-1000 ${
                index === currentAdIndex ? 'opacity-100' : 'opacity-0'
              }`}
              onError={(e) => {
                e.currentTarget.src = "/images/placeholder-ad.png";
              }}
            />
          ))}

          <div className="absolute flex gap-2 transform -translate-x-1/2 bottom-3 left-1/2 z-10">
            {advertisementImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentAdIndex(index)}
                className={`h-2 rounded-full transition-all ${ 
                  index === currentAdIndex
                    ? "bg-white w-6"
                    : "bg-white/50 w-2 hover:bg-white/75"
                }`}
                aria-label={`광고 ${index + 1}로 이동`}
              />
            ))}
          </div>
        </div>
      )}

      {/* ✅ 모든 공고 카드 섹션 (둥글게 + 로고 동그라미 제거) */}
      {!isLoading && allJobs.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">회원님이 꼭 봐야 할 공고 (플래티넘)</h2>
            <p className="text-sm text-gray-600">총 {allJobs.length}개의 공고</p>
          </div>

          {/* ✅ 그리드 컨테이너 */}
          <div className="grid grid-cols-4 gap-x-4 gap-y-4">
            {allJobs.map((job, index) => (
              <div
                key={job.jobId}
                className="relative"
                style={{ height: '350px' }}
              >
                <div
                  onClick={() => handleJobClick(job.jobId)}
                  onMouseEnter={() => setHoveredCardId(job.jobId)}
                  onMouseLeave={() => setHoveredCardId(null)}
                  className={`
                    absolute top-0 left-0 right-0
                    rounded-3xl cursor-pointer overflow-hidden
                    transition-all duration-500 ease-in-out
                    ${hoveredCardId === job.jobId 
                      ? 'shadow-2xl h-[700px] z-50' 
                      : 'shadow-sm h-[350px] z-10'
                    }
                  `}
                >
                  {/* ✅ 기본 상태: 로고 + 텍스트 + 썸네일 */}
                  {hoveredCardId !== job.jobId && (
                    <div className="relative w-full h-full bg-white border-2 border-gray-200 rounded-3xl overflow-hidden">
                      {/* ✅ 상단 그라데이션 테두리 */}
                      <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${getCardBorderColor(index)}`}></div>
                      
                      {/* 북마크 아이콘 */}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          // 북마크 기능 추가 예정
                        }}
                        className="absolute top-4 right-4 z-10 p-1 bg-white rounded-full shadow-md hover:bg-gray-50"
                      >
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      </button>

                      {/* 상단: 회사 로고 (동그라미 제거, 크기 축소) */}
                      <div className="flex justify-center px-5 pt-5 pb-3">
                        <div className="flex items-center justify-center h-12 max-w-[120px]">
                          {job.logoUrl ? (
                            <img 
                              src={job.logoUrl} 
                              alt={job.companyName} 
                              className="max-h-12 w-auto object-contain"
                            />
                          ) : (
                            <div className="px-3 py-1.5 text-sm font-bold text-white bg-gradient-to-br from-blue-500 to-purple-600 rounded">
                              {job.companyName}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* 중간: 텍스트 정보 */}
                      <div className="px-5 pb-3">
                        <h4 className="mb-2 text-base font-bold text-gray-900 line-clamp-2" style={{ minHeight: "48px" }}>
                          {job.title}
                        </h4>
                        <p className="mb-1 text-sm text-gray-600">{job.companyName}</p>
                      </div>

                      {/* 하단: 썸네일 이미지 */}
                      <div className="absolute bottom-0 left-0 right-0 h-[150px] rounded-b-3xl overflow-hidden">
                        {job.thumbnailUrl ? (
                          <img 
                            src={job.thumbnailUrl} 
                            alt={job.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                            <div className="text-center text-gray-400">
                              <p className="text-sm">썸네일 이미지</p>
                              <p className="text-xs">(등록 필요)</p>
                            </div>
                          </div>
                        )}
                        
                        {/* 하단 정보 오버레이 */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                          <div className="flex items-center justify-between text-white text-xs">
                            <span className="flex items-center gap-1">
                              📍 {job.location}
                            </span>
                            <span className="px-2 py-1 bg-blue-600 rounded font-semibold">
                              {calculateDday(job.deadline)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ✅ 호버 상태: 카드 전체가 상세 이미지로 변경 */}
                  {hoveredCardId === job.jobId && (
                    <div className="relative w-full h-full rounded-3xl overflow-hidden">
                      {/* ✅ 상단 그라데이션 테두리 (호버 시에도 표시) */}
                      <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${getCardBorderColor(index)} z-20`}></div>
                      
                      {/* 상세 이미지 - 카드 전체 채움 */}
                      {job.detailImageUrl ? (
                        <img 
                          src={job.detailImageUrl} 
                          alt={`${job.title} 상세`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100 flex items-center justify-center">
                          <div className="text-center text-gray-500">
                            <p className="text-xl font-bold mb-2">상세 이미지</p>
                            <p className="text-base">(등록 필요)</p>
                          </div>
                        </div>
                      )}

                      {/* 북마크 아이콘 */}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          // 북마크 기능 추가 예정
                        }}
                        className="absolute top-4 right-4 z-20 p-2 bg-white/90 rounded-full shadow-lg hover:bg-white"
                      >
                        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      </button>

                      {/* 하단 정보 오버레이 - 더 큰 영역 */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-6 pt-20 rounded-b-3xl">
                        <div className="text-white space-y-3">
                          {/* 회사명 + 제목 */}
                          <div>
                            <p className="text-sm font-semibold mb-1 opacity-90">{job.companyName}</p>
                            <h4 className="text-lg font-bold line-clamp-2">{job.title}</h4>
                          </div>

                          {/* 직무 + D-day */}
                          <div className="flex items-center justify-between pt-2 border-t border-white/30">
                            <span className="text-sm font-semibold flex items-center gap-2">
                              💼 {job.jobCategory}
                            </span>
                            <span className="px-4 py-2 bg-blue-600 rounded-full font-bold text-sm">
                              {calculateDday(job.deadline)}
                            </span>
                          </div>
                          
                          {/* 통계 정보 */}
                          <div className="flex items-center gap-6 text-sm">
                            <span className="flex items-center gap-1">
                              👁️ {job.viewCount?.toLocaleString() || 0}
                            </span>
                            <span className="flex items-center gap-1">
                              📝 {job.applicantCount?.toLocaleString() || 0}
                            </span>
                            <span className="flex items-center gap-1">
                              ⭐ {job.bookmarkCount?.toLocaleString() || 0}
                            </span>
                          </div>

                          {/* 위치 + 경력 */}
                          <div className="space-y-1 text-sm opacity-90">
                            <p className="flex items-center gap-1">
                              📍 {job.location}
                            </p>
                            {(job.experienceMin !== undefined || job.experienceMax !== undefined) && (
                              <p className="flex items-center gap-1">
                                💼 경력: {job.experienceMin ?? 0}년 ~ {job.experienceMax ?? '제한없음'}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}