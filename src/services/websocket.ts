// import store from '@/store/store';
// import { setWebSocketConnected, connectionClosed } from '@/store/websocketSlice';

class WebSocketService {
  private static instance: WebSocketService;
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 3;
  private readonly heartbeatInterval = 15000;
  private heartbeatTimer: number | null = null;
  private heartbeatTimeout: number | null = null;

  private constructor() {}

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  public connect(): WebSocket {
    if (this.ws?.readyState === WebSocket.OPEN) return this.ws;

    const token = localStorage.getItem('token');
    const url = `${import.meta.env.VITE_WS_URL}/ws?token=${token}`;
    
    this.ws = new WebSocket(url);
    this.setupEventListeners();
    return this.ws
  }

  private setupEventListeners(): void {
    if (!this.ws) return;

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
      this.startHeartbeat();
    };

    this.ws.onclose = () => {
      console.log("onclose", this.ws?.readyState)
      console.log('WebSocket disconnected');
      this.clearHeartbeat();
      this.handleReconnect();
      this.disconnect()
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'pong') {
          console.log('Received pong');
        } else {
          this.handleMessage(data);
        }
      } catch (error) {
        console.error('Failed to parse message:', error);
      }
    };
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      setTimeout(() => {
        this.connect();
      }, 3000);
    } else {
      console.log('Max reconnection attempts reached');
    }
  }

  private startHeartbeat(): void {
    this.clearHeartbeat();
    this.heartbeatTimer = window.setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'ping' }));
      }
    }, this.heartbeatInterval);
  }


  private clearHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
    if (this.heartbeatTimeout) {
      clearTimeout(this.heartbeatTimeout);
      this.heartbeatTimeout = null;
    }
  }

  private handleMessage(data: string): void {
    // 处理其他类型的消息
    console.log('Received message:', data);
  }

  public send(message: string): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected');
    }
  }

  public disconnect(): void {
    this.clearHeartbeat();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const wsService = WebSocketService.getInstance();
export default wsService;