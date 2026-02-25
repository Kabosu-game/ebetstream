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
                        <video v-show="challenge.is_live" ref="videoPlayer" autoplay playsinline
                          class="w-100 h-100 position-absolute top-0 start-0" style="object-fit: contain;"></video>
                        <div v-if="challenge.is_live && challenge.is_live_paused"
                          class="w-100 h-100 position-absolute top-0 start-0 d-flex align-items-center justify-content-center flex-column bg-dark"
                          style="z-index: 2;">
                          <i class="fas fa-pause-circle fs-1 text-warning mb-3" style="opacity: 0.8;"></i>
                          <p class="mb-0 text-white">Stream en pause</p>
                        </div>
                        <div v-else-if="challenge.is_live && !hasRemoteStream && !streamError"
                          class="w-100 h-100 position-absolute top-0 start-0 d-flex align-items-center justify-content-center flex-column bg-dark"
                          style="z-index: 2;">
                          <i class="fas fa-spinner fa-spin fs-1 text-white mb-3" style="opacity: 0.7;"></i>
                          <p class="mb-0 text-white">Connexion au stream...</p>
                        </div>
                        <div v-else-if="challenge.is_live && streamError"
                          class="w-100 h-100 position-absolute top-0 start-0 d-flex align-items-center justify-content-center flex-column bg-dark"
                          style="z-index: 2;">
                          <i class="fas fa-exclamation-triangle fs-1 text-warning mb-3"></i>
                          <p class="mb-3 text-white">{{ streamError }}</p>
                          <button class="btn btn-outline-light btn-sm" @click="connectToStream">
                            Réessayer
                          </button>
                        </div>
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
                            <i class="fas fa-circle me-1" style="font-size: 0.6rem; animation: pulse 2s infinite;"></i>
                            LIVE
                          </span>
                        </div>

                        <!-- Viewer Count -->
                        <div v-if="challenge.is_live" class="position-absolute top-0 end-0 m-3">
                          <span class="badge n11-bg text-white px-3 py-2">
                            <i class="fas fa-eye me-1"></i>
                            {{ challenge.viewer_count || 0 }} viewers
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
import { ref, onMounted, onUnmounted, nextTick } from "vue";
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
  stream_id?: number; // Ajout pour lier le stream au challenge
}

const route = useRoute();
const router = useRouter();
const challenge = ref<Challenge | null>(null);
const loading = ref(false);
const error = ref("");
const videoPlayer = ref<HTMLVideoElement | null>(null);
const hasRemoteStream = ref(false);
const streamError = ref("");

// WebRTC / WebSocket
const ws = ref<WebSocket | null>(null);
const pc = ref<RTCPeerConnection | null>(null);
let connectionTimeoutId: ReturnType<typeof setTimeout> | null = null;
let refreshInterval: any = null;
let wasLive = false;

const ICE_SERVERS = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
];

const WS_BASE = (import.meta.env.VITE_STREAM_WS_URL || 'wss://ebetstream.com/ws').replace(/\/$/, '');

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

const connectToStream = () => {
  // Nettoyage des connexions précédentes
  if (ws.value) {
    ws.value.close();
    ws.value = null;
  }
  if (pc.value) {
    pc.value.close();
    pc.value = null;
  }
  if (connectionTimeoutId) {
    clearTimeout(connectionTimeoutId);
    connectionTimeoutId = null;
  }

  if (!challenge.value?.id || !videoPlayer.value) return;

  streamError.value = "";
  hasRemoteStream.value = false;

  // Timeout de connexion
  connectionTimeoutId = setTimeout(() => {
    if (!hasRemoteStream.value && !streamError.value && challenge.value?.is_live) {
      streamError.value = "Impossible de se connecter au stream. Vérifiez que le streamer est bien en direct.";
      setTimeout(() => {
        streamError.value = "";
        connectToStream();
      }, 5000);
    }
    connectionTimeoutId = null;
  }, 15000);

  const token = localStorage.getItem('auth_token') || '';
  // Utiliser stream_id s'il existe, sinon fallback sur l'ID du challenge (à adapter selon l'API)
  const streamId = challenge.value.stream_id || challenge.value.id;
  const wsUrl = `${WS_BASE}/stream/${streamId}?token=${encodeURIComponent(token)}`;

  ws.value = new WebSocket(wsUrl);

  ws.value.onopen = () => {
    console.log('WebSocket connected for viewing');
  };

  ws.value.onerror = (err) => {
    console.error('WebSocket error', err);
    streamError.value = 'Erreur de connexion au serveur.';
    if (connectionTimeoutId) {
      clearTimeout(connectionTimeoutId);
      connectionTimeoutId = null;
    }
  };

  ws.value.onclose = () => {
    console.log('WebSocket closed');
    // Tentative de reconnexion si le challenge est toujours live
    if (challenge.value?.is_live) {
      setTimeout(connectToStream, 3000);
    }
  };

  ws.value.onmessage = async (event) => {
    let msg;
    try {
      msg = JSON.parse(event.data);
    } catch {
      return;
    }

    switch (msg.type) {
      case 'offer':
        // Créer la connexion peer si elle n'existe pas
        if (!pc.value) {
          pc.value = new RTCPeerConnection({ iceServers: ICE_SERVERS });

          pc.value.ontrack = (event) => {
            if (videoPlayer.value && event.streams[0]) {
              videoPlayer.value.srcObject = event.streams[0];
              hasRemoteStream.value = true;
              streamError.value = "";
              if (connectionTimeoutId) {
                clearTimeout(connectionTimeoutId);
                connectionTimeoutId = null;
              }
            }
          };

          pc.value.onicecandidate = (event) => {
            if (event.candidate && ws.value?.readyState === WebSocket.OPEN) {
              ws.value?.send(JSON.stringify({
                type: 'ice-candidate',
                candidate: event.candidate
              }));
            }
          };

          pc.value.oniceconnectionstatechange = () => {
            if (pc.value?.iceConnectionState === 'failed') {
              pc.value.restartIce();
            }
          };

          pc.value.onconnectionstatechange = () => {
            if (pc.value?.connectionState === 'failed' || pc.value?.connectionState === 'closed') {
              hasRemoteStream.value = false;
              // Reconnexion
              setTimeout(connectToStream, 3000);
            }
          };
        }

        // Appliquer l'offre
        await pc.value.setRemoteDescription(new RTCSessionDescription(msg.sdp));

        // Créer la réponse
        const answer = await pc.value.createAnswer();
        await pc.value.setLocalDescription(answer);

        // Envoyer la réponse
        ws.value?.send(JSON.stringify({
          type: 'answer',
          sdp: answer
        }));
        break;

      case 'ice-candidate':
        if (pc.value && msg.candidate) {
          try {
            await pc.value.addIceCandidate(new RTCIceCandidate(msg.candidate));
          } catch (e) {
            console.error('Error adding ICE candidate', e);
          }
        }
        break;

      case 'viewer-count':
        if (challenge.value) {
          challenge.value.viewer_count = msg.count || 0;
        }
        break;

      default:
        console.log('Unknown message type', msg.type);
    }
  };
};

const refreshLiveData = async () => {
  if (!challenge.value) return;

  try {
    const response = await apiClient.get(`/challenges/${challenge.value.id}/live`);
    if (response.data.success) {
      const data = response.data.data;
      challenge.value.viewer_count = data.viewer_count || 0;
      challenge.value.is_live = data.is_live;
      challenge.value.is_live_paused = data.is_live_paused ?? false;

      if (data.is_live && !wasLive && !hasRemoteStream.value) {
        wasLive = true;
        connectToStream();
      } else if (!data.is_live) {
        wasLive = false;
        // Nettoyer les connexions
        if (ws.value) {
          ws.value.close();
          ws.value = null;
        }
        if (pc.value) {
          pc.value.close();
          pc.value = null;
        }
        hasRemoteStream.value = false;
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
  if (connectionTimeoutId) {
    clearTimeout(connectionTimeoutId);
  }
  if (ws.value) {
    ws.value.close();
  }
  if (pc.value) {
    pc.value.close();
  }
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

@media (max-width: 768px) {
  .page-content-with-space {
    padding-top: 60px;
  }
}
</style>