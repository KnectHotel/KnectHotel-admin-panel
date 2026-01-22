
import { io, Socket } from 'socket.io-client';

type AnyObj = Record<string, any>;


interface AdminSession {
  token?: string | null;
  [k: string]: any;
}

let socket: Socket | null = null;
let currentToken: string | null = null;


function readTokenFromSession(): string | null {
  try {
    const raw = sessionStorage.getItem('admin');
    if (!raw) return null;
    const parsed: AdminSession = JSON.parse(raw);
    return parsed?.token ?? null;
  } catch (err) {
    console.warn('[socket] failed to read token from sessionStorage:', err);
    return null;
  }
}


function createSocketInstance(token: string, transports: string[] = ['websocket']): Socket {
  
  let API_URL = process.env.NEXT_PUBLIC_API_URL || '';
  if (!API_URL && typeof window !== 'undefined') {
    const origin =
      window.location.origin ||
      `${window.location.protocol}//${window.location.hostname}`;
    API_URL = origin.includes(':3000')
      ? origin.replace(':3000', ':3001')
      : origin;
  }
  if (!API_URL) {
    throw new Error(
      'Unable to determine API URL for socket. Set NEXT_PUBLIC_API_URL or run in a browser context.'
    );
  }

  
  const normalized = token.startsWith('Bearer ') ? token : `Bearer ${token}`;

  const s = io(API_URL, {
    path: '/socket.io',
    autoConnect: false, 
    
    
    
    transports,
    auth: { token: normalized },
    timeout: 20000,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    
    upgrade: true,
    rememberUpgrade: true
  });

  
  s.on('connect', () => {
    console.info('[socket] connected:', s.id);
  });

  s.on('connect_error', (err: any) => {
    const msg = (err && (err.message || err)) || 'unknown';
    
    
    
    try {
      const lower = String(msg).toLowerCase();
      if (lower.includes('xhr poll') && transports.length === 1 && transports[0] === 'websocket') {
        console.warn('[socket] connect_error: XHR polling failed. Retrying with polling enabled.');
        try {
          
          s.removeAllListeners();
          s.close();
        } catch (e) {}
        
        socket = createSocketInstance(token, ['polling', 'websocket']);
        currentToken = token;
        socket.connect();
        return;
      }
    } catch (e) {
      
    }

    
    console.warn('[socket] connect_error (will retry):', msg);
  });

  s.on('disconnect', (reason: string) => {
    console.warn('[socket] disconnected:', reason);
  });

  
  s.on('Connection', (data: any) => {
    console.info('[socket] server Connection:', data);
  });

  return s;
}


export function getSocket(): Socket | null {
  if (typeof window === 'undefined') return null; 

  
  if (socket) return socket;

  
  const token = readTokenFromSession();
  if (!token) {
    console.warn(
      "[socket] No token found in sessionStorage('admin'). Socket will not be created."
    );
    return null;
  }

  
  try {
    socket = createSocketInstance(token);
    currentToken = token;
    socket.connect();
    return socket;
  } catch (err) {
    console.error('[socket] failed to create socket instance:', err);
    socket = null;
    return null;
  }
}


export function setAuthToken(token: string | null): Socket | null {
  if (typeof window === 'undefined') return null;

  currentToken = token;

  
  try {
    const raw = sessionStorage.getItem('admin');
    const parsed = raw ? JSON.parse(raw) : {};
    parsed.token = token;
    sessionStorage.setItem('admin', JSON.stringify(parsed));
  } catch (e) {
    
    console.warn('[socket] failed to persist token to sessionStorage:', e);
  }

  
  if (!token) {
    if (socket) {
      try {
        socket.disconnect();
        socket.removeAllListeners();
      } catch (e) {
        console.warn('[socket] error while disconnecting:', e);
      }
      socket = null;
    }
    return null;
  }

  if (socket) {
    try {
      socket.auth = {
        token: token.startsWith('Bearer ') ? token : `Bearer ${token}`
      };
      if (socket.connected) {
        socket.disconnect();
      }
      socket.connect();
      return socket;
    } catch (err) {
      console.error('[socket] failed to update auth on existing socket:', err);
      try {
        socket.removeAllListeners();
      } catch (e) {}
      socket = null;
    }
  }

  
  try {
    socket = createSocketInstance(token);
    socket.connect();
    return socket;
  } catch (err) {
    console.error('[socket] failed to create socket with new token:', err);
    socket = null;
    return null;
  }
}

export function disconnectSocket() {
  if (!socket) return;
  try {
    socket.disconnect();
    socket.removeAllListeners();
  } catch (e) {
    console.warn('[socket] error while disconnecting:', e);
  } finally {
    socket = null;
    currentToken = null;
  }
}

export function isSocketConnected(): boolean {
  return !!(socket && socket.connected);
}
