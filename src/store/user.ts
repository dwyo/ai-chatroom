import { createSlice } from '@reduxjs/toolkit';

interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  status: string;
  createTime: string;
  updateTime: string;
}

interface UserState {
  token: string | null;
  user: User;
}
const initialState: UserState = {
  token: localStorage.getItem('token'),
  user: {
    id: '',
    username: '',
    name: '',
    email: '',
    avatar: '',
    role: '',
    status: '',
    createTime: '',
    updateTime: '',
  }
};

export const userSlice = createSlice({
    name: 'userinfo',
    initialState,
    reducers: {
      setToken: (state, action) => {
        state.token = action.payload;
      },
      setUser: (state, action) => {
        state.user = action.payload;
      },
    },
  })

  export const { setToken, setUser } = userSlice.actions;
  export default userSlice.reducer;

  export const getToken = (state: { userinfo: UserState }) => {
    return state.userinfo?.token
  };
  export const getUser = (state: { userinfo: UserState }) => state.userinfo?.user;