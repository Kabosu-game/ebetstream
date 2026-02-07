<template>
  <div class="pay_method__paymethod p-3 p-md-4 p-lg-6 p2-bg rounded-8">
    <div class="pay_method__paymethod-title mb-5 mb-md-6 d-flex justify-content-between align-items-center flex-wrap gap-3">
      <div>
        <h2 class="text-white fw-bold mb-2">Challenge Management</h2>
        <p class="text-white-50">Manage all platform challenges</p>
      </div>
      <button 
        class="btn btn-warning fw-bold"
        @click="showStopRequestsModal = true; loadStopRequests()"
        title="View Stop Requests - Click to see challenges waiting for admin approval"
        :class="{ 'pulse-animation': pendingStopRequestsCount > 0 }"
        style="min-width: 180px;"
      >
        <i class="fas fa-stop-circle me-2"></i>
        Stop Requests
        <span v-if="pendingStopRequestsCount > 0" class="badge bg-danger ms-2" style="font-size: 0.9em;">
          {{ pendingStopRequestsCount }}
        </span>
        <span v-else class="badge bg-secondary ms-2" style="font-size: 0.9em;">0</span>
      </button>
    </div>

    <!-- Filters -->
    <div class="d-flex gap-3 mb-4 flex-wrap">
      <input 
        v-model="searchQuery" 
        type="text" 
        class="form-control n11-bg text-white border-secondary" 
        placeholder="Search by game, username, email..."
        style="max-width: 300px;"
      />
      <select v-model="filterStatus" class="form-select n11-bg text-white border-secondary" style="max-width: 200px;">
        <option value="">All Status</option>
        <option value="open">Open</option>
        <option value="accepted">Accepted</option>
        <option value="in_progress">In Progress</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
      </select>
      <button 
        class="btn btn-primary"
        :class="{ 'active': activeOnly }"
        @click="activeOnly = !activeOnly; loadChallenges()"
      >
        Active Only
      </button>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else class="pay_method__table">
      <div class="pay_method__table-scrollbar overflow-x-auto">
        <table class="w-100 text-center p2-bg">
          <thead>
            <tr>
              <th class="text-white p-3">ID</th>
              <th class="text-white p-3">Game</th>
              <th class="text-white p-3">Creator</th>
              <th class="text-white p-3">Opponent</th>
              <th class="text-white p-3">Scores</th>
              <th class="text-white p-3">Bet</th>
              <th class="text-white p-3">Status</th>
              <th class="text-white p-3">Date</th>
              <th class="text-white p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="challenge in challenges" :key="challenge.id" class="border-top border-secondary">
              <td class="text-white p-3">{{ challenge.id }}</td>
              <td class="text-white p-3">{{ challenge.game }}</td>
              <td class="text-white p-3">{{ challenge.creator?.username || 'N/A' }}</td>
              <td class="text-white p-3">{{ challenge.opponent?.username || 'Pending' }}</td>
              <td class="text-white p-3">
                <span v-if="challenge.creator_score !== null || challenge.opponent_score !== null">
                  {{ challenge.creator_score ?? '-' }} : {{ challenge.opponent_score ?? '-' }}
                </span>
                <span v-else class="text-white-50">-</span>
              </td>
              <td class="text-white p-3">{{ formatNumber(challenge.bet_amount) }} EBT</td>
              <td class="p-3">
                <span :class="['badge', getStatusClass(challenge.status)]">
                  {{ getStatusLabel(challenge.status) }}
                </span>
              </td>
              <td class="text-white p-3">{{ formatDate(challenge.created_at) }}</td>
              <td class="p-3">
                <div class="d-flex gap-2 justify-content-center">
                  <button 
                    v-if="challenge.status === 'accepted' || challenge.status === 'in_progress'"
                    class="btn btn-sm btn-success text-white" 
                    @click="openCompleteModal(challenge)" 
                    title="Complete Challenge"
                    style="min-width: 35px; height: 35px; padding: 0; display: flex; align-items: center; justify-content: center;"
                  >
                    <IconCheck :size="16" />
                  </button>
                  <button 
                    v-if="challenge.status !== 'completed' && challenge.status !== 'cancelled'"
                    class="btn btn-sm btn-danger text-white" 
                    @click="cancelChallenge(challenge.id)" 
                    title="Cancel Challenge"
                    style="min-width: 35px; height: 35px; padding: 0; display: flex; align-items: center; justify-content: center;"
                  >
                    <IconX :size="16" />
                  </button>
                  <button 
                    class="btn btn-sm btn-info text-white" 
                    @click="viewDetails(challenge.id)" 
                    title="View Details"
                    style="min-width: 35px; height: 35px; padding: 0; display: flex; align-items: center; justify-content: center;"
                  >
                    <IconEye :size="16" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="challenges.length === 0">
              <td colspan="9" class="text-white p-5 text-center">No challenges found</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Complete Challenge Modal -->
    <div v-if="showCompleteModal && selectedChallenge" class="popup-overlay" @click.self="closeCompleteModal">
      <div class="popup-box p-5 rounded-4 shadow-lg n11-bg" style="max-width: 600px; max-height: 90vh; overflow-y: auto;">
        <h3 class="fw-bold mb-4 text-center text-white">Complete Challenge</h3>
        
        <div class="mb-4 p-3 rounded n11-bg border border-secondary">
          <p class="text-white-50 mb-1 small">Game</p>
          <p class="text-white mb-0 fw-bold">{{ selectedChallenge.game }}</p>
          <p class="text-white-50 mb-1 small mt-2">Bet Amount</p>
          <p class="text-white mb-0 fw-bold">{{ formatNumber(selectedChallenge.bet_amount) }} EBT</p>
        </div>

        <form @submit.prevent="completeChallenge">
          <div class="form-group mb-4">
            <label class="text-white mb-2 d-block">Winner</label>
            <select 
              v-model="completeForm.winner_id" 
              class="form-select n11-bg text-white border-secondary"
              required
            >
              <option value="">Select winner</option>
              <option value="creator">{{ selectedChallenge.creator?.username || 'Creator' }}</option>
              <option value="opponent">{{ selectedChallenge.opponent?.username || 'Opponent' }}</option>
              <option value="draw">Draw (Refund both)</option>
            </select>
          </div>

          <div class="form-group mb-4">
            <label class="text-white mb-2 d-block">Creator Score (optional)</label>
            <input 
              v-model.number="completeForm.creator_score"
              type="number" 
              min="0"
              class="form-control n11-bg text-white border-secondary" 
              placeholder="Enter creator score"
            />
          </div>

          <div class="form-group mb-4">
            <label class="text-white mb-2 d-block">Opponent Score (optional)</label>
            <input 
              v-model.number="completeForm.opponent_score"
              type="number" 
              min="0"
              class="form-control n11-bg text-white border-secondary" 
              placeholder="Enter opponent score"
            />
          </div>

          <div v-if="error" class="alert alert-danger mb-4">{{ error }}</div>
          
          <div class="d-flex gap-3">
            <button 
              type="submit" 
              class="btn_primary flex-fill" 
              :disabled="saving || !completeForm.winner_id"
            >
              <span v-if="saving">Processing...</span>
              <span v-else>Complete Challenge</span>
            </button>
            <button type="button" class="btn_secondary" @click="closeCompleteModal">Cancel</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Challenge Details Modal -->
    <div v-if="showDetailsModal" class="modal-overlay" @click.self="showDetailsModal = false">
      <div class="modal-content n11-bg rounded-8 p-4" style="max-width: 900px; max-height: 90vh; overflow-y: auto;">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h3 class="text-white mb-0">Challenge Details</h3>
          <button class="btn-close btn-close-white" @click="showDetailsModal = false"></button>
        </div>

        <div v-if="loadingDetails" class="text-center py-5">
          <div class="spinner-border text-primary"></div>
        </div>

        <div v-else-if="challengeDetails">
          <!-- Tabs -->
          <ul class="nav nav-tabs mb-3">
            <li class="nav-item">
              <button 
                class="nav-link" 
                :class="{ 'active': activeTab === 'overview' }"
                @click="activeTab = 'overview'"
              >
                Overview
              </button>
            </li>
            <li class="nav-item">
              <button 
                class="nav-link" 
                :class="{ 'active': activeTab === 'messages' }"
                @click="activeTab = 'messages'"
              >
                Discussion ({{ challengeStats.active_messages || 0 }})
              </button>
            </li>
          </ul>

          <!-- Overview Tab -->
          <div v-if="activeTab === 'overview'" class="row g-4">
            <div class="col-md-6">
              <div class="n11-bg rounded-8 p-4">
                <h5 class="text-white mb-3">Information</h5>
                <div class="mb-2">
                  <small class="text-white-50">Game:</small>
                  <p class="text-white mb-0">{{ challengeDetails.game }}</p>
                </div>
                <div class="mb-2">
                  <small class="text-white-50">Bet Amount:</small>
                  <p class="text-white mb-0">{{ formatNumber(challengeDetails.bet_amount) }} EBT</p>
                </div>
                <div class="mb-2">
                  <small class="text-white-50">Status:</small>
                  <p class="mb-0">
                    <span :class="['badge', getStatusClass(challengeDetails.status)]">
                      {{ getStatusLabel(challengeDetails.status) }}
                    </span>
                  </p>
                </div>
                <div class="mb-2">
                  <small class="text-white-50">Created:</small>
                  <p class="text-white mb-0">{{ formatDate(challengeDetails.created_at) }}</p>
                </div>
                <div v-if="challengeDetails.expires_at" class="mb-2">
                  <small class="text-white-50">Expires:</small>
                  <p class="text-white mb-0">{{ formatDate(challengeDetails.expires_at) }}</p>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="n11-bg rounded-8 p-4">
                <h5 class="text-white mb-3">Players</h5>
                <div class="mb-3">
                  <small class="text-white-50">Creator:</small>
                  <p class="text-white mb-0">
                    {{ challengeDetails.creator?.username || 'N/A' }}
                    <span v-if="challengeDetails.creator_score !== null" class="badge bg-primary ms-2">
                      Score: {{ challengeDetails.creator_score }}
                    </span>
                  </p>
                </div>
                <div class="mb-3">
                  <small class="text-white-50">Opponent:</small>
                  <p class="text-white mb-0">
                    {{ challengeDetails.opponent?.username || 'Pending' }}
                    <span v-if="challengeDetails.opponent_score !== null" class="badge bg-success ms-2">
                      Score: {{ challengeDetails.opponent_score }}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Messages Tab -->
          <div v-if="activeTab === 'messages'" class="n11-bg rounded-8 p-4">
            <div class="mb-3 d-flex justify-content-between align-items-center">
              <h5 class="text-white mb-0">Challenge Discussion</h5>
              <div>
                <small class="text-white-50">
                  Total: {{ challengeStats.total_messages || 0 }} | 
                  Active: {{ challengeStats.active_messages || 0 }} | 
                  Deleted: {{ challengeStats.deleted_messages || 0 }}
                </small>
              </div>
            </div>
            <div style="max-height: 500px; overflow-y: auto; background: rgba(0,0,0,0.2); border-radius: 10px; padding: 1rem;">
              <div v-if="challengeMessages.length > 0">
                <div 
                  v-for="message in challengeMessages" 
                  :key="message.id" 
                  class="mb-3 p-3 rounded"
                  :style="{ 
                    background: message.is_deleted ? 'rgba(108,117,125,0.2)' : (message.user_id === challengeDetails.creator_id ? 'rgba(255,159,0,0.2)' : 'rgba(255,255,255,0.05)'),
                    opacity: message.is_deleted ? 0.6 : 1
                  }"
                >
                  <div class="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <strong class="text-white">{{ message.user?.username }}</strong>
                      <small class="text-white-50 ms-2">{{ formatDateTime(message.created_at) }}</small>
                      <span v-if="message.is_deleted" class="badge bg-secondary ms-2">Deleted</span>
                    </div>
                  </div>
                  <p class="text-white mb-0" :style="{ textDecoration: message.is_deleted ? 'line-through' : 'none' }">
                    {{ message.message }}
                  </p>
                </div>
              </div>
              <div v-else class="text-center py-5 text-white-50">
                <i class="fas fa-comments fs-1 mb-3 d-block"></i>
                No messages in this challenge yet.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stop Requests Modal -->
    <div v-if="showStopRequestsModal" class="modal-overlay" @click.self="showStopRequestsModal = false">
      <div class="modal-content n11-bg rounded-8 p-4" style="max-width: 800px; max-height: 90vh; overflow-y: auto;">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 class="text-white mb-0">
              <i class="fas fa-stop-circle me-2 text-warning"></i>
              Stop Requests
            </h3>
            <p class="text-white-50 small mb-0 mt-1">
              Challenges where both players requested to stop - Review and approve to complete
            </p>
          </div>
          <button class="btn-close btn-close-white" @click="showStopRequestsModal = false"></button>
        </div>

        <div v-if="loadingStopRequests" class="text-center py-5">
          <div class="spinner-border text-primary"></div>
        </div>

        <div v-else-if="stopRequests.length > 0">
          <div v-for="request in stopRequests" :key="request.id" class="mb-3 p-3 rounded" style="background: rgba(255,255,255,0.05);">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <div class="flex-grow-1">
                <div class="d-flex align-items-center gap-2 mb-2">
                  <strong class="text-white">Challenge #{{ request.challenge?.id }}</strong>
                  <span class="badge bg-info">{{ request.challenge?.game }}</span>
                  <span class="badge bg-warning">{{ formatNumber(request.challenge?.bet_amount || 0) }} EBT</span>
                </div>
                <div class="text-white-50 small mb-2">
                  <div>Initiator: {{ request.initiator?.username }}</div>
                  <div>Confirmed by: {{ request.confirmer?.username }}</div>
                  <div>Confirmed at: {{ formatDateTime(request.confirmed_at) }}</div>
                  <div v-if="request.reason" class="mt-2">
                    <strong>Reason:</strong> {{ request.reason }}
                  </div>
                </div>
              </div>
            </div>
            <div class="d-flex gap-2">
              <button 
                class="btn btn-sm btn-success"
                @click="openApproveModal(request)"
              >
                <i class="fas fa-check me-1"></i>Approve & Complete
              </button>
              <button 
                class="btn btn-sm btn-danger"
                @click="rejectStopRequest(request.id)"
              >
                <i class="fas fa-times me-1"></i>Reject
              </button>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-5 text-white-50">
          <i class="fas fa-stop-circle fs-1 mb-3 d-block"></i>
          No pending stop requests
        </div>
      </div>
    </div>

    <!-- Approve Stop Request Modal -->
    <div v-if="showApproveModal && selectedStopRequest" class="modal-overlay" @click.self="showApproveModal = false">
      <div class="popup-box p-5 rounded-4 shadow-lg n11-bg" style="max-width: 600px;">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h3 class="fw-bold mb-0 text-white">Approve Stop Request</h3>
          <button class="btn-close btn-close-white" @click="showApproveModal = false"></button>
        </div>

        <div class="mb-4 p-3 rounded n11-bg border border-secondary">
          <p class="text-white-50 mb-1 small">Challenge</p>
          <p class="text-white mb-0 fw-bold">{{ selectedStopRequest.challenge?.game }}</p>
          <p class="text-white-50 mb-1 small mt-2">Bet Amount</p>
          <p class="text-white mb-0 fw-bold">{{ formatNumber(selectedStopRequest.challenge?.bet_amount || 0) }} EBT</p>
        </div>

        <form @submit.prevent="approveStopRequest">
          <div class="form-group mb-4">
            <label class="text-white mb-2 d-block">Winner</label>
            <select 
              v-model="approveForm.winner_id" 
              class="form-select n11-bg text-white border-secondary"
              required
            >
              <option value="">Select winner</option>
              <option value="creator">{{ selectedStopRequest.challenge?.creator?.username || 'Creator' }}</option>
              <option value="opponent">{{ selectedStopRequest.challenge?.opponent?.username || 'Opponent' }}</option>
              <option value="draw">Draw (Refund both)</option>
            </select>
          </div>

          <div class="form-group mb-4">
            <label class="text-white mb-2 d-block">Creator Score (optional)</label>
            <input 
              v-model.number="approveForm.creator_score"
              type="number" 
              min="0"
              class="form-control n11-bg text-white border-secondary" 
              placeholder="Enter creator score"
            />
          </div>

          <div class="form-group mb-4">
            <label class="text-white mb-2 d-block">Opponent Score (optional)</label>
            <input 
              v-model.number="approveForm.opponent_score"
              type="number" 
              min="0"
              class="form-control n11-bg text-white border-secondary" 
              placeholder="Enter opponent score"
            />
          </div>

          <div class="d-flex gap-3">
            <button 
              type="submit" 
              class="btn_primary flex-fill" 
              :disabled="approvingStop || !approveForm.winner_id"
            >
              <span v-if="approvingStop">Processing...</span>
              <span v-else>Approve & Complete</span>
            </button>
            <button type="button" class="btn_secondary" @click="showApproveModal = false">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import apiClient from '@/utils/axios';
import { IconEye, IconCheck, IconX } from '@tabler/icons-vue';

interface Challenge {
  id: number;
  game: string;
  bet_amount: number;
  status: string;
  creator_score?: number | null;
  opponent_score?: number | null;
  creator?: { username: string };
  opponent?: { username: string };
  created_at: string;
}

const challenges = ref<Challenge[]>([]);
const loading = ref(false);
const searchQuery = ref('');
const filterStatus = ref('');
const activeOnly = ref(false);
const showCompleteModal = ref(false);
const selectedChallenge = ref<Challenge | null>(null);
const saving = ref(false);
const error = ref('');
const completeForm = ref({
  winner_id: '',
  creator_score: null as number | null,
  opponent_score: null as number | null,
});

const loadChallenges = async () => {
  try {
    loading.value = true;
    const params: any = {
      per_page: 100
    };
    
    if (filterStatus.value) {
      params.status = filterStatus.value;
    }
    
    if (activeOnly.value) {
      params.active_only = true;
    }
    
    if (searchQuery.value) {
      params.search = searchQuery.value;
    }

    const response = await apiClient.get('/admin/challenges', { params });
    if (response.data.success) {
      challenges.value = response.data.data?.data || response.data.data || [];
    }
  } catch (err: any) {
    console.error('Error loading challenges:', err);
    error.value = err.response?.data?.message || 'Error loading challenges';
  } finally {
    loading.value = false;
  }
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    open: 'Open',
    accepted: 'Accepted',
    in_progress: 'In Progress',
    completed: 'Completed',
    cancelled: 'Cancelled',
  };
  return labels[status] || status;
};

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    open: 'bg-success',
    accepted: 'bg-info',
    in_progress: 'bg-warning',
    completed: 'bg-primary',
    cancelled: 'bg-danger',
  };
  return classes[status] || 'bg-secondary';
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US');
};

const formatDateTime = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
};

const showDetailsModal = ref(false);
const challengeDetails = ref<any>(null);
const challengeMessages = ref<any[]>([]);
const challengeStats = ref<any>({});
const loadingDetails = ref(false);
const activeTab = ref('overview');

const showStopRequestsModal = ref(false);
const stopRequests = ref<any[]>([]);
const loadingStopRequests = ref(false);
const pendingStopRequestsCount = ref(0);
const selectedStopRequest = ref<any>(null);
const showApproveModal = ref(false);
const approvingStop = ref(false);
const approveForm = ref({
  winner_id: '',
  creator_score: null as number | null,
  opponent_score: null as number | null,
});

const viewDetails = async (id: number) => {
  showDetailsModal.value = true;
  loadingDetails.value = true;
  activeTab.value = 'overview';
  challengeDetails.value = null;
  challengeMessages.value = [];
  challengeStats.value = {};

  try {
    const response = await apiClient.get(`/admin/challenges/${id}`);
    if (response.data.success) {
      challengeDetails.value = response.data.data;
      challengeMessages.value = response.data.messages || [];
      challengeStats.value = response.data.stats || {};
    }
  } catch (err: any) {
    console.error('Error loading challenge details:', err);
    alert('Error loading challenge details: ' + (err.response?.data?.message || err.message));
  } finally {
    loadingDetails.value = false;
  }
};

const openCompleteModal = (challenge: Challenge) => {
  selectedChallenge.value = challenge;
  completeForm.value = {
    winner_id: '',
    creator_score: challenge.creator_score ?? null,
    opponent_score: challenge.opponent_score ?? null,
  };
  showCompleteModal.value = true;
  error.value = '';
};

const closeCompleteModal = () => {
  showCompleteModal.value = false;
  selectedChallenge.value = null;
  completeForm.value = {
    winner_id: '',
    creator_score: null,
    opponent_score: null,
  };
  error.value = '';
};

const completeChallenge = async () => {
  if (!selectedChallenge.value || !completeForm.value.winner_id) return;
  
  try {
    saving.value = true;
    error.value = '';
    
    const payload: any = {
      winner_id: completeForm.value.winner_id,
    };
    
    if (completeForm.value.creator_score !== null) {
      payload.creator_score = completeForm.value.creator_score;
    }
    
    if (completeForm.value.opponent_score !== null) {
      payload.opponent_score = completeForm.value.opponent_score;
    }
    
    const response = await apiClient.post(
      `/admin/challenges/${selectedChallenge.value.id}/complete`,
      payload
    );
    
    if (response.data.success) {
      closeCompleteModal();
      await loadChallenges();
      alert('Challenge completed successfully!');
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Error completing challenge';
  } finally {
    saving.value = false;
  }
};

const cancelChallenge = async (id: number) => {
  if (!confirm('Are you sure you want to cancel this challenge? Both players will be refunded.')) {
    return;
  }
  
  try {
    const response = await apiClient.post(`/admin/challenges/${id}/cancel`);
    
    if (response.data.success) {
      await loadChallenges();
      alert('Challenge cancelled successfully!');
    }
  } catch (err: any) {
    alert(err.response?.data?.message || 'Error cancelling challenge');
  }
};

// Watch for filter changes
watch([searchQuery, filterStatus], () => {
  // Debounce search
  const timeout = setTimeout(() => {
    loadChallenges();
  }, 500);
  
  return () => clearTimeout(timeout);
});

const loadStopRequests = async () => {
  try {
    loadingStopRequests.value = true;
    const response = await apiClient.get('/admin/challenges/stop-requests');
    console.log('=== STOP REQUESTS DEBUG ===');
    console.log('Full response:', response);
    console.log('Response data:', response.data);
    console.log('Success:', response.data?.success);
    console.log('Data:', response.data?.data);
    
    if (response.data && response.data.success) {
      // Handle different response formats
      const responseData = response.data.data;
      let data = [];
      
      if (Array.isArray(responseData)) {
        // Direct array response
        data = responseData;
      } else if (responseData && Array.isArray(responseData.data)) {
        // Paginated response
        data = responseData.data;
      } else if (responseData && Array.isArray(responseData.items)) {
        // Alternative pagination format
        data = responseData.items;
      }
      
      console.log('Extracted data:', data);
      console.log('Data length:', data.length);
      
      stopRequests.value = data;
      pendingStopRequestsCount.value = data.length;
      
      console.log('Stop requests state:', stopRequests.value);
      console.log('Pending count:', pendingStopRequestsCount.value);
    } else {
      console.warn('Response not successful or missing success field');
    }
  } catch (err: any) {
    console.error('=== ERROR LOADING STOP REQUESTS ===');
    console.error('Error:', err);
    console.error('Error message:', err.message);
    console.error('Error response:', err.response);
    console.error('Error response data:', err.response?.data);
    console.error('Error response status:', err.response?.status);
    alert('Error loading stop requests: ' + (err.response?.data?.message || err.message));
  } finally {
    loadingStopRequests.value = false;
  }
};

const openApproveModal = (request: any) => {
  selectedStopRequest.value = request;
  approveForm.value = {
    winner_id: '',
    creator_score: request.challenge?.creator_score ?? null,
    opponent_score: request.challenge?.opponent_score ?? null,
  };
  showApproveModal.value = true;
};

const approveStopRequest = async () => {
  if (!selectedStopRequest.value || !approveForm.value.winner_id) return;
  
  try {
    approvingStop.value = true;
    const payload: any = {
      winner_id: approveForm.value.winner_id,
    };
    
    if (approveForm.value.creator_score !== null) {
      payload.creator_score = approveForm.value.creator_score;
    }
    
    if (approveForm.value.opponent_score !== null) {
      payload.opponent_score = approveForm.value.opponent_score;
    }
    
    const response = await apiClient.post(
      `/admin/challenges/stop-requests/${selectedStopRequest.value.id}/approve`,
      payload
    );
    
    if (response.data.success) {
      showApproveModal.value = false;
      selectedStopRequest.value = null;
      await loadStopRequests();
      await loadChallenges();
      alert('Stop request approved and challenge completed successfully!');
    }
  } catch (err: any) {
    alert(err.response?.data?.message || 'Error approving stop request');
  } finally {
    approvingStop.value = false;
  }
};

const rejectStopRequest = async (id: number) => {
  if (!confirm('Are you sure you want to reject this stop request? The challenge will continue.')) {
    return;
  }
  
  try {
    const response = await apiClient.post(`/admin/challenges/stop-requests/${id}/reject`);
    
    if (response.data.success) {
      await loadStopRequests();
      alert('Stop request rejected successfully');
    }
  } catch (err: any) {
    alert(err.response?.data?.message || 'Error rejecting stop request');
  }
};

// Watch for modal opening to reload stop requests
watch(showStopRequestsModal, (newVal) => {
  if (newVal) {
    loadStopRequests();
  }
});

onMounted(() => {
  loadChallenges();
  loadStopRequests();
});
</script>

<style scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
  overflow-y: auto;
}

.popup-box {
  max-height: 90vh;
  overflow-y: auto;
}

.popup-box .form-control,
.popup-box .form-select {
  color: white;
}

.popup-box .form-control:focus,
.popup-box .form-select:focus {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: #FF9F00;
  color: white;
}

.pulse-animation {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 193, 7, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(255, 193, 7, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 193, 7, 0);
  }
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-content {
  background: #1a1f3a;
  border-radius: 16px;
  padding: 2rem;
  max-height: 90vh;
  overflow-y: auto;
}

.nav-tabs {
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
}

.nav-tabs .nav-link {
  color: rgba(255, 255, 255, 0.7);
  border: none;
  border-bottom: 2px solid transparent;
  background: transparent;
  padding: 0.75rem 1.5rem;
}

.nav-tabs .nav-link:hover {
  color: white;
  border-bottom-color: rgba(255, 159, 0, 0.5);
}

.nav-tabs .nav-link.active {
  color: #FF9F00;
  border-bottom-color: #FF9F00;
  background: transparent;
}

.pulse-animation {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 193, 7, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(255, 193, 7, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 193, 7, 0);
  }
}
</style>

