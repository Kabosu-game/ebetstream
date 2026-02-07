<template>
  <!-- Section Clans -->
  <section class="defis_section py-6 position-relative overflow-hidden pb-120">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12 gx-0 gx-lg-4">
          <div class="defis__main">
            <!-- Header Section -->
            <div class="row h-100 align-items-center mb-5">
              <div class="col-lg-6 col-md-7">
                <div class="defis_content" data-aos="fade-right">
                  <span class="hero_badge mb-3 d-inline-block">
                    ⚔️ Clans eBetStream
                  </span>
                  <h2 class="hero_title mb-4">
                    Discover the <span class="text_gradient">Most Powerful Clans</span><br />
                    and their statistics!
                  </h2>
                  <p class="hero_subtitle mb-5">
                    Join clans, participate in collective challenges, and compete with the best teams to dominate the arena.
                  </p>
                  <div class="hero_actions d-flex flex-wrap gap-3">
                    <button 
                      v-if="isAuthenticated"
                      class="btn_secondary" 
                      @click="showCreateModal = true"
                    >
                      <i class="fas fa-plus-circle me-2"></i>
                      <span>Create a Clan</span>
                    </button>
                    <router-link 
                      v-else
                      to="/login"
                      class="btn_secondary text-decoration-none"
                    >
                      <i class="fas fa-sign-in-alt me-2"></i>
                      <span>Login to Create Clan</span>
                    </router-link>
                  </div>
                </div>
              </div>

              <!-- Colonne image / carte -->
              <div class="col-lg-6 col-md-5 d-none d-md-block">
                <div class="defis_image" data-aos="fade-left">
                  <div class="floating_card card_defis">
                    <div class="card_icon">🛡️</div>
                    <div class="card_content">
                      <span class="card_label">Elite Clan</span>
                      <span class="card_value">Statistics</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="row mt-5">
              <div class="col-12 text-center py-5">
                <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="row mt-5">
              <div class="col-12">
                <div class="alert alert-danger text-center">
                  <i class="fas fa-exclamation-circle me-2"></i>{{ error }}
                </div>
              </div>
            </div>

            <!-- Liste des clans -->
            <div v-else-if="clans.length > 0" class="row mt-5 g-4">
              <div v-for="clan in clans" :key="clan.id" class="col-12 col-md-6 col-lg-4">
                <div class="defi_card n11-bg rounded-8 p-4 h-100 d-flex flex-column justify-content-between">
                  <div class="d-flex justify-content-between align-items-center mb-3">
                    <span class="fs-eight fw-bold text-white">
                      <i class="fas fa-shield-alt me-2 text-warning"></i>{{ clan.name }}
                    </span>
                    <span v-if="clan.leader" class="fs-eight n10-color fw-semibold">
                      <i class="fas fa-crown me-1"></i>{{ clan.leader.username }}
                    </span>
                  </div>

                  <p v-if="clan.description" class="text-white-50 small mb-3" style="min-height: 40px;">
                    {{ clan.description.substring(0, 100) }}{{ clan.description.length > 100 ? '...' : '' }}
                  </p>

                  <ul class="list-unstyled mb-3 fs-eight text-white">
                    <li class="mb-1">
                      <i class="fas fa-users text-primary me-2"></i>
                      Members: <strong>{{ clan.members_count || 0 }}/{{ clan.max_members || 50 }}</strong>
                    </li>
                    <li class="mb-1">
                      <i class="fas fa-calendar text-info me-2"></i>
                      Created: <strong>{{ formatDate(clan.created_at) }}</strong>
                    </li>
                    <li v-if="clan.status === 'active'" class="mb-1">
                      <i class="fas fa-check-circle text-success me-2"></i>
                      Status: <strong>Active</strong>
                    </li>
                  </ul>

                  <div class="text-end mt-auto">
                    <router-link 
                      :to="`/clans/${clan.id}`"
                      class="btn_see_details rounded-4 fw-semibold px-4 py-2 text-decoration-none"
                    >
                      View Clan <i class="fas fa-arrow-right ms-2"></i>
                    </router-link>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-else class="row mt-5">
              <div class="col-12 text-center py-5">
                <i class="fas fa-shield-alt fs-1 text-white-50 mb-3"></i>
                <p class="text-white-50">No clans found. Be the first to create one!</p>
                <button 
                  v-if="isAuthenticated"
                  class="btn_primary mt-3"
                  @click="showCreateModal = true"
                >
                  <i class="fas fa-plus-circle me-2"></i>Create First Clan
                </button>
              </div>
            </div>

            <!-- Pagination -->
            <div v-if="pagination && pagination.total > pagination.per_page" class="row mt-5">
              <div class="col-12 d-flex justify-content-center">
                <nav>
                  <ul class="pagination">
                    <li class="page-item" :class="{ disabled: !pagination.prev_page_url }">
                      <button class="page-link" @click="loadPage(pagination.current_page - 1)" :disabled="!pagination.prev_page_url">
                        Previous
                      </button>
                    </li>
                    <li class="page-item" :class="{ active: page === pagination.current_page }" v-for="page in pagination.last_page" :key="page">
                      <button class="page-link" @click="loadPage(page)">{{ page }}</button>
                    </li>
                    <li class="page-item" :class="{ disabled: !pagination.next_page_url }">
                      <button class="page-link" @click="loadPage(pagination.current_page + 1)" :disabled="!pagination.next_page_url">
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Création Clan -->
    <div v-if="showCreateModal" class="popup-overlay" @click.self="showCreateModal = false">
      <div class="popup-box p-5 rounded-4 shadow-lg n11-bg">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h3 class="fw-bold text-white mb-0">Create a New Clan</h3>
          <button class="btn-close btn-close-white" @click="showCreateModal = false"></button>
        </div>
        
        <form @submit.prevent="createClan">
          <div class="form-group mb-3">
            <label class="text-white mb-2 d-block fw-bold">Clan Name *</label>
            <input 
              v-model="createForm.name"
              type="text" 
              class="form-control n11-bg text-white border-secondary" 
              placeholder="Enter clan name"
              required
              maxlength="100"
            />
          </div>
          
          <div class="form-group mb-3">
            <label class="text-white mb-2 d-block fw-bold">Logo URL (Optional)</label>
            <input 
              v-model="createForm.logo"
              type="url" 
              class="form-control n11-bg text-white border-secondary" 
              placeholder="https://example.com/logo.png"
              maxlength="255"
            />
          </div>
          
          <div class="form-group mb-3">
            <label class="text-white mb-2 d-block fw-bold">Max Members</label>
            <input 
              v-model.number="createForm.max_members"
              type="number" 
              class="form-control n11-bg text-white border-secondary" 
              placeholder="50"
              min="5"
              max="100"
            />
            <small class="text-white-50">Default: 50 members</small>
          </div>
          
          <div class="form-group mb-4">
            <label class="text-white mb-2 d-block fw-bold">Description</label>
            <textarea 
              v-model="createForm.description"
              class="form-control n11-bg text-white border-secondary" 
              rows="4"
              placeholder="Describe your clan..."
              maxlength="1000"
            ></textarea>
          </div>

          <div v-if="createError" class="alert alert-danger mb-3">{{ createError }}</div>
          <div v-if="createSuccess" class="alert alert-success mb-3">{{ createSuccess }}</div>

          <div class="d-flex gap-3">
            <button 
              type="submit" 
              class="btn_primary flex-fill" 
              :disabled="creating"
            >
              <span v-if="creating">Creating...</span>
              <span v-else>
                <i class="fas fa-check me-2"></i>Create Clan
              </span>
            </button>
            <button 
              type="button" 
              class="btn_secondary" 
              @click="showCreateModal = false"
              :disabled="creating"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
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
.defis_section {
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

.btn_primary {
  background-color: #FF9F00;
  color: #000;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  transition: 0.3s;
  cursor: pointer;
}
.btn_primary:hover {
  background-color: #FF9F00;
  transform: translateY(-2px);
}

.btn_secondary {
  background: transparent;
  border: 2px solid #FF9F00;
  color: #FF9F00;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  transition: 0.3s;
  cursor: pointer;
}
.btn_secondary:hover {
  background-color: #FF9F00;
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

.defi_card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.defi_card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
}

.fs-eight {
  font-size: 0.85rem;
}

.n10-color {
  color: #FF9F00;
}

.btn_see_details {
  background-color: #FF9F00;
  color: #000;
  border: none;
  transition: 0.3s;
}
.btn_see_details:hover {
  background-color: #FF9F00;
  transform: translateY(-2px);
}

.popup-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}
.popup-box {
  width: 95%;
  max-width: 500px;
  border-radius: 24px;
  padding: 2rem;
  max-height: 90vh;
  overflow-y: auto;
}

.form-control {
  border-radius: 10px;
}

.pagination .page-link {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  color: white;
}
.pagination .page-item.active .page-link {
  background-color: #FF9F00;
  border-color: #FF9F00;
}
.pagination .page-item.disabled .page-link {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .container-fluid {
    margin-left: 0 !important;
  }
  .defis__main {
    margin-left: 0 !important;
  }
}
</style>
