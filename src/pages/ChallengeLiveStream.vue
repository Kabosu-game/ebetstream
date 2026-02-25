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
                <div class="alert alert-danger">
                  {{ error }}
                </div>
                <button class="btn_primary mt-3" @click="$router.push('/challenges')">
                  <i class="fas fa-arrow-left me-2"></i>
                  Back to Challenges
                </button>
              </div>

              <!-- Live Stream Content -->
              <div v-else-if="challenge">
                <!-- Back Button -->
                <button class="btn_secondary mb-4" @click="$router.push(`/challenges/${challenge.id}`)">
                  <i class="fas fa-arrow-left me-2"></i>
                  Back to Challenge
                </button>

                <div class="row g-4">
                  <!-- Left Column - Video Player -->
                  <div class="col-lg-8">
                    <!-- Video Player -->
                    <div class="defi_card n11-bg rounded-8 p-0 mb-4 overflow-hidden">
                      <div class="video_container position-relative" style="background: #000; aspect-ratio: 16/9;">
                        <!-- WebRTC Video -->
                        <video v-show="connected" ref="videoPlayer" autoplay playsinline controls
                          class="w-100 h-100 position-absolute top-0 start-0" style="object-fit: contain;"></video>

                        <!-- Waiting / connecting state -->
                        <div v-if="challenge.is_live && !connected"
                          class="w-100 h-100 d-flex align-items-center justify-content-center position-absolute top-0 start-0">
                          <div class="text-center text-white">
                            <div class="spinner-border text-warning mb-3" role="status"></div>
                            <p class="mb-0">{{ waitingMsg }}</p>
                            <button v-if="showRetry" class="btn_secondary mt-3"
                              style="padding:.5rem 1rem;font-size:.85rem;" @click="retryConnection">
                              <i class="fas fa-redo me-1"></i>Réessayer
                            </button>
                          </div>
                        </div>

                        <!-- Stream offline -->
                        <div v-if="!challenge.is_live"
                          class="w-100 h-100 d-flex align-items-center justify-content-center position-absolute top-0 start-0"
                          style="background:#000;">
                          <div class="text-center text-white">
                            <i class="fas fa-video-slash fs-1 mb-3" style="opacity:.5;"></i>
                            <p class="mb-0">Stream is offline</p>
                          </div>
                        </div>

                        <!-- Live Badge -->
                        <div v-if="challenge.is_live" class="position-absolute top-0 start-0 m-3">
                          <span class="badge bg-danger px-3 py-2">
                            <i class="fas fa-circle me-1" style="font-size:0.6rem; animation:pulse 2s infinite;"></i>
                            LIVE
                          </span>
                        </div>

                        <!-- Viewer Count -->
                        <div v-if="challenge.is_live" class="position-absolute bottom-0 end-0 m-3">
                          <span class="badge n11-bg text-white px-3 py-2">
                            <i class="fas fa-eye me-1"></i>
                            {{ challenge.viewer_count || 0 }} viewers
                          </span>
                        </div>

                        <!-- WS status (discret) -->
                        <div class="position-absolute top-0 end-0 m-3">
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

                  <!-- Right Column - Chat and Info -->
                  <div class="col-lg-4">
                    <!-- Live Stats -->
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

                    <!-- Scores -->
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
import { ref, onMounted, onUnmounted, computed, nextTick } from "vue";
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
  stream_id?: number;
}

const route = useRoute();
const router = useRouter();
const challenge = ref<Challenge | null>(null);
const loading = ref(false);
const error = ref("");
const videoPlayer = ref<HTMLVideoElement | null>(null);

// WebRTC / WebSocket
const connected = ref(false);
const waitingMsg = ref('Connexion au stream...');
const showRetry = ref(false);
let ws: WebSocket | null = null;
let pc: RTCPeerConnection | null = null;
let retryTimer: ReturnType<typeof setTimeout> | null = null;
let wsReconnectTimer: ReturnType<typeof setTimeout> | null = null;
let refreshInterval: any = null;
let wasLive = false;
let streamEnded = false;

const WS_BASE = (import.meta.env.VITE_STREAM_WS_URL || 'wss://ebetstream.com/ws').replace(/\/$/, '');
const ICE_SERVERS = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
];

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

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    open: "Open",
    accepted: "Accepted",
    in_progress: "In Progress",
    completed: "Completed",
    cancelled: "Cancelled",
  };
  return labels[status] || status;
};

const formatTime = (dateString: string | null) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getLiveDuration = () => {
  if (!challenge.value?.live_started_at) return "N/A";
  const start = new Date(challenge.value.live_started_at);
  const now = new Date();
  const diff = Math.floor((now.getTime() - start.getTime()) / 1000);
  const hours = Math.floor(diff / 3600);
  const minutes = Math.floor((diff % 3600) / 60);
  const seconds = diff % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
};

const loadLiveStream = async () => {
  try {
    loading.value = true;
    error.value = "";
    const challengeId = route.params.id;

    const response = await apiClient.get(`/challenges/${challengeId}/live`);

    if (response.data.success) {
      challenge.value = response.data.data.challenge;
      if (challenge.value?.is_live && !challenge.value?.is_live_paused) {
        wasLive = true;
        await nextTick();
        connectToStream();
      }
    } else {
      error.value = response.data.message || "Error loading live stream";
    }
  } catch (err: any) {
    console.error("Error loading live stream:", err);
    if (err.response?.status === 404) {
      error.value = "Challenge not found";
    } else if (err.response?.status === 400) {
      error.value = err.response.data.message || "This challenge is not currently live";
    } else {
      error.value = err.response?.data?.message || "Error loading live stream";
    }
  } finally {
    loading.value = false;
  }
};

// ── WebRTC / WebSocket ────────────────────────────────────────────────────────

const startRetryTimer = () => {
  showRetry.value = false;
  if (retryTimer) clearTimeout(retryTimer);
  retryTimer = setTimeout(() => {
    if (!connected.value && challenge.value?.is_live) {
      showRetry.value = true;
    }
  }, 8000);
};

const connectToStream = () => {
  cleanupWebRTC();
  streamEnded = false;

  if (!challenge.value?.id || !videoPlayer.value) return;

  const token = localStorage.getItem('auth_token') || '';
  const streamId = challenge.value.stream_id || challenge.value.id;
  const url = token
    ? `${WS_BASE}/watch/${streamId}?token=${encodeURIComponent(token)}`
    : `${WS_BASE}/watch/${streamId}`;

  wsStatus.value = 'connecting';
  waitingMsg.value = 'Connexion au serveur...';
  console.log('[Viewer] Connexion WebSocket à', url);
  ws = new WebSocket(url);

  ws.onopen = () => {
    wsStatus.value = 'connected';
    waitingMsg.value = 'Connecté, en attente du flux...';
    console.log('[Viewer] WebSocket ouvert');
    startRetryTimer();

    // Demander une offre après 2 secondes si aucune n'est reçue
    setTimeout(() => {
      if (!connected.value && ws?.readyState === WebSocket.OPEN) {
        console.log('[Viewer] Aucune offre reçue, envoi request-offer');
        ws.send(JSON.stringify({ type: 'request-offer' }));
      }
    }, 2000);
  };

  ws.onmessage = async (evt) => {
    let msg: any;
    try { msg = JSON.parse(evt.data); } catch { return; }
    console.log('[Viewer] Message reçu:', msg.type);

    switch (msg.type) {
      case 'waiting':
        waitingMsg.value = msg.message || 'En attente du streamer...';
        startRetryTimer();
        break;

      case 'offer':
        console.log('[Viewer] Réception offre, création réponse...');
        await handleOffer(msg.sdp);
        break;

      case 'ice-candidate':
        if (pc && msg.candidate) {
          console.log('[Viewer] Ajout candidat ICE distant');
          try { await pc.addIceCandidate(new RTCIceCandidate(msg.candidate)); } catch (e) { console.warn('Erreur ajout candidat', e); }
        }
        break;

      case 'stream-ended':
        console.log('[Viewer] Stream terminé par le serveur');
        streamEnded = true;
        connected.value = false;
        waitingMsg.value = 'Le stream est terminé.';
        showRetry.value = false;
        cleanupPeer();
        if (ws) { ws.onclose = null; ws.close(); ws = null; }
        wsStatus.value = 'disconnected';
        if (videoPlayer.value) videoPlayer.value.srcObject = null;
        await loadLiveStream();
        break;

      default:
        console.log('Message inconnu:', msg);
    }
  };

  ws.onerror = (err) => {
    console.error('[Viewer] WebSocket error:', err);
    wsStatus.value = 'disconnected';
    waitingMsg.value = 'Erreur de connexion WebSocket.';
  };

  ws.onclose = (evt) => {
    console.log('[Viewer] WebSocket fermé, code:', evt.code);
    wsStatus.value = 'disconnected';

    if (streamEnded) return;
    if (evt.code === 1008) {
      waitingMsg.value = 'Connexion refusée.';
      return;
    }
    if (!challenge.value?.is_live) return;

    if (!connected.value) {
      waitingMsg.value = 'Reconnexion...';
      if (wsReconnectTimer) clearTimeout(wsReconnectTimer);
      wsReconnectTimer = setTimeout(connectToStream, 3000);
    }
  };
};

const handleOffer = async (sdp: RTCSessionDescriptionInit) => {
  cleanupPeer();

  pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });

  pc.ontrack = (evt) => {
    console.log('[Viewer] Piste reçue, flux disponible');
    if (videoPlayer.value && evt.streams[0]) {
      videoPlayer.value.srcObject = evt.streams[0];
      connected.value = true;
      showRetry.value = false;
      waitingMsg.value = '';
      if (retryTimer) clearTimeout(retryTimer);
    }
  };

  pc.onicecandidate = ({ candidate }) => {
    if (candidate && ws?.readyState === WebSocket.OPEN) {
      console.log('[Viewer] Envoi candidat ICE');
      ws.send(JSON.stringify({ type: 'ice-candidate', candidate }));
    }
  };

  pc.oniceconnectionstatechange = () => {
    console.log('[Viewer] ICE state:', pc?.iceConnectionState);
    if (pc?.iceConnectionState === 'failed') {
      pc.restartIce();
    }
  };

  pc.onconnectionstatechange = () => {
    console.log('[Viewer] Connection state:', pc?.connectionState);
    if (pc?.connectionState === 'disconnected' || pc?.connectionState === 'failed') {
      connected.value = false;
      waitingMsg.value = 'Connexion perdue — tentative de reconnexion...';
      startRetryTimer();
      if (ws?.readyState === WebSocket.OPEN) {
        // Demander une nouvelle offre au streamer
        ws.send(JSON.stringify({ type: 'request-offer' }));
      }
    }
    if (pc?.connectionState === 'connected') {
      connected.value = true;
      showRetry.value = false;
    }
  };

  await pc.setRemoteDescription(new RTCSessionDescription(sdp));
  const answer = await pc.createAnswer();
  await pc.setLocalDescription(answer);
  console.log('[Viewer] Envoi réponse (answer)');
  ws?.send(JSON.stringify({ type: 'answer', sdp: answer }));
};

const cleanupPeer = () => {
  if (pc) {
    pc.ontrack = null;
    pc.onicecandidate = null;
    pc.onconnectionstatechange = null;
    pc.close();
    pc = null;
  }
};

const cleanupWebRTC = () => {
  streamEnded = true;
  if (retryTimer) clearTimeout(retryTimer);
  if (wsReconnectTimer) clearTimeout(wsReconnectTimer);
  cleanupPeer();
  if (ws) { ws.onclose = null; ws.close(); ws = null; }
  if (videoPlayer.value) videoPlayer.value.srcObject = null;
  connected.value = false;
  wsStatus.value = 'disconnected';
};

const retryConnection = () => {
  showRetry.value = false;
  connected.value = false;
  waitingMsg.value = 'Reconnexion...';
  cleanupWebRTC();
  streamEnded = false;
  setTimeout(connectToStream, 500);
};

// ── Rafraîchissement périodique des données live ─────────────────────────────

const refreshLiveData = async () => {
  if (!challenge.value) return;

  try {
    const response = await apiClient.get(`/challenges/${challenge.value.id}/live`);
    if (response.data.success) {
      const data = response.data.data;
      challenge.value.viewer_count = data.viewer_count || 0;
      challenge.value.is_live = data.is_live;
      challenge.value.is_live_paused = data.is_live_paused ?? false;

      if (data.is_live && !wasLive && !connected.value) {
        wasLive = true;
        connectToStream();
      } else if (!data.is_live) {
        wasLive = false;
        cleanupWebRTC();
        // Rediriger vers la page du challenge
        router.push(`/challenges/${challenge.value.id}`);
      }
    }
  } catch (err: any) {
    console.error("Error refreshing live data:", err);
  }
};

const startPolling = () => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
  }

  refreshInterval = setInterval(() => {
    if (challenge.value?.is_live) {
      refreshLiveData();
    }
  }, 5000);
};

onMounted(() => {
  loadLiveStream();
  startPolling();
});

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
  }
  cleanupWebRTC();
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

.btn_primary:hover {
  transform: translateY(-2px);
}

.btn_primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
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

.btn_secondary:hover {
  background-color: #FF9F00;
  color: #000;
}

.defi_card {
  background: rgba(255, 255, 255, .1);
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