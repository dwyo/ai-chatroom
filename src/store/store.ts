import { configureStore } from '@reduxjs/toolkit';
import websocketSlice from '@/store/websocketSlice'
import userSlice from '@/store/user'

export default configureStore({
  reducer: {
    userSlice: userSlice,
    websocketSlice: websocketSlice,
    
  },
});