<template>
  <!-- Events Section -->
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
                        <i class="fas fa-calendar-alt me-2"></i>{{ $t('events.title') }}
                      </span>
                      <h2 class="hero_title mb-4">
                        {{ $t('events.upcomingEventsThisMonth') }}
                      </h2>
                      <p class="hero_subtitle mb-5">
                        {{ $t('events.upcomingEventsDescription') }}
                      </p>
                      <div class="hero_actions d-flex flex-wrap gap-3">
                        <router-link to="/events" class="btn_primary text-decoration-none">
                          <span>{{ $t('events.viewAllEvents') }}</span>
                          <i class="fas fa-arrow-right ms-2"></i>
                        </router-link>
                      </div>
                    </div>
                  </div>

                  <!-- Colonne illustration / floating card -->
                  <div class="col-lg-6 col-md-5 d-none d-md-block">
                    <div class="top10_image" data-aos="fade-left">
                      <div class="floating_card card_top10">
                        <div class="card_icon">📅</div>
                        <div class="card_content">
                          <span class="card_label">Events</span>
                          <span class="card_value">Upcoming</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Liste des événements -->
                  <div class="col-12 mt-5">
                    <div v-if="loading" class="text-center py-5">
                      <div class="spinner-border text-warning" role="status">
                        <span class="visually-hidden">Loading...</span>
                      </div>
                    </div>
                    <div v-else-if="error" class="alert alert-warning" role="alert">
                      {{ error }}
                    </div>
                    <div v-else-if="upcomingEvents.length === 0" class="text-center py-5">
                      <p class="text-muted">{{ $t('events.noEvents') }}</p>
                    </div>
                    <div v-else class="top10_list row g-4">
                      <div v-for="event in upcomingEvents" :key="event.id" class="col-lg-6 col-xl-4">
                        <div class="player_card p-4" style="cursor: pointer;" @click="viewEvent(event.id)">
                          <div v-if="event.image_url" class="event_image mb-3 rounded overflow-hidden" style="height: 150px;">
                            <img 
                              :src="event.image_url" 
                              :alt="event.title"
                              class="w-100 h-100"
                              style="object-fit: cover;"
                              @error="handleImageError($event)"
                            />
                          </div>
                          <div v-else class="event_placeholder mb-3 rounded d-flex align-items-center justify-content-center" 
                               style="height: 150px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                            <i class="fas fa-calendar-alt text-white" style="font-size: 2.5rem;"></i>
                          </div>
                          <div class="player_info">
                            <h3 class="player_name mb-2">{{ event.title }}</h3>
                            <p class="player_score mb-2">
                              <i class="fas fa-clock me-1"></i>{{ formatDate(event.start_at) }}
                            </p>
                            <p v-if="event.location" class="player_country small text-muted mb-0">
                              <i class="fas fa-map-marker-alt me-1"></i>{{ event.location }}
                            </p>
                            <p v-if="event.type" class="player_score small mt-2 mb-0">
                              <span class="badge bg-primary">{{ event.type }}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- /Events List -->
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
import { useI18n } from 'vue-i18n';
import apiClient from '@/utils/axios';

const { t } = useI18n();

interface Event {
  id: number;
  title: string;
  description?: string | null;
  start_at: string;
  end_at?: string | null;
  location?: string | null;
  image?: string | null;
  image_url?: string;
  status?: string;
  type?: string | null;
  is_upcoming?: boolean;
  is_ongoing?: boolean;
  is_past?: boolean;
}

const router = useRouter();
const upcomingEvents = ref<Event[]>([]);
const loading = ref(false);
const error = ref('');

const loadEvents = async () => {
  try {
    loading.value = true;
    error.value = '';
    
    const response = await apiClient.get('/events', {
      params: { 
        status: 'upcoming',
        limit: 6,
        sort_by: 'start_at',
        sort_order: 'asc'
      }
    });

    if (response.data.success) {
      const data = response.data.data;
      upcomingEvents.value = Array.isArray(data) ? data : (data?.data || []);
    } else {
      error.value = response.data.message || 'Error loading events';
    }
  } catch (err: any) {
    console.error('Error loading events:', err);
    if (err.response?.data?.message) {
      error.value = err.response.data.message;
    } else if (err.isNetworkError) {
      error.value = 'Connection error. Please check your internet connection.';
    } else {
      error.value = 'Error loading events';
    }
  } finally {
    loading.value = false;
  }
};

const viewEvent = (id: number) => {
  router.push(`/events/${id}`);
};

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    day: 'numeric', 
    month: 'short',
    year: 'numeric'
  });
};

const handleImageError = (e: Event | any) => {
  const img = (e.target || (e as any).target) as HTMLImageElement;
  if (img) {
    img.style.display = 'none';
  }
};

onMounted(() => {
  loadEvents();
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

.player_card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(15px);
  border-radius: 16px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.player_card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
}

.player_name {
  font-weight: 700;
  font-size: 1.1rem;
}

.player_score {
  font-size: 0.9rem;
  opacity: 0.85;
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

