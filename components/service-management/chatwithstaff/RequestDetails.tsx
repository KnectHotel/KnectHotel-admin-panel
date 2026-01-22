'use client';

import React, { useEffect, useRef, useState } from 'react';
import apiCall from '@/lib/axios';
import { getSocket } from '@/lib/socket';

type Props = {
  chatId: string;
};

type Message = {
  _id: string;
  roomId: string;
  senderId: string;
  senderType: 'Guest' | 'Admin';
  message: string;
  createdAt: string;
};

type ChatRoom = {
  _id: string;
  chatId: string;
  roomId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  guestQuery?: string;
  guestId: {
    _id: string;
    firstName: string;
    phoneNumber: string;
    assignedRoomNumber: string;
  };
  agentId: {
    _id: string;
    firstName: string;
    email: string;
  } | null;
  assignedTo?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    roleId: {
      name: string;
    };
  } | null;
  feedback: {
    agentFeedback?: string;
    agentRating?: number | null;
    chatFeedback?: string;
    chatRating?: number | null;
  }
};

const ChatWithStaffDetail: React.FC<Props> = ({ chatId }) => {
  const [chatRoom, setChatRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isJoined, setIsJoined] = useState(false);
  const [agentName, setAgentName] = useState('');
  const [agentEmail, setAgentEmail] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [agentId, setAgentId] = useState('');
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [activeDuration, setActiveDuration] = useState(0);
  const [endedDuration, setEndedDuration] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [agentFeedback, setAgentFeedback] = useState<string>('');
  const [agentRating, setAgentRating] = useState<number | null>(null);
  const [chatFeedback, setChatFeedback] = useState<string>('');
  const [chatRating, setChatRating] = useState<number | null>(null);


  
  const roomKey = (roomId: string, key: string) => `chat:${roomId}:${key}`;

  const safeParseInt = (val: string | null) => {
    if (!val) return null;
    const n = parseInt(val, 10);
    return Number.isFinite(n) ? n : null;
  };

  const formatDuration = (durationMs: number | null | undefined) => {
    if (!durationMs || durationMs < 0) return `0 min 0 secs`;
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    return `${minutes} min ${seconds} secs`;
  };

  const startTimer = (startTime: number, roomId: string) => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      const duration = Date.now() - startTime;
      setActiveDuration(duration);
      localStorage.setItem(
        roomKey(roomId, 'activeDuration'),
        duration.toString()
      );
    }, 1000);
  };

  
  useEffect(() => {
    const fetchChatDetails = async () => {
      setLoading(true);
      try {
        const res = await apiCall('GET', `/api/chat/rooms/${chatId}`);
        console.log(res)
        if (res.success && res.data) {
          setChatRoom(res.data.chatRoom);
          setMessages(res.data.messages || []);
          if (res.data.chatRoom.agentId) {
            setAgentName(res.data.chatRoom.agentId.firstName);
            setAgentEmail(res.data.chatRoom.agentId.email);
            setAgentId(res.data.chatRoom.agentId._id);
          }

          const rId: string = res.data.chatRoom.roomId;

          
          const storedFinal = safeParseInt(
            localStorage.getItem(roomKey(rId, 'finalActiveDuration'))
          );
          if (storedFinal !== null) {
            setEndedDuration(storedFinal);
            setActiveDuration(storedFinal);
          } else {
            
            const storedStart = safeParseInt(
              localStorage.getItem(roomKey(rId, 'startTime'))
            );
            if (storedStart !== null) {
              const now = Date.now();
              const current = now - storedStart;
              setActiveDuration(current);
              startTimer(storedStart, rId);
            } else {
              setActiveDuration(0);
            }
          }
        }
      } catch (err) {
        console.error('❌ Error fetching chat details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (chatId) fetchChatDetails();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [chatId, refreshKey]);

  
  const joinChat = () => {
    if (!chatRoom) return;

    const socket = getSocket();
    if (!socket) return;

    const roomId = chatRoom.roomId;
    socket.emit('agent:joinChat', { roomId });
    setIsJoined(true);

    if (chatRoom.agentId) {
      setAgentName(chatRoom.agentId.firstName || '');
      setAgentEmail(chatRoom.agentId.email || '');
      setAgentId(chatRoom.agentId._id || '');
    }

    const storedStart = safeParseInt(
      localStorage.getItem(roomKey(roomId, 'startTime'))
    );
    if (!storedStart) {
      
      const startTime = Date.now();
      localStorage.setItem(roomKey(roomId, 'startTime'), startTime.toString());
      startTimer(startTime, roomId);
    }

    const joinMessage: Message = {
      _id: Date.now().toString(),
      roomId: chatRoom.roomId,
      senderId: chatRoom.agentId?._id || '',
      senderType: 'Admin',
      message: `${agentName} has joined the chat!`,
      createdAt: new Date().toISOString()
    };
    setMessages((prev) => [...prev, joinMessage]);
    setRefreshKey((prevKey) => prevKey + 1);

    socket.on('chat:guestJoined', (data) => {
      console.log('👤 Guest joined:', data);
    });

    socket.on('message:receive', (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on('chat:closed', (data) => {
      console.log("chat:closed", data);

      if (chatRoom.status?.toLowerCase() === 'closed' || endedDuration !== null) {
        return;
      }

      
      const roomId = chatRoom.roomId;
      const storedStartStr = localStorage.getItem(roomKey(roomId, 'startTime'));
      const storedStart = storedStartStr ? parseInt(storedStartStr, 10) : null;

      let finalMs = 0;
      if (Number.isFinite(storedStart as number)) {
        finalMs = Date.now() - (storedStart as number);
      } else {
        finalMs = activeDuration || 0;
      }

      
      if (timerRef.current) clearInterval(timerRef.current);
      setEndedDuration(finalMs);
      setActiveDuration(finalMs);

      
      localStorage.setItem(roomKey(roomId, 'finalActiveDuration'), String(finalMs));
      localStorage.removeItem(roomKey(roomId, 'startTime'));

      const endMessage: Message = {
        _id: Date.now().toString(),
        roomId: chatRoom.roomId,
        senderId: chatRoom.guestId._id || '',
        senderType: 'Guest',
        message: 'Chat has been closed.',
        createdAt: new Date().toISOString()
      };

      setMessages((prev) => [...prev, endMessage]);
      setIsJoined(false);
      setChatRoom((prev) => prev && { ...prev, status: 'Closed' });
    });


    return () => {
      socket.emit('leaveRoom', roomId);
      socket.off('chat:guestJoined');
      socket.off('message:receive');
      socket.off('chat:closed');
    };
  };

  
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  
  const groupMessagesByDate = () => {
    const grouped: { [date: string]: Message[] } = {};
    messages.forEach((msg) => {
      const date = new Date(msg.createdAt).toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(msg);
    });
    return grouped;
  };

  
  const handleSendMessage = () => {
    if (
      !newMessage.trim() ||
      !chatRoom ||
      chatRoom.status === 'Closed' ||
      !isJoined
    )
      return;

    const socket = getSocket();
    if (!socket) return;

    const msg: Message = {
      _id: Date.now().toString(),
      roomId: chatRoom.roomId,
      senderId: chatRoom.agentId?._id || '',
      senderType: 'Admin',
      message: newMessage.trim(),
      createdAt: new Date().toISOString()
    };

    setMessages((prev) => [...prev, msg]);

    socket.emit('message:send', {
      roomId: msg.roomId,
      message: msg.message
    });

    setNewMessage('');
  };

  
  const handleEndChat = () => {
    if (!chatRoom) return;

    const socket = getSocket();
    if (!socket) return;

    const roomId = chatRoom.roomId;

    const endMessage: Message = {
      _id: Date.now().toString(),
      roomId,
      senderId: chatRoom.guestId._id || '',
      senderType: 'Guest',
      message: 'Chat has been Closed.',
      createdAt: new Date().toISOString()
    };
    setMessages((prev) => [...prev, endMessage]);

    socket.emit('chat:close', { roomId, message: 'Chat has Closed.' });

    
    const storedStart = safeParseInt(
      localStorage.getItem(roomKey(roomId, 'startTime'))
    );
    let finalMs = 0;
    if (storedStart !== null) {
      finalMs = Date.now() - storedStart;
    } else {
      finalMs = activeDuration || 0;
    }

    if (timerRef.current) clearInterval(timerRef.current);
    setEndedDuration(finalMs);
    setActiveDuration(finalMs);

    
    localStorage.setItem(
      roomKey(roomId, 'finalActiveDuration'),
      finalMs.toString()
    );

    setAgentFeedback(chatRoom.feedback?.agentFeedback || '');
    setAgentRating(chatRoom.feedback?.agentRating || null);
    setChatFeedback(chatRoom.feedback?.chatFeedback || '');
    setChatRating(chatRoom.feedback?.chatRating || null);

    setIsJoined(false);
    setChatRoom((prev) => prev && { ...prev, status: 'Closed' });
  };

  const StarRating: React.FC<{ rating?: number }> = ({ rating = 0 }) => {
    const stars = Array.from({ length: 5 }, (_, i) => i + 1);
    return (
      <div className="flex gap-1">
        {stars.map((n) => (
          <span key={n} className={n <= rating ? 'text-yellow-500' : 'text-gray-300'}>
            ★
          </span>
        ))}
      </div>
    );
  };

  
  if (loading) return <div className="mt-24 p-4">Loading chat...</div>;
  if (!chatRoom)
    return <div className="mt-24 p-4 text-red-500">Chat not found.</div>;

  const groupedMessages = groupMessagesByDate();

  return (
    <div className="min-h-screen bg-[#f3efea] py-14 px-8 md:px-24">
      <div className="max-w-4xl mx-auto bg-[#FAF6EF] rounded-xl shadow-lg overflow-hidden">
        {}
        <div className="border-b px-6 py-5">
          <h2 className="text-xl font-semibold text-[#4b392e]">Chat Details</h2>
          <div className="mt-2 text-sm text-[#555] flex flex-wrap gap-x-8 gap-y-2">
            <p>
              <strong className="text-[#4b392e]">Chat ID:</strong>{' '}
              {chatRoom.roomId}
            </p>
            <p>
              <strong className="text-[#4b392e]">Active Duration:</strong>{' '}
              {formatDuration(endedDuration ?? activeDuration)}
            </p>
          </div>
          {!isJoined && chatRoom.status?.trim().toLowerCase() !== 'closed' && (
            <button
              onClick={joinChat}
              className="mt-4 bg-[#4b392e] text-white text-sm px-4 py-1 rounded hover:bg-[#3c2f25] transition"
            >
              Join Chat
            </button>
          )}
        </div>

        {}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-6 py-4 border-b bg-[#f9f5ee] text-sm">
          <Info label="Guest Name" value={chatRoom.guestId.firstName} />
          <Info
            label="Room Number"
            value={chatRoom.guestId.assignedRoomNumber}
          />
          <Info label="Guest Phone" value={chatRoom.guestId.phoneNumber} />
          <Info
            label="Agent Name"
            value={chatRoom.agentId?.firstName || 'Not Assigned'}
          />
          <Info label="Agent Email" value={chatRoom.agentId?.email || '-'} />
          <Info label="Chat Status" value={chatRoom.status} />
          <Info
            label="Assigned To"
            value={chatRoom.assignedTo?.firstName || 'Not Assigned'}
          />
          <Info
            label="Assigned To Email"
            value={chatRoom.assignedTo?.email || 'Not Available'}
          />
          <Info
            label="Role"
            value={chatRoom.assignedTo?.roleId?.name || 'Not Assigned'}
          />
        </div>


        {}
        <div
          className="px-6 py-6 max-h-[500px] overflow-y-auto space-y-8"
          style={{
            backgroundImage: `url('/chat1.jpeg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {}
          {chatRoom.guestQuery && (
            <div className="flex justify-start mb-2">
              <div className="flex flex-col max-w-[70%]">
                <div className="bg-[#d9f4c7] text-[#334] px-4 py-2 rounded-2xl rounded-bl-none shadow-md text-sm">
                  {chatRoom.guestQuery}
                </div>
                <span className="text-[10px] text-white mt-1">• Guest</span>
              </div>
            </div>
          )}

          {Object.entries(groupedMessages).map(([date, msgs]) => (
            <div key={date}>
              <div className="text-center text-xs text-black font-bold mb-4 mt-[-50px]">
                {date}
              </div>
              {msgs.map((msg) => (
                <div
                  key={msg._id}
                  className={`flex ${msg.senderType === 'Admin' ? 'justify-end' : 'justify-start'} mb-2`}
                >
                  <div className="flex flex-col max-w-[70%]">
                    <div
                      className={`px-4 py-2 rounded-2xl text-sm leading-snug shadow-md ${msg.senderType === 'Admin'
                        ? 'bg-[#fdf0d1] text-[#4b392e] rounded-br-none'
                        : 'bg-[#d9f4c7] text-[#334] rounded-bl-none'
                        }`}
                    >
                      {msg.message}
                    </div>
                    <span className="text-[10px] text-white mt-1">
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}{' '}
                      • {msg.senderType === 'Admin' ? agentName : 'Guest'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {}
        <div className="px-6 py-4 border-t bg-[rgba(69,53,25,1)] flex gap-3 items-center">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={
              isJoined ? 'Type your message...' : 'Join chat to start messaging'
            }
            disabled={!isJoined || chatRoom.status === 'Closed'}
            className="flex-1 p-3 rounded-full border-none text-sm placeholder-gray-300 text-white bg-[#4c3c21] focus:outline-none disabled:opacity-50"
          />
          <button
            onClick={handleSendMessage}
            disabled={!isJoined || chatRoom.status === 'Closed'}
            className="bg-[#e4d9c6] px-4 py-2 text-sm rounded-full text-[#453519] font-semibold hover:bg-[#ddd2b9] transition disabled:opacity-50"
          >
            Send
          </button>
        </div>

        {}
        {chatRoom.status !== 'Closed' && isJoined && (
          <div className="px-6 pb-6 pt-2">
            <button
              onClick={handleEndChat}
              className="bg-red-500 text-white text-sm px-4 py-2 rounded hover:bg-red-600 transition"
            >
              End Chat
            </button>
          </div>
        )}
        <div className="px-6 py-6 border-t bg-[#FAF6EF]">
          <h3 className="text-lg font-semibold text-[#4b392e] mb-4">Feedback</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            {}
            <div className="rounded-lg bg-[#f4e7cf] p-4 space-y-3">
              <div className="flex items-center gap-2">
                <span className="font-medium text-[#4b392e]">Agent Feedback:</span>
                <span>{agentFeedback || chatRoom.feedback?.agentFeedback || 'No feedback provided.'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-[#4b392e]">Agent Rating:</span>
                <StarRating rating={agentRating || chatRoom.feedback?.agentRating || 0} />
              </div>
            </div>

            {}
            <div className="rounded-lg bg-[#f4e7cf] p-4 space-y-3">
              <div className="flex items-center gap-2">
                <span className="font-medium text-[#4b392e]">Chat Feedback:</span>
                <span>{chatFeedback || chatRoom.feedback?.chatFeedback || 'No feedback provided.'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-[#4b392e]">Chat Rating:</span>
                <StarRating rating={chatRating || chatRoom.feedback?.chatRating || 0} />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

const Info = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-gray-500 text-xs">{label}</p>
    <p className="bg-[#f4e7cf] text-gray-800 rounded px-3 py-1 mt-1">
      {value || '-'}
    </p>
  </div>
);

export default ChatWithStaffDetail;