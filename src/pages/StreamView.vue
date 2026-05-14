<template>
  <div class="sv-page">

    <!-- Loading -->
    <div v-if="loading" class="sv-loading">
      <div class="sv-spinner"></div>
      <p>{{ $t('ui.chargement_du_stream') }}</p>
    </div>

    <!-- Error -->
    <div v-else-if="pageError" class="sv-error">
      <i class="ti ti-video-off sv-error__icon"></i>
      <h3>{{ pageError }}</h3>
      <button class="sv-btn sv-btn--secondary" @click="$router.push('/streams')">
        <i class="fas fa-arrow-left"></i>{{ $t('ui.retour_aux_streams') }}</button>
    </div>

    <!-- Content -->
    <div v-else-if="stream" class="sv-layout">

      <!-- ── Left: video + info ── -->
      <div class="sv-main">

        <!-- Back button -->
        <button class="sv-back" @click="$router.push('/streams')">
          <i class="fas fa-arrow-left"></i>{{ $t('ui.retour') }}</button>

        <!-- Video player -->
        <div class="sv-player" :style="{ aspectRatio: playerAspect }">
          <video
            ref="remoteVideo"
            v-show="connected"
            autoplay
            playsinline
            controls
            class="sv-player__video"
          ></video>

          <!-- Waiting / offline overlay -->
          <div v-if="!connected" class="sv-player__overlay">
            <template v-if="stream.is_live">
              <div class="sv-spinner sv-spinner--lg"></div>
              <p class="sv-player__wait-msg">{{ waitingMsg }}</p>
              <button v-if="showRetry" class="sv-btn sv-btn--secondary sv-retry" @click="retryConnection">
                <i class="fas fa-sync-alt"></i>{{ $t('ui.r_essayer') }}</button>
            </template>
            <template v-else>
              <StreamCover
                :stream-id="stream.id"
                :title="stream.title"
                :username="stream.user?.username"
                :game="stream.game"
                :category="stream.category"
                :is-ended="true"
                :follower-count="stream.follower_count"
                style="position:absolute;inset:0;width:100%;height:100%;border-radius:0;"
              />
              <div class="sv-offline-badge">
                <i class="fas fa-video-slash"></i>{{ $t('ui.hors_ligne') }}</div>
            </template>
          </div>

          <!-- Badges -->
          <div class="sv-player__badges">
            <span v-if="stream.is_live" class="sv-badge-live">
              <span class="sv-live-dot"></span>LIVE
            </span>
            <span v-if="stream.is_live" class="sv-badge-viewers">
              <i class="fas fa-eye"></i> {{ stream.viewer_count || 0 }}
            </span>
          </div>

          <!-- WS status indicator -->
          <span class="sv-ws-status" :style="{ background: wsStatusColor }">{{ wsStatusLabel }}</span>
        </div>

        <!-- Stream info card -->
        <div class="sv-info">
          <div class="sv-info__top">
            <div class="sv-info__avatar">
              {{ (stream.user?.username || '?').slice(0, 2).toUpperCase() }}
            </div>
            <div class="sv-info__meta">
              <h2 class="sv-info__title">{{ stream.title || 'Sans titre' }}</h2>
              <p class="sv-info__channel">{{ stream.user?.username || 'User' }}</p>
              <p class="sv-info__followers">
                <i class="far fa-heart"></i>
                {{ stream.follower_count }}
                follower{{ stream.follower_count !== 1 ? 's' : '' }}
              </p>
            </div>
            <!-- Own stream: show label, not button -->
            <span v-if="stream.is_own_stream" class="sv-own-badge">
              <i class="fas fa-video"></i>{{ $t('ui.votre_stream') }}</span>
            <!-- Other stream: follow button -->
            <button
              v-else-if="isAuthenticated"
              class="sv-follow-btn"
              :class="{ 'sv-follow-btn--following': isFollowing }"
              @click="toggleFollow"
              :disabled="followingLoading"
            >
              <i :class="isFollowing ? 'fas fa-heart' : 'far fa-heart'"></i>
              <span>{{ followingLoading ? '…' : isFollowing ? 'Suivi' : 'Suivre' }}</span>
            </button>
            <!-- Not logged in: login prompt -->
            <button
              v-else
              class="sv-follow-btn sv-follow-btn--ghost"
              @click="$router.push('/login')"
            >
              <i class="fas fa-sign-in-alt"></i>
              <span>{{ $t('ui.se_connecter') }}</span>
            </button>
          </div>

          <!-- Monetization actions -->
          <div v-if="isAuthenticated && !stream.is_own_stream" class="sv-money-actions">
            <button class="sv-donate-btn" @click="showDonateModal = true">
              <i class="fas fa-coins"></i>{{ $t('ui.donner_des_ebt') }}</button>
            <button v-if="stream.is_live" class="sv-predict-btn" @click="showPredictModal = true">
              <i class="fas fa-star"></i>{{ $t('ui.soutenir') }}</button>
          </div>

          <!-- Tags -->
          <div class="sv-info__tags" v-if="stream.category || stream.game">
            <span v-if="stream.category" class="sv-tag">{{ stream.category }}</span>
            <span v-if="stream.game" class="sv-tag sv-tag--game">{{ stream.game }}</span>
          </div>

          <!-- Description -->
          <p v-if="stream.description" class="sv-info__desc">{{ stream.description }}</p>
        </div>
      </div>

      <!-- ── Right: chat ── -->
      <div class="sv-chat">
        <div class="sv-chat__header">
          <i class="fas fa-comment-dots"></i>
          <span>{{ $t('ui.chat_en_direct') }}</span>
        </div>

        <!-- Messages -->
        <div class="sv-chat__messages" ref="chatContainer">
          <div v-if="chatLoading && chatMessages.length === 0" class="sv-chat__loading">
            <div class="sv-spinner sv-spinner--sm"></div>
          </div>
          <div v-else-if="chatMessages.length === 0" class="sv-chat__empty">
            <i class="fas fa-comment-slash"></i>
            <p>{{ $t('ui.aucun_message_pour_le_moment') }}</p>
          </div>
          <div v-else class="sv-chat__list">
            <div
              v-for="msg in chatMessages"
              :key="msg.id"
              class="sv-msg"
              :class="{ 'sv-msg--own': msg.user_id === currentUserId }"
            >
              <div class="sv-msg__avatar">
                {{ (msg.user?.username || '?').slice(0, 2).toUpperCase() }}
              </div>
              <div class="sv-msg__body">
                <div class="sv-msg__top">
                  <span class="sv-msg__name">{{ msg.user?.username || 'User' }}</span>
                  <span v-if="msg.is_moderator" class="sv-msg__badge sv-msg__badge--mod">MOD</span>
                  <span v-if="msg.is_subscriber" class="sv-msg__badge sv-msg__badge--sub">SUB</span>
                  <span class="sv-msg__time">{{ formatTime(msg.created_at) }}</span>
                </div>
                <p class="sv-msg__text">{{ msg.message }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Input -->
        <div v-if="isAuthenticated" class="sv-chat__input-wrap">
          <input
            v-model="newMessage"
            type="text"
            class="sv-chat__input"
            :placeholder="$t('ui.tapez_un_message')"
            @keyup.enter="sendMessage"
            :disabled="sendingMessage"
            maxlength="500"
          />
          <button
            class="sv-chat__send"
            @click="sendMessage"
            :disabled="sendingMessage || !newMessage.trim()"
          >
            <i class="fas fa-paper-plane"></i>
          </button>
        </div>
        <div v-else class="sv-chat__login-cta">
          <p>{{ $t('ui.connectez_vous_pour_chatter') }}</p>
          <button class="sv-btn sv-btn--primary" @click="$router.push('/login')">{{ $t('ui.se_connecter') }}</button>
        </div>
      </div>

    </div>

    <!-- ── Modal Donation ── -->
    <div v-if="showDonateModal" class="sv-modal-overlay" @click.self="showDonateModal = false">
      <div class="sv-modal">
        <div class="sv-modal__header">
          <h3><i class="fas fa-coins"></i>{{ $t('ui.envoyer_des_ebt') }}</h3>
          <button @click="showDonateModal = false"><i class="fas fa-times"></i></button>
        </div>
        <div class="sv-modal__body">
          <p class="sv-modal__info">
            <strong>85%</strong>{{ $t('ui.va_directement_au_streamer') }}<strong>15%</strong>{{ $t('ui.la_plateforme') }}</p>
          <div class="sv-modal__group">
            <label>{{ $t('ui.montant_ebt') }}</label>
            <input v-model="donateAmount" type="number" min="1" :placeholder="$t('ui.ex_50')" class="sv-chat__input" />
          </div>
          <div class="sv-modal__group">
            <label>{{ $t('ui.message_optionnel') }}</label>
            <input v-model="donateMessage" type="text" maxlength="500" :placeholder="$t('ui.f_licitations')" class="sv-chat__input" />
          </div>
          <div v-if="moneyMsg" :class="['sv-modal__msg', moneyMsgType === 'success' ? 'sv-modal__msg--ok' : 'sv-modal__msg--err']">
            {{ moneyMsg }}
          </div>
        </div>
        <div class="sv-modal__footer">
          <button class="sv-btn sv-btn--secondary" @click="showDonateModal = false">{{ $t('ui.annuler') }}</button>
          <button class="sv-btn sv-btn--primary" @click="sendDonation" :disabled="moneyLoading || !donateAmount">
            <i class="fas fa-paper-plane"></i> {{ moneyLoading ? 'Envoi…' : 'Envoyer' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ── Modal Prédiction ── -->
    <div v-if="showPredictModal" class="sv-modal-overlay" @click.self="showPredictModal = false">
      <div class="sv-modal">
        <div class="sv-modal__header">
          <h3><i class="fas fa-star"></i>{{ $t('ui.soutenir_le_streamer') }}</h3>
          <button @click="showPredictModal = false"><i class="fas fa-times"></i></button>
        </div>
        <div class="sv-modal__body">
          <p class="sv-modal__info">
            Commission de <strong>15%</strong>{{ $t('ui.pr_lev_e_sur_vos_cr_dits') }}<br />
            Le streamer reçoit <strong>40%</strong>{{ $t('ui.de_la_commission_soit') }}<strong>6%</strong>{{ $t('ui.de_votre_mise') }}</p>
          <div class="sv-modal__group">
            <label>{{ $t('ui.cr_dits_engager_ebt') }}</label>
            <input v-model="predictAmount" type="number" min="1" :placeholder="$t('ui.ex_100')" class="sv-chat__input" />
            <small v-if="predictAmount">
              Commission payée : {{ (parseFloat(predictAmount || '0') * 0.15).toFixed(2) }} EBT
              — Streamer gagne : {{ (parseFloat(predictAmount || '0') * 0.15 * 0.40).toFixed(2) }} EBT
            </small>
          </div>
          <div v-if="moneyMsg" :class="['sv-modal__msg', moneyMsgType === 'success' ? 'sv-modal__msg--ok' : 'sv-modal__msg--err']">
            {{ moneyMsg }}
          </div>
        </div>
        <div class="sv-modal__footer">
          <button class="sv-btn sv-btn--secondary" @click="showPredictModal = false">{{ $t('ui.annuler') }}</button>
          <button class="sv-btn sv-btn--primary" @click="sendPrediction" :disabled="moneyLoading || !predictAmount">
            <i class="fas fa-bolt"></i> {{ moneyLoading ? 'Envoi…' : 'Soutenir' }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t } = useI18n();

import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import apiClient from '@/utils/axios';
import StreamCover from '@/components/Shared/StreamCover.vue';

interface Stream {
  id: number; title: string; description: string; thumbnail_url?: string;
  category?: string; game?: string; is_live: boolean;
  viewer_count: number; follower_count: number;
  is_following: boolean; is_own_stream: boolean;
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
const remoteVideo = ref<HTMLVideoElement | null>(null);
const playerAspect = ref('16 / 9');
const connected = ref(false);
const waitingMsg = ref('Connexion au stream...');
const showRetry = ref(false);

const chatMessages = ref<ChatMessage[]>([]);
const chatLoading = ref(false);
const newMessage = ref('');
const sendingMessage = ref(false);
const isFollowing = ref(false);
const followingLoading = ref(false);
const currentUserId = ref<number | null>(null);
const chatContainer = ref<HTMLElement | null>(null);

const isAuthenticated = computed(() => !!localStorage.getItem('auth_token'));

// ── Monetisation ──────────────────────────────────────────────────────────────
const showDonateModal  = ref(false);
const showPredictModal = ref(false);
const donateAmount     = ref('');
const donateMessage    = ref('');
const predictAmount    = ref('');
const moneyLoading     = ref(false);
const moneyMsg         = ref('');
const moneyMsgType     = ref<'success'|'error'>('success');

const sendDonation = async () => {
  if (!donateAmount.value || parseFloat(donateAmount.value) <= 0) return;
  moneyLoading.value = true;
  moneyMsg.value = '';
  try {
    const res = await apiClient.post(`/streams/${streamId}/donate`, {
      amount: parseFloat(donateAmount.value),
      message: donateMessage.value || undefined,
    });
    if (res.data.success) {
      moneyMsgType.value = 'success';
      moneyMsg.value = `Don de ${donateAmount.value} EBT envoyé ! Le streamer reçoit ${res.data.data.streamer_amount} EBT.`;
      donateAmount.value = '';
      donateMessage.value = '';
      setTimeout(() => { showDonateModal.value = false; moneyMsg.value = ''; }, 2500);
    }
  } catch (e: any) {
    moneyMsgType.value = 'error';
    moneyMsg.value = e.response?.data?.message || 'Erreur lors du don';
  } finally {
    moneyLoading.value = false;
  }
};

const sendPrediction = async () => {
  if (!predictAmount.value || parseFloat(predictAmount.value) <= 0) return;
  moneyLoading.value = true;
  moneyMsg.value = '';
  try {
    const res = await apiClient.post(`/streams/${streamId}/predict`, {
      credits_amount: parseFloat(predictAmount.value),
    });
    if (res.data.success) {
      moneyMsgType.value = 'success';
      moneyMsg.value = `${predictAmount.value} crédits de soutien envoyés !`;
      predictAmount.value = '';
      setTimeout(() => { showPredictModal.value = false; moneyMsg.value = ''; }, 2500);
    }
  } catch (e: any) {
    moneyMsgType.value = 'error';
    moneyMsg.value = e.response?.data?.message || 'Erreur';
  } finally {
    moneyLoading.value = false;
  }
};

// ── WebRTC ────────────────────────────────────────────────────────────────────
let ws: WebSocket | null = null;
let pc: RTCPeerConnection | null = null;
let retryTimer: ReturnType<typeof setTimeout> | null = null;
let wsReconnectTimer: ReturnType<typeof setTimeout> | null = null;
// Flag : empêche la reconnexion WS après un stream-ended volontaire
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
  // Token optionnel — les viewers non connectés sont acceptés comme guests
  const url = token
    ? `${WS_BASE}/watch/${streamId}?token=${encodeURIComponent(token)}`
    : `${WS_BASE}/watch/${streamId}`;

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

      // Message chat reçu via WebSocket (temps réel, sans polling)
      case 'chat-message':
        chatMessages.value.push({
          id: msg.ts,
          message: msg.text,
          user_id: msg.userId,
          user: { id: msg.userId, username: msg.username },
          is_moderator: false,
          is_subscriber: false,
          created_at: new Date(msg.ts).toISOString(),
        });
        nextTick().then(scrollChat);
        break;

      case 'stream-ended':
        // ── FIX : marquer la fin AVANT de fermer le WS pour bloquer la reconnexion ──
        streamEnded = true;
        if (wsReconnectTimer) clearTimeout(wsReconnectTimer);
        connected.value = false;
        waitingMsg.value = 'Le stream est terminé.';
        showRetry.value = false;
        cleanupPeer();
        // Fermer proprement le WS (onclose ne relancera pas de reconnexion)
        if (ws) { ws.onclose = null; ws.close(); ws = null; }
        wsStatus.value = 'disconnected';
        if (remoteVideo.value) remoteVideo.value.srcObject = null;
        // Recharger pour mettre à jour is_live → affiche le bloc "offline"
        await loadStream(false);
        break;
    }
  };

  ws.onerror = () => {
    wsStatus.value = 'disconnected';
    waitingMsg.value = 'Erreur de connexion WebSocket.';
  };

  ws.onclose = (evt) => {
    wsStatus.value = 'disconnected';

    // Cas 1 : stream terminé volontairement → ne pas reconnecter
    if (streamEnded) return;

    // Cas 2 : rejeté par le serveur (1008) → pas de boucle
    if (evt.code === 1008) {
      waitingMsg.value = 'Connexion refusée.';
      return;
    }

    // Cas 3 : stream offline → inutile de reconnecter
    if (!stream.value?.is_live) return;

    // Cas 4 : déconnexion réseau → tenter une reconnexion
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
    if (!remoteVideo.value) return;
    const stream = evt.streams?.[0] || new MediaStream([evt.track]);
    remoteVideo.value.srcObject = stream;
    connected.value = true;
    showRetry.value = false;
    waitingMsg.value = '';
    if (retryTimer) clearTimeout(retryTimer);
    remoteVideo.value.onloadedmetadata = () => {
      const v = remoteVideo.value;
      if (v && v.videoWidth && v.videoHeight) {
        playerAspect.value = `${v.videoWidth} / ${v.videoHeight}`;
      }
    };
    nextTick(() => {
      const v = remoteVideo.value;
      if (v && v.srcObject) v.play().catch(() => {});
    });
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
const loadStream = async (connectRtc = true) => {
  if (!stream.value) loading.value = true;
  pageError.value = '';
  try {
    const res = await apiClient.get(`/streams/${streamId}`);
    if (res.data.success) {
      stream.value = res.data.data;
      // Sync follow state from API (backend now returns is_following for auth users)
      if (stream.value) isFollowing.value = stream.value.is_following ?? false;
      if (connectRtc && stream.value?.is_live && (!ws || ws.readyState !== WebSocket.OPEN)) {
        connectWebRTC();
      }
      if (isAuthenticated.value && !currentUserId.value) checkCurrentUser();
    }
  } catch (e: any) {
    pageError.value = e.response?.status === 404
      ? 'Stream introuvable.'
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
  const text = newMessage.value.trim();
  newMessage.value = '';

  try {
    // Envoyer via HTTP pour persistence en base (Laravel)
    const res = await apiClient.post(`/streams/${stream.value.id}/chat`, { message: text });
    if (res.data.success) {
      // Ajouter localement (les autres reçoivent via WS broadcast)
      chatMessages.value.push(res.data.data);
      await nextTick();
      scrollChat();
      // Broadcaster aux autres viewers via WebSocket
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
    newMessage.value = text; // remettre le texte si erreur
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

let chatTimer: ReturnType<typeof setInterval>;
let streamTimer: ReturnType<typeof setInterval>;

onMounted(async () => {
  await loadStream();
  loadChatMessages();
  chatTimer = setInterval(loadChatMessages, 8000); // réduit: chat via WS push si dispo
  streamTimer = setInterval(() => loadStream(false), 60000); // vérif état stream toutes les 60s
});

onBeforeUnmount(() => {
  clearInterval(chatTimer);
  clearInterval(streamTimer);
  cleanupWebRTC();
});
</script>

<style scoped>
/* ── Page ── */
.sv-page { padding: 16px 0 48px; }

/* ── Loading ── */
.sv-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 80px 20px;
  color: rgb(var(--n3));
  font-size: 14px;
}

/* ── Error ── */
.sv-error {
  text-align: center;
  padding: 80px 20px;
  color: rgb(var(--n3));
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}

.sv-error__icon { font-size: 56px; opacity: .3; }

.sv-error h3 { font-size: 18px; font-weight: 700; color: rgb(var(--n5)); margin: 0; }

/* ── Spinner ── */
.sv-spinner {
  width: 28px; height: 28px;
  border: 3px solid rgba(var(--g1), .25);
  border-top-color: rgb(var(--g1));
  border-radius: 50%;
  animation: sv-spin .7s linear infinite;

  &--lg { width: 40px; height: 40px; border-width: 3px; }
  &--sm { width: 20px; height: 20px; border-width: 2px; }
}

@keyframes sv-spin { to { transform: rotate(360deg); } }

/* ── Layout: video + chat ── */
.sv-layout {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 16px;
  align-items: start;

  @media (max-width: 1000px) { grid-template-columns: 1fr 280px; }
  @media (max-width: 768px)  { grid-template-columns: 1fr; }
}

/* ── Back button ── */
.sv-back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding: 0 12px;
  background: rgba(var(--n8), .07);
  border: 1px solid rgba(var(--n8), .12);
  border-radius: 5px;
  color: rgb(var(--n5));
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 12px;
  transition: all .15s;
  &:hover { background: rgba(var(--n8), .13); color: rgb(var(--n8)); }
  i { font-size: 14px; }
}

/* ── Video player ── */
.sv-player {
  position: relative;
  aspect-ratio: 16 / 9;
  background: #000;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 14px;
}

.sv-player__video {
  width: 100%; height: 100%;
  object-fit: contain;
  display: block;
}

.sv-player__overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: rgba(0,0,0,.65);
  z-index: 2;
}

.sv-player__wait-msg {
  font-size: 14px;
  color: rgba(255,255,255,.85);
  margin: 0;
  text-align: center;
}

.sv-player__wait-sub {
  font-size: 12px;
  color: rgba(255,255,255,.5);
  text-align: center;
}

.sv-player__offline-icon {
  font-size: 48px;
  color: rgba(255,255,255,.3);
}

.sv-offline-badge {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 22px;
  border-radius: 8px;
  background: rgba(0,0,0,.72);
  backdrop-filter: blur(8px);
  color: rgba(255,255,255,.7);
  font-size: 15px;
  font-weight: 700;
  letter-spacing: .04em;
  border: 1px solid rgba(255,255,255,.12);
  pointer-events: none;
}

.sv-retry {
  margin-top: 4px;
  height: 32px;
  padding: 0 14px;
  font-size: 12px;
}

/* Badges overlay */
.sv-player__badges {
  position: absolute;
  top: 10px; left: 10px;
  display: flex;
  gap: 6px;
  z-index: 3;
}

.sv-badge-live {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: rgb(var(--r1));
  color: #fff;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: .07em;
  text-transform: uppercase;
  padding: 3px 7px;
  border-radius: 3px;
  box-shadow: 0 2px 8px rgba(var(--r1), .5);
}

.sv-live-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: rgba(255,255,255,.9);
  animation: pulseDot 1.6s ease-in-out infinite;
}

@keyframes pulseDot {
  0%,100% { opacity:1; transform:scale(1); }
  50%      { opacity:.4; transform:scale(1.4); }
}

.sv-badge-viewers {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: rgba(0,0,0,.65);
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  padding: 3px 7px;
  border-radius: 3px;
  backdrop-filter: blur(4px);
  i { font-size: 11px; }
}

/* WS status */
.sv-ws-status {
  position: absolute;
  top: 10px; right: 10px;
  z-index: 3;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 3px;
  color: #fff;
}

/* ── Stream info card ── */
.sv-info {
  background: rgb(var(--p2));
  border: 1px solid rgb(var(--n2));
  border-radius: 8px;
  padding: 18px;
}

.sv-info__top {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 14px;
}

.sv-info__avatar {
  width: 46px; height: 46px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgb(var(--g1)), #d4962e);
  color: #fff;
  font-size: 14px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 2px solid rgba(var(--g1), .35);
}

.sv-info__meta { flex: 1; min-width: 0; }

.sv-info__title {
  font-size: 16px;
  font-weight: 700;
  color: rgb(var(--n8));
  margin: 0 0 3px;
  word-break: break-word;
}

.sv-info__channel {
  font-size: 13px;
  color: rgb(var(--n5));
  margin: 0 0 2px;
  font-weight: 600;
}

.sv-info__followers {
  font-size: 12px;
  color: rgb(var(--n3));
  margin: 0;
  display: flex;
  align-items: center;
  gap: 4px;
  i { font-size: 12px; }
}

/* Follow button */
.sv-follow-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 34px;
  padding: 0 14px;
  background: rgb(var(--g1));
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  flex-shrink: 0;
  transition: all .2s;
  box-shadow: 0 3px 12px rgba(var(--g1), .3);

  &:hover { background: rgba(var(--g1), .83); transform: translateY(-1px); }
  &:disabled { opacity: .55; cursor: not-allowed; transform: none; }
  i { font-size: 14px; }

  &--following {
    background: rgba(var(--n8), .1);
    border: 1px solid rgba(var(--n8), .2);
    color: rgb(var(--n8));
    box-shadow: none;
    &:hover { background: rgba(var(--r1), .12); color: rgb(var(--r1)); border-color: rgba(var(--r1), .3); }
  }

  &--ghost {
    background: rgba(var(--n8), .06);
    border: 1px solid rgba(var(--n8), .14);
    color: rgb(var(--n3));
    box-shadow: none;
    &:hover { background: rgba(var(--n8), .12); color: rgb(var(--n8)); }
  }
}

.sv-own-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 34px;
  padding: 0 12px;
  background: rgba(var(--g1), .12);
  border: 1px solid rgba(var(--g1), .3);
  border-radius: 5px;
  color: rgb(var(--g1));
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
  i { font-size: 13px; }
}

.sv-info__tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.sv-tag {
  font-size: 11px;
  font-weight: 600;
  background: rgba(var(--n8), .08);
  color: rgb(var(--n3));
  padding: 3px 8px;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: .03em;

  &--game { background: rgba(var(--g1), .14); color: rgb(var(--g1)); }
}

.sv-info__desc {
  font-size: 13px;
  color: rgb(var(--n3));
  line-height: 1.6;
  margin: 0;
}

/* ── Chat ── */
.sv-chat {
  background: rgb(var(--p2));
  border: 1px solid rgb(var(--n2));
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  height: 600px;
  min-height: 400px;
  position: sticky;
  top: 66px;

  @media (max-width: 768px) {
    height: auto;
    min-height: 340px;
    position: static;
    margin-top: 8px;
  }
}

.sv-chat__header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 16px 12px;
  border-bottom: 1px solid rgb(var(--n2));
  font-size: 13px;
  font-weight: 700;
  color: rgb(var(--n8));
  flex-shrink: 0;
  i { font-size: 16px; color: rgb(var(--g1)); }
}

.sv-chat__messages {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  scrollbar-width: thin;
  scrollbar-color: rgb(var(--n2)) transparent;
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { background: rgb(var(--n2)); border-radius: 2px; }
}

.sv-chat__loading {
  display: flex;
  justify-content: center;
  padding: 24px;
}

.sv-chat__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 100%;
  color: rgb(var(--n3));
  i { font-size: 32px; opacity: .3; }
  p { font-size: 13px; margin: 0; }
}

.sv-chat__list { display: flex; flex-direction: column; gap: 10px; }

/* Message */
.sv-msg {
  display: flex;
  gap: 8px;
  align-items: flex-start;
}

.sv-msg__avatar {
  width: 26px; height: 26px;
  border-radius: 50%;
  background: linear-gradient(135deg, #febd56, #d98f25);
  color: #fff;
  font-size: 9px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 1px;
}

.sv-msg--own .sv-msg__avatar { background: linear-gradient(135deg, rgb(var(--g1)), #e8a83a); }

.sv-msg__body { flex: 1; min-width: 0; }

.sv-msg__top {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 2px;
  flex-wrap: wrap;
}

.sv-msg__name {
  font-size: 12px;
  font-weight: 700;
  color: rgb(var(--n8));
  .sv-msg--own & { color: rgb(var(--g1)); }
}

.sv-msg__badge {
  font-size: 9px;
  font-weight: 800;
  padding: 1px 5px;
  border-radius: 3px;
  text-transform: uppercase;
  letter-spacing: .04em;

  &--mod { background: rgba(0,200,83,.2); color: #00c853; }
  &--sub { background: rgba(255,180,0,.2); color: #ffb400; }
}

.sv-msg__time {
  font-size: 10px;
  color: rgb(var(--n3));
  margin-left: auto;
}

.sv-msg__text {
  font-size: 13px;
  color: rgb(var(--n5));
  line-height: 1.45;
  margin: 0;
  word-break: break-word;
}

/* Chat input */
.sv-chat__input-wrap {
  display: flex;
  gap: 8px;
  padding: 12px;
  border-top: 1px solid rgb(var(--n2));
  flex-shrink: 0;
}

.sv-chat__input {
  flex: 1;
  height: 36px;
  background: rgb(var(--p1));
  border: 1px solid rgb(var(--n2));
  border-radius: 5px;
  color: rgb(var(--n8));
  font-size: 13px;
  padding: 0 12px;
  outline: none;
  font-family: var(--body-font);
  transition: border-color .2s;
  &::placeholder { color: rgb(var(--n3)); }
  &:focus { border-color: rgb(var(--g1)); }
  &:disabled { opacity: .5; }
}

.sv-chat__send {
  width: 36px; height: 36px;
  background: rgb(var(--g1));
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
  transition: background .15s;
  &:hover { background: rgba(var(--g1), .83); }
  &:disabled { opacity: .45; cursor: not-allowed; }
}

.sv-chat__login-cta {
  padding: 14px;
  border-top: 1px solid rgb(var(--n2));
  text-align: center;
  flex-shrink: 0;
  p { font-size: 12px; color: rgb(var(--n3)); margin: 0 0 8px; }
}

/* ── Buttons ── */
.sv-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 38px;
  padding: 0 16px;
  border-radius: 5px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all .2s;
  border: none;

  &--primary {
    background: rgb(var(--g1));
    color: #fff;
    &:hover { background: rgba(var(--g1), .83); }
  }

  &--secondary {
    background: rgba(var(--n8), .08);
    border: 1px solid rgba(var(--n8), .15);
    color: rgb(var(--n8));
    &:hover { background: rgba(var(--n8), .15); }
  }
}
/* ── Monetisation buttons ── */
.sv-money-actions {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.sv-donate-btn, .sv-predict-btn {
  height: 32px;
  padding: 0 14px;
  border: none;
  border-radius: 5px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  transition: all .2s;
  i { font-size: 12px; }
}

.sv-donate-btn {
  background: rgba(254, 189, 86, .15);
  color: rgb(var(--g1));
  border: 1px solid rgba(254, 189, 86, .35);
  &:hover { background: rgba(254, 189, 86, .25); }
}

.sv-predict-btn {
  background: rgba(0, 200, 83, .12);
  color: #00c853;
  border: 1px solid rgba(0, 200, 83, .3);
  &:hover { background: rgba(0, 200, 83, .22); }
}

/* ── Modals donation / prediction ── */
.sv-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 16px;
}

.sv-modal {
  background: rgb(var(--p2));
  border: 1px solid rgb(var(--n2));
  border-radius: 10px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 20px 60px rgba(0,0,0,.5);
}

.sv-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 18px;
  border-bottom: 1px solid rgb(var(--n2));

  h3 {
    font-size: 15px;
    font-weight: 700;
    color: rgb(var(--n8));
    margin: 0;
    display: flex;
    align-items: center;
    gap: 8px;
    i { color: rgb(var(--g1)); }
  }

  button {
    background: none;
    border: none;
    color: rgb(var(--n3));
    cursor: pointer;
    font-size: 16px;
    padding: 4px;
    &:hover { color: rgb(var(--n8)); }
  }
}

.sv-modal__body {
  padding: 18px;
}

.sv-modal__info {
  font-size: 13px;
  color: rgb(var(--n3));
  line-height: 1.5;
  margin: 0 0 16px;
  padding: 10px 14px;
  background: rgba(var(--g1), .07);
  border: 1px solid rgba(var(--g1), .2);
  border-radius: 6px;

  strong { color: rgb(var(--g1)); }
}

.sv-modal__group {
  margin-bottom: 14px;

  label {
    display: block;
    font-size: 12px;
    font-weight: 700;
    color: rgb(var(--n3));
    text-transform: uppercase;
    letter-spacing: .04em;
    margin-bottom: 6px;
  }

  small {
    display: block;
    font-size: 11px;
    color: rgb(var(--n3));
    margin-top: 5px;
  }
}

.sv-modal__msg {
  padding: 10px 14px;
  border-radius: 6px;
  font-size: 13px;
  margin-top: 10px;

  &--ok { background: rgba(0,200,83,.1); color: #00c853; border: 1px solid rgba(0,200,83,.25); }
  &--err { background: rgba(var(--r1),.1); color: rgb(var(--r1)); border: 1px solid rgba(var(--r1),.25); }
}

.sv-modal__footer {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  padding: 14px 18px;
  border-top: 1px solid rgb(var(--n2));
}

/* ── Mobile landscape: player fills the full viewport ── */
@media (orientation: landscape) and (hover: none) and (pointer: coarse) {
  .sv-page {
    padding: 0;
    overflow: hidden;
  }

  .sv-layout {
    display: block;
  }

  .sv-back {
    position: fixed;
    top: 10px;
    left: 10px;
    z-index: 1001;
    margin: 0;
    background: rgba(0, 0, 0, 0.55);
    border-color: rgba(255, 255, 255, 0.25);
    color: #fff;
    &:hover { background: rgba(0, 0, 0, 0.75); color: #fff; }
  }

  .sv-player {
    position: fixed;
    inset: 0;
    z-index: 1000;
    aspect-ratio: unset;
    width: 100vw;
    height: 100vh;
    margin: 0;
    border-radius: 0;
  }

  .sv-info,
  .sv-chat {
    display: none;
  }
}
</style>
