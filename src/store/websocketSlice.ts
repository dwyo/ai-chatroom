import { createSlice } from '@reduxjs/toolkit';
import { wsService } from '@/services/websocket'

interface WebSocketState {
  type: string,
  messages: [],
  client: WebSocket | null,
  is_connected: boolean,
}

const initialState: WebSocketState = {
  type: 'websocket',
  messages: [],
  client: null,
  is_connected: false,
};

const websocketSlice = createSlice({
  name: 'websocket',
  initialState,
  reducers: {
    connectionClosed(state) {
      wsService.disconnect();
      state.client = null;
      state.is_connected = false;
    },
    sendMessage(state, action) {
      console.log('sendMessage', action.payload);
      console.log(state.client);
      if (state.client) {
        state.client.send(action.payload);
      }
    },
    createConnection(state) {
      console.log('createConnection');
      if (!state.client && !state.is_connected) {
        state.is_connected = true;
        const client = wsService.connect();
        state.client = client;
      }
    },
    reconnect(state) {
      state.is_connected = true;
      wsService.disconnect();
      state.client = null;
      const client = wsService.connect();
      state.client = client;
    },
  },
});

export const { 
    connectionClosed, 
    sendMessage, 
    createConnection,
    reconnect
} = websocketSlice.actions;



// 暴露给外部的方法

// 获取socket实例
export const getSocket = (state: { websocketSlice: WebSocketState }) => {
  return state.websocketSlice.client;
};

// 重连方法
export const reconnectSocket = () => {
    reconnect();
};
// 获取websocket状态
export const getWebSocketState = (state: { websocketSlice: WebSocketState }) => state.websocketSlice;

// receiveMessage
// export const receiveMessage = (message:string) => {
//   websocketSlice.selectSlice('message').push(message);
// };


export default websocketSlice.reducer;