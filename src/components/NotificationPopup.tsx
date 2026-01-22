import { useEffect, useState } from 'react';
import { Notification as NotificationData, markAsRead, markAllAsRead, getUnreadNotifications, getUnreadCount } from '../api/notification';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

interface NotificationPopupProps {
  userId: number;
  userType: 'company' | 'individual';
  isOpen: boolean;
  onClose: () => void;
  realtimeNotifications: NotificationData[];
  unreadCount: number;
  onUnreadCountChange: (count: number) => void;
}

export default function NotificationPopup({
  userId,
  userType,
  isOpen,
  onClose,
  realtimeNotifications,
  unreadCount,
  onUnreadCountChange
}: NotificationPopupProps) {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen]);

  // 실시간 알림 추가
  useEffect(() => {
    if (realtimeNotifications.length > 0) {
      setNotifications(prev => [...realtimeNotifications, ...prev]);
    }
  }, [realtimeNotifications]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const [unreadList, count] = await Promise.all([
        getUnreadNotifications(userType, userId),
        getUnreadCount(userType, userId)
      ]);
      setNotifications(unreadList);
      onUnreadCountChange(count);
    } catch (error) {
      console.error('알림 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await markAsRead(notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      onUnreadCountChange(Math.max(0, unreadCount - 1));
    } catch (error) {
      console.error('알림 읽음 처리 실패:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead(userType, userId);
      setNotifications([]);
      onUnreadCountChange(0);
    } catch (error) {
      console.error('모든 알림 읽음 처리 실패:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'NEW_APPLICATION':
        return '📝';
      case 'DEADLINE_APPROACHING':
        return '⏰';
      case 'INTERVIEW_ACCEPTED':
      case 'INTERVIEW_OFFER':
        return '✅';
      case 'INTERVIEW_REJECTED':
        return '❌';
      case 'POSITION_OFFER':
        return '💼';
      case 'APPLICATION_STATUS':
        return '📊';
      default:
        return '🔔';
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* 배경 오버레이 */}
      <div
        className="fixed inset-0 bg-black bg-opacity-30 z-[9998]"
        onClick={onClose}
      />

      {/* 알림 팝업 */}
      <div className="fixed right-4 top-20 w-96 max-h-[600px] bg-white rounded-lg shadow-2xl border border-gray-200 z-[9999] overflow-hidden flex flex-col">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-white">
          <h3 className="text-lg font-bold text-gray-900">
            알림 <span className="text-purple-600">({unreadCount})</span>
          </h3>
          <div className="flex items-center space-x-2">
            {notifications.length > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm text-purple-600 hover:text-purple-800 font-medium"
              >
                모두 읽음
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* 알림 목록 */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <svg className="w-16 h-16 mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <p>새로운 알림이 없습니다</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="p-4 hover:bg-gray-50 transition cursor-pointer group"
                  onClick={() => handleMarkAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <h4 className="text-sm font-semibold text-gray-900 truncate">
                          {notification.title}
                        </h4>
                        <button className="text-xs text-purple-600 hover:text-purple-800 opacity-0 group-hover:opacity-100 transition whitespace-nowrap ml-2">
                          읽음
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {notification.content}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                          locale: ko
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 푸터 */}
        {notifications.length > 0 && (
          <div className="p-3 border-t border-gray-200 bg-gray-50">
            <button
              onClick={() => {
                onClose();
                // 알림 목록 페이지로 이동 (필요시 구현)
              }}
              className="w-full text-sm text-purple-600 hover:text-purple-800 font-medium"
            >
              모든 알림 보기
            </button>
          </div>
        )}
      </div>
    </>
  );
}
