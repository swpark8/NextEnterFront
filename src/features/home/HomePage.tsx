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

export default function HomePage({ onLoginClick }: HomePageProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // ✅ 실제 공고 데이터 상태
  const [recommendedJobs, setRecommendedJobs] = useState<JobPostingListResponse[]>([]);
  const [moreJobs, setMoreJobs] = useState<JobPostingListResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ 광고 배너 슬라이드 상태
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

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
        
        // 추천 공고 3개 (랜덤)
        const recommendedResponse = await getJobPostings({
          page: 0,
          size: 3,
          status: "OPEN"
        });
        setRecommendedJobs(recommendedResponse.content);

        // 더 많은 공고 3개 (랜덤)
        const moreResponse = await getJobPostings({
          page: 0,
          size: 3,
          status: "OPEN"
        });
        setMoreJobs(moreResponse.content);
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

  const ICON_FRAME_CLASS = "w-16 h-16 flex items-center justify-center";
  const ICON_IMG_CLASS = "w-full h-full object-contain";

  return (
    <main className="px-6 py-8 mx-auto max-w-[1600px] bg-white">
      {/* 상단 영역 */}
      <div className="flex gap-6 mb-6">
        {/* 왼쪽: 오늘의 합격 꿀팁 */}
        <aside className="w-64 space-y-4">
          {/* 꿀팁 박스 - 높이 증가 */}
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

          {/* 인적성검사 - 높이 증가 */}
          <div className="h-24 p-6 bg-white border-2 border-gray-200 rounded-xl shadow-sm flex flex-col justify-center">
            <div className="flex items-center mb-3">
              <span className="mr-3 text-2xl">💡</span>
              <h3 className="text-base font-bold">인적성검사</h3>
            </div>
            <p className="text-sm text-blue-600 hover:underline cursor-pointer">
              사람인적성 UP
            </p>
          </div>

          {/* 외국인 채용은 KoMate - 높이 증가 */}
          <div className="h-24 p-6 bg-white border-2 border-gray-200 rounded-xl shadow-sm flex flex-col justify-center">
            <div className="flex items-center mb-3">
              <span className="mr-3 text-2xl">✨</span>
              <h3 className="text-base font-bold">외국인 채용은 KoMate</h3>
            </div>
            <p className="text-sm text-gray-600">외국인 전용 채용 플랫폼</p>
          </div>

          {/* 커리어 마켓플레이스 - 높이 증가 */}
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
                🔍 지금 핫한 대기업 공고
              </button>
              <button className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                🏢 공사·공기업 공고
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
              {/* ✅ 추천 공고 카드 3개 (실제 데이터 + 로고 이미지) */}
              <div className="grid grid-cols-3 gap-4">
                {recommendedJobs.length > 0 ? (
                  recommendedJobs.map((job) => (
                    <div
                      key={job.jobId}
                      onClick={() => handleJobClick(job.jobId)}
                      className="flex flex-col p-6 bg-white border-2 border-gray-200 rounded-xl cursor-pointer transition hover:shadow-lg hover:border-blue-400"
                    >
                      {/* ✅ 로고 이미지 표시 */}
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

              {/* ✅ 회원님이 꼭 봐야 할 공고 (실제 데이터 + 로고 이미지) */}
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
                        {/* ✅ 로고 이미지 표시 (작은 버전) */}
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
          {/* 로그인 박스 (로그아웃 시) */}
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

          {/* 광고 1 - 구직자 대상 */}
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

          {/* 광고 2 - 쿠팡로지스틱스 */}
          <div className="relative h-46 p-5 text-white shadow-lg bg-gradient-to-br from-orange-500 to-orange-700 rounded-xl">
            <h3 className="mb-2 text-base font-bold">쿠팡로지스틱스</h3>
            <h3 className="mb-3 text-lg font-bold">
              쿠팡 CLS 플렉스 어시스턴트 채용
            </h3>
            <div className="mb-2 text-xl font-bold">coupang</div>
            <div className="text-xs">logistics services</div>
            <div className="absolute text-xs bottom-2 right-3">5/8</div>
          </div>

          {/* 광고 3 - SK 하이닉스 */}
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

      {/* ✅ 하단 광고 배너 (페이드 효과) */}
      {!isLoading && (
        <div className="relative h-24 rounded-xl shadow-lg overflow-hidden bg-gray-100">
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

          {/* 페이지 인디케이터 */}
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
    </main>
  );
}
