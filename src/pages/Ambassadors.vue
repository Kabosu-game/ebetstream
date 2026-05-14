<template>
  <div class="tw-page">
    <!-- Hero -->
    <div class="tw-page-hero">
      <div class="tw-page-hero__title">
        <span class="hero-icon">
          <i class="fas fa-user-tie"></i>
        </span>
        Ambassadors
      </div>
      <p class="tw-page-hero__sub">
        Discover the most active and inspiring ambassadors of the week and follow their performances.
      </p>
    </div>

    <!-- Section header -->
    <div class="tw-section-header">
      <div class="tw-section-title">
        <span class="tw-section-icon"><i class="fas fa-crown"></i></span>
        Top Ambassadors
      </div>
      <span class="count-badge">{{ ambassadors.length }} ranked</span>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="tw-empty">
      <div class="tw-empty__icon">
        <i class="fas fa-spinner fa-spin"></i>
      </div>
      <p class="tw-empty__title">{{ $t('ui.loading_ambassadors') }}</p>
    </div>

    <!-- Ambassador grid -->
    <div v-else-if="ambassadors.length > 0" class="tw-grid-3">
      <div
        v-for="(ambassador, index) in ambassadors"
        :key="ambassador.id"
        class="tw-card tw-card--clickable amb-card"
        @click="viewAmbassador(ambassador.id)"
      >
        <!-- Rank + score row -->
        <div class="amb-card__topbar">
          <span class="amb-rank" :class="{ 'amb-rank--gold': index === 0, 'amb-rank--silver': index === 1, 'amb-rank--bronze': index === 2 }">
            #{{ index + 1 }}
          </span>
          <span class="tw-badge amb-score">
            <i class="fas fa-star"></i>
            {{ ambassador.score }} pts
          </span>
        </div>

        <!-- Avatar + identity -->
        <div class="amb-card__profile">
          <div class="tw-avatar amb-avatar">
            <img
              v-if="ambassador.avatar_url"
              :src="ambassador.avatar_url"
              :alt="$t('ui.ambassador_name')"
            />
            <span v-else class="amb-avatar__fallback">
              <i class="fas fa-user"></i>
            </span>
          </div>
          <div class="amb-identity">
            <span class="tw-card__title">{{ ambassador.name }}</span>
            <span class="tw-card__sub">@{{ ambassador.username }}</span>
          </div>
        </div>

        <!-- Country -->
        <div v-if="ambassador.country" class="amb-country">
          <i class="fas fa-map-marker-alt"></i>
          {{ ambassador.country }}
        </div>

        <!-- Bio -->
        <p v-if="ambassador.bio" class="amb-bio">
          {{ ambassador.bio }}
        </p>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="tw-empty">
      <div class="tw-empty__icon">
        <i class="fas fa-users-slash"></i>
      </div>
      <p class="tw-empty__title">{{ $t('ui.no_ambassadors_available_at_the_moment') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t } = useI18n();

import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '@/utils/axios';

interface Ambassador {
  id: number;
  name: string;
  username: string;
  score: number;
  avatar?: string | null;
  avatar_url?: string;
  country?: string | null;
  bio?: string | null;
}

const router = useRouter();
const ambassadors = ref<Ambassador[]>([]);
const loading = ref(false);
const error = ref('');

const loadAmbassadors = async () => {
  try {
    loading.value = true;
    error.value = '';

    const response = await apiClient.get('/ambassadors', {
      params: { limit: 100 } // Get all ambassadors
    });

    if (response.data.success) {
      ambassadors.value = response.data.data;
    }
  } catch (err: any) {
    console.error('Error loading ambassadors:', err);
    error.value = 'Error loading ambassadors';
  } finally {
    loading.value = false;
  }
};

const viewAmbassador = (id: number) => {
  router.push(`/ambassadors/${id}`);
};

onMounted(() => {
  loadAmbassadors();
});
</script>

<style scoped>
/* ── Ambassador card extras ── */
.hero-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: rgba(var(--g1), 0.15);
  color: rgb(var(--g1));
  font-size: 1rem;
  margin-right: 0.5rem;
  vertical-align: middle;
}

.count-badge {
  font-size: 0.8rem;
  font-weight: 600;
  color: rgb(var(--n3));
  background: rgba(var(--n2), 1);
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
}

/* Card top bar */
.amb-card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.25rem;
}

.amb-card__topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.amb-rank {
  font-size: 1.25rem;
  font-weight: 800;
  color: rgb(var(--n3));
  letter-spacing: -0.5px;
}

.amb-rank--gold  { color: #FFD700; }
.amb-rank--silver { color: #C0C0C0; }
.amb-rank--bronze { color: #CD7F32; }

.amb-score {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.78rem;
  font-weight: 700;
}

/* Profile row */
.amb-card__profile {
  display: flex;
  align-items: center;
  gap: 0.875rem;
}

/* Avatar */
.amb-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  border: 2px solid rgba(var(--g1), 0.35);
  background: rgb(var(--p3));
  display: flex;
  align-items: center;
  justify-content: center;
}

.amb-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.amb-avatar__fallback {
  font-size: 1.4rem;
  color: rgb(var(--n3));
}

.amb-identity {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

/* Country */
.amb-country {
  font-size: 0.8rem;
  color: rgb(var(--n3));
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.amb-country i {
  color: rgb(var(--g1));
  font-size: 0.72rem;
}

/* Bio */
.amb-bio {
  font-size: 0.8rem;
  color: rgb(var(--n3));
  line-height: 1.55;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
