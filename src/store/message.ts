import { createSlice } from '@reduxjs/toolkit';

interface Message {
  type: 'text' | 'image' | 'emoji';
  content: string;
  sender_id: bigint;
  target_id: number;
  is_group: boolean;
  created_at: string;
}
interface MsgList {
    target_id: number;
    avatar: string;
    name: string;
    is_group: boolean;
    msg: Message[] | null;
}
interface NewMessage{
    target_id: number;
    avatar: string;
    name: string;
    is_group: boolean;
    data: Message;
}

interface MsgState {
    msg_list: MsgList[] | [];
}

const initialState: MsgState = {
    msg_list: [
        {
            target_id: -1,
            avatar: '',
            name: '',
            is_group: false,
            msg: [],
        }
    ]
}

export const msgSlice = createSlice({
    name: 'message',
    initialState,
    reducers: {
        setMessage(state, action){
            const newMsg: NewMessage = action.payload
            let exist = false
            for (let i = 1; i < state.msg_list.length; i++) {
                if (state.msg_list[i]?.target_id === newMsg.target_id) {
                    // @ts-ignore
                    state.msg_list[i]?.msg.push(newMsg.data)
                    exist = true
                    break;
                }
            }
            if (!exist) {
                let msgList: MsgList = {
                    target_id: newMsg.target_id,
                    avatar: newMsg.avatar,
                    name: newMsg.name,
                    is_group: newMsg.is_group,
                    msg: []
                };
                msgList.msg?.push(newMsg.data)
                // @ts-ignore
                state.msg_list.push(msgList)
            }
        },
    },
})

export const { setMessage } = msgSlice.actions;

export default msgSlice.reducer