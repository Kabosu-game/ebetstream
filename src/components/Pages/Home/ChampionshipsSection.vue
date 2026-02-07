<template>
  <!-- Section EBETSTREAM Championship -->
  <section class="top10_section py-6 position-relative overflow-hidden">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12 gx-0 gx-lg-4">
          <div class="top10__main">
            <div class="row w-100">
              <div class="col-12">
                <div class="row h-100 align-items-center">
                  <!-- Colonne texte -->
                  <div class="col-lg-6 col-md-7">
                    <div class="top10_content" data-aos="fade-right">
                      <span class="hero_badge mb-3 d-inline-block">
                        <i class="fas fa-trophy me-2"></i>EBETSTREAM Championship
                      </span>
                      <h2 class="hero_title mb-4">
                        Structured championships by <span class="text_gradient">divisions</span><br />
                        Play. Challenge. Rise.
                      </h2>
                      <p class="hero_subtitle mb-5">
                        Register your team, choose your division, and face the best players. Climb the ranks, gain visibility, and unlock greater rewards.
                      </p>
                      <div class="hero_actions d-flex flex-wrap gap-3">
                        <router-link to="/championships" class="btn_primary text-decoration-none">
                          <span>View All Championships</span>
                          <i class="fas fa-arrow-right ms-2"></i>
                        </router-link>
                      </div>
                    </div>
                  </div>

                  <!-- Colonne image / illustration -->
                  <div class="col-lg-6 col-md-5 d-none d-md-block">
                    <div class="top10_image" data-aos="fade-left">
                      <div class="floating_card card_top10">
                        <div class="card_icon">🏆</div>
                        <div class="card_content">
                          <span class="card_label">Championships</span>
                          <span class="card_value">Divisions</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Tabs et Liste des championnats -->
                  <div class="col-12 mt-5">
                    <div v-if="loading" class="text-center py-5">
                      <div class="spinner-border text-warning" role="status">
                        <span class="visually-hidden">Loading...</span>
                      </div>
                    </div>
                    <div v-else-if="error" class="alert alert-warning" role="alert">
                      {{ error }}
                    </div>
                    <div v-else-if="allChampionships.length === 0" class="text-center py-5">
                      <p class="text-muted">No upcoming championships available at the moment.</p>
                    </div>
                    <div v-else>
                      <!-- Tabs Navigation -->
                      <ul class="nav nav-tabs mb-4 border-0 championships-tabs">
                        <li class="nav-item">
                          <button 
                            class="nav-link"
                            :class="{ 'active': activeTab === 'division1' }"
                            @click="activeTab = 'division1'"
                          >
                            <i class="fas fa-trophy me-2"></i>
                            Division 1
                            <span class="badge bg-warning text-dark ms-2" v-if="division1.length > 0">{{ division1.length }}</span>
                          </button>
                        </li>
                        <li class="nav-item">
                          <button 
                            class="nav-link"
                            :class="{ 'active': activeTab === 'division2' }"
                            @click="activeTab = 'division2'"
                          >
                            <i class="fas fa-medal me-2"></i>
                            Division 2
                            <span class="badge bg-secondary ms-2" v-if="division2.length > 0">{{ division2.length }}</span>
                          </button>
                        </li>
                        <li class="nav-item">
                          <button 
                            class="nav-link"
                            :class="{ 'active': activeTab === 'division3' }"
                            @click="activeTab = 'division3'"
                          >
                            <i class="fas fa-award me-2"></i>
                            Division 3
                            <span class="badge bg-warning text-dark ms-2" v-if="division3.length > 0">{{ division3.length }}</span>
                          </button>
                        </li>
                      </ul>

                      <!-- Tab Content -->
                      <!-- Division 1 Tab -->
                      <div v-if="activeTab === 'division1'" class="tab-content">
                        <div v-if="division1.length === 0" class="text-center py-5">
                          <p class="text-muted">No championships available in Division 1 at the moment.</p>
                        </div>
                        <div v-else class="top10_list row g-4">
                          <div 
                            v-for="championship in division1" 
                            :key="championship.id"
                            class="col-lg-6 col-xl-4"
                          >
                            <ChampionshipCard 
                              :championship="championship" 
                              @click="viewChampionship(championship.id)"
                            />
                          </div>
                        </div>
                      </div>

                      <!-- Division 2 Tab -->
                      <div v-if="activeTab === 'division2'" class="tab-content">
                        <div v-if="division2.length === 0" class="text-center py-5">
                          <p class="text-muted">No championships available in Division 2 at the moment.</p>
                        </div>
                        <div v-else class="top10_list row g-4">
                          <div 
                            v-for="championship in division2" 
                            :key="championship.id"
                            class="col-lg-6 col-xl-4"
                          >
                            <ChampionshipCard 
                              :championship="championship" 
                              @click="viewChampionship(championship.id)"
                            />
                          </div>
                        </div>
                      </div>

                      <!-- Division 3 Tab -->
                      <div v-if="activeTab === 'division3'" class="tab-content">
                        <div v-if="division3.length === 0" class="text-center py-5">
                          <p class="text-muted">No championships available in Division 3 at the moment.</p>
                        </div>
                        <div v-else class="top10_list row g-4">
                          <div 
                            v-for="championship in division3" 
                            :key="championship.id"
                            class="col-lg-6 col-xl-4"
                          >
                            <ChampionshipCard 
                              :championship="championship" 
                              @click="viewChampionship(championship.id)"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- /Tabs et Liste des championnats -->
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>  
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '@/utils/axios';
import ChampionshipCard from './ChampionshipCard.vue';

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
const allChampionships = ref<Championship[]>([]);
const loading = ref(false);
const error = ref('');
const activeTab = ref<'division1' | 'division2' | 'division3'>('division1');

// Filter championships by division
const division1 = computed(() => 
  allChampionships.value.filter(c => c.division === '1')
);

const division2 = computed(() => 
  allChampionships.value.filter(c => c.division === '2')
);

const division3 = computed(() => 
  allChampionships.value.filter(c => c.division === '3')
);

const loadChampionships = async () => {
  try {
    loading.value = true;
    error.value = '';
    
    // Load all active championships
    const response = await apiClient.get('/championships', {
      params: {
        status: 'registration_open,validated,registration_closed'
      }
    });

    if (response.data && response.data.success) {
      const championships = response.data.data || [];
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Filter only future championships
      const futureChampionships = championships.filter((champ: Championship) => {
        if (!champ.start_date) return false;
        if ((champ as any).is_active === false) return false;
        const startDate = new Date(champ.start_date);
        startDate.setHours(0, 0, 0, 0);
        return startDate >= today;
      });
      
      // Sort by division first, then by start date
      futureChampionships.sort((a: Championship, b: Championship) => {
        // First sort by division
        if (a.division !== b.division) {
          return parseInt(a.division) - parseInt(b.division);
        }
        // Then sort by start date
        return new Date(a.start_date).getTime() - new Date(b.start_date).getTime();
      });
      
      allChampionships.value = futureChampionships;
      console.log('Loaded championships:', allChampionships.value);
      
      // Set active tab based on available divisions
      if (division1.value.length > 0) {
        activeTab.value = 'division1';
      } else if (division2.value.length > 0) {
        activeTab.value = 'division2';
      } else if (division3.value.length > 0) {
        activeTab.value = 'division3';
      }
    } else {
      console.log('No championships found or API response format unexpected');
      allChampionships.value = [];
    }
  } catch (err: any) {
    console.error('Error loading championships:', err);
    // Don't show error to user, just log it and show empty state
    allChampionships.value = [];
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
.top10_section {
  width: 100%;
  background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%);
  color: white;
  position: relative;
  overflow: hidden;
  border-radius: 24px;
}

.top10_content {
  color: white;
}

.championships-tabs {
  border-bottom: 2px solid rgba(255, 159, 0, 0.2);
}

.championships-tabs .nav-link {
  color: rgba(255, 255, 255, 0.7);
  background: transparent;
  border: none;
  border-radius: 0;
  padding: 1rem 1.5rem;
  font-weight: 600;
  transition: all 0.3s ease;
  position: relative;
}

.championships-tabs .nav-link:hover {
  color: #FF9F00;
  background: rgba(255, 159, 0, 0.1);
}

.championships-tabs .nav-link.active {
  color: #FF9F00;
  background: transparent;
  border-bottom: 3px solid #FF9F00;
}

.championships-tabs .nav-link .badge {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
}

.tab-content {
  min-height: 300px;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.floating_card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  gap: 1.5rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.card_icon {
  font-size: 3rem;
}

.card_content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.card_label {
  font-size: 0.9rem;
  opacity: 0.9;
  font-weight: 500;
}

.card_value {
  font-size: 1.8rem;
  font-weight: 800;
  color: white;
}

.hero_actions .btn_primary {
  display: inline-flex;
  align-items: center;
  color: inherit;
}

.hero_actions .btn_primary:hover {
  color: inherit;
  text-decoration: none;
}
</style>
