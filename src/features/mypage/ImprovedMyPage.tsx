import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";
import { getUserProfile, UserProfile } from "../../api/user";
import { getMyApplies, ApplyListResponse } from "../../api/apply";
import { getBookmarkedJobs, BookmarkedJobDto } from "../../api/bookmark";
import { getJobPostings, JobPostingListResponse } from "../../api/job";
import { usePageNavigation } from "../../hooks/usePageNavigation";
import MyPageSidebar from "./components/MyPageSidebar";

interface MyPageProps {
  onNavigate?: (page: string, subMenu?: string) => void;
  onEditProfile?: () => void;
  initialMenu?: string;
}

interface ActivityStats {
  appliedJobs: number;
  viewedJobs: number;
  receivedOffers: number;
  bookmarkedJobs: number;
  inquiries: number;
}

export default function ImprovedMyPage({
  onNavigate,
  onEditProfile,
  initialMenu,
}: MyPageProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { resumes } = useApp();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [applies, setApplies] = useState<ApplyListResponse[]>([]);
  const [bookmarks, setBookmarks] = useState<BookmarkedJobDto[]>([]);
  const [recommendedJobs, setRecommendedJobs] = useState<JobPostingListResponse[]>([]);
  const [recentJobs, setRecentJobs] = useState<JobPostingListResponse[]>([]);

  const { activeMenu, handleMenuClick } = usePageNavigation(
    "mypage",
    initialMenu || "mypage-sub-1",
    onNavigate
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 활동 통계
  const [stats, setStats] = useState<ActivityStats>({
    appliedJobs: 0,
    viewedJobs: 0,
    receivedOffers: 0,
    bookmarkedJobs: 0,
    inquiries: 0,
  });

  // 프로필 정보 불러오기
  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.userId) return;
      setLoading(true);
      setError(null);
      try {
        const response = await getUserProfile(user.userId);
        if (response.success && response.data) {
          setProfile(response.data);
        }
      } catch (err: any) {
        console.error("프로필 로드 오류:", err);
        setError("프로필을 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    if (user?.userId) {
      loadProfile();
    }
  }, [user?.userId]);

  // 활동 데이터 불러오기
  useEffect(() => {
    const loadActivityData = async () => {
      if (!user?.userId) return;

      try {
        // 지원 내역 조회
        const appliesData = await getMyApplies(user.userId);
        setApplies(appliesData);

        // 북마크 조회
        const bookmarksData = await getBookmarkedJobs(user.userId, 0, 10);
        setBookmarks(bookmarksData.content);

        // 추천 공고 조회
        const jobsData = await getJobPostings({ page: 0, size: 12, status: "ACTIVE" });
        setRecommendedJobs(jobsData.content);

        // 최근 본 공고
        const recentJobsData = await getJobPostings({ page: 0, size: 6, status: "ACTIVE" });
        setRecentJobs(recentJobsData.content);

        // 통계 업데이트
        setStats({
          appliedJobs: appliesData.length,
          viewedJobs: 0,
          receivedOffers: appliesData.filter((a) => a.status === "ACCEPTED").length,
          bookmarkedJobs: bookmarksData.totalElements,
          inquiries: 0,
        });
      } catch (err: any) {
        console.error("활동 데이터 로드 오류:", err);
      }
    };

    if (user?.userId) {
      loadActivityData();
    }
  }, [user?.userId]);

  const handleClick = (item: string) => {
    switch (item) {
      case "입사 지원 현황":
        handleMenuClick("application-status");
        break;
      case "모의 면접":
        handleMenuClick("interview-sub-1");
        break;
      case "이력서 열람":
        handleMenuClick("resume-sub-1");
        break;
      case "AI 맞춤 공고":
        handleMenuClick("job-sub-2");
        break;
      case "스크랩 현황":
        handleMenuClick("scrap-status");
        break;
      case "관심 기업":
        alert("관심 기업 기능은 준비 중입니다.");
        break;
      default:
        break;
    }
  };

  const handleJobClick = (jobId: number) => {
    navigate(`/user/jobs/${jobId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="mb-4 text-4xl">⏳</div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="mb-4 text-4xl">⚠️</div>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            새로고침
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="px-4 py-8 mx-auto max-w-7xl">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">{user?.name || "이상연"}님</h1>
        <div className="flex gap-6">
          {/* 왼쪽 사이드바 - sticky */}
          <div className="sticky top-6 h-fit">
            <MyPageSidebar
              activeMenu={activeMenu}
              onMenuClick={handleMenuClick}
            />
          </div>

          {/* 메인 컨텐츠 영역 - 전체 너비 */}
          <main className="flex-1 space-y-6">
            {/* 활동 통계 대시보드 */}
            <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">⏰</span>
                  <h2 className="text-lg font-bold text-gray-900">
                    지원현황과 관심 공고를 관리하세요
                  </h2>
                </div>
                <button
                  onClick={() => handleMenuClick("application-status")}
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
                >
                  더보기 &gt;
                </button>
              </div>
              
              <div className="grid grid-cols-4 gap-4">
                <div className="p-5 text-center transition-all duration-200 bg-white border border-gray-300 rounded-lg hover:shadow-md hover:border-blue-400">
                  <div className="flex items-center justify-center mb-3">
                    <div className="flex items-center justify-center w-12 h-12 bg-blue-50 rounded-full">
                      <span className="text-2xl">💚</span>
                    </div>
                  </div>
                  <div className="mb-1 text-sm font-medium text-gray-600">내 정보</div>
                  <div className="text-3xl font-bold text-gray-900">{stats.receivedOffers}</div>
                </div>

                <div className="p-5 text-center transition-all duration-200 bg-white border border-gray-300 rounded-lg hover:shadow-md hover:border-blue-400">
                  <div className="flex items-center justify-center mb-3">
                    <div className="flex items-center justify-center w-12 h-12 bg-blue-50 rounded-full">
                      <span className="text-2xl">📝</span>
                    </div>
                  </div>
                  <div className="mb-1 text-sm font-medium text-gray-600">지원 현황</div>
                  <div className="text-3xl font-bold text-gray-900">{stats.appliedJobs}</div>
                </div>

                <div className="p-5 text-center transition-all duration-200 bg-white border border-gray-300 rounded-lg hover:shadow-md hover:border-blue-400">
                  <div className="flex items-center justify-center mb-3">
                    <div className="flex items-center justify-center w-12 h-12 bg-blue-50 rounded-full">
                      <span className="text-2xl">👀</span>
                    </div>
                  </div>
                  <div className="mb-1 text-sm font-medium text-gray-600">기업의 요청</div>
                  <div className="text-3xl font-bold text-gray-900">{stats.viewedJobs}</div>
                </div>

                <div className="p-5 text-center transition-all duration-200 bg-white border border-gray-300 rounded-lg hover:shadow-md hover:border-blue-400">
                  <div className="flex items-center justify-center mb-3">
                    <div className="flex items-center justify-center w-12 h-12 bg-blue-50 rounded-full">
                      <span className="text-2xl">⭐</span>
                    </div>
                  </div>
                  <div className="mb-1 text-sm font-medium text-gray-600">스크랩</div>
                  <div className="text-3xl font-bold text-gray-900">{stats.bookmarkedJobs}</div>
                </div>
              </div>
            </div>

            {/* 구직/매칭 섹션 */}
            <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold text-gray-900">구직/매칭</span>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 text-sm font-medium text-gray-600 bg-gray-100 border border-gray-200 rounded-full">
                      구분 비활성화
                    </span>
                    <span className="px-3 py-1 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-full">
                      희망 산업
                    </span>
                    <span className="px-3 py-1 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-full">
                      새로운 제안
                    </span>
                  </div>
                </div>
                <button className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline">
                  모두 보기 &gt;
                </button>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <button
                  onClick={() => handleClick("입사 지원 현황")}
                  className="flex flex-col items-center p-6 transition-all duration-200 bg-white border border-gray-300 rounded-lg hover:shadow-md hover:border-blue-500 hover:-translate-y-1"
                >
                  <span className="mb-3 text-4xl">📋</span>
                  <span className="text-sm font-semibold text-gray-700">입사 지원 현황</span>
                </button>

                <button
                  onClick={() => handleClick("모의 면접")}
                  className="flex flex-col items-center p-6 transition-all duration-200 bg-white border border-gray-300 rounded-lg hover:shadow-md hover:border-blue-500 hover:-translate-y-1"
                >
                  <span className="mb-3 text-4xl">🎤</span>
                  <span className="text-sm font-semibold text-gray-700">모의 면접</span>
                </button>

                <button
                  onClick={() => handleClick("이력서 열람")}
                  className="flex flex-col items-center p-6 transition-all duration-200 bg-white border border-gray-300 rounded-lg hover:shadow-md hover:border-blue-500 hover:-translate-y-1"
                >
                  <span className="mb-3 text-4xl">📄</span>
                  <span className="text-sm font-semibold text-gray-700">이력서 매칭</span>
                </button>

                <button
                  onClick={() => handleClick("AI 맞춤 공고")}
                  className="flex flex-col items-center p-6 transition-all duration-200 bg-white border border-gray-300 rounded-lg hover:shadow-md hover:border-blue-500 hover:-translate-y-1"
                >
                  <span className="mb-3 text-4xl">🤖</span>
                  <span className="text-sm font-semibold text-center text-gray-700">AI 매칭/면접 기록</span>
                </button>
              </div>
            </div>

            {/* 스크랩한 공고 섹션 */}
            <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">⭐</span>
                  <h2 className="text-lg font-bold text-gray-900">스크랩한 공고</h2>
                </div>
                <button
                  onClick={() => handleClick("스크랩 현황")}
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
                >
                  더보기 &gt;
                </button>
              </div>

              {bookmarks.length === 0 ? (
                <div className="p-12 text-center bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="mb-4 text-5xl">⭐</div>
                  <p className="mb-4 text-gray-600 font-medium">
                    스크랩한 공고가 없습니다.
                  </p>
                  <button
                    onClick={() => handleMenuClick("job-sub-1")}
                    className="px-6 py-2 text-white transition bg-blue-600 rounded-lg hover:bg-blue-700 font-medium"
                  >
                    공고 둘러보기
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {bookmarks.slice(0, 4).map((bookmark) => (
                    <div
                      key={bookmark.bookmarkId}
                      onClick={() => handleJobClick(bookmark.jobPostingId)}
                      className="flex gap-4 p-4 transition-all duration-200 bg-white border border-gray-300 rounded-lg cursor-pointer hover:shadow-md hover:border-blue-500"
                    >
                      <div className="flex-1">
                        <h3 className="mb-2 font-bold text-gray-900">{bookmark.title}</h3>
                        <p className="mb-2 text-sm text-gray-600">
                          {bookmark.companyName}
                        </p>
                        <div className="flex gap-2 mb-2">
                          <span className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded">
                            {bookmark.location}
                          </span>
                          <span className="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 border border-gray-200 rounded">
                            {bookmark.experienceLevel}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          마감 {bookmark.deadline}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 내 이력서 섹션 */}
            <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📁</span>
                  <h3
                    className="text-lg font-bold text-gray-900 cursor-pointer hover:text-blue-600"
                    onClick={() => handleMenuClick("resume-sub-1")}
                  >
                    내 이력서 ({resumes.length}개)
                  </h3>
                </div>
                <button
                  onClick={() => handleMenuClick("resume-sub-1")}
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
                >
                  더보기 &gt;
                </button>
              </div>

              <div className="space-y-4">
                {resumes.length === 0 ? (
                  <div className="p-12 text-center bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="mb-4 text-5xl">📄</div>
                    <p className="mb-4 font-medium text-gray-600">
                      등록된 이력서가 없습니다.
                    </p>
                    <button
                      onClick={() => handleMenuClick("resume-sub-1")}
                      className="px-6 py-2 font-medium text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                      이력서 작성하기
                    </button>
                  </div>
                ) : (
                  resumes.slice(0, 3).map((resume) => (
                    <div
                      key={resume.id}
                      className="p-4 transition-all duration-200 bg-white border border-gray-300 rounded-lg hover:shadow-md hover:border-blue-500"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="mb-1 text-lg font-bold text-gray-900">
                            {resume.title}
                          </h4>
                          <div className="flex gap-4 text-sm text-gray-600">
                            <span>산업: {resume.industry}</span>
                            <span>지원: {resume.applications}건</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleMenuClick("resume-sub-1")}
                            className="px-4 py-2 text-sm font-medium text-gray-700 transition bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200"
                          >
                            수정
                          </button>
                          <button
                            onClick={() => handleMenuClick("resume-sub-1")}
                            className="px-6 py-2 text-sm font-medium text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
                          >
                            이력서 공개
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* 추천 공고 섹션 - 0~4 */}
            <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🎁</span>
                  <h2 className="text-lg font-bold text-gray-900">추천 공고</h2>
                </div>
                <button className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline">
                  더보기 &gt;
                </button>
              </div>

              <div className="grid grid-cols-4 gap-4">
                {recommendedJobs.slice(0, 4).map((job) => (
                  <div
                    key={job.jobId}
                    onClick={() => handleJobClick(job.jobId)}
                    className="p-4 transition-all duration-200 bg-white border border-gray-300 rounded-lg cursor-pointer hover:shadow-md hover:border-blue-500 hover:-translate-y-1"
                  >
                    <div className="mb-3 overflow-hidden rounded-lg">
                      {job.thumbnailUrl ? (
                        <img
                          src={job.thumbnailUrl}
                          alt={job.title}
                          className="object-cover w-full h-40 transition-transform duration-200 hover:scale-105"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-40 bg-gray-100 rounded-lg">
                          <span className="text-4xl">🏢</span>
                        </div>
                      )}
                    </div>
                    <h3 className="mb-2 font-bold text-gray-900 line-clamp-2">{job.title}</h3>
                    <p className="mb-2 text-sm text-gray-600">{job.companyName}</p>
                    <div className="flex gap-2 mb-2">
                      <span className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded">
                        {job.jobCategory}
                      </span>
                      <span className="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 border border-gray-200 rounded">
                        {job.location}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>조회 {job.viewCount}</span>
                      <span>⭐ {job.bookmarkCount}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}