<template>
  <div class="page-content-with-space">
    <!-- Challenge Details Section -->
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

              <!-- Challenge Details -->
              <div v-else-if="challenge">
                <!-- Header -->
                <div class="row mb-5">
                  <div class="col-12">
                    <button class="btn_secondary mb-4" @click="$router.push('/challenges')">
                      <i class="fas fa-arrow-left me-2"></i>
                      Back
                    </button>

                    <div class="defis_content">
                      <span class="hero_badge mb-3 d-inline-block">
                        ⚔️ Challenge Details
                      </span>
                      <h2 class="hero_title mb-4">
                        <span class="text_gradient">{{ challenge.game }}</span>
                      </h2>
                    </div>
                  </div>
                </div>

                <!-- Main Content -->
                <div class="row g-4">
                  <!-- Left Column - Challenge Info -->
                  <div class="col-lg-8">
                    <div class="defi_card n11-bg rounded-8 p-4 p-lg-6 mb-4">
                      <!-- Status and Time -->
                      <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                        <span
                          :class="['status', challenge.status === 'open' ? 'status-open' : challenge.status === 'completed' ? 'status-completed' : 'status-closed', 'px-4', 'py-2', 'rounded-pill', 'text-uppercase', 'fw-bold']">
                          {{ getStatusLabel(challenge.status) }}
                        </span>
                        <span class="delai n10-color fw-semibold fs-5">
                          {{ getTimeRemaining(challenge.expires_at) }}
                        </span>
                      </div>

                      <!-- Players -->
                      <div class="players_section mb-5">
                        <h4 class="fw-bold mb-4 text-center">Players</h4>
                        <div class="d-flex justify-content-between align-items-center flex-wrap gap-4">
                          <div class="player_card text-center flex-fill">
                            <div class="player_avatar mb-3">
                              <div class="avatar_circle">
                                <i class="fas fa-user"></i>
                              </div>
                            </div>
                            <h5 class="fw-bold mb-2">{{ challenge.creator.username }}</h5>
                            <span class="badge bg-primary">Creator</span>
                            <div v-if="challenge.creator_score !== null" class="mt-3">
                              <span class="fs-3 fw-bold text-primary">{{ challenge.creator_score }}</span>
                              <span class="text-white d-block small" style="opacity: 0.8;">Score</span>
                            </div>
                            <div v-else-if="challenge.status === 'accepted' || challenge.status === 'in_progress'"
                              class="mt-3">
                              <span class="text-white-50 small" style="opacity: 0.6;">Waiting for score...</span>
                            </div>
                          </div>

                          <div class="vs_section">
                            <div class="vs_circle">
                              <span class="vs_text">VS</span>
                            </div>
                          </div>

                          <div class="player_card text-center flex-fill">
                            <div class="player_avatar mb-3">
                              <div class="avatar_circle" :class="{ 'waiting': !challenge.opponent }">
                                <i class="fas" :class="challenge.opponent ? 'fa-user' : 'fa-user-clock'"></i>
                              </div>
                            </div>
                            <h5 class="fw-bold mb-2">
                              {{ challenge.opponent ? challenge.opponent.username : 'Waiting...' }}
                            </h5>
                            <span v-if="challenge.opponent" class="badge bg-success">Opponent</span>
                            <div v-if="challenge.opponent_score !== null" class="mt-3">
                              <span class="fs-3 fw-bold text-success">{{ challenge.opponent_score }}</span>
                              <span class="text-white d-block small" style="opacity: 0.8;">Score</span>
                            </div>
                            <div
                              v-else-if="challenge.opponent && (challenge.status === 'accepted' || challenge.status === 'in_progress')"
                              class="mt-3">
                              <span class="text-white-50 small" style="opacity: 0.6;">Waiting for score...</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Bet Amount -->
                      <div class="bet_section text-center p-4 rounded-4 mb-4"
                        style="background: linear-gradient(135deg, rgba(255, 159, 0, 0.2) 0%, rgba(255, 159, 0, 0.1) 100%);">
                        <span class="text-white d-block mb-2" style="opacity: 0.9;">Total bet</span>
                        <span class="fs-1 fw-bold n10-color">{{ (challenge.bet_amount * 2).toLocaleString() }}
                          EBT</span>
                        <span class="text-white d-block mt-2 small" style="opacity: 0.8;">({{
                          challenge.bet_amount.toLocaleString() }} EBT per player)</span>
                      </div>

                      <!-- Challenge Info -->
                      <div class="info_section">
                        <h5 class="fw-bold mb-3">Challenge Information</h5>
                        <div class="row g-3">
                          <div class="col-md-6">
                            <div class="info_item p-3 rounded-3 n11-bg">
                              <span class="text-white small d-block mb-1" style="opacity: 0.8;">Game</span>
                              <span class="fw-bold text-white">{{ challenge.game }}</span>
                            </div>
                          </div>
                          <div class="col-md-6">
                            <div class="info_item p-3 rounded-3 n11-bg">
                              <span class="text-white small d-block mb-1" style="opacity: 0.8;">Created on</span>
                              <span class="fw-bold text-white">{{ formatDate(challenge.created_at) }}</span>
                            </div>
                          </div>
                          <div v-if="challenge.expires_at" class="col-md-6">
                            <div class="info_item p-3 rounded-3 n11-bg">
                              <span class="text-white small d-block mb-1" style="opacity: 0.8;">Expires on</span>
                              <span class="fw-bold text-white">{{ formatDate(challenge.expires_at) }}</span>
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
                  </div>

                  <!-- Right Column - Actions -->
                  <div class="col-lg-4">
                    <div class="defi_card n11-bg rounded-8 p-4 p-lg-6">
                      <h5 class="fw-bold mb-4">Actions</h5>

                      <!-- Accept Challenge -->
                      <div
                        v-if="challenge.status === 'open' && challenge.creator.id !== currentUserId && !challenge.opponent"
                        class="mb-4">
                        <button class="btn_primary w-100 py-3" @click="acceptChallenge">
                          <i class="fas fa-check-circle me-2"></i>Accept Challenge
                        </button>
                        <p class="text-white small mt-2 text-center" style="opacity: 0.8;">
                          You will need to bet {{ challenge.bet_amount.toLocaleString() }} EBT to accept
                        </p>
                      </div>

                      <!-- Cancel Challenge (Creator only) -->
                      <div v-if="challenge.status === 'open' && challenge.creator.id === currentUserId" class="mb-4">
                        <button class="btn_see_details w-100 py-3" style="background-color: #991b1b; color: white;"
                          @click="cancelChallenge">
                          <i class="fas fa-times-circle me-2"></i>Cancel Challenge
                        </button>
                        <p class="text-white small mt-2 text-center" style="opacity: 0.8;">Your bet will be refunded</p>
                      </div>

                      <!-- Live Streaming (Creator Only) -->
                      <div v-if="isCreator && (challenge.status === 'accepted' || challenge.status === 'in_progress')"
                        class="mb-4">
                        <h6 class="fw-bold mb-3 text-white">
                          <i class="fas fa-broadcast-tower me-2"></i>Live Streaming Control
                        </h6>

                        <!-- Not Live -->
                        <div v-if="!challenge.is_live && !recordingError" class="mb-3">
                          <button class="btn_primary w-100 py-3" @click="startScreenRecording"
                            :disabled="startingRecording || !isCreator">
                            <span v-if="startingRecording">
                              <i class="fas fa-spinner fa-spin me-2"></i>Starting Live...
                            </span>
                            <span v-else>
                              <i class="fas fa-video me-2"></i>Start Live Stream
                            </span>
                          </button>
                          <p class="text-white-50 small mt-2 text-center" style="opacity: 0.8;">
                            Start a live stream of your challenge gameplay
                          </p>
                        </div>

                        <!-- Live State -->
                        <div v-else-if="challenge.is_live" class="mb-3">
                          <div class="alert d-flex align-items-center justify-content-between mb-3"
                            :class="challenge.is_live_paused ? 'alert-warning' : 'alert-danger'">
                            <span>
                              <i v-if="!challenge.is_live_paused" class="fas fa-circle me-2"
                                style="animation: pulse 2s infinite;"></i>
                              <i v-else class="fas fa-pause me-2"></i>
                              <strong>{{ challenge.is_live_paused ? 'EN PAUSE' : 'LIVE' }}</strong>
                              — {{ challenge.viewer_count || 0 }} viewers
                            </span>
                            <!-- Statut signal WS -->
                            <span class="badge ms-2" :style="{ background: wsStreamerStatusColor, fontSize: '.7rem' }">
                              {{ wsStreamerStatusLabel }}
                            </span>
                          </div>

                          <!-- Preview locale -->
                          <div class="mb-3 rounded overflow-hidden" style="background:#000; aspect-ratio:16/9;">
                            <video ref="localVideoEl" autoplay muted playsinline class="w-100 h-100"
                              style="object-fit:contain;"></video>
                          </div>

                          <!-- Lien spectateurs -->
                          <div class="defi_card n11-bg rounded-8 p-3 mb-3">
                            <div class="mb-3">
                              <label class="text-white small d-block mb-1">Lien public pour les spectateurs</label>
                              <div class="input-group">
                                <input type="text" :value="getPublicStreamUrl()"
                                  class="form-control n11-bg text-white border-secondary small" readonly />
                                <button class="btn btn-sm btn-secondary" @click="copyStreamUrl" title="Copy URL">
                                  <i class="fas fa-copy"></i>
                                </button>
                              </div>
                            </div>
                            <div class="d-flex gap-2 mb-2">
                              <button class="btn btn-sm btn-success flex-fill" @click="openStreamInNewTab">
                                <i class="fas fa-external-link-alt me-1"></i>Voir sur /streams
                              </button>
                              <button class="btn btn-sm btn-info flex-fill" @click="refreshViewerCount">
                                <i class="fas fa-sync-alt me-1"></i>Stats
                              </button>
                            </div>
                            <div class="d-flex gap-2">
                              <button v-if="!challenge.is_live_paused" class="btn btn-sm btn-warning flex-fill"
                                @click="pauseScreenRecording">
                                <i class="fas fa-pause me-1"></i>Pause
                              </button>
                              <button v-else class="btn btn-sm btn-success flex-fill" @click="resumeScreenRecording">
                                <i class="fas fa-play me-1"></i>Reprendre
                              </button>
                            </div>
                          </div>

                          <!-- Stop -->
                          <button class="btn_see_details w-100 py-3" style="background-color: #991b1b; color: white;"
                            @click="stopScreenRecording" :disabled="stoppingRecording">
                            <span v-if="stoppingRecording">
                              <i class="fas fa-spinner fa-spin me-2"></i>Stopping...
                            </span>
                            <span v-else>
                              <i class="fas fa-stop me-2"></i>Stop Live Stream
                            </span>
                          </button>
                        </div>

                        <div v-if="recordingError" class="alert alert-danger mt-3 small">{{ recordingError }}</div>
                      </div>

                      <!-- View Live Stream (For Opponent and Viewers) -->
                      <div v-if="challenge.is_live && !isCreator" class="mb-4">
                        <div class="alert alert-danger mb-3">
                          <i class="fas fa-circle me-2" style="animation: pulse 2s infinite;"></i>
                          <strong>LIVE</strong> - {{ challenge.viewer_count || 0 }} viewers
                        </div>
                        <button class="btn_primary w-100 py-3" @click="viewLiveStream">
                          <i class="fas fa-play me-2"></i>Watch Live Stream
                        </button>
                      </div>

                      <!-- Submit Score -->
                      <div
                        v-if="(challenge.status === 'accepted' || challenge.status === 'in_progress') && isParticipant && !hasSubmittedScore"
                        class="mb-4">
                        <h6 class="fw-bold mb-3">Submit your score</h6>
                        <div class="mb-3">
                          <input v-model.number="myScore" type="number"
                            class="form-control n11-bg text-white border-secondary" placeholder="Your score" min="0"
                            :disabled="submittingScore" />
                        </div>
                        <button class="btn_primary w-100 py-3" @click="submitScore"
                          :disabled="submittingScore || !myScore">
                          <span v-if="submittingScore">Submitting...</span>
                          <span v-else><i class="fas fa-paper-plane me-2"></i>Submit score</span>
                        </button>
                        <div v-if="scoreError" class="alert alert-danger mt-3 small">{{ scoreError }}</div>
                      </div>

                      <!-- Score Submitted -->
                      <div v-if="hasSubmittedScore && challenge.status !== 'completed'" class="mb-4">
                        <div class="alert alert-success text-center">
                          <i class="fas fa-check-circle me-2"></i>
                          <strong>Your score has been submitted!</strong>
                          <div class="mt-2"><span class="fs-4 fw-bold">{{ getMySubmittedScore() }}</span></div>
                          <p class="mb-0 small mt-2" style="opacity: 0.8;">
                            Waiting for {{ getOtherPlayerName() }} to submit their score...
                          </p>
                        </div>
                      </div>

                      <!-- Challenge Completed -->
                      <div v-if="challenge.status === 'completed'" class="mb-4">
                        <div class="alert alert-success text-center">
                          <i class="fas fa-trophy fs-3 mb-2 d-block"></i>
                          <strong>Challenge completed!</strong>
                          <div v-if="challenge.creator_score !== null && challenge.opponent_score !== null"
                            class="mt-3">
                            <div class="fs-4 fw-bold">{{ getWinner() }}</div>
                          </div>
                        </div>
                      </div>

                      <!-- Challenge Cancelled -->
                      <div v-if="challenge.status === 'cancelled'" class="mb-4">
                        <div class="alert alert-warning text-center">
                          <i class="fas fa-ban fs-3 mb-2 d-block"></i>
                          <strong>Challenge cancelled</strong>
                        </div>
                      </div>

                      <!-- Not Participant -->
                      <div v-if="!isParticipant && challenge.status !== 'open'" class="alert alert-info">
                        <i class="fas fa-info-circle me-2"></i>
                        You are not a participant in this challenge
                      </div>

                      <!-- Stop Challenge Request -->
                      <div
                        v-if="isParticipant && challenge.opponent && (challenge.status === 'accepted' || challenge.status === 'in_progress')"
                        class="mt-4">
                        <div class="defi_card n11-bg rounded-8 p-4">
                          <h5 class="text-white mb-3">
                            <i class="fas fa-stop-circle me-2"></i>Stop Challenge
                          </h5>
                          <div v-if="stopRequestLoading" class="text-center py-3">
                            <div class="spinner-border spinner-border-sm text-primary"></div>
                          </div>
                          <div v-else-if="stopRequest">
                            <div v-if="stopRequest.status === 'pending'" class="alert alert-warning">
                              <div class="d-flex justify-content-between align-items-center">
                                <div>
                                  <i class="fas fa-clock me-2"></i>
                                  <strong>Stop Request Pending</strong>
                                  <p class="mb-0 small">
                                    <span v-if="stopRequest.initiator_id === currentUserId">
                                      You requested to stop. Waiting for {{ challenge.creator.id === currentUserId ?
                                        challenge.opponent?.username : challenge.creator?.username }} to confirm.
                                    </span>
                                    <span v-else>
                                      {{ stopRequest.initiator?.username }} requested to stop. Do you want to confirm?
                                    </span>
                                  </p>
                                </div>
                                <div class="d-flex gap-2">
                                  <button v-if="stopRequest.initiator_id === currentUserId"
                                    class="btn btn-sm btn-secondary" @click="cancelStopRequest"
                                    :disabled="cancellingStop">
                                    <i class="fas fa-times me-1"></i>Cancel
                                  </button>
                                  <button v-else class="btn btn-sm btn-success" @click="confirmStopRequest"
                                    :disabled="confirmingStop">
                                    <i class="fas fa-check me-1"></i>Confirm
                                  </button>
                                </div>
                              </div>
                            </div>
                            <div v-else-if="stopRequest.status === 'confirmed'" class="alert alert-info">
                              <i class="fas fa-check-circle me-2"></i>
                              <strong>Stop Request Confirmed</strong>
                              <p class="mb-0 small">Both players have confirmed. Waiting for admin approval to complete
                                the challenge and distribute winnings.</p>
                            </div>
                            <div v-else-if="stopRequest.status === 'approved'" class="alert alert-success">
                              <i class="fas fa-check-double me-2"></i>
                              <strong>Challenge Stopped</strong>
                              <p class="mb-0 small">The challenge has been stopped and completed by admin.</p>
                            </div>
                            <div v-else-if="stopRequest.status === 'rejected'" class="alert alert-danger">
                              <i class="fas fa-times-circle me-2"></i>
                              <strong>Stop Request Rejected</strong>
                              <p class="mb-0 small">The admin has rejected the stop request. The challenge continues.
                              </p>
                            </div>
                          </div>
                          <div v-else>
                            <p class="text-white-50 mb-3">
                              If both players agree to stop the challenge, click the button below. The admin will review
                              and complete the challenge.
                            </p>
                            <button class="btn_secondary w-100" @click="requestStopChallenge"
                              :disabled="requestingStop">
                              <span v-if="requestingStop">Requesting...</span>
                              <span v-else><i class="fas fa-stop-circle me-2"></i>Request to Stop Challenge</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      <!-- Challenge Chat -->
                      <div v-if="isParticipant && challenge.opponent" class="mt-5">
                        <h5 class="text-white mb-3">
                          <i class="fas fa-comments me-2"></i>Challenge Discussion
                        </h5>
                        <div class="defi_card n11-bg rounded-8 p-4">
                          <div class="chat-container"
                            style="height: 400px; overflow-y: auto; background: rgba(0,0,0,0.2); border-radius: 10px; padding: 1rem; margin-bottom: 1rem;">
                            <div v-if="loadingMessages" class="text-center py-3">
                              <div class="spinner-border spinner-border-sm text-primary"></div>
                            </div>
                            <div v-else-if="messages.length > 0">
                              <div v-for="message in messages" :key="message.id" class="mb-3 p-3 rounded"
                                :style="{ background: message.user_id === currentUserId ? 'rgba(255,159,0,0.2)' : 'rgba(255,255,255,0.05)' }">
                                <div class="d-flex justify-content-between align-items-start mb-2">
                                  <div>
                                    <strong class="text-white">{{ message.user?.username }}</strong>
                                    <small class="text-white-50 ms-2">{{ formatTime(message.created_at) }}</small>
                                  </div>
                                  <button v-if="message.user_id === currentUserId"
                                    class="btn btn-sm btn-link text-danger p-0" @click="deleteMessage(message.id)"
                                    title="Delete message" style="text-decoration: none;">
                                    <i class="fas fa-trash"></i>
                                  </button>
                                </div>
                                <p class="text-white mb-0">{{ message.message }}</p>
                              </div>
                            </div>
                            <div v-else class="text-center py-5 text-white-50">
                              <i class="fas fa-comments fs-1 mb-3 d-block"></i>
                              No messages yet. Start the conversation!
                            </div>
                          </div>
                          <form @submit.prevent="sendMessage">
                            <div class="d-flex gap-2">
                              <input v-model="newMessage" type="text"
                                class="form-control n11-bg text-white border-secondary"
                                placeholder="Type your message..." :disabled="sendingMessage" maxlength="1000" />
                              <button type="submit" class="btn_primary"
                                :disabled="sendingMessage || !newMessage.trim()">
                                <i class="fas fa-paper-plane"></i>
                              </button>
                            </div>
                          </form>
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
import { ref, onMounted, computed, onUnmounted, watch, nextTick } from "vue";
import { useRouter, useRoute } from "vue-router";
import apiClient from "@/utils/axios";
// ✅ PeerJS supprimé — on utilise notre WS signaling (stream-server.js)

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

const connectSignaling = (stream: MediaStream) => {
  if (!challenge.value) return;
  const token = localStorage.getItem('auth_token') || '';
  signalingWs = new WebSocket(`${WS_BASE}/stream/${challenge.value.id}?token=${encodeURIComponent(token)}`);

  signalingWs.onopen = () => { wsStreamerConnected.value = true; };
  signalingWs.onerror = () => { wsStreamerConnected.value = false; recordingError.value = 'Erreur WebSocket signal.'; };
  signalingWs.onclose = () => { wsStreamerConnected.value = false; };

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
          await peerConnections[msg.viewerId].setRemoteDescription(new RTCSessionDescription(msg.sdp));
        }
        break;
      case 'ice-candidate':
        if (peerConnections[msg.viewerId] && msg.candidate) {
          try { await peerConnections[msg.viewerId].addIceCandidate(new RTCIceCandidate(msg.candidate)); } catch { }
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
  pc.oniceconnectionstatechange = () => { if (pc.iceConnectionState === 'failed') pc.restartIce(); };
  pc.onconnectionstatechange = () => {
    if (pc.connectionState === 'failed' || pc.connectionState === 'closed') closePeer(viewerId);
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

const cleanupSignaling = () => {
  Object.keys(peerConnections).forEach(closePeer);
  if (signalingWs) { signalingWs.close(); signalingWs = null; }
  wsStreamerConnected.value = false;
};

// ── Computed ──────────────────────────────────────────────────────────────────
const isParticipant = computed(() => {
  if (!challenge.value || !currentUserId.value) return false;
  return challenge.value.creator.id === currentUserId.value ||
    (challenge.value.opponent && challenge.value.opponent.id === currentUserId.value);
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
  if (challenge.value.creator.id === currentUserId.value) return challenge.value.opponent?.username || "the opponent";
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
  if (!expiresAt) return "⏱️ No expiration";
  const diff = new Date(expiresAt).getTime() - Date.now();
  if (diff <= 0) return "⏱️ Expired";
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(hours / 24);
  if (days > 0) return `⏱️ ${days} day${days > 1 ? 's' : ''} remaining`;
  if (hours > 0) return `⏱️ ${hours}h remaining`;
  return `⏱️ ${Math.floor(diff / 60000)}min remaining`;
};

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('en-US', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

const formatTime = (dateString: string) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
};

const getWinner = () => {
  if (!challenge.value || challenge.value.creator_score === null || challenge.value.opponent_score === null) return "";
  if (challenge.value.creator_score > challenge.value.opponent_score) return `${challenge.value.creator.username} won!`;
  if (challenge.value.opponent_score > challenge.value.creator_score) return `${challenge.value.opponent?.username} won!`;
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
  viewerCountInterval = setInterval(() => { if (challenge.value?.is_live) refreshViewerCount(); }, 30000);
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
    if (localVideoEl.value) { localVideoEl.value.srcObject = stream; localVideoEl.value.muted = true; }

    // Notifier Laravel
    const response = await apiClient.post(`/challenges/${challenge.value.id}/screen-recording/start`, {});
    if (!response.data.success) throw new Error(response.data.message || "Failed to start recording");

    isRecording.value = true;
    if (challenge.value) {
      challenge.value.is_live = true;
      challenge.value.viewer_count = 0;
    }

    // Arrêt auto si l'utilisateur ferme le partage d'écran
    stream.getVideoTracks()[0].addEventListener('ended', () => stopScreenRecording());

    // ✅ WS signaling — connecte le serveur pour relayer l'offre aux viewers
    connectSignaling(stream);

    startViewerCountPolling();

  } catch (err: any) {
    if (screenStream.value) { screenStream.value.getTracks().forEach(t => t.stop()); screenStream.value = null; }
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

    if (screenStream.value) { screenStream.value.getTracks().forEach(t => t.stop()); screenStream.value = null; }
    if (localVideoEl.value) localVideoEl.value.srcObject = null;

    const response = await apiClient.post(`/challenges/${challenge.value.id}/screen-recording/stop`, {});
    if (response.data.success) {
      isRecording.value = false;
      if (challenge.value) { challenge.value.is_live = false; challenge.value.viewer_count = 0; }
      creatorStreamUrl.value = null;
      stopViewerCountPolling();
      // ✅ Fermer WS signaling et tous les peers
      cleanupSignaling();
    } else {
      throw new Error(response.data.message || "Failed to stop recording");
    }
  } catch (err: any) {
    recordingError.value = err.response?.data?.message || err.message || "Failed to stop screen recording";
  } finally {
    stoppingRecording.value = false;
  }
};

const pauseScreenRecording = async () => {
  if (!challenge.value?.is_live) return;
  try {
    const res = await apiClient.post(`/challenges/${challenge.value.id}/screen-recording/pause`, {});
    if (res.data.success && challenge.value) {
      challenge.value.is_live_paused = true;
      screenStream.value?.getTracks().forEach(t => { t.enabled = false; });
    }
  } catch { }
};

const resumeScreenRecording = async () => {
  if (!challenge.value?.is_live) return;
  try {
    const res = await apiClient.post(`/challenges/${challenge.value.id}/screen-recording/resume`, {});
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
      if (challenge.value && isCreator.value && challenge.value.is_live) { isRecording.value = true; startViewerCountPolling(); }
      else stopViewerCountPolling();

    } else { error.value = response.data.message || "Error loading challenge"; }
  } catch (err: any) {
    if (err.response?.status === 404) error.value = "Challenge not found";
    else error.value = err.response?.data?.message || "Error loading challenge";
  } finally { loading.value = false; }
};

const loadMessages = async () => {
  if (!challenge.value || !isParticipant.value) return;
  try {
    loadingMessages.value = true;
    const res = await apiClient.get(`/challenges/${challenge.value.id}/messages`);
    if (res.data.success) {
      messages.value = (res.data.data.data || res.data.data || []).reverse();
      setTimeout(() => { const c = document.querySelector('.chat-container'); if (c) c.scrollTop = c.scrollHeight; }, 100);
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
    const res = await apiClient.post(`/challenges/${challenge.value.id}/messages`, { message: newMessage.value.trim() });
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
    const res = await apiClient.post(`/challenges/${challenge.value.id}/request-stop`, { reason: null });
    if (res.data.success) { await loadStopRequest(); alert(res.data.message || "Stop request created."); }
    else alert(res.data.message || "Error");
  } catch (err: any) { alert(err.response?.data?.message || "Error"); } finally { requestingStop.value = false; }
};

const confirmStopRequest = async () => {
  if (!challenge.value || !confirm("Confirm stopping this challenge?")) return;
  try {
    confirmingStop.value = true;
    const res = await apiClient.post(`/challenges/${challenge.value.id}/request-stop`, {});
    if (res.data.success) { await loadStopRequest(); alert(res.data.message || "Confirmed."); }
  } catch (err: any) { alert(err.response?.data?.message || "Error"); } finally { confirmingStop.value = false; }
};

const cancelStopRequest = async () => {
  if (!challenge.value || !confirm("Cancel the stop request?")) return;
  try {
    cancellingStop.value = true;
    const res = await apiClient.delete(`/challenges/${challenge.value.id}/stop-request`);
    if (res.data.success) { stopRequest.value = null; alert("Stop request cancelled."); }
  } catch (err: any) { alert(err.response?.data?.message || "Error"); } finally { cancellingStop.value = false; }
};

const getCurrentUser = async () => {
  try {
    const res = await apiClient.get("/user");
    if (res.data?.id) currentUserId.value = res.data.id;
  } catch { }
};

const acceptChallenge = async () => {
  if (!challenge.value) return;
  if (!localStorage.getItem("auth_token")) { alert("Please log in to accept challenges"); return; }
  if (!confirm(`Accept this challenge? You will need to bet ${challenge.value.bet_amount.toLocaleString()} EBT.`)) return;
  try {
    const res = await apiClient.post(`/challenges/${challenge.value.id}/accept`, {});
    if (res.data.success) { await loadChallenge(); alert("Challenge accepted successfully!"); }
    else alert(res.data.message || "Error accepting challenge");
  } catch (err: any) { alert(err.response?.data?.message || "Error accepting challenge"); }
};

const cancelChallenge = async () => {
  if (!challenge.value || !confirm("Cancel this challenge? Your bet will be refunded.")) return;
  try {
    const res = await apiClient.post(`/challenges/${challenge.value.id}/cancel`, {});
    if (res.data.success) { await loadChallenge(); alert("Challenge cancelled successfully!"); }
  } catch (err: any) { alert(err.response?.data?.message || "Error cancelling challenge"); }
};

const submitScore = async () => {
  if (!challenge.value || myScore.value === null) return;
  try {
    submittingScore.value = true; scoreError.value = "";
    const res = await apiClient.post(`/challenges/${challenge.value.id}/scores`, { score: myScore.value });
    if (res.data.success) {
      const submitted = myScore.value; myScore.value = null;
      if (challenge.value) {
        if (challenge.value.creator.id === currentUserId.value) challenge.value.creator_score = submitted;
        else if (challenge.value.opponent?.id === currentUserId.value) challenge.value.opponent_score = submitted;
        challenge.value.status = (challenge.value.creator_score !== null && challenge.value.opponent_score !== null) ? 'completed' : 'in_progress';
      }
      await loadChallenge();
    } else { scoreError.value = res.data.message || "Error submitting score"; }
  } catch (err: any) { scoreError.value = err.response?.data?.message || "Error submitting score"; }
  finally { submittingScore.value = false; }
};

watch(() => challenge.value?.status, (newStatus) => {
  if (newStatus === 'completed' && isRecording.value && challenge.value) stopScreenRecording();
});

onMounted(() => { getCurrentUser(); loadChallenge(); });

onUnmounted(() => {
  if (messagePollingInterval) clearInterval(messagePollingInterval);
  stopViewerCountPolling();
  // ✅ Fermer WS signaling et tous les peers
  cleanupSignaling();
  if (screenStream.value) { screenStream.value.getTracks().forEach(t => t.stop()); screenStream.value = null; }
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

.btn_see_details {
  background-color: #FF9F00;
  color: #000;
  border: none;
  transition: 0.3s;
  cursor: pointer;
}

.defi_card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.status {
  font-size: 0.85rem;
  letter-spacing: 0.5px;
}

.status-open {
  background-color: #1f9d55;
  color: #fff;
}

.status-completed {
  background-color: #2563eb;
  color: #fff;
}

.status-closed {
  background-color: #991b1b;
  color: #fff;
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

.n10-color {
  color: #FF9F00;
}

.n11-bg {
  background: rgba(255, 255, 255, 0.05);
}

.player_card {
  padding: 1.5rem;
}

.avatar_circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  font-size: 2rem;
  color: white;
}

.avatar_circle.waiting {
  background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
  opacity: 0.7;
}

.vs_section {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 2rem;
}

.vs_circle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(220, 38, 38, 0.2);
  border: 3px solid #dc2626;
  display: flex;
  align-items: center;
  justify-content: center;
}

.vs_text {
  font-size: 1.5rem;
  font-weight: 800;
  color: #dc2626;
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

.chat-container {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 159, 0, 0.5) rgba(0, 0, 0, 0.2);
}

.chat-container::-webkit-scrollbar {
  width: 6px;
}

.chat-container::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
}

.chat-container::-webkit-scrollbar-thumb {
  background: rgba(255, 159, 0, 0.5);
  border-radius: 10px;
}

@media (max-width: 768px) {
  .page-content-with-space {
    padding-top: 60px;
  }

  .vs_section {
    padding: 1rem 0;
  }

  .hero_title {
    font-size: 1.8rem;
  }
}
</style>