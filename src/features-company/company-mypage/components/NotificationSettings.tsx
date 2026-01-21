interface NotificationSettingsProps {
  emailNewApplicant: boolean;
  setEmailNewApplicant: (value: boolean) => void;
  emailDeadlineAlert: boolean;
  setEmailDeadlineAlert: (value: boolean) => void;
  emailMarketing: boolean;
  setEmailMarketing: (value: boolean) => void;
}

export default function NotificationSettings({
  emailNewApplicant,
  setEmailNewApplicant,
  emailDeadlineAlert,
  setEmailDeadlineAlert,
  emailMarketing,
  setEmailMarketing,
}: NotificationSettingsProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-6 text-2xl font-bold">알림 설정</h2>
        <p className="mb-6 text-gray-600">
          서비스 이용 관련 알림 수신 여부를 제어합니다.
        </p>
      </div>

      {/* 이메일 알림 */}
      <div className="p-6 border border-gray-200 rounded-lg bg-gray-50">
        <h3 className="mb-4 text-lg font-bold">이메일 알림</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">새로운 지원자 발생 시 알림</p>
              <p className="text-sm text-gray-500">
                공고에 새로운 지원자가 있을 때 이메일을 받습니다
              </p>
            </div>
            <label className="relative inline-block h-8 w-14">
              <input
                type="checkbox"
                checked={emailNewApplicant}
                onChange={(e) => setEmailNewApplicant(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-14 h-8 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">공고 마감 임박 알림</p>
              <p className="text-sm text-gray-500">공고 마감 3일 전 알림을 받습니다</p>
            </div>
            <label className="relative inline-block h-8 w-14">
              <input
                type="checkbox"
                checked={emailDeadlineAlert}
                onChange={(e) => setEmailDeadlineAlert(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-14 h-8 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">마케팅 정보 수신 동의</p>
              <p className="text-sm text-gray-500">서비스 소식 및 이벤트 정보를 받습니다</p>
            </div>
            <label className="relative inline-block h-8 w-14">
              <input
                type="checkbox"
                checked={emailMarketing}
                onChange={(e) => setEmailMarketing(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-14 h-8 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* 저장 버튼 */}
      <div className="flex justify-end pt-6 border-t">
        <button
          onClick={() => alert("알림 설정이 저장되었습니다.")}
          className="px-8 py-3 text-lg font-bold text-white transition bg-purple-600 rounded-lg hover:bg-purple-700"
        >
          설정 저장
        </button>
      </div>
    </div>
  );
}
