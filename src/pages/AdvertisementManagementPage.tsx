import { useState } from "react";
import Footer from "../components/Footer";

interface AdvertisementManagementPageProps {
  onNewAdClick?: () => void;
  onLogoClick?: () => void;
  onAdDetailClick?: (id: number) => void;
}

interface Advertisement {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  budget: string;
  status: "진행중" | "종료" | "예정";
  clicks: number;
  impressions: number;
}

export default function AdvertisementManagementPage({ 
  onNewAdClick, 
  onLogoClick,
  onAdDetailClick
}: AdvertisementManagementPageProps) {
  const [statusFilter, setStatusFilter] = useState<string>("전체");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);

  // 샘플 광고 데이터
  const [advertisements] = useState<Advertisement[]>([
    {
      id: 1,
      title: "시니어 프론트엔드 개발자 채용 광고",
      startDate: "2025-01-10",
      endDate: "2025-02-10",
      budget: "500,000원",
      status: "진행중",
      clicks: 234,
      impressions: 5420
    },
    {
      id: 2,
      title: "백엔드 개발자 (Node.js) 채용 광고",
      startDate: "2025-01-15",
      endDate: "2025-02-15",
      budget: "300,000원",
      status: "진행중",
      clicks: 156,
      impressions: 3210
    },
    {
      id: 3,
      title: "풀스택 개발자 채용 광고",
      startDate: "2025-02-01",
      endDate: "2025-03-01",
      budget: "400,000원",
      status: "예정",
      clicks: 0,
      impressions: 0
    },
    {
      id: 4,
      title: "데이터 분석가 채용 광고",
      startDate: "2024-12-01",
      endDate: "2024-12-31",
      budget: "600,000원",
      status: "종료",
      clicks: 489,
      impressions: 8934
    }
  ]);

  const handleNewAdClick = () => {
    if (onNewAdClick) {
      onNewAdClick();
    }
  };

  const handleLogoClick = () => {
    if (onLogoClick) {
      onLogoClick();
    }
  };

  const handleAdClick = (id: number) => {
    if (onAdDetailClick) {
      onAdDetailClick(id);
    }
  };

  const handleDeleteClick = (id: number) => {
    setShowDeleteConfirm(id);
  };

  const handleConfirmDelete = () => {
    if (showDeleteConfirm !== null) {
      alert("광고가 삭제되었습니다.");
      setShowDeleteConfirm(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(null);
  };

  const filteredAds = statusFilter === "전체" 
    ? advertisements 
    : advertisements.filter(ad => ad.status === statusFilter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "진행중":
        return "bg-green-100 text-green-700";
      case "종료":
        return "bg-gray-100 text-gray-700";
      case "예정":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-4 py-4 mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <div 
              onClick={handleLogoClick}
              className="cursor-pointer hover:opacity-80 transition-opacity"
            >
              <span className="text-2xl font-bold text-blue-600">Next </span>
              <span className="text-2xl font-bold text-blue-800">Enter</span>
            </div>

            <div className="flex items-center space-x-6">
              <button className="text-gray-600 hover:text-gray-900">대시보드</button>
              <button className="text-gray-600 hover:text-gray-900">채용관리</button>
              <button
                onClick={handleLogoClick}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition text-gray-700"
              >
                개인 회원
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <div className="px-4 py-8 mx-auto max-w-7xl">
        {/* 상단: 제목 & 광고 등록 버튼 */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">광고 관리</h1>
          <button
            onClick={handleNewAdClick}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            + 새 광고 등록
          </button>
        </div>

        {/* 필터 */}
        <div className="mb-6">
          <div className="flex space-x-2">
            {["전체", "진행중", "예정", "종료"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  statusFilter === status
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* 광고 목록 테이블 */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  광고 제목
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                  기간
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                  예산
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                  상태
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                  노출수
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                  클릭수
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                  관리
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAds.length > 0 ? (
                filteredAds.map((ad) => (
                  <tr 
                    key={ad.id} 
                    className="hover:bg-gray-50 transition cursor-pointer"
                    onClick={() => handleAdClick(ad.id)}
                  >
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {ad.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-700">
                      {ad.startDate} ~ {ad.endDate}
                    </td>
                    <td className="px-6 py-4 text-center text-sm font-medium text-gray-900">
                      {ad.budget}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          ad.status
                        )}`}
                      >
                        {ad.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-700">
                      {ad.impressions.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-700">
                      {ad.clicks.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAdClick(ad.id);
                          }}
                          className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                          상세
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(ad.id);
                          }}
                          className="px-3 py-1 text-sm text-red-600 hover:text-red-800 font-medium"
                        >
                          삭제
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    해당하는 광고가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 통계 요약 */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-500 mb-1">진행 중인 광고</div>
            <div className="text-3xl font-bold text-blue-600">
              {advertisements.filter(ad => ad.status === "진행중").length}
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-500 mb-1">총 노출수</div>
            <div className="text-3xl font-bold text-gray-900">
              {advertisements.reduce((sum, ad) => sum + ad.impressions, 0).toLocaleString()}
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-500 mb-1">총 클릭수</div>
            <div className="text-3xl font-bold text-gray-900">
              {advertisements.reduce((sum, ad) => sum + ad.clicks, 0).toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* 삭제 확인 모달 */}
      {showDeleteConfirm !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              광고 삭제
            </h3>
            <p className="text-gray-600 mb-6">
              정말로 이 광고를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleCancelDelete}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                취소
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
