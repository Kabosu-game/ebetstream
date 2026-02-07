<template>
  <div class="admin-dashboard-container">
    <!-- Floating Toggle Button (always visible) -->
    <button 
      class="floating-toggle-btn"
      @click="toggleSidebar"
      :title="sidebarOpen ? 'Close sidebar' : 'Open sidebar'"
    >
      <i v-if="sidebarOpen" class="fas fa-times"></i>
      <i v-else class="fas fa-bars"></i>
    </button>

    <!-- Sidebar Navigation -->
    <div class="admin-sidebar" :class="{ 'collapsed': !sidebarOpen }">
      <!-- Toggle Arrow Button -->
      <button 
        class="sidebar-arrow-toggle"
        @click="toggleSidebar"
        :title="sidebarOpen ? 'Close sidebar' : 'Open sidebar'"
      >
        <i v-if="sidebarOpen" class="fas fa-chevron-left"></i>
        <i v-else class="fas fa-chevron-right"></i>
      </button>
      
      <div class="sidebar-header">
        <div class="logo-section">
          <div class="logo-icon">
            <i class="fas fa-th-large"></i>
          </div>
          <div>
            <h3 class="logo-title">Admin Panel</h3>
            <p class="logo-subtitle">EbetStream Management</p>
          </div>
        </div>
      </div>

      <div class="sidebar-menu">
        <!-- Dashboard Section -->
        <div class="menu-section">
          <div class="section-title">Dashboard</div>
          <button 
            class="menu-item" 
            :class="{ 'active': activeTab === 'overview' }"
            @click="activeTab = 'overview'"
          >
            <i class="fas fa-chart-line"></i>
            <span>Overview</span>
          </button>
        </div>

        <!-- User Management Section -->
        <div class="menu-section">
          <div class="section-title">User Management</div>
          <button 
            class="menu-item" 
            :class="{ 'active': activeTab === 'users' }"
            @click="activeTab = 'users'"
          >
            <i class="fas fa-users"></i>
            <span>Users</span>
          </button>
          <button 
            class="menu-item" 
            :class="{ 'active': activeTab === 'ambassadors' }"
            @click="activeTab = 'ambassadors'"
          >
            <i class="fas fa-star"></i>
            <span>Ambassadors</span>
          </button>
          <button 
            class="menu-item" 
            :class="{ 'active': activeTab === 'partners' }"
            @click="activeTab = 'partners'"
          >
            <i class="fas fa-building"></i>
            <span>Partners</span>
          </button>
          <button 
            class="menu-item" 
            :class="{ 'active': activeTab === 'clans' }"
            @click="activeTab = 'clans'"
          >
            <i class="fas fa-users"></i>
            <span>Clans</span>
          </button>
        </div>

        <!-- Gaming Section -->
        <div class="menu-section">
          <div class="section-title">Gaming</div>
          <button 
            class="menu-item" 
            :class="{ 'active': activeTab === 'challenges' }"
            @click="activeTab = 'challenges'"
          >
            <i class="fas fa-sword"></i>
            <span>Challenges</span>
          </button>
          <button 
            class="menu-item" 
            :class="{ 'active': activeTab === 'events' }"
            @click="activeTab = 'events'"
          >
            <i class="fas fa-calendar"></i>
            <span>Events</span>
          </button>
          <button 
            class="menu-item" 
            :class="{ 'active': activeTab === 'streams' }"
            @click="activeTab = 'streams'"
          >
            <i class="fas fa-video"></i>
            <span>Streams</span>
          </button>
          <button 
            class="menu-item" 
            :class="{ 'active': activeTab === 'categories' }"
            @click="activeTab = 'categories'"
          >
            <i class="fas fa-folder"></i>
            <span>Categories</span>
          </button>
          <button 
            class="menu-item" 
            :class="{ 'active': activeTab === 'matches' }"
            @click="activeTab = 'matches'"
          >
            <i class="fas fa-futbol"></i>
            <span>Matches</span>
          </button>
          <button 
            class="menu-item" 
            :class="{ 'active': activeTab === 'bets' }"
            @click="activeTab = 'bets'"
          >
            <i class="fas fa-sword"></i>
            <span>Bets</span>
          </button>
          <button 
            class="menu-item" 
            :class="{ 'active': activeTab === 'championships' }"
            @click="activeTab = 'championships'"
          >
            <i class="fas fa-trophy"></i>
            <span>Championships</span>
          </button>
        </div>

        <!-- Financial Section -->
        <div class="menu-section">
          <div class="section-title">Financial</div>
          <button 
            class="menu-item" 
            :class="{ 'active': activeTab === 'deposits' }"
            @click="activeTab = 'deposits'"
          >
            <i class="fas fa-wallet"></i>
            <span>Deposits</span>
          </button>
          <button 
            class="menu-item" 
            :class="{ 'active': activeTab === 'withdrawals' }"
            @click="activeTab = 'withdrawals'"
          >
            <i class="fas fa-credit-card"></i>
            <span>Withdrawals</span>
          </button>
          <button 
            class="menu-item" 
            :class="{ 'active': activeTab === 'recharge-agents' }"
            @click="activeTab = 'recharge-agents'"
          >
            <i class="fas fa-users"></i>
            <span>Recharge Agents</span>
          </button>
          <button 
            class="menu-item" 
            :class="{ 'active': activeTab === 'withdrawal-codes' }"
            @click="activeTab = 'withdrawal-codes'"
          >
            <i class="fas fa-key"></i>
            <span>Withdrawal Codes</span>
          </button>
          <button 
            class="menu-item" 
            :class="{ 'active': activeTab === 'payment-methods' }"
            @click="activeTab = 'payment-methods'"
          >
            <i class="fas fa-credit-card"></i>
            <span>Payment Methods</span>
          </button>
          <button 
            class="menu-item" 
            :class="{ 'active': activeTab === 'promo-codes' }"
            @click="activeTab = 'promo-codes'"
          >
            <i class="fas fa-ticket"></i>
            <span>Promo Codes</span>
          </button>
        </div>

        <!-- Verification Section -->
        <div class="menu-section">
          <div class="section-title">Verification</div>
          <button 
            class="menu-item" 
            :class="{ 'active': activeTab === 'certifications' }"
            @click="activeTab = 'certifications'"
          >
            <i class="fas fa-certificate"></i>
            <span>Certifications</span>
          </button>
          <button 
            class="menu-item" 
            :class="{ 'active': activeTab === 'certification-requests' }"
            @click="activeTab = 'certification-requests'"
          >
            <i class="fas fa-certificate"></i>
            <span>Certification Requests</span>
          </button>
          <button 
            class="menu-item" 
            :class="{ 'active': activeTab === 'agent-requests' }"
            @click="activeTab = 'agent-requests'"
          >
            <i class="fas fa-user-check"></i>
            <span>Agent Requests</span>
          </button>
        </div>

        <!-- Fédérations & Ballon d'Or Section -->
        <div class="menu-section">
          <div class="section-title">Fédérations & Récompenses</div>
          <button 
            class="menu-item" 
            :class="{ 'active': activeTab === 'federations' }"
            @click="activeTab = 'federations'"
          >
            <i class="fas fa-building"></i>
            <span>Fédérations</span>
          </button>
          <button 
            class="menu-item" 
            :class="{ 'active': activeTab === 'ballon-dor' }"
            @click="activeTab = 'ballon-dor'"
          >
            <i class="fas fa-trophy"></i>
            <span>Ballon d'Or</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="admin-main-content" :class="{ 'sidebar-closed': !sidebarOpen }">
      <!-- Top Bar -->
      <div class="admin-topbar">
        <div class="topbar-left">
          <div class="page-info">
            <h1 class="page-title">Admin Dashboard</h1>
            <p class="page-description">Manage your platform</p>
          </div>
        </div>
        <div class="topbar-right">
          <div class="admin-info">
            <div class="admin-avatar">
              <i class="fas fa-user"></i>
            </div>
            <div class="admin-details">
              <span class="admin-name">Admin</span>
              <span class="admin-role">Administrator</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Content Area -->
      <div class="admin-content-area">
        <div v-if="activeTab === 'overview'">
          <AdminOverview />
        </div>
        <div v-if="activeTab === 'users'">
          <AdminUsers />
        </div>
        <div v-if="activeTab === 'ambassadors'">
          <AdminAmbassadors />
        </div>
        <div v-if="activeTab === 'partners'">
          <AdminPartners />
        </div>
        <div v-if="activeTab === 'challenges'">
          <AdminChallenges />
        </div>
        <div v-if="activeTab === 'events'">
          <AdminEvents />
        </div>
        <div v-if="activeTab === 'streams'">
          <AdminStreams />
        </div>
        <div v-if="activeTab === 'clans'">
          <AdminClans />
        </div>
        <div v-if="activeTab === 'deposits'">
          <AdminDeposits />
        </div>
        <div v-if="activeTab === 'withdrawals'">
          <AdminWithdrawals />
        </div>
        <div v-if="activeTab === 'categories'">
          <AdminGameCategories />
        </div>
        <div v-if="activeTab === 'matches'">
          <AdminGameMatches />
        </div>
        <div v-if="activeTab === 'certifications'">
          <AdminCertifications />
        </div>
        <div v-if="activeTab === 'certification-requests'">
          <AdminCertificationRequests />
        </div>
        <div v-if="activeTab === 'agent-requests'">
          <AdminAgentRequests />
        </div>
        <div v-if="activeTab === 'recharge-agents'">
          <AdminRechargeAgents />
        </div>
        <div v-if="activeTab === 'withdrawal-codes'">
          <AdminWithdrawalCodes />
        </div>
        <div v-if="activeTab === 'payment-methods'">
          <AdminPaymentMethods />
        </div>
        <div v-if="activeTab === 'promo-codes'">
          <AdminPromoCodes />
        </div>
        <div v-if="activeTab === 'bets'">
          <AdminBets />
        </div>
        <div v-if="activeTab === 'federations'">
          <AdminFederations />
        </div>
        <div v-if="activeTab === 'ballon-dor'">
          <AdminBallonDor />
        </div>
        <div v-if="activeTab === 'championships'">
          <AdminChampionships />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";

import AdminOverview from "./AdminOverview.vue";
import AdminUsers from "./AdminUsers.vue";
import AdminAmbassadors from "./AdminAmbassadors.vue";
import AdminPartners from "./AdminPartners.vue";
import AdminChallenges from "./AdminChallenges.vue";
import AdminEvents from "./AdminEvents.vue";
import AdminStreams from "./AdminStreams.vue";
import AdminClans from "./AdminClans.vue";
import AdminDeposits from "./AdminDeposits.vue";
import AdminWithdrawals from "./AdminWithdrawals.vue";
import AdminGameCategories from "./AdminGameCategories.vue";
import AdminGameMatches from "./AdminGameMatches.vue";
import AdminCertifications from "./AdminCertifications.vue";
import AdminCertificationRequests from "./AdminCertificationRequests.vue";
import AdminAgentRequests from './AdminAgentRequests.vue';
import AdminRechargeAgents from './AdminRechargeAgents.vue';
import AdminWithdrawalCodes from './AdminWithdrawalCodes.vue';
import AdminPaymentMethods from "./AdminPaymentMethods.vue";
import AdminPromoCodes from "./AdminPromoCodes.vue";
import AdminBets from "./AdminBets.vue";
import AdminFederations from "./AdminFederations.vue";
import AdminBallonDor from "./AdminBallonDor.vue";
import AdminChampionships from "./AdminChampionships.vue";

const activeTab = ref('overview');
const sidebarOpen = ref(true);

// Toggle sidebar
const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};

// Update URL when tab changes
watch(activeTab, (newTab) => {
  window.location.hash = newTab;
});

// Initialize with tab from URL if available
onMounted(() => {
  const hash = window.location.hash;
  if (hash) {
    activeTab.value = hash.replace('#', '');
  }
});
</script>

<style scoped>
/* Layout */
.admin-dashboard-container {
  display: flex;
  min-height: calc(100vh - 80px);
  background: #0a0e27;
  margin: 0 !important;
  width: 100%;
}

/* Floating Toggle Button (guaranteed visible) */
.floating-toggle-btn {
  position: fixed;
  top: 100px;
  left: 20px;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #FF9F00 0%, #FF6B00 100%);
  border: 3px solid white;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
  transition: all 0.3s ease;
  z-index: 10000;
  box-shadow: 0 4px 20px rgba(255, 159, 0, 0.5);
}

.floating-toggle-btn:hover {
  background: linear-gradient(135deg, #FF6B00 0%, #FF9F00 100%);
  transform: scale(1.1);
  box-shadow: 0 6px 30px rgba(255, 159, 0, 0.7);
}

.floating-toggle-btn:active {
  transform: scale(0.95);
}

/* Sidebar Arrow Toggle */
.sidebar-arrow-toggle {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #FF9F00 0%, #FF6B00 100%);
  border: 3px solid white;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 9999;
  box-shadow: 0 4px 20px rgba(255, 159, 0, 0.5);
  left: 260px;
}

.admin-sidebar.collapsed .sidebar-arrow-toggle {
  left: 0px;
}

.sidebar-arrow-toggle:hover {
  background: linear-gradient(135deg, #FF6B00 0%, #FF9F00 100%);
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 6px 30px rgba(255, 159, 0, 0.7);
}

.admin-sidebar.collapsed .sidebar-arrow-toggle:hover {
  transform: translateY(-50%) scale(1.1);
}

.sidebar-arrow-toggle:active {
  transform: translateY(-50%) scale(0.95);
}

.admin-sidebar.collapsed .sidebar-arrow-toggle:active {
  transform: translateY(-50%) scale(0.95);
}

/* Sidebar */
.admin-sidebar {
  width: 280px;
  background: linear-gradient(135deg, #1a1f3a 0%, #0f172a 100%);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  overflow-y: auto;
  position: fixed;
  top: 80px;
  left: 0;
  height: calc(100vh - 80px);
  z-index: 1000;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.admin-sidebar.collapsed {
  transform: translateX(-100%);
  margin-left: -280px;
}

.sidebar-header {
  padding: 2rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.logo-title {
  color: white;
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
  line-height: 1.2;
}

.logo-subtitle {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.875rem;
  margin: 0;
  line-height: 1;
}

/* Menu */
.sidebar-menu {
  padding: 1rem 0;
}

.menu-section {
  margin-bottom: 2rem;
}

.section-title {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0 1.5rem;
  margin-bottom: 0.5rem;
}

.menu-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.5rem;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.menu-item:hover {
  background: rgba(255, 255, 255, 0.05);
  color: white;
}

.menu-item.active {
  background: linear-gradient(90deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  color: #667eea;
  border-left: 3px solid #667eea;
}

.menu-item span {
  flex: 1;
}

/* Main Content */
.admin-main-content {
  flex: 1;
  margin-left: 280px;
  min-height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
  transition: margin-left 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.admin-main-content.sidebar-closed {
  margin-left: 0 !important;
}

/* Top Bar */
.admin-topbar {
  background: rgba(26, 31, 58, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1.5rem 2rem;
  display: flex;
  align-items: center;
  justify-content: between;
}

.topbar-left {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.sidebar-toggle-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  font-size: 16px;
}

.sidebar-toggle-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

.sidebar-toggle-btn:active {
  transform: translateY(0);
}

.page-info {
  flex: 1;
}

.page-title {
  color: white;
  font-size: 1.875rem;
  font-weight: 700;
  margin: 0 0 0.25rem 0;
  line-height: 1.2;
}

.page-description {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.875rem;
  margin: 0;
  line-height: 1.4;
}

.topbar-right {
  display: flex;
  align-items: center;
}

.admin-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.admin-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.admin-details {
  display: flex;
  flex-direction: column;
}

.admin-name {
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.2;
}

.admin-role {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.75rem;
  line-height: 1.2;
}

/* Content Area */
.admin-content-area {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .admin-sidebar {
    width: 240px;
  }
  
  .admin-main-content {
    margin-left: 240px;
  }
  
  .page-title {
    font-size: 1.5rem;
  }
}

@media (max-width: 768px) {
  .admin-sidebar {
    width: 100%;
    height: auto;
    position: fixed;
    top: 80px;
    left: 0;
    transform: translateX(-100%);
    opacity: 0;
  }
  
  .admin-sidebar:not(.collapsed) {
    transform: translateX(0);
    opacity: 1;
  }
  
  .admin-main-content {
    margin-left: 0;
  }
  
  .admin-topbar {
    padding: 1rem;
  }
  
  .admin-content-area {
    padding: 1rem;
  }
  
  .page-title {
    font-size: 1.25rem;
  }
  
  .logo-title {
    font-size: 1rem;
  }
  
  .logo-subtitle {
    font-size: 0.75rem;
  }
  
  .sidebar-toggle-btn {
    display: flex;
  }
}

/* Scrollbar Styling */
.admin-sidebar::-webkit-scrollbar {
  width: 4px;
}

.admin-sidebar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

.admin-sidebar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
}

.admin-sidebar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

.admin-content-area::-webkit-scrollbar {
  width: 8px;
}

.admin-content-area::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

.admin-content-area::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

.admin-content-area::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>
