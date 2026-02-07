<template>
  <div class="pay_method__paymethod p-3 p-md-4 p-lg-6 p2-bg rounded-8">
    <div class="pay_method__paymethod-title mb-5 mb-md-6 d-flex justify-content-between align-items-center flex-wrap gap-3">
      <div>
        <h2 class="text-white fw-bold mb-2">Championship Management</h2>
        <p class="text-white-50">Manage championships, registrations, matches and results</p>
      </div>
      <button @click="showCreateModal = true" class="btn btn-primary">
        <i class="fas fa-plus me-2"></i>Create Championship
      </button>
    </div>

    <!-- Statistics -->
    <div class="row g-3 mb-4">
      <div class="col-md-3 col-sm-6">
        <div class="stat-card n11-bg rounded-8 p-3">
          <div class="text-white-50 small mb-1">Total Championships</div>
          <div class="text-white fw-bold fs-4">{{ stats.total || 0 }}</div>
        </div>
      </div>
      <div class="col-md-3 col-sm-6">
        <div class="stat-card n11-bg rounded-8 p-3">
          <div class="text-white-50 small mb-1">Registration Open</div>
          <div class="text-success fw-bold fs-4">{{ stats.registrationOpen || 0 }}</div>
        </div>
      </div>
      <div class="col-md-3 col-sm-6">
        <div class="stat-card n11-bg rounded-8 p-3">
          <div class="text-white-50 small mb-1">Live Championships</div>
          <div class="text-danger fw-bold fs-4">{{ stats.started || 0 }}</div>
        </div>
      </div>
      <div class="col-md-3 col-sm-6">
        <div class="stat-card n11-bg rounded-8 p-3">
          <div class="text-white-50 small mb-1">Finished</div>
          <div class="text-secondary fw-bold fs-4">{{ stats.finished || 0 }}</div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="row g-3 mb-4">
      <div class="col-md-3">
        <select v-model="filters.status" @change="loadChampionships" class="form-select n11-bg text-white border-secondary">
          <option value="">All Status</option>
          <option value="draft">Draft</option>
          <option value="registration_open">Registration Open</option>
          <option value="registration_closed">Registration Closed</option>
          <option value="validated">Validated</option>
          <option value="started">Started</option>
          <option value="finished">Finished</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      <div class="col-md-3">
        <select v-model="filters.division" @change="loadChampionships" class="form-select n11-bg text-white border-secondary">
          <option value="">All Divisions</option>
          <option value="1">Division 1</option>
          <option value="2">Division 2</option>
          <option value="3">Division 3</option>
        </select>
      </div>
      <div class="col-md-3">
        <select v-model="filters.game" @change="loadChampionships" class="form-select n11-bg text-white border-secondary">
          <option value="">All Games</option>
          <option value="COD Mobile">COD Mobile</option>
          <option value="Free Fire">Free Fire</option>
          <option value="PUBG Mobile">PUBG Mobile</option>
          <option value="Mobile Legends">Mobile Legends</option>
          <option value="eFootball / FC / DLS">eFootball / FC / DLS</option>
          <option value="Clash Royale">Clash Royale</option>
          <option value="Brawl Stars">Brawl Stars</option>
          <option value="Stumble Guys">Stumble Guys</option>
        </select>
      </div>
      <div class="col-md-3">
        <input 
          v-model="filters.search" 
          @input="loadChampionships" 
          type="text" 
          placeholder="Search..." 
          class="form-control n11-bg text-white border-secondary"
        />
      </div>
    </div>

    <!-- Championships List -->
    <div class="mb-4">
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
                <th class="text-white p-3">Name</th>
                <th class="text-white p-3">Game</th>
                <th class="text-white p-3">Division</th>
                <th class="text-white p-3">Status</th>
                <th class="text-white p-3">Participants</th>
                <th class="text-white p-3">Start Date</th>
                <th class="text-white p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="championship in championships" :key="championship.id" class="border-top border-secondary">
                <td class="text-white p-3">{{ championship.id }}</td>
                <td class="text-white p-3">
                  <div class="text-start">
                    <strong>{{ championship.name }}</strong>
                  </div>
                </td>
                <td class="text-white p-3">{{ championship.game }}</td>
                <td class="text-white p-3">
                  <span class="badge bg-warning text-dark">Division {{ championship.division }}</span>
                </td>
                <td class="p-3">
                  <span :class="['badge', getStatusClass(championship.status)]">
                    {{ getStatusLabel(championship.status) }}
                  </span>
                </td>
                <td class="text-white p-3">
                  <span>{{ championship.validated_registrations_count || 0 }}/{{ championship.max_participants }}</span>
                </td>
                <td class="text-white p-3">{{ formatDate(championship.start_date) }}</td>
                <td class="p-3">
                  <div class="d-flex gap-2 justify-content-center flex-wrap">
                    <button @click="viewChampionship(championship.id)" class="btn btn-sm btn-info" title="View Details">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button @click="editChampionship(championship)" class="btn btn-sm btn-warning" title="Edit">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button 
                      v-if="championship.status === 'registration_open' || championship.status === 'validated'" 
                      @click="manageRegistrations(championship.id)" 
                      class="btn btn-sm btn-success" 
                      title="Manage Registrations"
                    >
                      <i class="fas fa-user-check"></i>
                    </button>
                    <button 
                      v-if="championship.status === 'validated'" 
                      @click="generateMatchesForChampionship(championship.id)" 
                      class="btn btn-sm btn-primary" 
                      title="Generate Matches"
                    >
                      <i class="fas fa-trophy"></i>
                    </button>
                    <button 
                      v-if="championship.status === 'started'" 
                      @click="manageMatches(championship.id)" 
                      class="btn btn-sm btn-danger" 
                      title="Manage Matches"
                    >
                      <i class="fas fa-futbol"></i>
                    </button>
                    <button 
                      v-if="!['started', 'finished'].includes(championship.status)" 
                      @click="deleteChampionship(championship.id)" 
                      class="btn btn-sm btn-danger" 
                      title="Delete"
                    >
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showCreateModal || editingChampionship" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content n11-bg rounded-8 p-4" style="max-width: 800px; max-height: 90vh; overflow-y: auto;">
        <h3 class="text-white fw-bold mb-4">{{ editingChampionship ? 'Edit Championship' : 'Create Championship' }}</h3>
        <form @submit.prevent="saveChampionship">
          <div class="row g-3">
            <div class="col-md-6">
              <label class="text-white mb-2">Name *</label>
              <input v-model="championshipForm.name" type="text" class="form-control n11-bg text-white border-secondary" required />
            </div>
            <div class="col-md-6">
              <label class="text-white mb-2">Game *</label>
              <select v-model="championshipForm.game" class="form-select n11-bg text-white border-secondary" required>
                <option value="COD Mobile">COD Mobile</option>
                <option value="Free Fire">Free Fire</option>
                <option value="PUBG Mobile">PUBG Mobile</option>
                <option value="Mobile Legends">Mobile Legends</option>
                <option value="eFootball / FC / DLS">eFootball / FC / DLS</option>
                <option value="Clash Royale">Clash Royale</option>
                <option value="Brawl Stars">Brawl Stars</option>
                <option value="Stumble Guys">Stumble Guys</option>
              </select>
            </div>
            <div class="col-md-6">
              <label class="text-white mb-2">Division *</label>
              <select v-model="championshipForm.division" class="form-select n11-bg text-white border-secondary" required>
                <option value="1">Division 1</option>
                <option value="2">Division 2</option>
                <option value="3">Division 3</option>
              </select>
            </div>
            <div class="col-md-6">
              <label class="text-white mb-2">Status *</label>
              <select v-model="championshipForm.status" class="form-select n11-bg text-white border-secondary" required>
                <option value="draft">Draft</option>
                <option value="registration_open">Registration Open</option>
                <option value="registration_closed">Registration Closed</option>
                <option value="validated">Validated</option>
                <option value="started">Started</option>
                <option value="finished">Finished</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div class="col-md-12">
              <label class="text-white mb-2">Description</label>
              <textarea v-model="championshipForm.description" rows="3" class="form-control n11-bg text-white border-secondary"></textarea>
            </div>
            <div class="col-md-12">
              <label class="text-white mb-2">Rules</label>
              <textarea v-model="championshipForm.rules" rows="4" class="form-control n11-bg text-white border-secondary"></textarea>
            </div>
            <div class="col-md-6">
              <label class="text-white mb-2">Registration Fee *</label>
              <input v-model.number="championshipForm.registration_fee" type="number" step="0.01" min="0" class="form-control n11-bg text-white border-secondary" required />
            </div>
            <div class="col-md-6">
              <label class="text-white mb-2">Total Prize Pool</label>
              <input v-model.number="championshipForm.total_prize_pool" type="number" step="0.01" min="0" class="form-control n11-bg text-white border-secondary" />
            </div>
            <div class="col-md-6">
              <label class="text-white mb-2">Min Participants *</label>
              <input v-model.number="championshipForm.min_participants" type="number" min="2" class="form-control n11-bg text-white border-secondary" required />
            </div>
            <div class="col-md-6">
              <label class="text-white mb-2">Max Participants *</label>
              <input v-model.number="championshipForm.max_participants" type="number" min="2" class="form-control n11-bg text-white border-secondary" required />
            </div>
            <div class="col-md-4">
              <label class="text-white mb-2">Registration Start Date *</label>
              <input v-model="championshipForm.registration_start_date" type="datetime-local" class="form-control n11-bg text-white border-secondary" required />
            </div>
            <div class="col-md-4">
              <label class="text-white mb-2">Registration End Date *</label>
              <input v-model="championshipForm.registration_end_date" type="datetime-local" class="form-control n11-bg text-white border-secondary" required />
            </div>
            <div class="col-md-4">
              <label class="text-white mb-2">Start Date *</label>
              <input v-model="championshipForm.start_date" type="datetime-local" class="form-control n11-bg text-white border-secondary" required />
            </div>
            <div class="col-md-6">
              <label class="text-white mb-2">End Date</label>
              <input v-model="championshipForm.end_date" type="datetime-local" class="form-control n11-bg text-white border-secondary" />
            </div>
            <div class="col-md-6">
              <label class="text-white mb-2">Prize Distribution (JSON)</label>
              <textarea v-model="championshipForm.prize_distribution_json" rows="3" class="form-control n11-bg text-white border-secondary" placeholder='{"1st": 1000, "2nd": 500, "3rd": 250}'></textarea>
            </div>
          </div>
          <div v-if="errorMessage" class="alert alert-danger mt-3">{{ errorMessage }}</div>
          <div v-if="successMessage" class="alert alert-success mt-3">{{ successMessage }}</div>
          <div class="d-flex gap-3 mt-4">
            <button type="submit" class="btn btn-primary" :disabled="saving">
              <span v-if="saving">Saving...</span>
              <span v-else>Save</span>
            </button>
            <button type="button" class="btn btn-secondary" @click="closeModal">Cancel</button>
          </div>
        </form>
      </div>
    </div>

    <!-- View Championship Details Modal -->
    <div v-if="viewingChampionship" class="modal-overlay" @click.self="viewingChampionship = null">
      <div class="modal-content n11-bg rounded-8 p-4" style="max-width: 900px; max-height: 90vh; overflow-y: auto;">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h3 class="text-white fw-bold">Championship Details</h3>
          <button @click="viewingChampionship = null" class="btn btn-sm btn-secondary">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div v-if="championshipDetails">
          <div class="row g-3 mb-4">
            <div class="col-md-6">
              <strong class="text-white">Name:</strong>
              <p class="text-white-50">{{ championshipDetails.name }}</p>
            </div>
            <div class="col-md-6">
              <strong class="text-white">Game:</strong>
              <p class="text-white-50">{{ championshipDetails.game }}</p>
            </div>
            <div class="col-md-6">
              <strong class="text-white">Division:</strong>
              <p class="text-white-50">Division {{ championshipDetails.division }}</p>
            </div>
            <div class="col-md-6">
              <strong class="text-white">Status:</strong>
              <p><span :class="['badge', getStatusClass(championshipDetails.status)]">{{ getStatusLabel(championshipDetails.status) }}</span></p>
            </div>
            <div class="col-md-6">
              <strong class="text-white">Participants:</strong>
              <p class="text-white-50">{{ championshipDetails.validated_registrations_count || 0 }}/{{ championshipDetails.max_participants }}</p>
            </div>
            <div class="col-md-6">
              <strong class="text-white">Registration Fee:</strong>
              <p class="text-white-50">{{ championshipDetails.registration_fee }} EBT</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Registrations Management Modal -->
    <div v-if="managingRegistrations" class="modal-overlay" @click.self="managingRegistrations = null">
      <div class="modal-content n11-bg rounded-8 p-4" style="max-width: 1000px; max-height: 90vh; overflow-y: auto;">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h3 class="text-white fw-bold">Manage Registrations</h3>
          <button @click="managingRegistrations = null" class="btn btn-sm btn-secondary">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div v-if="loadingRegistrations" class="text-center py-5">
          <div class="spinner-border text-primary"></div>
        </div>
        <div v-else class="pay_method__table">
          <div class="pay_method__table-scrollbar overflow-x-auto">
            <table class="w-100 text-center p2-bg">
              <thead>
                <tr>
                  <th class="text-white p-3">ID</th>
                  <th class="text-white p-3">Player Name</th>
                  <th class="text-white p-3">User</th>
                  <th class="text-white p-3">Status</th>
                  <th class="text-white p-3">Registered</th>
                  <th class="text-white p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="registration in registrations" :key="registration.id" class="border-top border-secondary">
                  <td class="text-white p-3">{{ registration.id }}</td>
                  <td class="text-white p-3">{{ registration.player_name }}</td>
                  <td class="text-white p-3">{{ registration.user?.username || 'N/A' }}</td>
                  <td class="p-3">
                    <span :class="['badge', getRegistrationStatusClass(registration.status)]">
                      {{ getRegistrationStatusLabel(registration.status) }}
                    </span>
                  </td>
                  <td class="text-white p-3">{{ formatDate(registration.created_at) }}</td>
                  <td class="p-3">
                    <div v-if="registration.status === 'paid'" class="d-flex gap-2 justify-content-center">
                      <button @click="validateRegistration(registration.id, true)" class="btn btn-sm btn-success">
                        <i class="fas fa-check"></i> Validate
                      </button>
                      <button @click="validateRegistration(registration.id, false)" class="btn btn-sm btn-danger">
                        <i class="fas fa-times"></i> Reject
                      </button>
                    </div>
                    <span v-else class="text-white-50">-</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Matches Management Modal -->
    <div v-if="managingMatches" class="modal-overlay" @click.self="managingMatches = null">
      <div class="modal-content n11-bg rounded-8 p-4" style="max-width: 1000px; max-height: 90vh; overflow-y: auto;">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h3 class="text-white fw-bold">Manage Matches</h3>
          <button @click="managingMatches = null" class="btn btn-sm btn-secondary">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div v-if="loadingMatches" class="text-center py-5">
          <div class="spinner-border text-primary"></div>
        </div>
        <div v-else class="pay_method__table">
          <div class="pay_method__table-scrollbar overflow-x-auto">
            <table class="w-100 text-center p2-bg">
              <thead>
                <tr>
                  <th class="text-white p-3">Round</th>
                  <th class="text-white p-3">Player 1</th>
                  <th class="text-white p-3">Player 2</th>
                  <th class="text-white p-3">Score</th>
                  <th class="text-white p-3">Winner</th>
                  <th class="text-white p-3">Status</th>
                  <th class="text-white p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="match in matches" :key="match.id" class="border-top border-secondary">
                  <td class="text-white p-3">{{ match.round_number }}</td>
                  <td class="text-white p-3">{{ match.player1?.player_name || match.player1?.user?.username || 'TBD' }}</td>
                  <td class="text-white p-3">{{ match.player2?.player_name || match.player2?.user?.username || 'TBD' }}</td>
                  <td class="text-white p-3">
                    <span v-if="match.player1_score !== null">
                      {{ match.player1_score }} - {{ match.player2_score }}
                    </span>
                    <span v-else class="text-white-50">-</span>
                  </td>
                  <td class="text-white p-3">
                    <span v-if="match.winner" class="badge bg-success">
                      {{ match.winner?.player_name || match.winner?.user?.username }}
                    </span>
                    <span v-else class="text-white-50">-</span>
                  </td>
                  <td class="p-3">
                    <span :class="['badge', getMatchStatusClass(match.status)]">
                      {{ match.status }}
                    </span>
                  </td>
                  <td class="p-3">
                    <button 
                      v-if="match.status !== 'completed'" 
                      @click="showMatchResultModal(match)" 
                      class="btn btn-sm btn-primary"
                    >
                      <i class="fas fa-edit"></i> Set Result
                    </button>
                    <span v-else class="text-white-50">-</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Match Result Modal -->
    <div v-if="editingMatch" class="modal-overlay" @click.self="editingMatch = null">
      <div class="modal-content n11-bg rounded-8 p-4" style="max-width: 600px;">
        <h3 class="text-white fw-bold mb-4">Set Match Result</h3>
        <form @submit.prevent="saveMatchResult">
          <div class="mb-3">
            <label class="text-white mb-2">Player 1 Score *</label>
            <input v-model.number="matchResultForm.player1_score" type="number" min="0" class="form-control n11-bg text-white border-secondary" required />
          </div>
          <div class="mb-3">
            <label class="text-white mb-2">Player 2 Score *</label>
            <input v-model.number="matchResultForm.player2_score" type="number" min="0" class="form-control n11-bg text-white border-secondary" required />
          </div>
          <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
          <div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>
          <div class="d-flex gap-3 mt-4">
            <button type="submit" class="btn btn-primary" :disabled="saving">
              <span v-if="saving">Saving...</span>
              <span v-else>Save</span>
            </button>
            <button type="button" class="btn btn-secondary" @click="editingMatch = null">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import apiClient from '@/utils/axios';

interface Championship {
  id: number;
  name: string;
  game: string;
  division: string;
  status: string;
  description?: string;
  rules?: string;
  registration_fee: number;
  total_prize_pool?: number;
  prize_distribution?: any;
  max_participants: number;
  min_participants: number;
  start_date: string;
  registration_start_date: string;
  registration_end_date: string;
  validated_registrations_count?: number;
}

interface Registration {
  id: number;
  player_name: string;
  status: string;
  created_at: string;
  user?: {
    username: string;
  };
}

interface Match {
  id: number;
  round_number: number;
  player1_score?: number;
  player2_score?: number;
  status: string;
  player1?: {
    player_name: string;
    user?: {
      username: string;
    };
  };
  player2?: {
    player_name: string;
    user?: {
      username: string;
    };
  };
  winner?: {
    player_name: string;
    user?: {
      username: string;
    };
  };
}

const championships = ref<Championship[]>([]);
const loading = ref(false);
const saving = ref(false);
const showCreateModal = ref(false);
const editingChampionship = ref<Championship | null>(null);
const viewingChampionship = ref<number | null>(null);
const championshipDetails = ref<Championship | null>(null);
const managingRegistrations = ref<number | null>(null);
const registrations = ref<Registration[]>([]);
const loadingRegistrations = ref(false);
const managingMatches = ref<number | null>(null);
const matches = ref<Match[]>([]);
const loadingMatches = ref(false);
const editingMatch = ref<Match | null>(null);
const errorMessage = ref('');
const successMessage = ref('');

const stats = computed(() => {
  return {
    total: championships.value.length,
    registrationOpen: championships.value.filter(c => c.status === 'registration_open').length,
    started: championships.value.filter(c => c.status === 'started').length,
    finished: championships.value.filter(c => c.status === 'finished').length,
  };
});

const filters = reactive({
  status: '',
  division: '',
  game: '',
  search: '',
});

const championshipForm = reactive({
  name: '',
  game: '',
  division: '1',
  status: 'draft',
  description: '',
  rules: '',
  registration_fee: 0,
  total_prize_pool: 0,
  min_participants: 2,
  max_participants: 32,
  registration_start_date: '',
  registration_end_date: '',
  start_date: '',
  end_date: '',
  prize_distribution_json: '',
});

const matchResultForm = reactive({
  player1_score: 0,
  player2_score: 0,
});

const loadChampionships = async () => {
  try {
    loading.value = true;
    const params: any = {};
    if (filters.status) params.status = filters.status;
    if (filters.division) params.division = filters.division;
    if (filters.game) params.game = filters.game;
    if (filters.search) params.search = filters.search;

    const response = await apiClient.get('/admin/championships', { params });
    if (response.data.success) {
      championships.value = response.data.data || [];
    }
  } catch (error: any) {
    console.error('Error loading championships:', error);
    errorMessage.value = 'Error loading championships';
  } finally {
    loading.value = false;
  }
};

const saveChampionship = async () => {
  try {
    saving.value = true;
    errorMessage.value = '';
    successMessage.value = '';

    const data = { ...championshipForm };
    
    // Parse prize distribution if provided
    if (data.prize_distribution_json) {
      try {
        (data as any).prize_distribution = JSON.parse(data.prize_distribution_json);
      } catch (e) {
        errorMessage.value = 'Invalid JSON format for prize distribution';
        saving.value = false;
        return;
      }
    }
    delete (data as any).prize_distribution_json;

    let response;
    if (editingChampionship.value) {
      response = await apiClient.put(`/admin/championships/${editingChampionship.value.id}`, data);
    } else {
      response = await apiClient.post('/admin/championships', data);
    }

    if (response.data.success) {
      successMessage.value = response.data.message || 'Championship saved successfully';
      closeModal();
      await loadChampionships();
      setTimeout(() => {
        successMessage.value = '';
      }, 3000);
    } else {
      errorMessage.value = response.data.message || 'Error saving championship';
    }
  } catch (error: any) {
    console.error('Error saving championship:', error);
    errorMessage.value = error.response?.data?.message || 'Error saving championship';
  } finally {
    saving.value = false;
  }
};

const editChampionship = (championship: Championship) => {
  editingChampionship.value = championship;
  Object.assign(championshipForm, {
    name: championship.name,
    game: championship.game,
    division: championship.division.toString(),
    status: championship.status,
    description: championship.description || '',
    rules: championship.rules || '',
    registration_fee: championship.registration_fee,
    total_prize_pool: championship.total_prize_pool || 0,
    min_participants: championship.min_participants,
    max_participants: championship.max_participants,
    registration_start_date: formatDateTimeLocal(championship.registration_start_date),
    registration_end_date: formatDateTimeLocal(championship.registration_end_date),
    start_date: formatDateTimeLocal(championship.start_date),
    end_date: '',
    prize_distribution_json: championship.prize_distribution ? JSON.stringify(championship.prize_distribution, null, 2) : '',
  });
  showCreateModal.value = true;
};

const viewChampionship = async (id: number) => {
  viewingChampionship.value = id;
  try {
    const response = await apiClient.get(`/admin/championships/${id}`);
    if (response.data.success) {
      championshipDetails.value = response.data.data;
    }
  } catch (error: any) {
    console.error('Error loading championship details:', error);
  }
};

const deleteChampionship = async (id: number) => {
  if (!confirm('Are you sure you want to delete this championship?')) return;
  
  try {
    const response = await apiClient.delete(`/admin/championships/${id}`);
    if (response.data.success) {
      await loadChampionships();
    } else {
      alert(response.data.message || 'Error deleting championship');
    }
  } catch (error: any) {
    console.error('Error deleting championship:', error);
    alert(error.response?.data?.message || 'Error deleting championship');
  }
};

const manageRegistrations = async (id: number) => {
  managingRegistrations.value = id;
  try {
    loadingRegistrations.value = true;
    const response = await apiClient.get(`/admin/championships/${id}/registrations`);
    if (response.data.success) {
      registrations.value = response.data.data || [];
    }
  } catch (error: any) {
    console.error('Error loading registrations:', error);
  } finally {
    loadingRegistrations.value = false;
  }
};

const validateRegistration = async (registrationId: number, validate: boolean) => {
  try {
    const action = validate ? 'validate' : 'reject';
    const response = await apiClient.post(`/admin/championships/${managingRegistrations.value}/registrations/${registrationId}/validate`, {
      action,
    });
    if (response.data.success) {
      await manageRegistrations(managingRegistrations.value!);
    } else {
      alert(response.data.message || 'Error validating registration');
    }
  } catch (error: any) {
    console.error('Error validating registration:', error);
    alert(error.response?.data?.message || 'Error validating registration');
  }
};

const generateMatchesForChampionship = async (id: number) => {
  if (!confirm('Generate matches for this championship? This will start the championship.')) return;
  
  try {
    const response = await apiClient.post(`/admin/championships/${id}/generate-matches`);
    if (response.data.success) {
      alert('Matches generated successfully');
      await loadChampionships();
    } else {
      alert(response.data.message || 'Error generating matches');
    }
  } catch (error: any) {
    console.error('Error generating matches:', error);
    alert(error.response?.data?.message || 'Error generating matches');
  }
};

const manageMatches = async (id: number) => {
  managingMatches.value = id;
  try {
    loadingMatches.value = true;
    const response = await apiClient.get(`/admin/championships/${id}/matches`);
    if (response.data.success) {
      matches.value = response.data.data || [];
    }
  } catch (error: any) {
    console.error('Error loading matches:', error);
  } finally {
    loadingMatches.value = false;
  }
};

const showMatchResultModal = (match: Match) => {
  editingMatch.value = match;
  matchResultForm.player1_score = match.player1_score || 0;
  matchResultForm.player2_score = match.player2_score || 0;
};

const saveMatchResult = async () => {
  if (!editingMatch.value || !managingMatches.value) return;
  
  try {
    saving.value = true;
    errorMessage.value = '';
    successMessage.value = '';

    const response = await apiClient.post(`/admin/championships/${managingMatches.value}/matches/${editingMatch.value.id}/result`, matchResultForm);
    
    if (response.data.success) {
      successMessage.value = 'Match result saved successfully';
      await manageMatches(managingMatches.value);
      editingMatch.value = null;
      setTimeout(() => {
        successMessage.value = '';
      }, 3000);
    } else {
      errorMessage.value = response.data.message || 'Error saving match result';
    }
  } catch (error: any) {
    console.error('Error saving match result:', error);
    errorMessage.value = error.response?.data?.message || 'Error saving match result';
  } finally {
    saving.value = false;
  }
};

const closeModal = () => {
  showCreateModal.value = false;
  editingChampionship.value = null;
  Object.assign(championshipForm, {
    name: '',
    game: '',
    division: '1',
    status: 'draft',
    description: '',
    rules: '',
    registration_fee: 0,
    total_prize_pool: 0,
    min_participants: 2,
    max_participants: 32,
    registration_start_date: '',
    registration_end_date: '',
    start_date: '',
    end_date: '',
    prize_distribution_json: '',
  });
  errorMessage.value = '';
  successMessage.value = '';
};

const formatDate = (dateString: string) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US');
};

const formatDateTimeLocal = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const getStatusLabel = (status: string) => {
  const labels: { [key: string]: string } = {
    'draft': 'Draft',
    'registration_open': 'Registration Open',
    'registration_closed': 'Registration Closed',
    'validated': 'Validated',
    'started': 'Started',
    'finished': 'Finished',
    'cancelled': 'Cancelled'
  };
  return labels[status] || status;
};

const getStatusClass = (status: string) => {
  const classes: { [key: string]: string } = {
    'draft': 'bg-secondary',
    'registration_open': 'bg-success',
    'registration_closed': 'bg-info',
    'validated': 'bg-warning text-dark',
    'started': 'bg-danger',
    'finished': 'bg-dark',
    'cancelled': 'bg-secondary'
  };
  return classes[status] || 'bg-secondary';
};

const getRegistrationStatusLabel = (status: string) => {
  const labels: { [key: string]: string } = {
    'pending': 'Pending',
    'paid': 'Paid',
    'validated': 'Validated',
    'rejected': 'Rejected',
    'cancelled': 'Cancelled'
  };
  return labels[status] || status;
};

const getRegistrationStatusClass = (status: string) => {
  const classes: { [key: string]: string } = {
    'pending': 'bg-warning text-dark',
    'paid': 'bg-info',
    'validated': 'bg-success',
    'rejected': 'bg-danger',
    'cancelled': 'bg-secondary'
  };
  return classes[status] || 'bg-secondary';
};

const getMatchStatusClass = (status: string) => {
  const classes: { [key: string]: string } = {
    'scheduled': 'bg-info',
    'in_progress': 'bg-warning text-dark',
    'completed': 'bg-success',
    'cancelled': 'bg-secondary'
  };
  return classes[status] || 'bg-secondary';
};

onMounted(() => {
  loadChampionships();
});
</script>

<style scoped>
.modal-overlay {
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
}

.modal-content {
  background: #1a1a2e;
  border-radius: 12px;
}

.stat-card {
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 159, 0, 0.2);
}
</style>

