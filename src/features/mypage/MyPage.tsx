import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getUserProfile, UserProfile } from "../../api/user";

interface MyPageProps {
  onNavigate: (page: string, subMenu?: string) => void;
  onEditProfile?: () => void;
  initialMenu?: string;
}

export default function MyPage({ onNavigate, onEditProfile, initialMenu }: MyPageProps) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [resumeCount] = useState(2);
  const [activeMenu, setActiveMenu] = useState("home");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialMenu) {
      setActiveMenu(initialMenu);
    }
  }, [initialMenu]);

  // ✅ 프로필 정보 불러오기 (로그인한 경우에만)
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
        onNavigate("application-status");
        break;
      case "모의 면접":
        onNavigate("interview");
        break;
      case "이력서 열람":
        onNavigate("resume");
        break;
      case "AI 맞춤 공고":
        onNavigate("ai-recommend");
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

  // ✅ 로딩 중 표시
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

  // ✅ 에러 표시
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
    <div className="px-4 py-8 mx-auto max-w-7xl">
      <div className="flex gap-6">
        {/* 왼쪽 사이드바 */}
        <aside className="w-52">
          <div className="p-6 space-y-4 bg-white border-2 border-purple-500 rounded-lg">
            {/* 프로필 이미지 */}
            <div className="flex flex-col items-center space-y-2">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <div className="flex items-center justify-center w-full h-full bg-gray-200 border-2 border-blue-400 rounded-full overflow-hidden">
                  {/* ✅ 프로필 이미지 표시 */}
                  {profile?.profileImage ? (
                    <img
                      src={profile.profileImage}
                      alt="프로필"
                      className="w-full h-full object-cover"
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
                  onClick={onEditProfile}
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
                      onClick={() => onNavigate("resume")}
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
                      onClick={() => onNavigate("resume")}
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
  );
}
