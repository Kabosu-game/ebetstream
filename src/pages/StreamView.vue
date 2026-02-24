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
                <button class="btn_primary mt-3" @click="$router.push('/streams')">
                  <i class="fas fa-arrow-left me-2"></i>Back to Streams
                </button>
              </div>

              <!-- Contenu -->
              <div v-else-if="stream">
                <button class="btn_secondary mb-4" @click="$router.push('/streams')">
                  <i class="fas fa-arrow-left me-2"></i>Back
                </button>

                <div class="row g-4">

                  <!-- ── Colonne vidéo ── -->
                  <div class="col-lg-8">
                    <div class="defi_card n11-bg rounded-8 p-0 mb-4 overflow-hidden">
                      <div class="video_container position-relative" style="background:#000;aspect-ratio:16/9;">

                        <!-- Vidéo WebRTC -->
                        <video ref="remoteVideo" v-show="stream.is_live && connected" autoplay playsinline controls
                          class="w-100 h-100" style="object-fit:contain;"></video>

                        <!-- Attente connexion WebRTC -->
                        <div v-if="stream.is_live && !connected"
                          class="w-100 h-100 d-flex align-items-center justify-content-center position-absolute top-0 start-0">
                          <div class="text-center text-white">
                            <div class="spinner-border text-warning mb-3" role="status"></div>
                            <p class="mb-0">{{ waitingMsg }}</p>
                          </div>
                        </div>

                        <!-- Stream offline -->
                        <div v-if="!stream.is_live"
                          class="w-100 h-100 d-flex align-items-center justify-content-center position-absolute top-0 start-0">
                          <div class="text-center text-white">
                            <i class="fas fa-video-slash fs-1 mb-3" style="opacity:.5;"></i>
                            <p class="mb-0">Stream offline</p>
                            <small style="opacity:.6;">Revenez quand le streamer est en direct.</small>
                          </div>
                        </div>

                        <!-- Badge LIVE -->
                        <div v-if="stream.is_live" class="position-absolute top-0 start-0 m-3">
                          <span class="badge bg-danger px-3 py-2">
                            <i class="fas fa-circle me-1" style="font-size:.6rem;animation:pulse 2s infinite;"></i>LIVE
                          </span>
                        </div>

                        <!-- Viewers -->
                        <div v-if="stream.is_live && connected" class="position-absolute bottom-0 end-0 m-3">
                          <span class="badge bg-dark px-2 py-1">
                            <i class="fas fa-eye me-1"></i>{{ stream.viewer_count || 0 }}
                          </span>
                        </div>

                      </div>
                    </div>

                    <!-- Infos stream -->
                    <div class="defi_card n11-bg rounded-8 p-4">
                      <h2 class="fw-bold mb-3 text-white">{{ stream.title || 'Sans titre' }}</h2>
                      <div class="d-flex align-items-center gap-3 mb-3 flex-wrap">
                        <div class="d-flex align-items-center gap-2">
                          <div class="rounded-circle d-flex align-items-center justify-content-center"
                            style="width:48px;height:48px;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);flex-shrink:0;">
                            <i class="fas fa-user text-white"></i>
                          </div>
                          <div>
                            <h5 class="mb-0 text-white">{{ stream.user?.username || 'User' }}</h5>
                            <span class="text-white small" style="opacity:.8;">
                              {{ stream.follower_count }} follower{{ stream.follower_count !== 1 ? 's' : '' }}
                            </span>
                          </div>
                        </div>
                        <div class="ms-auto">
                          <button v-if="isAuthenticated" class="btn_primary" @click="toggleFollow"
                            :disabled="followingLoading">
                            <span v-if="followingLoading">...</span>
                            <span v-else>
                              <i :class="(isFollowing ? 'fas' : 'far') + ' fa-heart me-2'"></i>
                              {{ isFollowing ? 'Ne plus suivre' : 'Suivre' }}
                            </span>
                          </button>
                        </div>
                      </div>
                      <div class="mb-3">
                        <span v-if="stream.category" class="badge bg-secondary me-2">{{ stream.category }}</span>
                        <span v-if="stream.game" class="badge bg-info">{{ stream.game }}</span>
                      </div>
                      <p class="text-white" style="opacity:.9;">{{ stream.description || 'Aucune description' }}</p>
                    </div>
                  </div>

                  <!-- ── Chat ── -->
                  <div class="col-lg-4">
                    <div class="defi_card n11-bg rounded-8 p-4 d-flex flex-column" style="max-height:800px;">
                      <h5 class="fw-bold mb-4 text-white">
                        <i class="fas fa-comments me-2"></i>Chat
                      </h5>

                      <!-- Messages -->
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
                                  <span v-if="msg.is_moderator" class="badge bg-success"
                                    style="font-size:.65rem;">MOD</span>
                                  <span v-if="msg.is_subscriber" class="badge bg-warning"
                                    style="font-size:.65rem;">SUB</span>
                                  <span class="text-white ms-auto" style="opacity:.6;font-size:.75rem;">{{
                                    formatTime(msg.created_at) }}</span>
                                </div>
                                <p class="mb-0 text-white small" style="word-break:break-word;">{{ msg.message }}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Input chat -->
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

// ── Types ─────────────────────────────────────────────────────────────────────
interface Stream {
  id: number; title: string; description: string; thumbnail_url?: string;
  category?: string; game?: string; is_live: boolean;
  viewer_count: number; follower_count: number;
  user: { id: number; username: string; };
}
interface ChatMessage {
  id: number; message: string; user_id: number;
  user: { id: number; username: string; };
  is_moderator: boolean; is_subscriber: boolean; created_at: string;
}

// ── State ─────────────────────────────────────────────────────────────────────
const route = useRoute();
const router = useRouter();
const streamId = route.params.id as string;

const stream = ref<Stream | null>(null);
const loading = ref(false);
const pageError = ref('');

const remoteVideo = ref<HTMLVideoElement | null>(null);
const connected = ref(false);
const waitingMsg = ref('Connexion au stream...');

const chatMessages = ref<ChatMessage[]>([]);
const chatLoading = ref(false);
const newMessage = ref('');
const sendingMessage = ref(false);
const isFollowing = ref(false);
const followingLoading = ref(false);
const currentUserId = ref<number | null>(null);
const chatContainer = ref<HTMLElement | null>(null);

const isAuthenticated = computed(() => !!localStorage.getItem('auth_token'));

// ── WebRTC viewer ─────────────────────────────────────────────────────────────
let ws: WebSocket | null = null;
let pc: RTCPeerConnection | null = null;

/**
 * IMPORTANT — l'URL doit pointer sur le proxy Nginx :
 *   wss://ebetstream.com/ws  →  Nginx strip /ws/  →  ws://127.0.0.1:8082
 * Donc Node.js reçoit bien  /watch/{id}?token=...
 *
 * Dans .env du frontend :  VITE_STREAM_WS_URL=wss://ebetstream.com/ws
 */
const WS_BASE = (import.meta.env.VITE_STREAM_WS_URL || 'wss://ebetstream.com/ws').replace(/\/$/, '');
const ICE_SERVERS = [{ urls: 'stun:stun.l.google.com:19302' }];

const connectWebRTC = () => {
  const token = localStorage.getItem('auth_token') || '';
  const url = `${WS_BASE}/watch/${streamId}?token=${encodeURIComponent(token)}`;
  ws = new WebSocket(url);

  ws.onopen = () => { waitingMsg.value = 'Connecté — en attente du streamer...'; };

  ws.onmessage = async (evt) => {
    let msg: any;
    try { msg = JSON.parse(evt.data); } catch { return; }

    switch (msg.type) {
      case 'waiting':
        waitingMsg.value = msg.message || 'En attente du streamer...';
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
        connected.value = false;
        waitingMsg.value = 'Le stream est terminé.';
        cleanupWebRTC();
        // Recharger les infos stream pour mettre is_live à false
        await loadStream(false);
        break;
    }
  };

  ws.onerror = () => { waitingMsg.value = 'Impossible de rejoindre le stream.'; };
  ws.onclose = () => { if (!connected.value) waitingMsg.value = 'Connexion fermée.'; };
};

const handleOffer = async (sdp: RTCSessionDescriptionInit) => {
  pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });

  pc.ontrack = (evt) => {
    if (remoteVideo.value && evt.streams[0]) {
      remoteVideo.value.srcObject = evt.streams[0];
      connected.value = true;
    }
  };

  pc.onicecandidate = ({ candidate }) => {
    if (candidate && ws?.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'ice-candidate', candidate }));
    }
  };

  pc.onconnectionstatechange = () => {
    if (pc?.connectionState === 'disconnected' || pc?.connectionState === 'failed') {
      connected.value = false;
      waitingMsg.value = 'Connexion perdue. Reconnexion...';
    }
  };

  await pc.setRemoteDescription(new RTCSessionDescription(sdp));
  const answer = await pc.createAnswer();
  await pc.setLocalDescription(answer);
  ws?.send(JSON.stringify({ type: 'answer', sdp: answer }));
};

const cleanupWebRTC = () => {
  pc?.close(); pc = null;
  ws?.close(); ws = null;
  if (remoteVideo.value) remoteVideo.value.srcObject = null;
};

// ── API ───────────────────────────────────────────────────────────────────────
const loadStream = async (connectRtc = true) => {
  if (!stream.value) loading.value = true;
  pageError.value = '';
  try {
    const res = await apiClient.get(`/streams/${streamId}`);
    if (res.data.success) {
      stream.value = res.data.data;
      if (connectRtc && stream.value?.is_live && !ws) {
        connectWebRTC();
      }
      if (isAuthenticated.value && !currentUserId.value) {
        checkCurrentUser();
      }
    }
  } catch (e: any) {
    pageError.value = e.response?.status === 404 ? 'Stream introuvable.' : 'Erreur lors du chargement.';
  } finally {
    loading.value = false;
  }
};

const checkCurrentUser = async () => {
  try {
    const res = await apiClient.get('/user');
    currentUserId.value = res.data.id;
    // Vérifier si l'utilisateur suit le stream
    // (nécessiterait un endpoint dédié ; pour l'instant on laisse false)
  } catch { }
};

const loadChatMessages = async () => {
  if (!stream.value) return;
  chatLoading.value = true;
  try {
    const res = await apiClient.get(`/streams/${stream.value.id}/chat`, { params: { limit: 50 } });
    if (res.data.success) {
      chatMessages.value = res.data.data;
      await nextTick();
      scrollChat();
    }
  } catch { } finally {
    chatLoading.value = false;
  }
};

const sendMessage = async () => {
  if (!newMessage.value.trim() || !stream.value) return;
  sendingMessage.value = true;
  try {
    const res = await apiClient.post(`/streams/${stream.value.id}/chat`, { message: newMessage.value.trim() });
    if (res.data.success) {
      newMessage.value = '';
      // Ajouter directement le message sans recharger
      chatMessages.value.push(res.data.data);
      await nextTick();
      scrollChat();
    }
  } catch (e: any) {
    alert(e.response?.data?.message || 'Erreur envoi');
  } finally {
    sendingMessage.value = false;
  }
};

const toggleFollow = async () => {
  if (!stream.value) return;
  followingLoading.value = true;
  try {
    const res = await apiClient.post(`/streams/${stream.value.id}/follow`, {});
    if (res.data.success) {
      isFollowing.value = res.data.data.is_following;
      stream.value.follower_count = res.data.data.follower_count;
    }
  } catch { } finally {
    followingLoading.value = false;
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

// ── Timers ────────────────────────────────────────────────────────────────────
let chatTimer: ReturnType<typeof setInterval>;
let streamTimer: ReturnType<typeof setInterval>;

onMounted(async () => {
  await loadStream();
  loadChatMessages();
  // Refresh chat toutes les 3s, infos stream toutes les 15s
  chatTimer = setInterval(loadChatMessages, 3000);
  streamTimer = setInterval(() => loadStream(false), 15000);
});

onBeforeUnmount(() => {
  clearInterval(chatTimer);
  clearInterval(streamTimer);
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

@media (max-width:768px) {
  .page-content-with-space {
    padding-top: 60px;
  }
}
</style>