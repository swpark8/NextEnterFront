import { useState } from "react";
import Footer from "../components/Footer";

interface AdvertisementCreatePageProps {
  onBackClick?: () => void;
  onLogoClick?: () => void;
}

export default function AdvertisementCreatePage({
  onBackClick,
  onLogoClick,
}: AdvertisementCreatePageProps) {
  const [formData, setFormData] = useState({
    title: "",
    jobPostingId: "",
    targetAudience: "",
    startDate: "",
    endDate: "",
    budget: "",
    dailyBudget: "",
    adType: "배너",
    placement: "메인페이지",
    description: "",
  });

  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const handleLogoClick = () => {
    if (onLogoClick) {
      onLogoClick();
    }
  };

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 필수 입력 검증
    if (
      !formData.title ||
      !formData.startDate ||
      !formData.endDate ||
      !formData.budget
    ) {
      alert("필수 항목을 모두 입력해주세요.");
      return;
    }

    alert("광고가 성공적으로 등록되었습니다!");
    handleBackClick();
  };

  const handleCancelClick = () => {
    setShowCancelConfirm(true);
  };

  const handleConfirmCancel = () => {
    setShowCancelConfirm(false);
    handleBackClick();
  };

  const handleCancelCancel = () => {
    setShowCancelConfirm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-4 py-4 mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <div
              onClick={handleLogoClick}
              className="transition-opacity cursor-pointer hover:opacity-80"
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
                className="px-4 py-2 text-gray-700 transition bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                개인 회원
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <div className="max-w-5xl px-4 py-8 mx-auto">
        <div className="p-8 bg-white rounded-lg shadow">
          {/* 상단: 뒤로가기 & 제목 */}
          <div className="flex items-center mb-6">
            <button
              onClick={handleBackClick}
              className="mr-4 text-2xl text-gray-600 hover:text-gray-900"
            >
              ←
            </button>
            <h1 className="text-3xl font-bold text-gray-900">새 광고 등록</h1>
          </div>

          {/* 폼 */}
          <form onSubmit={handleSubmit}>
            {/* 광고 제목 */}
            <div className="mb-6">
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                광고 제목 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="예: 시니어 프론트엔드 개발자 채용 광고"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* 연결된 공고 */}
            <div className="mb-6">
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                연결된 채용 공고
              </label>
              <select
                name="jobPostingId"
                value={formData.jobPostingId}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">공고 선택</option>
                <option value="1">시니어 프론트엔드 개발자 채용</option>
                <option value="2">백엔드 개발자 (Node.js) 채용</option>
                <option value="3">풀스택 개발자 채용</option>
              </select>
            </div>

            {/* 광고 기간 */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  시작일 <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  종료일 <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* 예산 */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  총 예산 <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="500000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">단위: 원</p>
              </div>
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  일일 예산 (선택)
                </label>
                <input
                  type="number"
                  name="dailyBudget"
                  value={formData.dailyBudget}
                  onChange={handleChange}
                  placeholder="20000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="mt-1 text-xs text-gray-500">단위: 원</p>
              </div>
            </div>

            {/* 광고 타입 */}
            <div className="mb-6">
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                광고 유형
              </label>
              <select
                name="adType"
                value={formData.adType}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="배너">배너 광고</option>
                <option value="검색">검색 광고</option>
                <option value="추천">추천 광고</option>
                <option value="프리미엄">프리미엄 노출</option>
              </select>
            </div>

            {/* 광고 게재 위치 */}
            <div className="mb-6">
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                게재 위치
              </label>
              <select
                name="placement"
                value={formData.placement}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="메인페이지">메인페이지</option>
                <option value="검색결과">검색 결과 페이지</option>
                <option value="공고목록">공고 목록 페이지</option>
                <option value="상세페이지">상세 페이지</option>
              </select>
            </div>

            {/* 타겟 대상 */}
            <div className="mb-6">
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                타겟 대상
              </label>
              <input
                type="text"
                name="targetAudience"
                value={formData.targetAudience}
                onChange={handleChange}
                placeholder="예: 프론트엔드 개발자, 3년 이상 경력자"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* 광고 설명 */}
            <div className="mb-6">
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                광고 설명
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="광고에 대한 상세 설명을 입력하세요..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* 예산 가이드 */}
            <div className="p-4 mb-8 border border-blue-200 rounded-lg bg-blue-50">
              <h3 className="mb-2 text-sm font-semibold text-blue-900">
                💡 광고 예산 가이드
              </h3>
              <ul className="space-y-1 text-sm text-blue-800">
                <li>• 배너 광고: 클릭당 500원 ~ 1,000원</li>
                <li>• 검색 광고: 클릭당 1,000원 ~ 2,000원</li>
                <li>• 프리미엄 노출: 일일 20,000원 ~ 50,000원</li>
                <li>• 추천: 최소 예산 300,000원 이상을 권장합니다</li>
              </ul>
            </div>

            {/* 하단 버튼 */}
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={handleCancelClick}
                className="flex-1 px-6 py-3 font-semibold text-gray-700 transition bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                취소
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 font-semibold text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                광고 등록
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 취소 확인 모달 */}
      {showCancelConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 mx-4 bg-white rounded-lg">
            <h3 className="mb-2 text-lg font-bold text-gray-900">
              광고 등록 취소
            </h3>
            <p className="mb-6 text-gray-600">
              작성 중인 내용이 저장되지 않습니다. 정말로 취소하시겠습니까?
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleCancelCancel}
                className="flex-1 px-4 py-2 text-gray-700 transition bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                계속 작성
              </button>
              <button
                onClick={handleConfirmCancel}
                className="flex-1 px-4 py-2 text-white transition bg-red-600 rounded-lg hover:bg-red-700"
              >
                취소하기
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
