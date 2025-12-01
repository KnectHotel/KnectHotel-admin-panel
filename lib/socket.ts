// adminpanel/lib/socket.ts
import { io, Socket } from 'socket.io-client';

type AnyObj = Record<string, any>;

// Shape of sessionStorage 'admin' object (adjust if your auth shape differs)
interface AdminSession {
  token?: string | null;
  [k: string]: any;
}

let socket: Socket | null = null;
let currentToken: string | null = null;

/**
 * Read token from sessionStorage('admin')
 */
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

/**
 * Create socket instance (singleton). Caller should ensure token exists.
 */
function createSocketInstance(token: string, transports: string[] = ['websocket']): Socket {
  // Prefer env var, but fall back to window origin (with port switch in dev)
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

  // normalize token to 'Bearer <token>'
  const normalized = token.startsWith('Bearer ') ? token : `Bearer ${token}`;

  const s = io(API_URL, {
    path: '/socket.io',
    autoConnect: false, // we'll set auth then connect
    // Prefer websocket transport to avoid XHR/polling errors in environments
    // where polling is blocked or unsupported. Socket.IO will still attempt
    // reconnection if the websocket fails.
    transports,
    auth: { token: normalized },
    timeout: 20000,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    // Remember upgrade so clients prefer websocket after successful connect
    upgrade: true,
    rememberUpgrade: true
  });

  // Standard listeners (you can expand as needed)
  s.on('connect', () => {
    console.info('[socket] connected:', s.id);
  });

  s.on('connect_error', (err: any) => {
    const msg = (err && (err.message || err)) || 'unknown';
    // If polling/XHR poll errors occur while we attempted websocket-only,
    // try one fallback to polling+websocket to increase chance of connecting
    // in environments where websocket upgrade behaves differently.
    try {
      const lower = String(msg).toLowerCase();
      if (lower.includes('xhr poll') && transports.length === 1 && transports[0] === 'websocket') {
        console.warn('[socket] connect_error: XHR polling failed. Retrying with polling enabled.');
        try {
          // Clean up this socket and create a fallback one using polling+websocket
          s.removeAllListeners();
          s.close();
        } catch (e) {}
        // create fallback socket instance and connect
        socket = createSocketInstance(token, ['polling', 'websocket']);
        currentToken = token;
        socket.connect();
        return;
      }
    } catch (e) {
      // ignore errors from fallback logic
    }

    // Generic warning (no stack) for other connect errors
    console.warn('[socket] connect_error (will retry):', msg);
  });

  s.on('disconnect', (reason: string) => {
    console.warn('[socket] disconnected:', reason);
  });

  // optional: debug event from server
  s.on('Connection', (data: any) => {
    console.info('[socket] server Connection:', data);
  });

  return s;
}

/**
 * Get a singleton socket instance.
 * - If token exists in sessionStorage and no socket yet, it will create & connect.
 * - If token changes, call setAuthToken(token) to update and reconnect.
 */
export function getSocket(): Socket | null {
  if (typeof window === 'undefined') return null; // guard on server side

  // if socket already exists and connected/connecting, return it
  if (socket) return socket;

  // read token
  const token = readTokenFromSession();
  if (!token) {
    console.warn(
      "[socket] No token found in sessionStorage('admin'). Socket will not be created."
    );
    return null;
  }

  // create, set currentToken, connect
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

/**
 * Update / set auth token for socket client.
 * - If socket exists, it will disconnect and reconnect with new token.
 * - If socket does not exist, it will create and connect.
 */
export function setAuthToken(token: string | null): Socket | null {
  if (typeof window === 'undefined') return null;

  currentToken = token;

  // persist to sessionStorage (optional - keep parity with your login flow)
  try {
    const raw = sessionStorage.getItem('admin');
    const parsed = raw ? JSON.parse(raw) : {};
    parsed.token = token;
    sessionStorage.setItem('admin', JSON.stringify(parsed));
  } catch (e) {
    // non-fatal
    console.warn('[socket] failed to persist token to sessionStorage:', e);
  }

  // If no token provided, disconnect and clear socket
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

  // create a new socket
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
