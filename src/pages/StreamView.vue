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
                  <!-- Colonne vidéo -->
                  <div class="col-lg-8">
                    <div class="defi_card n11-bg rounded-8 p-0 mb-4 overflow-hidden">
                      <div class="video_container position-relative" style="background:#000;aspect-ratio:16/9;">

                        <!-- WebRTC live -->
                        <video ref="remoteVideo" v-if="stream.is_live" autoplay playsinline controls class="w-100 h-100"
                          style="object-fit:contain;" :class="{ 'd-none': !connected }"></video>

                        <!-- Overlay attente WebRTC -->
                        <div v-if="stream.is_live && !connected"
                          class="w-100 h-100 d-flex align-items-center justify-content-center position-absolute top-0 start-0">
                          <div class="text-center text-white">
                            <div class="spinner-border text-warning mb-3" role="status"></div>
                            <p class="mb-0">{{ waitingMsg }}</p>
                          </div>
                        </div>

                        <!-- Offline -->
                        <div v-if="!stream.is_live"
                          class="w-100 h-100 d-flex align-items-center justify-content-center">
                          <div class="text-center text-white">
                            <i class="fas fa-video-slash fs-1 mb-3" style="opacity:.5;"></i>
                            <p class="mb-0">Stream offline</p>
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
                      <div class="d-flex align-items-center gap-3 mb-3">
                        <div class="avatar_small rounded-circle d-flex align-items-center justify-content-center"
                          style="width:48px;height:48px;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);">
                          <i class="fas fa-user text-white"></i>
                        </div>
                        <div>
                          <h5 class="mb-0 text-white">{{ stream.user?.username || 'User' }}</h5>
                          <span class="text-white small" style="opacity:.8;">{{ stream.follower_count }}
                            followers</span>
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

                  <!-- Chat -->
                  <div class="col-lg-4">
                    <div class="defi_card n11-bg rounded-8 p-4 h-100 d-flex flex-column" style="max-height:800px;">
                      <h5 class="fw-bold mb-4 text-white">
                        <i class="fas fa-comments me-2"></i>Chat
                      </h5>

                      <div class="chat_messages flex-grow-1 mb-3 overflow-auto" ref="chatContainer">
                        <div v-if="chatLoading" class="text-center py-3">
                          <div class="spinner-border spinner-border-sm text-primary"></div>
                        </div>
                        <div v-else-if="chatMessages.length === 0" class="text-center py-5 text-white"
                          style="opacity:.7;">
                          <p>Aucun message pour le moment</p>
                        </div>
                        <div v-else>
                          <div v-for="message in chatMessages" :key="message.id" class="chat_message mb-3 p-2 rounded-3"
                            :class="{ 'n11-bg': message.user_id === currentUserId }">
                            <div class="d-flex align-items-start gap-2">
                              <div class="rounded-circle d-flex align-items-center justify-content-center"
                                style="width:24px;height:24px;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);flex-shrink:0;">
                                <i class="fas fa-user text-white" style="font-size:.7rem;"></i>
                              </div>
                              <div class="flex-grow-1">
                                <div class="d-flex align-items-center gap-2 mb-1">
                                  <span class="fw-bold text-white small">{{ message.user?.username || 'User' }}</span>
                                  <span v-if="message.is_moderator" class="badge bg-success"
                                    style="font-size:.65rem;">MOD</span>
                                  <span v-if="message.is_subscriber" class="badge bg-warning"
                                    style="font-size:.65rem;">SUB</span>
                                  <span class="text-white small" style="opacity:.6;font-size:.75rem;">{{
                                    formatTime(message.created_at) }}</span>
                                </div>
                                <p class="mb-0 text-white small">{{ message.message }}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div v-if="isAuthenticated" class="chat_input">
                        <div class="input-group">
                          <input v-model="newMessage" type="text"
                            class="form-control n11-bg text-white border-secondary" placeholder="Tapez votre message..."
                            @keyup.enter="sendMessage" :disabled="sendingMessage" />
                          <button class="btn_primary" @click="sendMessage"
                            :disabled="sendingMessage || !newMessage.trim()">
                            <i class="fas fa-paper-plane"></i>
                          </button>
                        </div>
                      </div>
                      <div v-else class="text-center py-3">
                        <p class="text-white small mb-2" style="opacity:.8;">Connectez-vous pour chatter</p>
                        <button class="btn_secondary btn-sm" @click="$router.push('/login')">Se connecter</button>
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

const route = useRoute();
const router = useRouter();
const streamId = route.params.id as string;

const stream = ref<Stream | null>(null);
const loading = ref(false);
const pageError = ref('');
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
const remoteVideo = ref<HTMLVideoElement | null>(null);

const isAuthenticated = computed(() => !!localStorage.getItem('auth_token'));

// ── WebRTC viewer ─────────────────────────────────────────────────────────────
let ws: WebSocket | null = null;
let pc: RTCPeerConnection | null = null;

const connectWebRTC = () => {
  const token = localStorage.getItem('auth_token') || '';
  const WS_URL = import.meta.env.VITE_STREAM_WS_URL || 'ws://localhost:8082';
  ws = new WebSocket(`${WS_URL}/watch/${streamId}?token=${encodeURIComponent(token)}`);

  ws.onmessage = async (evt) => {
    const msg = JSON.parse(evt.data);
    if (msg.type === 'waiting') { waitingMsg.value = "En attente du streamer..."; }
    else if (msg.type === 'offer') { await handleOffer(msg.sdp); }
    else if (msg.type === 'ice-candidate') {
      if (pc && msg.candidate) await pc.addIceCandidate(new RTCIceCandidate(msg.candidate));
    }
    else if (msg.type === 'stream-ended') { connected.value = false; cleanupWebRTC(); }
  };
  ws.onerror = () => { waitingMsg.value = 'Impossible de rejoindre le stream.'; };
  ws.onclose = () => { if (connected.value) connected.value = false; };
};

const handleOffer = async (sdp: RTCSessionDescriptionInit) => {
  pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
  pc.ontrack = (evt) => {
    if (remoteVideo.value && evt.streams[0]) {
      remoteVideo.value.srcObject = evt.streams[0];
      connected.value = true;
    }
  };
  pc.onicecandidate = ({ candidate }) => {
    if (candidate && ws?.readyState === WebSocket.OPEN)
      ws.send(JSON.stringify({ type: 'ice-candidate', candidate }));
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

// ── Stream / Chat ─────────────────────────────────────────────────────────────
const loadStream = async () => {
  loading.value = true; pageError.value = '';
  try {
    const res = await apiClient.get(`/streams/${streamId}`);
    if (res.data.success) {
      stream.value = res.data.data;
      if (stream.value?.is_live) connectWebRTC();
      if (isAuthenticated.value) checkFollowing();
    }
  } catch (e: any) {
    pageError.value = e.response?.status === 404 ? 'Stream non trouvé' : 'Erreur chargement';
  } finally { loading.value = false; }
};

const loadChatMessages = async () => {
  if (!stream.value) return;
  chatLoading.value = true;
  try {
    const res = await apiClient.get(`/streams/${stream.value.id}/chat`, { params: { limit: 50 } });
    if (res.data.success) { chatMessages.value = res.data.data; await nextTick(); scrollChat(); }
  } catch { } finally { chatLoading.value = false; }
};

const sendMessage = async () => {
  if (!newMessage.value.trim() || !stream.value) return;
  sendingMessage.value = true;
  try {
    const res = await apiClient.post(`/streams/${stream.value.id}/chat`, { message: newMessage.value });
    if (res.data.success) { newMessage.value = ''; await loadChatMessages(); }
  } catch (e: any) { alert(e.response?.data?.message || 'Erreur envoi'); }
  finally { sendingMessage.value = false; }
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
  } catch { } finally { followingLoading.value = false; }
};

const checkFollowing = async () => { isFollowing.value = false; };

const scrollChat = () => { if (chatContainer.value) chatContainer.value.scrollTop = chatContainer.value.scrollHeight; };

const formatTime = (d: string) => {
  const diff = Date.now() - new Date(d).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'Just now';
  if (m < 60) return `${m}min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
};

let chatTimer: ReturnType<typeof setInterval>;
let streamTimer: ReturnType<typeof setInterval>;

onMounted(async () => {
  try {
    const res = await apiClient.get('/user');
    currentUserId.value = res.data.id;
  } catch { }
  await loadStream();
  loadChatMessages();
  chatTimer = setInterval(loadChatMessages, 3000);
  streamTimer = setInterval(loadStream, 10000);
});

onBeforeUnmount(() => {
  clearInterval(chatTimer); clearInterval(streamTimer);
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
  opacity: .5;
  cursor: not-allowed;
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
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.chat_messages {
  max-height: 600px;
  min-height: 400px;
}

.chat_message {
  transition: background 0.2s;
}

.chat_input {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 1rem;
}

.form-control {
  color: white;
}

.form-control::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.form-control:focus {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: #FF9F00;
  color: white;
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

.page-content-with-space {
  padding-top: 90px;
}

@media (max-width: 768px) {
  .page-content-with-space {
    padding-top: 60px;
  }

  .container-fluid {
    margin-left: 0 !important;
  }

  .defis__main {
    margin-left: 0 !important;
  }
}
</style>