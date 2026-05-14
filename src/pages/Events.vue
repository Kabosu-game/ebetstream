<template>
  <div class="tw-page">

    <!-- Hero -->
    <div class="tw-page-hero">
      <div>
        <h1 class="tw-page-hero__title">Upcoming Events</h1>
        <p class="tw-page-hero__sub">
          Tournaments, competitions &amp; more — don't miss your chance to compete
        </p>
      </div>
      <div class="tw-page-hero__actions">
        <span class="events-count-chip">
          <i class="fas fa-calendar-alt me-2"></i>{{ totalEvents }} Events
        </span>
      </div>
    </div>

    <!-- Filters -->
    <div class="tw-filters">
      <button
        class="tw-filter-btn"
        :class="{ active: filterStatus === null }"
        @click="filterStatus = null; loadEvents()"
      >All</button>
      <button
        class="tw-filter-btn"
        :class="{ active: filterStatus === 'upcoming' }"
        @click="filterStatus = 'upcoming'; loadEvents()"
      >Upcoming</button>
      <button
        class="tw-filter-btn"
        :class="{ active: filterStatus === 'ongoing' }"
        @click="filterStatus = 'ongoing'; loadEvents()"
      >Ongoing</button>
      <button
        class="tw-filter-btn"
        :class="{ active: filterStatus === 'past' }"
        @click="filterStatus = 'past'; loadEvents()"
      >Past</button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="tw-empty">
      <div class="spinner"></div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="tw-empty">
      <div class="tw-empty__icon"><i class="fas fa-exclamation-triangle"></i></div>
      <p class="tw-empty__title">Could not load events</p>
      <p class="tw-empty__sub">{{ error }}</p>
    </div>

    <!-- Events grid -->
    <div v-else-if="events.length > 0" class="tw-grid-3">
      <div
        v-for="event in events"
        :key="event.id"
        class="tw-card tw-card--clickable"
        @click="viewEvent(event.id)"
      >
        <!-- Thumbnail -->
        <div class="tw-card__thumb event-thumb">
          <img
            v-if="event.image_url"
            :src="event.image_url"
            :alt="event.title"
            class="thumb-img"
            @error="handleImageError($event)"
          />
          <div v-else class="event-thumb__gradient">
            <i class="fas fa-calendar-alt thumb-icon"></i>
          </div>

          <!-- Status badge over thumb -->
          <span
            v-if="event.is_ongoing"
            class="tw-badge tw-badge--ongoing thumb-badge"
          >
            <span class="tw-live-dot"></span>Ongoing
          </span>
          <span
            v-else-if="event.is_upcoming"
            class="tw-badge tw-badge--open thumb-badge"
          >Upcoming</span>
          <span
            v-else-if="event.is_past"
            class="tw-badge tw-badge--closed thumb-badge"
          >Finished</span>

          <!-- Type badge -->
          <span v-if="event.type" class="event-type-badge">{{ event.type }}</span>
        </div>

        <!-- Card body -->
        <div class="tw-card__body">
          <p class="tw-card__title">{{ event.title }}</p>

          <!-- Date -->
          <p class="tw-card__sub event-date">
            <i class="fas fa-clock"></i> {{ formatDate(event.start_at) }}
          </p>

          <!-- Description -->
          <p
            v-if="event.description"
            class="event-description"
          >{{ event.description }}</p>

          <!-- Location -->
          <div v-if="event.location" class="event-location">
            <i class="fas fa-map-marker-alt"></i>
            <span>{{ event.location }}</span>
          </div>

          <!-- Footer arrow -->
          <div class="event-footer">
            <span class="event-cta">
              View Event <i class="fas fa-arrow-right ms-1"></i>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="tw-empty">
      <div class="tw-empty__icon"><i class="fas fa-calendar-times"></i></div>
      <p class="tw-empty__title">No Events Available</p>
      <p class="tw-empty__sub">Check back soon for upcoming events and tournaments.</p>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import apiClient, { getApiErrorMessage } from '@/utils/axios';

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
    error.value = getApiErrorMessage(err);
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
/* Thumbnail */
.tw-card__thumb.event-thumb {
  position: relative;
  height: 180px;
  overflow: hidden;
  border-radius: 6px 6px 0 0;
}

.event-thumb__gradient {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgb(40, 20, 80) 0%, rgb(20, 10, 50) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.thumb-icon {
  font-size: 3rem;
  color: rgba(254, 189, 86, 0.4);
}

/* Badges over thumb */
.thumb-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 2;
}

.event-type-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 2;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 3px 10px;
  border-radius: 4px;
  background: rgba(var(--g1), 0.2);
  color: rgb(var(--g1));
}

/* Card body elements */
.event-date {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  color: rgb(var(--n3));
}

.event-date i {
  font-size: 0.75rem;
}

.event-description {
  font-size: 0.82rem;
  color: rgb(var(--n3));
  line-height: 1.5;
  margin-top: 0.4rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.event-location {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 0.5rem;
  font-size: 0.78rem;
  color: rgb(var(--n3));
}

.event-location i {
  font-size: 0.75rem;
  color: rgb(var(--g1));
}

.event-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 0.75rem;
}

.event-cta {
  font-size: 0.8rem;
  font-weight: 600;
  color: rgb(var(--g1));
  transition: opacity 0.15s;
}

.tw-card--clickable:hover .event-cta {
  opacity: 0.7;
}

/* Hero chip */
.events-count-chip {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background: rgb(var(--p3));
  border: 1px solid rgb(var(--n2));
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  color: rgb(var(--n8));
}

/* Loading spinner */
.spinner {
  width: 2.5rem;
  height: 2.5rem;
  border: 3px solid rgb(var(--n2));
  border-top-color: rgb(var(--g1));
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.tw-empty__sub {
  font-size: 0.9rem;
  color: rgb(var(--n3));
  margin-top: 0.4rem;
}

.me-2 { margin-right: 0.5rem; }
.ms-1 { margin-left: 0.25rem; }
</style>
