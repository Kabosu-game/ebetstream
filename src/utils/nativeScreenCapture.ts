import { registerPlugin } from '@capacitor/core';

interface ScreenCapturePlugin {
  requestPermission(): Promise<{ granted: boolean; url?: string }>;
  stopStream(): Promise<void>;
}

const Native = registerPlugin<ScreenCapturePlugin>('ScreenCapture');

function getPlugin(): ScreenCapturePlugin | null {
  if (typeof (window as any).Capacitor === 'undefined') return null;
  try { return Native; } catch { return null; }
}

export function isNativeScreenCaptureAvailable(): boolean {
  return getPlugin() != null;
}

export async function requestNativeScreenPermission(): Promise<boolean> {
  const plugin = getPlugin();
  if (!plugin) return false;
  const result = await plugin.requestPermission();
  return result.granted;
}

export async function getNativeScreenStream(): Promise<{
  stream: MediaStream;
  stop: () => Promise<void>;
}> {
  const plugin = getPlugin();
  if (!plugin) throw new Error('ScreenCapture plugin not available');

  // Un seul appel : dialog + démarrage service + URL retournée immédiatement
  const result = await plugin.requestPermission();

  if (!result.granted) {
    throw Object.assign(new Error('COMPAT'), {
      name: 'CompatError',
      friendly: 'Permission de capture d\'écran refusée.',
    });
  }

  const url = result.url;
  if (!url) throw new Error('URL du serveur de capture non reçue');

  const frameUrl = `${url.replace(/\/+$/, '')}/frame`;

  // Canvas qui reçoit les frames JPEG
  const canvas = document.createElement('canvas');
  canvas.width = 1280;
  canvas.height = 720;
  const ctx = canvas.getContext('2d')!;

  if (typeof (canvas as any).captureStream !== 'function') {
    throw new Error('canvas.captureStream non supporté sur cet appareil');
  }

  const stream: MediaStream = (canvas as any).captureStream(15);
  let stopped = false;

  const stop = async () => {
    stopped = true;
    stream.getTracks().forEach(t => t.stop());
    try { await plugin.stopStream(); } catch (_) {}
  };

  // Warmup : attendre le premier frame (serveur prêt)
  console.log('[Capture] Warmup...');
  const deadline = Date.now() + 8000;
  let ready = false;
  while (!ready && Date.now() < deadline) {
    const blob = await fetchFrame(frameUrl, 1500);
    if (blob && blob.size > 0) {
      const bmp = await createImageBitmap(blob);
      canvas.width  = bmp.width  || 1280;
      canvas.height = bmp.height || 720;
      ctx.drawImage(bmp, 0, 0);
      bmp.close();
      ready = true;
      console.log('[Capture] Premier frame OK');
    }
    if (!ready) await sleep(200);
  }

  if (!ready) console.warn('[Capture] Warmup timeout — on continue');

  // Micro
  try {
    const mic = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    mic.getAudioTracks().forEach(t => stream.addTrack(t));
  } catch (_) {}

  // Polling à 15fps
  const interval = Math.round(1000 / 15);
  (async () => {
    while (!stopped) {
      const blob = await fetchFrame(frameUrl, 1500);
      if (blob && blob.size > 0) {
        try {
          const bmp = await createImageBitmap(blob);
          if (canvas.width !== bmp.width || canvas.height !== bmp.height) {
            canvas.width  = bmp.width;
            canvas.height = bmp.height;
          }
          ctx.drawImage(bmp, 0, 0);
          bmp.close();
        } catch (_) {}
      }
      await sleep(interval);
    }
  })();

  stream.getVideoTracks()[0]?.addEventListener('ended', () => { stopped = true; });

  return { stream, stop };
}

function fetchFrame(url: string, ms: number): Promise<Blob | null> {
  return new Promise(resolve => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'blob';
    xhr.timeout = ms;
    xhr.onload  = () => resolve(xhr.status === 200 && xhr.response?.size > 0 ? xhr.response : null);
    xhr.onerror = () => resolve(null);
    xhr.ontimeout = () => resolve(null);
    xhr.send();
  });
}

function sleep(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms));
}
