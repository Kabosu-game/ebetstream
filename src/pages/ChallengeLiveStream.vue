<template>
  <div class="page-content-with-space">
    <section class="defis_section py-6 position-relative overflow-hidden pb-120">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12 gx-0 gx-lg-4">
            <div class="defis__main">

              <!-- Loading State -->
              <div v-if="loading" class="text-center py-5">
                <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>

              <!-- Error State -->
              <div v-else-if="error" class="text-center py-5">
                <div class="alert alert-danger">{{ error }}</div>
                <button class="btn_primary mt-3" @click="$router.push('/challenges')">
                  <i class="fas fa-arrow-left me-2"></i>Back to Challenges
                </button>
              </div>

              <!-- Live Stream Content -->
              <div v-else-if="challenge">
                <button class="btn_secondary mb-4" @click="$router.push(`/challenges/${challenge.id}`)">
                  <i class="fas fa-arrow-left me-2"></i>Back to Challenge
                </button>

                <div class="row g-4">
                  <!-- Left Column - Video Player -->
                  <div class="col-lg-8">
                    <div class="defi_card n11-bg rounded-8 p-0 mb-4 overflow-hidden">
                      <div class="video_container position-relative" style="background: #000; aspect-ratio: 16/9;">

                        <!-- WebRTC Video -->
                        <video v-show="challenge.is_live && hasRemoteStream" ref="videoPlayer" autoplay playsinline
                          controls class="w-100 h-100 position-absolute top-0 start-0"
                          style="object-fit: contain; z-index: 1; background: #000;"></video>

                        <!-- Paused -->
                        <div v-if="challenge.is_live && challenge.is_live_paused"
                          class="w-100 h-100 position-absolute top-0 start-0 d-flex align-items-center justify-content-center flex-column bg-dark"
                          style="z-index: 2;">
                          <i class="fas fa-pause-circle fs-1 text-warning mb-3" style="opacity: 0.8;"></i>
                          <p class="mb-0 text-white">Stream en pause</p>
                        </div>

                        <!-- Connecting -->
                        <div v-else-if="challenge.is_live && !hasRemoteStream && !streamError"
                          class="w-100 h-100 position-absolute top-0 start-0 d-flex align-items-center justify-content-center flex-column bg-dark"
                          style="z-index: 2;">
                          <div class="spinner-border text-warning mb-3" role="status"></div>
                          <p class="mb-0 text-white">{{ waitingMsg }}</p>
                          <button v-if="showRetry" class="btn btn-outline-light btn-sm mt-3" @click="retryConnection">
                            <i class="fas fa-redo me-1"></i>Réessayer
                          </button>
                        </div>

                        <!-- Error -->
                        <div v-else-if="challenge.is_live && streamError"
                          class="w-100 h-100 position-absolute top-0 start-0 d-flex align-items-center justify-content-center flex-column bg-dark"
                          style="z-index: 2;">
                          <i class="fas fa-exclamation-triangle fs-1 text-warning mb-3"></i>
                          <p class="mb-3 text-white">{{ streamError }}</p>
                          <button class="btn btn-outline-light btn-sm" @click="retryConnection">Réessayer</button>
                        </div>

                        <!-- Offline -->
                        <div v-if="!challenge.is_live"
                          class="w-100 h-100 d-flex align-items-center justify-content-center">
                          <div class="text-center text-white">
                            <i class="fas fa-video-slash fs-1 mb-3" style="opacity: 0.5;"></i>
                            <p class="mb-0">Stream is offline</p>
                          </div>
                        </div>

                        <!-- Live Badge -->
                        <div v-if="challenge.is_live" class="position-absolute top-0 start-0 m-3">
                          <span class="badge bg-danger px-3 py-2">
                            <i class="fas fa-circle me-1"
                              style="font-size: 0.6rem; animation: pulse 2s infinite;"></i>LIVE
                          </span>
                        </div>

                        <!-- Viewer Count -->
                        <div v-if="challenge.is_live" class="position-absolute top-0 end-0 m-3">
                          <span class="badge n11-bg text-white px-3 py-2">
                            <i class="fas fa-eye me-1"></i>{{ challenge.viewer_count || 0 }} viewers
                          </span>
                        </div>

                        <!-- WS Status -->
                        <div class="position-absolute bottom-0 start-0 m-3">
                          <span class="badge px-2 py-1" :style="{ background: wsStatusColor, fontSize: '.7rem' }">
                            {{ wsStatusLabel }}
                          </span>
                        </div>
                      </div>
                    </div>

                    <!-- Challenge Info -->
                    <div class="defi_card n11-bg rounded-8 p-4">
                      <h2 class="fw-bold mb-3 text-white">
                        <span class="text_gradient">{{ challenge.game }}</span> Challenge
                      </h2>
                      <div class="row g-3">
                        <div class="col-md-6">
                          <div class="info_item p-3 rounded-3 n11-bg">
                            <span class="text-white small d-block mb-1" style="opacity: 0.8;">Creator</span>
                            <span class="fw-bold text-white">{{ challenge.creator?.username }}</span>
                          </div>
                        </div>
                        <div class="col-md-6">
                          <div class="info_item p-3 rounded-3 n11-bg">
                            <span class="text-white small d-block mb-1" style="opacity: 0.8;">Opponent</span>
                            <span class="fw-bold text-white">{{ challenge.opponent?.username || 'Waiting...' }}</span>
                          </div>
                        </div>
                        <div class="col-md-6">
                          <div class="info_item p-3 rounded-3 n11-bg">
                            <span class="text-white small d-block mb-1" style="opacity: 0.8;">Bet Amount</span>
                            <span class="fw-bold n10-color">{{ challenge.bet_amount?.toLocaleString() }} EBT</span>
                          </div>
                        </div>
                        <div class="col-md-6">
                          <div class="info_item p-3 rounded-3 n11-bg">
                            <span class="text-white small d-block mb-1" style="opacity: 0.8;">Status</span>
                            <span class="fw-bold text-white">{{ getStatusLabel(challenge.status) }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Right Column -->
                  <div class="col-lg-4">
                    <div class="defi_card n11-bg rounded-8 p-4 mb-4">
                      <h5 class="fw-bold mb-3 text-white">
                        <i class="fas fa-chart-line me-2"></i>Live Stats
                      </h5>
                      <div class="mb-3">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                          <span class="text-white small" style="opacity: 0.8;">Viewers</span>
                          <span class="fw-bold text-white">{{ challenge.viewer_count || 0 }}</span>
                        </div>
                        <div class="d-flex justify-content-between align-items-center mb-2">
                          <span class="text-white small" style="opacity: 0.8;">Started</span>
                          <span class="fw-bold text-white">{{ formatTime(challenge.live_started_at) }}</span>
                        </div>
                        <div class="d-flex justify-content-between align-items-center">
                          <span class="text-white small" style="opacity: 0.8;">Duration</span>
                          <span class="fw-bold text-white">{{ getLiveDuration() }}</span>
                        </div>
                      </div>
                    </div>

                    <div v-if="challenge.creator_score !== null || challenge.opponent_score !== null"
                      class="defi_card n11-bg rounded-8 p-4 mb-4">
                      <h5 class="fw-bold mb-3 text-white">Scores</h5>
                      <div class="d-flex justify-content-between align-items-center mb-3">
                        <div class="text-center">
                          <div class="text-white small mb-1">{{ challenge.creator?.username }}</div>
                          <div class="fs-3 fw-bold text-primary">{{ challenge.creator_score ?? '-' }}</div>
                        </div>
                        <div class="text-white">VS</div>
                        <div class="text-center">
                          <div class="text-white small mb-1">{{ challenge.opponent?.username || 'Opponent' }}</div>
                          <div class="fs-3 fw-bold text-success">{{ challenge.opponent_score ?? '-' }}</div>
                        </div>
                      </div>
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
import { ref, computed, onMounted, onUnmounted, nextTick } from "vue";
import { useRouter, useRoute } from "vue-router";
import apiClient from "@/utils/axios";

interface Challenge {
  id: number;
  game: string;
  bet_amount: number;
  status: string;
  creator: { id: number; username: string };
  opponent: { id: number; username: string } | null;
  creator_score: number | null;
  opponent_score: number | null;
  is_live: boolean;
  is_live_paused?: boolean;
  stream_url: string | null;
  viewer_count: number;
  live_started_at: string | null;
}

const route = useRoute();
const router = useRouter();
const challenge = ref<Challenge | null>(null);
const loading = ref(false);
const error = ref("");
const videoPlayer = ref<HTMLVideoElement | null>(null);
const hasRemoteStream = ref(false);
const streamError = ref("");
const waitingMsg = ref("Connexion au stream...");
const showRetry = ref(false);

// ── WebRTC via WS signaling ───────────────────────────────────────────────────
let ws: WebSocket | null = null;
let pc: RTCPeerConnection | null = null;
let wsReconnectTimer: ReturnType<typeof setTimeout> | null = null;
let retryTimer: ReturnType<typeof setTimeout> | null = null;
// ✅ FIX — utiliser un flag "destroyed" pour bloquer tout après unmount
let destroyed = false;
let streamEnded = false;
let refreshInterval: ReturnType<typeof setInterval> | null = null;

const wsStatus = ref<'disconnected' | 'connecting' | 'connected'>('disconnected');

const wsStatusColor = computed(() => {
  if (wsStatus.value === 'connected') return 'rgba(40,167,69,.8)';
  if (wsStatus.value === 'connecting') return 'rgba(255,193,7,.8)';
  return 'rgba(220,53,69,.8)';
});

const wsStatusLabel = computed(() => {
  if (wsStatus.value === 'connected') return '● WS';
  if (wsStatus.value === 'connecting') return '◌ WS';
  return '○ WS';
});

const WS_BASE = (import.meta.env.VITE_STREAM_WS_URL || 'wss://ebetstream.com/ws').replace(/\/$/, '');
const ICE_SERVERS = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
];

const startRetryTimer = () => {
  showRetry.value = false;
  if (retryTimer) clearTimeout(retryTimer);
  retryTimer = setTimeout(() => {
    if (!hasRemoteStream.value && !destroyed) showRetry.value = true;
  }, 10000);
};

// ✅ FIX #1 — Vérifier CONNECTING en plus de OPEN + vérifier destroyed
const connectWebRTC = () => {
  if (!challenge.value) return;
  // ✅ Ne rien faire si le composant est démonté
  if (destroyed) return;
  // ✅ Bloquer si déjà OPEN ou CONNECTING (évite double connexion)
  if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) return;

  streamEnded = false;
  wsStatus.value = 'connecting';
  streamError.value = '';
  waitingMsg.value = 'Connexion au stream...';

  const token = localStorage.getItem('auth_token') || '';
  const url = token
    ? `${WS_BASE}/watch/${challenge.value.id}?token=${encodeURIComponent(token)}`
    : `${WS_BASE}/watch/${challenge.value.id}`;

  ws = new WebSocket(url);

  ws.onopen = () => {
    if (destroyed) { ws?.close(); return; }
    wsStatus.value = 'connected';
    waitingMsg.value = 'Connecté — en attente du flux vidéo...';
    startRetryTimer();
  };

  ws.onmessage = async (evt) => {
    if (destroyed) return;
    let msg: any;
    try { msg = JSON.parse(evt.data); } catch { return; }

    switch (msg.type) {
      case 'waiting':
        waitingMsg.value = msg.message || 'En attente du streamer...';
        startRetryTimer();
        break;
      case 'offer':
        await handleOffer(msg.sdp);
        break;
      case 'ice-candidate':
        if (pc && msg.candidate) {
          try { await pc.addIceCandidate(new RTCIceCandidate(msg.candidate)); } catch { }
        }
        break;
      case 'stream-ended':
        streamEnded = true;
        if (wsReconnectTimer) clearTimeout(wsReconnectTimer);
        hasRemoteStream.value = false;
        waitingMsg.value = 'Le stream est terminé.';
        showRetry.value = false;
        cleanupPeer();
        if (ws) {
          // ✅ Neutraliser tous les handlers avant close
          ws.onclose = null;
          ws.onerror = null;
          ws.onmessage = null;
          ws.onopen = null;
          if (ws.readyState !== WebSocket.CLOSED && ws.readyState !== WebSocket.CLOSING) {
            ws.close();
          }
          ws = null;
        }
        wsStatus.value = 'disconnected';
        if (videoPlayer.value) videoPlayer.value.srcObject = null;
        await refreshChallengeData(false);
        break;
    }
  };

  ws.onerror = () => {
    if (destroyed) return;
    wsStatus.value = 'disconnected';
    streamError.value = 'Erreur de connexion WebSocket.';
  };

  ws.onclose = (evt) => {
    if (destroyed) return;
    wsStatus.value = 'disconnected';
    if (streamEnded) return;
    if (evt.code === 1008) { streamError.value = 'Connexion refusée.'; return; }
    if (!challenge.value?.is_live) return;
    if (!hasRemoteStream.value) {
      waitingMsg.value = 'Reconnexion...';
      if (wsReconnectTimer) clearTimeout(wsReconnectTimer);
      wsReconnectTimer = setTimeout(() => {
        if (!destroyed) connectWebRTC();
      }, 3000);
    }
  };
};

const handleOffer = async (sdp: RTCSessionDescriptionInit) => {
  if (destroyed) return;
  cleanupPeer();
  pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });

  pc.ontrack = (evt) => {
    if (destroyed) return;
    if (!videoPlayer.value) return;
    const stream = evt.streams?.[0] || new MediaStream([evt.track]);
    videoPlayer.value.srcObject = stream;
    hasRemoteStream.value = true;
    showRetry.value = false;
    streamError.value = '';
    waitingMsg.value = '';
    if (retryTimer) clearTimeout(retryTimer);
    nextTick(() => {
      const v = videoPlayer.value;
      if (v && v.srcObject) v.play().catch(() => {});
    });
  };

  pc.onicecandidate = ({ candidate }) => {
    if (candidate && ws?.readyState === WebSocket.OPEN)
      ws.send(JSON.stringify({ type: 'ice-candidate', candidate }));
  };

  pc.oniceconnectionstatechange = () => {
    if (pc?.iceConnectionState === 'failed') pc.restartIce();
  };

  pc.onconnectionstatechange = () => {
    if (destroyed) return;
    if (pc?.connectionState === 'disconnected' || pc?.connectionState === 'failed') {
      hasRemoteStream.value = false;
      waitingMsg.value = 'Connexion perdue — tentative de reconnexion...';
      startRetryTimer();
      if (ws?.readyState === WebSocket.OPEN)
        ws.send(JSON.stringify({ type: 'request-offer' }));
    }
    if (pc?.connectionState === 'connected') {
      hasRemoteStream.value = true;
      showRetry.value = false;
    }
  };

  await pc.setRemoteDescription(new RTCSessionDescription(sdp));
  const answer = await pc.createAnswer();
  await pc.setLocalDescription(answer);
  ws?.send(JSON.stringify({ type: 'answer', sdp: answer }));
};

const cleanupPeer = () => {
  if (pc) {
    pc.ontrack = null;
    pc.onicecandidate = null;
    pc.onconnectionstatechange = null;
    pc.oniceconnectionstatechange = null;
    pc.close();
    pc = null;
  }
};

// ✅ FIX #2 — cleanupAll vérifie readyState avant close() + neutralise tous les handlers
const cleanupAll = () => {
  destroyed = true;
  if (retryTimer) clearTimeout(retryTimer);
  if (wsReconnectTimer) clearTimeout(wsReconnectTimer);
  cleanupPeer();
  if (ws) {
    // Neutraliser TOUS les handlers pour éviter tout callback après cleanup
    ws.onclose = null;
    ws.onerror = null;
    ws.onmessage = null;
    ws.onopen = null;
    // ✅ Ne fermer que si pas déjà fermé ou en cours de fermeture
    if (ws.readyState !== WebSocket.CLOSED && ws.readyState !== WebSocket.CLOSING) {
      ws.close();
    }
    ws = null;
  }
  if (videoPlayer.value) videoPlayer.value.srcObject = null;
  hasRemoteStream.value = false;
  wsStatus.value = 'disconnected';
};

// ✅ FIX #3 — retryConnection remet destroyed = false et streamEnded = false AVANT setTimeout
const retryConnection = () => {
  showRetry.value = false;
  hasRemoteStream.value = false;
  streamError.value = '';
  waitingMsg.value = 'Reconnexion...';
  // Nettoyer sans poser destroyed définitivement
  if (retryTimer) clearTimeout(retryTimer);
  if (wsReconnectTimer) clearTimeout(wsReconnectTimer);
  cleanupPeer();
  if (ws) {
    ws.onclose = null;
    ws.onerror = null;
    ws.onmessage = null;
    ws.onopen = null;
    if (ws.readyState !== WebSocket.CLOSED && ws.readyState !== WebSocket.CLOSING) {
      ws.close();
    }
    ws = null;
  }
  if (videoPlayer.value) videoPlayer.value.srcObject = null;
  wsStatus.value = 'disconnected';
  // ✅ Reset des flags bloquants AVANT de reconnecter
  destroyed = false;
  streamEnded = false;
  setTimeout(connectWebRTC, 800);
};

// ── API helpers ───────────────────────────────────────────────────────────────
const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    open: "Open", accepted: "Accepted", in_progress: "In Progress",
    completed: "Completed", cancelled: "Cancelled",
  };
  return labels[status] || status;
};

const formatTime = (dateString: string | null) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
};

const getLiveDuration = () => {
  if (!challenge.value?.live_started_at) return "N/A";
  const diff = Math.floor((Date.now() - new Date(challenge.value.live_started_at).getTime()) / 1000);
  const h = Math.floor(diff / 3600);
  const m = Math.floor((diff % 3600) / 60);
  const s = diff % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
};

const loadLiveStream = async () => {
  try {
    loading.value = true;
    error.value = "";
    const response = await apiClient.get(`/challenges/${route.params.id}/live`);
    if (response.data.success) {
      challenge.value = response.data.data.challenge ?? response.data.data;
      if (challenge.value?.is_live && !challenge.value?.is_live_paused) {
        await nextTick();
        connectWebRTC();
      }
    } else {
      error.value = response.data.message || "Error loading live stream";
    }
  } catch (err: any) {
    if (err.response?.status === 404) error.value = "Challenge not found";
    else if (err.response?.status === 400)
      error.value = err.response.data.message || "This challenge is not currently live";
    else error.value = err.response?.data?.message || "Error loading live stream";
  } finally {
    loading.value = false;
  }
};

const refreshChallengeData = async (connectIfLive = true) => {
  if (!challenge.value || destroyed) return;
  try {
    const res = await apiClient.get(`/challenges/${challenge.value.id}/live`);
    if (res.data.success && !destroyed) {
      const data = res.data.data.challenge ?? res.data.data;
      if (challenge.value) {
        challenge.value.viewer_count = data.viewer_count ?? 0;
        challenge.value.is_live = data.is_live;
        challenge.value.is_live_paused = data.is_live_paused ?? false;
        challenge.value.creator_score = data.creator_score;
        challenge.value.opponent_score = data.opponent_score;
        challenge.value.status = data.status;
      }
      // ✅ Reconnexion uniquement si WS vraiment déconnecté (pas CONNECTING)
      if (
        connectIfLive &&
        data.is_live &&
        !streamEnded &&
        !hasRemoteStream.value &&
        wsStatus.value === 'disconnected' &&
        (!ws || ws.readyState === WebSocket.CLOSED)
      ) {
        connectWebRTC();
      }
      if (!data.is_live && !streamEnded) {
        streamEnded = true;
        cleanupAll();
      }
    }
  } catch { }
};

onMounted(async () => {
  destroyed = false;
  streamEnded = false;
  await loadLiveStream();
  refreshInterval = setInterval(() => {
    if (!destroyed) refreshChallengeData(true);
  }, 30000);
});

onUnmounted(() => {
  if (refreshInterval) clearInterval(refreshInterval);
  cleanupAll();
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
  background: linear-gradient(90deg, #FF9F00, #FF9F00);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.btn_primary {
  background-color: #FF9F00;
  color: #000;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  transition: 0.3s;
  cursor: pointer;
}

.btn_secondary {
  background: transparent;
  border: 2px solid #FF9F00;
  color: #FF9F00;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  transition: 0.3s;
  cursor: pointer;
}

.defi_card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
}

.n10-color {
  color: #FF9F00;
}

.n11-bg {
  background: rgba(255, 255, 255, 0.05);
}

.info_item {
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.page-content-with-space {
  padding-top: 90px;
}

@keyframes pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }
}

@media (max-width: 768px) {
  .page-content-with-space {
    padding-top: 60px;
  }
}
</style>