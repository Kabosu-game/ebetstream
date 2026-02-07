<template>
  <div class="pay_method__paymethod p-3 p-md-4 p-lg-6 p2-bg rounded-8">
    <div class="pay_method__paymethod-title mb-5 mb-md-6 d-flex justify-content-between align-items-center">
      <div>
        <h2 class="text-white fw-bold mb-2">Match Management</h2>
        <p class="text-white-50">Manage all game matches on the platform</p>
      </div>
      <button class="btn_primary" @click="showCreateModal = true">
        <IconPlus :size="18" class="me-2" />New Match
      </button>
    </div>

    <!-- Filters -->
    <div class="d-flex gap-3 mb-4 flex-wrap">
      <select v-model="selectedGame" @change="loadMatches" class="form-select n11-bg text-white border-secondary" style="max-width: 300px;">
        <option value="">All Games</option>
        <option v-for="game in games" :key="game.id" :value="game.id">{{ game.name }}</option>
      </select>
      <select v-model="filterStatus" @change="loadMatches" class="form-select n11-bg text-white border-secondary" style="max-width: 200px;">
        <option value="">All Statuses</option>
        <option value="upcoming">Upcoming</option>
        <option value="live">Live</option>
        <option value="finished">Finished</option>
        <option value="cancelled">Cancelled</option>
      </select>
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
              <th class="text-white p-3">Team 1</th>
              <th class="text-white p-3">Team 2</th>
              <th class="text-white p-3">Date</th>
              <th class="text-white p-3">Status</th>
              <th class="text-white p-3">Odds</th>
              <th class="text-white p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="match in filteredMatches" :key="match.id" class="border-top border-secondary">
              <td class="text-white p-3">{{ match.id }}</td>
              <td class="text-white p-3">{{ match.game?.name || 'N/A' }}</td>
              <td class="text-white p-3">{{ match.team1_name }}</td>
              <td class="text-white p-3">{{ match.team2_name }}</td>
              <td class="text-white p-3">{{ formatDate(match.match_date) }}</td>
              <td class="p-3">
                <span :class="['badge', getStatusClass(match.status)]">
                  {{ getStatusLabel(match.status) }}
                </span>
              </td>
              <td class="text-white p-3">
                <div class="small">
                  <div>Team1: {{ match.team1_odds }}x</div>
                  <div>Draw: {{ match.draw_odds }}x</div>
                  <div>Team2: {{ match.team2_odds }}x</div>
                </div>
              </td>
              <td class="p-3">
                <div class="d-flex gap-2 justify-content-center">
                  <button class="btn btn-sm btn-warning" @click="editMatch(match)" title="Edit">
                    <IconEdit :size="16" />
                  </button>
                  <button class="btn btn-sm btn-danger" @click="deleteMatch(match.id)" title="Delete">
                    <IconTrash :size="16" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredMatches.length === 0">
              <td colspan="8" class="text-white p-5 text-center">No matches found</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showCreateModal || editingMatch" class="popup-overlay" @click.self="closeModal">
      <div class="popup-box p-5 rounded-4 shadow-lg n11-bg" style="max-width: 600px; max-height: 90vh; overflow-y: auto;">
        <h3 class="fw-bold mb-4 text-center text-white">
          {{ editingMatch ? 'Edit Match' : 'New Match' }}
        </h3>
        <form @submit.prevent="saveMatch">
          <div class="form-group mb-4">
            <label class="text-white mb-2 d-block">Game *</label>
            <select v-model="form.game_id" class="form-select n11-bg text-white border-secondary" required>
              <option value="">Select a game</option>
              <option v-for="game in games" :key="game.id" :value="game.id">{{ game.name }}</option>
            </select>
          </div>
          <div class="form-group mb-4">
            <label class="text-white mb-2 d-block">Team 1 *</label>
            <input v-model="form.team1_name" type="text" class="form-control n11-bg text-white border-secondary" required />
          </div>
          <div class="form-group mb-4">
            <label class="text-white mb-2 d-block">Team 2 *</label>
            <input v-model="form.team2_name" type="text" class="form-control n11-bg text-white border-secondary" required />
          </div>
          <div class="form-group mb-4">
            <label class="text-white mb-2 d-block">Description</label>
            <textarea v-model="form.description" rows="3" class="form-control n11-bg text-white border-secondary"></textarea>
          </div>
          <div class="form-group mb-4">
            <label class="text-white mb-2 d-block">Match Date *</label>
            <input v-model="form.match_date" type="datetime-local" class="form-control n11-bg text-white border-secondary" required />
          </div>
          <div class="row g-3 mb-4">
            <div class="col-4">
              <label class="text-white mb-2 d-block">Team1 Odds</label>
              <input v-model.number="form.team1_odds" type="number" step="0.01" min="0.01" class="form-control n11-bg text-white border-secondary" />
            </div>
            <div class="col-4">
              <label class="text-white mb-2 d-block">Draw Odds</label>
              <input v-model.number="form.draw_odds" type="number" step="0.01" min="0.01" class="form-control n11-bg text-white border-secondary" />
            </div>
            <div class="col-4">
              <label class="text-white mb-2 d-block">Team2 Odds</label>
              <input v-model.number="form.team2_odds" type="number" step="0.01" min="0.01" class="form-control n11-bg text-white border-secondary" />
            </div>
          </div>
          <div class="form-group mb-4">
            <label class="text-white mb-2 d-block">Status</label>
            <select v-model="form.status" class="form-select n11-bg text-white border-secondary">
              <option value="upcoming">Upcoming</option>
              <option value="live">Live</option>
              <option value="finished">Finished</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div class="form-group mb-4" v-if="form.status === 'finished'">
            <label class="text-white mb-2 d-block">Result</label>
            <select v-model="form.result" class="form-select n11-bg text-white border-secondary">
              <option value="">Select a result</option>
              <option value="team1_win">{{ form.team1_name || 'Team 1' }} Win</option>
              <option value="draw">Draw</option>
              <option value="team2_win">{{ form.team2_name || 'Team 2' }} Win</option>
            </select>
          </div>
          <div class="form-group mb-4">
            <label class="text-white mb-2 d-block">
              <input type="checkbox" v-model="form.is_active" class="me-2" />
              Active
            </label>
          </div>
          <div v-if="error" class="alert alert-danger mb-4">{{ error }}</div>
          <div class="d-flex gap-3">
            <button type="submit" class="btn_primary flex-fill" :disabled="saving">
              <span v-if="saving">Saving...</span>
              <span v-else>Save</span>
            </button>
            <button type="button" class="btn_secondary" @click="closeModal">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import apiClient from '@/utils/axios';
import { IconPlus, IconEdit, IconTrash } from '@tabler/icons-vue';

interface Game {
  id: number;
  name: string;
}

interface GameMatch {
  id: number;
  game_id: number;
  team1_name: string;
  team2_name: string;
  description?: string;
  match_date: string;
  status: 'upcoming' | 'live' | 'finished' | 'cancelled';
  result?: string;
  team1_odds: number;
  draw_odds: number;
  team2_odds: number;
  is_active: boolean;
  game?: Game;
}

const matches = ref<GameMatch[]>([]);
const games = ref<Game[]>([]);
const loading = ref(false);
const selectedGame = ref<number | ''>('');
const filterStatus = ref<string>('');
const showCreateModal = ref(false);
const editingMatch = ref<GameMatch | null>(null);
const saving = ref(false);
const error = ref('');

const form = ref({
  game_id: '' as string | number,
  team1_name: '',
  team2_name: '',
  description: '',
  match_date: '',
  status: 'upcoming' as 'upcoming' | 'live' | 'completed' | 'finished' | 'cancelled',
  result: '',
  team1_odds: 1.00,
  draw_odds: 0.50,
  team2_odds: 1.00,
  is_active: true,
});

const filteredMatches = computed(() => {
  let filtered = matches.value;
  if (selectedGame.value) {
    filtered = filtered.filter(m => m.game_id === Number(selectedGame.value));
  }
  if (filterStatus.value) {
    filtered = filtered.filter(m => m.status === filterStatus.value);
  }
  return filtered;
});

const loadGames = async () => {
  try {
    const response = await apiClient.get('/games');
    if (response.data.success) {
      games.value = response.data.data;
    }
  } catch (err: any) {
    console.error('Error loading games:', err);
  }
};

const loadMatches = async () => {
  try {
    loading.value = true;
    const response = await apiClient.get('/game-matches');
    if (response.data.success) {
      matches.value = response.data.data;
    }
  } catch (err: any) {
    console.error('Error loading matches:', err);
  } finally {
    loading.value = false;
  }
};

const saveMatch = async () => {
  try {
    saving.value = true;
    error.value = '';
    
    // Convert date to correct format
    const matchData = {
      ...form.value,
      match_date: new Date(form.value.match_date).toISOString(),
    };
    
    if (editingMatch.value) {
      await apiClient.put(`/admin/game-matches/${editingMatch.value.id}`, matchData);
    } else {
      await apiClient.post('/admin/game-matches', matchData);
    }
    
    closeModal();
    await loadMatches();
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Error saving match';
  } finally {
    saving.value = false;
  }
};

const editMatch = (match: GameMatch) => {
  editingMatch.value = match;
  form.value = {
    game_id: String(match.game_id),
    team1_name: match.team1_name,
    team2_name: match.team2_name,
    description: match.description || '',
    match_date: new Date(match.match_date).toISOString().slice(0, 16),
    status: match.status,
    result: match.result || '',
    team1_odds: match.team1_odds,
    draw_odds: match.draw_odds,
    team2_odds: match.team2_odds,
    is_active: match.is_active,
  };
};

const deleteMatch = async (id: number) => {
  if (!confirm('Are you sure you want to delete this match?')) return;
  try {
    await apiClient.delete(`/admin/game-matches/${id}`);
    await loadMatches();
  } catch (err: any) {
    alert(err.response?.data?.message || 'Error deleting match');
  }
};

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    'upcoming': 'bg-warning',
    'live': 'bg-danger',
    'finished': 'bg-success',
    'cancelled': 'bg-secondary',
  };
  return classes[status] || 'bg-secondary';
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    'upcoming': 'Upcoming',
    'live': 'Live',
    'finished': 'Finished',
    'cancelled': 'Cancelled',
  };
  return labels[status] || status;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const closeModal = () => {
  showCreateModal.value = false;
  editingMatch.value = null;
  form.value = {
    game_id: '',
    team1_name: '',
    team2_name: '',
    description: '',
    match_date: '',
    status: 'upcoming',
    result: '',
    team1_odds: 1.00,
    draw_odds: 0.50,
    team2_odds: 1.00,
    is_active: true,
  };
  error.value = '';
};

onMounted(() => {
  loadGames();
  loadMatches();
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
</style>


