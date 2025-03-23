import { configureStore } from '@reduxjs/toolkit';
import websocketSlice from '@/store/websocketSlice'
import userSlice from '@/store/user'
import msgSlice from '@/store/message'

export default configureStore({
  reducer: {
    userSlice: userSlice,
    websocketSlice: websocketSlice,
    msgSlice: msgSlice,
  },
});