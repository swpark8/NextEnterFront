import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getUserProfile, UserProfile } from "../../api/user";
import { usePageNavigation } from "../../hooks/usePageNavigation";


interface MyPageProps {
  // ✅ [수정] 여기에 물음표(?)를 붙였습니다. 이제 App.tsx에서 에러가 나지 않습니다.
  onNavigate?: (page: string, subMenu?: string) => void;
  onEditProfile?: () => void;
  initialMenu?: string;
}

export default function MyPage({
  onNavigate,
  onEditProfile,
  initialMenu,
}: MyPageProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [resumeCount] = useState(2);

  // ✅ [변수 사용 1] 훅에서 가져온 변수들을 아래에서 실제로 사용합니다.
  const { activeMenu, handleMenuClick } = usePageNavigation(
    "mypage",
    initialMenu || "mypage-sub-1",
    onNavigate
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleClick = (item: string) => {
    console.log(`${item} 클릭됨`);

    switch (item) {
      case "입사 지원 현황":
        // ✅ [변수 사용 2] onNavigate 대신 handleMenuClick을 사용해 연결합니다.
        // (Header.tsx 로직에 따라 자동으로 해당 페이지로 이동됨)
        handleMenuClick("application-status");
        break;
      case "모의 면접":
        handleMenuClick("interview");
        break;
      case "이력서 열람":
        handleMenuClick("resume");
        break;
      case "AI 맞춤 공고":
        handleMenuClick("ai-recommend"); // 별도 페이지가 없다면 job-sub-2 등으로 연결
        break;
      case "스크랩 현황":
        console.log("스크랩 현황 페이지 이동");
        break;
      case "관심 기업":
        console.log("관심 기업 페이지 이동");
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

  // ✅ [변수 사용 3] activeMenu를 이용해 화면을 분기처리 (InterviewPage처럼)
  // 현재는 '나의 정보(mypage-sub-1)'만 구현되어 있으므로 이것만 보여줌
  // 추후 '프로필 수정(sub-2)' 등이 생기면 if문으로 추가하면 됩니다.

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="px-4 py-8 mx-auto max-w-7xl">
          <div className="flex gap-6">
            {/* 왼쪽 사이드바 */}
            <aside className="w-52">
              <div className="p-6 space-y-4 bg-white border-2 border-purple-500 rounded-lg">
                <div className="flex flex-col items-center space-y-2">
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <div className="flex items-center justify-center w-full h-full overflow-hidden bg-gray-200 border-2 border-blue-400 rounded-full">
                      {profile?.profileImage ? (
                        <img
                          src={profile.profileImage}
                          alt="프로필"
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <svg
                          className="w-12 h-12 text-gray-400"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                      )}
                    </div>
                    <button
                      onClick={() => navigate("/user/profile")}
                      className="absolute bottom-0 right-0 p-1.5 bg-orange-500 rounded-full hover:bg-orange-600 transition"
                      title="내 정보 수정"
                    >
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="px-8 py-1 border-2 border-blue-400 rounded-full">
                    <span className="text-sm">{user?.name || "이름"}</span>
                  </div>
                </div>

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
              {/* 만약 나중에 다른 탭(프로필 수정 등)을 추가하고 싶다면
                  if (activeMenu === 'mypage-sub-2') return <ProfileEditPage ... /> 
                  형태로 여기에 추가하면 됩니다.
              */}

              {/* 기본 화면 (mypage-sub-1) */}
              <div className="p-8 mb-6 bg-white border-2 border-blue-500 rounded-lg">
                <h2 className="mb-6 text-2xl font-bold text-center">이력서</h2>

                <div className="grid grid-cols-4 gap-4">
                  {mainCards.map((card) => (
                    <button
                      key={card.id}
                      onClick={() =>
                        handleClick(card.title.replace(/\n/g, " "))
                      }
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
                  <div className="p-6 bg-white border-2 border-blue-400 rounded-lg">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-bold">이력서 목록</h4>
                      <div className="flex gap-2">
                        <button
                          // ✅ [변수 사용 4] 버튼 클릭 시 훅 사용
                          onClick={() => handleMenuClick("resume")}
                          className="px-4 py-2 text-sm transition bg-gray-100 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-200"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleMenuClick("resume")}
                          className="px-6 py-2 text-sm text-white transition bg-blue-500 rounded-lg cursor-pointer hover:bg-blue-600"
                        >
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
    </>
  );
}
