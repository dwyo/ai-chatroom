import { useState, useRef, useEffect } from 'react';
import { EmojiPicker } from '@/components/ui/EmojiPicker';

interface ChatItem {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
  avatar?: string;
}

type TabType = 'messages' | 'friends';

interface FriendItem {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'offline';
}

export const ChatListPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>('messages');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);
  const [selectedChatId, setSelectedChatId] = useState<string>('');
  const [messages, setMessages] = useState<Array<{
    id: string;
    content: string;
    timestamp: string;
    sender: {
      id: string;
      name: string;
      avatar: string;
    };
  }>>([]);


  const [chatList] = useState<ChatItem[]>([
    {
      id: '1',
      title: '示例对话',
      lastMessage: '这是最后一条消息',
      timestamp: '2024-01-01 12:00',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
    },
    {
      id: '2',
      title: 'AI助手',
      lastMessage: '有什么我可以帮你的吗？',
      timestamp: '2024-01-01 11:30',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=2',
    },
  ]);

  const [friendList] = useState<FriendItem[]>([
    {
      id: '1',
      name: '张三',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
      status: 'online',
    },
    {
      id: '2',
      name: '李四',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4',
      status: 'offline',
    },
  ]);

  useEffect(() => {
    if (chatList.length > 0 && !selectedChatId) {
      setSelectedChatId(chatList[0].id);
      // 这里可以加载第一个聊天的历史消息
      setMessages([
        {
          id: '1',
          content: '欢迎使用聊天系统！',
          timestamp: new Date().toLocaleString('zh-CN'),
          sender: {
            id: 'system',
            name: '系统',
            avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=system'
          }
        }
      ]);
    }
  }, [chatList, selectedChatId]);
  
  return (
    <div className="flex flex-col md:flex-row h-[80dvh] bg-gray-100 dark:bg-gray-900 border border-gray-200 rounded">
      {/* 左侧导航栏和列表 */}
      <div className="h-[80dvh] md:h-[80dvh] md:w-80 bg-white dark:bg-gray-800 border-b md:border-r border-gray-200 dark:border-gray-700 flex flex-col">
        {/* 标签切换 */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            className={`flex-1 py-4 text-sm font-medium ${activeTab === 'messages' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
            onClick={() => setActiveTab('messages')}
          >
            消息
          </button>
          <button
            className={`flex-1 py-4 text-sm font-medium ${activeTab === 'friends' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
            onClick={() => setActiveTab('friends')}
          >
            好友
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'messages' ? (
            // 消息列表
            chatList.map((chat) => (
              <div
                key={chat.id}
                className={`flex items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 ${selectedChatId === chat.id ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                onClick={() => {
                  setSelectedChatId(chat.id);
                  // 这里可以加载选中聊天的历史消息
                  setMessages([
                    {
                      id: chat.id,
                      content: `已切换到与 ${chat.title} 的对话`,
                      timestamp: new Date().toLocaleString('zh-CN'),
                      sender: {
                        id: 'system',
                        name: '系统',
                        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=system'
                      }
                    }
                  ]);
                }}
              >
                <div className="flex-shrink-0">
                  <img
                    src={chat.avatar}
                    alt={chat.title}
                    className="w-12 h-12 rounded-full"
                  />
                </div>
                <div className="ml-4 flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {chat.title}
                    </h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {chat.timestamp}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1 text-left">
                    {chat.lastMessage}
                  </p>
                </div>
              </div>
            ))
          ) : (
            // 好友列表
            friendList.map((friend) => (
              <div
                key={friend.id}
                className={`flex items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 `}
                onClick={() => {
                  // TODO: 导航到好友聊天页面
                  console.log(`Navigate to friend chat ${friend.id}`);
                }}
              >
                <div className="flex-shrink-0 relative">
                  <img
                    src={friend.avatar}
                    alt={friend.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <span
                    className={`absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white ${friend.status === 'online' ? 'bg-green-400' : 'bg-gray-400'}`}
                  />
                </div>
                <div className="ml-4 flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {friend.name}
                    </h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {friend.status === 'online' ? '在线' : '离线'}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      {/* 右侧聊天内容区域 */}
      {activeTab === 'messages' && (
      <div className="hidden md:flex flex-1 bg-gray-50 dark:bg-gray-900 flex-col">

        <div className="hidden md:flex bg-gray-50 dark:bg-gray-900 flex-col">
        {/* 添加聊天对象信息头部 */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            {selectedChatId && (
                <div className="flex items-center">
                <span className="ml-3 font-medium text-gray-900 dark:text-white">
                    {chatList.find(chat => chat.id === selectedChatId)?.title}
                </span>
                </div>
            )}
            </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
        
        {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500 dark:text-gray-400">
                <p>选择一个好友开始会话</p>
            </div>
            </div>
        ) : (
            messages.map((message) => {
            const isCurrentUser = message.sender.id === 'user';
            return (
                <div key={message.id} className={`flex items-start ${isCurrentUser ? 'flex-row-reverse' : 'space-x-2'}`}>
                <img
                    src={message.sender.avatar}
                    alt={message.sender.name}
                    className={`w-8 h-8 rounded-full ${isCurrentUser ? 'ml-2' : ''}`}
                />
                <div className={`flex flex-col ${isCurrentUser ? 'items-end' : ''}`}>
                    <div className={`rounded-lg px-4 py-2 max-w-[70%] break-words ${isCurrentUser ? 'bg-blue-500 dark:bg-blue-600' : 'bg-white dark:bg-gray-700'}`}>
                    <p className={`text-sm ${isCurrentUser ? 'text-white' : 'text-gray-900 dark:text-white'}`}>{message.content}</p>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">{message.timestamp}</span>
                </div>
                </div>
            );
            })
        )}
        </div>
        {/* 输入框区域 */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex flex-col space-y-2">
            <div className="flex space-x-2">
            <button className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
            </button>
            <div className="relative">
                <button
                ref={emojiButtonRef}
                className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-7.536 5.879a1 1 0 001.415 0 3 3 0 014.242 0 1 1 0 001.415-1.415 5 5 0 00-7.072 0 1 1 0 000 1.415z" clipRule="evenodd" />
                </svg>
                </button>
                {showEmojiPicker && (
                <EmojiPicker
                    onEmojiSelect={(emoji) => {
                    if (textareaRef.current) {
                        const start = textareaRef.current.selectionStart;
                        const end = textareaRef.current.selectionEnd;
                        const text = textareaRef.current.value;
                        const before = text.substring(0, start);
                        const after = text.substring(end, text.length);
                        textareaRef.current.value = before + emoji.native + after;
                        textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + emoji.native.length;
                        textareaRef.current.focus();
                    }
                    setShowEmojiPicker(false);
                    }}
                    onClose={() => setShowEmojiPicker(false)}
                />
                )}
            </div>
            </div>
            <div className="flex space-x-2">
            <textarea
                ref={textareaRef}
                placeholder="输入消息..."
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none min-h-[80px] max-h-[240px]"
            />
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" onClick={() => {
                if (textareaRef.current && textareaRef.current.value.trim()) {
                const newMessage = textareaRef.current.value.trim();
                const timestamp = new Date().toLocaleString('zh-CN');
                const messageId = String(Date.now());
                
                // 添加新消息到消息列表
                setMessages(prevMessages => [
                    ...prevMessages,
                    {
                    id: messageId,
                    content: newMessage,
                    timestamp: timestamp,
                    sender: {
                        id: 'user',
                        name: '我',
                        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user'
                    }
                    }
                ]);
                
                // 更新聊天列表
                //  tChatList(prevList => [
                //  {
                //    id: messageId,
                //    title: '新对话',
                //    lastMessage: newMessage,
                //    timestamp: timestamp,
                //    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + Date.now()
                //  },
                //  ...prevList
                //  ;

                textareaRef.current.value = '';
                }
            }}>发送</button>
            </div>
        </div>
        </div>
      </div>
      )}
      {activeTab === 'friends' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            </div>
      )}
      
    </div>
  );
};