<template>
  <div class="dash-root">
    <!-- Overlay mobile -->
    <div v-if="sidebarOpen && isMobile" class="dash-overlay" @click="sidebarOpen = false" />

    <!-- ── SIDEBAR ── -->
    <aside class="dash-sidebar" :class="{ 'is-open': sidebarOpen, 'is-collapsed': !sidebarOpen }">
      <!-- Brand -->
      <div class="sb-brand">
        <div class="sb-logo">
          <i class="fas fa-th"></i>
        </div>
        <transition name="fade-slide">
          <div v-if="sidebarOpen" class="sb-brand-text">
            <span class="sb-name">{{ $t('ui.ebetstream') }}</span>
            <span class="sb-role">{{ $t('ui.administration') }}</span>
          </div>
        </transition>
      </div>

      <!-- Admin mini profile -->
      <div class="sb-profile" v-if="sidebarOpen">
        <div class="sb-avatar">
          <i class="fas fa-user"></i>
        </div>
        <div class="sb-profile-info">
          <span class="sb-admin-name">{{ adminName }}</span>
          <span class="sb-admin-tag">
            <span class="sb-dot"></span>{{ $t('ui.administrateur') }}</span>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="sb-nav">
        <div v-for="section in menuSections" :key="section.sectionKey" class="sb-section">
          <div class="sb-section-label" v-if="sidebarOpen">{{ $t(section.sectionKey) }}</div>
          <button
            v-for="item in section.items"
            :key="item.tab"
            class="sb-item"
            :class="{ 'is-active': activeTab === item.tab }"
            @click="navigate(item.tab)"
            :title="!sidebarOpen ? t(item.labelKey) : ''"
          >
            <span class="sb-item-icon" :class="item.colorClass">
              <i :class="['ti', item.icon]"></i>
            </span>
            <span class="sb-item-label" v-if="sidebarOpen">{{ $t(item.labelKey) }}</span>
            <span v-if="sidebarOpen && item.badge" class="sb-badge">{{ item.badge }}</span>
          </button>
        </div>
      </nav>

      <!-- Sidebar footer -->
      <div class="sb-footer">
        <button class="sb-item sb-logout" @click="handleLogout" :title="!sidebarOpen ? t('ui.d_connexion') : ''">
          <span class="sb-item-icon icon-red"><i class="fas fa-sign-out-alt"></i></span>
          <span class="sb-item-label" v-if="sidebarOpen">{{ $t('ui.d_connexion') }}</span>
        </button>
      </div>
    </aside>

    <!-- ── MAIN ── -->
    <div class="dash-main" :class="{ 'sidebar-expanded': sidebarOpen }">
      <!-- Topbar -->
      <header class="dash-topbar">
        <div class="topbar-left">
          <button class="topbar-toggle" @click="sidebarOpen = !sidebarOpen">
            <i :class="['ti', sidebarOpen ? 'ti-layout-sidebar-left-collapse' : 'ti-layout-sidebar-left-expand']"></i>
          </button>
          <div class="topbar-breadcrumb">
            <span class="breadcrumb-parent">{{ $t('common.admin') }}</span>
            <i class="ti ti-chevron-right breadcrumb-sep"></i>
            <span class="breadcrumb-current">{{ currentPageLabel }}</span>
          </div>
        </div>

        <div class="topbar-right">
          <div class="topbar-search">
            <i class="fas fa-search"></i>
            <input type="text" :placeholder="$t('ui.rechercher')" v-model="searchQuery" />
          </div>

          <button class="topbar-icon-btn notif-btn" title="Notifications">
            <i class="ti ti-bell"></i>
            <span class="notif-dot"></span>
          </button>

          <div class="topbar-divider"></div>

          <div class="topbar-user">
            <div class="topbar-avatar">
              <i class="fas fa-user"></i>
            </div>
            <div class="topbar-user-info">
              <span class="topbar-user-name">{{ adminName }}</span>
              <span class="topbar-user-role">{{ $t('common.admin') }}</span>
            </div>
          </div>
        </div>
      </header>

      <!-- Page title bar -->
      <div class="dash-page-header">
        <div class="page-header-left">
          <div class="page-icon" :class="currentPageItem?.colorClass">
            <i :class="['ti', currentPageItem?.icon || 'ti-layout-dashboard']"></i>
          </div>
          <div>
            <h1 class="page-title">{{ currentPageLabel }}</h1>
            <p class="page-sub">{{ currentPageItem?.descKey ? t(currentPageItem.descKey) : t('adminMenu.platformManagement') }}</p>
          </div>
        </div>
        <div class="page-header-right">
          <span class="page-date">{{ formattedDate }}</span>
        </div>
      </div>

      <!-- Content -->
      <div class="dash-content">
        <AdminOverview v-if="activeTab === 'overview'" />
        <AdminUsers v-if="activeTab === 'users'" />
        <AdminAmbassadors v-if="activeTab === 'ambassadors'" />
        <AdminPartners v-if="activeTab === 'partners'" />
        <AdminChallenges v-if="activeTab === 'challenges'" />
        <AdminEvents v-if="activeTab === 'events'" />
        <AdminStreams v-if="activeTab === 'streams'" />
        <AdminClans v-if="activeTab === 'clans'" />
        <AdminDeposits v-if="activeTab === 'deposits'" />
        <AdminWithdrawals v-if="activeTab === 'withdrawals'" />
        <AdminCertifications v-if="activeTab === 'certifications'" />
        <AdminCertificationRequests v-if="activeTab === 'certification-requests'" />
        <AdminAgentRequests v-if="activeTab === 'agent-requests'" />
        <AdminRechargeAgents v-if="activeTab === 'recharge-agents'" />
        <AdminWithdrawalCodes v-if="activeTab === 'withdrawal-codes'" />
        <AdminPaymentMethods v-if="activeTab === 'payment-methods'" />
        <AdminPromoCodes v-if="activeTab === 'promo-codes'" />
        <AdminMonetization v-if="activeTab === 'monetization'" />
        <AdminBets v-if="activeTab === 'bets'" />
        <AdminFederations v-if="activeTab === 'federations'" />
        <AdminBallonDor v-if="activeTab === 'ballon-dor'" />
        <AdminChampionships v-if="activeTab === 'championships'" />
        <AdminArena v-if="activeTab === 'arena'" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t } = useI18n();

import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useRouter } from "vue-router";

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
import AdminCertifications from "./AdminCertifications.vue";
import AdminCertificationRequests from "./AdminCertificationRequests.vue";
import AdminAgentRequests from './AdminAgentRequests.vue';
import AdminRechargeAgents from './AdminRechargeAgents.vue';
import AdminWithdrawalCodes from './AdminWithdrawalCodes.vue';
import AdminPaymentMethods from "./AdminPaymentMethods.vue";
import AdminPromoCodes from "./AdminPromoCodes.vue";
import AdminMonetization from "./AdminMonetization.vue";
import AdminBets from "./AdminBets.vue";
import AdminFederations from "./AdminFederations.vue";
import AdminBallonDor from "./AdminBallonDor.vue";
import AdminChampionships from "./AdminChampionships.vue";
import AdminArena from './AdminArena.vue';

const router = useRouter();
const activeTab = ref('overview');
const sidebarOpen = ref(true);
const searchQuery = ref('');
const isMobile = ref(false);
const adminName = ref(localStorage.getItem('user_name') || 'Admin');

interface MenuItem {
  tab: string;
  labelKey: string;
  icon: string;
  colorClass: string;
  descKey?: string;
  badge?: number;
}

interface MenuSection {
  sectionKey: string;
  items: MenuItem[];
}

const menuSections: MenuSection[] = [
  {
    sectionKey: 'adminMenu.dashboard',
    items: [
      { tab: 'overview', labelKey: 'adminMenu.overview', icon: 'ti-layout-dashboard', colorClass: 'icon-blue', descKey: 'adminMenu.overviewDesc' },
    ],
  },
  {
    sectionKey: 'adminMenu.usersSection',
    items: [
      { tab: 'users', labelKey: 'adminMenu.users', icon: 'ti-users', colorClass: 'icon-purple', descKey: 'adminMenu.usersDesc' },
      { tab: 'ambassadors', labelKey: 'adminMenu.ambassadors', icon: 'ti-star', colorClass: 'icon-yellow', descKey: 'adminMenu.ambassadorsDesc' },
      { tab: 'partners', labelKey: 'adminMenu.partners', icon: 'ti-building', colorClass: 'icon-cyan', descKey: 'adminMenu.partnersDesc' },
      { tab: 'clans', labelKey: 'adminMenu.clans', icon: 'ti-shield', colorClass: 'icon-green', descKey: 'adminMenu.clansDesc' },
    ],
  },
  {
    sectionKey: 'adminMenu.gamingSection',
    items: [
      { tab: 'challenges', labelKey: 'adminMenu.challenges', icon: 'ti-sword', colorClass: 'icon-red', descKey: 'adminMenu.challengesDesc' },
      { tab: 'events', labelKey: 'adminMenu.events', icon: 'ti-calendar-event', colorClass: 'icon-orange', descKey: 'adminMenu.eventsDesc' },
      { tab: 'streams', labelKey: 'adminMenu.streams', icon: 'ti-video', colorClass: 'icon-pink', descKey: 'adminMenu.streamsDesc' },
      { tab: 'championships', labelKey: 'adminMenu.championships', icon: 'ti-trophy', colorClass: 'icon-yellow', descKey: 'adminMenu.championshipsDesc' },
      { tab: 'arena', labelKey: 'adminMenu.arena', icon: 'ti-device-gamepad-2', colorClass: 'icon-pink', descKey: 'adminMenu.arenaDesc' },
      { tab: 'bets', labelKey: 'adminMenu.bets', icon: 'ti-currency-dollar', colorClass: 'icon-gold', descKey: 'adminMenu.betsDesc' },
    ],
  },
  {
    sectionKey: 'adminMenu.financeSection',
    items: [
      { tab: 'deposits', labelKey: 'adminMenu.deposits', icon: 'ti-wallet', colorClass: 'icon-green', descKey: 'adminMenu.depositsDesc' },
      { tab: 'withdrawals', labelKey: 'adminMenu.withdrawals', icon: 'ti-credit-card', colorClass: 'icon-orange', descKey: 'adminMenu.withdrawalsDesc' },
      { tab: 'recharge-agents', labelKey: 'adminMenu.rechargeAgents', icon: 'ti-refresh', colorClass: 'icon-blue', descKey: 'adminMenu.rechargeAgentsDesc' },
      { tab: 'withdrawal-codes', labelKey: 'adminMenu.withdrawalCodes', icon: 'ti-key', colorClass: 'icon-purple', descKey: 'adminMenu.withdrawalCodesDesc' },
      { tab: 'payment-methods', labelKey: 'adminMenu.paymentMethods', icon: 'ti-building-bank', colorClass: 'icon-cyan', descKey: 'adminMenu.paymentMethodsDesc' },
      { tab: 'promo-codes', labelKey: 'adminMenu.promoCodes', icon: 'ti-ticket', colorClass: 'icon-pink', descKey: 'adminMenu.promoCodesDesc' },
      { tab: 'monetization', labelKey: 'adminMenu.monetization', icon: 'ti-coin', colorClass: 'icon-gold', descKey: 'adminMenu.monetizationDesc' },
    ],
  },
  {
    sectionKey: 'adminMenu.verificationSection',
    items: [
      { tab: 'certifications', labelKey: 'adminMenu.certifications', icon: 'ti-certificate', colorClass: 'icon-blue', descKey: 'adminMenu.certificationsDesc' },
      { tab: 'certification-requests', labelKey: 'adminMenu.certificationRequests', icon: 'ti-file-check', colorClass: 'icon-orange', descKey: 'adminMenu.certificationRequestsDesc' },
      { tab: 'agent-requests', labelKey: 'adminMenu.agentRequests', icon: 'ti-user-check', colorClass: 'icon-green', descKey: 'adminMenu.agentRequestsDesc' },
    ],
  },
  {
    sectionKey: 'adminMenu.federationsSection',
    items: [
      { tab: 'federations', labelKey: 'adminMenu.federations', icon: 'ti-world', colorClass: 'icon-purple', descKey: 'adminMenu.federationsDesc' },
      { tab: 'ballon-dor', labelKey: 'adminMenu.ballonDor', icon: 'ti-award', colorClass: 'icon-gold', descKey: 'adminMenu.ballonDorDesc' },
    ],
  },
];

const allItems = computed(() => menuSections.flatMap(s => s.items));

const currentPageItem = computed(() =>
  allItems.value.find(i => i.tab === activeTab.value)
);

const currentPageLabel = computed(() =>
  currentPageItem.value ? t(currentPageItem.value.labelKey) : t('adminMenu.overview')
);

const formattedDate = computed(() => {
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  }).format(new Date());
});

const navigate = (tab: string) => {
  activeTab.value = tab;
  if (isMobile.value) sidebarOpen.value = false;
};

const handleLogout = () => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user_role');
  localStorage.removeItem('user_name');
  router.push('/login');
};

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768;
  if (isMobile.value) sidebarOpen.value = false;
};

watch(activeTab, (tab) => { window.location.hash = tab; });

onMounted(() => {
  const hash = window.location.hash.replace('#', '');
  if (hash) activeTab.value = hash;
  checkMobile();
  window.addEventListener('resize', checkMobile);
});

onUnmounted(() => window.removeEventListener('resize', checkMobile));
</script>

<style scoped>
/* ── Root ── */
.dash-root {
  display: flex;
  min-height: 100vh;
  background: #060b1e;
  font-family: 'Inter', sans-serif;
  position: relative;
  width: 100%;
  max-width: 100vw;
  overflow-x: hidden;
}

/* ── Overlay mobile ── */
.dash-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.6);
  z-index: 998;
}

/* ── SIDEBAR ── */
.dash-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 64px;
  background: linear-gradient(180deg, #0d1630 0%, #070c1e 100%);
  border-right: 1px solid rgba(255,255,255,.06);
  display: flex;
  flex-direction: column;
  transition: width .3s cubic-bezier(.4,0,.2,1);
  z-index: 999;
  overflow: hidden;
}

.dash-sidebar.is-open {
  width: 260px;
}

/* Brand */
.sb-brand {
  display: flex;
  align-items: center;
  gap: .875rem;
  padding: 1.25rem 1rem;
  border-bottom: 1px solid rgba(255,255,255,.06);
  min-height: 72px;
  flex-shrink: 0;
}

.sb-logo {
  width: 40px;
  height: 40px;
  min-width: 40px;
  background: linear-gradient(135deg, #ff9f00 0%, #ff6b00 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: #fff;
  box-shadow: 0 4px 15px rgba(255,159,0,.35);
}

.sb-brand-text {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  white-space: nowrap;
}

.sb-name {
  color: #fff;
  font-size: .95rem;
  font-weight: 700;
  letter-spacing: .3px;
}

.sb-role {
  color: rgba(255,255,255,.45);
  font-size: .72rem;
  font-weight: 500;
  letter-spacing: .5px;
  text-transform: uppercase;
}

/* Admin profile mini */
.sb-profile {
  display: flex;
  align-items: center;
  gap: .75rem;
  padding: 1rem 1rem .75rem;
  margin: .5rem .75rem;
  background: rgba(255,255,255,.04);
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,.06);
  overflow: hidden;
  white-space: nowrap;
  flex-shrink: 0;
}

.sb-avatar {
  width: 36px;
  height: 36px;
  min-width: 36px;
  background: linear-gradient(135deg, #febd56 0%, #d98f25 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 1rem;
}

.sb-profile-info {
  display: flex;
  flex-direction: column;
}

.sb-admin-name {
  color: #fff;
  font-size: .82rem;
  font-weight: 600;
}

.sb-admin-tag {
  display: flex;
  align-items: center;
  gap: .35rem;
  color: rgba(255,255,255,.45);
  font-size: .7rem;
}

.sb-dot {
  width: 6px;
  height: 6px;
  background: #22c55e;
  border-radius: 50%;
  display: inline-block;
}

/* Nav */
.sb-nav {
  flex: 1;
  overflow-y: auto;
  padding: .5rem 0;
  scrollbar-width: thin;
  scrollbar-color: rgba(255,255,255,.1) transparent;
}

.sb-nav::-webkit-scrollbar { width: 3px; }
.sb-nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,.1); border-radius: 2px; }

.sb-section {
  padding: 0 .625rem;
  margin-bottom: .25rem;
}

.sb-section-label {
  color: rgba(255,255,255,.3);
  font-size: .65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .08em;
  padding: .75rem .5rem .35rem;
  white-space: nowrap;
}

.sb-item {
  display: flex;
  align-items: center;
  gap: .75rem;
  width: 100%;
  padding: .6rem .625rem;
  background: transparent;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background .18s, transform .18s;
  text-align: left;
  position: relative;
  margin-bottom: 2px;
  white-space: nowrap;
}

.sb-item:hover {
  background: rgba(255,255,255,.06);
}

.sb-item.is-active {
  background: rgba(255,159,0,.12);
}

.sb-item.is-active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 60%;
  background: linear-gradient(180deg, #ff9f00, #ff6b00);
  border-radius: 0 3px 3px 0;
}

.sb-item-icon {
  width: 34px;
  height: 34px;
  min-width: 34px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.05rem;
  transition: transform .2s;
}

.sb-item:hover .sb-item-icon { transform: scale(1.08); }

.sb-item-label {
  color: rgba(255,255,255,.7);
  font-size: .83rem;
  font-weight: 500;
  flex: 1;
  transition: color .18s;
}

.sb-item.is-active .sb-item-label { color: #ff9f00; font-weight: 600; }
.sb-item:hover .sb-item-label { color: rgba(255,255,255,.95); }

.sb-badge {
  background: rgba(255,72,0,.85);
  color: #fff;
  font-size: .6rem;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 20px;
}

/* Footer */
.sb-footer {
  padding: .5rem .625rem 1rem;
  border-top: 1px solid rgba(255,255,255,.06);
  flex-shrink: 0;
}

.sb-logout .sb-item-label { color: rgba(255,80,80,.8); }
.sb-logout:hover .sb-item-label { color: #ff5050; }

/* Icon color variants */
.icon-blue  { background: rgba(96,165,250,.15); color: #60a5fa; }
.icon-purple{ background: rgba(167,139,250,.15); color: #a78bfa; }
.icon-green { background: rgba(34,197,94,.15);  color: #22c55e; }
.icon-yellow{ background: rgba(250,204,21,.15);  color: #facc15; }
.icon-orange{ background: rgba(251,146,60,.15);  color: #fb923c; }
.icon-red   { background: rgba(239,68,68,.15);   color: #ef4444; }
.icon-pink  { background: rgba(236,72,153,.15);  color: #ec4899; }
.icon-cyan  { background: rgba(34,211,238,.15);  color: #22d3ee; }
.icon-gold  { background: rgba(255,159,0,.15);   color: #ff9f00; }

/* ── MAIN ── */
.dash-main {
  flex: 1;
  margin-left: 64px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-width: 0;
  width: calc(100% - 64px);
  transition: margin-left .3s cubic-bezier(.4,0,.2,1);
}

.dash-main.sidebar-expanded {
  margin-left: 260px;
  width: calc(100% - 260px);
}

/* ── TOPBAR ── */
.dash-topbar {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  height: 64px;
  background: rgba(7,12,30,.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255,255,255,.06);
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.topbar-toggle {
  width: 38px;
  height: 38px;
  background: rgba(255,255,255,.06);
  border: 1px solid rgba(255,255,255,.08);
  border-radius: 9px;
  color: rgba(255,255,255,.7);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.1rem;
  transition: background .18s, color .18s;
}

.topbar-toggle:hover {
  background: rgba(255,255,255,.12);
  color: #fff;
}

.topbar-breadcrumb {
  display: flex;
  align-items: center;
  gap: .4rem;
}

.breadcrumb-parent {
  color: rgba(255,255,255,.35);
  font-size: .82rem;
}

.breadcrumb-sep {
  color: rgba(255,255,255,.2);
  font-size: .75rem;
}

.breadcrumb-current {
  color: rgba(255,255,255,.85);
  font-size: .82rem;
  font-weight: 600;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: .75rem;
}

.topbar-search {
  display: flex;
  align-items: center;
  gap: .5rem;
  background: rgba(255,255,255,.05);
  border: 1px solid rgba(255,255,255,.08);
  border-radius: 10px;
  padding: .45rem .85rem;
  color: rgba(255,255,255,.4);
  font-size: .85rem;
}

.topbar-search input {
  background: transparent;
  border: none;
  outline: none;
  color: rgba(255,255,255,.8);
  font-size: .82rem;
  width: 160px;
}

.topbar-search input::placeholder { color: rgba(255,255,255,.3); }

.topbar-icon-btn {
  width: 38px;
  height: 38px;
  background: rgba(255,255,255,.05);
  border: 1px solid rgba(255,255,255,.08);
  border-radius: 9px;
  color: rgba(255,255,255,.6);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.1rem;
  transition: background .18s, color .18s;
  position: relative;
}

.topbar-icon-btn:hover { background: rgba(255,255,255,.1); color: #fff; }

.notif-dot {
  position: absolute;
  top: 7px;
  right: 7px;
  width: 7px;
  height: 7px;
  background: #ff9f00;
  border-radius: 50%;
  border: 2px solid #070c1e;
}

.topbar-divider {
  width: 1px;
  height: 28px;
  background: rgba(255,255,255,.1);
}

.topbar-user {
  display: flex;
  align-items: center;
  gap: .6rem;
}

.topbar-avatar {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #ff9f00, #ff6b00);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 1rem;
}

.topbar-user-info {
  display: flex;
  flex-direction: column;
}

.topbar-user-name {
  color: #fff;
  font-size: .82rem;
  font-weight: 600;
  line-height: 1.2;
}

.topbar-user-role {
  color: rgba(255,255,255,.4);
  font-size: .7rem;
  line-height: 1.2;
}

/* ── Page header ── */
.dash-page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 2rem 1rem;
  border-bottom: 1px solid rgba(255,255,255,.05);
}

.page-header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.page-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  flex-shrink: 0;
}

.page-title {
  color: #fff;
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0 0 .1rem;
  line-height: 1.2;
}

.page-sub {
  color: rgba(255,255,255,.4);
  font-size: .8rem;
  margin: 0;
}

.page-date {
  color: rgba(255,255,255,.35);
  font-size: .78rem;
  text-transform: capitalize;
}

/* ── Content ── */
.dash-content {
  flex: 1;
  padding: 1.5rem 2rem 2rem;
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 0;
  min-width: 0;
  max-width: 100%;
}

/* Tables admin : défilement horizontal + colonne Actions fixée à droite */
.dash-content :deep(.pay_method__paymethod) {
  min-width: 0;
  max-width: 100%;
}

.dash-content :deep(.pay_method__table) {
  min-width: 0;
  max-width: 100%;
}

.dash-content :deep(.pay_method__table-scrollbar) {
  width: 100%;
  max-width: 100%;
  overflow-x: auto;
  overflow-y: visible;
  -webkit-overflow-scrolling: touch;
  scrollbar-color: rgba(255, 159, 0, 0.45) rgba(255, 255, 255, 0.06);
  scrollbar-width: thin;
}

.dash-content :deep(.pay_method__table-scrollbar::-webkit-scrollbar) {
  height: 8px;
}

.dash-content :deep(.pay_method__table-scrollbar::-webkit-scrollbar-thumb) {
  background: rgba(255, 159, 0, 0.45);
  border-radius: 999px;
}

.dash-content :deep(.pay_method__table-scrollbar::-webkit-scrollbar-track) {
  background: rgba(255, 255, 255, 0.06);
  border-radius: 999px;
}

.dash-content :deep(.pay_method__table-scrollbar table) {
  min-width: 1100px;
  width: max-content;
}

.dash-content :deep(.pay_method__table-scrollbar th:last-child),
.dash-content :deep(.pay_method__table-scrollbar td:last-child) {
  position: sticky;
  right: 0;
  z-index: 2;
  background: rgb(24, 24, 27);
  box-shadow: -6px 0 12px rgba(0, 0, 0, 0.35);
}

.dash-content :deep(.pay_method__table-scrollbar thead th:last-child) {
  z-index: 3;
}

/* ── Fade-slide transition ── */
.fade-slide-enter-active, .fade-slide-leave-active { transition: opacity .2s, transform .2s; }
.fade-slide-enter-from, .fade-slide-leave-to { opacity: 0; transform: translateX(-6px); }

/* ── Responsive ── */
@media (max-width: 900px) {
  .topbar-search { display: none; }
  .topbar-user-info { display: none; }
  .dash-page-header { padding: 1rem 1.25rem; }
  .dash-content { padding: 1rem 1.25rem; }
}

@media (max-width: 768px) {
  .dash-sidebar {
    transform: translateX(-100%);
  }
  .dash-sidebar.is-open {
    transform: translateX(0);
    width: 260px;
  }
  .dash-main {
    margin-left: 0 !important;
    width: 100%;
  }
  .page-date { display: none; }
}
</style>
