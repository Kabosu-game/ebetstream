<template>
  <div class="page-content-with-space">
    <!-- Section Fédérations -->
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
                      🏆 Fédérations Esport & Gaming
                    </span>
                    <h2 class="hero_title mb-4">
                      Discover <span class="text_gradient">Federations</span><br />
                      and their championships!
                    </h2>
                    <p class="hero_subtitle mb-5">
                      Join our network of esport and gaming federations. Organize your championships, 
                      manage your competitions and showcase your federation to our community.
                    </p>
                    <div class="hero_actions d-flex flex-wrap gap-3">
                      <router-link to="/federations/register" class="btn_secondary text-decoration-none">
                        <i class="fas fa-plus-circle me-2"></i>
                        <span>Register Your Federation</span>
                      </router-link>
                    </div>
                  </div>
                </div>

                <!-- Colonne image / carte -->
                <div class="col-lg-6 col-md-5 d-none d-md-block">
                  <div class="defis_image" data-aos="fade-left">
                    <div class="floating_card card_defis">
                      <div class="card_icon">🏆</div>
                      <div class="card_content">
                        <span class="card_label">Total</span>
                        <span class="card_value">{{ federations.length }} Federations</span>
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

              <!-- Federations List -->
              <div v-else-if="federations.length > 0" class="row mt-5 g-4">
                <div 
                  v-for="federation in federations" 
                  :key="federation.id"
                  class="col-12 col-md-6 col-lg-4"
                >
                  <div class="defi_card n11-bg rounded-8 p-4 h-100 d-flex flex-column">
                    <!-- Logo -->
                    <div class="federation_logo mb-3 text-center">
                      <img 
                        v-if="federation.logo_url" 
                        :src="federation.logo_url" 
                        :alt="federation.name"
                        class="rounded-circle"
                        style="width: 100px; height: 100px; object-fit: cover;"
                      />
                      <div 
                        v-else
                        class="rounded-circle d-inline-flex align-items-center justify-content-center"
                        style="width: 100px; height: 100px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);"
                      >
                        <i class="fas fa-building fa-3x text-white"></i>
                      </div>
                    </div>

                    <!-- Name and Status -->
                    <h5 class="fw-bold text-white mb-3 text-center">{{ federation.name }}</h5>
                    <div class="text-center mb-3">
                      <span 
                        :class="['badge', getStatusClass(federation.status)]"
                      >
                        {{ getStatusLabel(federation.status) }}
                      </span>
                    </div>

                    <!-- Info -->
                    <div class="federation_info mb-3">
                      <div v-if="federation.country" class="text-white-50 small mb-1">
                        <i class="fas fa-map-marker-alt me-2"></i>{{ federation.country }}
                        <span v-if="federation.city">, {{ federation.city }}</span>
                      </div>
                      <div v-if="federation.tournaments_count" class="text-white-50 small">
                        <i class="fas fa-trophy me-2"></i>{{ federation.tournaments_count }} championnat(s)
                      </div>
                    </div>

                    <!-- View Button -->
                    <router-link 
                      :to="`/federations/${federation.id}`"
                      class="btn_see_details rounded-4 fw-semibold px-4 py-2 text-decoration-none mt-auto text-center d-block"
                    >
                      View Federation <i class="fas fa-arrow-right ms-2"></i>
                    </router-link>
                  </div>
                </div>
              </div>

              <!-- Empty State -->
              <div v-else class="row mt-5">
                <div class="col-12 text-center py-5">
                  <i class="fas fa-building fs-1 text-white-50 mb-3"></i>
                  <p class="text-white-50">No federations available at the moment.</p>
                  <router-link to="/federations/register" class="btn_primary mt-3 text-decoration-none">
                    <i class="fas fa-plus-circle me-2"></i>
                    <span>Register First Federation</span>
                  </router-link>
                </div>
              </div>

              <!-- Pagination -->
              <div v-if="pagination && pagination.total > pagination.per_page" class="row mt-5">
                <div class="col-12 d-flex justify-content-center">
                  <nav>
                    <ul class="pagination">
                      <li class="page-item" :class="{ disabled: !pagination.prev_page_url }">
                        <button 
                          class="page-link" 
                          @click="loadFederations(pagination.current_page - 1)"
                          :disabled="!pagination.prev_page_url"
                        >
                          Previous
                        </button>
                      </li>
                      <li class="page-item disabled">
                        <span class="page-link">
                          Page {{ pagination.current_page }} sur {{ pagination.last_page }}
                        </span>
                      </li>
                      <li class="page-item" :class="{ disabled: !pagination.next_page_url }">
                        <button 
                          class="page-link" 
                          @click="loadFederations(pagination.current_page + 1)"
                          :disabled="!pagination.next_page_url"
                        >
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
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import apiClient from "@/utils/axios";

interface Federation {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  logo_url?: string;
  website: string | null;
  email: string | null;
  phone: string | null;
  country: string | null;
  city: string | null;
  address: string | null;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  tournaments_count?: number;
}

const federations = ref<Federation[]>([]);
const loading = ref(false);
const error = ref("");
const pagination = ref<any>(null);

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
    suspended: "Suspended",
  };
  return labels[status] || status;
};

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    pending: "bg-warning",
    approved: "bg-success",
    rejected: "bg-danger",
    suspended: "bg-secondary",
  };
  return classes[status] || "bg-secondary";
};

const truncateText = (text: string | null, maxLength: number) => {
  if (!text) return "No description available";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

const loadFederations = async (page: number = 1) => {
  try {
    loading.value = true;
    error.value = "";

    const response = await apiClient.get("/federations", {
      params: {
        page,
        per_page: 12,
      },
    });

    if (response.data.success) {
      federations.value = response.data.data.data || response.data.data || [];
      pagination.value = {
        current_page: response.data.data.current_page || page,
        last_page: response.data.data.last_page || 1,
        per_page: response.data.data.per_page || 12,
        total: response.data.data.total || 0,
        prev_page_url: response.data.data.prev_page_url,
        next_page_url: response.data.data.next_page_url,
      };
    } else {
      error.value = response.data.message || "Error loading federations";
    }
  } catch (err: any) {
    console.error("Error loading federations:", err);
    error.value = err.response?.data?.message || "Error loading federations";
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadFederations();
});
</script>

<style scoped>
/* Espace visible en haut de la page */
.page-content-with-space {
  padding-top: 90px; /* ajuste selon la hauteur réelle du header */
}
/* responsive */
@media (max-width: 768px) {
  .page-content-with-space {
    padding-top: 60px;
  }
}
</style>
