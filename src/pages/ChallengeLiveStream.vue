<template>
  <div class="page-content-with-space">
    <section class="defis_section py-6 position-relative overflow-hidden pb-120">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12 gx-0 gx-lg-4">
            <div class="defis__main">

              <!-- Loading -->
              <div v-if="loading" class="text-center py-5">
                <div class="spinner-border text-primary" role="status" style="width:3rem;height:3rem;">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>

              <!-- Erreur -->
              <div v-else-if="pageError" class="text-center py-5">
                <div class="alert alert-danger">{{ pageError }}</div>
                <button class="btn_primary mt-3" @click="$router.push('/challenges')">
                  <i class="fas fa-arrow-left me-2"></i>Back to Challenges
                </button>
              </div>

              <!-- Contenu -->
              <div v-else-if="challenge">
                <button class="btn_secondary mb-4" @click="$router.push(`/challenges/${challenge.id}`)">
                  <i class="fas fa-arrow-left me-2"></i>Back to Challenge
                </button>

                <div class="row g-4">

                  <!-- ── Colonne vidéo ── -->
                  <div class="col-lg-8">
                    <div class="defi_card n11-bg rounded-8 p-0 mb-4 overflow-hidden">
                      <div class="video_container position-relative" style="background:#000;aspect-ratio:16/9;">

                        <!-- Vidéo WebRTC -->
                        <video ref="remoteVideo" v-show="connected" autoplay playsinline controls class="w-100 h-100"
                          style="object-fit:contain;"></video>

                        <!-- Attente connexion WebRTC -->
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
                            <p class="mb-0">Stream offline</p>
                            <small style="opacity:.6;">Revenez quand le streamer est en direct.</small>
                          </div>
                        </div>

                        <!-- Badge LIVE -->
                        <div v-if="challenge.is_live" class="position-absolute top-0 start-0 m-3">
                          <span class="badge bg-danger px-3 py-2">
                            <i class="fas fa-circle me-1" style="font-size:.6rem;animation:pulse 2s infinite;"></i>LIVE
                          </span>
                        </div>

                        <!-- Viewers -->
                        <div v-if="challenge.is_live" class="position-absolute bottom-0 end-0 m-3">
                          <span class="badge bg-dark px-2 py-1">
                            <i class="fas fa-eye me-1"></i>{{ challenge.viewer_count || 0 }}
                          </span>
                        </div>

                        <!-- Statut WS (discret) -->
                        <div class="position-absolute top-0 end-0 m-3">
                          <span class="badge px-2 py-1" :style="{ background: wsStatusColor, fontSize: '.7rem' }">
                            {{ wsStatusLabel }}
                          </span>
                        </div>

                      </div>
                    </div>

                    <!-- Infos challenge -->
                    <div class="defi_card n11-bg rounded-8 p-4">
                      <h2 class="fw-bold mb-3 text-white">{{ challenge.game }} Challenge</h2>
                      <div class="d-flex align-items-center gap-3 mb-3 flex-wrap">
                        <div class="d-flex align-items-center gap-2">
                          <div class="rounded-circle d-flex align-items-center justify-content-center"
                            style="width:48px;height:48px;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);flex-shrink:0;">
                            <i class="fas fa-user text-white"></i>
                          </div>
                          <div>
                            <h5 class="mb-0 text-white">{{ challenge.creator?.username }}</h5>
                            <span class="text-white small" style="opacity:.8;">vs {{ challenge.opponent?.username ||
                              'Waiting' }}</span>
                          </div>
                        </div>
                        <div class="ms-auto">
                          <span class="badge bg-warning text-dark px-3 py-2">{{ challenge.bet_amount }} EBT</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- ── Chat ── -->
                  <div class="col-lg-4">
                    <div class="defi_card n11-bg rounded-8 p-4 d-flex flex-column" style="max-height:800px;">
                      <h5 class="fw-bold mb-4 text-white">
                        <i class="fas fa-comments me-2"></i>Chat
                      </h5>

                      <div class="chat_messages flex-grow-1 mb-3 overflow-auto" ref="chatContainer">
                        <div v-if="chatLoading && chatMessages.length === 0" class="text-center py-3">
                          <div class="spinner-border spinner-border-sm text-primary"></div>
                        </div>
                        <div v-else-if="chatMessages.length === 0" class="text-center py-5 text-white"
                          style="opacity:.7;">
                          <p>Aucun message pour le moment</p>
                        </div>
                        <div v-else>
                          <div v-for="msg in chatMessages" :key="msg.id" class="chat_message mb-3 p-2 rounded-3"
                            :class="{ 'own_message': msg.user_id === currentUserId }">
                            <div class="d-flex align-items-start gap-2">
                              <div class="rounded-circle d-flex align-items-center justify-content-center"
                                style="width:24px;height:24px;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);flex-shrink:0;">
                                <i class="fas fa-user text-white" style="font-size:.7rem;"></i>
                              </div>
                              <div class="flex-grow-1 overflow-hidden">
                                <div class="d-flex align-items-center gap-1 mb-1 flex-wrap">
                                  <span class="fw-bold text-white small">{{ msg.user?.username || 'User' }}</span>
                                  <span class="text-white ms-auto" style="opacity:.6;font-size:.75rem;">{{
                                    formatTime(msg.created_at) }}</span>
                                </div>
                                <p class="mb-0 text-white small" style="word-break:break-word;">{{ msg.message }}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div v-if="isAuthenticated" class="chat_input">
                        <div class="input-group">
                          <input v-model="newMessage" type="text"
                            class="form-control n11-bg text-white border-secondary" placeholder="Tapez votre message..."
                            @keyup.enter="sendMessage" :disabled="sendingMessage" maxlength="500" />
                          <button class="btn_primary px-3" @click="sendMessage"
                            :disabled="sendingMessage || !newMessage.trim()">
                            <i class="fas fa-paper-plane"></i>
                          </button>
                        </div>
                      </div>
                      <div v-else class="text-center py-3">
                        <p class="text-white small mb-2" style="opacity:.8;">Connectez-vous pour chatter</p>
                        <button class="btn_secondary" style="padding:.5rem 1rem;font-size:.85rem;"
                          @click="$router.push('/login')">
                          Se connecter
                        </button>
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
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import apiClient from '@/utils/axios';

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
interface ChatMessage {
  id: number; message: string; user_id: number;
  user: { id: number; username: string; };
  created_at: string;
}

const route = useRoute();
const router = useRouter();
const challengeId = route.params.id as string;

const challenge = ref<Challenge | null>(null);
const loading = ref(false);
const pageError = ref('');
const remoteVideo = ref<HTMLVideoElement | null>(null);
const connected = ref(false);
const waitingMsg = ref('Connexion au stream...');
const showRetry = ref(false);

const chatMessages = ref<ChatMessage[]>([]);
const chatLoading = ref(false);
const newMessage = ref('');
const sendingMessage = ref(false);
const currentUserId = ref<number | null>(null);
const chatContainer = ref<HTMLElement | null>(null);

const isAuthenticated = computed(() => !!localStorage.getItem('auth_token'));

// ── WebRTC ────────────────────────────────────────────────────────────────────
let ws: WebSocket | null = null;
let pc: RTCPeerConnection | null = null;
let retryTimer: ReturnType<typeof setTimeout> | null = null;
let wsReconnectTimer: ReturnType<typeof setTimeout> | null = null;
let streamEnded = false;

const wsStatus = ref<'disconnected' | 'connecting' | 'connected'>('disconnected');

const WS_BASE = (import.meta.env.VITE_STREAM_WS_URL || 'wss://ebetstream.com/ws').replace(/\/$/, '');
const ICE_SERVERS = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
];

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

const startRetryTimer = () => {
  showRetry.value = false;
  if (retryTimer) clearTimeout(retryTimer);
  retryTimer = setTimeout(() => {
    if (!connected.value) showRetry.value = true;
  }, 8000);
};

const connectWebRTC = () => {
  if (ws && ws.readyState === WebSocket.OPEN) return;

  streamEnded = false;
  wsStatus.value = 'connecting';
  const token = localStorage.getItem('auth_token') || '';
  const url = token
    ? `${WS_BASE}/watch/${challengeId}?token=${encodeURIComponent(token)}`
    : `${WS_BASE}/watch/${challengeId}`;

  ws = new WebSocket(url);

  ws.onopen = () => {
    wsStatus.value = 'connected';
    waitingMsg.value = 'Connecté — en attente du flux vidéo...';
    startRetryTimer();
  };

  ws.onmessage = async (evt) => {
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

      case 'chat-message':
        chatMessages.value.push({
          id: msg.ts,
          message: msg.text,
          user_id: msg.userId,
          user: { id: msg.userId, username: msg.username },
          created_at: new Date(msg.ts).toISOString(),
        });
        nextTick().then(scrollChat);
        break;

      case 'stream-ended':
        streamEnded = true;
        if (wsReconnectTimer) clearTimeout(wsReconnectTimer);
        connected.value = false;
        waitingMsg.value = 'Le stream est terminé.';
        showRetry.value = false;
        cleanupPeer();
        if (ws) { ws.onclose = null; ws.close(); ws = null; }
        wsStatus.value = 'disconnected';
        if (remoteVideo.value) remoteVideo.value.srcObject = null;
        // Recharger pour mettre à jour is_live
        await loadChallenge(false);
        break;
    }
  };

  ws.onerror = () => {
    wsStatus.value = 'disconnected';
    waitingMsg.value = 'Erreur de connexion WebSocket.';
  };

  ws.onclose = (evt) => {
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
      wsReconnectTimer = setTimeout(connectWebRTC, 3000);
    }
  };
};

const handleOffer = async (sdp: RTCSessionDescriptionInit) => {
  cleanupPeer();

  pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });

  pc.ontrack = (evt) => {
    if (remoteVideo.value && evt.streams[0]) {
      remoteVideo.value.srcObject = evt.streams[0];
      connected.value = true;
      showRetry.value = false;
      waitingMsg.value = '';
      if (retryTimer) clearTimeout(retryTimer);
    }
  };

  pc.onicecandidate = ({ candidate }) => {
    if (candidate && ws?.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'ice-candidate', candidate }));
    }
  };

  pc.oniceconnectionstatechange = () => {
    if (pc?.iceConnectionState === 'failed') pc.restartIce();
  };

  pc.onconnectionstatechange = () => {
    if (pc?.connectionState === 'disconnected' || pc?.connectionState === 'failed') {
      connected.value = false;
      waitingMsg.value = 'Connexion perdue — tentative de reconnexion...';
      startRetryTimer();
      if (ws?.readyState === WebSocket.OPEN) {
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
  if (remoteVideo.value) remoteVideo.value.srcObject = null;
  connected.value = false;
  wsStatus.value = 'disconnected';
};

const retryConnection = () => {
  showRetry.value = false;
  connected.value = false;
  waitingMsg.value = 'Reconnexion...';
  cleanupWebRTC();
  streamEnded = false;
  setTimeout(connectWebRTC, 500);
};

// ── API ───────────────────────────────────────────────────────────────────────
const loadChallenge = async (connectRtc = true) => {
  if (!challenge.value) loading.value = true;
  pageError.value = '';
  try {
    const res = await apiClient.get(`/challenges/${challengeId}/live`);
    if (res.data.success) {
      challenge.value = res.data.data.challenge;
      if (connectRtc && challenge.value?.is_live && (!ws || ws.readyState !== WebSocket.OPEN)) {
        connectWebRTC();
      }
      if (isAuthenticated.value && !currentUserId.value) checkCurrentUser();
    } else {
      pageError.value = res.data.message || 'Erreur chargement';
    }
  } catch (e: any) {
    pageError.value = e.response?.status === 404
      ? 'Challenge non trouvé ou pas en direct.'
      : 'Erreur lors du chargement.';
  } finally {
    loading.value = false;
  }
};

const checkCurrentUser = async () => {
  try {
    const res = await apiClient.get('/user');
    currentUserId.value = res.data.id;
  } catch { }
};

const loadChatMessages = async () => {
  if (!challenge.value) return;
  chatLoading.value = true;
  try {
    const res = await apiClient.get(`/challenges/${challenge.value.id}/messages`, { params: { limit: 50 } });
    if (res.data.success) {
      chatMessages.value = res.data.data.data || res.data.data || [];
      await nextTick();
      scrollChat();
    }
  } catch { } finally {
    chatLoading.value = false;
  }
};

const sendMessage = async () => {
  if (!newMessage.value.trim() || !challenge.value) return;
  sendingMessage.value = true;
  const text = newMessage.value.trim();
  newMessage.value = '';

  try {
    const res = await apiClient.post(`/challenges/${challenge.value.id}/messages`, { message: text });
    if (res.data.success) {
      chatMessages.value.push(res.data.data);
      await nextTick();
      scrollChat();
      // Diffuser via WebSocket
      if (ws?.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: 'chat-message',
          username: res.data.data.user?.username || 'User',
          text,
          ts: Date.now(),
        }));
      }
    }
  } catch (e: any) {
    newMessage.value = text;
    alert(e.response?.data?.message || 'Erreur envoi');
  } finally {
    sendingMessage.value = false;
  }
};

const scrollChat = () => {
  if (chatContainer.value) chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
};

const formatTime = (d: string) => {
  const diff = Date.now() - new Date(d).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'À l\'instant';
  if (m < 60) return `${m}min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
};

let chatTimer: ReturnType<typeof setInterval>;
let challengeTimer: ReturnType<typeof setInterval>;

onMounted(async () => {
  await loadChallenge();
  loadChatMessages();
  chatTimer = setInterval(loadChatMessages, 5000); // rafraîchissement périodique
  challengeTimer = setInterval(() => loadChallenge(false), 60000); // vérif état toutes les 60s
});

onBeforeUnmount(() => {
  clearInterval(chatTimer);
  clearInterval(challengeTimer);
  cleanupWebRTC();
});
</script>

<style scoped>
/* styles identiques à StreamWatch.vue, à copier si nécessaire */
.defis_section {
  width: 100%;
  background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%);
  color: white;
  position: relative;
  overflow: hidden;
  border-radius: 24px;
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

.defi_card {
  background: rgba(255, 255, 255, .1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
}

.chat_messages {
  max-height: 600px;
  min-height: 300px;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, .2) transparent;
}

.chat_messages::-webkit-scrollbar {
  width: 4px;
}

.chat_messages::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, .2);
  border-radius: 2px;
}

.chat_message {
  background: rgba(255, 255, 255, .05);
  transition: background .2s;
}

.own_message {
  background: rgba(255, 159, 0, .1);
}

.chat_input {
  border-top: 1px solid rgba(255, 255, 255, .1);
  padding-top: 1rem;
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
}
</style>