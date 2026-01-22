import { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client, IMessage } from '@stomp/stompjs';

interface NotificationMessage {
  id: number;
  userId: number;
  userType: string;
  type: string;
  typeDescription: string;
  title: string;
  content: string;
  isRead: boolean;
  relatedId: number | null;
  relatedType: string | null;
  createdAt: string;
}

interface UseNotificationWebSocketProps {
  userId: number | null;
  userType: 'company' | 'individual';
  onNotificationReceived?: (notification: NotificationMessage) => void;
}

export const useNotificationWebSocket = ({
  userId,
  userType,
  onNotificationReceived
}: UseNotificationWebSocketProps) => {
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    if (!userId) {
      return;
    }

    // WebSocket 클라이언트 초기화
    const socket = new SockJS('http://localhost:8080/ws/notifications');
    const stompClient = new Client({
      webSocketFactory: () => socket as any,
      debug: (str) => {
        console.log('STOMP: ', str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    // 연결 성공 콜백
    stompClient.onConnect = () => {
      console.log('WebSocket 연결 성공');
      setConnected(true);
      setError(null);

      // 알림 구독
      const destination = `/topic/notifications/${userType}/${userId}`;
      console.log('알림 구독:', destination);

      stompClient.subscribe(destination, (message: IMessage) => {
        const notification: NotificationMessage = JSON.parse(message.body);
        console.log('알림 수신:', notification);
        
        if (onNotificationReceived) {
          onNotificationReceived(notification);
        }
      });
    };

    // 연결 실패 콜백
    stompClient.onStompError = (frame) => {
      console.error('STOMP 에러:', frame);
      setError('WebSocket 연결 실패');
      setConnected(false);
    };

    // 연결 끊김 콜백
    stompClient.onDisconnect = () => {
      console.log('WebSocket 연결 끊김');
      setConnected(false);
    };

    // 연결 시작
    stompClient.activate();
    clientRef.current = stompClient;

    // Cleanup
    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
      }
    };
  }, [userId, userType, onNotificationReceived]);

  return { connected, error };
};
