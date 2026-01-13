import { useState } from "react";
import Footer from "../components/Footer";

interface AdvertisementDetailPageProps {
  advertisementId: number;
  onBackClick?: () => void;
  onLogoClick?: () => void;
  onEditClick?: (id: number) => void;
}

interface AdvertisementDetail {
  id: number;
  title: string;
  jobPosting: string;
  startDate: string;
  endDate: string;
  budget: string;
  dailyBudget: string;
  status: "진행중" | "종료" | "예정";
  adType: string;
  placement: string;
  targetAudience: string;
  description: string;
  clicks: number;
  impressions: number;
  spent: string;
  ctr: number;
  cpc: number;
  dailyStats: {
    date: string;
    impressions: number;
    clicks: number;
    spent: string;
  }[];
}

export default function AdvertisementDetailPage({
  advertisementId,
  onBackClick,
  onLogoClick,
  onEditClick,
}: AdvertisementDetailPageProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // 샘플 광고 상세 데이터
  const advertisementData: { [key: number]: AdvertisementDetail } = {
    1: {
      id: 1,
      title: "시니어 프론트엔드 개발자 채용 광고",
      jobPosting: "시니어 프론트엔드 개발자 채용",
      startDate: "2025-01-10",
      endDate: "2025-02-10",
      budget: "500,000원",
      dailyBudget: "20,000원",
      status: "진행중",
      adType: "배너 광고",
      placement: "메인페이지",
      targetAudience: "프론트엔드 개발자, 5년 이상 경력자",
      description: "시니어 프론트엔드 개발자를 채용하기 위한 메인페이지 배너 광고입니다. React와 TypeScript 경험이 있는 개발자를 타겟으로 합니다.",
      clicks: 234,
      impressions: 5420,
      spent: "187,000원",
      ctr: 4.32,
      cpc: 799,
      dailyStats: [
        { date: "2025-01-10", impressions: 423, clicks: 18, spent: "14,382원" },
        { date: "2025-01-11", impressions: 512, clicks: 23, spent: "18,377원" },
        { date: "2025-01-12", impressions: 489, clicks: 21, spent: "16,779원" },
        { date: "2025-01-13", impressions: 556, clicks: 25, spent: "19,975원" },
      ],
    },
    2: {
      id: 2,
      title: "백엔드 개발자 (Node.js) 채용 광고",
      jobPosting: "백엔드 개발자 (Node.js) 채용",
      startDate: "2025-01-15",
      endDate: "2025-02-15",
      budget: "300,000원",
      dailyBudget: "15,000원",
      status: "진행중",
      adType: "검색 광고",
      placement: "검색 결과 페이지",
      targetAudience: "백엔드 개발자, Node.js 경험자",
      description: "Node.js 백엔드 개발자를 위한 검색 광고입니다.",
      clicks: 156,
      impressions: 3210,
      spent: "124,800원",
      ctr: 4.86,
      cpc: 800,
      dailyStats: [
        { date: "2025-01-15", impressions: 389, clicks: 19, spent: "15,200원" },
        { date: "2025-01-16", impressions: 421, clicks: 21, spent: "16,800원" },
      ],
    },
  };

  const data = advertisementData[advertisementId] || advertisementData[1];

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

  const handleEditClick = () => {
    if (onEditClick) {
      onEditClick(advertisementId);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    alert("광고가 삭제되었습니다.");
    setShowDeleteConfirm(false);
    handleBackClick();
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

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
              <button className="text-gray-600 hover:text-gray-900">
                대시보드
              </button>
              <button className="text-gray-600 hover:text-gray-900">
                채용관리
              </button>
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
        {/* 상단: 뒤로가기 & 제목 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBackClick}
              className="text-2xl text-gray-600 hover:text-gray-900"
            >
              ←
            </button>
            <h1 className="text-3xl font-bold text-gray-900">{data.title}</h1>
            <span
              className={`px-4 py-1 text-sm font-semibold rounded-full ${getStatusColor(
                data.status
              )}`}
            >
              {data.status}
            </span>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleEditClick}
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              수정
            </button>
            <button
              onClick={handleDeleteClick}
              className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
            >
              삭제
            </button>
          </div>
        </div>

        {/* 주요 성과 지표 */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-500 mb-1">노출수</div>
            <div className="text-3xl font-bold text-gray-900">
              {data.impressions.toLocaleString()}
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-500 mb-1">클릭수</div>
            <div className="text-3xl font-bold text-blue-600">
              {data.clicks.toLocaleString()}
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-500 mb-1">클릭률 (CTR)</div>
            <div className="text-3xl font-bold text-green-600">
              {data.ctr}%
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-500 mb-1">지출액</div>
            <div className="text-3xl font-bold text-purple-600">
              {data.spent}
            </div>
          </div>
        </div>

        {/* 광고 정보 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">광고 정보</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-gray-500 mb-1">연결된 공고</div>
              <div className="text-base font-medium text-gray-900">
                {data.jobPosting}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">광고 유형</div>
              <div className="text-base font-medium text-gray-900">
                {data.adType}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">게재 위치</div>
              <div className="text-base font-medium text-gray-900">
                {data.placement}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">광고 기간</div>
              <div className="text-base font-medium text-gray-900">
                {data.startDate} ~ {data.endDate}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">총 예산</div>
              <div className="text-base font-medium text-gray-900">
                {data.budget}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">일일 예산</div>
              <div className="text-base font-medium text-gray-900">
                {data.dailyBudget}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">클릭당 비용 (CPC)</div>
              <div className="text-base font-medium text-gray-900">
                {data.cpc}원
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">타겟 대상</div>
              <div className="text-base font-medium text-gray-900">
                {data.targetAudience}
              </div>
            </div>
          </div>
          <div className="mt-6">
            <div className="text-sm text-gray-500 mb-2">광고 설명</div>
            <div className="text-base text-gray-700 leading-relaxed">
              {data.description}
            </div>
          </div>
        </div>

        {/* 일별 성과 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">일별 성과</h2>
          <div className="overflow-hidden border border-gray-200 rounded-lg">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    날짜
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                    노출수
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                    클릭수
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                    지출액
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.dailyStats.map((stat, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {stat.date}
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-900">
                      {stat.impressions.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-900">
                      {stat.clicks.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-900">
                      {stat.spent}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 삭제 확인 모달 */}
      {showDeleteConfirm && (
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
