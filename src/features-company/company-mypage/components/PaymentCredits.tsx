import { useNavigate } from "react-router-dom";

interface CreditHistoryItem {
  id: number;
  date: string;
  type: string;
  content: string;
  amount: string;
}

interface PaymentCreditsProps {
  // ✅ 부모(CompanyMyPage)에게서 실제 크레딧 값을 받아올 준비
  currentCredit: number;
  creditHistory: CreditHistoryItem[];
}

export default function PaymentCredits({
  currentCredit,
  creditHistory,
}: PaymentCreditsProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-6 text-2xl font-bold">결제 및 크레딧 관리</h2>
        <p className="mb-6 text-gray-600">
          유료 서비스 이용을 위한 현황 파악 및 내역 조회입니다.
        </p>
      </div>

      {/* 현재 보유 크레딧 - 변수 연결 완료 */}
      <div className="p-8 text-center rounded-lg shadow-lg bg-gradient-to-br from-purple-500 to-blue-500">
        <p className="mb-2 text-lg text-white opacity-90">현재 보유 크레딧</p>
        <p className="mb-6 text-5xl font-bold text-white">
          {/* ✅ 1500 대신 부모가 준 숫자를 콤마(,) 찍어서 출력 */}
          {currentCredit.toLocaleString()} C
        </p>
        <button
          onClick={() => navigate("/company/credit?menu=credit-sub-2")}
          className="px-8 py-3 text-lg font-bold text-purple-600 transition bg-white rounded-lg hover:bg-gray-100 active:scale-95"
        >
          크레딧 충전하기
        </button>
      </div>

      {/* 크레딧 이용 내역 */}
      <div>
        <h3 className="mb-4 text-lg font-bold">크레딧 이용 내역</h3>
        <div className="overflow-hidden border border-gray-200 rounded-lg">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-xs font-bold tracking-wider text-left text-gray-700 uppercase">
                  일시
                </th>
                <th className="px-6 py-3 text-xs font-bold tracking-wider text-left text-gray-700 uppercase">
                  구분
                </th>
                <th className="px-6 py-3 text-xs font-bold tracking-wider text-left text-gray-700 uppercase">
                  내용
                </th>
                <th className="px-6 py-3 text-xs font-bold tracking-wider text-right text-gray-700 uppercase">
                  금액
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {creditHistory.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {item.date}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${
                        item.type === "충전"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {item.content}
                  </td>
                  <td
                    className={`px-6 py-4 text-sm font-bold text-right ${
                      item.amount.startsWith("+")
                        ? "text-blue-600"
                        : "text-red-600"
                    }`}
                  >
                    {item.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
