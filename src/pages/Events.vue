<template>
  <div class="page-content-with-space">
    <!-- Section Events -->
    <section class="events_section py-6 position-relative overflow-hidden pb-120">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12 gx-0 gx-lg-4">
            <div class="top10__main">
              <!-- Header Section -->
              <div class="row w-100 h-100 align-items-center mb-5">
                <div class="col-lg-6 col-md-7">
                  <div class="events_content" data-aos="fade-right">
                    <span class="hero_badge mb-3 d-inline-block">
                      <i class="fas fa-calendar-alt me-2"></i>Events
                    </span>
                    <h2 class="hero_title mb-4">
                      All <span class="text_gradient">Events</span>
                    </h2>
                    <p class="hero_subtitle mb-5">
                      Discover all our events, tournaments and competitions. Don't miss any opportunity to participate and win.
                    </p>
                  </div>
                </div>

                <!-- Colonne image / carte -->
                <div class="col-lg-6 col-md-5 d-none d-md-block">
                  <div class="events_image" data-aos="fade-left">
                    <div class="floating_card card_events">
                      <div class="card_icon">🎮</div>
                      <div class="card_content">
                        <span class="card_label">Total</span>
                        <span class="card_value">{{ totalEvents }} Events</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Filtres -->
              <div class="row w-100 mb-4">
                <div class="col-12">
                  <div class="d-flex flex-wrap gap-3">
                    <button 
                      class="btn_filter" 
                      :class="{ active: filterStatus === null }"
                      @click="filterStatus = null; loadEvents()"
                    >
                      All
                    </button>
                    <button 
                      class="btn_filter" 
                      :class="{ active: filterStatus === 'upcoming' }"
                      @click="filterStatus = 'upcoming'; loadEvents()"
                    >
                      Upcoming
                    </button>
                    <button 
                      class="btn_filter" 
                      :class="{ active: filterStatus === 'ongoing' }"
                      @click="filterStatus = 'ongoing'; loadEvents()"
                    >
                      Ongoing
                    </button>
                    <button 
                      class="btn_filter" 
                      :class="{ active: filterStatus === 'past' }"
                      @click="filterStatus = 'past'; loadEvents()"
                    >
                      Past
                    </button>
                  </div>
                </div>
              </div>

              <!-- Liste des événements -->
              <div v-if="loading" class="row w-100 mt-5">
                <div class="col-12 text-center py-5">
                  <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </div>
              </div>
              <div v-else-if="error" class="row w-100 mt-5">
                <div class="col-12">
                  <div class="alert alert-warning" role="alert">
                    {{ error }}
                  </div>
                </div>
              </div>
              <div v-else-if="events.length > 0" class="row w-100 mt-5 g-4">
                <div v-for="event in events" :key="event.id" class="col-12 col-md-6 col-lg-4">
                  <div class="event_card n11-bg rounded-8 p-4 h-100 d-flex flex-column" 
                       style="cursor: pointer;" 
                       @click="viewEvent(event.id)">
                    <div v-if="event.image_url" class="event_image mb-3 rounded overflow-hidden" style="height: 200px;">
                      <img 
                        :src="event.image_url" 
                        :alt="event.title"
                        class="w-100 h-100"
                        style="object-fit: cover;"
                        @error="handleImageError($event)"
                      />
                    </div>
                    <div v-else class="event_placeholder mb-3 rounded d-flex align-items-center justify-content-center" 
                         style="height: 200px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                      <i class="fas fa-calendar-alt text-white" style="font-size: 3rem;"></i>
                    </div>
                    
                    <div class="event_info flex-grow-1 d-flex flex-column">
                      <div class="d-flex align-items-center gap-2 mb-2 flex-wrap">
                        <span class="badge bg-warning text-dark px-2 py-1">
                          <i class="fas fa-clock me-1"></i>
                          {{ formatDate(event.start_at) }}
                        </span>
                        <span v-if="event.is_ongoing" class="badge bg-success px-2 py-1">
                          Ongoing
                        </span>
                        <span v-else-if="event.is_upcoming" class="badge bg-primary px-2 py-1">
                          Upcoming
                        </span>
                        <span v-else-if="event.is_past" class="badge bg-secondary px-2 py-1">
                          Finished
                        </span>
                      </div>
                      <h3 class="event_title mb-2 text-white">{{ event.title }}</h3>
                      <p v-if="event.description" class="event_description text-white small mb-3 flex-grow-1" 
                         style="opacity: 0.8; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">
                        {{ event.description }}
                      </p>
                      <div v-if="event.location" class="event_location small text-white mb-2" style="opacity: 0.7;">
                        <i class="fas fa-map-marker-alt me-1"></i>{{ event.location }}
                      </div>
                      <div class="d-flex align-items-center justify-content-between mt-3">
                        <span v-if="event.type" class="badge bg-info">
                          {{ event.type }}
                        </span>
                        <span class="text-warning">
                          <i class="fas fa-arrow-right"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="row w-100 mt-5">
                <div class="col-12 text-center py-5">
                  <p class="text-white" style="opacity: 0.7;">No events available at the moment.</p>
                </div>
              </div>
              <!-- /Liste des événements -->
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
const events = ref<Event[]>([]);
const totalEvents = ref(0);
const loading = ref(false);
const error = ref('');
const filterStatus = ref<string | null>(null);

const loadEvents = async () => {
  try {
    loading.value = true;
    error.value = '';
    
    const params: any = {
      limit: 50,
      sort_by: 'start_at',
      sort_order: filterStatus.value === 'past' ? 'desc' : 'asc'
    };

    if (filterStatus.value) {
      params.status = filterStatus.value;
    }

    const response = await apiClient.get('/events', { params });

    if (response.data.success) {
      const data = response.data.data;
      if (Array.isArray(data)) {
        events.value = data;
        totalEvents.value = data.length;
      } else {
        events.value = data.data || [];
        totalEvents.value = data.total || events.value.length;
      }
    } else {
      error.value = response.data.message || 'Error loading events';
    }
  } catch (err: any) {
    console.error('Error loading events:', err);
    if (err.response?.data?.message) {
      error.value = err.response.data.message;
    } else if (err.isNetworkError) {
      error.value = 'Connection error. Check your internet connection.';
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
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const handleImageError = (event: Event | any) => {
  const img = (event.target || (event as any).target) as HTMLImageElement;
  if (img) {
    img.style.display = 'none';
  }
};

onMounted(() => {
  loadEvents();
});
</script>

<style scoped>
.events_section {
  width: 100%;
  background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%);
  color: white;
  position: relative;
  overflow: hidden;
  border-radius: 24px;
}

.text_gradient {
  background: linear-gradient(90deg, #FF9F00, #FF9F00);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.btn_filter {
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 25px;
  font-weight: 600;
  transition: 0.3s;
  cursor: pointer;
}

.btn_filter:hover {
  background: rgba(255, 159, 0, 0.2);
  border-color: #FF9F00;
  color: #FF9F00;
}

.btn_filter.active {
  background: #FF9F00;
  border-color: #FF9F00;
  color: #000;
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

.event_card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.event_card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 159, 0, 0.3);
}

.event_title {
  font-weight: 700;
  font-size: 1.2rem;
}

.hero_badge {
  background: rgba(255, 159, 0, 0.2);
  color: #FF9F00;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
}

.hero_title {
  font-size: 2.5rem;
  font-weight: 800;
  color: white;
  line-height: 1.2;
}

.hero_subtitle {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
}

.page-content-with-space {
  padding-top: 90px;
}

@media (max-width: 768px) {
  .page-content-with-space {
    padding-top: 60px;
  }
  
  .hero_title {
    font-size: 1.8rem;
  }
}
</style>

