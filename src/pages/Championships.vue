<template>
  <div class="page-content-with-space">
    <section class="defis_section py-6 position-relative overflow-hidden pb-120">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12 gx-0 gx-lg-4">
            <div class="defis__main">
              <!-- Header -->
              <div class="row mb-5">
                <div class="col-12">
                  <button class="btn_secondary mb-4" @click="$router.push('/')">
                    <i class="fas fa-arrow-left me-2"></i>
                    Back
                  </button>
                  
                  <div class="defis_content">
                    <span class="hero_badge mb-3 d-inline-block">
                      <i class="fas fa-trophy me-2"></i>EBETSTREAM Championship
                    </span>
                    <h2 class="hero_title mb-4">
                      All <span class="text_gradient">Championships</span>
                    </h2>
                    <p class="hero_subtitle">
                      Browse all available championships and register to compete.
                    </p>
                  </div>
                </div>
              </div>

              <!-- Filters -->
              <div class="row mb-4">
                <div class="col-12">
                  <div class="d-flex gap-3 flex-wrap">
                    <select v-model="selectedDivision" @change="loadChampionships" class="form-select n11-bg text-white border-secondary" style="max-width: 200px;">
                      <option value="">All Divisions</option>
                      <option value="1">Division 1</option>
                      <option value="2">Division 2</option>
                      <option value="3">Division 3</option>
                    </select>
                    <select v-model="selectedGame" @change="loadChampionships" class="form-select n11-bg text-white border-secondary" style="max-width: 250px;">
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
                    <select v-model="selectedStatus" @change="loadChampionships" class="form-select n11-bg text-white border-secondary" style="max-width: 200px;">
                      <option value="">All Status</option>
                      <option value="registration_open">Registration Open</option>
                      <option value="validated">Validated</option>
                      <option value="started">Live</option>
                      <option value="finished">Finished</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Loading State -->
              <div v-if="loading" class="text-center py-5">
                <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>

              <!-- Championships Grid -->
              <div v-else-if="championships.length > 0" class="row g-4">
                <div 
                  v-for="championship in championships" 
                  :key="championship.id"
                  class="col-12 col-md-6 col-lg-4"
                >
                  <ChampionshipCard 
                    :championship="championship" 
                    @click="viewChampionship(championship.id)"
                  />
                </div>
              </div>

              <!-- Empty State -->
              <div v-else class="text-center py-5">
                <p class="text-white-50">No championships found matching your criteria.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '@/utils/axios';
import ChampionshipCard from '@/components/Pages/Home/ChampionshipCard.vue';

interface Championship {
  id: number;
  name: string;
  game: string;
  division: string;
  description?: string;
  registration_fee: number;
  total_prize_pool?: number;
  max_participants: number;
  status: string;
  registration_start_date: string;
  registration_end_date: string;
  start_date: string;
  validated_registrations_count?: number;
}

const router = useRouter();
const championships = ref<Championship[]>([]);
const loading = ref(false);
const selectedDivision = ref('');
const selectedGame = ref('');
const selectedStatus = ref('');

const loadChampionships = async () => {
  try {
    loading.value = true;
    
    const params: any = {};
    if (selectedDivision.value) {
      params.division = selectedDivision.value;
    }
    if (selectedGame.value) {
      params.game = selectedGame.value;
    }
    if (selectedStatus.value) {
      params.status = selectedStatus.value;
    }

    const response = await apiClient.get('/championships', { params });

    if (response.data && response.data.success) {
      championships.value = response.data.data || [];
    }
  } catch (error: any) {
    console.error('Error loading championships:', error);
  } finally {
    loading.value = false;
  }
};

const viewChampionship = (id: number) => {
  router.push(`/championships/${id}`);
};

onMounted(() => {
  loadChampionships();
});
</script>

<style scoped>
.page-content-with-space {
  padding-top: 90px;
}

.defis_section {
  width: 100%;
  background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%);
  color: white;
  position: relative;
  overflow: hidden;
  border-radius: 24px;
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

@media (max-width: 768px) {
  .page-content-with-space {
    padding-top: 60px;
  }
  
  .hero_title {
    font-size: 1.8rem;
  }
  
  .container-fluid {
    margin-left: 0 !important;
    margin-right: 0 !important;
  }
}
</style>

