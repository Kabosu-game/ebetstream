<template>
  <!-- Partner Developers Section -->
  <section class="top10_section py-4 position-relative overflow-hidden">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12 gx-0 gx-lg-4">
          <div class="top10__main">
            <div class="row w-100">
              <div class="col-12">
                <!-- Header -->
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <span class="hero_badge mb-2 d-inline-block">
                      <i class="fas fa-gamepad me-2"></i>Partners
                    </span>
                    <h3 class="hero_title mb-0">
                      Our Partner <span class="text_gradient">Developers</span>
                    </h3>
                  </div>
                  <router-link to="/partners" class="btn_primary text-decoration-none btn-sm">
                    <span>View All</span>
                    <i class="fas fa-arrow-right ms-2"></i>
                  </router-link>
                </div>

                <!-- Liste compacte -->
                <div v-if="loading" class="text-center py-4">
                  <div class="spinner-border text-warning" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </div>
                <div v-else-if="error" class="alert alert-warning" role="alert">
                  {{ error }}
                </div>
                <div v-else-if="topPartners.length === 0" class="text-center py-4">
                  <p class="text-muted mb-0">No partners available at the moment.</p>
                </div>
                <div v-else class="compact_leaderboard">
                  <div 
                    v-for="(partner, index) in topPartners" 
                    :key="partner.id" 
                    class="leaderboard_item"
                    :class="{ 'top_3': index < 3 }"
                    @click="viewPartner(partner.id)"
                  >
                    <div class="rank_badge">
                      <span v-if="index === 0" class="medal gold">🥇</span>
                      <span v-else-if="index === 1" class="medal silver">🥈</span>
                      <span v-else-if="index === 2" class="medal bronze">🥉</span>
                      <span v-else class="rank_number">#{{ index + 1 }}</span>
                    </div>
                    <div class="player_avatar_mini">
                      <img 
                        v-if="partner.avatar_url" 
                        :src="partner.avatar_url" 
                        :alt="partner.name"
                        @error="handleImageError($event)"
                      />
                      <i v-else class="fas fa-building"></i>
                    </div>
                    <div class="player_info_compact flex-grow-1">
                      <div class="player_name_compact">{{ partner.name }}</div>
                      <div class="player_meta">
                        <span class="specialty">{{ partner.specialty || 'Developer' }}</span>
                        <span v-if="partner.country" class="country">
                          <i class="fas fa-map-marker-alt"></i> {{ partner.country }}
                        </span>
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
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '@/utils/axios';

interface Partner {
  id: number;
  name: string;
  specialty?: string | null;
  website?: string | null;
  avatar?: string | null;
  avatar_url?: string;
  country?: string | null;
  bio?: string | null;
}

const router = useRouter();
const topPartners = ref<Partner[]>([]);
const loading = ref(false);
const error = ref('');

const loadPartners = async () => {
  try {
    loading.value = true;
    error.value = '';
    
    const response = await apiClient.get('/partners', {
      params: { limit: 10 }
    });

    if (response.data.success) {
      const data = response.data.data;
      topPartners.value = Array.isArray(data) ? data : (data?.data || []);
    } else {
      error.value = response.data.message || 'Error loading partners';
    }
  } catch (err: any) {
    console.error('Error loading partners:', err);
    if (err.response?.data?.message) {
      error.value = err.response.data.message;
    } else if (err.isNetworkError) {
      error.value = 'Connection error. Please check your internet connection.';
    } else {
      error.value = 'Error loading partners';
    }
  } finally {
    loading.value = false;
  }
};

const viewPartner = (id: number) => {
  router.push(`/partners/${id}`);
};

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  const partnerName = img.alt || 'Partner';
  img.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(partnerName)}&background=667eea&color=fff&size=200`;
};

onMounted(() => {
  loadPartners();
});
</script>

<style scoped>
.top10_section {
  width: 100%;
  background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%);
  color: white;
  position: relative;
  overflow: hidden;
  border-radius: 16px;
}

.hero_badge {
  font-size: 0.75rem;
  padding: 0.25rem 0.75rem;
  background: rgba(255, 215, 0, 0.15);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 20px;
  color: #FFD700;
}

.hero_title {
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
  margin: 0;
}

.compact_leaderboard {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.leaderboard_item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  cursor: pointer;
  transition: all 0.2s ease;
  background: rgba(255, 255, 255, 0.02);
}

.leaderboard_item:last-child {
  border-bottom: none;
}

.leaderboard_item:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateX(4px);
}

.leaderboard_item.top_3 {
  background: rgba(255, 215, 0, 0.08);
}

.leaderboard_item.top_3:hover {
  background: rgba(255, 215, 0, 0.15);
}

.rank_badge {
  width: 32px;
  text-align: center;
  flex-shrink: 0;
}

.medal {
  font-size: 1.5rem;
  display: block;
}

.rank_number {
  font-size: 0.85rem;
  font-weight: 700;
  color: #FFD700;
}

.player_avatar_mini {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  border: 2px solid rgba(255, 215, 0, 0.4);
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.player_avatar_mini img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.player_avatar_mini i {
  font-size: 0.9rem;
  color: #FFD700;
}

.player_info_compact {
  min-width: 0;
  overflow: hidden;
}

.player_name_compact {
  font-weight: 600;
  font-size: 0.85rem;
  color: white;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 0.15rem;
}

.player_meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.6);
}

.specialty {
  white-space: nowrap;
}

.country {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  white-space: nowrap;
}

.btn_primary.btn-sm {
  font-size: 0.75rem;
  padding: 0.4rem 0.9rem;
  display: inline-flex;
  align-items: center;
}

@media (max-width: 768px) {
  .player_meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
  
  .leaderboard_item {
    padding: 0.5rem 0.75rem;
    gap: 0.5rem;
  }
  
  .player_avatar_mini {
    width: 32px;
    height: 32px;
  }
}
</style>
