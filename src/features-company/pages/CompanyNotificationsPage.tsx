import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Notification as NotificationData, 
  markAsRead, 
  markAllAsRead, 
  getUnreadNotifications,
  getUnreadCount 
} from '../../api/notification';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

export default function CompanyNotificationsPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/company/login');
      return;
    }
    loadNotifications();
  }, [isAuthenticated, navigate]);

  const loadNotifications = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      // 5초 타임아웃 설정
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 5000)
      );
      
      const dataPromise = Promise.all([
        getUnreadNotifications('company', user.id),
        getUnreadCount('company', user.id)
      ]);
      
      const [unreadList, count] = await Promise.race([
        dataPromise,
        timeoutPromise
      ]) as [NotificationData[], number];
      
      setNotifications(unreadList);
      setUnreadCount(count);
    } catch (error) {
      console.error('알림 로드 실패:', error);
      // 에러 발생 시 빈 배열로 설정 (백엔드 서버가 없어도 UI는 보여줌)
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 5000)
      );
      
      await Promise.race([
        markAsRead(notificationId),
        timeoutPromise
      ]);
      
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('알림 읽음 처리 실패:', error);
      // 에러가 나도 UI에서는 제거 (사용자 경험 개선)
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!user?.id) return;
    
    try {
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 5000)
      );
      
      await Promise.race([
        markAllAsRead('company', user.id),
        timeoutPromise
      ]);
      
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error('모든 알림 읽음 처리 실패:', error);
      // 에러가 나도 UI에서는 제거
      setNotifications([]);
      setUnreadCount(0);
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* 헤더 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">알림</h1>
                <p className="text-sm text-gray-500 mt-1">
                  읽지 않은 알림 <span className="font-semibold text-purple-600">{unreadCount}개</span>
                </p>
              </div>
            </div>
            {notifications.length > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="px-4 py-2 text-sm font-medium text-purple-600 hover:bg-purple-50 rounded-lg transition"
              >
                모두 읽음으로 표시
              </button>
            )}
          </div>
        </div>

        {/* 알림 목록 */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              <svg className="w-20 h-20 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <p className="text-lg font-medium">새로운 알림이 없습니다</p>
              <p className="text-sm mt-2">알림이 오면 여기에 표시됩니다</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="p-6 hover:bg-gray-50 transition cursor-pointer group"
                  onClick={() => handleMarkAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-4">
                    <span className="text-3xl flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-base font-semibold text-gray-900">
                          {notification.title}
                        </h3>
                        <button className="text-sm text-purple-600 hover:text-purple-800 opacity-0 group-hover:opacity-100 transition whitespace-nowrap ml-4">
                          읽음 표시
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {notification.content}
                      </p>
                      <p className="text-xs text-gray-400">
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
      </div>
    </div>
  );
}
