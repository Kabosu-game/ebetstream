/**
 * WebSocket signaling server for WebRTC stream (StreamCreate / StreamView).
 * Run: npm run stream-server
 * Port: 8082
 * Supports multiple viewers: broadcaster creates one PC per viewer.
 */
import { WebSocketServer } from 'ws';

const PORT = 8082;
const wss = new WebSocketServer({ port: PORT });

let viewerIdCounter = 0;
// streamId -> { broadcaster: WebSocket, viewers: Map<viewerId, WebSocket>, peerConnections: {} }
const rooms = new Map();

function getOrCreateRoom(streamId) {
  if (!rooms.has(streamId)) {
    rooms.set(streamId, { broadcaster: null, viewers: new Map(), lastOffer: null });
  }
  return rooms.get(streamId);
}

wss.on('connection', (ws, req) => {
  const fullPath = (req.url || '').split('?')[0];
  const pathParts = fullPath.replace(/^\/+/, '').split('/').filter(Boolean);
  const role = pathParts[0];
  const streamId = pathParts[1];

  if (!streamId || !['broadcast', 'watch'].includes(role)) {
    ws.close(1008, 'Invalid path: use /broadcast/{streamId} or /watch/{streamId}');
    return;
  }

  const room = getOrCreateRoom(streamId);

  if (role === 'broadcast') {
    if (room.broadcaster) {
      try { room.broadcaster.close(); } catch (_) {}
    }
    room.broadcaster = ws;
    room.viewers.forEach((vws, vid) => {
      try { vws.send(JSON.stringify({ type: 'waiting' })); } catch (_) {}
    });
    ws.on('message', (data) => {
      try {
        const msg = JSON.parse(data.toString());
        if (msg.type === 'offer') {
          const vid = msg.viewerId;
          if (vid && room.viewers.has(vid)) {
            try {
              room.viewers.get(vid).send(JSON.stringify({ type: 'offer', sdp: msg.sdp }));
            } catch (_) {}
          }
        } else if (msg.type === 'ice-candidate') {
          const vid = msg.viewerId;
          if (vid && room.viewers.has(vid)) {
            try {
              room.viewers.get(vid).send(JSON.stringify({ type: 'ice-candidate', candidate: msg.candidate }));
            } catch (_) {}
          }
        }
      } catch (_) {}
    });
  } else {
    const viewerId = 'v' + (++viewerIdCounter);
    room.viewers.set(viewerId, ws);
    ws.viewerId = viewerId;
    ws.send(JSON.stringify({ type: 'viewer-id', viewerId }));
    if (room.broadcaster?.readyState === 1) {
      room.broadcaster.send(JSON.stringify({ type: 'viewer-joined', viewerId }));
    } else {
      ws.send(JSON.stringify({ type: 'waiting' }));
    }
    ws.on('message', (data) => {
      try {
        const msg = JSON.parse(data.toString());
        const vid = msg.viewerId || ws.viewerId;
        if (msg.type === 'answer' && room.broadcaster?.readyState === 1) {
          room.broadcaster.send(JSON.stringify({ type: 'answer', viewerId: vid, sdp: msg.sdp }));
        } else if (msg.type === 'ice-candidate' && room.broadcaster?.readyState === 1) {
          room.broadcaster.send(JSON.stringify({ type: 'ice-candidate', viewerId: vid, candidate: msg.candidate }));
        }
      } catch (_) {}
    });
  }

  ws.on('close', () => {
    if (role === 'broadcast') {
      room.viewers.forEach(v => {
        try { v.send(JSON.stringify({ type: 'stream-ended' })); } catch (_) {}
      });
      room.viewers.clear();
      rooms.delete(streamId);
    } else {
      const vid = ws.viewerId;
      room.viewers.delete(vid);
      if (room.broadcaster?.readyState === 1) {
        room.broadcaster.send(JSON.stringify({ type: 'viewer-left', viewerId: vid }));
      }
      if (room.viewers.size === 0 && !room.broadcaster) {
        rooms.delete(streamId);
      }
    }
  });

  ws.on('error', () => { ws.terminate(); });
});

console.log(`\n✅ Stream signaling server running on ws://localhost:${PORT}`);
console.log('   Broadcaster: ws://localhost:' + PORT + '/broadcast/{streamId}');
console.log('   Viewer:      ws://localhost:' + PORT + '/watch/{streamId}\n');
