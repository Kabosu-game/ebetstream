<template>
  <!-- P2P Challenges Section -->
  <section class="defis_section py-6 position-relative overflow-hidden">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12 gx-0 gx-lg-4">
          <div class="defis__main">
            <div class="row h-100 align-items-center">
              <!-- Colonne texte -->
              <div class="col-lg-6 col-md-7">
                <div class="defis_content" data-aos="fade-right">
                  <span class="hero_badge mb-3 d-inline-block">
                    ⚔️ P2P Cyber Challenges
                  </span>
                  <h2 class="hero_title mb-4">
                    Participate in <span class="text_gradient">Player Challenges</span><br />
                    and win your duels!
                  </h2>
                  <p class="hero_subtitle mb-5">
                    Discover recent challenges between eBetStream players and compete against the best to prove your dominance.
                  </p>
                  <div class="hero_actions d-flex flex-wrap gap-3">
                    <button class="btn_primary" @click="viewAllChallenges">
                      <span>View All Challenges</span>
                      <i class="fas fa-arrow-right ms-2"></i>
                    </button>
                    <button v-if="isAuthenticated" class="btn_secondary" @click="createChallenge">
                      <i class="fas fa-plus-circle me-2"></i>
                      <span>Create a Challenge</span>
                    </button>
                    <button v-else class="btn_secondary" @click="router.push('/login')">
                      <i class="fas fa-sign-in-alt me-2"></i>
                      <span>Sign In to Create</span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Colonne image / carte -->
              <div class="col-lg-6 col-md-5 d-none d-md-block">
                <div class="defis_image" data-aos="fade-left">
                  <div class="floating_card card_defis">
                    <div class="card_icon">🎮</div>
                    <div class="card_content">
                      <span class="card_label">Mode Duel</span>
                      <span class="card_value">P2P Challenge</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Liste des défis -->
            <div v-if="loading" class="row mt-5">
              <div class="col-12 text-center py-5">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>
            </div>
            <div v-else-if="defis.length > 0" class="row mt-5 g-4">
              <div v-for="defi in defis" :key="defi.id" class="col-12 col-md-6 col-lg-4">
                <div class="defi_card n11-bg rounded-8 p-4 h-100 d-flex flex-column justify-content-between">
                  <div class="d-flex justify-content-between align-items-center mb-3">
                    <span :class="['status', defi.status === 'open' ? 'status-open' : 'status-closed', 'px-3', 'py-1', 'rounded-pill', 'text-uppercase', 'fw-bold']">
                      {{ getStatusLabel(defi.status) }}
                    </span>
                    <span class="delai n10-color fw-semibold">{{ getTimeRemaining(defi.expires_at) }}</span>
                  </div>
                  <div class="game_area mb-3">
                    <h5 class="fw-bold mb-2">{{ defi.game }}</h5>
                    <div class="d-flex justify-content-between align-items-center">
                      <span class="player">{{ defi.creator.username }}</span>
                      <span class="vs text-danger fw-bold">VS</span>
                      <span class="player">{{ defi.opponent ? defi.opponent.username : 'Waiting...' }}</span>
                    </div>
                  </div>
                  <div class="d-flex justify-content-between align-items-center mt-auto">
                    <span class="montant fw-bold n10-color">💰 {{ defi.bet_amount.toLocaleString() }} EBT</span>
                    <button class="btn_see_details rounded-4 fw-semibold px-4 py-2" @click="viewDetails(defi.id)">View Details</button>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="row mt-5">
              <div class="col-12 text-center py-5">
                <div v-if="!isAuthenticated">
                  <i class="fas fa-lock fs-1 text-warning mb-3"></i>
                  <h5 class="mb-2">Connect to View Challenges</h5>
                  <p class="text-muted mb-4">Sign in to see available challenges and participate in duels.</p>
                  <button class="btn_primary" @click="router.push('/login')">
                    <i class="fas fa-sign-in-alt me-2"></i>
                    <span>Sign In</span>
                  </button>
                </div>
                <div v-else>
                  <p class="text-muted">No challenges available at the moment.</p>
                  <button class="btn_primary mt-3" @click="createChallenge">
                    <i class="fas fa-plus-circle me-2"></i>
                    <span>Create the First Challenge</span>
                  </button>
                </div>
              </div>
            </div>
            <!-- /Challenges List -->
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import apiClient from "@/utils/axios";

interface Challenge {
  id: number;
  game: string;
  bet_amount: number;
  status: string;
  creator: {
    id: number;
    username: string;
  };
  opponent: {
    id: number;
    username: string;
  } | null;
  expires_at: string | null;
  created_at: string;
}

const router = useRouter();
const defis = ref<Challenge[]>([]);
const loading = ref(false);

// Check if user is authenticated
const isAuthenticated = computed(() => {
  return !!localStorage.getItem("auth_token");
});

// Format status for display
const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    open: "Ouvert",
    accepted: "Accepted",
    in_progress: "In Progress",
    completed: "Completed",
    cancelled: "Cancelled",
  };
  return labels[status] || status;
};

// Calculate time remaining
const getTimeRemaining = (expiresAt: string | null) => {
  if (!expiresAt) return "⏱️ Pas d'expiration";
  
  const now = new Date();
  const expires = new Date(expiresAt);
  const diff = expires.getTime() - now.getTime();
  
  if (diff <= 0) return "⏱️ Expiré";
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `⏱️ ${days} jour${days > 1 ? 's' : ''} restant${days > 1 ? 's' : ''}`;
  if (hours > 0) return `⏱️ ${hours}h restante${hours > 1 ? 's' : ''}`;
  
  const minutes = Math.floor(diff / (1000 * 60));
  return `⏱️ ${minutes}min restante${minutes > 1 ? 's' : ''}`;
};

// Load challenges
const loadChallenges = async () => {
  // Check if user is authenticated
  const token = localStorage.getItem("auth_token");
  if (!token) {
    // User is not authenticated, don't load challenges
    defis.value = [];
    loading.value = false;
    return;
  }

  try {
    loading.value = true;
    // Token is automatically added by apiClient
    
    const response = await apiClient.get(
      "/challenges?open_only=true",
      {
        params: {
          per_page: 6,
        },
      }
    );
    
    if (response.data.success) {
      defis.value = response.data.data.data || response.data.data || [];
    }
  } catch (error: any) {
    console.error("Error loading challenges:", error);
    // Fallback to empty array on error
    defis.value = [];
  } finally {
    loading.value = false;
  }
};

// Navigate to challenges page
const viewAllChallenges = () => {
  router.push("/challenges");
};

// Navigate to create challenge
const createChallenge = () => {
  const token = localStorage.getItem("auth_token");
  if (!token) {
    router.push("/login");
    return;
  }
  router.push("/challenges?action=create");
};

// View challenge details
const viewDetails = (challengeId: number) => {
  router.push(`/challenges/${challengeId}`);
};

onMounted(() => {
  loadChallenges();
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
}
.btn_primary:hover {
  background-color: #FF9F00;
}

.btn_secondary {
  background: transparent;
  border: 2px solid #FF9F00;
  color: #FF9F00;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  transition: 0.3s;
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

/* --- Cartes de défis --- */
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

.status {
  font-size: 0.85rem;
  letter-spacing: 0.5px;
}
.status-open {
  background-color: #1f9d55;
  color: #fff;
}
.status-closed {
  background-color: #991b1b;
  color: #fff;
}

.btn_see_details {
  background-color: #FF9F00;
  color: #000;
  border: none;
  transition: 0.3s;
}
.btn_see_details:hover {
  background-color: #FF9F00;
}
</style>
