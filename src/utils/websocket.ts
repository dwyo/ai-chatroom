class WebSocketClient {
      private socket: WebSocket;
      private reconnectInterval: number = 3000; // 重连间隔时间（毫秒）
      private maxReconnectAttempts: number = 5; // 最大重连次数
      private reconnectAttempts: number = 0;
      private pingInterval: number | undefined;
      private heartbeatInterval: number = 30000; // 心跳间隔时间（毫秒）
      private heartbeatTimeout: number | undefined;
    
      constructor(private url: string) {
        this.initWebSocket();
      }
    
      private initWebSocket() {
        this.socket = new WebSocket(this.url);
        this.setupEventHandlers();
        this.setupHeartbeat();
      }
    
      private setupEventHandlers() {
        this.socket.addEventListener('open', () => {
          console.log('WebSocket 连接成功');
          this.reconnectAttempts = 0;
        });
    
        this.socket.addEventListener('message', (event) => {
          console.log('收到消息:', event.data);
          // 处理服务器发送的消息
        });
    
        this.socket.addEventListener('error', (error) => {
          console.error('WebSocket 错误:', error);
          this.reconnect();
        });
    
        this.socket.addEventListener('close', (event) => {
          console.log('WebSocket 关闭，代码:', event.code, '原因:', event.reason);
          this.reconnect();
        });
      }
    
      private setupHeartbeat() {
        this.pingInterval = setInterval(() => {
          if (this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({ type: 'ping' }));
            this.heartbeatTimeout = setTimeout(() => {
              console.log('心跳超时，尝试重连');
              this.socket.close();
            }, this.heartbeatInterval * 2);
          }
        }, this.heartbeatInterval);
      }
    
      private reconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          console.log('尝试重新连接 WebSocket，第', this.reconnectAttempts, '次');
          setTimeout(() => {
            this.initWebSocket();
          }, this.reconnectInterval * this.reconnectAttempts);
        } else {
          console.error('达到最大重连次数，停止重连');
        }
      }
    
      public send(message: string) {
        if (this.socket.readyState === WebSocket.OPEN) {
          this.socket.send(message);
        } else {
          console.error('WebSocket 连接未开启，无法发送消息');
        }
      }
    
      public close() {
        this.socket.close();
        clearInterval(this.pingInterval);
        clearTimeout(this.heartbeatTimeout);
      }
    }
    
    // 示例用法
    const wsClient = new WebSocketClient('ws://example.com/socket');
    wsClient.send('Hello, Server');