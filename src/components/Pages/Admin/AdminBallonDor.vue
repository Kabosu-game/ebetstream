<template>
  <div class="pay_method__paymethod p-3 p-md-4 p-lg-6 p2-bg rounded-8">
    <div class="pay_method__paymethod-title mb-5 mb-md-6 d-flex justify-content-between align-items-center flex-wrap gap-3">
      <div>
        <h2 class="text-white fw-bold mb-2">Ballon d'Or Management</h2>
        <p class="text-white-50">Manage seasons, nominations and voting</p>
      </div>
      <button @click="showCreateSeasonModal = true" class="btn btn-primary">
        <i class="fas fa-plus me-2"></i>Create Season
      </button>
    </div>

    <!-- Statistics -->
    <div class="row g-3 mb-4">
      <div class="col-md-3 col-sm-6">
        <div class="stat-card n11-bg rounded-8 p-3">
          <div class="text-white-50 small mb-1">Total Seasons</div>
          <div class="text-white fw-bold fs-4">{{ stats.totalSeasons || 0 }}</div>
        </div>
      </div>
      <div class="col-md-3 col-sm-6">
        <div class="stat-card n11-bg rounded-8 p-3">
          <div class="text-white-50 small mb-1">Active Season</div>
          <div class="text-success fw-bold fs-4">{{ stats.activeSeason || 0 }}</div>
        </div>
      </div>
      <div class="col-md-3 col-sm-6">
        <div class="stat-card n11-bg rounded-8 p-3">
          <div class="text-white-50 small mb-1">Total Nominations</div>
          <div class="text-warning fw-bold fs-4">{{ stats.totalNominations || 0 }}</div>
        </div>
      </div>
      <div class="col-md-3 col-sm-6">
        <div class="stat-card n11-bg rounded-8 p-3">
          <div class="text-white-50 small mb-1">Total Votes</div>
          <div class="text-info fw-bold fs-4">{{ stats.totalVotes || 0 }}</div>
        </div>
      </div>
    </div>

    <!-- Seasons List -->
    <div class="mb-4">
      <h4 class="text-white mb-3">Seasons</h4>
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
                <th class="text-white p-3">Start Date</th>
                <th class="text-white p-3">End Date</th>
                <th class="text-white p-3">Status</th>
                <th class="text-white p-3">Nominations</th>
                <th class="text-white p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="season in seasons" :key="season.id" class="border-top border-secondary">
                <td class="text-white p-3">{{ season.id }}</td>
                <td class="text-white p-3">
                  <div class="text-start">
                    <strong>{{ season.name }}</strong>
                    <span v-if="season.is_current" class="badge bg-success ms-2">Current</span>
                  </div>
                </td>
                <td class="text-white p-3">{{ formatDate(season.start_date) }}</td>
                <td class="text-white p-3">{{ formatDate(season.end_date) }}</td>
                <td class="p-3">
                  <span :class="['badge', getStatusClass(season.status)]">
                    {{ season.status }}
                  </span>
                </td>
                <td class="text-white p-3">
                  <span class="badge bg-info">{{ season.nominations?.length || 0 }}</span>
                </td>
                <td class="p-3">
                  <div class="d-flex gap-2 justify-content-center">
                    <button @click="viewSeason(season.id)" class="btn btn-sm btn-info">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button @click="editSeason(season)" class="btn btn-sm btn-warning">
                      <i class="fas fa-edit"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Nominations for Selected Season -->
    <div v-if="selectedSeason" class="mb-4">
      <h4 class="text-white mb-3">Nominations - {{ (selectedSeason as any)?.name }}</h4>
      <div class="d-flex gap-3 mb-3 flex-wrap">
        <select v-model="filterCategory" class="form-select n11-bg text-white border-secondary" style="max-width: 200px;" @change="loadNominations">
          <option value="">All Categories</option>
          <option value="player">Player</option>
          <option value="clan">Clan</option>
          <option value="team">Team</option>
        </select>
        <button @click="showCreateNominationModal = true" class="btn btn-primary">
          <i class="fas fa-plus me-2"></i>Add Nomination
        </button>
      </div>
      <div v-if="loadingNominations" class="text-center py-5">
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
                <th class="text-white p-3">Category</th>
                <th class="text-white p-3">Nominee</th>
                <th class="text-white p-3">Votes</th>
                <th class="text-white p-3">Winner</th>
                <th class="text-white p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="nomination in nominations" :key="(nomination as any).id" class="border-top border-secondary">
                <td class="text-white p-3">{{ (nomination as any).id }}</td>
                <td class="text-white p-3">
                  <span class="badge bg-secondary">{{ (nomination as any).category_label }}</span>
                </td>
                <td class="text-white p-3">
                  {{ (nomination as any).nominee?.username || (nomination as any).nominee?.name || 'N/A' }}
                </td>
                <td class="text-white p-3">{{ (nomination as any).vote_count || 0 }}</td>
                <td class="p-3">
                  <span v-if="(nomination as any).is_winner" class="badge bg-success">Winner</span>
                  <span v-else class="text-white-50">-</span>
                </td>
                <td class="p-3">
                  <div class="d-flex gap-2 justify-content-center">
                    <button @click="editNomination(nomination)" class="btn btn-sm btn-warning">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button @click="deleteNomination((nomination as any).id)" class="btn btn-sm btn-danger">
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import apiClient from '@/utils/axios';

const seasons = ref<any[]>([]);
const nominations = ref<any[]>([]);
const selectedSeason = ref<any>(null);
const loading = ref(false);
const loadingNominations = ref(false);
const filterCategory = ref('');
const showCreateSeasonModal = ref(false);
const showCreateNominationModal = ref(false);

const stats = ref({
  totalSeasons: 0,
  activeSeason: 0,
  totalNominations: 0,
  totalVotes: 0,
});

const loadSeasons = async () => {
  loading.value = true;
  try {
    const response = await apiClient.get('/admin/ballon-dor/seasons');
    if (response.data.success) {
      seasons.value = response.data.data;
      stats.value.totalSeasons = seasons.value.length;
      stats.value.activeSeason = seasons.value.filter((s: any) => s.is_current).length;
    }
  } catch (error: any) {
    console.error('Error loading seasons:', error);
  } finally {
    loading.value = false;
  }
};

const loadNominations = async () => {
  if (!selectedSeason.value) return;
  
  loadingNominations.value = true;
  try {
    const params: any = {};
    if (filterCategory.value) {
      params.category = filterCategory.value;
    }
    const response = await apiClient.get(`/admin/ballon-dor/seasons/${(selectedSeason.value as any)?.id}/nominations`, { params });
    if (response.data.success) {
      nominations.value = response.data.data;
      stats.value.totalNominations = nominations.value.length;
    }
  } catch (error: any) {
    console.error('Error loading nominations:', error);
  } finally {
    loadingNominations.value = false;
  }
};

const viewSeason = (seasonId: number) => {
  const season = seasons.value.find((s: any) => s.id === seasonId);
  if (season) {
    selectedSeason.value = season;
    loadNominations();
  }
};

const editSeason = (season: any) => {
  // TODO: Implement edit season modal
  console.log('Edit season:', season);
};

const editNomination = (nomination: any) => {
  // TODO: Implement edit nomination modal
  console.log('Edit nomination:', nomination);
};

const deleteNomination = async (id: number) => {
  if (!confirm('Are you sure you want to delete this nomination?')) return;
  
  try {
    await apiClient.delete(`/admin/ballon-dor/nominations/${id}`);
    loadNominations();
  } catch (error: any) {
    console.error('Error deleting nomination:', error);
    alert('Error deleting nomination');
  }
};

const getStatusClass = (status: string) => {
  const statusMap: Record<string, string> = {
    'active': 'bg-success',
    'upcoming': 'bg-info',
    'ended': 'bg-secondary',
    'cancelled': 'bg-danger',
  };
  return statusMap[status] || 'bg-secondary';
};

const formatDate = (date: string) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString();
};

onMounted(() => {
  loadSeasons();
});
</script>

<style scoped>
.stat-card {
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.pay_method__table-scrollbar {
  max-height: 600px;
  overflow-y: auto;
}

.btn {
  white-space: nowrap;
}
</style>

