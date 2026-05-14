<template>
  <div>
    <!-- Hero -->
    <div class="tw-page-hero">
      <p class="tw-page-hero__eyebrow">
        <i class="fas fa-shield-alt"></i>{{ $t('ui.ebetstream_clans') }}</p>
      <h1 class="tw-page-hero__title">{{ $t('ui.discover_the_most_powerful_clans') }}</h1>
      <p class="tw-page-hero__sub">
        Join clans, participate in collective challenges, and compete with the best teams to dominate the arena.
      </p>
      <div class="tw-page-hero__actions">
        <button v-if="isAuthenticated" class="tw-btn tw-btn--primary" @click="showCreateModal = true">
          <i class="fas fa-plus"></i>{{ $t('ui.create_a_clan') }}</button>
        <router-link v-else to="/login" class="tw-btn tw-btn--primary">
          <i class="fas fa-sign-in-alt"></i>{{ $t('ui.login_to_create_clan') }}</router-link>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="tw-grid-3">
      <div v-for="n in 6" :key="n" class="clan-skeleton">
        <div class="clan-skeleton__header tw-skeleton"></div>
        <div class="clan-skeleton__line tw-skeleton mt-2"></div>
        <div class="clan-skeleton__line tw-skeleton mt-2" style="width:60%"></div>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="tw-alert tw-alert--error">
      <i class="fas fa-exclamation-circle"></i> {{ error }}
    </div>

    <!-- Clans grid -->
    <div v-else-if="clans.length > 0" class="tw-grid-3">
      <div v-for="clan in clans" :key="clan.id" class="tw-card tw-card--clickable clan-card">
        <!-- Header bar -->
        <div class="clan-card__header">
          <div class="clan-card__avatar">
            <img v-if="clan.logo" :src="clan.logo" :alt="$t('ui.clan_name_2')" />
            <i v-else class="fas fa-shield-alt"></i>
          </div>
          <div class="clan-card__title-block">
            <p class="clan-card__name">{{ clan.name }}</p>
            <p class="clan-card__leader" v-if="clan.leader">
              <i class="fas fa-crown"></i> {{ clan.leader.username }}
            </p>
          </div>
          <span class="tw-badge tw-badge--open" v-if="clan.status === 'active'">{{ $t('common.active') }}</span>
        </div>

        <!-- Description -->
        <div class="tw-card__body">
          <p class="clan-card__desc" v-if="clan.description">
            {{ clan.description.length > 100 ? clan.description.substring(0, 100) + '…' : clan.description }}
          </p>

          <!-- Stats -->
          <div class="clan-card__stats">
            <div class="clan-stat">
              <i class="fas fa-users"></i>
              <span>{{ clan.members_count || 0 }}/{{ clan.max_members || 50 }} members</span>
            </div>
            <div class="clan-stat">
              <i class="fas fa-calendar-alt"></i>
              <span>{{ formatDate(clan.created_at) }}</span>
            </div>
          </div>

          <!-- CTA -->
          <router-link :to="`/clans/${clan.id}`" class="tw-btn tw-btn--ghost tw-btn--sm clan-card__cta">
            View Clan <i class="fas fa-arrow-right"></i>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Empty -->
    <div v-else class="tw-empty">
      <i class="ti ti-shield-off tw-empty__icon"></i>
      <p class="tw-empty__title">{{ $t('ui.no_clans_yet') }}</p>
      <p class="tw-empty__sub">{{ $t('ui.be_the_first_to_create_a_clan') }}</p>
      <button v-if="isAuthenticated" class="tw-btn tw-btn--primary" @click="showCreateModal = true">
        <i class="fas fa-plus"></i>{{ $t('ui.create_first_clan') }}</button>
    </div>

    <!-- Pagination -->
    <div v-if="pagination && pagination.total > pagination.per_page" class="tw-pagination">
      <button
        class="tw-page-btn"
        :disabled="!pagination.prev_page_url"
        @click="loadPage(pagination.current_page - 1)"
      >
        <i class="fas fa-chevron-left"></i>
      </button>
      <button
        v-for="page in pagination.last_page"
        :key="page"
        class="tw-page-btn"
        :class="{ active: page === pagination.current_page }"
        @click="loadPage(page)"
      >{{ page }}</button>
      <button
        class="tw-page-btn"
        :disabled="!pagination.next_page_url"
        @click="loadPage(pagination.current_page + 1)"
      >
        <i class="fas fa-chevron-right"></i>
      </button>
    </div>

    <!-- Create Clan Modal -->
    <div v-if="showCreateModal" class="tw-modal-overlay" @click.self="showCreateModal = false">
      <div class="tw-modal">
        <div class="tw-modal__header">
          <h3 class="tw-modal__title">{{ $t('ui.create_a_new_clan') }}</h3>
          <button class="tw-modal__close" @click="showCreateModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="tw-modal__body">
          <form @submit.prevent="createClan">
            <div class="tw-form-group">
              <label class="tw-label">{{ $t('ui.clan_name') }}</label>
              <input v-model="createForm.name" type="text" class="tw-input" :placeholder="$t('ui.enter_clan_name')" required maxlength="100" />
            </div>
            <div class="tw-form-group">
              <label class="tw-label">{{ $t('ui.logo_url_optional') }}</label>
              <input v-model="createForm.logo" type="url" class="tw-input" :placeholder="$t('ui.https_example_com_logo_png')" maxlength="255" />
            </div>
            <div class="tw-form-group">
              <label class="tw-label">{{ $t('ui.max_members') }}</label>
              <input v-model.number="createForm.max_members" type="number" class="tw-input" placeholder="50" min="5" max="100" />
              <p style="font-size:12px;color:rgb(var(--n3));margin-top:4px;">{{ $t('ui.default_50_members') }}</p>
            </div>
            <div class="tw-form-group">
              <label class="tw-label">{{ $t('common.description') }}</label>
              <textarea v-model="createForm.description" class="tw-input" rows="4" :placeholder="$t('ui.describe_your_clan')" maxlength="1000" style="height:auto;padding:10px 14px;resize:vertical;"></textarea>
            </div>
            <div v-if="createError" class="tw-alert tw-alert--error">{{ createError }}</div>
            <div v-if="createSuccess" class="tw-alert tw-alert--success">{{ createSuccess }}</div>
          </form>
        </div>
        <div class="tw-modal__footer">
          <button class="tw-btn tw-btn--secondary" @click="showCreateModal = false" :disabled="creating">{{ $t('common.cancel') }}</button>
          <button class="tw-btn tw-btn--primary" @click="createClan" :disabled="creating">
            <i class="fas fa-check"></i> {{ creating ? 'Creating…' : 'Create Clan' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t } = useI18n();

import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import apiClient from "@/utils/axios";

const router = useRouter();

interface Clan {
  id: number;
  name: string;
  logo?: string;
  description?: string;
  leader_id?: number;
  leader?: {
    id: number;
    username: string;
  };
  status: string;
  member_count: number;
  max_members: number;
  members_count?: number;
  created_at: string;
}

const clans = ref<Clan[]>([]);
const loading = ref(false);
const error = ref("");
const showCreateModal = ref(false);
const creating = ref(false);
const createError = ref("");
const createSuccess = ref("");
const pagination = ref<any>(null);

const createForm = ref({
  name: "",
  logo: "",
  description: "",
  max_members: 50,
});

const isAuthenticated = computed(() => {
  return !!localStorage.getItem("auth_token");
});

const loadClans = async (page = 1) => {
  try {
    loading.value = true;
    error.value = "";
    
    const response = await apiClient.get("/clans", {
      params: { page }
    });

    if (response.data.success) {
      clans.value = response.data.data.data || response.data.data || [];
      pagination.value = response.data.data;
    } else {
      error.value = response.data.message || "Error loading clans";
    }
  } catch (err: any) {
    console.error("Error loading clans:", err);
    error.value = err.response?.data?.message || "Error loading clans";
  } finally {
    loading.value = false;
  }
};

const createClan = async () => {
  try {
    creating.value = true;
    createError.value = "";
    createSuccess.value = "";
    
    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.push("/login");
      return;
    }

    const response = await apiClient.post("/clans", {
      name: createForm.value.name,
      logo: createForm.value.logo || null,
      description: createForm.value.description || null,
      max_members: createForm.value.max_members || 50,
    });

    if (response.data.success) {
      createSuccess.value = "Clan created successfully!";
      showCreateModal.value = false;
      createForm.value = {
        name: "",
        logo: "",
        description: "",
        max_members: 50,
      };
      // Reload clans
      await loadClans();
      // Redirect to clan detail
      setTimeout(() => {
        router.push(`/clans/${response.data.data.id}`);
      }, 1000);
    } else {
      createError.value = response.data.message || "Error creating clan";
    }
  } catch (err: any) {
    console.error("Error creating clan:", err);
    if (err.response?.data?.errors) {
      const errors = err.response.data.errors;
      createError.value = Object.values(errors).flat().join(", ");
    } else {
      createError.value = err.response?.data?.message || "Error creating clan";
    }
  } finally {
    creating.value = false;
  }
};

const loadPage = (page: number) => {
  loadClans(page);
};

const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

onMounted(() => {
  loadClans();
});
</script>

<style scoped>
/* Clan card */
.clan-card { overflow: hidden; }

.clan-card__header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 14px 0;
}

.clan-card__avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(var(--g1), 0.15);
  border: 2px solid rgba(var(--g1), 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;

  img { width: 100%; height: 100%; object-fit: cover; }
  i { font-size: 20px; color: rgb(var(--g1)); }
}

.clan-card__title-block { flex: 1; min-width: 0; }

.clan-card__name {
  font-size: 14px;
  font-weight: 700;
  color: rgb(var(--n8));
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.clan-card__leader {
  font-size: 12px;
  color: rgb(var(--n3));
  margin: 2px 0 0;
  display: flex;
  align-items: center;
  gap: 4px;

  i { font-size: 11px; color: #ffb400; }
}

.clan-card__desc {
  font-size: 13px;
  color: rgb(var(--n3));
  line-height: 1.5;
  margin: 0 0 12px;
  min-height: 38px;
}

.clan-card__stats {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 14px;
}

.clan-stat {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: rgb(var(--n3));

  i { font-size: 13px; color: rgb(var(--g1)); }
}

.clan-card__cta {
  width: 100%;
  justify-content: center;
  border-radius: 4px;
}

/* Skeleton */
.clan-skeleton {
  background: rgb(var(--p2));
  border: 1px solid rgb(var(--n2));
  border-radius: 8px;
  padding: 14px;
  height: 160px;
}

.clan-skeleton__header {
  height: 44px;
  border-radius: 4px;
}

.clan-skeleton__line {
  height: 12px;
  border-radius: 4px;
  width: 80%;
}
</style>
