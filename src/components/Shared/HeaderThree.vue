<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import apiClient from "@/utils/axios";
import SideNav from "./SideNav.vue";
import {
  IconAdjustmentsHorizontal,
  IconGift,
  IconUserCircle,
  IconX,
  IconLogout,
  IconUser,
} from "@tabler/icons-vue";
import NavItem from "./NavItem.vue";

import logo from "@/assets/images/logoebet.png";
// using single logo image (logoebet) per design

const router = useRouter();
const isCardExpanded = ref(false);
const isMiddleExpanded = ref(false);
const walletBalance = ref<number>(0);
const loadingBalance = ref(false);
const { t } = useI18n();
const userMenuOpen = ref(false);
const bonusMenuOpen = ref(false);
const bonuses = ref<any[]>([]);
const loadingBonuses = ref(false);

// Check if user is authenticated
const isAuthenticated = computed(() => {
  const token = localStorage.getItem("auth_token");
  return !!token;
});

// Format balance with 2 decimal places, ensuring it's never negative
const formattedBalance = computed(() => {
  const balance = Math.max(0, walletBalance.value);
  return balance.toFixed(2);
});

// Load wallet balance
const loadWallet = async () => {
  if (!isAuthenticated.value) {
    walletBalance.value = 0;
    return;
  }

  try {
    loadingBalance.value = true;
    const token = localStorage.getItem("auth_token");
    if (!token) return;
    
    const response = await apiClient.get("/wallet");
    
    if (response.data.success) {
      // Use available_balance if provided, otherwise use balance
      // Ensure balance is never negative
      const balance = parseFloat(
        response.data.data.available_balance ?? response.data.data.balance
      ) || 0;
      walletBalance.value = Math.max(0, balance);
    }
  } catch (error: any) {
    console.error("Error loading wallet:", error);
    walletBalance.value = 0;
  } finally {
    loadingBalance.value = false;
  }
};

const toggleCard = () => {
  isCardExpanded.value = !isCardExpanded.value;
};

const toggleMiddle = () => {
  isMiddleExpanded.value = !isMiddleExpanded.value;
};

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (isCardExpanded.value && !target.closest(".navbar-toggler")) {
    isCardExpanded.value = false;
  }
};

const handleClickOutsideMiddle = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (isMiddleExpanded.value && !target.closest(".left-nav-icon")) {
    isMiddleExpanded.value = false;
  }
};

const toggleUserMenu = () => {
  userMenuOpen.value = !userMenuOpen.value;
};

const handleClickOutsideUserMenu = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (userMenuOpen.value && !target.closest(".user-menu-container")) {
    userMenuOpen.value = false;
  }
};

const toggleBonusMenu = () => {
  bonusMenuOpen.value = !bonusMenuOpen.value;
  if (bonusMenuOpen.value && bonuses.value.length === 0) {
    loadBonuses();
  }
};

const toggleBonusMenuFromProfile = () => {
  userMenuOpen.value = false; // Fermer le menu profil
  toggleBonusMenu(); // Ouvrir le menu bonus
};

const handleClickOutsideBonusMenu = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (bonusMenuOpen.value && !target.closest(".bonus-menu-container")) {
    bonusMenuOpen.value = false;
  }
};

// Load bonuses from API
const loadBonuses = async () => {
  if (!isAuthenticated.value) return;
  
  try {
    loadingBonuses.value = true;
    const response = await apiClient.get("/bonuses");
    
    if (response.data.success) {
      bonuses.value = response.data.data || [];
    }
  } catch (error: any) {
    console.error("Error loading bonuses:", error);
    bonuses.value = [];
  } finally {
    loadingBonuses.value = false;
  }
};

const logout = async () => {
  try {
    const token = localStorage.getItem("auth_token");
    if (token) {
      // Call logout API if necessary
      try {
        await apiClient.post("/logout", {});
      } catch (error) {
        // Ignore API errors, logout client-side anyway
        console.log("Logout API call failed, continuing with client-side logout");
      }
    }
    
    // Nettoyer le localStorage
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_role");
    
    // Fermer le menu
    userMenuOpen.value = false;
    
    // Rediriger vers la page d'accueil
    router.push("/");
    
    // Recharger la page pour mettre à jour l'état
    window.location.reload();
  } catch (error: any) {
    console.error("Error during logout:", error);
    // Même en cas d'erreur, on nettoie et on redirige
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_role");
    router.push("/");
    window.location.reload();
  }
};

onMounted(() => {
  document.body.addEventListener("click", handleClickOutside);
  document.body.addEventListener("click", handleClickOutsideMiddle);
  document.body.addEventListener("click", handleClickOutsideUserMenu);
  document.body.addEventListener("click", handleClickOutsideBonusMenu);
  // Load wallet balance if user is authenticated
  loadWallet();
  // Load bonuses if user is authenticated
  if (isAuthenticated.value) {
    loadBonuses();
  }
  
  // Refresh balance every 30 seconds
  const balanceInterval = setInterval(() => {
    if (isAuthenticated.value) {
      loadWallet();
    }
  }, 30000);
  
  // Store interval ID for cleanup
  (window as any).balanceInterval = balanceInterval;
  
  // Listen for wallet update events from other components
  const handleWalletUpdate = () => {
    if (isAuthenticated.value) {
      loadWallet();
    }
  };
  
  window.addEventListener('wallet-updated', handleWalletUpdate);
  
  // Store handler for cleanup
  (window as any).walletUpdateHandler = handleWalletUpdate;
});

onBeforeUnmount(() => {
  document.body.removeEventListener("click", handleClickOutside);
  document.body.removeEventListener("click", handleClickOutsideMiddle);
  document.body.removeEventListener("click", handleClickOutsideUserMenu);
  document.body.removeEventListener("click", handleClickOutsideBonusMenu);
  // Clear balance refresh interval
  if ((window as any).balanceInterval) {
    clearInterval((window as any).balanceInterval);
  }
  // Remove wallet update event listener
  if ((window as any).walletUpdateHandler) {
    window.removeEventListener('wallet-updated', (window as any).walletUpdateHandler);
  }
});
</script>

<template>
  <div>
    <header class="header-section2 header-section">
      <nav
        class="navbar navbar-expand-lg position-relative py-md-3 py-lg-6 workready"
      >
        <div
          class="collapse navbar-collapse justify-content-between hide"
          :class="{ show: isCardExpanded }"
          id="navbar-content"
        >
          <ul
            class="navbar-nav2fixed navbar-nav d-flex align-items-lg-center gap-4 gap-sm-5 py-2 py-lg-0 align-self-center p2-bg"
          >
            <NavItem />
            <li class="dropdown show-dropdown d-block d-sm-none">
              <div class="d-flex align-items-center flex-wrap gap-3">
                <router-link
                  to="/login"
                  class="cmn-btn second-alt px-xxl-11 rounded-2"
                  >Log In</router-link
                >
                <router-link to="/create-account" class="cmn-btn px-xxl-11"
                  >Sign Up</router-link
                >
              </div>
            </li>
          </ul>
        </div>
        <div
          class="right-area custom-pos custom-postwo position-relative d-flex gap-3 gap-xl-7 align-items-center me-5 me-xl-10 align-items-center"
        >
          <div 
            v-if="isAuthenticated" 
            class="balance-display text-end d-none d-sm-block"
          >
            <span class="fs-seven mb-1 d-block text-white">Your balance</span>
            <div class="d-flex align-items-center justify-content-end gap-2">
              <span 
                v-if="loadingBalance" 
                class="spinner-border spinner-border-sm text-primary" 
                role="status"
                style="width: 1rem; height: 1rem;"
              >
                <span class="visually-hidden">Loading...</span>
              </span>
              <span class="fw-bold d-block balance-amount">{{ formattedBalance }} EBT</span>
            </div>
          </div>
          <button
            class="cmn-btn px-xxl-6 d-none d-sm-block d-lg-none d-xxl-block"
          >
            Deposit
          </button>
          <div class="d-flex align-items-center gap-2 mt-1">
            <div class="bonus-menu-container position-relative">
              <button
                type="button"
                class="py-1 px-2 n11-bg rounded-5 position-relative"
                @click="toggleBonusMenu"
              >
                <IconGift height="24" width="24" class="fs-four" />
                <span
                  v-if="bonuses.length > 0"
                  class="fs-eight g1-bg px-1 rounded-5 position-absolute end-0 top-0"
                >{{ bonuses.length }}</span>
              </button>
              
              <!-- Bonus Menu Dropdown -->
              <div 
                v-if="bonusMenuOpen" 
                class="bonus-menu-dropdown position-absolute end-0 top-100 mt-2"
              >
                <div class="bonus-menu-content n11-bg rounded-4 p-3 shadow-lg" style="min-width: 350px; max-width: 450px; max-height: 600px; overflow-y: auto;">
                  <div class="d-flex justify-content-between align-items-center mb-3">
                    <h6 class="text-white mb-0 fw-bold">{{ t('bonus.myBonuses') }}</h6>
                    <span v-if="loadingBonuses" class="spinner-border spinner-border-sm text-primary" role="status"></span>
                  </div>
                  
                  <div v-if="!loadingBonuses && bonuses.length === 0" class="text-center py-4">
                    <p class="text-white-50 mb-0">{{ t('bonus.noBonusAvailable') }}</p>
                  </div>
                  
                  <div v-else-if="!loadingBonuses" class="bonus-list">
                    <div 
                      v-for="bonus in bonuses" 
                      :key="bonus.id"
                      class="bonus-item mb-3 p-3 rounded-3"
                      :class="bonus.can_withdraw ? 'bg-success bg-opacity-10 border border-success' : 'bg-dark bg-opacity-50 border border-secondary'"
                    >
                      <div class="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <h6 class="text-white mb-1 fw-bold">{{ bonus.type_label }}</h6>
                          <p class="text-warning mb-0 fw-bold fs-5">{{ parseFloat(bonus.amount).toLocaleString() }} EBT</p>
                        </div>
                        <span 
                          class="badge"
                          :class="bonus.can_withdraw ? 'bg-success' : 'bg-warning'"
                        >
                          {{ bonus.can_withdraw ? t('bonus.withdrawable') : t('bonus.conditional') }}
                        </span>
                      </div>
                      
                      <div class="bonus-conditions mt-2">
                        <p class="text-white-50 small mb-2">
                          <i class="fas fa-info-circle me-1"></i>
                          {{ bonus.withdrawal_message }}
                        </p>
                        
                        <div v-if="bonus.withdrawal_conditions?.conditions" class="conditions-list">
                          <div 
                            v-for="(condition, key) in bonus.withdrawal_conditions.conditions" 
                            :key="key"
                            class="condition-item mb-2"
                          >
                            <div class="d-flex justify-content-between align-items-center mb-1">
                              <span class="text-white small">{{ condition.description }}</span>
                              <span 
                                class="badge"
                                :class="condition.completed ? 'bg-success' : 'bg-secondary'"
                              >
                                {{ condition.completed ? '✓' : '⏳' }}
                              </span>
                            </div>
                            <div class="progress" style="height: 4px;">
                              <div 
                                class="progress-bar"
                                :class="condition.completed ? 'bg-success' : 'bg-warning'"
                                :style="{ width: condition.progress + '%' }"
                              ></div>
                            </div>
                            <small v-if="!condition.completed && condition.remaining" class="text-white-50">
                              {{ t('bonus.remaining') }}: {{ condition.remaining }}
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="cart-area search-area d-flex user-menu-container position-relative">
              <button 
                type="button" 
                class="py-1 px-2 n11-bg rounded-5"
                @click="toggleUserMenu"
                v-if="isAuthenticated"
              >
                <IconUserCircle
                  height="24"
                  width="24"
                  class="ti ti-user-circle fs-four"
                />
              </button>
              
              <!-- User Menu Dropdown -->
              <div 
                v-if="isAuthenticated && userMenuOpen" 
                class="user-menu-dropdown position-absolute end-0 top-100 mt-2"
              >
                <div class="user-menu-content n11-bg rounded-4 p-2 shadow-lg">
                  <router-link
                    to="/profile"
                    class="user-menu-item d-flex align-items-center gap-2 w-100 text-start p-2 rounded-3 border-0 bg-transparent text-white text-decoration-none"
                    @click="userMenuOpen = false"
                  >
                    <IconUser height="18" width="18" />
                    <span class="small">Profile</span>
                  </router-link>
                  
                  <!-- Mes Bonus - visible uniquement en mode responsive -->
                  <button
                    @click="toggleBonusMenuFromProfile"
                    class="user-menu-item d-flex align-items-center gap-2 w-100 text-start p-2 rounded-3 border-0 bg-transparent text-white d-sm-none"
                  >
                    <IconGift height="18" width="18" />
                    <span class="small">{{ t('bonus.myBonuses') }}</span>
                    <span
                      v-if="bonuses.length > 0"
                      class="badge bg-warning text-dark ms-auto"
                      style="font-size: 0.7rem;"
                    >{{ bonuses.length }}</span>
                  </button>
                  
                  <button
                    @click="logout"
                    class="user-menu-item d-flex align-items-center gap-2 w-100 text-start p-2 rounded-3 border-0 bg-transparent text-white"
                  >
                    <IconLogout height="18" width="18" />
                    <span class="small">Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <button
            @click="toggleCard"
            class="navbar-toggler navbar-toggler-two mt-1 mt-sm-2 mt-lg-0"
            type="button"
            data-bs-toggle="collapse"
            aria-label="Navbar Toggler"
            data-bs-target="#navbar-content"
            aria-expanded="true"
            id="nav-icon3"
          >
            <span></span><span></span><span></span><span></span>
          </button>
        </div>
      </nav>
      <div id="div10" class="navigation left-nav-area box3 position-fixed">
        <div
          class="logo-area slide-toggle3 trader-list position-fixed top-0 d-flex align-items-center justify-content-center pt-6 pt-md-8 gap-sm-4 gap-md-5 gap-lg-7 px-4 px-lg-8"
        >
          <i
            class="ti ti-menu-deep left-nav-icon n8-color order-2 order-lg-0 d-none"
          >
          </i>
          <router-link
            class="navbar-brand d-center text-center gap-1 gap-lg-2 ms-lg-4"
            to="/"
          >
            <img
              class="logo"
              width="180"
              height="56"
              :src="logo"
              alt="logoebet"
            />
          </router-link>
        </div>
        <div
          class="nav_aside px-5 p2-bg"
          :class="isMiddleExpanded ? 'show' : 'hide'"
        >
            <div class="nav-clsoeicon d-flex justify-content-end">
              <IconX
                @click="toggleMiddle"
                width="32"
                height="32"
                class="left-nav-icon n8-color order-2 order-lg-0 d-block d-lg-none fs-three"
              />
            </div>
            <SideNav />
          </div>
        </div>
    </header>
    <button
      @click="toggleMiddle"
      type="button"
      class="middle-iconfixed position-fixed top-50 start-0 left-nav-icon"
    >
      <IconAdjustmentsHorizontal
        width="38"
        height="38"
        class="ti ti-adjustments-horizontal n8-color d-block d-lg-none fs-two"
      />
    </button>
  </div>
</template>

<style scoped>
.balance-display {
  min-width: 120px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.balance-display:hover {
  background: rgba(255, 255, 255, 0.08);
}

.balance-amount {
  font-size: 1.1rem;
  color: #FF9F00;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.fs-seven {
  font-size: 0.75rem;
  color: #ffffff;
  opacity: 0.9;
}

@media (max-width: 576px) {
  .balance-display {
    min-width: 100px;
    padding: 6px 10px;
  }
  
  .balance-amount {
    font-size: 0.95rem;
  }
}

.user-menu-container {
  position: relative;
}

.user-menu-dropdown {
  z-index: 1000;
  min-width: 160px;
  animation: fadeInDown 0.2s ease-out;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.user-menu-content {
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.user-menu-item {
  transition: all 0.2s ease;
  color: #fff;
}

.user-menu-item:hover {
  background: rgba(255, 159, 0, 0.2) !important;
  color: #FF9F00;
}

.user-menu-item:active {
  transform: scale(0.98);
}

.bonus-menu-container {
  position: relative;
}

.bonus-menu-dropdown {
  z-index: 1000;
  animation: fadeInDown 0.2s ease-out;
}

.bonus-menu-content {
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.bonus-item {
  transition: all 0.2s ease;
}

.bonus-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.progress {
  background-color: rgba(255, 255, 255, 0.1);
}

.condition-item {
  padding: 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
}

.fs-eight {
  font-size: 0.7rem;
}
</style>
