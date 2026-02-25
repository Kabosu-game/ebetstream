<template>
  <div class="page-content-with-space">
    <section class="defis_section py-6 position-relative overflow-hidden pb-120">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12 gx-0 gx-lg-4">
            <div class="defis__main">

              <!-- Header -->
              <div class="row mb-5">
                <div class="col-12">
                  <button class="btn_secondary mb-4" @click="$router.push('/streams')">
                    <i class="fas fa-arrow-left me-2"></i>Back
                  </button>
                  <div class="defis_content">
                    <span class="hero_badge mb-3 d-inline-block">📺 Create a Stream</span>
                    <h2 class="hero_title mb-4">
                      Launch your <span class="text_gradient">Live Stream</span>
                    </h2>
                    <p class="hero_subtitle mb-5">
                      Configure your stream and start broadcasting live directly from your browser.
                    </p>
                  </div>
                </div>
              </div>

              <!-- ── PHASE 1 : Formulaire ── -->
              <div v-if="phase === 'setup'" class="row justify-content-center">
                <div class="col-lg-8">
                  <div class="defi_card n11-bg rounded-8 p-4 p-lg-6">
                    <form @submit.prevent="handleSubmit">

                      <div class="mb-4">
                        <label class="text-white mb-2 d-block fw-bold">Stream Title *</label>
                        <input v-model="form.title" type="text" class="form-control n11-bg text-white border-secondary"
                          placeholder="Ex: My eBetStream" required maxlength="255" />
                      </div>

                      <div class="mb-4">
                        <label class="text-white mb-2 d-block fw-bold">Description</label>
                        <textarea v-model="form.description" class="form-control n11-bg text-white border-secondary"
                          placeholder="Describe your stream..." rows="3" maxlength="1000"></textarea>
                      </div>

                      <div class="row g-3 mb-4">
                        <div class="col-md-6">
                          <label class="text-white mb-2 d-block fw-bold">Category</label>
                          <select v-model="form.category" class="form-control n11-bg text-white border-secondary">
                            <option value="">Select a category</option>
                            <option>Gaming</option>
                            <option>Esports</option>
                            <option>Just Chatting</option>
                            <option>IRL</option>
                            <option>Music</option>
                            <option>Creative</option>
                          </select>
                        </div>
                        <div class="col-md-6">
                          <label class="text-white mb-2 d-block fw-bold">Game</label>
                          <input v-model="form.game" type="text" class="form-control n11-bg text-white border-secondary"
                            placeholder="FC Mobile, COD..." maxlength="100" />
                        </div>
                      </div>

                      <div class="mb-4">
                        <label class="text-white mb-2 d-block fw-bold">Thumbnail</label>
                        <input ref="thumbnailInput" type="file"
                          accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
                          class="form-control n11-bg text-white border-secondary" @change="handleThumbnailChange" />
                        <small class="text-white d-block mt-2" style="opacity:.7;">JPEG, PNG, GIF, WebP — max 5
                          MB</small>
                        <img v-if="thumbnailPreview" :src="thumbnailPreview" alt="preview" class="img-thumbnail mt-3"
                          style="max-width:200px;max-height:200px;object-fit:cover;" />
                      </div>

                      <div v-if="error" class="alert mb-4"
                        :class="errorType === 'compat' ? 'alert-warning' : 'alert-danger'" style="border-radius:10px;">
                        <div class="d-flex align-items-start justify-content-between gap-2">
                          <span v-html="error" style="line-height:1.5;"></span>
                          <button class="btn-close ms-2 flex-shrink-0"
                            :class="errorType === 'compat' ? 'btn-close-dark' : 'btn-close-white'"
                            @click="error = ''"></button>
                        </div>
                      </div>
                      <div v-if="successMsg"
                        class="alert alert-success mb-4 d-flex align-items-center justify-content-between">
                        <span>{{ successMsg }}</span>
                        <button class="btn-close btn-close-white" @click="successMsg = ''"></button>
                      </div>

                      <div class="d-flex gap-3">
                        <button v-if="!streamId" type="submit" class="btn_primary flex-fill" :disabled="loading">
                          <span v-if="loading"><i class="fas fa-spinner fa-spin me-2"></i>Creating...</span>
                          <span v-else><i class="fas fa-video me-2"></i>Create Stream</span>
                        </button>
                        <button v-else type="button" class="btn_primary flex-fill" @click="updateStream"
                          :disabled="loading">
                          <span v-if="loading"><i class="fas fa-spinner fa-spin me-2"></i>Saving...</span>
                          <span v-else><i class="fas fa-save me-2"></i>Save Changes</span>
                        </button>
                        <button type="button" class="btn_secondary" @click="$router.push('/streams')"
                          :disabled="loading">
                          Cancel
                        </button>
                      </div>
                    </form>

                    <!-- ── Bouton Go Live ── -->
                    <div v-if="streamId" class="mt-4 pt-4 border-top"
                      style="border-color:rgba(255,255,255,.1) !important;">
                      <div class="alert alert-info mb-4">
                        <i class="fas fa-info-circle me-2"></i>
                        Stream ID <strong>#{{ streamId }}</strong> — prêt à démarrer.
                      </div>

                      <!-- ── Sélecteur source MOBILE ── -->
                      <div v-if="isMobile" class="mb-4">
                        <p class="text-white mb-3 fw-bold">
                          <i class="fas fa-video me-2" style="color:#FF9F00;"></i>Source vidéo :
                        </p>
                        <div class="row g-2 mb-3">
                          <div class="col-6">
                            <button class="source_btn w-100" :class="{ active: sourceMode === 'camera-back' }"
                              @click="sourceMode = 'camera-back'">
                              <i class="fas fa-camera d-block mb-2" style="font-size:1.4rem;"></i>
                              Caméra arrière
                            </button>
                          </div>
                          <div class="col-6">
                            <button class="source_btn w-100" :class="{ active: sourceMode === 'camera-front' }"
                              @click="sourceMode = 'camera-front'">
                              <i class="fas fa-user-circle d-block mb-2" style="font-size:1.4rem;"></i>
                              Caméra avant
                            </button>
                          </div>
                          <div v-if="supportsDisplayMedia" class="col-12">
                            <button class="source_btn w-100" :class="{ active: sourceMode === 'screen' }"
                              @click="sourceMode = 'screen'">
                              <i class="fas fa-mobile-alt me-2"></i>
                              Partage d'écran (Android Chrome)
                            </button>
                          </div>
                        </div>
                      </div>

                      <!-- ── Source DESKTOP ── -->
                      <div v-else class="mb-4">
                        <div class="source_btn active" style="cursor:default;text-align:center;padding:.8rem;">
                          <i class="fas fa-desktop me-2"></i>Partage d'écran (bureau)
                        </div>
                      </div>

                      <button class="btn_primary w-100" style="font-size:1.05rem;padding:1rem;" @click="goLive"
                        :disabled="startingStream">
                        <span v-if="startingStream">
                          <i class="fas fa-spinner fa-spin me-2"></i>Démarrage...
                        </span>
                        <span v-else>
                          <i class="fas fa-play me-2"></i>Go Live
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- ── PHASE 2 : Streaming en cours ── -->
              <div v-if="phase === 'live'" class="row justify-content-center">
                <div class="col-lg-10">
                  <div class="defi_card n11-bg rounded-8 p-4">

                    <div class="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
                      <div class="d-flex align-items-center gap-3">
                        <span class="badge bg-danger px-3 py-2 fs-6">
                          <i class="fas fa-circle me-2" style="font-size:.6rem;animation:pulse 2s infinite;"></i>LIVE
                        </span>
                        <h4 class="mb-0 text-white">{{ form.title }}</h4>
                      </div>
                      <div class="d-flex align-items-center gap-3">
                        <span class="badge bg-dark px-3 py-2">
                          <i class="fas fa-eye me-2"></i>{{ viewerCount }}
                        </span>
                        <button class="btn btn-outline-danger" @click="stopStream" :disabled="stoppingStream">
                          <span v-if="stoppingStream"><i class="fas fa-spinner fa-spin me-1"></i></span>
                          <span v-else><i class="fas fa-stop me-1"></i></span>
                          Stop
                        </button>
                      </div>
                    </div>

                    <!-- Preview locale -->
                    <div class="mb-4 rounded overflow-hidden" style="background:#000;aspect-ratio:16/9;">
                      <video ref="localVideo" autoplay muted playsinline class="w-100 h-100"
                        style="object-fit:contain;"></video>
                    </div>

                    <div class="row g-3">
                      <div class="col-4">
                        <div class="defi_card p-3 text-center">
                          <div class="text-white mb-1" style="opacity:.7;font-size:.8rem;">Signal</div>
                          <div :class="wsConnected ? 'text-success' : 'text-danger'" class="fw-bold">
                            {{ wsConnected ? '✓ OK' : '✗ Off' }}
                          </div>
                        </div>
                      </div>
                      <div class="col-4">
                        <div class="defi_card p-3 text-center">
                          <div class="text-white mb-1" style="opacity:.7;font-size:.8rem;">Peers</div>
                          <div class="text-white fw-bold">{{ peerCount }}</div>
                        </div>
                      </div>
                      <div class="col-4">
                        <div class="defi_card p-3 text-center">
                          <div class="text-white mb-1" style="opacity:.7;font-size:.8rem;">Source</div>
                          <div :class="localStream ? 'text-success' : 'text-danger'" class="fw-bold">
                            {{ localStream ? '✓ OK' : '✗ Stop' }}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div v-if="error" class="alert alert-danger mt-3">
                      <i class="fas fa-exclamation-circle me-2"></i>{{ error }}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '@/utils/axios';

const router = useRouter();

// ── Formulaire ────────────────────────────────────────────────────────────────
const form = ref({ title: '', description: '', category: '', game: '' });
const thumbnailFile = ref<File | null>(null);
const thumbnailPreview = ref<string | null>(null);
const thumbnailInput = ref<HTMLInputElement | null>(null);
const streamId = ref<number | null>(null);

// ── UI state ──────────────────────────────────────────────────────────────────
const phase = ref<'setup' | 'live'>('setup');
const loading = ref(false);
const startingStream = ref(false);
const stoppingStream = ref(false);
const error = ref('');
const errorType = ref<'error' | 'compat'>('error'); // 'compat' = appareil incompatible
const successMsg = ref('');

// ── Détection device ──────────────────────────────────────────────────────────
const ua = navigator.userAgent;
const isIOS = /iPhone|iPad|iPod/i.test(ua);
const isAndroid = /Android/i.test(ua);
const isMobile = isIOS || isAndroid;
const supportsDisplayMedia = typeof (navigator.mediaDevices as any)?.getDisplayMedia === 'function';

// Source par défaut
const sourceMode = ref<'screen' | 'camera-back' | 'camera-front'>(
  !isMobile ? 'screen' : 'camera-back'
);

// ── WebRTC ────────────────────────────────────────────────────────────────────
const localVideo = ref<HTMLVideoElement | null>(null);
const localStream = ref<MediaStream | null>(null);
const wsConnected = ref(false);
const viewerCount = ref(0);
const peerCount = ref(0);

// Map brute — ne pas laisser Vue proxifier des RTCPeerConnection
const peerConnections: Record<string, RTCPeerConnection> = {};
let ws: WebSocket | null = null;

const WS_BASE = (import.meta.env.VITE_STREAM_WS_URL || 'wss://ebetstream.com/ws').replace(/\/$/, '');
const ICE_SERVERS = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
];

// ── Thumbnail ─────────────────────────────────────────────────────────────────
const handleThumbnailChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) { error.value = 'Image too large (max 5MB)'; return; }
  const valid = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
  if (!valid.includes(file.type)) { error.value = 'Unsupported format'; return; }
  thumbnailFile.value = file;
  const reader = new FileReader();
  reader.onload = (ev) => { thumbnailPreview.value = ev.target?.result as string; };
  reader.readAsDataURL(file);
};

// ── Créer le stream ───────────────────────────────────────────────────────────
const handleSubmit = async () => {
  error.value = ''; successMsg.value = '';
  loading.value = true;
  try {
    const fd = new FormData();
    fd.append('title', form.value.title);
    fd.append('description', form.value.description || '');
    fd.append('category', form.value.category || '');
    fd.append('game', form.value.game || '');
    if (thumbnailFile.value) fd.append('thumbnail', thumbnailFile.value);
    const res = await apiClient.post('/streams', fd);
    if (res.data.success) {
      streamId.value = res.data.data.id;
      successMsg.value = '✅ Stream created! You can now go live.';
    }
  } catch (err: any) {
    if (err.response?.status === 400 && err.response.data.message?.includes('already have')) {
      successMsg.value = 'You already have a stream — loading it...';
      await loadExistingStream();
    } else {
      const errs = err.response?.data?.errors;
      error.value = errs
        ? Object.values(errs).flat().join(', ')
        : (err.response?.data?.message || 'Error creating stream');
    }
  } finally { loading.value = false; }
};

// ── Mettre à jour ─────────────────────────────────────────────────────────────
const updateStream = async () => {
  if (!streamId.value) return;
  error.value = ''; successMsg.value = '';
  loading.value = true;
  try {
    const fd = new FormData();
    fd.append('title', form.value.title);
    fd.append('description', form.value.description || '');
    fd.append('category', form.value.category || '');
    fd.append('game', form.value.game || '');
    if (thumbnailFile.value) fd.append('thumbnail', thumbnailFile.value);
    const res = await apiClient.put(`/streams/${streamId.value}`, fd);
    if (res.data.success) successMsg.value = '✅ Stream updated!';
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Error updating stream';
  } finally { loading.value = false; }
};

// ── Charger stream existant ───────────────────────────────────────────────────
const loadExistingStream = async () => {
  try {
    const res = await apiClient.get('/stream-key');
    if (res.data.success) {
      streamId.value = res.data.data.stream_id;
      if (streamId.value) {
        const detail = await apiClient.get(`/streams/${streamId.value}`);
        if (detail.data.success) {
          const s = detail.data.data;
          form.value = {
            title: s.title || '', description: s.description || '',
            category: s.category || '', game: s.game || '',
          };
          if (s.thumbnail_url) thumbnailPreview.value = s.thumbnail_url;
        }
      }
    }
  } catch { }
};

// ── Capture média selon la source choisie ─────────────────────────────────────
// ── Vérification compatibilité ──────────────────────────────────────────────

const captureMedia = async (): Promise<MediaStream> => {
  const mode = sourceMode.value;

  // Vérification explicite avant de tenter
  if (mode === 'screen' && !supportsDisplayMedia) {
    throw Object.assign(new Error('COMPAT'), {
      name: 'CompatError',
      friendly: isIOS
        ? 'Le partage d'écran n'est pas disponible sur iPhone/iPad. Utilisez la caméra.'
        : 'Le partage d'écran n'est pas supporté par ce navigateur. Essayez Chrome sur Android.',
    });
  }

  // ── Caméra mobile (avant ou arrière) ────────────────────────────────────────
  if (mode === 'camera-back' || mode === 'camera-front') {
    return navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: mode === 'camera-front' ? 'user' : 'environment',
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
      audio: true,
    });
  }

  // ── Partage d'écran (desktop ou Android Chrome) ──────────────────────────────
  const screenStream = await (navigator.mediaDevices as any).getDisplayMedia({
    video: { width: { ideal: 1920 }, height: { ideal: 1080 }, frameRate: { ideal: 30 } },
    audio: true,
  });

  // Si pas d'audio système → essayer le micro en fallback
  if (screenStream.getAudioTracks().length === 0) {
    try {
      const micStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      micStream.getAudioTracks().forEach((t: MediaStreamTrack) => screenStream.addTrack(t));
    } catch { /* micro non disponible */ }
  }

  return screenStream;
};

// ── Go Live ───────────────────────────────────────────────────────────────────
const goLive = async () => {
  if (!streamId.value) return;
  error.value = ''; errorType.value = 'error';
  startingStream.value = true;

  try {
    const stream = await captureMedia();
    localStream.value = stream;

    stream.getTracks()[0]?.addEventListener('ended', () => stopStream());
    await apiClient.post(`/streams/${streamId.value}/start`);

    phase.value = 'live';
    await nextTick();

    if (localVideo.value) {
      localVideo.value.srcObject = stream;
      localVideo.value.muted = true;
    }
    connectSignaling();

  } catch (err: any) {
    localStream.value?.getTracks().forEach(t => t.stop());
    localStream.value = null;
    phase.value = 'setup';

    // Messages clairs selon le type d'erreur
    if (err.name === 'CompatError') {
      errorType.value = 'compat';
      error.value = err.friendly;
    } else if (err.name === 'NotAllowedError') {
      errorType.value = 'error';
      error.value = isMobile
        ? '🚫 Permission refusée. Allez dans Réglages → Navigateur → Autorisez l'accès à la caméra.'
        : '🚫 Permission refusée. Cliquez sur l'icône 🔒 dans la barre d'adresse et autorisez le partage d'écran.';
    } else if (err.name === 'NotFoundError') {
  errorType.value = 'compat';
  error.value = '📷 Aucune caméra détectée sur cet appareil.';
} else if (err.name === 'NotSupportedError' || err.name === 'TypeError') {
  errorType.value = 'compat';
  error.value = isIOS
    ? '🍎 Safari iOS ne supporte pas le streaming. Utilisez <strong>Chrome pour iOS</strong> à la place.'
    : '🌐 Votre navigateur ne supporte pas le streaming. Utilisez <strong>Chrome</strong> ou <strong>Edge</strong>.';
} else if (err.name === 'NotReadableError') {
  errorType.value = 'error';
  error.value = '📵 La caméra est déjà utilisée par une autre application. Fermez-la et réessayez.';
} else if (err.name === 'OverconstrainedError') {
  errorType.value = 'error';
  error.value = '⚙️ Résolution non supportée par cette caméra. Essayez l'autre caméra.';
} else {
  errorType.value = 'error';
  error.value = err.response?.data?.message || err.message || 'Erreur au démarrage.';
}
  } finally {
  startingStream.value = false;
}
};

// ── WebSocket signaling ───────────────────────────────────────────────────────
const connectSignaling = () => {
  const token = localStorage.getItem('auth_token') || '';
  ws = new WebSocket(`${WS_BASE}/stream/${streamId.value}?token=${encodeURIComponent(token)}`);

  ws.onopen = () => { wsConnected.value = true; };
  ws.onerror = () => { wsConnected.value = false; error.value = 'WebSocket error.'; };
  ws.onclose = () => { wsConnected.value = false; };

  ws.onmessage = async (evt) => {
    let msg: any;
    try { msg = JSON.parse(evt.data); } catch { return; }

    switch (msg.type) {
      case 'ready':
        viewerCount.value = msg.viewerCount ?? 0;
        break;
      case 'viewer-joined':
        viewerCount.value = msg.count ?? viewerCount.value;
        await createOffer(msg.viewerId);
        break;
      case 'answer':
        if (peerConnections[msg.viewerId]) {
          await peerConnections[msg.viewerId].setRemoteDescription(new RTCSessionDescription(msg.sdp));
        }
        break;
      case 'ice-candidate':
        if (peerConnections[msg.viewerId] && msg.candidate) {
          try { await peerConnections[msg.viewerId].addIceCandidate(new RTCIceCandidate(msg.candidate)); } catch { }
        }
        break;
      case 'viewer-left':
        viewerCount.value = msg.count ?? viewerCount.value;
        closePeer(msg.viewerId);
        break;
    }
  };
};

const createOffer = async (viewerId: string) => {
  if (!localStream.value) return;
  if (peerConnections[viewerId]) closePeer(viewerId);

  const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
  peerConnections[viewerId] = pc;
  peerCount.value = Object.keys(peerConnections).length;

  localStream.value.getTracks().forEach(track => pc.addTrack(track, localStream.value!));

  pc.onicecandidate = ({ candidate }) => {
    if (candidate && ws?.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'ice-candidate', viewerId, candidate }));
    }
  };
  pc.oniceconnectionstatechange = () => { if (pc.iceConnectionState === 'failed') pc.restartIce(); };
  pc.onconnectionstatechange = () => {
    if (pc.connectionState === 'failed' || pc.connectionState === 'closed') closePeer(viewerId);
  };

  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);
  ws?.send(JSON.stringify({ type: 'offer', viewerId, sdp: offer }));
};

const closePeer = (viewerId: string) => {
  if (peerConnections[viewerId]) {
    peerConnections[viewerId].close();
    delete peerConnections[viewerId];
    peerCount.value = Object.keys(peerConnections).length;
  }
};

// ── Stop stream ───────────────────────────────────────────────────────────────
const stopStream = async () => {
  if (stoppingStream.value) return;
  stoppingStream.value = true;
  try {
    Object.keys(peerConnections).forEach(closePeer);
    localStream.value?.getTracks().forEach(t => t.stop());
    localStream.value = null;
    if (localVideo.value) localVideo.value.srcObject = null;
    if (ws) { ws.close(); ws = null; }
    wsConnected.value = false;
    if (streamId.value) await apiClient.post(`/streams/${streamId.value}/stop`).catch(() => { });
    successMsg.value = '✅ Stream stopped!';
    setTimeout(() => router.push('/streams'), 2000);
  } finally { stoppingStream.value = false; }
};

// ── Lifecycle ─────────────────────────────────────────────────────────────────
onMounted(async () => {
  if (!localStorage.getItem('auth_token')) { router.push('/login'); return; }
  await loadExistingStream();
});

onBeforeUnmount(() => {
  Object.keys(peerConnections).forEach(closePeer);
  localStream.value?.getTracks().forEach(t => t.stop());
  if (ws) ws.close();
});
</script>

<style scoped>
.defis_section {
  width: 100%;
  background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%);
  color: white;
  position: relative;
  overflow: hidden;
  border-radius: 24px;
}

.text_gradient {
  background: linear-gradient(90deg, #FF9F00, #e67e00);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.btn_primary {
  background-color: #FF9F00;
  color: #000;
  border: none;
  padding: .75rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  transition: .3s;
  cursor: pointer;
}

.btn_primary:hover {
  transform: translateY(-2px);
}

.btn_primary:disabled {
  opacity: .5;
  cursor: not-allowed;
  transform: none;
}

.btn_secondary {
  background: transparent;
  border: 2px solid #FF9F00;
  color: #FF9F00;
  padding: .75rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  transition: .3s;
  cursor: pointer;
}

.btn_secondary:hover {
  background-color: #FF9F00;
  color: #000;
}

/* ── Boutons sélection source ── */
.source_btn {
  background: rgba(255, 255, 255, .07);
  border: 2px solid rgba(255, 255, 255, .15);
  color: rgba(255, 255, 255, .7);
  padding: 1rem .5rem;
  border-radius: 12px;
  font-size: .88rem;
  font-weight: 600;
  transition: .2s;
  cursor: pointer;
  text-align: center;
}

.source_btn:hover {
  border-color: #FF9F00;
  color: #FF9F00;
  background: rgba(255, 159, 0, .08);
}

.source_btn.active {
  border-color: #FF9F00;
  color: #FF9F00;
  background: rgba(255, 159, 0, .15);
}

.defi_card {
  background: rgba(255, 255, 255, .1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
}

.hero_badge {
  background: rgba(255, 159, 0, .2);
  color: #FF9F00;
  padding: .5rem 1rem;
  border-radius: 20px;
  font-size: .9rem;
  font-weight: 600;
}

.hero_title {
  font-size: 2.5rem;
  font-weight: 800;
  color: white;
  line-height: 1.2;
}

.hero_subtitle {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, .8);
  line-height: 1.6;
}

.form-control {
  color: white;
}

.form-control::placeholder {
  color: rgba(255, 255, 255, .5);
}

.form-control:focus {
  background-color: rgba(255, 255, 255, .1);
  border-color: #FF9F00;
  color: white;
}

@keyframes pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: .5;
  }
}

.page-content-with-space {
  padding-top: 90px;
}

@media (max-width: 768px) {
  .page-content-with-space {
    padding-top: 60px;
  }

  .hero_title {
    font-size: 1.8rem;
  }
}
</style>