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
                      Configurez votre stream et partagez votre écran en direct avec vos spectateurs.
                    </p>
                  </div>
                </div>
              </div>

              <!-- Form -->
              <div class="row justify-content-center">
                <div class="col-lg-8">
                  <div class="defi_card n11-bg rounded-8 p-4 p-lg-6">

                    <!-- ── ÉTAPE 1 : Formulaire ── -->
                    <form v-if="!streamId" @submit.prevent="createStream">
                      <div class="mb-4">
                        <label class="text-white mb-2 d-block fw-bold">Titre du stream *</label>
                        <input v-model="form.title" type="text" class="form-control n11-bg text-white border-secondary"
                          placeholder="Ex: Session live eBetStream" required maxlength="255" />
                      </div>

                      <div class="mb-4">
                        <label class="text-white mb-2 d-block fw-bold">Description</label>
                        <textarea v-model="form.description" class="form-control n11-bg text-white border-secondary"
                          placeholder="Décrivez votre stream..." rows="4" maxlength="1000"></textarea>
                      </div>

                      <div class="mb-4">
                        <label class="text-white mb-2 d-block fw-bold">Catégorie</label>
                        <select v-model="form.category" class="form-control n11-bg text-white border-secondary">
                          <option value="">Sélectionner une catégorie</option>
                          <option value="Gaming">Gaming</option>
                          <option value="Esports">Esports</option>
                          <option value="Just Chatting">Just Chatting</option>
                          <option value="IRL">IRL</option>
                          <option value="Music">Music</option>
                          <option value="Creative">Creative</option>
                        </select>
                      </div>

                      <div class="mb-4">
                        <label class="text-white mb-2 d-block fw-bold">Jeu</label>
                        <input v-model="form.game" type="text" class="form-control n11-bg text-white border-secondary"
                          placeholder="Ex: FC Mobile 25, Call of Duty..." maxlength="100" />
                      </div>

                      <div class="mb-4">
                        <label class="text-white mb-2 d-block fw-bold">Miniature</label>
                        <input ref="thumbInput" type="file" accept="image/jpeg,image/png,image/jpg,image/webp"
                          class="form-control n11-bg text-white border-secondary" @change="onThumbChange" />
                        <small class="text-white d-block mt-2" style="opacity:.7;">
                          JPEG, PNG, WebP (max 5MB)
                        </small>
                        <img v-if="thumbPreview" :src="thumbPreview" class="img-thumbnail mt-3"
                          style="max-width:200px;max-height:200px;object-fit:cover;" />
                      </div>

                      <div v-if="error"
                        class="alert alert-danger mb-4 d-flex align-items-center justify-content-between">
                        <span><i class="fas fa-exclamation-circle me-2"></i>{{ error }}</span>
                        <button type="button" class="btn-close btn-close-white" @click="error = ''"></button>
                      </div>
                      <div v-if="successMsg"
                        class="alert alert-success mb-4 d-flex align-items-center justify-content-between">
                        <span>{{ successMsg }}</span>
                        <button type="button" class="btn-close btn-close-white" @click="successMsg = ''"></button>
                      </div>

                      <div class="d-flex gap-3">
                        <button type="submit" class="btn_primary flex-fill" :disabled="loading">
                          <span v-if="loading">Création...</span>
                          <span v-else><i class="fas fa-video me-2"></i>Créer le stream</span>
                        </button>
                        <button type="button" class="btn_secondary" @click="$router.push('/streams')">Annuler</button>
                      </div>
                    </form>

                    <!-- ── ÉTAPE 2 : Stream créé ── -->
                    <div v-else>
                      <h5 class="fw-bold mb-1 text-white">{{ form.title }}</h5>
                      <p class="text-white mb-4" style="opacity:.7;">
                        <span :class="isLive ? 'text-danger' : 'text-warning'">
                          <i class="fas fa-circle me-1" style="font-size:.6rem;"></i>
                          {{ isLive ? 'EN DIRECT' : 'En attente' }}
                        </span>
                      </p>

                      <!-- Lien spectateurs -->
                      <div class="alert alert-info mb-4">
                        <p class="mb-2 fw-bold"><i class="fas fa-link me-2"></i>Lien pour les spectateurs</p>
                        <div class="d-flex align-items-center gap-2">
                          <code class="d-block p-2 rounded bg-dark text-white flex-grow-1"
                            style="word-break:break-all;">
                            {{ viewerUrl }}
                          </code>
                          <button class="btn btn-sm btn-outline-light" @click="copy(viewerUrl)" title="Copier">
                            <i class="fas fa-copy"></i>
                          </button>
                        </div>
                      </div>

                      <!-- Preview vidéo (en live) -->
                      <div v-if="isLive" class="mb-4">
                        <video ref="localVideo" autoplay muted playsinline class="w-100 rounded"
                          style="max-height:400px;background:#000;"></video>
                        <p class="text-white mt-2 small" style="opacity:.7;">
                          <i class="fas fa-eye me-1"></i>{{ viewerCount }} spectateur(s)
                        </p>
                      </div>

                      <div v-if="error"
                        class="alert alert-danger mb-4 d-flex align-items-center justify-content-between">
                        <span><i class="fas fa-exclamation-circle me-2"></i>{{ error }}</span>
                        <button type="button" class="btn-close btn-close-white" @click="error = ''"></button>
                      </div>
                      <div v-if="successMsg"
                        class="alert alert-success mb-4 d-flex align-items-center justify-content-between">
                        <span>{{ successMsg }}</span>
                        <button type="button" class="btn-close btn-close-white" @click="successMsg = ''"></button>
                      </div>

                      <div class="d-flex gap-3 flex-wrap">
                        <button v-if="!isLive" class="btn_primary" @click="startStream" :disabled="starting">
                          <span v-if="starting">Démarrage...</span>
                          <span v-else><i class="fas fa-play me-2"></i>Partager mon écran</span>
                        </button>
                        <button v-else class="btn_primary" style="background:#ef4444;" @click="stopStream"
                          :disabled="stopping">
                          <span v-if="stopping">Arrêt...</span>
                          <span v-else><i class="fas fa-stop me-2"></i>Arrêter le stream</span>
                        </button>
                        <button v-if="!isLive" class="btn_secondary" @click="deleteStream">
                          <i class="fas fa-trash me-2"></i>Supprimer
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
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '@/utils/axios';

const router = useRouter();

const form = ref({ title: '', description: '', category: '', game: '' });
const thumbFile = ref<File | null>(null);
const thumbPreview = ref<string | null>(null);
const thumbInput = ref<HTMLInputElement | null>(null);
const localVideo = ref<HTMLVideoElement | null>(null);

const streamId = ref<number | null>(null);
const isLive = ref(false);
const viewerCount = ref(0);
const loading = ref(false);
const starting = ref(false);
const stopping = ref(false);
const error = ref('');
const successMsg = ref('');

let screenStream = ref<MediaStream | null>(null);
let peerConns = ref<Map<string, RTCPeerConnection>>(new Map());
let ws = ref<WebSocket | null>(null);

const viewerUrl = computed(() =>
  streamId.value ? `${window.location.origin}/streams/${streamId.value}/watch` : ''
);

const onThumbChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) { error.value = 'Image trop grande (max 5MB)'; return; }
  thumbFile.value = file;
  const reader = new FileReader();
  reader.onload = (ev) => { thumbPreview.value = ev.target?.result as string; };
  reader.readAsDataURL(file);
};

const createStream = async () => {
  loading.value = true; error.value = '';
  try {
    const fd = new FormData();
    fd.append('title', form.value.title);
    fd.append('description', form.value.description || '');
    fd.append('category', form.value.category || '');
    fd.append('game', form.value.game || '');
    if (thumbFile.value) fd.append('thumbnail', thumbFile.value);
    const res = await apiClient.post('/streams', fd);
    if (res.data.success) {
      streamId.value = res.data.data.id;
      successMsg.value = 'Stream créé ! Cliquez sur "Partager mon écran" pour démarrer.';
    } else { error.value = res.data.message || 'Erreur création'; }
  } catch (e: any) {
    error.value = e.response?.data?.message || 'Erreur lors de la création';
  } finally { loading.value = false; }
};

const startStream = async () => {
  starting.value = true; error.value = '';
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: { frameRate: { ideal: 30 }, width: { ideal: 1920 }, height: { ideal: 1080 } },
      audio: true,
    });
    screenStream.value = stream;
    if (localVideo.value) localVideo.value.srcObject = stream;
    await apiClient.post(`/streams/${streamId.value}/start`);
    connectSignaling(stream);
    stream.getVideoTracks()[0].addEventListener('ended', stopStream);
    isLive.value = true;
    successMsg.value = 'Stream démarré ! Partagez le lien aux spectateurs.';
  } catch (e: any) {
    error.value = e.name === 'NotAllowedError' ? 'Permission refusée.' : (e.response?.data?.message || 'Impossible de démarrer.');
    cleanup();
  } finally { starting.value = false; }
};

const connectSignaling = (stream: MediaStream) => {
  const token = localStorage.getItem('auth_token') || '';
  const WS_URL = import.meta.env.VITE_STREAM_WS_URL || 'ws://localhost:8082';
  const socket = new WebSocket(`${WS_URL}/stream/${streamId.value}?token=${encodeURIComponent(token)}`);
  ws.value = socket;

  socket.onmessage = async (evt) => {
    const msg = JSON.parse(evt.data);
    if (msg.type === 'viewer-joined') {
      const pc = createPeerConnection(msg.viewerId, stream, socket);
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket.send(JSON.stringify({ type: 'offer', viewerId: msg.viewerId, sdp: offer }));
      viewerCount.value = msg.count ?? viewerCount.value + 1;
    } else if (msg.type === 'answer') {
      const pc = peerConns.value.get(msg.viewerId);
      if (pc) await pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
    } else if (msg.type === 'ice-candidate') {
      const pc = peerConns.value.get(msg.viewerId);
      if (pc && msg.candidate) await pc.addIceCandidate(new RTCIceCandidate(msg.candidate));
    } else if (msg.type === 'viewer-left') {
      peerConns.value.get(msg.viewerId)?.close();
      peerConns.value.delete(msg.viewerId);
      viewerCount.value = msg.count ?? Math.max(0, viewerCount.value - 1);
    }
  };
  socket.onerror = () => { error.value = 'Erreur connexion serveur.'; };
  socket.onclose = () => { if (isLive.value) stopStream(); };
};

const createPeerConnection = (viewerId: string, stream: MediaStream, socket: WebSocket) => {
  const pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
  stream.getTracks().forEach(t => pc.addTrack(t, stream));
  pc.onicecandidate = ({ candidate }) => {
    if (candidate) socket.send(JSON.stringify({ type: 'ice-candidate', viewerId, candidate }));
  };
  peerConns.value.set(viewerId, pc);
  return pc;
};

const stopStream = async () => {
  stopping.value = true;
  try { await apiClient.post(`/streams/${streamId.value}/stop`); } catch { }
  cleanup();
  isLive.value = false; viewerCount.value = 0;
  successMsg.value = 'Stream arrêté.';
  stopping.value = false;
};

const deleteStream = async () => {
  if (!confirm('Supprimer ce stream ?')) return;
  try {
    await apiClient.delete(`/streams/${streamId.value}`);
    router.push('/streams');
  } catch { error.value = 'Erreur lors de la suppression.'; }
};

const cleanup = () => {
  screenStream.value?.getTracks().forEach(t => t.stop());
  screenStream.value = null;
  if (localVideo.value) localVideo.value.srcObject = null;
  peerConns.value.forEach(pc => pc.close()); peerConns.value.clear();
  ws.value?.close(); ws.value = null;
};

const copy = async (text: string) => {
  await navigator.clipboard.writeText(text);
  successMsg.value = 'Lien copié !';
  setTimeout(() => { successMsg.value = ''; }, 2000);
};

onMounted(async () => {
  if (!localStorage.getItem('auth_token')) { router.push('/login'); return; }
  try {
    const res = await apiClient.get('/stream-key');
    if (res.data.success && res.data.data?.stream_id) {
      streamId.value = res.data.data.stream_id;
      const detail = await apiClient.get(`/streams/${streamId.value}`);
      if (detail.data.success) {
        form.value.title = detail.data.data.title || '';
        form.value.description = detail.data.data.description || '';
        form.value.category = detail.data.data.category || '';
        form.value.game = detail.data.data.game || '';
        if (detail.data.data.thumbnail_url) thumbPreview.value = detail.data.data.thumbnail_url;
        successMsg.value = 'Votre stream existant a été chargé.';
      }
    }
  } catch { }
});

onBeforeUnmount(() => { if (isLive.value) stopStream(); });
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
}

.hero_badge {
  background: rgba(255, 159, 0, 0.2);
  color: #FF9F00;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
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
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
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