<template>
  <div class="page-content-with-space">
    <!-- Section Challenges P2P Cyber -->
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
                    ⚔️ Challenges P2P Cyber
                  </span>
                  <h2 class="hero_title mb-4">
                    Participate in <span class="text_gradient">Player Challenges</span><br />
                    and win your duels!
                  </h2>
                  <p class="hero_subtitle mb-5">
                    Discover recent challenges between eBetStream players and compete against the best to prove your dominance.
                  </p>
                  <div class="hero_actions d-flex flex-wrap gap-3">
                    <button class="btn_secondary" @click="showCreateModal = true">
                      <i class="fas fa-plus-circle me-2"></i>
                      <span>Create a Challenge</span>
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
                      <span class="card_label">Duel Mode</span>
                      <span class="card_value">P2P Challenge</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Filters -->
            <div class="d-flex gap-3 mb-5 flex-wrap justify-content-center">
              <button 
                class="btn_primary"
                :class="{ 'active': filterStatus === null }"
                @click="filterStatus = null"
              >
                All
              </button>
              <button 
                class="btn_secondary"
                :class="{ 'active': filterStatus === 'open' }"
                @click="filterStatus = 'open'"
              >
                Open
              </button>
              <button 
                class="btn_secondary"
                :class="{ 'active': filterStatus === 'accepted' }"
                @click="filterStatus = 'accepted'"
              >
                Accepted
              </button>
              <button 
                class="btn_secondary"
                :class="{ 'active': filterStatus === 'in_progress' }"
                @click="filterStatus = 'in_progress'"
              >
                In Progress
              </button>
              <button 
                class="btn_secondary"
                :class="{ 'active': filterStatus === 'completed' }"
                @click="filterStatus = 'completed'"
              >
                Completed
              </button>
              <button 
                class="btn_secondary"
                :class="{ 'active': showMyChallenges }"
                @click="showMyChallenges = !showMyChallenges"
              >
                My Challenges
              </button>
            </div>

            <!-- Liste des défis -->
            <div v-if="loading" class="row mt-5">
              <div class="col-12 text-center py-5">
                <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>
            </div>
            <div v-else-if="challenges.length > 0" class="row mt-5 g-4">
              <div v-for="challenge in challenges" :key="challenge.id" class="col-12 col-md-6 col-lg-4">
                <div class="defi_card n11-bg rounded-8 p-4 h-100 d-flex flex-column justify-content-between">
                  <div class="d-flex justify-content-between align-items-center mb-3">
                    <span :class="['status', challenge.status === 'open' ? 'status-open' : 'status-closed', 'px-3', 'py-1', 'rounded-pill', 'text-uppercase', 'fw-bold']">
                      {{ getStatusLabel(challenge.status) }}
                    </span>
                    <span class="delai n10-color fw-semibold">{{ getTimeRemaining(challenge.expires_at) }}</span>
                  </div>
                  <div class="game_area mb-3">
                    <h5 class="fw-bold mb-2">{{ challenge.game }}</h5>
                    <div class="d-flex justify-content-between align-items-center">
                      <span class="player">{{ challenge.creator.username }}</span>
                      <span class="vs text-danger fw-bold">VS</span>
                      <span class="player">{{ challenge.opponent ? challenge.opponent.username : 'Pending...' }}</span>
                    </div>
                  </div>
                  <div class="d-flex justify-content-between align-items-center mt-auto">
                    <span class="montant fw-bold n10-color">💰 {{ challenge.bet_amount.toLocaleString() }} EBT</span>
                    <div class="d-flex gap-2">
                      <button 
                        class="btn_see_details rounded-4 fw-semibold px-3 py-2"
                        @click="viewDetails(challenge.id)"
                      >
                        Details
                      </button>
                      <button 
                        v-if="challenge.status === 'open' && challenge.creator.id !== currentUserId"
                        class="btn_see_details rounded-4 fw-semibold px-3 py-2"
                        style="background-color: #1f9d55; color: white;"
                        @click="acceptChallenge(challenge.id)"
                      >
                        Accept
                      </button>
                      <button 
                        v-if="challenge.status === 'open' && challenge.creator.id === currentUserId"
                        class="btn_see_details rounded-4 fw-semibold px-3 py-2"
                        style="background-color: #991b1b; color: white;"
                        @click="cancelChallenge(challenge.id)"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="row mt-5">
              <div class="col-12 text-center py-5">
                <p class="text-white" style="opacity: 0.7;">No challenges available at the moment.</p>
                <button class="btn_primary mt-3" @click="showCreateModal = true">
                  <i class="fas fa-plus-circle me-2"></i>
                  <span>Create the first challenge</span>
                </button>
              </div>
            </div>
            <!-- /Liste des défis -->
          </div>
        </div>
      </div>
    </div>

    <!-- Popup Création Challenge -->
    <div v-if="showCreateModal" class="popup-overlay" @click.self="showCreateModal = false">
      <div class="popup-box p-5 rounded-4 shadow-lg n11-bg" style="max-width: 600px;">
        <h3 class="fw-bold mb-4 text-center text-white">Create a New Challenge</h3>
        <form @submit.prevent="createChallenge">
          <!-- Type de défi -->
          <div class="form-group mb-4">
            <label class="text-white mb-2 d-block">Challenge Type</label>
            <div class="d-flex gap-3">
              <button 
                type="button"
                class="btn flex-fill"
                :class="challengeType === 'free' ? 'btn-warning' : 'btn-secondary'"
                @click="challengeType = 'free'; selectedOpponent = null; searchQuery = ''"
              >
                <i class="fas fa-globe me-2"></i>Open Challenge
              </button>
              <button 
                type="button"
                class="btn flex-fill"
                :class="challengeType === 'direct' ? 'btn-warning' : 'btn-secondary'"
                @click="challengeType = 'direct'"
              >
                <i class="fas fa-user me-2"></i>Direct Challenge
              </button>
            </div>
          </div>

          <!-- Recherche d'utilisateur (si défi direct) -->
          <div v-if="challengeType === 'direct'" class="form-group mb-4">
            <label class="text-white mb-2 d-block">Username</label>
            <div class="position-relative">
              <input 
                v-model="searchQuery"
                type="text" 
                class="form-control n11-bg text-white border-secondary" 
                placeholder="Type username..."
                @input="searchUsers"
                @focus="showUserSuggestions = true"
                autocomplete="off"
              />
              <!-- Suggestions d'utilisateurs -->
              <div 
                v-if="showUserSuggestions && userSuggestions.length > 0" 
                class="user-suggestions position-absolute w-100 mt-1 rounded"
                style="background: #1a1f3a; border: 1px solid rgba(255,255,255,0.2); z-index: 1000; max-height: 200px; overflow-y: auto;"
              >
                <div 
                  v-for="user in userSuggestions" 
                  :key="user.id"
                  class="suggestion-item p-3 cursor-pointer"
                  style="border-bottom: 1px solid rgba(255,255,255,0.1);"
                  @click="selectOpponent(user)"
                  @mouseenter="(e: MouseEvent) => { const el = e.target as HTMLElement; if (el) el.style.background='rgba(255,159,0,0.2)'; }"
                  @mouseleave="(e: MouseEvent) => { const el = e.target as HTMLElement; if (el) el.style.background='transparent'; }"
                >
                  <div class="d-flex align-items-center gap-2">
                    <i class="fas fa-user text-warning"></i>
                    <div>
                      <div class="text-white fw-bold">{{ user.username }}</div>
                      <small class="text-white-50">{{ user.email }}</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="selectedOpponent" class="mt-2 p-2 rounded" style="background: rgba(255,159,0,0.1); border: 1px solid rgba(255,159,0,0.3);">
              <div class="d-flex align-items-center justify-content-between">
                <div>
                  <i class="fas fa-check-circle text-warning me-2"></i>
                  <span class="text-white">Challenge sent to: <strong>{{ selectedOpponent.username }}</strong></span>
                </div>
                <button 
                  type="button" 
                  class="btn btn-sm btn-link text-danger p-0"
                  @click="selectedOpponent = null; searchQuery = ''"
                >
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </div>
            <small class="text-white d-block mt-2" style="opacity: 0.7;">Leave empty to create an open challenge</small>
          </div>

          <div class="form-group mb-4">
            <label class="text-white mb-2 d-block">Select Game</label>
            <select 
              v-model="selectedGame"
              class="form-select n11-bg text-white border-secondary" 
              @change="onGameSelect"
            >
              <option value="">Select a game...</option>
              <option 
                v-for="game in allGames" 
                :key="game.id" 
                :value="game.name"
              >
                {{ game.name }}
              </option>
            </select>
            <small v-if="selectedGame" class="text-white-50 d-block mt-2">
              Selected: {{ selectedGame }}
            </small>
          </div>
          
          <div class="form-group mb-4">
            <label class="text-white mb-2 d-block">Game Subcategory (Optional)</label>
            <input 
              v-model="customGameName"
              type="text" 
              class="form-control n11-bg text-white border-secondary" 
              placeholder="Enter specific game name or subcategory (e.g., Call of Duty Mobile, Free Fire, etc.)"
              @input="onCustomGameInput"
            />
            <small class="text-white-50 d-block mt-2" style="opacity: 0.7;">
              Complementary field to specify a precise game name or subcategory
            </small>
          </div>
          <div class="form-group mb-4">
            <label class="text-white mb-2 d-block">Bet (EBT)</label>
            <input 
              v-model.number="newChallenge.bet_amount"
              type="number" 
              class="form-control n11-bg text-white border-secondary" 
              min="500"
              max="1000000"
              step="1"
              required
            />
            <small class="text-white d-block mt-2" style="opacity: 0.7;">Minimum: 500 EBT (5$) - Maximum: 1,000,000 EBT (10,000$)</small>
          </div>
          <div class="form-group mb-4">
            <label class="text-white mb-2 d-block">Expiration Date (optional)</label>
            <input 
              v-model="newChallenge.expires_at"
              type="datetime-local" 
              class="form-control n11-bg text-white border-secondary"
            />
          </div>
          <div v-if="createError" class="alert alert-danger mb-4">
            {{ createError }}
          </div>
          <div class="d-flex gap-3">
            <button type="submit" class="btn_primary flex-fill" :disabled="creating || (challengeType === 'direct' && !selectedOpponent) || !newChallenge.game">
              <span v-if="creating">Creating...</span>
              <span v-else>{{ challengeType === 'direct' ? 'Send Challenge' : 'Create Challenge' }}</span>
            </button>
            <button type="button" class="btn_secondary" @click="closeCreateModal">Cancel</button>
          </div>
        </form>
      </div>
    </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import apiClient from "@/utils/axios";

interface Challenge {
  id: number;
  game: string;
  bet_amount: number;
  status: string;
  creator: { id: number; username: string };
  opponent: { id: number; username: string } | null;
  expires_at: string | null;
  created_at: string;
}

const router = useRouter();
const route = useRoute();
const challenges = ref<Challenge[]>([]);
const loading = ref(false);
const filterStatus = ref<string | null>(null);
const showMyChallenges = ref(false);
const showCreateModal = ref(false);
const creating = ref(false);
const createError = ref("");
const currentUserId = ref<number | null>(null);
const challengeType = ref<'free' | 'direct'>('free');
const searchQuery = ref('');
const userSuggestions = ref<any[]>([]);
const showUserSuggestions = ref(false);
const selectedOpponent = ref<any | null>(null);

const allGames = ref<any[]>([]);
const selectedGame = ref<string>("");
const customGameName = ref<string>("");
const loadingGames = ref(false);

const newChallenge = ref({
  game: "",
  bet_amount: 10,
  expires_at: "",
});

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    open: "Open",
    accepted: "Accepted",
    in_progress: "In Progress",
    completed: "Completed",
    cancelled: "Cancelled",
  };
  return labels[status] || status;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    open: "badge bg-success",
    accepted: "badge bg-info",
    in_progress: "badge bg-warning",
    completed: "badge bg-primary",
    cancelled: "badge bg-danger",
  };
  return classes[status] || "badge bg-secondary";
};

const getTimeRemaining = (expiresAt: string | null) => {
  if (!expiresAt) return "No expiration";
  const now = new Date();
  const expires = new Date(expiresAt);
  const diff = expires.getTime() - now.getTime();
  if (diff <= 0) return "Expired";
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}d remaining`;
  if (hours > 0) return `${hours}h remaining`;
  const minutes = Math.floor(diff / (1000 * 60));
  return `${minutes}min remaining`;
};

const loadChallenges = async () => {
  try {
    loading.value = true;
    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.push("/login");
      return;
    }

    const params: any = {};
    if (filterStatus.value) params.status = filterStatus.value;
    if (showMyChallenges.value) params.my_challenges = true;

    const response = await apiClient.get("/challenges", { params });

    if (response.data.success) {
      challenges.value = response.data.data.data || response.data.data || [];
    }
  } catch (error: any) {
    console.error("Error loading challenges:", error);
    challenges.value = [];
  } finally {
    loading.value = false;
  }
};

const searchUsers = async () => {
  if (searchQuery.value.length < 2) {
    userSuggestions.value = [];
    showUserSuggestions.value = false;
    return;
  }

  try {
    const response = await apiClient.get("/users/search", {
      params: { q: searchQuery.value },
    });

    if (response.data.success) {
      userSuggestions.value = response.data.data || [];
      showUserSuggestions.value = true;
    }
  } catch (error: any) {
    console.error("Error searching users:", error);
    userSuggestions.value = [];
  }
};

const selectOpponent = (user: any) => {
  selectedOpponent.value = user;
  searchQuery.value = user.username;
  showUserSuggestions.value = false;
};

const closeCreateModal = () => {
  showCreateModal.value = false;
  challengeType.value = 'free';
  searchQuery.value = '';
  selectedOpponent.value = null;
  userSuggestions.value = [];
  showUserSuggestions.value = false;
  selectedGame.value = "";
  customGameName.value = "";
  newChallenge.value = { game: "", bet_amount: 10, expires_at: "" };
  createError.value = '';
};

const createChallenge = async () => {
  try {
    creating.value = true;
    createError.value = "";
    const token = localStorage.getItem("auth_token");

    const data: any = {
      game: newChallenge.value.game,
      bet_amount: newChallenge.value.bet_amount,
    };

    if (newChallenge.value.expires_at) {
      data.expires_at = new Date(newChallenge.value.expires_at).toISOString();
    }

    // Si un opponent est sélectionné, l'ajouter
    if (challengeType.value === 'direct' && selectedOpponent.value) {
      data.opponent_username = selectedOpponent.value.username;
    }

    const response = await apiClient.post("/challenges", data);

    if (response.data.success) {
      closeCreateModal();
      newChallenge.value = { game: "", bet_amount: 10, expires_at: "" };
      await loadChallenges();
      alert(challengeType.value === 'direct' ? 'Challenge sent successfully!' : 'Challenge created successfully!');
    }
  } catch (error: any) {
    createError.value = error.response?.data?.message || "Error creating challenge";
  } finally {
    creating.value = false;
  }
};

const acceptChallenge = async (id: number) => {
  if (!confirm("Are you sure you want to accept this challenge?")) return;

  try {
    const response = await apiClient.post(`/challenges/${id}/accept`, {});

    if (response.data.success) {
      await loadChallenges();
      alert("Challenge accepted successfully!");
    }
  } catch (error: any) {
    alert(error.response?.data?.message || "Error accepting challenge");
  }
};

const cancelChallenge = async (id: number) => {
  if (!confirm("Are you sure you want to cancel this challenge?")) return;

  try {
    const response = await apiClient.post(`/challenges/${id}/cancel`, {});

    if (response.data.success) {
      await loadChallenges();
      alert("Challenge cancelled successfully!");
    }
  } catch (error: any) {
    alert(error.response?.data?.message || "Error cancelling challenge");
  }
};

const viewDetails = (id: number) => {
  router.push(`/challenges/${id}`);
};

const getCurrentUser = async () => {
  try {
    const response = await apiClient.get("/user");
    currentUserId.value = response.data.id;
  } catch (error) {
    console.error("Error getting current user:", error);
  }
};

watch([filterStatus, showMyChallenges], () => {
  loadChallenges();
});

const loadGames = async () => {
  try {
    loadingGames.value = true;
    const response = await apiClient.get('/games?active_only=true');
    if (response.data.success) {
      // Sort games by position then by name (same as sidebar)
      allGames.value = (response.data.data || [])
        .sort((a: any, b: any) => {
          if (a.position !== b.position) {
            return a.position - b.position;
          }
          return a.name.localeCompare(b.name);
        });
      console.log('Games loaded:', allGames.value.length, 'games');
    } else {
      console.error('Failed to load games:', response.data);
      allGames.value = [];
    }
  } catch (error: any) {
    console.error('Error loading games:', error);
    allGames.value = [];
  } finally {
    loadingGames.value = false;
  }
};

const onGameSelect = () => {
  if (selectedGame.value) {
    newChallenge.value.game = selectedGame.value;
    customGameName.value = ""; // Clear custom name when selecting from list
  } else {
    newChallenge.value.game = customGameName.value || "";
  }
};

const onCustomGameInput = () => {
  if (customGameName.value) {
    newChallenge.value.game = customGameName.value;
    selectedGame.value = ""; // Clear selected game when entering custom name
  } else {
    newChallenge.value.game = selectedGame.value || "";
  }
};

onMounted(() => {
  getCurrentUser();
  loadChallenges();
  loadGames();
  
  // Check if action=create is in URL
  if (route?.query?.action === 'create') {
    showCreateModal.value = true;
  }
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
.btn_primary.active {
  background-color: #FF9F00;
  box-shadow: 0 4px 15px rgba(255, 159, 0, 0.4);
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
.btn_secondary.active {
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
  cursor: pointer;
}
.btn_see_details:hover {
  background-color: #FF9F00;
  transform: translateY(-2px);
}

.hero_badge {
  background: rgba(255, 159, 0, 0.2);
  color: #FF9F00;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
}

.hero_title {
  font-size: 2.5rem;
  font-weight: 800;
  color: white;
  line-height: 1.2;
}

.hero_subtitle {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
}

.player {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.9);
}

.vs {
  font-size: 1.2rem;
}

.montant {
  font-size: 1.1rem;
}

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

/* User suggestions dropdown */
.user-suggestions {
  background: #1a1f3a !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  z-index: 1000;
  max-height: 200px;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

.suggestion-item {
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.suggestion-item:hover {
  background-color: rgba(255, 159, 0, 0.2) !important;
}

.suggestion-item:last-child {
  border-bottom: none;
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

