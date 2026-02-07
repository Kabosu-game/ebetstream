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
                        <span :class="['status', challenge.status === 'open' ? 'status-open' : challenge.status === 'completed' ? 'status-completed' : 'status-closed', 'px-4', 'py-2', 'rounded-pill', 'text-uppercase', 'fw-bold']">
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
                            <div v-else-if="challenge.status === 'accepted' || challenge.status === 'in_progress'" class="mt-3">
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
                            <div v-else-if="challenge.opponent && (challenge.status === 'accepted' || challenge.status === 'in_progress')" class="mt-3">
                              <span class="text-white-50 small" style="opacity: 0.6;">Waiting for score...</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Bet Amount -->
                      <div class="bet_section text-center p-4 rounded-4 mb-4" style="background: linear-gradient(135deg, rgba(255, 159, 0, 0.2) 0%, rgba(255, 159, 0, 0.1) 100%);">
                        <span class="text-white d-block mb-2" style="opacity: 0.9;">Total bet</span>
                        <span class="fs-1 fw-bold n10-color">{{ (challenge.bet_amount * 2).toLocaleString() }} EBT</span>
                        <span class="text-white d-block mt-2 small" style="opacity: 0.8;">({{ challenge.bet_amount.toLocaleString() }} EBT per player)</span>
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
                      <div v-if="challenge.status === 'open' && challenge.creator.id !== currentUserId && !challenge.opponent" class="mb-4">
                        <button class="btn_primary w-100 py-3" @click="acceptChallenge">
                          <i class="fas fa-check-circle me-2"></i>
                          Accept Challenge
                        </button>
                        <p class="text-white small mt-2 text-center" style="opacity: 0.8;">
                          You will need to bet {{ challenge.bet_amount.toLocaleString() }} EBT to accept
                        </p>
                      </div>

                      <!-- Cancel Challenge (Creator only) -->
                      <div v-if="challenge.status === 'open' && challenge.creator.id === currentUserId" class="mb-4">
                        <button class="btn_see_details w-100 py-3" style="background-color: #991b1b; color: white;" @click="cancelChallenge">
                          <i class="fas fa-times-circle me-2"></i>
                          Cancel Challenge
                        </button>
                        <p class="text-white small mt-2 text-center" style="opacity: 0.8;">
                          Your bet will be refunded
                        </p>
                      </div>

                      <!-- Live Streaming (Creator Only) - Défi démarré (accepté ou en cours) -->
                      <div v-if="isCreator && (challenge.status === 'accepted' || challenge.status === 'in_progress')" class="mb-4">
                        <h6 class="fw-bold mb-3 text-white">
                          <i class="fas fa-broadcast-tower me-2"></i>Live Streaming Control
                        </h6>
                        
                        <!-- Not Live State -->
                        <div v-if="!challenge.is_live && !recordingError" class="mb-3">
                          <button 
                            class="btn_primary w-100 py-3" 
                            @click="startScreenRecording"
                            :disabled="startingRecording || !isCreator"
                          >
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
                          <p v-if="!isCreator" class="text-warning small mt-2 text-center">
                            Only the challenge creator can start the live stream
                          </p>
                        </div>
                        
                        <!-- Live State with Professional Tools -->
                        <div v-else-if="challenge.is_live" class="mb-3">
                          <div class="alert d-flex align-items-center justify-content-between mb-3" :class="challenge.is_live_paused ? 'alert-warning' : 'alert-danger'">
                            <span>
                              <i v-if="!challenge.is_live_paused" class="fas fa-circle me-2" style="animation: pulse 2s infinite;"></i>
                              <i v-else class="fas fa-pause me-2"></i>
                              <strong>{{ challenge.is_live_paused ? 'EN PAUSE' : 'LIVE' }}</strong> - {{ challenge.viewer_count || 0 }} viewers
                            </span>
                          </div>
                          
                          <!-- Professional Live Control Panel -->
                          <div class="defi_card n11-bg rounded-8 p-3 mb-3">
                            <h6 class="fw-bold mb-3 text-white">
                              <i class="fas fa-sliders-h me-2"></i>Live Control Panel
                            </h6>
                            
                            <!-- Stream Info -->
                            <div class="mb-3">
                              <label class="text-white small d-block mb-1">Lien public pour les spectateurs</label>
                              <div class="input-group">
                                <input 
                                  type="text" 
                                  :value="getPublicStreamUrl()" 
                                  class="form-control n11-bg text-white border-secondary small"
                                  readonly
                                  id="streamUrlInput"
                                />
                                <button 
                                  class="btn btn-sm btn-secondary" 
                                  @click="copyStreamUrl"
                                  title="Copy URL"
                                >
                                  <i class="fas fa-copy"></i>
                                </button>
                              </div>
                            </div>
                            
                            <!-- RTMP Info (for OBS) -->
                            <div class="mb-3">
                              <label class="text-white small d-block mb-1">RTMP URL (for OBS)</label>
                              <div class="input-group">
                                <input 
                                  type="text" 
                                  :value="challenge.rtmp_url || ''" 
                                  class="form-control n11-bg text-white border-secondary small"
                                  readonly
                                  id="rtmpUrlInput"
                                />
                                <button 
                                  class="btn btn-sm btn-secondary" 
                                  @click="copyRtmpUrl"
                                  title="Copy RTMP URL"
                                >
                                  <i class="fas fa-copy"></i>
                                </button>
                              </div>
                            </div>
                            
                            <!-- Stream Key -->
                            <div class="mb-3">
                              <label class="text-white small d-block mb-1">Stream Key</label>
                              <div class="input-group">
                                <input 
                                  type="password" 
                                  :value="challenge.stream_key || ''" 
                                  class="form-control n11-bg text-white border-secondary small"
                                  readonly
                                  id="streamKeyInput"
                                  ref="streamKeyInput"
                                />
                                <button 
                                  class="btn btn-sm btn-secondary" 
                                  @click="toggleStreamKeyVisibility"
                                  title="Show/Hide Key"
                                >
                                  <i class="fas" :class="showStreamKey ? 'fa-eye-slash' : 'fa-eye'"></i>
                                </button>
                                <button 
                                  class="btn btn-sm btn-secondary" 
                                  @click="copyStreamKey"
                                  title="Copy Key"
                                >
                                  <i class="fas fa-copy"></i>
                                </button>
                              </div>
                            </div>
                            
                            <!-- Quick Actions -->
                            <div class="d-flex gap-2 mb-2">
                              <button 
                                class="btn btn-sm btn-success flex-fill"
                                @click="openStreamInNewTab"
                              >
                                <i class="fas fa-external-link-alt me-1"></i>Voir sur /streams
                              </button>
                              <button 
                                class="btn btn-sm btn-info flex-fill"
                                @click="refreshViewerCount"
                              >
                                <i class="fas fa-sync-alt me-1"></i>Stats
                              </button>
                            </div>
                            <!-- Pause / Resume -->
                            <div class="d-flex gap-2">
                              <button 
                                v-if="!challenge.is_live_paused"
                                class="btn btn-sm btn-warning flex-fill"
                                @click="pauseScreenRecording"
                              >
                                <i class="fas fa-pause me-1"></i>Pause
                              </button>
                              <button 
                                v-else
                                class="btn btn-sm btn-success flex-fill"
                                @click="resumeScreenRecording"
                              >
                                <i class="fas fa-play me-1"></i>Reprendre
                              </button>
                            </div>
                          </div>
                          
                          <!-- Stop Live Button -->
                          <button 
                            class="btn_see_details w-100 py-3" 
                            style="background-color: #991b1b; color: white;" 
                            @click="stopScreenRecording"
                            :disabled="stoppingRecording"
                          >
                            <span v-if="stoppingRecording">
                              <i class="fas fa-spinner fa-spin me-2"></i>Stopping...
                            </span>
                            <span v-else>
                              <i class="fas fa-stop me-2"></i>Stop Live Stream
                            </span>
                          </button>
                          
                          <!-- Local Preview -->
                          <video 
                            v-if="recordingStreamUrl && recordingVideoElement" 
                            ref="recordingVideoElement"
                            autoplay
                            muted
                            class="w-100 rounded mt-3"
                            style="max-height: 300px; background: #000;"
                          ></video>
                        </div>
                        
                        <div v-if="recordingError" class="alert alert-danger mt-3 small">
                          {{ recordingError }}
                        </div>
                      </div>
                      
                      <!-- View Live Stream (For Opponent and Viewers) -->
                      <div v-if="challenge.is_live && !isCreator" class="mb-4">
                        <div class="alert alert-danger mb-3">
                          <i class="fas fa-circle me-2" style="animation: pulse 2s infinite;"></i>
                          <strong>LIVE</strong> - {{ challenge.viewer_count || 0 }} viewers
                        </div>
                        <button 
                          class="btn_primary w-100 py-3" 
                          @click="viewLiveStream"
                        >
                          <i class="fas fa-play me-2"></i>Watch Live Stream
                        </button>
                      </div>

                      <!-- Submit Score -->
                      <div v-if="(challenge.status === 'accepted' || challenge.status === 'in_progress') && isParticipant && !hasSubmittedScore" class="mb-4">
                        <h6 class="fw-bold mb-3">Submit your score</h6>
                        <div class="mb-3">
                          <input 
                            v-model.number="myScore"
                            type="number" 
                            class="form-control n11-bg text-white border-secondary" 
                            placeholder="Your score"
                            min="0"
                            :disabled="submittingScore"
                          />
                        </div>
                        <button 
                          class="btn_primary w-100 py-3" 
                          @click="submitScore"
                          :disabled="submittingScore || !myScore"
                        >
                          <span v-if="submittingScore">Submitting...</span>
                          <span v-else>
                            <i class="fas fa-paper-plane me-2"></i>
                            Submit score
                          </span>
                        </button>
                        <div v-if="scoreError" class="alert alert-danger mt-3 small">
                          {{ scoreError }}
                        </div>
                      </div>
                      
                      <!-- Score Submitted Confirmation -->
                      <div v-if="hasSubmittedScore && challenge.status !== 'completed'" class="mb-4">
                        <div class="alert alert-success text-center">
                          <i class="fas fa-check-circle me-2"></i>
                          <strong>Your score has been submitted!</strong>
                          <div class="mt-2">
                            <span class="fs-4 fw-bold">
                              {{ getMySubmittedScore() }}
                            </span>
                          </div>
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
                          <div v-if="challenge.creator_score !== null && challenge.opponent_score !== null" class="mt-3">
                            <div class="fs-4 fw-bold">
                              {{ getWinner() }}
                            </div>
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

                      <!-- Not Participant Message -->
                      <div v-if="!isParticipant && challenge.status !== 'open'" class="alert alert-info">
                        <i class="fas fa-info-circle me-2"></i>
                        You are not a participant in this challenge
                      </div>

                      <!-- Stop Challenge Request (only visible to participants) -->
                      <div v-if="isParticipant && challenge.opponent && (challenge.status === 'accepted' || challenge.status === 'in_progress')" class="mt-4">
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
                                      You requested to stop. Waiting for {{ challenge.creator.id === currentUserId ? challenge.opponent?.username : challenge.creator?.username }} to confirm.
                                    </span>
                                    <span v-else>
                                      {{ stopRequest.initiator?.username }} requested to stop. Do you want to confirm?
                                    </span>
                                  </p>
                                </div>
                                <div class="d-flex gap-2">
                                  <button 
                                    v-if="stopRequest.initiator_id === currentUserId"
                                    class="btn btn-sm btn-secondary"
                                    @click="cancelStopRequest"
                                    :disabled="cancellingStop"
                                  >
                                    <i class="fas fa-times me-1"></i>Cancel
                                  </button>
                                  <button 
                                    v-else
                                    class="btn btn-sm btn-success"
                                    @click="confirmStopRequest"
                                    :disabled="confirmingStop"
                                  >
                                    <i class="fas fa-check me-1"></i>Confirm
                                  </button>
                                </div>
                              </div>
                            </div>
                            
                            <div v-else-if="stopRequest.status === 'confirmed'" class="alert alert-info">
                              <i class="fas fa-check-circle me-2"></i>
                              <strong>Stop Request Confirmed</strong>
                              <p class="mb-0 small">Both players have confirmed. Waiting for admin approval to complete the challenge and distribute winnings.</p>
                            </div>
                            
                            <div v-else-if="stopRequest.status === 'approved'" class="alert alert-success">
                              <i class="fas fa-check-double me-2"></i>
                              <strong>Challenge Stopped</strong>
                              <p class="mb-0 small">The challenge has been stopped and completed by admin.</p>
                            </div>
                            
                            <div v-else-if="stopRequest.status === 'rejected'" class="alert alert-danger">
                              <i class="fas fa-times-circle me-2"></i>
                              <strong>Stop Request Rejected</strong>
                              <p class="mb-0 small">The admin has rejected the stop request. The challenge continues.</p>
                            </div>
                          </div>
                          
                          <div v-else>
                            <p class="text-white-50 mb-3">
                              If both players agree to stop the challenge, click the button below. The admin will review and complete the challenge.
                            </p>
                            <button 
                              class="btn_secondary w-100"
                              @click="requestStopChallenge"
                              :disabled="requestingStop"
                            >
                              <span v-if="requestingStop">Requesting...</span>
                              <span v-else>
                                <i class="fas fa-stop-circle me-2"></i>Request to Stop Challenge
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>

                      <!-- Challenge Chat (only visible to creator and opponent) -->
                      <div v-if="isParticipant && challenge.opponent" class="mt-5">
                        <h5 class="text-white mb-3">
                          <i class="fas fa-comments me-2"></i>Challenge Discussion
                        </h5>
                        <div class="defi_card n11-bg rounded-8 p-4">
                          <div class="chat-container" style="height: 400px; overflow-y: auto; background: rgba(0,0,0,0.2); border-radius: 10px; padding: 1rem; margin-bottom: 1rem;">
                            <div v-if="loadingMessages" class="text-center py-3">
                              <div class="spinner-border spinner-border-sm text-primary"></div>
                            </div>
                            <div v-else-if="messages.length > 0">
                              <div 
                                v-for="message in messages" 
                                :key="message.id" 
                                class="mb-3 p-3 rounded"
                                :style="{ background: message.user_id === currentUserId ? 'rgba(255,159,0,0.2)' : 'rgba(255,255,255,0.05)' }"
                              >
                                <div class="d-flex justify-content-between align-items-start mb-2">
                                  <div>
                                    <strong class="text-white">{{ message.user?.username }}</strong>
                                    <small class="text-white-50 ms-2">{{ formatTime(message.created_at) }}</small>
                                  </div>
                                  <button 
                                    v-if="message.user_id === currentUserId"
                                    class="btn btn-sm btn-link text-danger p-0"
                                    @click="deleteMessage(message.id)"
                                    title="Delete message"
                                    style="text-decoration: none;"
                                  >
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
                              <input 
                                v-model="newMessage"
                                type="text" 
                                class="form-control n11-bg text-white border-secondary" 
                                placeholder="Type your message..."
                                :disabled="sendingMessage"
                                maxlength="1000"
                              />
                              <button 
                                type="submit" 
                                class="btn_primary"
                                :disabled="sendingMessage || !newMessage.trim()"
                              >
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
import { ref, onMounted, computed, onUnmounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import apiClient from "@/utils/axios";
import Peer from "peerjs";
import { getPeerOptions } from "@/utils/peerConfig";

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

// Chat related
const messages = ref<any[]>([]);
const loadingMessages = ref(false);
const sendingMessage = ref(false);
const newMessage = ref("");

// Stop request related
const stopRequest = ref<any>(null);
const stopRequestLoading = ref(false);
const requestingStop = ref(false);
const confirmingStop = ref(false);
const cancellingStop = ref(false);

// Screen recording related
const isRecording = ref(false);
const recordingStreamUrl = ref<string | null>(null);
const recordingError = ref("");
const startingRecording = ref(false);
const stoppingRecording = ref(false);
const mediaRecorder = ref<MediaRecorder | null>(null);
const screenStream = ref<MediaStream | null>(null);
const recordingVideoElement = ref<HTMLVideoElement | null>(null);
const creatorStreamUrl = ref<string | null>(null);
const opponentStreamUrl = ref<string | null>(null);
const showStreamKey = ref(false);
const streamKeyInput = ref<HTMLInputElement | null>(null);
let peerInstance: Peer | null = null;

let messagePollingInterval: any = null;
let viewerCountInterval: any = null;

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
  if (challenge.value.creator.id === currentUserId.value) {
    return challenge.value.creator_score !== null;
  } else if (challenge.value.opponent && challenge.value.opponent.id === currentUserId.value) {
    return challenge.value.opponent_score !== null;
  }
  return false;
});

const getMySubmittedScore = () => {
  if (!challenge.value || !currentUserId.value) return "";
  if (challenge.value.creator.id === currentUserId.value) {
    return challenge.value.creator_score;
  } else if (challenge.value.opponent && challenge.value.opponent.id === currentUserId.value) {
    return challenge.value.opponent_score;
  }
  return "";
};

const getOtherPlayerName = () => {
  if (!challenge.value || !currentUserId.value) return "the other player";
  if (challenge.value.creator.id === currentUserId.value) {
    return challenge.value.opponent?.username || "the opponent";
  } else {
    return challenge.value.creator.username;
  }
};

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

const getTimeRemaining = (expiresAt: string | null) => {
  if (!expiresAt) return "⏱️ No expiration";
  const now = new Date();
  const expires = new Date(expiresAt);
  const diff = expires.getTime() - now.getTime();
  if (diff <= 0) return "⏱️ Expired";
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  if (days > 0) return `⏱️ ${days} day${days > 1 ? 's' : ''} remaining`;
  if (hours > 0) return `⏱️ ${hours}h remaining`;
  const minutes = Math.floor(diff / (1000 * 60));
  return `⏱️ ${minutes}min remaining`;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getWinner = () => {
  if (!challenge.value) return "";
  if (challenge.value.creator_score === null || challenge.value.opponent_score === null) return "";
  
  if (challenge.value.creator_score > challenge.value.opponent_score) {
    return `${challenge.value.creator.username} won!`;
  } else if (challenge.value.opponent_score > challenge.value.creator_score) {
    return `${challenge.value.opponent?.username} won!`;
  } else {
    return "Draw!";
  }
};

const loadChallenge = async () => {
  try {
    loading.value = true;
    error.value = "";
    const token = localStorage.getItem("auth_token");
    const challengeId = route.params.id;

    const response = await apiClient.get(`/challenges/${challengeId}`);

    if (response.data.success) {
      challenge.value = response.data.data;
      
      // S'assurer que is_live est défini (peut être null dans la réponse)
      if (challenge.value && challenge.value.is_live === undefined) {
        challenge.value.is_live = false;
      }
      if (challenge.value && challenge.value.viewer_count === undefined) {
        challenge.value.viewer_count = 0;
      }
      
      // Get current user if logged in
      if (token) {
        try {
          const userResponse = await apiClient.get(`/user`);
          if (userResponse.data && userResponse.data.id) {
            currentUserId.value = userResponse.data.id;
            
            // Ne pas pré-remplir myScore si le score a déjà été soumis
            // Le formulaire doit rester vide pour permettre de voir que le score a été soumis
            if (challenge.value) {
              if (challenge.value.creator.id === currentUserId.value) {
                // Si le score n'a pas encore été soumis, pré-remplir avec null pour afficher le formulaire vide
                myScore.value = null;
              } else if (challenge.value.opponent && challenge.value.opponent.id === currentUserId.value) {
                // Si le score n'a pas encore été soumis, pré-remplir avec null pour afficher le formulaire vide
                myScore.value = null;
              }
            }
          }
        } catch (err) {
          console.error("Error fetching user:", err);
        }
      }

      // Load messages if user is participant and challenge has opponent
      if (isParticipant.value && challenge.value && challenge.value.opponent) {
        loadMessages();
        startMessagePolling();
      }

      // Load stop request if user is participant
      if (isParticipant.value) {
        loadStopRequest();
      }
      
      // Update stream URLs if recording is active
      if (challenge.value && (challenge.value as any).creator_screen_recording && (challenge.value as any).creator_screen_stream_url) {
        creatorStreamUrl.value = (challenge.value as any).creator_screen_stream_url;
      }
      if (challenge.value && (challenge.value as any).opponent_screen_recording && (challenge.value as any).opponent_screen_stream_url) {
        opponentStreamUrl.value = (challenge.value as any).opponent_screen_stream_url;
      }
      
      // Sync isRecording si créateur et challenge déjà en live (ex. après refresh)
      if (challenge.value && isCreator.value && challenge.value.is_live) {
        isRecording.value = true;
      }

      // Start polling viewer count if live
      if (challenge.value && challenge.value.is_live) {
        startViewerCountPolling();
      } else {
        stopViewerCountPolling();
      }
    } else {
      error.value = response.data.message || "Error loading challenge";
    }
  } catch (err: any) {
    console.error("Error loading challenge:", err);
    if (err.response?.status === 404) {
      error.value = "Challenge not found";
    } else {
      error.value = err.response?.data?.message || "Error loading challenge";
    }
  } finally {
    loading.value = false;
  }
};

const loadMessages = async () => {
  if (!challenge.value || !isParticipant.value) return;
  
  try {
    loadingMessages.value = true;
    const response = await apiClient.get(`/challenges/${challenge.value.id}/messages`);
    
    if (response.data.success) {
      const messageData = response.data.data.data || response.data.data || [];
      messages.value = messageData.reverse(); // Reverse to show oldest first
      // Scroll to bottom
      setTimeout(() => {
        const chatContainer = document.querySelector('.chat-container');
        if (chatContainer) {
          chatContainer.scrollTop = chatContainer.scrollHeight;
        }
      }, 100);
    }
  } catch (err: any) {
    console.error("Error loading messages:", err);
  } finally {
    loadingMessages.value = false;
  }
};

const startMessagePolling = () => {
  // Poll for new messages every 3 seconds
  messagePollingInterval = setInterval(() => {
    if (isParticipant.value && challenge.value?.opponent) {
      loadMessages();
    }
  }, 3000);
};

const sendMessage = async () => {
  if (!challenge.value || !newMessage.value.trim()) return;
  
  try {
    sendingMessage.value = true;
    const response = await apiClient.post(`/challenges/${challenge.value.id}/messages`, {
      message: newMessage.value.trim(),
    });
    
    if (response.data.success) {
      newMessage.value = "";
      await loadMessages();
    } else {
      error.value = response.data.message || "Error sending message";
    }
  } catch (err: any) {
    console.error("Error sending message:", err);
    error.value = err.response?.data?.message || "Error sending message";
  } finally {
    sendingMessage.value = false;
  }
};

const deleteMessage = async (messageId: number) => {
  if (!challenge.value) return;
  
  if (!confirm("Are you sure you want to delete this message?")) {
    return;
  }

  try {
    const response = await apiClient.delete(`/challenges/${challenge.value.id}/messages/${messageId}`);
    
    if (response.data.success) {
      await loadMessages();
    } else {
      alert('Error deleting message: ' + (response.data.message || 'Unknown error'));
    }
  } catch (err: any) {
    console.error("Error deleting message:", err);
    alert('Error deleting message: ' + (err.response?.data?.message || err.message));
  }
};

const formatTime = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const loadStopRequest = async () => {
  if (!challenge.value || !isParticipant.value) return;
  
  try {
    stopRequestLoading.value = true;
    const response = await apiClient.get(`/challenges/${challenge.value.id}/stop-request`);
    
    if (response.data.success) {
      stopRequest.value = response.data.data;
    }
  } catch (err: any) {
    console.error("Error loading stop request:", err);
  } finally {
    stopRequestLoading.value = false;
  }
};

const requestStopChallenge = async () => {
  if (!challenge.value) return;
  
  if (!confirm("Are you sure you want to request to stop this challenge? The other player must confirm.")) {
    return;
  }

  try {
    requestingStop.value = true;
    const response = await apiClient.post(`/challenges/${challenge.value.id}/request-stop`, {
      reason: null, // Can be extended later
    });
    
    if (response.data.success) {
      await loadStopRequest();
      alert(response.data.message || "Stop request created. Waiting for opponent confirmation.");
    } else {
      alert(response.data.message || "Error creating stop request");
    }
  } catch (err: any) {
    console.error("Error requesting stop:", err);
    alert(err.response?.data?.message || "Error requesting to stop challenge");
  } finally {
    requestingStop.value = false;
  }
};

const confirmStopRequest = async () => {
  if (!challenge.value) return;
  
  if (!confirm("Are you sure you want to confirm stopping this challenge? The admin will review and complete it.")) {
    return;
  }

  try {
    confirmingStop.value = true;
    const response = await apiClient.post(`/challenges/${challenge.value.id}/request-stop`, {});
    
    if (response.data.success) {
      await loadStopRequest();
      alert(response.data.message || "Stop request confirmed. Waiting for admin approval.");
    } else {
      alert(response.data.message || "Error confirming stop request");
    }
  } catch (err: any) {
    console.error("Error confirming stop:", err);
    alert(err.response?.data?.message || "Error confirming stop request");
  } finally {
    confirmingStop.value = false;
  }
};

const cancelStopRequest = async () => {
  if (!challenge.value) return;
  
  if (!confirm("Are you sure you want to cancel the stop request?")) {
    return;
  }

  try {
    cancellingStop.value = true;
    const response = await apiClient.delete(`/challenges/${challenge.value.id}/stop-request`);
    
    if (response.data.success) {
      stopRequest.value = null;
      alert("Stop request cancelled successfully");
    } else {
      alert(response.data.message || "Error cancelling stop request");
    }
  } catch (err: any) {
    console.error("Error cancelling stop:", err);
    alert(err.response?.data?.message || "Error cancelling stop request");
  } finally {
    cancellingStop.value = false;
  }
};

const getCurrentUser = async () => {
  try {
    const response = await apiClient.get("/user");
    if (response.data && response.data.id) {
      currentUserId.value = response.data.id;
    }
  } catch (error) {
    console.error("Error getting current user:", error);
  }
};

const startScreenRecording = async () => {
  if (!challenge.value || !isCreator.value) return;
  
  try {
    startingRecording.value = true;
    recordingError.value = "";
    
    // Request screen capture permission
    const displayMediaOptions = {
      video: {
        displaySurface: "monitor" as const,
        cursor: "always" as const,
        width: { ideal: 1920 },
        height: { ideal: 1080 }
      },
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 44100
      },
      preferCurrentTab: false
    };
    
    // Get screen stream
    const stream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
    screenStream.value = stream;
    
    // Create blob URL for local preview
    recordingStreamUrl.value = URL.createObjectURL(new Blob([], { type: 'video/webm' }));
    
    // Set up video element to display the stream
    if (recordingVideoElement.value) {
      recordingVideoElement.value.srcObject = stream;
    }
    
    // Notify backend that recording has started
    const response = await apiClient.post(
      `/challenges/${challenge.value.id}/screen-recording/start`,
      {}
    );
    
    if (response.data.success) {
      isRecording.value = true;
      
      // Update challenge with live stream info
      if (challenge.value) {
        challenge.value.is_live = true;
        challenge.value.stream_key = response.data.data.stream_key;
        challenge.value.rtmp_url = response.data.data.rtmp_url;
        challenge.value.stream_url = response.data.data.stream_url;
        challenge.value.viewer_count = 0;
      }
      
      // Monitor for stop events (user stops sharing from browser)
      stream.getVideoTracks()[0].addEventListener('ended', () => {
        stopScreenRecording();
      });
      
      // PeerJS - permettre aux spectateurs de se connecter en WebRTC (utilise serveur local si localhost)
      const peerId = 'challenge_' + challenge.value!.id;
      try {
        peerInstance = new Peer(peerId, getPeerOptions());
        peerInstance.on('call', (call) => {
          call.answer(stream);
        });
        peerInstance.on('error', (err) => {
          console.warn('PeerJS error:', err);
        });
      } catch (e) {
        console.warn('PeerJS init failed:', e);
      }
      
      // Store stream URLs
      creatorStreamUrl.value = recordingStreamUrl.value;
      
      // Start polling viewer count
      startViewerCountPolling();
    } else {
      throw new Error(response.data.message || "Failed to start recording");
    }
  } catch (err: any) {
    console.error("Error starting screen recording:", err);
    const apiMsg = err.response?.data?.message;
    const errMsg = err.message || "Failed to start screen recording.";
    recordingError.value = apiMsg || (err.name === 'NotAllowedError' ? "Partage d'écran refusé. Veuillez autoriser l'accès." : errMsg);
    
    // Clean up if error occurred
    if (screenStream.value) {
      screenStream.value.getTracks().forEach(track => track.stop());
      screenStream.value = null;
    }
    if (recordingStreamUrl.value) {
      URL.revokeObjectURL(recordingStreamUrl.value);
      recordingStreamUrl.value = null;
    }
  } finally {
    startingRecording.value = false;
  }
};

const stopScreenRecording = async () => {
  // Autoriser l'arrêt si : enregistrement local OU (créateur et live selon l'API, ex. après refresh)
  if (!challenge.value) return;
  if (!isRecording.value && !(isCreator.value && challenge.value.is_live)) return;
  
  try {
    stoppingRecording.value = true;
    recordingError.value = "";
    
    // Stop media tracks
    if (screenStream.value) {
      screenStream.value.getTracks().forEach(track => track.stop());
      screenStream.value = null;
    }
    
    // Clear video element
    if (recordingVideoElement.value) {
      recordingVideoElement.value.srcObject = null;
    }
    
    // Notify backend that recording has stopped
    const response = await apiClient.post(
      `/challenges/${challenge.value.id}/screen-recording/stop`,
      {}
    );
    
    if (response.data.success) {
      isRecording.value = false;
      
      // Update challenge
      if (challenge.value) {
        challenge.value.is_live = false;
        challenge.value.viewer_count = 0;
      }
      
      // Clean up blob URL
      if (recordingStreamUrl.value) {
        URL.revokeObjectURL(recordingStreamUrl.value);
        recordingStreamUrl.value = null;
      }
      
      // Clear stream URLs
      creatorStreamUrl.value = null;
      
      // Stop polling viewer count
      stopViewerCountPolling();
      
      // Destroy PeerJS
      if (peerInstance) {
        peerInstance.destroy();
        peerInstance = null;
      }
    } else {
      throw new Error(response.data.message || "Failed to stop recording");
    }
  } catch (err: any) {
    console.error("Error stopping screen recording:", err);
    recordingError.value = err.response?.data?.message || err.message || "Failed to stop screen recording";
  } finally {
    stoppingRecording.value = false;
  }
};

const acceptChallenge = async () => {
  if (!challenge.value) return;
  
  // Check if user is logged in
  const token = localStorage.getItem("auth_token");
  if (!token) {
    alert("Please log in to accept challenges");
    return;
  }
  
  if (!confirm(`Are you sure you want to accept this challenge? You will need to bet ${challenge.value.bet_amount.toLocaleString()} EBT.`)) {
    return;
  }

  try {
    const response = await apiClient.post(
      `/challenges/${challenge.value.id}/accept`,
      {}
    );

    if (response.data.success) {
      await loadChallenge();
      alert("Challenge accepted successfully!");
    } else {
      const errorMsg = response.data.message || response.data.errors || "Error accepting challenge";
      alert(typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg));
    }
  } catch (error: any) {
    console.error("Error accepting challenge:", error);
    
    let errorMessage = "Error accepting challenge";
    
    if (error.response) {
      // Server responded with error
      if (error.response.data) {
        if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.errors) {
          const errors = error.response.data.errors;
          if (typeof errors === 'object') {
            errorMessage = Object.values(errors).flat().join(', ');
          } else {
            errorMessage = String(errors);
          }
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error;
        }
      }
      
      // Add status code info for debugging
      if (error.response.status === 401) {
        errorMessage = "Please log in to accept challenges";
      } else if (error.response.status === 403) {
        errorMessage = errorMessage || "You don't have permission to accept this challenge";
      } else if (error.response.status === 404) {
        errorMessage = "Challenge not found";
      } else if (error.response.status === 400) {
        errorMessage = errorMessage || "Invalid request";
      }
    } else if (error.request) {
      // Request was made but no response received
      errorMessage = "Network error. Please check your connection.";
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    alert(errorMessage);
  }
};

const cancelChallenge = async () => {
  if (!challenge.value) return;
  
  if (!confirm("Are you sure you want to cancel this challenge? Your bet will be refunded.")) {
    return;
  }

  try {
    const response = await apiClient.post(
      `/challenges/${challenge.value.id}/cancel`,
      {}
    );

    if (response.data.success) {
      await loadChallenge();
      alert("Challenge cancelled successfully!");
    } else {
      alert(response.data.message || "Error cancelling challenge");
    }
  } catch (error: any) {
    console.error("Error cancelling challenge:", error);
    alert(error.response?.data?.message || "Error cancelling challenge");
  }
};

const submitScore = async () => {
  if (!challenge.value || myScore.value === null) return;

  try {
    submittingScore.value = true;
    scoreError.value = "";

    const response = await apiClient.post(
      `/challenges/${challenge.value.id}/scores`,
      { score: myScore.value }
    );

    if (response.data.success) {
      // Réinitialiser le formulaire immédiatement
      const submittedScore = myScore.value;
      myScore.value = null;
      
      // Mettre à jour le challenge localement pour afficher le score immédiatement
      if (challenge.value) {
        if (challenge.value.creator.id === currentUserId.value) {
          challenge.value.creator_score = submittedScore;
        } else if (challenge.value.opponent && challenge.value.opponent.id === currentUserId.value) {
          challenge.value.opponent_score = submittedScore;
        }
        // Mettre à jour le statut si nécessaire
        if (challenge.value.creator_score !== null && challenge.value.opponent_score !== null) {
          challenge.value.status = 'completed';
        } else {
          challenge.value.status = 'in_progress';
        }
      }
      
      // Recharger le challenge pour avoir les données à jour
      await loadChallenge();
      
      // Ne pas afficher d'alerte pour une meilleure UX
      // alert("Score submitted successfully!");
    } else {
      scoreError.value = response.data.message || "Error submitting score";
    }
  } catch (error: any) {
    console.error("Error submitting score:", error);
    scoreError.value = error.response?.data?.message || "Error submitting score";
  } finally {
    submittingScore.value = false;
  }
};

onMounted(() => {
  getCurrentUser();
  loadChallenge();
});

// Live streaming helper functions
const getPublicStreamUrl = () => {
  if (!challenge.value?.id) return '';
  return `${window.location.origin}/challenges/${challenge.value.id}/live`;
};

const copyStreamUrl = () => {
  const url = getPublicStreamUrl();
  if (url) {
    navigator.clipboard.writeText(url);
    alert('Lien copié ! Les spectateurs peuvent regarder sur /streams ou via ce lien.');
  }
};

const copyRtmpUrl = () => {
  if (challenge.value?.rtmp_url) {
    navigator.clipboard.writeText(challenge.value.rtmp_url);
    alert('RTMP URL copied to clipboard!');
  }
};

const copyStreamKey = () => {
  if (challenge.value?.stream_key) {
    navigator.clipboard.writeText(challenge.value.stream_key);
    alert('Stream key copied to clipboard!');
  }
};

const toggleStreamKeyVisibility = () => {
  showStreamKey.value = !showStreamKey.value;
  if (streamKeyInput.value) {
    streamKeyInput.value.type = showStreamKey.value ? 'text' : 'password';
  }
};

const openStreamInNewTab = () => {
  // Ouvrir la page streams où les lives des challenges sont affichés
  window.open('/streams', '_blank');
};

const viewLiveStream = () => {
  if (challenge.value?.id) {
    router.push(`/challenges/${challenge.value.id}/live`);
  }
};

const refreshViewerCount = async () => {
  if (!challenge.value) return;
  
  try {
    const response = await apiClient.get(`/challenges/${challenge.value.id}/live`);
    if (response.data.success && challenge.value) {
      challenge.value.viewer_count = response.data.data.viewer_count || 0;
    }
  } catch (err: any) {
    console.error('Error refreshing viewer count:', err);
  }
};

const startViewerCountPolling = () => {
  if (viewerCountInterval) {
    clearInterval(viewerCountInterval);
  }
  
  viewerCountInterval = setInterval(() => {
    if (challenge.value?.is_live) {
      refreshViewerCount();
    }
  }, 5000); // Poll every 5 seconds
};

const stopViewerCountPolling = () => {
  if (viewerCountInterval) {
    clearInterval(viewerCountInterval);
    viewerCountInterval = null;
  }
};

const pauseScreenRecording = async () => {
  if (!challenge.value || !challenge.value.is_live) return;
  try {
    const response = await apiClient.post(`/challenges/${challenge.value.id}/screen-recording/pause`, {});
    if (response.data.success && challenge.value) {
      challenge.value.is_live_paused = true;
      if (screenStream.value) {
        screenStream.value.getTracks().forEach(t => { t.enabled = false; });
      }
    }
  } catch (err: any) {
    console.error('Error pausing:', err);
  }
};

const resumeScreenRecording = async () => {
  if (!challenge.value || !challenge.value.is_live) return;
  try {
    const response = await apiClient.post(`/challenges/${challenge.value.id}/screen-recording/resume`, {});
    if (response.data.success && challenge.value) {
      challenge.value.is_live_paused = false;
      if (screenStream.value) {
        screenStream.value.getTracks().forEach(t => { t.enabled = true; });
      }
    }
  } catch (err: any) {
    console.error('Error resuming:', err);
  }
};

// Arrêter le live automatiquement quand le challenge est terminé
watch(() => challenge.value?.status, (newStatus) => {
  if (newStatus === 'completed' && isRecording.value && challenge.value) {
    stopScreenRecording();
  }
});

onUnmounted(() => {
  if (messagePollingInterval) {
    clearInterval(messagePollingInterval);
  }
  stopViewerCountPolling();
  if (peerInstance) {
    peerInstance.destroy();
    peerInstance = null;
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
.btn_primary:hover {
  background-color: #FF9F00;
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

.btn_see_details {
  background-color: #FF9F00;
  color: #000;
  border: none;
  transition: 0.3s;
  cursor: pointer;
}
.btn_see_details:hover {
  background-color: #FF9F00;
  transform: translateY(-2px);
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
  
  .container-fluid {
    margin-left: 0 !important;
  }
  
  .defis__main {
    margin-left: 0 !important;
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
</style>

