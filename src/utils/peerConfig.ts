/**
 * PeerJS configuration - use local server in development for reliable WebRTC signaling.
 * Run "npm run peer-server" in a separate terminal for local streaming to work.
 * The dev server proxies /peerjs to the Peer server.
 */
export function getPeerOptions(peerId?: string): { id?: string; debug?: number; host?: string; port?: number; path?: string; secure?: boolean } {
  const isLocal = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  
  const base: Record<string, unknown> = {
    debug: 2, // More verbose for debugging connection issues
  };
  
  if (peerId) {
    base.id = peerId;
  }
  
  // Use self-hosted PeerServer - connexion directe au port 9000 (plus fiable que le proxy WebSocket)
  if (isLocal) {
    base.host = window.location.hostname;
    base.port = 9000;
    base.path = '/peerjs';
    base.secure = false;
  }
  // Production: use PeerJS cloud (or configure your own server via env)
  
  return base as ReturnType<typeof getPeerOptions>;
}
