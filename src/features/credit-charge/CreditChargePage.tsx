import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";
import { usePageNavigation } from "../../hooks/usePageNavigation";
import { chargeCredit, getCreditBalance } from "../../api/credit";
import { verifyPayment } from "../../api/payment";

interface CreditChargePageProps {
  onBack?: () => void;
  initialMenu?: string;
  onNavigate?: (page: string, subMenu?: string) => void;
  onPaymentComplete?: (amount: number, credits: number, bonus: number) => void;
}

declare global {
  interface Window {
    PortOne?: any;
  }
}

const PORTONE_CONFIG = {
  storeId: "store-c27f5e9a-df90-425f-8e56-c055caed2dbe",
  channels: {
    kakaopay: "channel-key-7cb7a748-784c-4409-843d-9f46f3b9a2fd",
    toss: "channel-key-06995bd1-82f1-4500-91da-588226c7290d",
  }
};

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
  const { addCreditTransaction } = useApp();
  const { handleMenuClick } = usePageNavigation(
    "credit",
    initialMenu || "credit-sub-2",
    onNavigate
  );

  const [currentCredit, setCurrentCredit] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [selectedBank, setSelectedBank] = useState<string>("");
  const [cardNumber, setCardNumber] = useState<string>("");
  const [cardNumberError, setCardNumberError] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  // [로직 유지] 크레딧 잔액 조회
  useEffect(() => {
    const fetchCreditBalance = async () => {
      const targetUserId = user?.userType === "company" ? user?.companyId : user?.userId;
      if (targetUserId) {
        try {
          setIsLoading(true);
          const balance = await getCreditBalance(targetUserId);
          setCurrentCredit(balance.balance);
        } catch (error) {
          console.error("❌ 크레딧 잔액 조회 실패:", error);
          setCurrentCredit(0);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };
    fetchCreditBalance();
  }, [user?.userId, user?.companyId, user?.userType]);

  const packages = [
    { credits: 100, price: 10000, bonus: 0 },
    { credits: 300, price: 30000, bonus: 5 },
    { credits: 500, price: 50000, bonus: 10 },
    { credits: 1000, price: 100000, bonus: 20 },
    { credits: 2000, price: 200000, bonus: 50 },
  ];

  const paymentMethods = [
    { id: "card", name: "카드결제", icon: "💳" },
    { id: "kakaopay", name: "카카오페이", imgSrc: "/images/kakaopay.png" },
    { id: "toss", name: "토스페이", imgSrc: "/images/toss.png" },
    { id: "naverpay", name: "네이버페이", imgSrc: "/images/naverpay.png" },
  ];

  const handlePackageSelect = (credits: number) => { setSelectedPackage(credits); };

  const handlePaymentMethodSelect = (methodId: string) => {
    setSelectedPaymentMethod(methodId);
    if (methodId !== "card") {
      setSelectedBank("");
      setCardNumber("");
      setCardNumberError("");
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 16) value = value.slice(0, 16);
    const formatted = value.replace(/(\d{4})(?=\d)/g, "$1-");
    setCardNumber(formatted);
    setCardNumberError("");
  };

  const validateCardNumber = (): boolean => {
    const digits = cardNumber.replace(/\D/g, "");
    if (digits.length === 0) { setCardNumberError("카드번호를 입력해주세요."); return false; }
    if (digits.length !== 16) { setCardNumberError("카드번호 16자리를 입력해주세요."); return false; }
    return true;
  };

  // [로직 유지] 결제 함수
  const handlePayment = async () => {
    if (!selectedPackage || !selectedPaymentMethod || !agreeTerms) {
      alert("항목을 모두 선택하고 약관에 동의해주세요.");
      return;
    }
    if (selectedPaymentMethod === "card" && (!selectedBank || !validateCardNumber())) return;

    const targetUserId = user?.userType === "company" ? user?.companyId : user?.userId;
    if (!targetUserId) return;

    const pkg = packages.find((p) => p.credits === selectedPackage);
    if (!pkg) return;

    try {
      setIsProcessing(true);
      if (selectedPaymentMethod === "kakaopay" || selectedPaymentMethod === "toss") {
        if (!window.PortOne) {
          alert("결제 모듈 로딩 중...");
          setIsProcessing(false);
          return;
        }
        const totalCredits = pkg.credits + pkg.bonus;
        const paymentId = `credit_${targetUserId}_${Date.now()}`;
        let channelKey = selectedPaymentMethod === "kakaopay" ? PORTONE_CONFIG.channels.kakaopay : PORTONE_CONFIG.channels.toss;
        let easyPayProvider = selectedPaymentMethod === "kakaopay" ? "KAKAOPAY" : "TOSSPAY";

        const response = await window.PortOne.requestPayment({
          storeId: PORTONE_CONFIG.storeId,
          channelKey: channelKey,
          paymentId: paymentId,
          orderName: `크레딧 ${pkg.credits} 충전`,
          totalAmount: pkg.price,
          currency: "KRW",
          payMethod: "EASY_PAY",
          easyPay: { easyPayProvider },
          customer: {
            customerId: targetUserId.toString(),
            fullName: user?.name,
            email: user?.email,
          },
        });

        if (response.code != null) {
          alert(`실패: ${response.message}`);
          setIsProcessing(false);
          return;
        }

        const verifyResult = await verifyPayment(targetUserId, {
          paymentId: response.paymentId,
          transactionId: response.transactionId || response.paymentId,
          amount: pkg.price,
          credits: totalCredits,
        });

        if (verifyResult.success) {
          addCreditTransaction({
            date: new Date().toLocaleDateString(),
            amount: totalCredits,
            type: "충전",
            description: `크레딧 ${pkg.credits} + 보너스 ${pkg.bonus}`,
          });
          user?.userType === "company" ? navigate("/company/credit") : navigate("/user/credit/complete");
        }
        setIsProcessing(false);
        return;
      }

      // 기존 가상 결제 로직 유지
      const response = await chargeCredit(targetUserId, {
        amount: pkg.credits + pkg.bonus,
        paymentMethod: selectedPaymentMethod,
        description: `크레딧 ${pkg.credits} + 보너스 ${pkg.bonus}`,
      });

      if (response.success) {
        user?.userType === "company" ? navigate("/company/credit") : navigate("/user/credit/complete");
      }
    } catch (e) { console.error(e); } finally { setIsProcessing(false); }
  };

  const getSelectedPackage = () => packages.find((p) => p.credits === selectedPackage);

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="max-w-4xl px-6 py-12 mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">크레딧 충전</h1>
            <p className="text-slate-500 mt-2 font-medium">서비스 이용을 위해 필요한 크레딧을 충전하세요.</p>
          </div>
          <button onClick={() => onBack ? onBack() : handleMenuClick("credit-sub-1")} className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">
            돌아가기
          </button>
        </div>

        {/* Current Balance Card */}
        <div className="p-8 mb-10 bg-slate-900 rounded-2xl shadow-xl text-white relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2" style={{ paddingLeft: '30px' }}>My Balance</p>
            <div className="flex items-baseline gap-2" style={{ paddingLeft: '30px' }}>
              {isLoading ? (
                <div className="h-10 w-32 bg-slate-800 animate-pulse rounded"></div>
              ) : (
                <>
                  <span className="text-5xl font-black tracking-tighter">{currentCredit.toLocaleString()}</span>
                  <span className="text-xl font-bold text-blue-400">CREDIT</span>
                </>
              )}
            </div>
          </div>
          <div className="absolute right-[-20px] bottom-[-20px] text-[120px] opacity-70 rotate-12" style={{ paddingRight: '30px' }}>💰</div>
        </div>

        {/* Step 1: Package Selection */}
        <section className="mb-10">
          <h3 className="text-lg font-bold text-slate-800 mb-5 flex items-center">
            <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs mr-2">1</span>
            충전 금액 선택
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            {packages.map((pkg) => (
              <button
                key={pkg.credits}
                onClick={() => handlePackageSelect(pkg.credits)}
                className={`group relative p-5 rounded-xl border-2 transition-all ${
                  selectedPackage === pkg.credits
                    ? "border-blue-600 bg-white shadow-lg translate-y-[-4px]"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                {pkg.bonus > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-md shadow-sm">
                    +{pkg.bonus} BONUS
                  </span>
                )}
                <div className="text-center">
                  <p className="text-xs font-bold text-slate-400 mb-1">CREDIT</p>
                  <p className={`text-2xl font-black mb-4 ${selectedPackage === pkg.credits ? "text-blue-600" : "text-slate-800"}`}>
                    {pkg.credits}
                  </p>
                  <div className="pt-3 border-t border-slate-100">
                    <p className="text-sm font-bold text-slate-900">{pkg.price.toLocaleString()}원</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

              {/* Step 2: Payment Methods */}
        <section className="mb-10">
          <h3 className="text-lg font-bold text-slate-800 mb-5 flex items-center">
            <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs mr-2">2</span>
            결제 수단 선택
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => handlePaymentMethodSelect(method.id)}
                className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all h-32 ${
                  selectedPaymentMethod === method.id
                    ? "border-slate-900 bg-slate-900 text-white shadow-md"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                }`}
              >
                {method.imgSrc ? (
                  <div className="w-12 h-12 mb-3 flex items-center justify-center overflow-hidden">
                    <img 
                      src={method.imgSrc} 
                      alt={method.name} 
                      className="w-full h-full object-contain"
                      // 이미지가 없을 경우를 대비해 배경색이나 기본 아이콘 처리를 할 수 있습니다.
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/48?text=PAY';
                      }}
                    />
                  </div>
                ) : (
                  <span className="text-3xl mb-3">{method.icon}</span>
                )}
                <span className={`text-s font-bold ${selectedPaymentMethod === method.id ? "text-white" : "text-slate-700"}`}>
                  {method.name}
                </span>
              </button>
            ))}
          </div>

          {/* Conditional Info Blocks */}
          {(selectedPaymentMethod === "kakaopay" || selectedPaymentMethod === "toss") && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-center gap-3">
              <span className="text-blue-600 text-xl">🛡️</span>
              <p className="text-sm text-blue-800 font-medium">포트원 보안 결제 시스템을 통해 안전하게 실결제가 진행됩니다.</p>
            </div>
          )}

          {selectedPaymentMethod === "card" && (
            <div className="mt-6 p-8 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <h4 className="font-bold text-slate-800 mb-4">카드 정보 입력</h4>
              <div className="grid grid-cols-4 gap-2 mb-6">
                {BANKS.map(bank => (
                  <button
                    key={bank.id}
                    onClick={() => setSelectedBank(bank.id)}
                    className={`py-2 text-xs font-bold rounded-md border transition-all ${
                      selectedBank === bank.id ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-500 border-slate-200"
                    }`}
                  >
                    {bank.name}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={cardNumber}
                onChange={handleCardNumberChange}
                placeholder="0000-0000-0000-0000"
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-lg font-mono focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
              {cardNumberError && <p className="text-red-500 text-xs mt-2 font-bold">{cardNumberError}</p>}
            </div>
          )}
        </section>

        {/* Step 3: Summary & Terms */}
        <section className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 pb-8 border-b border-slate-100">
            <div className="mb-4 sm:mb-0">
              <p className="text-slate-400 text-sm font-bold mb-1">최종 결제 금액</p>
              <h4 className="text-3xl font-black text-slate-900">
                {selectedPackage ? `${getSelectedPackage()?.price.toLocaleString()}원` : "금액을 선택해주세요"}
              </h4>
            </div>
            <div className="text-right">
              <p className="text-blue-600 font-bold">
                {selectedPackage ? `${(getSelectedPackage()!.credits + getSelectedPackage()!.bonus).toLocaleString()} 크레딧 충전 예정` : ""}
              </p>
            </div>
          </div>

          <label className="flex items-start gap-3 cursor-pointer group mb-8">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="w-5 h-5 mt-1 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-slate-500 leading-relaxed group-hover:text-slate-700 transition-colors">
              (필수) 상품 금액 및 유효기간(1년)을 확인하였으며, 서비스 결제 정책 및 약관에 동의합니다. 
              충전된 크레딧은 정책에 따라 사용 후 환불이 제한될 수 있습니다.
            </span>
          </label>

          <button
            onClick={handlePayment}
            disabled={!selectedPackage || !selectedPaymentMethod || !agreeTerms || isProcessing}
            className={`w-full py-5 rounded-xl text-lg font-black transition-all shadow-lg ${
              selectedPackage && selectedPaymentMethod && agreeTerms && !isProcessing
                ? "bg-blue-600 text-white hover:bg-blue-700 hover:scale-[1.01] active:scale-[0.99]"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            {isProcessing ? "결제 처리 중..." : "충전하기"}
          </button>
        </section>

        {/* Footer Notice */}
        <div className="mt-10 p-6 bg-slate-100 rounded-xl">
          <p className="text-xs text-slate-500 leading-6">
            • 크레딧 유효기간은 충전일로부터 1년입니다.<br />
            • 이벤트로 지급된 보너스 크레딧은 우선 소멸될 수 있습니다.<br />
            • 결제 관련 문의는 고객센터(1588-XXXX)를 이용해 주세요.
          </p>
        </div>
      </div>
    </div>
  );
}