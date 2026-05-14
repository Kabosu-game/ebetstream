<template>
  <div class="cd-page">

    <!-- Loading -->
    <div v-if="loading" class="cd-loading">
      <div class="cd-spinner"></div>
      <p>Loading challenge…</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="cd-error">
      <i class="fas fa-exclamation-circle cd-error__icon"></i>
      <h3>{{ error }}</h3>
      <button class="cd-btn cd-btn--primary" @click="$router.push('/challenges')">
        <i class="fas fa-arrow-left"></i> Back to Challenges
      </button>
    </div>

    <!-- Content -->
    <div v-else-if="challenge" class="cd-content">

      <!-- ── Page header ── -->
      <div class="cd-header">
        <button class="cd-back" @click="$router.push('/challenges')">
          <i class="fas fa-arrow-left"></i> Back
        </button>
        <div class="cd-header__center">
          <span class="cd-status-badge"
            :class="{
              'cd-status--open': challenge.status === 'open',
              'cd-status--active': challenge.status === 'accepted' || challenge.status === 'in_progress',
              'cd-status--done': challenge.status === 'completed',
              'cd-status--cancelled': challenge.status === 'cancelled',
            }">
            <span v-if="challenge.status === 'in_progress'" class="cd-live-dot"></span>
            {{ getStatusLabel(challenge.status) }}
          </span>
          <h1 class="cd-header__title">{{ challenge.game }}</h1>
        </div>
        <div class="cd-header__right">
          <span v-if="challenge.expires_at" class="cd-timer">
            <i class="fas fa-clock"></i> {{ getTimeRemaining(challenge.expires_at) }}
          </span>
        </div>
      </div>

      <!-- ── Main grid ── -->
      <div class="cd-grid">

        <!-- ── LEFT COLUMN ── -->
        <div class="cd-left">

          <!-- VS Card -->
          <div class="cd-vs-card">
            <!-- Creator -->
            <div class="cd-player" :class="{ 'cd-player--winner': challenge.status === 'completed' && challenge.creator_score !== null && challenge.opponent_score !== null && challenge.creator_score > challenge.opponent_score }">
              <div class="cd-player__avatar">
                {{ challenge.creator.username.slice(0, 2).toUpperCase() }}
              </div>
              <div class="cd-player__info">
                <p class="cd-player__name">{{ challenge.creator.username }}</p>
                <span class="cd-player__role">Creator</span>
              </div>
              <div class="cd-player__score-wrap">
                <template v-if="challenge.creator_score !== null">
                  <span class="cd-player__score">{{ challenge.creator_score }}</span>
                  <span class="cd-player__score-lbl">pts</span>
                </template>
                <span v-else-if="challenge.status === 'accepted' || challenge.status === 'in_progress'" class="cd-player__score-pending">
                  <i class="fas fa-hourglass-half"></i>
                </span>
              </div>
            </div>

            <!-- VS divider -->
            <div class="cd-vs-center">
              <div class="cd-vs-circle">VS</div>
              <div class="cd-pot">
                <i class="fas fa-coins"></i>
                <span class="cd-pot__amount">{{ (challenge.bet_amount * 2).toLocaleString() }} EBT</span>
                <span class="cd-pot__lbl">prize pool</span>
              </div>
            </div>

            <!-- Opponent -->
            <div class="cd-player cd-player--right"
              :class="{
                'cd-player--winner': challenge.status === 'completed' && challenge.creator_score !== null && challenge.opponent_score !== null && challenge.opponent_score > challenge.creator_score,
                'cd-player--waiting': !challenge.opponent
              }">
              <div class="cd-player__score-wrap">
                <template v-if="challenge.opponent_score !== null">
                  <span class="cd-player__score">{{ challenge.opponent_score }}</span>
                  <span class="cd-player__score-lbl">pts</span>
                </template>
                <span v-else-if="challenge.opponent && (challenge.status === 'accepted' || challenge.status === 'in_progress')" class="cd-player__score-pending">
                  <i class="fas fa-hourglass-half"></i>
                </span>
              </div>
              <div class="cd-player__info cd-player__info--right">
                <p class="cd-player__name">{{ challenge.opponent ? challenge.opponent.username : 'Waiting…' }}</p>
                <span class="cd-player__role">{{ challenge.opponent ? 'Opponent' : 'Open slot' }}</span>
              </div>
              <div class="cd-player__avatar" :class="{ 'cd-player__avatar--ghost': !challenge.opponent }">
                <i v-if="!challenge.opponent" class="fas fa-user-clock"></i>
                <template v-else>{{ challenge.opponent.username.slice(0, 2).toUpperCase() }}</template>
              </div>
            </div>

            <!-- Winner banner -->
            <div v-if="challenge.status === 'completed'" class="cd-winner-banner">
              <i class="fas fa-trophy"></i> {{ getWinner() }}
            </div>
          </div>

          <!-- Challenge info grid -->
          <div class="cd-info-grid">
            <div class="cd-info-item">
              <span class="cd-info-item__lbl">Game</span>
              <span class="cd-info-item__val"><i class="fas fa-gamepad"></i> {{ challenge.game }}</span>
            </div>
            <div class="cd-info-item">
              <span class="cd-info-item__lbl">Bet per player</span>
              <span class="cd-info-item__val"><i class="fas fa-coins"></i> {{ challenge.bet_amount.toLocaleString() }} EBT</span>
            </div>
            <div class="cd-info-item">
              <span class="cd-info-item__lbl">Created</span>
              <span class="cd-info-item__val"><i class="fas fa-calendar-alt"></i> {{ formatDate(challenge.created_at) }}</span>
            </div>
            <div class="cd-info-item" v-if="challenge.expires_at">
              <span class="cd-info-item__lbl">Expires</span>
              <span class="cd-info-item__val"><i class="fas fa-clock"></i> {{ formatDate(challenge.expires_at) }}</span>
            </div>
          </div>

          <!-- Private chat (participants only) -->
          <div v-if="isParticipant && challenge.opponent" class="cd-chat">
            <div class="cd-chat__header">
              <i class="fas fa-comment-dots"></i> Private Discussion
            </div>
            <div class="cd-chat__messages" ref="chatEl">
              <div v-if="loadingMessages" class="cd-chat__loading">
                <div class="cd-spinner cd-spinner--sm"></div>
              </div>
              <div v-else-if="messages.length === 0" class="cd-chat__empty">
                <i class="fas fa-comment-slash"></i>
                <span>No messages yet</span>
              </div>
              <div v-else>
                <div v-for="msg in messages" :key="msg.id" class="cd-msg"
                  :class="{ 'cd-msg--own': msg.user_id === currentUserId }">
                  <div class="cd-msg__avatar">{{ (msg.user?.username || '?').slice(0,2).toUpperCase() }}</div>
                  <div class="cd-msg__body">
                    <div class="cd-msg__top">
                      <span class="cd-msg__name">{{ msg.user?.username }}</span>
                      <span class="cd-msg__time">{{ formatTime(msg.created_at) }}</span>
                      <button v-if="msg.user_id === currentUserId" class="cd-msg__del" @click="deleteMessage(msg.id)">
                        <i class="fas fa-times"></i>
                      </button>
                    </div>
                    <p class="cd-msg__text">{{ msg.message }}</p>
                  </div>
                </div>
              </div>
            </div>
            <form class="cd-chat__input" @submit.prevent="sendMessage">
              <input v-model="newMessage" class="cd-chat__field" placeholder="Type a message…"
                :disabled="sendingMessage" maxlength="1000" />
              <button type="submit" class="cd-chat__send" :disabled="sendingMessage || !newMessage.trim()">
                <i class="fas fa-paper-plane"></i>
              </button>
            </form>
          </div>

        </div>

        <!-- ── RIGHT COLUMN — Actions ── -->
        <div class="cd-right">

          <!-- LIVE indicator (for viewers) -->
          <div v-if="challenge.is_live && !isCreator" class="cd-live-banner">
            <span class="cd-live-dot"></span>
            <strong>LIVE</strong> — {{ challenge.viewer_count || 0 }} spectateurs
            <button class="cd-btn cd-btn--live" @click="viewLiveStream">
              <i class="fas fa-play"></i> Watch
            </button>
          </div>

          <!-- Accept challenge -->
          <div v-if="challenge.status === 'open' && challenge.creator.id !== currentUserId && !challenge.opponent" class="cd-action-card">
            <div class="cd-action-card__header">
              <i class="fas fa-fist-raised"></i> Join this Challenge
            </div>
            <p class="cd-action-card__desc">
              Stake <strong>{{ challenge.bet_amount.toLocaleString() }} EBT</strong> to accept.<br />
              Winner takes the full prize pool.
            </p>
            <button class="cd-btn cd-btn--primary cd-btn--full" @click="acceptChallenge">
              <i class="fas fa-check-circle"></i> Accept Challenge
            </button>
          </div>

          <!-- Cancel challenge (creator) -->
          <div v-if="challenge.status === 'open' && challenge.creator.id === currentUserId" class="cd-action-card">
            <div class="cd-action-card__header">
              <i class="fas fa-cog"></i> Your Challenge
            </div>
            <p class="cd-action-card__desc">Waiting for an opponent to join.</p>
            <button class="cd-btn cd-btn--danger cd-btn--full" @click="cancelChallenge">
              <i class="fas fa-times-circle"></i> Cancel & Refund
            </button>
          </div>

          <!-- ── LIVE STREAMING CONTROL (creator) ── -->
          <div v-if="isCreator && (challenge.status === 'accepted' || challenge.status === 'in_progress')" class="cd-action-card">
            <div class="cd-action-card__header">
              <i class="fas fa-broadcast-tower"></i> Live Streaming
              <span v-if="challenge.is_live" class="cd-ws-badge"
                :style="{ background: wsStreamerStatusColor }">{{ wsStreamerStatusLabel }}</span>
            </div>

            <!-- Not live -->
            <div v-if="!challenge.is_live && !recordingError">
              <p class="cd-action-card__desc">Stream your gameplay live for your audience.</p>
              <button class="cd-btn cd-btn--live cd-btn--full" @click="startScreenRecording" :disabled="startingRecording">
                <i class="fas fa-spinner fa-spin" v-if="startingRecording"></i>
                <span class="cd-live-dot" v-else></span>
                {{ startingRecording ? 'Starting…' : 'Go Live' }}
              </button>
            </div>

            <!-- LIVE state -->
            <div v-if="challenge.is_live">
              <!-- Status bar -->
              <div class="cd-live-status" :class="{ 'cd-live-status--paused': challenge.is_live_paused }">
                <span>
                  <span v-if="!challenge.is_live_paused" class="cd-live-dot"></span>
                  <i v-else class="fas fa-pause"></i>
                  {{ challenge.is_live_paused ? 'PAUSED' : 'LIVE' }}
                </span>
                <span><i class="fas fa-eye"></i> {{ challenge.viewer_count || 0 }}</span>
              </div>

              <!-- Local preview -->
              <div class="cd-preview">
                <video ref="localVideoEl" autoplay muted playsinline class="cd-preview__video"></video>
              </div>

              <!-- Controls -->
              <div class="cd-live-controls">
                <button v-if="!challenge.is_live_paused" class="cd-tool" @click="pauseScreenRecording" title="Pause">
                  <i class="fas fa-pause"></i><span>Pause</span>
                </button>
                <button v-else class="cd-tool cd-tool--active" @click="resumeScreenRecording" title="Resume">
                  <i class="fas fa-play"></i><span>Resume</span>
                </button>
                <button class="cd-tool" @click="refreshViewerCount" title="Refresh stats">
                  <i class="fas fa-sync-alt"></i><span>Stats</span>
                </button>
                <button class="cd-tool" @click="copyStreamUrl" title="Copy link">
                  <i class="fas fa-copy"></i><span>Copy link</span>
                </button>
                <button class="cd-tool" @click="openStreamInNewTab" title="View in streams">
                  <i class="fas fa-external-link-alt"></i><span>View</span>
                </button>
              </div>

              <button class="cd-btn cd-btn--danger cd-btn--full" @click="stopScreenRecording" :disabled="stoppingRecording">
                <i class="fas fa-spinner fa-spin" v-if="stoppingRecording"></i>
                <i class="fas fa-stop" v-else></i>
                {{ stoppingRecording ? 'Stopping…' : 'Stop Stream' }}
              </button>
            </div>

            <div v-if="recordingError" class="cd-alert cd-alert--error">
              <i class="fas fa-exclamation-circle"></i> {{ recordingError }}
            </div>
          </div>

          <!-- Submit score -->
          <div v-if="(challenge.status === 'accepted' || challenge.status === 'in_progress') && isParticipant && !hasSubmittedScore" class="cd-action-card">
            <div class="cd-action-card__header">
              <i class="fas fa-paper-plane"></i> Submit Your Score
            </div>
            <div class="cd-score-input">
              <input v-model.number="myScore" type="number" class="cd-input" placeholder="Your score" min="0" :disabled="submittingScore" />
              <button class="cd-btn cd-btn--primary" @click="submitScore" :disabled="submittingScore || !myScore">
                <i class="fas fa-spinner fa-spin" v-if="submittingScore"></i>
                <i class="fas fa-check" v-else></i>
                {{ submittingScore ? '…' : 'Submit' }}
              </button>
            </div>
            <div v-if="scoreError" class="cd-alert cd-alert--error">{{ scoreError }}</div>
          </div>

          <!-- Score submitted -->
          <div v-if="hasSubmittedScore && challenge.status !== 'completed'" class="cd-action-card cd-action-card--success">
            <i class="fas fa-check-circle cd-action-card__icon"></i>
            <p>Score submitted: <strong>{{ getMySubmittedScore() }}</strong></p>
            <p class="cd-action-card__desc">Waiting for {{ getOtherPlayerName() }}…</p>
          </div>

          <!-- Challenge completed -->
          <div v-if="challenge.status === 'completed'" class="cd-action-card cd-action-card--gold">
            <i class="fas fa-trophy cd-action-card__icon"></i>
            <h4>Challenge Completed</h4>
            <p v-if="challenge.creator_score !== null && challenge.opponent_score !== null" class="cd-action-card__winner">
              {{ getWinner() }}
            </p>
          </div>

          <!-- Cancelled -->
          <div v-if="challenge.status === 'cancelled'" class="cd-action-card">
            <i class="fas fa-ban cd-action-card__icon" style="color:rgb(var(--r1))"></i>
            <h4>Challenge Cancelled</h4>
          </div>

          <!-- Not participant notice -->
          <div v-if="!isParticipant && challenge.status !== 'open'" class="cd-notice">
            <i class="fas fa-info-circle"></i> You are not a participant in this challenge.
          </div>

          <!-- ── Stop Challenge Request ── -->
          <div v-if="isParticipant && challenge.opponent && (challenge.status === 'accepted' || challenge.status === 'in_progress')" class="cd-action-card">
            <div class="cd-action-card__header">
              <i class="fas fa-stop-circle"></i> Stop Challenge
            </div>

            <div v-if="stopRequestLoading" class="cd-loading cd-loading--sm">
              <div class="cd-spinner cd-spinner--sm"></div>
            </div>

            <template v-else-if="stopRequest">
              <!-- Pending -->
              <div v-if="stopRequest.status === 'pending'" class="cd-stop-request cd-stop-request--pending">
                <p>
                  <span v-if="stopRequest.initiator_id === currentUserId">
                    Waiting for <strong>{{ getOtherPlayerName() }}</strong> to confirm.
                  </span>
                  <span v-else>
                    <strong>{{ stopRequest.initiator?.username }}</strong> requested to stop.
                  </span>
                </p>
                <div class="cd-stop-request__actions">
                  <button v-if="stopRequest.initiator_id === currentUserId" class="cd-btn cd-btn--ghost cd-btn--sm" @click="cancelStopRequest" :disabled="cancellingStop">
                    <i class="fas fa-times"></i> Cancel
                  </button>
                  <button v-else class="cd-btn cd-btn--primary cd-btn--sm" @click="confirmStopRequest" :disabled="confirmingStop">
                    <i class="fas fa-check"></i> Confirm
                  </button>
                </div>
              </div>
              <!-- Confirmed -->
              <div v-else-if="stopRequest.status === 'confirmed'" class="cd-stop-request cd-stop-request--confirmed">
                Both players confirmed. Waiting for admin approval.
              </div>
              <!-- Approved -->
              <div v-else-if="stopRequest.status === 'approved'" class="cd-stop-request cd-stop-request--ok">
                Challenge stopped by admin.
              </div>
              <!-- Rejected -->
              <div v-else-if="stopRequest.status === 'rejected'" class="cd-stop-request cd-stop-request--error">
                Stop request rejected. Challenge continues.
              </div>
            </template>

            <template v-else>
              <p class="cd-action-card__desc">Both players must agree to stop. Admin will review and complete the challenge.</p>
              <button class="cd-btn cd-btn--ghost cd-btn--full" @click="requestStopChallenge" :disabled="requestingStop">
                <i class="fas fa-stop-circle"></i> {{ requestingStop ? 'Requesting…' : 'Request to Stop' }}
              </button>
            </template>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted, watch, nextTick } from "vue";
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
  expires_at: string | null;
  created_at: string;
  is_live?: boolean;
  is_live_paused?: boolean;
  stream_key?: string | null;
  rtmp_url?: string | null;
  stream_url?: string | null;
  live_started_at?: string | null;
  live_ended_at?: string | null;
  viewer_count?: number;
  creator_screen_recording?: boolean;
  creator_screen_stream_url?: string | null;
}

const route = useRoute();
const router = useRouter();
const challenge = ref<Challenge | null>(null);
const loading = ref(false);
const error = ref("");
const currentUserId = ref<number | null>(null);
const myScore = ref<number | null>(null);
const submittingScore = ref(false);
const scoreError = ref("");

const messages = ref<any[]>([]);
const loadingMessages = ref(false);
const sendingMessage = ref(false);
const newMessage = ref("");

const stopRequest = ref<any>(null);
const stopRequestLoading = ref(false);
const requestingStop = ref(false);
const confirmingStop = ref(false);
const cancellingStop = ref(false);

const isRecording = ref(false);
const recordingError = ref("");
const startingRecording = ref(false);
const stoppingRecording = ref(false);
const screenStream = ref<MediaStream | null>(null);
const localVideoEl = ref<HTMLVideoElement | null>(null);
const creatorStreamUrl = ref<string | null>(null);

// ── WebRTC Streamer via WS signaling ─────────────────────────────────────────
const peerConnections: Record<string, RTCPeerConnection> = {};
let signalingWs: WebSocket | null = null;
const wsStreamerConnected = ref(false);

const wsStreamerStatusColor = computed(() =>
  wsStreamerConnected.value ? 'rgba(40,167,69,.8)' : 'rgba(220,53,69,.8)'
);
const wsStreamerStatusLabel = computed(() =>
  wsStreamerConnected.value ? '● Signal' : '○ Signal'
);

const WS_BASE = (import.meta.env.VITE_STREAM_WS_URL || 'wss://ebetstream.com/ws').replace(/\/$/, '');
const ICE_SERVERS = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
];

// <i class="fas fa-check-circle" style="color:#00c853"></i> FIX #4 — cleanupSignaling vérifie readyState avant close()
const cleanupSignaling = () => {
  Object.keys(peerConnections).forEach(closePeer);
  if (signalingWs) {
    // Neutraliser tous les handlers AVANT de fermer pour éviter les callbacks parasites
    signalingWs.onclose = null;
    signalingWs.onerror = null;
    signalingWs.onmessage = null;
    signalingWs.onopen = null;
    // <i class="fas fa-check-circle" style="color:#00c853"></i> Ne fermer que si pas déjà fermé ou en cours de fermeture
    if (
      signalingWs.readyState !== WebSocket.CLOSED &&
      signalingWs.readyState !== WebSocket.CLOSING
    ) {
      signalingWs.close();
    }
    signalingWs = null;
  }
  wsStreamerConnected.value = false;
};

const connectSignaling = (stream: MediaStream) => {
  if (!challenge.value) return;

  // <i class="fas fa-check-circle" style="color:#00c853"></i> Éviter double connexion si déjà OPEN ou CONNECTING
  if (
    signalingWs &&
    (signalingWs.readyState === WebSocket.OPEN ||
      signalingWs.readyState === WebSocket.CONNECTING)
  ) {
    return;
  }

  // Nettoyer proprement avant de recréer
  cleanupSignaling();

  const token = localStorage.getItem('auth_token') || '';
  signalingWs = new WebSocket(
    `${WS_BASE}/stream/${challenge.value.id}?token=${encodeURIComponent(token)}`
  );

  signalingWs.onopen = () => {
    wsStreamerConnected.value = true;
  };

  signalingWs.onerror = () => {
    wsStreamerConnected.value = false;
    recordingError.value = 'Erreur WebSocket signal.';
  };

  signalingWs.onclose = () => {
    wsStreamerConnected.value = false;
  };

  signalingWs.onmessage = async (evt) => {
    let msg: any;
    try { msg = JSON.parse(evt.data); } catch { return; }
    switch (msg.type) {
      case 'ready':
        if (challenge.value) challenge.value.viewer_count = msg.viewerCount ?? 0;
        break;
      case 'viewer-joined':
        if (challenge.value) challenge.value.viewer_count = msg.count ?? challenge.value.viewer_count;
        await createOffer(msg.viewerId, stream);
        break;
      case 'answer':
        if (peerConnections[msg.viewerId]) {
          await peerConnections[msg.viewerId].setRemoteDescription(
            new RTCSessionDescription(msg.sdp)
          );
        }
        break;
      case 'ice-candidate':
        if (peerConnections[msg.viewerId] && msg.candidate) {
          try {
            await peerConnections[msg.viewerId].addIceCandidate(
              new RTCIceCandidate(msg.candidate)
            );
          } catch { }
        }
        break;
      case 'viewer-left':
        if (challenge.value) challenge.value.viewer_count = msg.count ?? challenge.value.viewer_count;
        closePeer(msg.viewerId);
        break;
    }
  };
};

const createOffer = async (viewerId: string, stream: MediaStream) => {
  if (peerConnections[viewerId]) closePeer(viewerId);
  const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
  peerConnections[viewerId] = pc;

  stream.getTracks().forEach(track => pc.addTrack(track, stream));

  pc.onicecandidate = ({ candidate }) => {
    if (candidate && signalingWs?.readyState === WebSocket.OPEN)
      signalingWs.send(JSON.stringify({ type: 'ice-candidate', viewerId, candidate }));
  };

  pc.oniceconnectionstatechange = () => {
    if (pc.iceConnectionState === 'failed') pc.restartIce();
  };

  pc.onconnectionstatechange = () => {
    if (pc.connectionState === 'failed' || pc.connectionState === 'closed') {
      closePeer(viewerId);
    }
  };

  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);
  signalingWs?.send(JSON.stringify({ type: 'offer', viewerId, sdp: offer }));
};

const closePeer = (viewerId: string) => {
  if (peerConnections[viewerId]) {
    peerConnections[viewerId].close();
    delete peerConnections[viewerId];
  }
};

// ── Computed ──────────────────────────────────────────────────────────────────
const isParticipant = computed(() => {
  if (!challenge.value || !currentUserId.value) return false;
  return (
    challenge.value.creator.id === currentUserId.value ||
    (challenge.value.opponent && challenge.value.opponent.id === currentUserId.value)
  );
});

const isCreator = computed(() => {
  if (!challenge.value || !currentUserId.value) return false;
  return challenge.value.creator.id === currentUserId.value;
});

const hasSubmittedScore = computed(() => {
  if (!challenge.value || !currentUserId.value) return false;
  if (challenge.value.creator.id === currentUserId.value) return challenge.value.creator_score !== null;
  if (challenge.value.opponent?.id === currentUserId.value) return challenge.value.opponent_score !== null;
  return false;
});

// ── Helpers ───────────────────────────────────────────────────────────────────
const getMySubmittedScore = () => {
  if (!challenge.value || !currentUserId.value) return "";
  if (challenge.value.creator.id === currentUserId.value) return challenge.value.creator_score;
  if (challenge.value.opponent?.id === currentUserId.value) return challenge.value.opponent_score;
  return "";
};

const getOtherPlayerName = () => {
  if (!challenge.value || !currentUserId.value) return "the other player";
  if (challenge.value.creator.id === currentUserId.value)
    return challenge.value.opponent?.username || "the opponent";
  return challenge.value.creator.username;
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    open: "Open", accepted: "Accepted", in_progress: "In Progress",
    completed: "Completed", cancelled: "Cancelled",
  };
  return labels[status] || status;
};

const getTimeRemaining = (expiresAt: string | null) => {
  if (!expiresAt) return "No expiration";
  const diff = new Date(expiresAt).getTime() - Date.now();
  if (diff <= 0) return "Expired";
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} remaining`;
  if (hours > 0) return `${hours}h remaining`;
  return `${Math.floor(diff / 60000)}min remaining`;
};

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('en-US', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

const formatTime = (dateString: string) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
};

const getWinner = () => {
  if (!challenge.value || challenge.value.creator_score === null || challenge.value.opponent_score === null)
    return "";
  if (challenge.value.creator_score > challenge.value.opponent_score)
    return `${challenge.value.creator.username} won!`;
  if (challenge.value.opponent_score > challenge.value.creator_score)
    return `${challenge.value.opponent?.username} won!`;
  return "Draw!";
};

// ── Stream helpers ────────────────────────────────────────────────────────────
const getPublicStreamUrl = () => {
  if (!challenge.value?.id) return '';
  return `${window.location.origin}/challenges/${challenge.value.id}/live`;
};

const copyStreamUrl = () => {
  navigator.clipboard.writeText(getPublicStreamUrl());
  alert('Lien copié ! Les spectateurs peuvent regarder via ce lien.');
};

const openStreamInNewTab = () => window.open('/streams', '_blank');

const viewLiveStream = () => {
  if (challenge.value?.id) router.push(`/challenges/${challenge.value.id}/live`);
};

const refreshViewerCount = async () => {
  if (!challenge.value) return;
  try {
    const res = await apiClient.get(`/challenges/${challenge.value.id}/live`);
    if (res.data.success && challenge.value)
      challenge.value.viewer_count = res.data.data.viewer_count || 0;
  } catch { }
};

let viewerCountInterval: ReturnType<typeof setInterval> | null = null;

const startViewerCountPolling = () => {
  if (viewerCountInterval) clearInterval(viewerCountInterval);
  viewerCountInterval = setInterval(() => {
    if (challenge.value?.is_live) refreshViewerCount();
  }, 30000);
};

const stopViewerCountPolling = () => {
  if (viewerCountInterval) { clearInterval(viewerCountInterval); viewerCountInterval = null; }
};

// ── Screen Recording (streamer) ───────────────────────────────────────────────
const startScreenRecording = async () => {
  if (!challenge.value || !isCreator.value) return;
  try {
    startingRecording.value = true;
    recordingError.value = "";

    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: { width: { ideal: 1920 }, height: { ideal: 1080 }, frameRate: { ideal: 30 } } as any,
      audio: true,
    });

    // Fallback micro si pas d'audio système
    if (stream.getAudioTracks().length === 0) {
      try {
        const mic = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        mic.getAudioTracks().forEach((t: MediaStreamTrack) => stream.addTrack(t));
      } catch { }
    }

    screenStream.value = stream;

    // Preview locale
    await nextTick();
    if (localVideoEl.value) {
      localVideoEl.value.srcObject = stream;
      localVideoEl.value.muted = true;
    }

    // Notifier Laravel
    const response = await apiClient.post(
      `/challenges/${challenge.value.id}/screen-recording/start`, {}
    );
    if (!response.data.success) throw new Error(response.data.message || "Failed to start recording");

    isRecording.value = true;
    if (challenge.value) {
      challenge.value.is_live = true;
      challenge.value.viewer_count = 0;
    }

    // Arrêt auto si l'utilisateur ferme le partage d'écran
    stream.getVideoTracks()[0].addEventListener('ended', () => stopScreenRecording());

    // <i class="fas fa-check-circle" style="color:#00c853"></i> WS signaling — connecte le serveur pour relayer l'offre aux viewers
    connectSignaling(stream);

    startViewerCountPolling();

  } catch (err: any) {
    if (screenStream.value) {
      screenStream.value.getTracks().forEach(t => t.stop());
      screenStream.value = null;
    }
    const apiMsg = err.response?.data?.message;
    recordingError.value = apiMsg || (err.name === 'NotAllowedError'
      ? "Partage d'écran refusé. Veuillez autoriser l'accès."
      : (err.message || "Failed to start screen recording."));
  } finally {
    startingRecording.value = false;
  }
};

const stopScreenRecording = async () => {
  if (!challenge.value) return;
  if (!isRecording.value && !(isCreator.value && challenge.value.is_live)) return;
  try {
    stoppingRecording.value = true;
    recordingError.value = "";

    if (screenStream.value) {
      screenStream.value.getTracks().forEach(t => t.stop());
      screenStream.value = null;
    }
    if (localVideoEl.value) localVideoEl.value.srcObject = null;

    const response = await apiClient.post(
      `/challenges/${challenge.value.id}/screen-recording/stop`, {}
    );
    if (response.data.success) {
      isRecording.value = false;
      if (challenge.value) {
        challenge.value.is_live = false;
        challenge.value.viewer_count = 0;
      }
      creatorStreamUrl.value = null;
      stopViewerCountPolling();
      // <i class="fas fa-check-circle" style="color:#00c853"></i> Fermer WS signaling et tous les peers proprement
      cleanupSignaling();
    } else {
      throw new Error(response.data.message || "Failed to stop recording");
    }
  } catch (err: any) {
    recordingError.value =
      err.response?.data?.message || err.message || "Failed to stop screen recording";
  } finally {
    stoppingRecording.value = false;
  }
};

const pauseScreenRecording = async () => {
  if (!challenge.value?.is_live) return;
  try {
    const res = await apiClient.post(
      `/challenges/${challenge.value.id}/screen-recording/pause`, {}
    );
    if (res.data.success && challenge.value) {
      challenge.value.is_live_paused = true;
      screenStream.value?.getTracks().forEach(t => { t.enabled = false; });
    }
  } catch { }
};

const resumeScreenRecording = async () => {
  if (!challenge.value?.is_live) return;
  try {
    const res = await apiClient.post(
      `/challenges/${challenge.value.id}/screen-recording/resume`, {}
    );
    if (res.data.success && challenge.value) {
      challenge.value.is_live_paused = false;
      screenStream.value?.getTracks().forEach(t => { t.enabled = true; });
    }
  } catch { }
};

// ── API ───────────────────────────────────────────────────────────────────────
const loadChallenge = async () => {
  try {
    loading.value = true;
    error.value = "";
    const response = await apiClient.get(`/challenges/${route.params.id}`);
    if (response.data.success) {
      challenge.value = response.data.data;
      if (challenge.value && challenge.value.is_live === undefined) challenge.value.is_live = false;
      if (challenge.value && challenge.value.viewer_count === undefined) challenge.value.viewer_count = 0;

      const token = localStorage.getItem("auth_token");
      if (token) {
        try {
          const userRes = await apiClient.get(`/user`);
          if (userRes.data?.id) { currentUserId.value = userRes.data.id; myScore.value = null; }
        } catch { }
      }

      if (isParticipant.value && challenge.value?.opponent) { loadMessages(); startMessagePolling(); }
      if (isParticipant.value) loadStopRequest();
      if (challenge.value && isCreator.value && challenge.value.is_live) {
        isRecording.value = true;
        startViewerCountPolling();
      } else {
        stopViewerCountPolling();
      }

    } else {
      error.value = response.data.message || "Error loading challenge";
    }
  } catch (err: any) {
    if (err.response?.status === 404) error.value = "Challenge not found";
    else error.value = err.response?.data?.message || "Error loading challenge";
  } finally {
    loading.value = false;
  }
};

const loadMessages = async () => {
  if (!challenge.value || !isParticipant.value) return;
  try {
    loadingMessages.value = true;
    const res = await apiClient.get(`/challenges/${challenge.value.id}/messages`);
    if (res.data.success) {
      messages.value = (res.data.data.data || res.data.data || []).reverse();
      setTimeout(() => {
        const c = document.querySelector('.chat-container');
        if (c) c.scrollTop = c.scrollHeight;
      }, 100);
    }
  } catch { } finally { loadingMessages.value = false; }
};

let messagePollingInterval: ReturnType<typeof setInterval> | null = null;

const startMessagePolling = () => {
  messagePollingInterval = setInterval(() => {
    if (isParticipant.value && challenge.value?.opponent) loadMessages();
  }, 8000);
};

const sendMessage = async () => {
  if (!challenge.value || !newMessage.value.trim()) return;
  try {
    sendingMessage.value = true;
    const res = await apiClient.post(
      `/challenges/${challenge.value.id}/messages`,
      { message: newMessage.value.trim() }
    );
    if (res.data.success) { newMessage.value = ""; await loadMessages(); }
  } catch { } finally { sendingMessage.value = false; }
};

const deleteMessage = async (messageId: number) => {
  if (!challenge.value || !confirm("Are you sure you want to delete this message?")) return;
  try {
    await apiClient.delete(`/challenges/${challenge.value.id}/messages/${messageId}`);
    await loadMessages();
  } catch { }
};

const loadStopRequest = async () => {
  if (!challenge.value || !isParticipant.value) return;
  try {
    stopRequestLoading.value = true;
    const res = await apiClient.get(`/challenges/${challenge.value.id}/stop-request`);
    if (res.data.success) stopRequest.value = res.data.data;
  } catch { } finally { stopRequestLoading.value = false; }
};

const requestStopChallenge = async () => {
  if (!challenge.value || !confirm("Are you sure you want to request to stop this challenge?")) return;
  try {
    requestingStop.value = true;
    const res = await apiClient.post(
      `/challenges/${challenge.value.id}/request-stop`, { reason: null }
    );
    if (res.data.success) { await loadStopRequest(); alert(res.data.message || "Stop request created."); }
    else alert(res.data.message || "Error");
  } catch (err: any) {
    alert(err.response?.data?.message || "Error");
  } finally { requestingStop.value = false; }
};

const confirmStopRequest = async () => {
  if (!challenge.value || !confirm("Confirm stopping this challenge?")) return;
  try {
    confirmingStop.value = true;
    const res = await apiClient.post(`/challenges/${challenge.value.id}/request-stop`, {});
    if (res.data.success) { await loadStopRequest(); alert(res.data.message || "Confirmed."); }
  } catch (err: any) {
    alert(err.response?.data?.message || "Error");
  } finally { confirmingStop.value = false; }
};

const cancelStopRequest = async () => {
  if (!challenge.value || !confirm("Cancel the stop request?")) return;
  try {
    cancellingStop.value = true;
    const res = await apiClient.delete(`/challenges/${challenge.value.id}/stop-request`);
    if (res.data.success) { stopRequest.value = null; alert("Stop request cancelled."); }
  } catch (err: any) {
    alert(err.response?.data?.message || "Error");
  } finally { cancellingStop.value = false; }
};

const getCurrentUser = async () => {
  try {
    const res = await apiClient.get("/user");
    if (res.data?.id) currentUserId.value = res.data.id;
  } catch { }
};

const acceptChallenge = async () => {
  if (!challenge.value) return;
  if (!localStorage.getItem("auth_token")) {
    alert("Please log in to accept challenges");
    return;
  }
  if (!confirm(
    `Accept this challenge? You will need to bet ${challenge.value.bet_amount.toLocaleString()} EBT.`
  )) return;
  try {
    const res = await apiClient.post(`/challenges/${challenge.value.id}/accept`, {});
    if (res.data.success) { await loadChallenge(); alert("Challenge accepted successfully!"); }
    else alert(res.data.message || "Error accepting challenge");
  } catch (err: any) {
    alert(err.response?.data?.message || "Error accepting challenge");
  }
};

const cancelChallenge = async () => {
  if (!challenge.value || !confirm("Cancel this challenge? Your bet will be refunded.")) return;
  try {
    const res = await apiClient.post(`/challenges/${challenge.value.id}/cancel`, {});
    if (res.data.success) { await loadChallenge(); alert("Challenge cancelled successfully!"); }
  } catch (err: any) {
    alert(err.response?.data?.message || "Error cancelling challenge");
  }
};

const submitScore = async () => {
  if (!challenge.value || myScore.value === null) return;
  try {
    submittingScore.value = true;
    scoreError.value = "";
    const res = await apiClient.post(
      `/challenges/${challenge.value.id}/scores`, { score: myScore.value }
    );
    if (res.data.success) {
      const submitted = myScore.value;
      myScore.value = null;
      if (challenge.value) {
        if (challenge.value.creator.id === currentUserId.value)
          challenge.value.creator_score = submitted;
        else if (challenge.value.opponent?.id === currentUserId.value)
          challenge.value.opponent_score = submitted;
        challenge.value.status =
          challenge.value.creator_score !== null && challenge.value.opponent_score !== null
            ? 'completed'
            : 'in_progress';
      }
      await loadChallenge();
    } else {
      scoreError.value = res.data.message || "Error submitting score";
    }
  } catch (err: any) {
    scoreError.value = err.response?.data?.message || "Error submitting score";
  } finally {
    submittingScore.value = false;
  }
};

watch(() => challenge.value?.status, (newStatus) => {
  if (newStatus === 'completed' && isRecording.value && challenge.value) stopScreenRecording();
});

onMounted(() => { getCurrentUser(); loadChallenge(); });

onUnmounted(() => {
  if (messagePollingInterval) clearInterval(messagePollingInterval);
  stopViewerCountPolling();
  // <i class="fas fa-check-circle" style="color:#00c853"></i> Fermer WS signaling et tous les peers proprement
  cleanupSignaling();
  if (screenStream.value) {
    screenStream.value.getTracks().forEach(t => t.stop());
    screenStream.value = null;
  }
});
</script>



<style scoped>
/* ── Page ── */
.cd-page { padding: 20px 0 48px; }

/* ── Loading / Error ── */
.cd-loading { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:16px; padding:80px 20px; color:rgb(var(--n3)); font-size:14px; }
.cd-error { text-align:center; padding:80px 20px; display:flex; flex-direction:column; align-items:center; gap:14px; color:rgb(var(--n3)); }
.cd-error__icon { font-size:56px; opacity:.3; }
.cd-error h3 { font-size:18px; font-weight:700; color:rgb(var(--n5)); margin:0; }

/* Spinner */
.cd-spinner { width:28px; height:28px; border:3px solid rgba(var(--g1),.25); border-top-color:rgb(var(--g1)); border-radius:50%; animation:cd-spin .7s linear infinite; }
.cd-spinner--sm { width:18px; height:18px; border-width:2px; }
@keyframes cd-spin { to { transform:rotate(360deg); } }

/* ── Live dot ── */
.cd-live-dot { width:8px; height:8px; border-radius:50%; background:rgb(var(--r1)); display:inline-block; flex-shrink:0; animation:pulse-dot 1.4s ease-in-out infinite; }
@keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(1.4)} }

/* ── Page header ── */
.cd-header { display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:24px; flex-wrap:wrap; }
.cd-back { display:inline-flex; align-items:center; gap:7px; height:32px; padding:0 14px; background:rgba(var(--n8),.07); border:1px solid rgba(var(--n8),.12); border-radius:5px; color:rgb(var(--n5)); font-size:13px; font-weight:600; cursor:pointer; transition:all .15s; flex-shrink:0; i{font-size:13px;} &:hover{background:rgba(var(--n8),.13);color:rgb(var(--n8));} }
.cd-header__center { display:flex; flex-direction:column; align-items:center; gap:6px; flex:1; min-width:0; }
.cd-header__title { font-size:22px; font-weight:800; color:rgb(var(--n8)); margin:0; }
.cd-header__right { display:flex; align-items:center; flex-shrink:0; }
.cd-timer { font-size:13px; color:rgb(var(--n3)); display:flex; align-items:center; gap:5px; i{font-size:12px;} }

/* Status badge */
.cd-status-badge { display:inline-flex; align-items:center; gap:5px; font-size:11px; font-weight:800; text-transform:uppercase; letter-spacing:.06em; padding:3px 10px; border-radius:12px; }
.cd-status--open     { background:rgba(0,200,83,.12); color:#00c853; border:1px solid rgba(0,200,83,.28); }
.cd-status--active   { background:rgba(var(--r1),.12); color:rgb(var(--r1)); border:1px solid rgba(var(--r1),.28); }
.cd-status--done     { background:rgba(var(--g1),.12); color:rgb(var(--g1)); border:1px solid rgba(var(--g1),.28); }
.cd-status--cancelled{ background:rgba(var(--n2),.4); color:rgb(var(--n3)); border:1px solid rgb(var(--n2)); }

/* ── Main grid ── */
.cd-grid { display:grid; grid-template-columns:1fr 320px; gap:20px; align-items:start; @media(max-width:900px){grid-template-columns:1fr;} }

/* ── VS Card ── */
.cd-vs-card { background:rgb(var(--p2)); border:1px solid rgb(var(--n2)); border-radius:12px; padding:28px 20px 20px; margin-bottom:16px; position:relative; overflow:hidden; }
.cd-vs-card::before { content:''; position:absolute; inset:0; background:linear-gradient(135deg, rgba(var(--g1),.04) 0%, transparent 60%); pointer-events:none; }

.cd-player { display:flex; align-items:center; gap:14px; padding:14px 0; position:relative; z-index:2; }
.cd-player--right { flex-direction:row-reverse; }
.cd-player--winner { background:rgba(var(--g1),.06); border-radius:8px; padding:14px 10px; margin:-4px -10px; }

.cd-player__avatar {
  width:52px; height:52px; border-radius:50%; flex-shrink:0;
  background:linear-gradient(135deg, rgb(var(--g1)), rgba(var(--g1),.5));
  color:rgb(var(--p1)); font-size:16px; font-weight:800;
  display:flex; align-items:center; justify-content:center;
  border:2px solid rgba(var(--g1),.3);
  box-shadow:0 0 16px rgba(var(--g1),.2);
  &--ghost { background:rgb(var(--p3)); border-color:rgb(var(--n2)); color:rgb(var(--n3)); box-shadow:none; }
}

.cd-player__info { flex:1; min-width:0; &--right{text-align:right;} }
.cd-player__name { font-size:15px; font-weight:700; color:rgb(var(--n8)); margin:0 0 3px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.cd-player__role { font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:.06em; color:rgb(var(--n3)); }

.cd-player__score-wrap { display:flex; flex-direction:column; align-items:center; flex-shrink:0; min-width:48px; }
.cd-player__score { font-size:28px; font-weight:900; color:rgb(var(--n8)); line-height:1; }
.cd-player__score-lbl { font-size:10px; color:rgb(var(--n3)); }
.cd-player__score-pending { color:rgb(var(--n3)); font-size:18px; }

/* VS Center */
.cd-vs-center { display:flex; flex-direction:column; align-items:center; gap:12px; padding:8px 0; }
.cd-vs-circle { width:44px; height:44px; border-radius:50%; background:rgb(var(--p3)); border:2px solid rgb(var(--n2)); display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:800; color:rgb(var(--r1)); }

/* Prize pool */
.cd-pot { display:flex; flex-direction:column; align-items:center; gap:2px; }
.cd-pot i { font-size:16px; color:rgb(var(--g1)); }
.cd-pot__amount { font-size:18px; font-weight:900; color:rgb(var(--g1)); line-height:1; }
.cd-pot__lbl { font-size:10px; color:rgb(var(--n3)); text-transform:uppercase; letter-spacing:.04em; }

/* Winner banner */
.cd-winner-banner { margin-top:16px; padding:10px; background:rgba(var(--g1),.12); border:1px solid rgba(var(--g1),.25); border-radius:6px; text-align:center; font-size:14px; font-weight:700; color:rgb(var(--g1)); i{margin-right:6px;} }

/* ── Info grid ── */
.cd-info-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:10px; margin-bottom:16px; @media(max-width:480px){grid-template-columns:1fr;} }
.cd-info-item { background:rgb(var(--p3)); border:1px solid rgb(var(--n2)); border-radius:7px; padding:12px 14px; }
.cd-info-item__lbl { display:block; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:.06em; color:rgb(var(--n3)); margin-bottom:5px; }
.cd-info-item__val { font-size:13px; font-weight:600; color:rgb(var(--n8)); display:flex; align-items:center; gap:6px; i{color:rgb(var(--g1));font-size:12px;} }

/* ── Chat ── */
.cd-chat { background:rgb(var(--p2)); border:1px solid rgb(var(--n2)); border-radius:10px; overflow:hidden; }
.cd-chat__header { display:flex; align-items:center; gap:8px; padding:12px 16px; border-bottom:1px solid rgb(var(--n2)); font-size:13px; font-weight:700; color:rgb(var(--n8)); i{color:rgb(var(--g1));} }
.cd-chat__messages { height:300px; overflow-y:auto; padding:12px; display:flex; flex-direction:column; gap:10px; scrollbar-width:thin; scrollbar-color:rgb(var(--n2)) transparent; }
.cd-chat__loading,.cd-chat__empty { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:8px; flex:1; color:rgb(var(--n3)); i{font-size:28px;opacity:.3;} span{font-size:12px;} }
.cd-msg { display:flex; gap:8px; align-items:flex-start; }
.cd-msg--own { flex-direction:row-reverse; .cd-msg__body{align-items:flex-end;} .cd-msg__top{flex-direction:row-reverse;} .cd-msg__text{background:rgba(var(--g1),.12);color:rgb(var(--n8));} }
.cd-msg__avatar { width:28px; height:28px; border-radius:50%; background:linear-gradient(135deg,rgb(var(--g1)),rgba(var(--g1),.5)); color:rgb(var(--p1)); font-size:9px; font-weight:800; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.cd-msg__body { flex:1; min-width:0; display:flex; flex-direction:column; gap:3px; }
.cd-msg__top { display:flex; align-items:center; gap:6px; }
.cd-msg__name { font-size:11px; font-weight:700; color:rgb(var(--n8)); }
.cd-msg__time { font-size:10px; color:rgb(var(--n3)); }
.cd-msg__del { background:none; border:none; color:rgb(var(--n3)); cursor:pointer; font-size:10px; padding:1px; &:hover{color:rgb(var(--r1));} }
.cd-msg__text { font-size:12px; color:rgb(var(--n5)); background:rgba(var(--n8),.05); border-radius:6px; padding:7px 10px; margin:0; line-height:1.45; word-break:break-word; }
.cd-chat__input { display:flex; gap:7px; padding:10px; border-top:1px solid rgb(var(--n2)); }
.cd-chat__field { flex:1; height:36px; background:rgb(var(--p1)); border:1px solid rgb(var(--n2)); border-radius:5px; color:rgb(var(--n8)); font-size:13px; padding:0 12px; outline:none; font-family:var(--body-font); &::placeholder{color:rgb(var(--n3));} &:focus{border-color:rgb(var(--g1));} }
.cd-chat__send { width:36px; height:36px; background:rgb(var(--g1)); color:rgb(var(--p1)); border:none; border-radius:5px; cursor:pointer; display:flex; align-items:center; justify-content:center; font-size:14px; &:hover{background:rgba(var(--g1),.83);} &:disabled{opacity:.4;cursor:not-allowed;} }

/* ── Right column ── */
.cd-right { display:flex; flex-direction:column; gap:14px; }

/* Live banner (viewers) */
.cd-live-banner { display:flex; align-items:center; gap:10px; padding:12px 16px; background:rgba(var(--r1),.1); border:1px solid rgba(var(--r1),.28); border-radius:8px; font-size:13px; font-weight:600; color:rgb(var(--r1)); flex-wrap:wrap; }
.cd-live-banner strong { flex:1; }

/* Action card */
.cd-action-card { background:rgb(var(--p2)); border:1px solid rgb(var(--n2)); border-radius:10px; padding:18px; }
.cd-action-card__header { display:flex; align-items:center; gap:8px; font-size:14px; font-weight:700; color:rgb(var(--n8)); margin-bottom:12px; i{color:rgb(var(--g1));} }
.cd-action-card__desc { font-size:13px; color:rgb(var(--n3)); line-height:1.5; margin:0 0 14px; strong{color:rgb(var(--n8));} }
.cd-action-card__icon { font-size:36px; display:block; text-align:center; margin-bottom:10px; color:rgb(var(--g1)); }
.cd-action-card__winner { font-size:15px; font-weight:800; color:rgb(var(--g1)); text-align:center; margin:0; }
.cd-action-card--success { border-color:rgba(0,200,83,.3); background:rgba(0,200,83,.06); text-align:center; color:#00c853; p{margin:4px 0;} .cd-action-card__desc{color:rgba(0,200,83,.7);} }
.cd-action-card--gold { border-color:rgba(var(--g1),.35); background:rgba(var(--g1),.07); text-align:center; h4{color:rgb(var(--g1));margin:0 0 8px;} }

/* WS signal badge */
.cd-ws-badge { font-size:10px; font-weight:700; padding:2px 7px; border-radius:10px; color:#fff; margin-left:auto; }

/* Live status bar */
.cd-live-status { display:flex; align-items:center; justify-content:space-between; background:rgba(var(--r1),.12); border:1px solid rgba(var(--r1),.25); border-radius:6px; padding:8px 12px; font-size:13px; font-weight:700; color:rgb(var(--r1)); margin-bottom:10px; }
.cd-live-status--paused { background:rgba(255,180,0,.1); border-color:rgba(255,180,0,.3); color:#ffb400; }
.cd-live-status i { margin-right:5px; }

/* Video preview */
.cd-preview { aspect-ratio:16/9; background:#000; border-radius:6px; overflow:hidden; margin-bottom:10px; }
.cd-preview__video { width:100%; height:100%; object-fit:contain; display:block; }

/* Live controls */
.cd-live-controls { display:grid; grid-template-columns:repeat(4,1fr); gap:6px; margin-bottom:10px; }
.cd-tool { display:flex; flex-direction:column; align-items:center; gap:3px; padding:8px 4px; background:rgb(var(--p3)); border:1px solid rgb(var(--n2)); border-radius:6px; color:rgb(var(--n3)); font-size:10px; font-weight:600; cursor:pointer; transition:all .15s; i{font-size:14px;} &:hover{background:rgba(var(--n8),.1);color:rgb(var(--n8));} &--active{background:rgba(var(--g1),.12);border-color:rgba(var(--g1),.35);color:rgb(var(--g1));} }

/* Score input */
.cd-score-input { display:flex; gap:8px; }
.cd-input { flex:1; height:40px; background:rgb(var(--p1)); border:1px solid rgb(var(--n2)); border-radius:5px; color:rgb(var(--n8)); font-size:14px; padding:0 12px; outline:none; font-family:var(--body-font); &::placeholder{color:rgb(var(--n3));} &:focus{border-color:rgb(var(--g1));} &:disabled{opacity:.5;} }

/* Stop request */
.cd-stop-request { padding:12px; border-radius:6px; font-size:13px; margin-bottom:10px; p{margin:0 0 8px;color:rgb(var(--n5));strong{color:rgb(var(--n8));}} }
.cd-stop-request__actions { display:flex; gap:8px; }
.cd-stop-request--pending { background:rgba(255,180,0,.08); border:1px solid rgba(255,180,0,.25); }
.cd-stop-request--confirmed { background:rgba(var(--g1),.08); border:1px solid rgba(var(--g1),.22); color:rgb(var(--g1)); }
.cd-stop-request--ok { background:rgba(0,200,83,.08); border:1px solid rgba(0,200,83,.22); color:#00c853; }
.cd-stop-request--error { background:rgba(var(--r1),.08); border:1px solid rgba(var(--r1),.22); color:rgb(var(--r1)); }

/* Notice */
.cd-notice { padding:12px 14px; background:rgba(var(--g1),.07); border:1px solid rgba(var(--g1),.2); border-radius:8px; font-size:13px; color:rgb(var(--n3)); display:flex; align-items:center; gap:8px; i{color:rgb(var(--g1));} }

/* Alert */
.cd-alert { display:flex; align-items:flex-start; gap:8px; padding:10px 12px; border-radius:6px; font-size:13px; margin-top:10px; &--error{background:rgba(var(--r1),.1);border:1px solid rgba(var(--r1),.25);color:rgb(var(--r1));} }

/* Buttons */
.cd-btn { display:inline-flex; align-items:center; gap:7px; height:38px; padding:0 18px; border:none; border-radius:6px; font-size:13px; font-weight:700; cursor:pointer; transition:all .2s; white-space:nowrap; text-decoration:none; &:disabled{opacity:.5;cursor:not-allowed;} }
.cd-btn--primary { background:rgb(var(--g1)); color:rgb(var(--p1)); &:hover:not(:disabled){background:rgba(var(--g1),.83);} }
.cd-btn--danger { background:rgba(var(--r1),.12); color:rgb(var(--r1)); border:1px solid rgba(var(--r1),.3); &:hover:not(:disabled){background:rgb(var(--r1));color:#fff;} }
.cd-btn--ghost { background:rgba(var(--n8),.08); color:rgb(var(--n8)); border:1px solid rgba(var(--n8),.15); &:hover{background:rgba(var(--n8),.14);} }
.cd-btn--live { background:#e91916; color:#fff; box-shadow:0 3px 14px rgba(233,25,22,.3); &:hover:not(:disabled){background:#c41412;} }
.cd-btn--full { width:100%; justify-content:center; }
.cd-btn--sm { height:30px; padding:0 12px; font-size:12px; }

.cd-loading--sm { padding:12px; }
</style>
