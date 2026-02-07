<template>
  <div class="pay_method__paymethod p-3 p-md-4 p-lg-6 p2-bg rounded-8">
    <div class="pay_method__paymethod-title mb-5 mb-md-6">
      <h2 class="text-white fw-bold mb-2">Bet Management</h2>
      <p class="text-white-50">Manage all bets and finalize pending bets</p>
    </div>

    <!-- Filters -->
    <div class="d-flex gap-3 mb-4 flex-wrap">
      <select v-model="filterStatus" class="form-select n11-bg text-white border-secondary" style="max-width: 200px;">
        <option value="">All Statuses</option>
        <option value="pending">Pending</option>
        <option value="won">Won</option>
        <option value="lost">Lost</option>
        <option value="cancelled">Cancelled</option>
      </select>
      <input 
        v-model="searchQuery" 
        type="text" 
        class="form-control n11-bg text-white border-secondary" 
        placeholder="Search by user or match..."
        style="max-width: 300px;"
      />
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
              <th class="text-white p-3">User</th>
              <th class="text-white p-3">Match</th>
              <th class="text-white p-3">Bet Type</th>
              <th class="text-white p-3">Amount</th>
              <th class="text-white p-3">Odds</th>
              <th class="text-white p-3">Potential Win</th>
              <th class="text-white p-3">Status</th>
              <th class="text-white p-3">Date</th>
              <th class="text-white p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="bet in filteredBets" :key="bet.id" class="border-top border-secondary">
              <td class="text-white p-3">#{{ bet.id }}</td>
              <td class="text-white p-3">{{ bet.user?.username || 'N/A' }}</td>
              <td class="text-white p-3">{{ getMatchName(bet) }}</td>
              <td class="text-white p-3">{{ getBetTypeLabel(bet.bet_type) }}</td>
              <td class="text-white p-3">${{ formatNumber(bet.amount) }}</td>
              <td class="text-white p-3">{{ getBetOdds(bet) }}x</td>
              <td class="text-white p-3">${{ formatNumber(bet.potential_win) }}</td>
              <td class="p-3">
                <span :class="['badge', getStatusClass(bet.status)]">
                  {{ getStatusLabel(bet.status) }}
                </span>
              </td>
              <td class="text-white p-3">{{ formatDate(bet.created_at) }}</td>
              <td class="p-3">
                <div class="d-flex gap-2 justify-content-center">
                  <button 
                    v-if="bet.status === 'pending'"
                    class="btn btn-sm btn-success" 
                    @click="updateBetStatus(bet.id, 'won')"
                    title="Mark as Won"
                    :disabled="updatingStatus === bet.id"
                  >
                    <IconCheck :size="16" />
                  </button>
                  <button 
                    v-if="bet.status === 'pending'"
                    class="btn btn-sm btn-danger" 
                    @click="updateBetStatus(bet.id, 'lost')"
                    title="Mark as Lost"
                    :disabled="updatingStatus === bet.id"
                  >
                    <IconX :size="16" />
                  </button>
                  <button 
                    v-if="bet.status === 'pending'"
                    class="btn btn-sm btn-warning" 
                    @click="updateBetStatus(bet.id, 'cancelled')"
                    title="Cancel Bet"
                    :disabled="updatingStatus === bet.id"
                  >
                    <IconBan :size="16" />
                  </button>
                  <span v-if="updatingStatus === bet.id" class="spinner-border spinner-border-sm text-primary"></span>
                </div>
              </td>
            </tr>
            <tr v-if="filteredBets.length === 0">
              <td colspan="10" class="text-white p-5 text-center">No bets found</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="pagination && pagination.total > pagination.per_page" class="d-flex justify-content-center mt-4">
      <nav>
        <ul class="pagination">
          <li class="page-item" :class="{ disabled: !pagination.prev_page_url }">
            <button class="page-link n11-bg text-white border-secondary" @click="loadBets(pagination.current_page - 1)" :disabled="!pagination.prev_page_url">
              Previous
            </button>
          </li>
          <li class="page-item" :class="{ active: pagination.current_page === page }" v-for="page in paginationPages" :key="page">
            <button class="page-link n11-bg text-white border-secondary" @click="loadBets(page)">
              {{ page }}
            </button>
          </li>
          <li class="page-item" :class="{ disabled: !pagination.next_page_url }">
            <button class="page-link n11-bg text-white border-secondary" @click="loadBets(pagination.current_page + 1)" :disabled="!pagination.next_page_url">
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import apiClient from '@/utils/axios';
import { IconCheck, IconX, IconBan } from '@tabler/icons-vue';

interface Bet {
  id: number;
  user_id: number;
  game_match_id: number;
  bet_type: string;
  amount: number;
  potential_win: number;
  status: string;
  created_at: string;
  user?: { username: string; email: string };
  game_match?: {
    id: number;
    team1_name: string;
    team2_name: string;
    team1_odds: number;
    draw_odds: number;
    team2_odds: number;
    game?: { name: string };
  };
}

const bets = ref<Bet[]>([]);
const loading = ref(false);
const updatingStatus = ref<number | null>(null);
const filterStatus = ref('');
const searchQuery = ref('');
const pagination = ref<any>(null);

const filteredBets = computed(() => {
  let filtered = bets.value;
  
  if (filterStatus.value) {
    filtered = filtered.filter(b => b.status === filterStatus.value);
  }
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(b => 
      (b.user?.username || '').toLowerCase().includes(query) ||
      (b.game_match?.team1_name || '').toLowerCase().includes(query) ||
      (b.game_match?.team2_name || '').toLowerCase().includes(query) ||
      (b.game_match?.game?.name || '').toLowerCase().includes(query)
    );
  }
  
  return filtered;
});

const paginationPages = computed(() => {
  if (!pagination.value) return [];
  const pages = [];
  const current = pagination.value.current_page;
  const last = pagination.value.last_page;
  
  // Display max 5 pages around current page
  let start = Math.max(1, current - 2);
  let end = Math.min(last, current + 2);
  
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  
  return pages;
});

const loadBets = async (page = 1) => {
  try {
    loading.value = true;
    const params: any = { page, per_page: 20 };
    if (filterStatus.value) {
      params.status = filterStatus.value;
    }
    
    const response = await apiClient.get('/admin/bets', { params });
    if (response.data.success) {
      if (response.data.data.data) {
        // Paginated response
        bets.value = response.data.data.data;
        pagination.value = {
          current_page: response.data.data.current_page,
          last_page: response.data.data.last_page,
          per_page: response.data.data.per_page,
          total: response.data.data.total,
          prev_page_url: response.data.data.prev_page_url,
          next_page_url: response.data.data.next_page_url,
        };
      } else {
        // Non-paginated response
        bets.value = response.data.data || [];
        pagination.value = null;
      }
    }
  } catch (err: any) {
    console.error('Error loading bets:', err);
  } finally {
    loading.value = false;
  }
};

const updateBetStatus = async (betId: number, status: 'won' | 'lost' | 'cancelled') => {
  const statusLabels: Record<string, string> = {
    won: 'won',
    lost: 'lost',
    cancelled: 'cancelled'
  };
  
  if (!confirm(`Are you sure you want to mark this bet as ${statusLabels[status]}?`)) {
    return;
  }
  
  try {
    updatingStatus.value = betId;
    const response = await apiClient.put(`/admin/bets/${betId}/status`, { status });
    
    if (response.data.success) {
      alert(response.data.message);
      await loadBets(pagination.value?.current_page || 1);
    }
  } catch (err: any) {
    alert(err.response?.data?.message || 'Error updating bet status');
  } finally {
    updatingStatus.value = null;
  }
};

const getMatchName = (bet: Bet) => {
  if (bet.game_match) {
    const team1 = bet.game_match.team1_name || 'Team 1';
    const team2 = bet.game_match.team2_name || 'Team 2';
    return `${team1} vs ${team2}`;
  }
  return 'N/A';
};

const getBetTypeLabel = (betType: string) => {
  const labels: Record<string, string> = {
    team1_win: 'Team 1 Win',
    draw: 'Draw',
    team2_win: 'Team 2 Win',
  };
  return labels[betType] || betType || 'N/A';
};

const getBetOdds = (bet: Bet) => {
  if (!bet.game_match) {
    return 'N/A';
  }
  
  const match = bet.game_match;
  switch (bet.bet_type) {
    case 'team1_win':
      return match.team1_odds || 'N/A';
    case 'draw':
      return match.draw_odds || 'N/A';
    case 'team2_win':
      return match.team2_odds || 'N/A';
    default:
      return 'N/A';
  }
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending: 'Pending',
    won: 'Won',
    lost: 'Lost',
    cancelled: 'Cancelled',
  };
  return labels[status] || status;
};

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    pending: 'bg-warning',
    won: 'bg-success',
    lost: 'bg-danger',
    cancelled: 'bg-secondary',
  };
  return classes[status] || 'bg-secondary';
};

const formatNumber = (num: number | string | null | undefined) => {
  if (num === null || num === undefined || num === '') {
    return '0.00';
  }
  const numberValue = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(numberValue)) {
    return '0.00';
  }
  return numberValue.toFixed(2);
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

onMounted(() => {
  loadBets();
});
</script>

<style scoped>
.page-link {
  color: #fff;
}

.page-link:hover {
  background-color: rgba(255, 159, 0, 0.2);
  border-color: #FF9F00;
}

.page-item.active .page-link {
  background-color: #FF9F00;
  border-color: #FF9F00;
}
</style>

