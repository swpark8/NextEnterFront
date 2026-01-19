import { useState, useMemo, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";
import CreditSidebar from "./components/CreditSidebar";
import { usePageNavigation } from "../../hooks/usePageNavigation";
import { getActiveAdvertisements, Advertisement } from "../../api/advertisement";

interface CreditPageProps {
  onNavigate?: (page: string, subMenu?: string) => void;
  initialMenu?: string;
}

export default function CreditPage({
  onNavigate,
  initialMenu,
}: CreditPageProps) {
  const { user } = useAuth();
  const { activeMenu, handleMenuClick } = usePageNavigation(
    "credit",
    initialMenu || "credit-sub-1",
    onNavigate
  );

  // ✅ AppContext에서 실제 데이터 가져오기
  const { 
    creditBalance, 
    creditTransactions, 
    coupons, 
    useCoupon,
    businessJobs 
  } = useApp();

  const [activeTab, setActiveTab] = useState<"coupon" | "usage" | "mileage">(
    "coupon"
  );

  // ✅ 광고 데이터 상태
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [loadingAds, setLoadingAds] = useState(true);

  // ✅ 광고 데이터 불러오기
  useEffect(() => {
    const fetchAdvertisements = async () => {
      try {
        setLoadingAds(true);
        const ads = await getActiveAdvertisements();
        setAdvertisements(ads);
      } catch (error) {
        console.error("Failed to fetch advertisements:", error);
        // 에러 발생 시 기본 광고 표시
        setAdvertisements([]);
      } finally {
        setLoadingAds(false);
      }
    };

    fetchAdvertisements();
  }, []);

  // ✅ 사용 가능한 쿠폰만 필터링
  const availableCoupons = useMemo(() => {
    return coupons.filter(c => !c.isUsed);
  }, [coupons]);

  // ✅ 사용한 쿠폰만 필터링
  const usedCoupons = useMemo(() => {
    return coupons.filter(c => c.isUsed);
  }, [coupons]);

  // ✅ 충전 내역만 필터링
  const chargeTransactions = useMemo(() => {
    return creditTransactions.filter(t => t.type === "충전");
  }, [creditTransactions]);

  // ✅ 사용 내역만 필터링
  const usageTransactions = useMemo(() => {
    return creditTransactions.filter(t => t.type === "사용");
  }, [creditTransactions]);

  // ✅ 추천 공고 (businessJobs 중 하나를 랜덤 또는 최신 것 표시)
  const featuredJob = useMemo(() => {
    if (businessJobs.length === 0) return null;
    return businessJobs[0];
  }, [businessJobs]);

  const handleCouponClick = (id: number) => {
    if (confirm("이 쿠폰을 사용하시겠습니까?")) {
      useCoupon(id);
      alert("쿠폰이 사용되었습니다!");
    }
  };

  const handlePromote = () => {
    handleMenuClick("credit-sub-2");
  };

  const handleJobClick = () => {
    if (featuredJob) {
      handleMenuClick("job-sub-1");
    }
  };

  // ✅ 광고 클릭 핸들러
  const handleAdvertisementClick = (ad: Advertisement) => {
    if (ad.targetPage) {
      handleMenuClick(ad.targetPage);
    } else if (ad.targetUrl) {
      window.open(ad.targetUrl, "_blank");
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="px-4 py-5 mx-auto max-w-7xl">
          <div className="flex items-end justify-between mb-6">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">보유 크레딧</h1>
            </div>
            <button
              onClick={handlePromote}
              className="flex items-center gap-2 px-6 py-2 text-blue-600 transition border-2 border-blue-500 rounded-lg hover:bg-blue-50"
            >
              <span>+</span>
              <span>충전하기</span>
            </button>
          </div>

          <div className="flex gap-6">
            {/* 왼쪽 사이드바 */}
            <CreditSidebar
              activeMenu={activeMenu}
              onMenuClick={handleMenuClick}
            />

            {/* 메인 컨텐츠 */}
            <div className="flex-1">
              {/* 크레딧 카드 */}
              <div className="p-8 mb-6 text-white bg-gradient-to-r from-purple-500 via-purple-400 to-cyan-400 rounded-2xl">
                <h2 className="mb-6 text-xl">
                  {user?.name || "admin"}님의 현재 사용 가능 크레딧
                </h2>
                <div className="flex items-center justify-end gap-3 mb-4">
                  <span className="text-6xl font-bold">{creditBalance}</span>
                  <div className="flex items-center justify-center w-12 h-12 text-2xl bg-orange-400 rounded-full">
                    💳
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="px-4 py-2 text-sm text-gray-700 rounded-full bg-white/90">
                    30일 이내 소멸 가능 마일리지 0M
                  </div>
                </div>
              </div>

              {/* 탭 */}
              <div className="overflow-hidden bg-white border-2 border-gray-200 rounded-2xl">
                <div className="flex border-b-2 border-gray-200">
                  {["coupon", "usage", "mileage"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() =>
                        setActiveTab(tab as "coupon" | "usage" | "mileage")
                      }
                      className={`flex-1 py-4 font-semibold transition ${
                        activeTab === tab
                          ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {tab === "coupon" && "쿠폰 목록"}
                      {tab === "usage" && "쿠폰 이용 내역"}
                      {tab === "mileage" && "마일리지 내역"}
                    </button>
                  ))}
                </div>

                <div className="p-6">
                  {/* ✅ 광고 탭 (쿠폰 목록 대신) */}
                  {activeTab === "coupon" && (
                    <div className="space-y-4">
                      {loadingAds ? (
                        <div className="py-12 text-center text-gray-500">
                          <div className="mb-4 text-4xl">⏳</div>
                          <p>광고를 불러오는 중...</p>
                        </div>
                      ) : advertisements.length === 0 ? (
                        <div className="py-12 text-center text-gray-500">
                          <div className="mb-4 text-4xl">📢</div>
                          <p>현재 등록된 광고가 없습니다</p>
                        </div>
                      ) : (
                        advertisements.map((ad) => (
                          <div
                            key={ad.id}
                            className={`${ad.backgroundColor} text-white rounded-xl p-6 shadow-lg cursor-pointer transition hover:shadow-xl hover:scale-[1.02]`}
                          >
                            <h3 className="mb-3 text-2xl font-bold">{ad.title}</h3>
                            <p className="mb-4 text-lg opacity-90">
                              {ad.description}
                            </p>
                            <button
                              onClick={() => handleAdvertisementClick(ad)}
                              className="px-6 py-3 font-semibold text-gray-900 transition bg-white rounded-lg hover:bg-gray-100"
                            >
                              {ad.buttonText}
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {/* 쿠폰 이용 내역 탭 */}
                  {activeTab === "usage" && (
                    <div>
                      {usedCoupons.length === 0 ? (
                        <div className="py-12 text-center text-gray-500">
                          사용한 쿠폰이 없습니다
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {usedCoupons.map((coupon) => (
                            <div
                              key={coupon.id}
                              className="p-4 bg-gray-100 border border-gray-200 rounded-lg"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-gray-700">
                                  {coupon.label}
                                </span>
                                <span className="text-sm text-gray-500">
                                  사용됨
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* 마일리지 내역 탭 */}
                  {activeTab === "mileage" && (
                    <div>
                      {chargeTransactions.length === 0 ? (
                        <div className="py-12 text-center text-gray-500">
                          충전 내역이 없습니다
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="p-4 mb-4 text-center rounded-lg bg-blue-50">
                            <span className="text-gray-600">총 충전</span>
                            <span className="mx-2 text-2xl font-bold text-blue-600">
                              {chargeTransactions.reduce((sum, t) => sum + t.amount, 0)}
                            </span>
                            <span className="text-gray-600">크레딧</span>
                          </div>

                          {chargeTransactions.map((transaction) => (
                            <div
                              key={transaction.id}
                              className="p-4 bg-white border border-gray-200 rounded-lg"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-gray-900">
                                  {transaction.description}
                                </span>
                                <span className="text-lg font-bold text-blue-600">
                                  +{transaction.amount}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-sm text-gray-500">
                                <span>{transaction.date}</span>
                                <span>잔액: {transaction.balance}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* FAQ */}
              <div className="p-6 mt-6 bg-white border-2 border-gray-200 rounded-2xl">
                <div className="pl-4 mb-4 border-l-4 border-red-400">
                  <h3 className="text-lg font-bold">
                    크레딧은 어디에 쓸 수 있나요?
                  </h3>
                </div>
                <ol className="space-y-2 text-gray-700 list-decimal list-inside">
                  <li>AI 이력서 분석 및 개선 제안</li>
                  <li>매칭 분석 서비스 이용</li>
                  <li>AI 모의 면접 진행</li>
                </ol>
              </div>
            </div>

            {/* 오른쪽 사이드 - 추천 공고 */}
            <div className="w-80">
              <div className="sticky p-6 bg-white border-2 border-blue-400 rounded-2xl top-8">
                <div className="flex items-center gap-2 mb-4">
                  <span>⭐</span>
                  <h3 className="text-lg font-bold">
                    지금 뜨는 공고 바로 지원
                  </h3>
                </div>

                {featuredJob ? (
                  <button
                    onClick={handleJobClick}
                    className="w-full p-6 transition border-2 border-blue-300 rounded-xl hover:shadow-lg"
                  >
                    <div className="flex items-center justify-center h-40 mb-4 border-2 border-blue-300 border-dashed rounded-lg">
                      <span className="text-4xl">🏢</span>
                    </div>
                    <h4 className="mb-4 text-xl font-bold text-center">
                      {featuredJob.title}
                    </h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div>직무: {featuredJob.job_category}</div>
                      <div>위치: {featuredJob.location}</div>
                      <div>마감: {featuredJob.deadline}</div>
                      <div className="mt-3 text-blue-600">
                        조회: {featuredJob.view_count} | 지원: {featuredJob.applicant_count}
                      </div>
                    </div>
                  </button>
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    <div className="mb-4 text-4xl">📋</div>
                    <p>등록된 공고가 없습니다</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
