<template>
  <div class="tw-page">

    <!-- Hero -->
    <div class="tw-page-hero">
      <div>
        <h1 class="tw-page-hero__title">{{ $t('nav.championships') }}</h1>
        <p class="tw-page-hero__sub">{{ $t('ui.browse_all_available_championships_and_register_to_compete') }}</p>
      </div>
      <div class="tw-page-hero__actions">
        <button class="tw-btn tw-btn--secondary" @click="$router.push('/')">
          <i class="fas fa-arrow-left me-2"></i>{{ $t('common.back') }}</button>
      </div>
    </div>

    <!-- Filter Bar -->
    <div class="tw-filters">
      <select v-model="selectedDivision" @change="loadChampionships" class="tw-select">
        <option value="">{{ $t('ui.all_divisions') }}</option>
        <option value="1">{{ $t('ui.division_1') }}</option>
        <option value="2">{{ $t('ui.division_2') }}</option>
        <option value="3">{{ $t('ui.division_3') }}</option>
      </select>

      <select v-model="selectedGame" @change="loadChampionships" class="tw-select">
        <option value="">{{ $t('ui.all_games') }}</option>
        <option value="COD Mobile">{{ $t('ui.cod_mobile') }}</option>
        <option value="Free Fire">{{ $t('ui.free_fire') }}</option>
        <option value="PUBG Mobile">{{ $t('ui.pubg_mobile') }}</option>
        <option value="Mobile Legends">{{ $t('ui.mobile_legends') }}</option>
        <option value="eFootball / FC / DLS">{{ $t('ui.efootball_fc_dls') }}</option>
        <option value="Clash Royale">{{ $t('ui.clash_royale') }}</option>
        <option value="Brawl Stars">{{ $t('ui.brawl_stars') }}</option>
        <option value="Stumble Guys">{{ $t('ui.stumble_guys') }}</option>
      </select>

      <select v-model="selectedStatus" @change="loadChampionships" class="tw-select">
        <option value="">{{ $t('ui.all_status') }}</option>
        <option value="registration_open">{{ $t('ui.registration_open') }}</option>
        <option value="validated">{{ $t('ui.validated') }}</option>
        <option value="started">{{ $t('betting.live') }}</option>
        <option value="finished">{{ $t('ui.finished') }}</option>
      </select>
    </div>

    <!-- Loading skeleton -->
    <div v-if="loading" class="tw-grid-3">
      <div v-for="n in 6" :key="n" class="champ-skeleton">
        <div class="skel-thumb"></div>
        <div class="skel-body">
          <div class="skel-line skel-line--title"></div>
          <div class="skel-line skel-line--sub"></div>
          <div class="skel-line skel-line--short"></div>
        </div>
      </div>
    </div>

    <!-- Championships Grid -->
    <div v-else-if="championships.length > 0" class="tw-grid-3">
      <div
        v-for="championship in championships"
        :key="championship.id"
        class="tw-card tw-card--clickable"
        @click="viewChampionship(championship.id)"
      >
        <!-- Thumb / cover -->
        <div class="tw-card__thumb champ-thumb">
          <div class="champ-thumb__gradient"></div>
          <!-- Division badge -->
          <span class="champ-division-badge">Div {{ championship.division }}</span>
          <!-- Status badge -->
          <span
            class="tw-badge"
            :class="{
              'tw-badge--live': championship.status === 'started',
              'tw-badge--open': championship.status === 'registration_open',
              'tw-badge--closed': championship.status === 'finished',
              'tw-badge--ongoing': championship.status === 'validated',
            }"
          >
            <span v-if="championship.status === 'started'" class="tw-live-dot"></span>
            {{ statusLabel(championship.status) }}
          </span>
          <i class="fas fa-trophy champ-trophy-icon"></i>
        </div>

        <!-- Body -->
        <div class="tw-card__body">
          <p class="tw-card__title">{{ championship.name }}</p>
          <p class="tw-card__sub">{{ championship.game }}</p>

          <div class="champ-stats">
            <div class="champ-stat">
              <i class="fas fa-users"></i>
              <span>{{ championship.validated_registrations_count ?? 0 }} / {{ championship.max_participants }}</span>
            </div>
            <div v-if="championship.total_prize_pool" class="champ-stat champ-stat--prize">
              <i class="fas fa-coins"></i>
              <span>{{ championship.total_prize_pool.toLocaleString() }} EBT</span>
            </div>
          </div>

          <div class="tw-divider"></div>

          <button class="tw-btn tw-btn--primary champ-cta" @click.stop="viewChampionship(championship.id)">
            View Championship
          </button>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="tw-empty">
      <div class="tw-empty__icon"><i class="fas fa-trophy"></i></div>
      <p class="tw-empty__title">{{ $t('ui.no_championships_found') }}</p>
      <p class="tw-empty__sub">{{ $t('ui.try_adjusting_your_filters_to_find_championships') }}</p>
    </div>

  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t } = useI18n();

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

const statusLabel = (status: string) => {
  const map: Record<string, string> = {
    registration_open: 'Open',
    validated: 'Validated',
    started: 'Live',
    finished: 'Finished',
  };
  return map[status] || status;
};

onMounted(() => {
  loadChampionships();
});
</script>

<style scoped>
/* Thumb */
.tw-card__thumb.champ-thumb {
  position: relative;
  height: 160px;
  overflow: hidden;
  border-radius: 6px 6px 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.champ-thumb__gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgb(40, 20, 80) 0%, rgb(20, 10, 40) 100%);
}

.champ-trophy-icon {
  position: relative;
  z-index: 1;
  font-size: 3rem;
  color: rgba(var(--g1), 0.4);
  color: rgba(254, 189, 86, 0.4);
}

.champ-division-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 2;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: rgba(255, 255, 255, 0.12);
  color: rgb(var(--n8));
  padding: 3px 10px;
  border-radius: 4px;
}

.tw-card__thumb .tw-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 2;
}

/* Stats row */
.champ-stats {
  display: flex;
  gap: 1rem;
  margin-top: 0.75rem;
  flex-wrap: wrap;
}

.champ-stat {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.8rem;
  color: rgb(var(--n3));
}

.champ-stat i {
  font-size: 0.75rem;
  color: rgb(var(--n3));
}

.champ-stat--prize {
  color: rgb(var(--g1));
}

.champ-stat--prize i {
  color: rgb(var(--g1));
}

/* CTA button */
.champ-cta {
  width: 100%;
  justify-content: center;
  margin-top: 0.25rem;
}

/* Skeleton */
.champ-skeleton {
  background: rgb(var(--p2));
  border-radius: 8px;
  overflow: hidden;
}

.skel-thumb {
  height: 160px;
  background: rgb(var(--p3));
  animation: shimmer 1.4s infinite ease-in-out;
}

.skel-body {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.skel-line {
  height: 12px;
  border-radius: 4px;
  background: rgb(var(--p3));
  animation: shimmer 1.4s infinite ease-in-out;
}

.skel-line--title { width: 70%; height: 16px; }
.skel-line--sub   { width: 50%; }
.skel-line--short { width: 40%; }

@keyframes shimmer {
  0%, 100% { opacity: 0.5; }
  50%       { opacity: 1; }
}

.tw-empty__sub {
  font-size: 0.9rem;
  color: rgb(var(--n3));
  margin-top: 0.4rem;
}

.me-2 { margin-right: 0.5rem; }
</style>
