<template>
  <div class="pay_method__paymethod p-3 p-md-4 p-lg-6 p2-bg rounded-8">
    <div class="pay_method__paymethod-title mb-5 mb-md-6">
      <h2 class="text-white fw-bold mb-2">Overview</h2>
      <p class="text-white-50">General platform statistics</p>
    </div>

    <!-- Main Stats Cards -->
    <div class="row g-4 mb-5">
      <div class="col-md-6 col-lg-3">
        <div class="stat-card n11-bg rounded-4 p-4">
          <div class="d-flex align-items-center justify-content-between mb-3">
            <div class="stat-icon bg-primary bg-opacity-25 rounded-circle p-3">
              <IconUsers :size="24" class="text-primary" />
            </div>
            <span class="stat-change text-success d-flex align-items-center gap-1">
              <IconArrowUp :size="14" /> +12%
            </span>
          </div>
          <h3 class="text-white fw-bold mb-1">{{ formatNumber(stats.totalUsers) }}</h3>
          <p class="text-white-50 mb-0 small">Total Users</p>
        </div>
      </div>

      <div class="col-md-6 col-lg-3">
        <div class="stat-card n11-bg rounded-4 p-4">
          <div class="d-flex align-items-center justify-content-between mb-3">
            <div class="stat-icon bg-warning bg-opacity-25 rounded-circle p-3">
              <IconSword :size="24" class="text-warning" />
            </div>
            <span class="stat-change text-success d-flex align-items-center gap-1">
              <IconArrowUp :size="14" /> +8%
            </span>
          </div>
          <h3 class="text-white fw-bold mb-1">{{ formatNumber(stats.totalChallenges) }}</h3>
          <p class="text-white-50 mb-0 small">Active Challenges</p>
        </div>
      </div>

      <div class="col-md-6 col-lg-3">
        <div class="stat-card n11-bg rounded-4 p-4">
          <div class="d-flex align-items-center justify-content-between mb-3">
            <div class="stat-icon bg-danger bg-opacity-25 rounded-circle p-3">
              <IconVideo :size="24" class="text-danger" />
            </div>
            <span class="stat-change text-success d-flex align-items-center gap-1">
              <IconArrowUp :size="14" /> +15%
            </span>
          </div>
          <h3 class="text-white fw-bold mb-1">{{ formatNumber(stats.totalStreams) }}</h3>
          <p class="text-white-50 mb-0 small">Live Streams</p>
        </div>
      </div>

      <div class="col-md-6 col-lg-3">
        <div class="stat-card n11-bg rounded-4 p-4">
          <div class="d-flex align-items-center justify-content-between mb-3">
            <div class="stat-icon bg-success bg-opacity-25 rounded-circle p-3">
              <IconWallet :size="24" class="text-success" />
            </div>
            <span class="stat-change text-success d-flex align-items-center gap-1">
              <IconArrowUp :size="14" /> +20%
            </span>
          </div>
          <h3 class="text-white fw-bold mb-1">${{ formatNumber(stats.totalDeposits) }}</h3>
          <p class="text-white-50 mb-0 small">Total Deposits</p>
        </div>
      </div>
    </div>

    <!-- Secondary Stats -->
    <div class="row g-4 mb-5">
      <div class="col-md-6 col-lg-3">
        <div class="stat-card n11-bg rounded-4 p-4">
          <div class="d-flex align-items-center justify-content-between mb-3">
            <div class="stat-icon bg-info bg-opacity-25 rounded-circle p-3">
              <IconCreditCard :size="24" class="text-info" />
            </div>
          </div>
          <h3 class="text-white fw-bold mb-1">${{ formatNumber(stats.totalWithdrawals) }}</h3>
          <p class="text-white-50 mb-0 small">Total Withdrawals</p>
        </div>
      </div>

      <div class="col-md-6 col-lg-3">
        <div class="stat-card n11-bg rounded-4 p-4">
          <div class="d-flex align-items-center justify-content-between mb-3">
            <div class="stat-icon bg-purple bg-opacity-25 rounded-circle p-3">
              <IconUser :size="24" class="text-purple" />
            </div>
          </div>
          <h3 class="text-white fw-bold mb-1">{{ formatNumber(stats.totalAmbassadors) }}</h3>
          <p class="text-white-50 mb-0 small">Active Ambassadors</p>
        </div>
      </div>

      <div class="col-md-6 col-lg-3">
        <div class="stat-card n11-bg rounded-4 p-4">
          <div class="d-flex align-items-center justify-content-between mb-3">
            <div class="stat-icon bg-orange bg-opacity-25 rounded-circle p-3">
              <IconBuilding :size="24" class="text-orange" />
            </div>
          </div>
          <h3 class="text-white fw-bold mb-1">{{ formatNumber(stats.totalPartners) }}</h3>
          <p class="text-white-50 mb-0 small">Partners</p>
        </div>
      </div>

      <div class="col-md-6 col-lg-3">
        <div class="stat-card n11-bg rounded-4 p-4">
          <div class="d-flex align-items-center justify-content-between mb-3">
            <div class="stat-icon bg-success bg-opacity-25 rounded-circle p-3">
              <IconChartLine :size="24" class="text-success" />
            </div>
          </div>
          <h3 class="text-white fw-bold mb-1">${{ formatNumber((stats.totalDeposits || 0) - (stats.totalWithdrawals || 0)) }}</h3>
          <p class="text-white-50 mb-0 small">Net Balance</p>
        </div>
      </div>
    </div>

    <!-- Top 10 Players this week -->
    <div class="row g-4 mb-5">
      <div class="col-12">
        <div class="n11-bg rounded-8 p-4 p-lg-6">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h3 class="text-white fw-bold mb-2">Top 10 Players</h3>
              <p class="text-white-50 mb-0">This week</p>
            </div>
          </div>
          
          <div v-if="loadingPlayers" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
          
          <div v-else-if="topPlayers.length > 0" class="row g-3">
            <div v-for="(player, index) in topPlayers.slice(0, 10)" :key="player.id" class="col-md-6 col-lg-4 col-xl-3">
              <div class="player-card n11-bg rounded-4 p-3 border border-secondary border-opacity-25">
                <div class="d-flex align-items-center gap-3">
                  <div class="position-relative">
                    <div class="player-rank position-absolute top-0 start-0 bg-warning text-dark rounded-circle d-flex align-items-center justify-content-center fw-bold" 
                         style="width: 24px; height: 24px; font-size: 0.75rem; transform: translate(-8px, -8px);">
                      {{ index + 1 }}
                    </div>
                    <div class="player-avatar rounded-circle overflow-hidden" 
                         style="width: 50px; height: 50px; border: 2px solid rgba(255, 255, 255, 0.2);">
                      <img 
                        v-if="player.avatar_url" 
                        :src="player.avatar_url" 
                        :alt="player.name"
                        class="w-100 h-100"
                        style="object-fit: cover;"
                      />
                      <div v-else class="w-100 h-100 d-flex align-items-center justify-content-center bg-secondary bg-opacity-25">
                        <IconUser :size="24" class="text-white-50" />
                      </div>
                    </div>
                  </div>
                  <div class="flex-grow-1">
                    <h6 class="text-white fw-bold mb-0 small">{{ player.name }}</h6>
                    <p class="text-white-50 mb-0" style="font-size: 0.75rem;">@{{ player.username }}</p>
                    <div class="d-flex align-items-center gap-2 mt-1">
                      <span class="badge bg-warning text-dark" style="font-size: 0.7rem;">{{ player.score || 0 }} pts</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div v-else class="text-center py-4">
            <p class="text-white-50 mb-0">No players this week</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Top 10 Ambassadors this week -->
    <div class="row g-4 mb-5">
      <div class="col-12">
        <div class="n11-bg rounded-8 p-4 p-lg-6">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h3 class="text-white fw-bold mb-2">Top 10 Ambassadors</h3>
              <p class="text-white-50 mb-0">This week</p>
            </div>
          </div>
          
          <div v-if="loadingAmbassadors" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
          
          <div v-else-if="topAmbassadors.length > 0" class="row g-3">
            <div v-for="(ambassador, index) in topAmbassadors.slice(0, 10)" :key="ambassador.id" class="col-md-6 col-lg-4 col-xl-3">
              <div class="ambassador-card n11-bg rounded-4 p-3 border border-secondary border-opacity-25">
                <div class="d-flex align-items-center gap-3">
                  <div class="position-relative">
                    <div class="ambassador-rank position-absolute top-0 start-0 bg-warning text-dark rounded-circle d-flex align-items-center justify-content-center fw-bold" 
                         style="width: 24px; height: 24px; font-size: 0.75rem; transform: translate(-8px, -8px);">
                      {{ index + 1 }}
                    </div>
                    <div class="ambassador-avatar rounded-circle overflow-hidden" 
                         style="width: 50px; height: 50px; border: 2px solid rgba(255, 255, 255, 0.2);">
                      <img 
                        v-if="ambassador.avatar_url" 
                        :src="ambassador.avatar_url" 
                        :alt="ambassador.name"
                        class="w-100 h-100"
                        style="object-fit: cover;"
                      />
                      <div v-else class="w-100 h-100 d-flex align-items-center justify-content-center bg-secondary bg-opacity-25">
                        <IconUser :size="24" class="text-white-50" />
                      </div>
                    </div>
                  </div>
                  <div class="flex-grow-1">
                    <h6 class="text-white fw-bold mb-0 small">{{ ambassador.name }}</h6>
                    <p class="text-white-50 mb-0" style="font-size: 0.75rem;">@{{ ambassador.username }}</p>
                    <div class="d-flex align-items-center gap-2 mt-1">
                      <span class="badge bg-warning text-dark" style="font-size: 0.7rem;">{{ ambassador.score }} pts</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div v-else class="text-center py-4">
            <p class="text-white-50 mb-0">No ambassadors this week</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Our Partner Developers -->
    <div class="row g-4">
      <div class="col-12">
        <div class="n11-bg rounded-8 p-4 p-lg-6">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h3 class="text-white fw-bold mb-2">Our Partner Developers</h3>
              <p class="text-white-50 mb-0">Active partners</p>
            </div>
          </div>
          
          <div v-if="loadingPartners" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
          
          <div v-else-if="topPartners.length > 0" class="row g-3">
            <div v-for="partner in topPartners" :key="partner.id" class="col-md-6 col-lg-4 col-xl-3">
              <div class="partner-card n11-bg rounded-4 p-3 border border-secondary border-opacity-25">
                <div class="d-flex align-items-center gap-3">
                  <div class="partner-avatar rounded-circle overflow-hidden" 
                       style="width: 50px; height: 50px; border: 2px solid rgba(255, 255, 255, 0.2);">
                    <img 
                      v-if="partner.avatar_url" 
                      :src="partner.avatar_url" 
                      :alt="partner.name"
                      class="w-100 h-100"
                      style="object-fit: cover;"
                    />
                    <div v-else class="w-100 h-100 d-flex align-items-center justify-content-center bg-secondary bg-opacity-25">
                      <IconBuilding :size="24" class="text-white-50" />
                    </div>
                  </div>
                  <div class="flex-grow-1">
                    <h6 class="text-white fw-bold mb-0 small">{{ partner.name }}</h6>
                    <p class="text-white-50 mb-0" style="font-size: 0.75rem;">{{ partner.specialty || 'Développeur' }}</p>
                    <div v-if="partner.country" class="d-flex align-items-center gap-1 mt-1">
                      <IconMapPin :size="12" class="text-white-50" />
                      <span class="text-white-50" style="font-size: 0.7rem;">{{ partner.country }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div v-else class="text-center py-4">
            <p class="text-white-50 mb-0">No partners available</p>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import apiClient from '@/utils/axios';
import {
  IconUsers,
  IconSword,
  IconVideo,
  IconWallet,
  IconCreditCard,
  IconUser,
  IconBuilding,
  IconChartLine,
  IconArrowUp,
  IconMapPin,
} from '@tabler/icons-vue';

interface Stats {
  totalUsers: number;
  totalChallenges: number;
  totalStreams: number;
  totalDeposits: number;
  totalWithdrawals: number;
  totalAmbassadors: number;
  totalPartners: number;
}


const stats = ref<Stats>({
  totalUsers: 0,
  totalChallenges: 0,
  totalStreams: 0,
  totalDeposits: 0,
  totalWithdrawals: 0,
  totalAmbassadors: 0,
  totalPartners: 0,
});

const loading = ref(false);
const loadingAmbassadors = ref(false);
const loadingPartners = ref(false);
const loadingPlayers = ref(false);
const topAmbassadors = ref<any[]>([]);
const topPartners = ref<any[]>([]);
const topPlayers = ref<any[]>([]);

const loadStats = async () => {
  try {
    loading.value = true;
    
    const response = await apiClient.get('/admin/stats');
    
    if (response.data.success && response.data.data) {
      // Ensure all values are numbers, not null
      stats.value = {
        totalUsers: response.data.data.totalUsers || 0,
        totalChallenges: response.data.data.totalChallenges || 0,
        totalStreams: response.data.data.totalStreams || 0,
        totalDeposits: response.data.data.totalDeposits || 0,
        totalWithdrawals: response.data.data.totalWithdrawals || 0,
        totalAmbassadors: response.data.data.totalAmbassadors || 0,
        totalPartners: response.data.data.totalPartners || 0,
      };
    }
  } catch (error: any) {
    console.error("Error loading stats:", error);
    // Reset stats on error
    stats.value = {
      totalUsers: 0,
      totalChallenges: 0,
      totalStreams: 0,
      totalDeposits: 0,
      totalWithdrawals: 0,
      totalAmbassadors: 0,
      totalPartners: 0,
    };
  } finally {
    loading.value = false;
  }
};

const formatNumber = (num: number | null | undefined) => {
  if (num === null || num === undefined || isNaN(num)) {
    return '0';
  }
  return new Intl.NumberFormat('en-US').format(num);
};

const loadTopAmbassadors = async () => {
  try {
    loadingAmbassadors.value = true;
    
    const response = await apiClient.get('/ambassadors', {
      params: { limit: 10, sort: 'score', order: 'desc' }
    });
    
    if (response.data.success) {
      topAmbassadors.value = Array.isArray(response.data.data) ? response.data.data : [];
    }
  } catch (error: any) {
    console.error("Error loading top ambassadors:", error);
    topAmbassadors.value = [];
  } finally {
    loadingAmbassadors.value = false;
  }
};

const loadTopPartners = async () => {
  try {
    loadingPartners.value = true;
    
    const response = await apiClient.get('/partners', {
      params: { limit: 10 }
    });
    
    if (response.data.success) {
      const data = response.data.data;
      topPartners.value = Array.isArray(data) ? data : (data?.data || []);
    }
  } catch (error: any) {
    console.error("Error loading top partners:", error);
    topPartners.value = [];
  } finally {
    loadingPartners.value = false;
  }
};

const loadTopPlayers = async () => {
  try {
    loadingPlayers.value = true;
    
    const response = await apiClient.get('/top-players', {
      params: { limit: 10 }
    });
    
    if (response.data.success) {
      topPlayers.value = Array.isArray(response.data.data) ? response.data.data : [];
    }
  } catch (error: any) {
    console.error("Error loading top players:", error);
    topPlayers.value = [];
  } finally {
    loadingPlayers.value = false;
  }
};

onMounted(() => {
  loadStats();
  loadTopPlayers();
  loadTopAmbassadors();
  loadTopPartners();
});
</script>

<style scoped>
.pay_method__paymethod {
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
}

.stat-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
  height: 100%;
  max-width: 100%;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 159, 0, 0.5);
}

.stat-icon {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-change {
  font-size: 0.75rem;
  font-weight: 600;
}

.text-purple {
  color: #9c27b0;
}

.bg-purple {
  background-color: #9c27b0;
}

.text-orange {
  color: #ff9800;
}

.bg-orange {
  background-color: #ff9800;
}

.ambassador-card,
.partner-card,
.player-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.ambassador-card:hover,
.partner-card:hover,
.player-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 159, 0, 0.5) !important;
}

.ambassador-avatar,
.partner-avatar,
.player-avatar {
  flex-shrink: 0;
}

.ambassador-rank,
.player-rank {
  z-index: 1;
}

/* Empêcher le débordement horizontal */
.row {
  margin-left: 0;
  margin-right: 0;
}

.row > * {
  padding-left: calc(var(--bs-gutter-x) * 0.5);
  padding-right: calc(var(--bs-gutter-x) * 0.5);
}

/* S'assurer que les cartes ne débordent pas */
.ambassador-card,
.partner-card,
.player-card {
  max-width: 100%;
  overflow: hidden;
}

/* Correction pour les avatars et rangs */
.position-relative {
  max-width: fit-content;
}

/* Responsive fixes */
@media (max-width: 768px) {
  .pay_method__paymethod {
    padding: 1rem !important;
  }
  
  .row.g-3,
  .row.g-4 {
    margin-left: -0.5rem;
    margin-right: -0.5rem;
  }
  
  .row.g-3 > *,
  .row.g-4 > * {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
}

</style>

