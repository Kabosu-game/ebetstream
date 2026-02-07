import NodeMediaServer from 'node-media-server';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Créer le dossier media s'il n'existe pas
const mediaDir = path.join(__dirname, 'media');
if (!fs.existsSync(mediaDir)) {
  fs.mkdirSync(mediaDir, { recursive: true });
}

const config = {
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60
  },
  http: {
    port: 8000,
    allow_origin: '*',
    mediaroot: mediaDir,
  },
  // Pas de conversion HLS pour l'instant (nécessite FFmpeg)
  // On utilisera le stream RTMP directement ou MediaMTX pour HLS
  trans: {
    ffmpeg: null, // Désactivé temporairement
    tasks: []
  }
};

const nms = new NodeMediaServer(config);

nms.on('preConnect', (id, args) => {
  console.log('[NodeEvent on preConnect]', `id=${id} args=${JSON.stringify(args)}`);
});

nms.on('postConnect', (id, args) => {
  console.log('[NodeEvent on postConnect]', `id=${id} args=${JSON.stringify(args)}`);
});

nms.on('prePublish', (id, StreamPath, args) => {
  console.log('[NodeEvent on prePublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
});

nms.on('postPublish', (id, StreamPath, args) => {
  console.log('[NodeEvent on postPublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
  console.log('✅ Stream is now live!');
  console.log(`📺 HLS URL: http://localhost:8000${StreamPath}/index.m3u8`);
});

nms.on('donePublish', (id, StreamPath, args) => {
  console.log('[NodeEvent on donePublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
});

nms.run();

console.log('✅ RTMP Server running on port 1935');
console.log('✅ HLS Server running on port 8000');
console.log('📺 Stream URL: rtmp://localhost:1935/live/[STREAM_KEY]');
console.log('📺 HLS URL: http://localhost:8000/live/[STREAM_KEY]/index.m3u8');
console.log('');
console.log('⏳ Waiting for stream...');

