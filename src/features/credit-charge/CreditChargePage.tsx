import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";
import { usePageNavigation } from "../../hooks/usePageNavigation";

interface CreditChargePageProps {
  onBack?: () => void;
  initialMenu?: string;
  onNavigate?: (page: string, subMenu?: string) => void;
  onPaymentComplete?: (amount: number, credits: number, bonus: number) => void;
}

export default function CreditChargePage({
  onBack,
  initialMenu,
  onNavigate,
  onPaymentComplete,
}: CreditChargePageProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { creditBalance, addCreditTransaction } = useApp();
  const { handleMenuClick } = usePageNavigation(
    "credit",
    initialMenu || "credit-sub-2",
    onNavigate
  );

  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const packages = [
    { credits: 100, price: 10000, bonus: 0 },
    { credits: 300, price: 30000, bonus: 5 },
    { credits: 500, price: 50000, bonus: 10 },
    { credits: 1000, price: 100000, bonus: 20 },
    { credits: 2000, price: 200000, bonus: 50 },
  ];

  const paymentMethods = [
    { id: "card", name: "카드결제", icon: "💳" },
    { id: "kakaopay", name: "카카오페이", icon: "💬", color: "bg-yellow-400" },
    { id: "toss", name: "토스", icon: "💙", color: "bg-blue-500 text-white" },
    {
      id: "naverpay",
      name: "네이버페이",
      icon: "N",
      color: "bg-green-500 text-white",
    },
  ];

  const handlePackageSelect = (credits: number) => {
    setSelectedPackage(credits);
  };

  const handlePayment = () => {
    if (!selectedPackage) {
      alert("충전할 크레딧을 선택해주세요.");
      return;
    }
    if (!selectedPaymentMethod) {
      alert("결제 수단을 선택해주세요.");
      return;
    }
    if (!agreeTerms) {
      alert("결제 약관에 동의해주세요.");
      return;
    }

    const pkg = packages.find((p) => p.credits === selectedPackage);
    if (!pkg) return;

    // ✅ 크레딧 충전 내역 저장
    const totalCredits = pkg.credits + pkg.bonus;
    const today = new Date();
    const dateString = `${today.getFullYear()}.${String(
      today.getMonth() + 1
    ).padStart(2, "0")}.${String(today.getDate()).padStart(2, "0")}`;

    addCreditTransaction({
      date: dateString,
      amount: totalCredits,
      type: "충전",
      description: `크레딧 ${pkg.credits} + 보너스 ${pkg.bonus}`,
    });

    // ✅ 결제 완료 페이지로 이동 (state로 결제 정보 전달)
    navigate("/user/credit/complete", {
      state: {
        amount: pkg.price,
        credits: pkg.credits,
        bonus: pkg.bonus,
      },
    });
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      handleMenuClick("credit-sub-1");
    }
  };

  const getSelectedPackage = () => {
    return packages.find((p) => p.credits === selectedPackage);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl px-4 py-8 mx-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 text-2xl text-white bg-orange-400 rounded-full">
              💰
            </div>
            <h1 className="text-3xl font-bold text-gray-900">크레딧 충전</h1>
          </div>
          <button
            onClick={handleBack}
            className="px-4 py-2 text-gray-600 hover:text-gray-900"
          >
            ← 뒤로가기
          </button>
        </div>

        {/* 현재 보유 크레딧 */}
        <div className="p-6 mb-6 text-white bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <div className="mb-2 text-sm opacity-90">
                {user?.name || "사용자"}님의 현재 사용 가능 크레딧
              </div>
              <div className="flex items-center gap-2">
                <span className="text-4xl font-bold">{creditBalance}</span>
                <span className="text-xl">💰</span>
              </div>
            </div>
          </div>
        </div>

        {/* 충전 금액 선택 */}
        <div className="p-8 mb-6 bg-white shadow-sm rounded-2xl">
          <h3 className="mb-6 text-xl font-bold text-gray-900">
            충전 금액 선택
          </h3>
          <div className="grid grid-cols-5 gap-4">
            {packages.map((pkg) => (
              <button
                key={pkg.credits}
                onClick={() => handlePackageSelect(pkg.credits)}
                className={`relative p-6 border-2 rounded-xl transition ${
                  selectedPackage === pkg.credits
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300"
                }`}
              >
                {pkg.bonus > 0 && (
                  <div className="absolute px-3 py-1 text-xs font-bold text-white bg-red-500 rounded-full -top-2 -right-2">
                    +{pkg.bonus}
                  </div>
                )}
                <div className="mb-3 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <span className="text-2xl">💰</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {pkg.credits}
                  </div>
                  <div className="text-sm text-gray-500">크레딧</div>
                </div>
                <div className="pt-3 text-center border-t border-gray-200">
                  <div className="text-lg font-bold text-gray-900">
                    {pkg.price.toLocaleString()}원
                  </div>
                </div>
              </button>
            ))}
          </div>
          {selectedPackage && (
            <div className="p-4 mt-6 rounded-lg bg-blue-50">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">선택한 패키지</span>
                <span className="text-xl font-bold text-blue-600">
                  {getSelectedPackage()?.credits}크레딧 (
                  {getSelectedPackage()?.price.toLocaleString()}원)
                  {getSelectedPackage()?.bonus
                    ? ` + 보너스 ${getSelectedPackage()?.bonus}`
                    : ""}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 결제 수단 선택 */}
        <div className="p-8 mb-6 bg-white shadow-sm rounded-2xl">
          <h3 className="mb-6 text-xl font-bold text-gray-900">결제 수단</h3>
          <div className="grid grid-cols-4 gap-4">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedPaymentMethod(method.id)}
                className={`p-6 border-2 rounded-xl transition ${
                  selectedPaymentMethod === method.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300"
                }`}
              >
                <div className="text-center">
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 mb-3 text-2xl rounded-full ${
                      method.color || "bg-gray-100"
                    }`}
                  >
                    {method.icon}
                  </div>
                  <div className="font-medium text-gray-900">{method.name}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 결제 정보 확인 */}
        {selectedPackage && selectedPaymentMethod && (
          <div className="p-8 mb-6 bg-white shadow-sm rounded-2xl">
            <h3 className="mb-6 text-xl font-bold text-gray-900">결제 정보</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600">충전 크레딧</span>
                <span className="text-lg font-bold text-gray-900">
                  {getSelectedPackage()?.credits}크레딧
                </span>
              </div>
              {getSelectedPackage()?.bonus &&
                getSelectedPackage()!.bonus > 0 && (
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-600">보너스 크레딧</span>
                    <span className="text-lg font-bold text-orange-600">
                      +{getSelectedPackage()?.bonus}크레딧
                    </span>
                  </div>
                )}
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600">결제 수단</span>
                <span className="text-lg font-medium text-gray-900">
                  {
                    paymentMethods.find((m) => m.id === selectedPaymentMethod)
                      ?.name
                  }
                </span>
              </div>
              <div className="flex items-center justify-between px-4 py-4 rounded-lg bg-gray-50">
                <span className="text-lg font-bold text-gray-900">
                  총 결제 금액
                </span>
                <span className="text-2xl font-bold text-blue-600">
                  {getSelectedPackage()?.price.toLocaleString()}원
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 약관 동의 */}
        <div className="p-8 mb-6 bg-white shadow-sm rounded-2xl">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="w-5 h-5 mt-1"
            />
            <div className="text-gray-700">
              <span className="font-medium">결제 약관에 동의합니다</span>
              <p className="mt-1 text-sm text-gray-500">
                상품 가격 및 유효기간을 확인하였으며, 계약 관련 고지 사항과 정책
                및 결제 진행에 동의합니다.
              </p>
            </div>
          </label>
        </div>

        {/* 결제하기 버튼 */}
        <div className="flex justify-end">
          <button
            onClick={handlePayment}
            disabled={!selectedPackage || !selectedPaymentMethod || !agreeTerms}
            className={`px-12 py-4 text-lg font-bold text-white rounded-lg transition ${
              selectedPackage && selectedPaymentMethod && agreeTerms
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            {selectedPackage && getSelectedPackage()
              ? `${getSelectedPackage()!.price.toLocaleString()}원 결제하기`
              : "결제하기"}
          </button>
        </div>

        {/* 크레딧 사용 안내 */}
        <div className="p-6 mt-8 border-2 border-gray-200 rounded-2xl">
          <h4 className="mb-4 text-lg font-bold text-gray-900">
            💡 크레딧 사용 안내
          </h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>
              • 크레딧은 AI 이력서 분석, 매칭 분석, 모의 면접 등에 사용됩니다
            </li>
            <li>
              • 충전된 크레딧은 환불되지 않으며, 유효기간은 충전일로부터
              1년입니다
            </li>
            <li>
              • 보너스 크레딧은 프로모션 기간에만 제공되며, 별도 유효기간이
              적용될 수 있습니다
            </li>
            <li>• 크레딧 사용 내역은 크레딧 페이지에서 확인하실 수 있습니다</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
