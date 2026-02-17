<template>
  <div class="page-content-with-space">
    <section class="stream-section">
      <div class="container-fluid">

        <!-- Back -->
        <button class="btn-back" @click="$router.push('/streams')">
          <i class="fas fa-arrow-left"></i> Retour
        </button>

        <!-- ══════════════════════════════════════════════
             ÉTAPE 1 — Formulaire (avant création)
        ══════════════════════════════════════════════ -->
        <div v-if="!streamId" class="stream-card">
          <h2 class="stream-title">
            <i class="fas fa-video me-2"></i>
            Nouveau Stream
          </h2>
          <p class="stream-sub">Configurez votre stream puis partagez votre écran en direct.</p>

          <form @submit.prevent="createStream" class="stream-form">
            <!-- Titre -->
            <div class="field">
              <label>Titre du stream *</label>
              <input v-model="form.title" type="text" placeholder="Ex: Session de travail live" required
                maxlength="255" />
            </div>

            <!-- Description -->
            <div class="field">
              <label>Description</label>
              <textarea v-model="form.description" placeholder="Décrivez votre stream..." rows="3" maxlength="500" />
            </div>

            <!-- Miniature -->
            <div class="field">
              <label>Miniature (optionnel)</label>
              <input ref="thumbInput" type="file" accept="image/jpeg,image/png,image/webp" @change="onThumbChange" />
              <img v-if="thumbPreview" :src="thumbPreview" class="thumb-preview" />
            </div>

            <!-- Erreur -->
            <div v-if="error" class="alert-error">
              <i class="fas fa-exclamation-circle me-2"></i>{{ error }}
            </div>

            <button type="submit" class="btn-primary" :disabled="loading">
              <span v-if="loading"><i class="fas fa-spinner fa-spin me-2"></i>Création...</span>
              <span v-else><i class="fas fa-plus me-2"></i>Créer le stream</span>
            </button>
          </form>
        </div>

        <!-- ══════════════════════════════════════════════
             ÉTAPE 2 — Stream créé, prêt à diffuser
        ══════════════════════════════════════════════ -->
        <div v-else class="stream-card">
          <div class="stream-header">
            <div>
              <h2 class="stream-title">{{ form.title }}</h2>
              <span :class="['status-badge', isLive ? 'live' : 'idle']">
                {{ isLive ? '🔴 EN DIRECT' : '⏸ En attente' }}
              </span>
            </div>
          </div>

          <!-- Lien spectateurs -->
          <div class="info-box">
            <p class="info-label"><i class="fas fa-link me-2"></i>Lien pour les spectateurs</p>
            <div class="copy-row">
              <code>{{ viewerUrl }}</code>
              <button class="btn-copy" @click="copy(viewerUrl)">
                <i class="fas fa-copy"></i>
              </button>
            </div>
          </div>

          <!-- Preview vidéo (quand en live) -->
          <div v-if="isLive" class="video-wrapper">
            <video ref="localVideo" autoplay muted playsinline class="local-video" />
            <div class="viewer-count">
              <i class="fas fa-eye me-1"></i>{{ viewerCount }} spectateur(s)
            </div>
          </div>

          <!-- Alertes -->
          <div v-if="error" class="alert-error">
            <i class="fas fa-exclamation-circle me-2"></i>{{ error }}
          </div>
          <div v-if="successMsg" class="alert-success">
            <i class="fas fa-check-circle me-2"></i>{{ successMsg }}
          </div>

          <!-- Actions -->
          <div class="actions">
            <!-- Pas encore en live -->
            <button v-if="!isLive" class="btn-primary" @click="startStream" :disabled="starting">
              <span v-if="starting"><i class="fas fa-spinner fa-spin me-2"></i>Démarrage...</span>
              <span v-else><i class="fas fa-play me-2"></i>Partager mon écran</span>
            </button>

            <!-- En live -->
            <button v-else class="btn-danger" @click="stopStream" :disabled="stopping">
              <span v-if="stopping"><i class="fas fa-spinner fa-spin me-2"></i>Arrêt...</span>
              <span v-else><i class="fas fa-stop me-2"></i>Arrêter le stream</span>
            </button>

            <!-- Supprimer le stream -->
            <button v-if="!isLive" class="btn-secondary" @click="deleteStream">
              <i class="fas fa-trash me-2"></i>Supprimer
            </button>
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

// ── Router ──────────────────────────────────────────────────────────────────
const router = useRouter();

// ── Form ────────────────────────────────────────────────────────────────────
const form = ref({ title: '', description: '' });
const thumbFile = ref<File | null>(null);
const thumbPreview = ref<string | null>(null);
const thumbInput = ref<HTMLInputElement | null>(null);

// ── Stream state ────────────────────────────────────────────────────────────
const streamId = ref<number | null>(null);
const isLive = ref(false);
const viewerCount = ref(0);

// ── UI ───────────────────────────────────────────────────────────────────────
const loading = ref(false);
const starting = ref(false);
const stopping = ref(false);
const error = ref('');
const successMsg = ref('');

// ── Media refs ───────────────────────────────────────────────────────────────
const localVideo = ref<HTMLVideoElement | null>(null);
const screenStream = ref<MediaStream | null>(null);
const peerConns = ref<Map<string, RTCPeerConnection>>(new Map());
const ws = ref<WebSocket | null>(null);

// ── Computed ─────────────────────────────────────────────────────────────────
const viewerUrl = computed(() =>
  streamId.value
    ? `${window.location.origin}/streams/${streamId.value}/watch`
    : ''
);

// ── Thumbnail ─────────────────────────────────────────────────────────────────
const onThumbChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) { error.value = 'Image trop grande (max 5MB)'; return; }
  thumbFile.value = file;
  const reader = new FileReader();
  reader.onload = (ev) => { thumbPreview.value = ev.target?.result as string; };
  reader.readAsDataURL(file);
};

// ── Créer le stream ───────────────────────────────────────────────────────────
const createStream = async () => {
  loading.value = true;
  error.value = '';
  try {
    const fd = new FormData();
    fd.append('title', form.value.title);
    fd.append('description', form.value.description || '');
    if (thumbFile.value) fd.append('thumbnail', thumbFile.value);

    const res = await apiClient.post('/streams', fd);
    if (res.data.success) {
      streamId.value = res.data.data.id;
      successMsg.value = 'Stream créé ! Cliquez sur "Partager mon écran" pour démarrer.';
    } else {
      error.value = res.data.message || 'Erreur création';
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Erreur lors de la création';
  } finally {
    loading.value = false;
  }
};

// ── Démarrer (partage écran + WebRTC) ─────────────────────────────────────────
const startStream = async () => {
  starting.value = true;
  error.value = '';
  try {
    // 1. Capture écran
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: { frameRate: { ideal: 30 }, width: { ideal: 1920 }, height: { ideal: 1080 } },
      audio: true,
    });
    screenStream.value = stream;

    // 2. Affiche en local
    if (localVideo.value) localVideo.value.srcObject = stream;

    // 3. Notifie le backend
    await apiClient.post(`/streams/${streamId.value}/start`);

    // 4. Connexion WebSocket (signaling)
    connectSignaling(stream);

    // 5. Si l'user arrête le partage depuis le navigateur
    stream.getVideoTracks()[0].addEventListener('ended', stopStream);

    isLive.value = true;
    successMsg.value = 'Stream démarré ! Partagez le lien aux spectateurs.';
  } catch (err: any) {
    if (err.name === 'NotAllowedError') {
      error.value = 'Permission de partage refusée.';
    } else {
      error.value = err.response?.data?.message || 'Impossible de démarrer.';
    }
    cleanupMedia();
  } finally {
    starting.value = false;
  }
};

// ── Signaling WebSocket ───────────────────────────────────────────────────────
const connectSignaling = (stream: MediaStream) => {
  const token = localStorage.getItem('auth_token') || '';
  const WS_URL = import.meta.env.VITE_STREAM_WS_URL || 'ws://localhost:8082';
  const socket = new WebSocket(`${WS_URL}/stream/${streamId.value}?token=${encodeURIComponent(token)}`);
  ws.value = socket;

  socket.onmessage = async (evt) => {
    const msg = JSON.parse(evt.data);

    switch (msg.type) {
      // Un nouveau spectateur arrive
      case 'viewer-joined': {
        const pc = createPeerConnection(msg.viewerId, stream, socket);
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.send(JSON.stringify({ type: 'offer', viewerId: msg.viewerId, sdp: offer }));
        viewerCount.value = msg.count ?? viewerCount.value + 1;
        break;
      }
      // Réponse du spectateur
      case 'answer': {
        const pc = peerConns.value.get(msg.viewerId);
        if (pc) await pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
        break;
      }
      // ICE candidate du spectateur
      case 'ice-candidate': {
        const pc = peerConns.value.get(msg.viewerId);
        if (pc && msg.candidate) await pc.addIceCandidate(new RTCIceCandidate(msg.candidate));
        break;
      }
      // Spectateur parti
      case 'viewer-left': {
        peerConns.value.get(msg.viewerId)?.close();
        peerConns.value.delete(msg.viewerId);
        viewerCount.value = msg.count ?? Math.max(0, viewerCount.value - 1);
        break;
      }
    }
  };

  socket.onerror = () => { error.value = 'Erreur connexion serveur de streaming.'; };
  socket.onclose = () => { if (isLive.value) stopStream(); };
};

// ── Crée un RTCPeerConnection par spectateur ──────────────────────────────────
const createPeerConnection = (
  viewerId: string,
  stream: MediaStream,
  socket: WebSocket
): RTCPeerConnection => {
  const pc = new RTCPeerConnection({
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
  });

  // Ajoute les tracks de l'écran
  stream.getTracks().forEach((track) => pc.addTrack(track, stream));

  // Envoie les ICE candidates au spectateur
  pc.onicecandidate = ({ candidate }) => {
    if (candidate) {
      socket.send(JSON.stringify({ type: 'ice-candidate', viewerId, candidate }));
    }
  };

  peerConns.value.set(viewerId, pc);
  return pc;
};

// ── Arrêter le stream ─────────────────────────────────────────────────────────
const stopStream = async () => {
  stopping.value = true;
  try {
    await apiClient.post(`/streams/${streamId.value}/stop`);
  } catch { /* silencieux */ }

  cleanupMedia();
  isLive.value = false;
  viewerCount.value = 0;
  successMsg.value = 'Stream arrêté.';
  stopping.value = false;
};

// ── Supprimer le stream ───────────────────────────────────────────────────────
const deleteStream = async () => {
  if (!confirm('Supprimer ce stream ?')) return;
  try {
    await apiClient.delete(`/streams/${streamId.value}`);
    router.push('/streams');
  } catch {
    error.value = 'Erreur lors de la suppression.';
  }
};

// ── Cleanup ───────────────────────────────────────────────────────────────────
const cleanupMedia = () => {
  screenStream.value?.getTracks().forEach((t) => t.stop());
  screenStream.value = null;
  if (localVideo.value) localVideo.value.srcObject = null;
  peerConns.value.forEach((pc) => pc.close());
  peerConns.value.clear();
  ws.value?.close();
  ws.value = null;
};

// ── Copier dans le presse-papier ──────────────────────────────────────────────
const copy = async (text: string) => {
  await navigator.clipboard.writeText(text);
  successMsg.value = 'Lien copié !';
  setTimeout(() => { successMsg.value = ''; }, 2000);
};

// ── Lifecycle ─────────────────────────────────────────────────────────────────
onMounted(async () => {
  // Charge un stream existant si l'user en a un
  try {
    const res = await apiClient.get('/stream-key');
    if (res.data.success && res.data.data?.stream_id) {
      streamId.value = res.data.data.stream_id;
      form.value.title = res.data.data.title || '';
      form.value.description = res.data.data.description || '';
    }
  } catch { /* pas de stream existant, ok */ }
});

onBeforeUnmount(() => {
  if (isLive.value) stopStream();
});
</script>

<style scoped>
/* ── Layout ────────────────────────────────────────────────────────────────── */
.page-content-with-space {
  padding-top: 90px;
}

.stream-section {
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%);
  padding: 2rem 0 4rem;
}

/* ── Card ─────────────────────────────────────────────────────────────────── */
.stream-card {
  max-width: 720px;
  margin: 2rem auto;
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2.5rem;
}

.stream-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.stream-title {
  font-size: 1.8rem;
  font-weight: 800;
  color: #fff;
  margin-bottom: 0.5rem;
}

.stream-sub {
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 2rem;
}

/* ── Badge statut ──────────────────────────────────────────────────────────── */
.status-badge {
  display: inline-block;
  padding: 0.35rem 0.9rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.05em;
}

.status-badge.live {
  background: rgba(239, 68, 68, 0.2);
  color: #f87171;
}

.status-badge.idle {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.5);
}

/* ── Formulaire ────────────────────────────────────────────────────────────── */
.stream-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field label {
  color: rgba(255, 255, 255, 0.85);
  font-weight: 600;
  font-size: 0.9rem;
}

.field input,
.field textarea,
.field select {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  color: #fff;
  padding: 0.75rem 1rem;
  font-size: 0.95rem;
  transition: border-color 0.2s;
}

.field input:focus,
.field textarea:focus {
  outline: none;
  border-color: #FF9F00;
}

.field input::placeholder,
.field textarea::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.thumb-preview {
  margin-top: 0.75rem;
  max-width: 200px;
  border-radius: 10px;
  border: 2px solid rgba(255, 255, 255, 0.15);
}

/* ── Info box (lien spectateur) ────────────────────────────────────────────── */
.info-box {
  background: rgba(255, 159, 0, 0.08);
  border: 1px solid rgba(255, 159, 0, 0.25);
  border-radius: 12px;
  padding: 1rem 1.25rem;
  margin-bottom: 1.5rem;
}

.info-label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.85rem;
  margin-bottom: 0.5rem;
}

.copy-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.copy-row code {
  flex: 1;
  background: rgba(0, 0, 0, 0.3);
  color: #FF9F00;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  font-size: 0.85rem;
  word-break: break-all;
}

/* ── Vidéo locale ──────────────────────────────────────────────────────────── */
.video-wrapper {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 1.5rem;
  background: #000;
}

.local-video {
  width: 100%;
  max-height: 380px;
  object-fit: contain;
  display: block;
}

.viewer-count {
  position: absolute;
  bottom: 0.75rem;
  right: 0.75rem;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  font-size: 0.8rem;
}

/* ── Buttons ───────────────────────────────────────────────────────────────── */
.actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn-primary {
  background: #FF9F00;
  color: #000;
  border: none;
  padding: 0.75rem 1.75rem;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.2s;
}

.btn-primary:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: transparent;
  border: 2px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.7);
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 0.2s;
}

.btn-secondary:hover {
  border-color: rgba(255, 255, 255, 0.5);
}

.btn-danger {
  background: #ef4444;
  color: #fff;
  border: none;
  padding: 0.75rem 1.75rem;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-danger:hover:not(:disabled) {
  opacity: 0.85;
}

.btn-danger:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-back {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  padding: 0;
  display: block;
}

.btn-back:hover {
  color: #fff;
}

.btn-copy {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #fff;
  padding: 0.45rem 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
  flex-shrink: 0;
}

.btn-copy:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* ── Alertes ───────────────────────────────────────────────────────────────── */
.alert-error {
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.4);
  color: #fca5a5;
  border-radius: 10px;
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.alert-success {
  background: rgba(34, 197, 94, 0.15);
  border: 1px solid rgba(34, 197, 94, 0.35);
  color: #86efac;
  border-radius: 10px;
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

@media (max-width: 640px) {
  .page-content-with-space {
    padding-top: 60px;
  }

  .stream-card {
    padding: 1.5rem;
    margin: 1rem;
  }

  .stream-title {
    font-size: 1.4rem;
  }

  .actions {
    flex-direction: column;
  }

  .btn-primary,
  .btn-danger,
  .btn-secondary {
    width: 100%;
    text-align: center;
  }
}
</style>