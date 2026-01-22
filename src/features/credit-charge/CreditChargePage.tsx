import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";
import { usePageNavigation } from "../../hooks/usePageNavigation";
import { chargeCredit } from "../../api/credit";
import { verifyPayment } from "../../api/payment";

interface CreditChargePageProps {
  onBack?: () => void;
  initialMenu?: string;
  onNavigate?: (page: string, subMenu?: string) => void;
  onPaymentComplete?: (amount: number, credits: number, bonus: number) => void;
}

// PortOne 타입 선언
declare global {
  interface Window {
    PortOne?: any;
  }
}

// ✅ 포트원 설정 (각 결제 수단별 채널키)
const PORTONE_CONFIG = {
  storeId: "store-c27f5e9a-df90-425f-8e56-c055caed2dbe", // ✅ 실제 Store ID로 변경
  channels: {
    kakaopay: "channel-key-7cb7a748-784c-4409-843d-9f46f3b9a2fd", // ✅ 카카오페이 채널키
    toss: "channel-key-06995bd1-82f1-4500-91da-588226c7290d", // ✅ 토스페이 채널키
  }
};

// 은행 목록
const BANKS = [
  { id: "shinhan", name: "신한은행", color: "bg-blue-600" },
  { id: "kookmin", name: "KB국민은행", color: "bg-yellow-600" },
  { id: "woori", name: "우리은행", color: "bg-blue-500" },
  { id: "hana", name: "하나은행", color: "bg-green-600" },
  { id: "nh", name: "NH농협은행", color: "bg-green-700" },
  { id: "ibk", name: "IBK기업은행", color: "bg-blue-700" },
  { id: "kakaobank", name: "카카오뱅크", color: "bg-yellow-400" },
  { id: "kbank", name: "케이뱅크", color: "bg-blue-400" },
  { id: "tossbank", name: "토스뱅크", color: "bg-blue-500" },
  { id: "samsung", name: "삼성카드", color: "bg-blue-800" },
  { id: "hyundai", name: "현대카드", color: "bg-black" },
  { id: "lotte", name: "롯데카드", color: "bg-red-600" },
];

export default function CreditChargePage({
  onBack,
  initialMenu,
  onNavigate,
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

  // ✅ 카드결제 관련 상태
  const [selectedBank, setSelectedBank] = useState<string>("");
  const [cardNumber, setCardNumber] = useState<string>("");
  const [cardNumberError, setCardNumberError] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

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
    { id: "toss", name: "토스페이", icon: "💙", color: "bg-blue-500 text-white" },
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

  const handlePaymentMethodSelect = (methodId: string) => {
    setSelectedPaymentMethod(methodId);
    // 카드결제가 아닌 다른 결제 수단 선택 시 카드 정보 초기화
    if (methodId !== "card") {
      setSelectedBank("");
      setCardNumber("");
      setCardNumberError("");
    }
  };

  // ✅ 카드번호 입력 처리 (자동 하이픈 추가)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ""); // 숫자만 추출

    // 16자리 제한
    if (value.length > 16) {
      value = value.slice(0, 16);
    }

    // 4자리마다 하이픈 추가
    const formatted = value.replace(/(\d{4})(?=\d)/g, "$1-");
    setCardNumber(formatted);
    setCardNumberError("");
  };

  // ✅ 카드번호 유효성 검사
  const validateCardNumber = (): boolean => {
    const digits = cardNumber.replace(/\D/g, "");

    if (digits.length === 0) {
      setCardNumberError("카드번호를 입력해주세요.");
      return false;
    }

    if (digits.length !== 16) {
      setCardNumberError("카드번호 16자리를 모두 입력해주세요.");
      return false;
    }

    return true;
  };

  const handlePayment = async () => {
    if (!selectedPackage) {
      alert("충전할 크레딧을 선택해주세요.");
      return;
    }
    if (!selectedPaymentMethod) {
      alert("결제 수단을 선택해주세요.");
      return;
    }
  
    // ✅ 카드결제인 경우 추가 검증
    if (selectedPaymentMethod === "card") {
      if (!selectedBank) {
        alert("은행을 선택해주세요.");
        return;
      }
      if (!validateCardNumber()) {
        return;
      }
    }
  
    if (!agreeTerms) {
      alert("결제 약관에 동의해주세요.");
      return;
    }
  
    // ✅ 개인/기업 구분하여 ID 가져오기
    const targetUserId = user?.userType === "company" ? user?.companyId : user?.userId;
    
    if (!targetUserId) {
      alert("로그인이 필요합니다.");
      return;
    }
  
    const pkg = packages.find((p) => p.credits === selectedPackage);
    if (!pkg) return;
  
    try {
      setIsProcessing(true);
  
      // ✅ 카카오페이 또는 토스페이 실제 결제
      if (selectedPaymentMethod === "kakaopay" || selectedPaymentMethod === "toss") {
        if (!window.PortOne) {
          alert("결제 모듈을 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
          setIsProcessing(false);
          return;
        }
  
        const totalCredits = pkg.credits + pkg.bonus;
        const paymentId = `credit_${targetUserId}_${Date.now()}`;
  
        let channelKey: string;
        let easyPayProvider: string;
        let paymentMethodName: string;
  
        if (selectedPaymentMethod === "kakaopay") {
          channelKey = PORTONE_CONFIG.channels.kakaopay;
          easyPayProvider = "KAKAOPAY";
          paymentMethodName = "카카오페이";
        } else {
          channelKey = PORTONE_CONFIG.channels.toss;
          easyPayProvider = "TOSSPAY";
          paymentMethodName = "토스페이";
        }
  
        console.log(`${paymentMethodName} 결제 시작:`, {
          targetUserId,
          totalCredits
        });
  
        const response = await window.PortOne.requestPayment({
          storeId: PORTONE_CONFIG.storeId,
          channelKey: channelKey,
          paymentId: paymentId,
          orderName: `크레딧 ${pkg.credits} 충전`,
          totalAmount: pkg.price,
          currency: "KRW",
          payMethod: "EASY_PAY",
          easyPay: {
            easyPayProvider: easyPayProvider,
          },
          customer: {
            customerId: targetUserId.toString(),
            fullName: user.name,
            email: user.email,
          },
        });
  
        console.log("PortOne 결제 응답:", response);
  
        if (response.code != null) {
          alert(`결제에 실패했습니다: ${response.message}`);
          setIsProcessing(false);
          return;
        }
  
        // ✅ 백엔드 검증
        const verifyResult = await verifyPayment(targetUserId, {
          paymentId: response.paymentId,
          transactionId: response.transactionId || response.paymentId,
          amount: pkg.price,
          credits: totalCredits,
        });
  
        if (verifyResult.success) {
          const today = new Date();
          const dateString = `${today.getFullYear()}.${String(
            today.getMonth() + 1
          ).padStart(2, "0")}.${String(today.getDate()).padStart(2, "0")}`;
  
          addCreditTransaction({
            date: dateString,
            amount: totalCredits,
            type: "충전",
            description: `크레딧 ${pkg.credits} + 보너스 ${pkg.bonus} (${paymentMethodName})`,
          });
  
          // ✅ 개인/기업 구분
          if (user?.userType === "company") {
            navigate("/company/credit", {
              state: {
                charged: true,
                amount: pkg.price,
                credits: pkg.credits,
                bonus: pkg.bonus,
              },
            });
            alert(`충전 완료! ${totalCredits} 크레딧이 충전되었습니다.`);
          } else {
            navigate("/user/credit/complete", {
              state: {
                amount: pkg.price,
                credits: pkg.credits,
                bonus: pkg.bonus,
                newBalance: verifyResult.credits,
              },
            });
          }
        } else {
          alert(verifyResult.message || "결제 검증에 실패했습니다.");
        }
  
        setIsProcessing(false);
        return;
      }
  
      // ✅ 기존 카드결제/네이버페이
      await new Promise((resolve) => setTimeout(resolve, 1000));
  
      const totalCredits = pkg.credits + pkg.bonus;
  
      const response = await chargeCredit(targetUserId, {
        amount: totalCredits,
        paymentMethod:
          selectedPaymentMethod === "card"
            ? `카드결제(${
                BANKS.find((b) => b.id === selectedBank)?.name || selectedBank
              })`
            : paymentMethods.find((m) => m.id === selectedPaymentMethod)
                ?.name || selectedPaymentMethod,
        description: `크레딧 ${pkg.credits} + 보너스 ${pkg.bonus}`,
      });
  
      if (response.success && response.balance) {
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
  
        // ✅ 개인/기업 구분
        if (user?.userType === "company") {
          navigate("/company/credit", {
            state: {
              charged: true,
              amount: pkg.price,
              credits: pkg.credits,
              bonus: pkg.bonus,
            },
          });
          alert(`충전 완료! ${totalCredits} 크레딧이 충전되었습니다.`);
        } else {
          navigate("/user/credit/complete", {
            state: {
              amount: pkg.price,
              credits: pkg.credits,
              bonus: pkg.bonus,
              newBalance: response.balance.balance,
            },
          });
        }
      } else {
        alert(response.message || "크레딧 충전에 실패했습니다.");
      }
    } catch (error: any) {
      console.error("결제 오류:", error);
      alert(error.message || "결제 중 오류가 발생했습니다.");
    } finally {
      setIsProcessing(false);
    }
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

  const getSelectedBank = () => {
    return BANKS.find((b) => b.id === selectedBank);
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
                onClick={() => handlePaymentMethodSelect(method.id)}
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

          {/* ✅ 카카오페이 안내 메시지 */}
          {selectedPaymentMethod === "kakaopay" && (
            <div className="p-4 mt-6 border-2 border-yellow-400 rounded-lg bg-yellow-50">
              <div className="flex items-start gap-3">
                <span className="text-2xl">💬</span>
                <div>
                  <h4 className="mb-2 font-bold text-gray-900">
                    실제 카카오페이 결제가 진행됩니다
                  </h4>
                  <p className="text-sm text-gray-700">
                    포트원(PortOne) 결제 시스템을 통해 실제 카카오페이 결제가
                    진행됩니다. 결제 완료 후 크레딧이 자동으로 충전됩니다.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ✅ 토스페이 안내 메시지 */}
          {selectedPaymentMethod === "toss" && (
            <div className="p-4 mt-6 border-2 border-blue-400 rounded-lg bg-blue-50">
              <div className="flex items-start gap-3">
                <span className="text-2xl">💙</span>
                <div>
                  <h4 className="mb-2 font-bold text-gray-900">
                    실제 토스페이 결제가 진행됩니다
                  </h4>
                  <p className="text-sm text-gray-700">
                    포트원(PortOne) 결제 시스템을 통해 실제 토스페이 결제가
                    진행됩니다. 결제 완료 후 크레딧이 자동으로 충전됩니다.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ✅ 카드결제 선택 시 은행 선택 */}
        {selectedPaymentMethod === "card" && (
          <div className="p-8 mb-6 bg-white shadow-sm rounded-2xl">
            <h3 className="mb-6 text-xl font-bold text-gray-900">은행 선택</h3>
            <div className="grid grid-cols-4 gap-3">
              {BANKS.map((bank) => (
                <button
                  key={bank.id}
                  onClick={() => setSelectedBank(bank.id)}
                  className={`p-4 border-2 rounded-lg transition ${
                    selectedBank === bank.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <div className="text-center">
                    <div
                      className={`inline-flex items-center justify-center w-12 h-12 mb-2 text-white rounded-full ${bank.color}`}
                    >
                      <span className="text-lg font-bold">
                        {bank.name.charAt(0)}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {bank.name}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* ✅ 카드번호 입력 */}
            {selectedBank && (
              <div className="mt-6">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  카드번호
                </label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  placeholder="0000-0000-0000-0000"
                  maxLength={19} // 16자리 + 3개 하이픈
                  className={`w-full px-4 py-3 text-lg border-2 rounded-lg focus:outline-none focus:ring-2 ${
                    cardNumberError
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                />
                {cardNumberError && (
                  <p className="mt-2 text-sm text-red-600">{cardNumberError}</p>
                )}
                <p className="mt-2 text-xs text-gray-500">
                  실제 결제가 진행되지 않습니다. 테스트용 카드번호를
                  입력해주세요.
                </p>
              </div>
            )}
          </div>
        )}

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
                  {selectedPaymentMethod === "card" && selectedBank
                    ? `${getSelectedBank()?.name}`
                    : paymentMethods.find(
                        (m) => m.id === selectedPaymentMethod
                      )?.name}
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
                상품 가격 및 유효기간을 확인하였으며, 계약 관련 고지 사항과
                정책 및 결제 진행에 동의합니다.
              </p>
            </div>
          </label>
        </div>

        {/* 결제하기 버튼 */}
        <div className="flex justify-end">
          <button
            onClick={handlePayment}
            disabled={
              !selectedPackage ||
              !selectedPaymentMethod ||
              (selectedPaymentMethod === "card" &&
                (!selectedBank ||
                  cardNumber.replace(/\D/g, "").length !== 16)) ||
              !agreeTerms ||
              isProcessing
            }
            className={`px-12 py-4 text-lg font-bold text-white rounded-lg transition ${
              selectedPackage &&
              selectedPaymentMethod &&
              (selectedPaymentMethod !== "card" ||
                (selectedBank &&
                  cardNumber.replace(/\D/g, "").length === 16)) &&
              agreeTerms &&
              !isProcessing
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin">⏳</span>
                처리중...
              </span>
            ) : selectedPackage && getSelectedPackage() ? (
              `${getSelectedPackage()!.price.toLocaleString()}원 결제하기`
            ) : (
              "결제하기"
            )}
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
            <li>
              • 크레딧 사용 내역은 크레딧 페이지에서 확인하실 수 있습니다
            </li>
            <li>
              • 카카오페이와 토스페이는 실제 결제가 진행되며, 카드결제/네이버페이는
              테스트 결제입니다
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}