import { useState } from "react";

interface CreditChargePageProps {
  onBack?: () => void;
}

export default function CreditChargePage({ onBack }: CreditChargePageProps) {
  const [selectedPackage, setSelectedPackage] = useState<number>(10);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("kakaopay");

  const packages = [
    { credits: 10, price: 1000 },
    { credits: 30, price: 2800 },
    { credits: 50, price: 4500 },
    { credits: 80, price: 7300 },
    { credits: 100, price: 9000, discount: "10%할인!" },
  ];

  const handlePackageSelect = (credits: number) => {
    setSelectedPackage(credits);
  };

  const handlePayment = () => {
    alert("결제가 완료되었습니다!");
    if (onBack) {
      onBack();
    }
  };

  const getPrice = (credits: number) => {
    const pkg = packages.find((p) => p.credits === credits);
    return pkg ? pkg.price : 0;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl px-4 py-8 mx-auto">
        {/* 헤더 */}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex items-center justify-center w-10 h-10 text-xl text-white bg-orange-400 rounded-full">
            💳
          </div>
          <h1 className="text-2xl font-bold">크레딧 충전</h1>
        </div>
        {/* NEXT ENTER 크레딧 구매 */}
        <div className="p-6 mb-6 text-white bg-gradient-to-r from-purple-500 via-purple-400 to-cyan-400 rounded-2xl">
          <h2 className="text-xl font-bold">NEXT ENTER 크레딧 구매</h2>
        </div>
        {/* 결제 금액 */}
        <div className="p-8 mb-6 bg-white border-2 border-gray-200 rounded-2xl">
          <h3 className="mb-6 text-lg font-bold">결제 금액</h3>
          <div className="grid grid-cols-5 gap-4">
            {packages.map((pkg) => (
              <button
                key={pkg.credits}
                onClick={() => handlePackageSelect(pkg.credits)}
                className={`relative p-4 border-2 rounded-xl transition ${
                  selectedPackage === pkg.credits
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-blue-300"
                }`}
              >
                {pkg.discount && (
                  <div className="absolute px-2 py-1 text-xs font-bold text-white bg-blue-500 rounded-full top-2 right-2">
                    {pkg.discount}
                  </div>
                )}
                <div className="flex items-center justify-center gap-1 mb-2 text-orange-400">
                  <span className="text-xl">💳</span>
                  <span className="font-bold">{pkg.credits}</span>
                </div>
                <div className="font-bold text-center text-gray-800">
                  {pkg.price.toLocaleString()}원
                </div>
              </button>
            ))}
          </div>
        </div>
        {/* 결제 수단 */}
        <div className="p-8 mb-6 bg-white border-2 border-gray-200 rounded-2xl">
          <h3 className="mb-6 text-lg font-bold">결제 수단</h3>
          <div className="grid grid-cols-4 gap-4">
            <button className="px-6 py-3 font-medium text-gray-700 transition border-2 border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50">
              간편 결제
            </button>
            <button className="px-6 py-3 font-medium text-gray-700 transition border-2 border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50">
              온라인 이체
            </button>
            <button className="px-6 py-3 font-medium text-gray-700 transition border-2 border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50">
              휴대폰 결제
            </button>
            <button className="px-6 py-3 font-medium text-gray-700 transition border-2 border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50">
              카드 결제
            </button>
          </div>

          <div className="p-4 mt-6 rounded-lg bg-gray-50">
            <p className="text-sm text-gray-600">
              간편 결제는 카카오톡 또는 카카오페이 모바일 앱이 필요합니다. |
              카카오페이 고객센터 1234-5678
            </p>
          </div>
        </div>
        {/* 결제 방식 */}
        <div className="p-8 mb-6 bg-white border-2 border-gray-200 rounded-2xl">
          <h3 className="mb-6 text-lg font-bold">결제 방식</h3>
          <div className="flex gap-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="payment"
                value="kakaopay"
                checked={selectedPaymentMethod === "kakaopay"}
                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                className="w-5 h-5"
              />
              <div className="flex items-center gap-2 px-4 py-2 bg-yellow-300 rounded-lg">
                <span className="text-sm font-bold">💬</span>
                <span className="font-bold text-gray-800">kakaopay</span>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="payment"
                value="toss"
                checked={selectedPaymentMethod === "toss"}
                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                className="w-5 h-5"
              />
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-500 rounded-lg">
                <span className="text-sm font-bold text-white">💬</span>
                <span className="font-bold text-white">toss</span>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="payment"
                value="npay"
                checked={selectedPaymentMethod === "npay"}
                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                className="w-5 h-5"
              />
              <div className="flex items-center gap-2 px-4 py-2 bg-green-500 rounded-lg">
                <span className="text-sm font-bold text-white">N</span>
                <span className="font-bold text-white">pay</span>
              </div>
            </label>
          </div>
        </div>
        {/* 크레딧 충전 결제 동의 및 결제 진행사항 */}
        <div className="p-8 mb-6 bg-white border-2 border-gray-200 rounded-2xl">
          <h3 className="mb-4 text-lg font-bold">
            크레딧 충전
            <br />
            결제 동의 및
            <br />
            결제 진행사항
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-end gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span className="text-sm text-gray-600">동의</span>
            </div>
          </div>
        </div>
        상품 가격 및 유효기간을 확인하였으며, 계약 관련 고지 사항과 정책 및 결제
        진행에 동의합니다.
        {/* 결제하기 버튼 */}
        <div className="flex justify-end">
          <button
            onClick={handlePayment}
            className="px-12 py-4 text-lg font-bold text-white transition bg-red-500 rounded-lg hover:bg-red-600"
          >
            결제하기
          </button>
        </div>
      </div>
    </div>
  );
}
