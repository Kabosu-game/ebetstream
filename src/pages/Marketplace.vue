<template>
  <div class="page-content-with-space">
    <!-- Section Marketplace -->
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
                      🛒 Team Marketplace
                    </span>
                    <h2 class="hero_title mb-4">
                      Buy or Loan <span class="text_gradient">Teams</span><br />
                      from other players!
                    </h2>
                    <p class="hero_subtitle mb-5">
                      Browse available teams for sale or loan. Find the perfect team for your gaming needs or list your own team on the marketplace.
                    </p>
                    <div class="hero_actions d-flex flex-wrap gap-3">
                      <button 
                        v-if="isAuthenticated"
                        class="btn_secondary"
                        @click="showCreateModal = true"
                      >
                        <i class="fas fa-plus-circle me-2"></i>
                        <span>List Your Team</span>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Colonne image / carte -->
                <div class="col-lg-6 col-md-5 d-none d-md-block">
                  <div class="defis_image" data-aos="fade-left">
                    <div class="floating_card card_defis">
                      <div class="card_icon">🛒</div>
                      <div class="card_content">
                        <span class="card_label">Available</span>
                        <span class="card_value">{{ listings.length }} Teams</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Filters -->
              <div class="d-flex gap-3 mb-5 flex-wrap justify-content-center">
                <button 
                  class="btn_primary"
                  :class="{ 'active': filterType === null }"
                  @click="filterType = null; loadListings()"
                >
                  All
                </button>
                <button 
                  class="btn_secondary"
                  :class="{ 'active': filterType === 'sale' }"
                  @click="filterType = 'sale'; loadListings()"
                >
                  For Sale
                </button>
                <button 
                  class="btn_secondary"
                  :class="{ 'active': filterType === 'loan' }"
                  @click="filterType = 'loan'; loadListings()"
                >
                  For Loan
                </button>
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

              <!-- Listings List -->
              <div v-else-if="listings.length > 0" class="row mt-5 g-4">
                <div 
                  v-for="listing in listings" 
                  :key="listing.id"
                  class="col-12 col-md-6 col-lg-4"
                >
                  <div class="defi_card n11-bg rounded-8 p-4 h-100 d-flex flex-column">
                    <!-- Team Logo -->
                    <div class="text-center mb-3">
                      <img 
                        v-if="listing.team?.logo" 
                        :src="listing.team.logo" 
                        :alt="listing.team.name"
                        class="rounded-circle"
                        style="width: 100px; height: 100px; object-fit: cover;"
                      />
                      <div 
                        v-else
                        class="rounded-circle d-inline-flex align-items-center justify-content-center"
                        style="width: 100px; height: 100px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);"
                      >
                        <i class="fas fa-users fa-3x text-white"></i>
                      </div>
                    </div>

                    <!-- Team Name -->
                    <h5 class="fw-bold text-white mb-2 text-center">{{ listing.team?.name }}</h5>
                    
                    <!-- Type Badge -->
                    <div class="text-center mb-3">
                      <span 
                        :class="['badge', listing.listing_type === 'sale' ? 'bg-success' : 'bg-info']"
                      >
                        {{ listing.listing_type === 'sale' ? 'For Sale' : 'For Loan' }}
                      </span>
                    </div>

                    <!-- Price/Fee -->
                    <div class="text-center mb-3">
                      <span class="text-warning fw-bold fs-5">
                        {{ listing.listing_type === 'sale' 
                          ? (parseFloat(String(listing.price || 0)).toLocaleString() + ' EBT') 
                          : (parseFloat(String(listing.loan_fee || 0)).toLocaleString() + ' EBT')
                        }}
                      </span>
                      <p v-if="listing.listing_type === 'loan'" class="text-white-50 small mb-0 mt-1">
                        Duration: {{ listing.loan_duration_days }} days
                      </p>
                    </div>

                    <!-- Seller Info -->
                    <div class="text-white-50 small mb-3 text-center">
                      <i class="fas fa-user me-1"></i>
                      Seller: {{ listing.seller?.username || 'N/A' }}
                    </div>

                    <!-- Action Buttons -->
                    <div class="d-flex gap-2 mt-auto">
                      <button 
                        v-if="listing.listing_type === 'sale'"
                        class="btn_primary flex-fill py-2"
                        @click="buyTeam(listing)"
                        :disabled="processing || !isAuthenticated || listing.seller_id === currentUserId"
                      >
                        <i class="fas fa-shopping-cart me-2"></i>Buy
                      </button>
                      <button 
                        v-else
                        class="btn_primary flex-fill py-2"
                        @click="loanTeam(listing)"
                        :disabled="processing || !isAuthenticated || listing.seller_id === currentUserId"
                      >
                        <i class="fas fa-hand-holding me-2"></i>Loan
                      </button>
                      <button 
                        class="btn_secondary py-2 px-3"
                        @click="viewDetails(listing.id)"
                      >
                        <i class="fas fa-eye"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Empty State -->
              <div v-else class="row mt-5">
                <div class="col-12 text-center py-5">
                  <i class="fas fa-store fs-1 text-white-50 mb-3"></i>
                  <p class="text-white-50">No teams available at the moment.</p>
                  <button 
                    v-if="isAuthenticated"
                    class="btn_primary mt-3"
                    @click="showCreateModal = true"
                  >
                    <i class="fas fa-plus-circle me-2"></i>
                    <span>List First Team</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Create Listing Modal -->
    <div v-if="showCreateModal" class="popup-overlay" @click.self="showCreateModal = false">
      <div class="popup-box p-5 rounded-4 shadow-lg n11-bg" style="max-width: 600px;">
        <h3 class="fw-bold mb-4 text-center text-white">List Your Team</h3>
        <form @submit.prevent="createListing">
          <div class="form-group mb-4">
            <label class="text-white mb-2 d-block">Listing Type *</label>
            <div class="d-flex gap-3">
              <button 
                type="button"
                class="btn flex-fill"
                :class="listingForm.listing_type === 'sale' ? 'btn-warning' : 'btn-secondary'"
                @click="listingForm.listing_type = 'sale'"
              >
                <i class="fas fa-shopping-cart me-2"></i>For Sale
              </button>
              <button 
                type="button"
                class="btn flex-fill"
                :class="listingForm.listing_type === 'loan' ? 'btn-warning' : 'btn-secondary'"
                @click="listingForm.listing_type = 'loan'"
              >
                <i class="fas fa-hand-holding me-2"></i>For Loan
              </button>
            </div>
          </div>

          <div class="form-group mb-4">
            <label class="text-white mb-2 d-block">Select Team *</label>
            <select 
              v-model="listingForm.team_id"
              class="form-control n11-bg text-white border-secondary"
              required
            >
              <option value="">Select a team or clan...</option>
              <option v-for="team in myTeams" :key="`${team.type}-${team.id}`" :value="team.id">
                {{ team.name }} ({{ team.type === 'clan' ? 'Clan' : 'Team' }})
              </option>
            </select>
          </div>

          <div v-if="listingForm.listing_type === 'sale'" class="form-group mb-4">
            <label class="text-white mb-2 d-block">Sale Price (EBT) *</label>
            <input 
              v-model.number="listingForm.price"
              type="number" 
              class="form-control n11-bg text-white border-secondary" 
              placeholder="Enter sale price"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div v-else class="form-group mb-4">
            <label class="text-white mb-2 d-block">Loan Fee (EBT) *</label>
            <input 
              v-model.number="listingForm.loan_fee"
              type="number" 
              class="form-control n11-bg text-white border-secondary" 
              placeholder="Enter loan fee"
              min="0"
              step="0.01"
              required
            />
            <label class="text-white mb-2 d-block mt-3">Duration (days) *</label>
            <input 
              v-model.number="listingForm.loan_duration_days"
              type="number" 
              class="form-control n11-bg text-white border-secondary" 
              placeholder="Enter loan duration"
              min="1"
              max="365"
              required
            />
          </div>

          <div class="form-group mb-4">
            <label class="text-white mb-2 d-block">Conditions (optional)</label>
            <textarea 
              v-model="listingForm.conditions"
              class="form-control n11-bg text-white border-secondary"
              rows="3"
              placeholder="Any specific conditions..."
            ></textarea>
          </div>

          <div class="d-flex gap-3">
            <button class="btn_primary flex-fill" type="submit" :disabled="processing">
              Create Listing
            </button>
            <button type="button" class="btn_secondary" @click="closeCreateModal">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import apiClient from "@/utils/axios";

interface Listing {
  id: number;
  listing_type: 'sale' | 'loan';
  price?: number;
  loan_fee?: number;
  loan_duration_days?: number;
  conditions?: string;
  seller_id: number;
  seller?: any;
  team?: {
    id: number;
    name: string;
    logo?: string;
  };
}

interface Team {
  id: number;
  name: string;
  owner_id?: number;
  type?: 'team' | 'clan';
  logo?: string;
}

const listings = ref<Listing[]>([]);
const myTeams = ref<Team[]>([]);
const loading = ref(false);
const error = ref("");
const processing = ref(false);
const filterType = ref<string | null>(null);
const showCreateModal = ref(false);

const listingForm = ref({
  team_id: null as number | null,
  listing_type: 'sale' as 'sale' | 'loan',
  price: null as number | null,
  loan_fee: null as number | null,
  loan_duration_days: null as number | null,
  conditions: '',
});

const isAuthenticated = computed(() => {
  return !!localStorage.getItem("auth_token");
});

const currentUserId = computed(() => {
  // TODO: Get from auth state
  return null;
});

const loadListings = async () => {
  try {
    loading.value = true;
    error.value = "";

    const params: any = { per_page: 50 };
    if (filterType.value) params.type = filterType.value;

    const response = await apiClient.get("/team-marketplace", { params });

    if (response.data.success) {
      listings.value = response.data.data.data || response.data.data || [];
    }
  } catch (err: any) {
    console.error("Error loading listings:", err);
    error.value = err.response?.data?.message || "Error loading listings";
  } finally {
    loading.value = false;
  }
};

const loadMyTeams = async () => {
  if (!isAuthenticated.value) return;

  try {
    const response = await apiClient.get("/team-marketplace/my-teams");
    if (response.data.success) {
      myTeams.value = response.data.data || [];
    }
  } catch (err: any) {
    console.error("Error loading teams:", err);
    error.value = err.response?.data?.message || "Error loading teams";
  }
};

const buyTeam = async (listing: Listing) => {
  if (!confirm(`Are you sure you want to buy "${listing.team?.name}" for ${listing.price} EBT?`)) return;

  try {
    processing.value = true;
    const response = await apiClient.post(`/team-marketplace/${listing.id}/buy`);

    if (response.data.success) {
      alert("Team purchased successfully!");
      await loadListings();
    } else {
      alert(response.data.message || "Error purchasing team");
    }
  } catch (err: any) {
    console.error("Error buying team:", err);
    alert(err.response?.data?.message || "Error purchasing team");
  } finally {
    processing.value = false;
  }
};

const loanTeam = async (listing: Listing) => {
  if (!confirm(`Are you sure you want to loan "${listing.team?.name}" for ${listing.loan_fee} EBT for ${listing.loan_duration_days} days?`)) return;

  try {
    processing.value = true;
    const response = await apiClient.post(`/team-marketplace/${listing.id}/loan`);

    if (response.data.success) {
      alert("Team loaned successfully!");
      await loadListings();
    } else {
      alert(response.data.message || "Error loaning team");
    }
  } catch (err: any) {
    console.error("Error loaning team:", err);
    alert(err.response?.data?.message || "Error loaning team");
  } finally {
    processing.value = false;
  }
};

const viewDetails = (id: number) => {
  // TODO: Navigate to listing detail page
  alert("Listing details coming soon");
};

const createListing = async () => {
  try {
    processing.value = true;

    const payload: any = {
      team_id: listingForm.value.team_id,
      listing_type: listingForm.value.listing_type,
      conditions: listingForm.value.conditions || null,
    };

    if (listingForm.value.listing_type === 'sale') {
      payload.price = listingForm.value.price;
    } else {
      payload.loan_fee = listingForm.value.loan_fee;
      payload.loan_duration_days = listingForm.value.loan_duration_days;
    }

    const response = await apiClient.post("/team-marketplace", payload);

    if (response.data.success) {
      alert("Listing created successfully!");
      closeCreateModal();
      await loadListings();
    } else {
      alert(response.data.message || "Error creating listing");
    }
  } catch (err: any) {
    console.error("Error creating listing:", err);
    alert(err.response?.data?.message || "Error creating listing");
  } finally {
    processing.value = false;
  }
};

const closeCreateModal = () => {
  showCreateModal.value = false;
  listingForm.value = {
    team_id: null,
    listing_type: 'sale',
    price: null,
    loan_fee: null,
    loan_duration_days: null,
    conditions: '',
  };
};

onMounted(() => {
  loadListings();
  if (isAuthenticated.value) {
    loadMyTeams();
  }
});
</script>

<style scoped>
/* Popup styles */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.popup-box {
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  background: rgba(26, 31, 58, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.popup-box .form-control {
  color: white;
}

.popup-box .form-control::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.popup-box .form-control:focus {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: #FF9F00;
  color: white;
}

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

