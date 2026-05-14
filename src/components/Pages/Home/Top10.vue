<template>
  <section class="tw-section">
    <div class="tw-section-header">
      <div class="tw-section-header__left">
        <i class="ti ti-trophy tw-section-icon"></i>
        <h2 class="tw-section-title">{{ $t('ui.top_10_des_meilleurs_joueurs') }}</h2>
      </div>
      <router-link to="/players" class="tw-see-all">
        {{ $t('labels.view_all') }} <i class="fas fa-chevron-right"></i>
      </router-link>
    </div>

    <div v-if="loading" class="tw-top10-loading">
      <div v-for="n in 5" :key="n" class="tw-top10-row tw-top10-row--skeleton">
        <div class="skeleton-line skeleton-line--short"></div>
        <div class="skeleton-avatar"></div>
        <div class="skeleton-line flex-grow-1"></div>
      </div>
    </div>

    <div v-else-if="error" class="tw-empty-state">
      <i class="ti ti-alert-circle tw-empty-state__icon"></i>
      <p>{{ error }}</p>
    </div>

    <div v-else-if="topPlayers.length === 0" class="tw-empty-state">
      <i class="ti ti-users tw-empty-state__icon"></i>
      <p>{{ $t('ui.aucun_joueur_disponible_pour_le_moment') }}</p>
    </div>

    <div v-else class="tw-top10-list">
      <div
        v-for="(player, index) in topPlayers"
        :key="player.id"
        class="tw-top10-row"
        :class="{ 'tw-top10-row--top3': index < 3 }"
        @click="viewPlayer(player.id)"
      >
        <div class="tw-top10-rank">
          <span v-if="index === 0" class="tw-top10-medal"><i class="fas fa-medal" style="color:#ffd700"></i></span>
          <span v-else-if="index === 1" class="tw-top10-medal">{{ $t('ui.text_5') }}</span>
          <span v-else-if="index === 2" class="tw-top10-medal">{{ $t('ui.text_6') }}</span>
          <span v-else class="tw-top10-rank-num">#{{ index + 1 }}</span>
        </div>

        <div class="tw-top10-avatar">
          <img
            v-if="player.avatar_url"
            :src="player.avatar_url"
            :alt="$t('ui.player_name_2')"
            @error="handleImageError($event)"
          />
          <i v-else class="fas fa-user"></i>
        </div>

        <div class="tw-top10-info">
          <p class="tw-top10-name">{{ player.name }}</p>
          <p class="tw-top10-meta">
            <span>@{{ player.username }}</span>
            <span v-if="player.country"><i class="fas fa-map-marker-alt"></i> {{ player.country }}</span>
          </p>
        </div>

        <div class="tw-top10-score">
          <span class="tw-top10-score-val">{{ player.score }}</span>
          <span class="tw-top10-score-lbl">{{ $t('ui.pts') }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t } = useI18n();

import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '@/utils/axios';

interface Player {
  id: number;
  name: string;
  username: string;
  score: number;
  avatar_url?: string;
  country?: string | null;
}

const router = useRouter();
const topPlayers = ref<Player[]>([]);
const loading = ref(false);
const error = ref('');

const loadTopPlayers = async () => {
  try {
    loading.value = true;
    error.value = '';
    const response = await apiClient.get('/top-players', { params: { limit: 10, period: 'week' } });
    if (response.data.success) topPlayers.value = response.data.data;
  } catch {
    error.value = t('errors.loadPlayersTop10');
  } finally {
    loading.value = false;
  }
};

const viewPlayer = (id: number) => router.push(`/players/${id}`);

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(img.alt || 'User')}&background=667eea&color=fff&size=200`;
};

onMounted(loadTopPlayers);
</script>

<style scoped>
.tw-top10-list {
  background: rgb(var(--p2));
  border: 1px solid rgb(var(--n2));
  border-radius: 8px;
  overflow: hidden;
}

.tw-top10-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid rgb(var(--n2));
  cursor: pointer;
  transition: background 0.15s, transform 0.15s;
}

.tw-top10-row:last-child { border-bottom: none; }

.tw-top10-row:hover {
  background: rgb(var(--p3));
  transform: translateX(3px);
}

.tw-top10-row--top3 {
  background: rgba(var(--g1), 0.06);
}

.tw-top10-row--top3:hover {
  background: rgba(var(--g1), 0.1);
}

.tw-top10-rank {
  width: 36px;
  text-align: center;
  flex-shrink: 0;
}

.tw-top10-medal { font-size: 1.4rem; }

.tw-top10-rank-num {
  font-size: 13px;
  font-weight: 800;
  color: rgb(var(--g1));
}

.tw-top10-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  border: 2px solid rgb(var(--n2));
  background: rgb(var(--p3));
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgb(var(--n3));
}

.tw-top10-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.tw-top10-info {
  flex: 1;
  min-width: 0;
}

.tw-top10-name {
  font-size: 14px;
  font-weight: 700;
  color: rgb(var(--n8));
  margin: 0 0 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tw-top10-meta {
  font-size: 12px;
  color: rgb(var(--n3));
  margin: 0;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.tw-top10-meta i { font-size: 11px; }

.tw-top10-score {
  text-align: right;
  flex-shrink: 0;
}

.tw-top10-score-val {
  display: block;
  font-size: 16px;
  font-weight: 800;
  color: rgb(var(--g1));
}

.tw-top10-score-lbl {
  font-size: 10px;
  color: rgb(var(--n3));
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.tw-top10-loading {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tw-top10-row--skeleton {
  background: rgb(var(--p2));
  border: 1px solid rgb(var(--n2));
  border-radius: 8px;
  padding: 12px 16px;
}
</style>
