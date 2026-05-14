<template>
  <!-- ===== UPCOMING EVENTS (Twitch-style) ===== -->
  <section class="tw-section">
    <div class="tw-section-header">
      <div class="tw-section-header__left">
        <i class="ti ti-calendar-event tw-section-icon"></i>
        <h2 class="tw-section-title">{{ $t('events.title') }}</h2>
      </div>
      <router-link to="/events" class="tw-see-all">
        {{ $t('events.viewAllEvents') }} <i class="fas fa-chevron-right"></i>
      </router-link>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="tw-event-grid">
      <div v-for="n in 3" :key="n" class="tw-event-card tw-event-card--skeleton">
        <div class="tw-event-card__thumb skeleton"></div>
        <div class="tw-event-card__body">
          <div class="skeleton-line mb-2"></div>
          <div class="skeleton-line skeleton-line--short"></div>
        </div>
      </div>
    </div>

    <!-- Event cards -->
    <div v-else-if="upcomingEvents.length > 0" class="tw-event-grid">
      <div
        v-for="event in upcomingEvents"
        :key="event.id"
        class="tw-event-card"
        @click="viewEvent(event.id)"
      >
        <!-- Thumbnail -->
        <div class="tw-event-card__thumb">
          <img
            v-if="event.image_url"
            :src="event.image_url"
            :alt="$t('ui.event_title_2')"
            @error="onImgError"
          />
          <div v-else class="tw-event-card__thumb-fallback">
            <i class="fas fa-calendar-day"></i>
          </div>
          <!-- Type badge -->
          <span v-if="event.type" class="tw-event-badge">{{ event.type }}</span>
        </div>

        <!-- Body -->
        <div class="tw-event-card__body">
          <p class="tw-event-card__title">{{ event.title }}</p>
          <div class="tw-event-card__meta">
            <span class="tw-event-card__date">
              <i class="fas fa-clock"></i> {{ formatDate(event.start_at) }}
            </span>
            <span v-if="event.location" class="tw-event-card__location">
              <i class="fas fa-map-marker-alt"></i> {{ event.location }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty -->
    <div v-else class="tw-empty-state">
      <i class="ti ti-calendar-off tw-empty-state__icon"></i>
      <p>{{ $t('events.noEvents', 'No upcoming events at the moment.') }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import apiClient from "@/utils/axios";

const { t } = useI18n();
const router = useRouter();

interface EventItem {
  id: number;
  title: string;
  start_at: string;
  location?: string | null;
  image_url?: string;
  type?: string | null;
}

const upcomingEvents = ref<EventItem[]>([]);
const loading = ref(false);

const loadEvents = async () => {
  try {
    loading.value = true;
    const res = await apiClient.get("/events", {
      params: { status: "upcoming", limit: 6, sort_by: "start_at", sort_order: "asc" },
    });
    if (res.data.success) {
      const data = res.data.data;
      upcomingEvents.value = Array.isArray(data) ? data : data?.data || [];
    }
  } catch {
    upcomingEvents.value = [];
  } finally {
    loading.value = false;
  }
};

const viewEvent = (id: number) => router.push(`/events/${id}`);

const formatDate = (d: string) => {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const onImgError = (e: globalThis.Event) => {
  const img = e.target as HTMLImageElement;
  if (img) img.style.display = "none";
};

onMounted(() => loadEvents());
</script>

<style scoped>
.tw-section {
  padding: 24px 0 8px;
}

.tw-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.tw-section-header__left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tw-section-icon {
  font-size: 20px;
  color: rgb(var(--g1));
}

.tw-section-title {
  font-size: 18px;
  font-weight: 700;
  color: rgb(var(--n8));
  margin: 0;
}

.tw-see-all {
  font-size: 13px;
  font-weight: 600;
  color: rgb(var(--g1));
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 2px;

  &:hover { color: rgba(var(--g1), 0.8); }
}

/* Grid */
.tw-event-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  @media (max-width: 900px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 576px) { grid-template-columns: 1fr; }
}

/* Card */
.tw-event-card {
  background: rgb(var(--p2));
  border: 1px solid rgb(var(--n2));
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.2s, transform 0.2s;

  &:hover {
    border-color: rgb(var(--g1));
    transform: translateY(-3px);
  }
}

/* Thumbnail */
.tw-event-card__thumb {
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: rgb(var(--p3));

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s;
  }

  .tw-event-card:hover & img {
    transform: scale(1.04);
  }
}

.tw-event-card__thumb-fallback {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgb(var(--p3)) 0%, rgb(var(--n11)) 100%);

  i {
    font-size: 40px;
    color: rgba(var(--n3), 0.5);
  }
}

.tw-event-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgb(var(--g1));
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 2px 7px;
  border-radius: 3px;
}

/* Body */
.tw-event-card__body {
  padding: 12px;
}

.tw-event-card__title {
  font-size: 14px;
  font-weight: 600;
  color: rgb(var(--n8));
  margin: 0 0 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tw-event-card__meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.tw-event-card__date,
.tw-event-card__location {
  font-size: 12px;
  color: rgb(var(--n3));
  display: flex;
  align-items: center;
  gap: 4px;

  i { font-size: 12px; }
}

/* Skeleton */
.tw-event-card--skeleton .tw-event-card__thumb {
  background: linear-gradient(90deg, rgb(var(--p2)) 25%, rgb(var(--p3)) 50%, rgb(var(--p2)) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

.tw-event-card__body .skeleton-line {
  height: 12px;
  border-radius: 4px;
  background: linear-gradient(90deg, rgb(var(--p2)) 25%, rgb(var(--p3)) 50%, rgb(var(--p2)) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

.skeleton-line--short { width: 60%; }
.mb-2 { margin-bottom: 8px; }

@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Empty state */
.tw-empty-state {
  text-align: center;
  padding: 40px 0;
  color: rgb(var(--n3));

  &__icon { font-size: 48px; margin-bottom: 12px; display: block; opacity: 0.4; }
  p { font-size: 14px; margin: 0; }
}
</style>
