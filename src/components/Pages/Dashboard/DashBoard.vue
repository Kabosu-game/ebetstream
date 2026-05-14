<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/vue";
import { useI18n } from "vue-i18n";
import apiClient from "@/utils/axios";
import ProfileComponent from "@/components/Pages/Dashboard/Profile.vue";

const { t } = useI18n();

// --- Deposit Logic ---
const depositMethod = ref("crypto"); // crypto | cash
const amount = ref("");
const transactionHash = ref("");
const loading = ref(false);
const message = ref("");
const messageType = ref(""); // success | error

// Payment methods from API
const depositMethods = ref<any[]>([]);
const withdrawalMethods = ref<any[]>([]);
const loadingPaymentMethods = ref(false);
const selectedCryptoMethod = ref<any>(null);

// --- Recharge Agents Logic ---
const rechargeAgents = ref<any[]>([]);
const loadingAgents = ref(false);

// --- Withdrawal Logic ---
const withdrawalAmount = ref("");
const selectedWithdrawalAgent = ref<any>(null);
const withdrawalAgents = ref<any[]>([]);
const loadingWithdrawalAgents = ref(false);
const withdrawalLoading = ref(false);
const withdrawalMessage = ref("");
const withdrawalMessageType = ref("");
const generatedWithdrawalCode = ref<any>(null);
const showWithdrawalCode = ref(false);

// Submit deposit function
const submitDeposit = async () => {
  try {
    loading.value = true;
    message.value = "";

    // Client-side validation
    const minAmount = selectedCryptoMethod.value?.min_amount || 5;
    const maxAmount = selectedCryptoMethod.value?.max_amount || 10000;

    if (!amount.value || parseFloat(amount.value) < minAmount || parseFloat(amount.value) > maxAmount) {
      message.value = t('dashboard.amountBetween', { min: minAmount, max: maxAmount });
      messageType.value = "error";
      loading.value = false;
      return;
    }

    if (depositMethod.value === "crypto") {
      if (!selectedCryptoMethod.value) {
        message.value = t('dashboard.selectCryptoMethod');
        messageType.value = "error";
        loading.value = false;
        return;
      }
      if (!transactionHash.value) {
      message.value = t('dashboard.transactionHashRequired');
      messageType.value = "error";
      loading.value = false;
      return;
      }
    }

    // Prepare data
    const depositData: any = {
      deposit_method: depositMethod.value,
      amount: parseFloat(amount.value),
    };

    if (depositMethod.value === "crypto") {
      if (!selectedCryptoMethod.value) {
        message.value = t('dashboard.selectCryptoMethod');
        messageType.value = "error";
        loading.value = false;
        return;
      }
      depositData.crypto_name = selectedCryptoMethod.value.name;
      depositData.transaction_hash = transactionHash.value;
    }

    // Send request
    const token = localStorage.getItem("auth_token");
    const response = await apiClient.post(
      "/deposits",
      depositData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.success) {
      message.value = t('dashboard.depositSubmitted');
      messageType.value = "success";

      // Reset form
      amount.value = "";
      transactionHash.value = "";
    }
  } catch (error: any) {
    console.error("Deposit error:", error);

    if (error.response?.data?.errors) {
      const errors = error.response.data.errors;
      message.value = Object.values(errors).flat().join(", ");
    } else {
      message.value = error.response?.data?.message || "An error occurred";
    }
    messageType.value = "error";
  } finally {
    loading.value = false;
  }
};

// Copy crypto address
const copyAddress = (address: string) => {
  navigator.clipboard.writeText(address);
  alert(t('dashboard.addressCopied'));
};

// Load payment methods
const loadPaymentMethods = async () => {
  try {
    loadingPaymentMethods.value = true;
    const [depositsResponse, withdrawalsResponse] = await Promise.all([
      apiClient.get('/payment-methods', { params: { type: 'deposit', is_active: true } }),
      apiClient.get('/payment-methods', { params: { type: 'withdrawal', is_active: true } })
    ]);

    if (depositsResponse.data.success) {
      depositMethods.value = depositsResponse.data.data || [];
      // Set default selected crypto method if available
      const defaultCrypto = depositMethods.value.find((m: any) => m.method_key === 'crypto');
      if (defaultCrypto) {
        selectedCryptoMethod.value = defaultCrypto;
      }
    }

    if (withdrawalsResponse.data.success) {
      withdrawalMethods.value = withdrawalsResponse.data.data || [];
    }
  } catch (error: any) {
    console.error('Error loading payment methods:', error);
    // Fallback to default methods if API fails
    depositMethods.value = [{
      id: 1,
      name: 'USDT (TRC20)',
      crypto_network: 'TRON',
      crypto_address: 'TSf7x19gfn72Jk4Ah4RWVYuGxvYt5HMWqc',
      method_key: 'crypto',
    }];
    withdrawalMethods.value = [
      { id: 1, name: 'USDT (TRC20)', method_key: 'crypto' },
      { id: 2, name: 'USDT (ERC20)', method_key: 'crypto' },
      { id: 3, name: 'Bitcoin (BTC)', method_key: 'crypto' },
      { id: 4, name: 'Ethereum (ETH)', method_key: 'crypto' },
      { id: 5, name: 'Virement Bancaire', method_key: 'bank_transfer' },
      { id: 6, name: 'MTN Mobile Money', method_key: 'mobile_money', mobile_money_provider: 'MTN' },
      { id: 7, name: 'Orange Money', method_key: 'mobile_money', mobile_money_provider: 'Orange' },
      { id: 8, name: 'Moov Money', method_key: 'mobile_money', mobile_money_provider: 'Moov' },
    ];
  } finally {
    loadingPaymentMethods.value = false;
  }
};

// Load recharge agents
const loadRechargeAgents = async () => {
  try {
    loadingAgents.value = true;
    const token = localStorage.getItem("auth_token");
    const response = await apiClient.get(
      "/recharge-agents",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.success) {
      rechargeAgents.value = response.data.data || [];
    }
    return Promise.resolve();
  } catch (error: any) {
    console.error("Error loading recharge agents:", error);
    // Mock data for development
    rechargeAgents.value = [
      {
        id: 1,
        agent_id: "811938",
        name: "Glen Dempsey",
        phone: "+2234498",
        description: "Available 24/7",
      },
      {
        id: 2,
        agent_id: "234567",
        name: "Douala Agent",
        phone: "+237987654321",
        description: "Douala area and surroundings",
      },
    ];
    return Promise.resolve();
  } finally {
    loadingAgents.value = false;
  }
};

// Redirect to WhatsApp
const contactAgent = (agent: any) => {
  // Format phone number (remove spaces and special characters)
  const phone = agent.phone.replace(/\D/g, "");
  // Create WhatsApp link
  const whatsappUrl = `https://wa.me/${phone}`;
  // Open in new tab
  window.open(whatsappUrl, "_blank");
};

// --- Withdrawal Functions ---

// Load withdrawal agents
const loadWithdrawalAgents = async () => {
  try {
    loadingWithdrawalAgents.value = true;

    // Utiliser les mêmes agents que la section dépôt
    withdrawalAgents.value = rechargeAgents.value;
  } catch (error: any) {
    console.error("Error loading withdrawal agents:", error);
    // Use same agents as recharge agents for fallback
    withdrawalAgents.value = rechargeAgents.value;
  } finally {
    loadingWithdrawalAgents.value = false;
  }
};

// Convertir XAF en USD (taux approximatif: 1 USD = 600 XAF)
const convertToUSD = (xafAmount: number) => {
  return xafAmount / 600;
};

// Generate withdrawal code
const generateWithdrawalCode = async () => {
  try {
    withdrawalLoading.value = true;
    withdrawalMessage.value = "";

    const amountInEBT = parseFloat(withdrawalAmount.value);

    if (!withdrawalAmount.value || amountInEBT < 1) {
      withdrawalMessage.value = "Minimum withdrawal amount is 1 EBT";
      withdrawalMessageType.value = "error";
      return;
    }

    if (!selectedWithdrawalAgent.value) {
      withdrawalMessage.value = "Please select an agent";
      withdrawalMessageType.value = "error";
      return;
    }

    if (amountInEBT > walletBalance.value) {
      withdrawalMessage.value = `Insufficient balance. Available: ${formatNumber(walletBalance.value)} EBT`;
      withdrawalMessageType.value = "error";
      return;
    }

    const token = localStorage.getItem("auth_token");
    const response = await apiClient.post(
      "/withdrawal-codes",
      {
        amount: amountInEBT,
        recharge_agent_id: selectedWithdrawalAgent.value.id,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.success) {
      generatedWithdrawalCode.value = response.data.data;
      // Convertir le montant en USD pour l'affichage
      generatedWithdrawalCode.value.amountEBT = amountInEBT;
      showWithdrawalCode.value = true;
      withdrawalMessage.value = "Withdrawal code generated successfully!";
      withdrawalMessageType.value = "success";

      // Reset form
      withdrawalAmount.value = "";
      selectedWithdrawalAgent.value = null;
    }
  } catch (error: any) {
    console.error("Error generating withdrawal code:", error);
    withdrawalMessage.value = error.response?.data?.message || "Error generating withdrawal code";
    withdrawalMessageType.value = "error";
  } finally {
    withdrawalLoading.value = false;
  }
};

// Copy withdrawal code to clipboard
const copyWithdrawalCode = async (code: string) => {
  try {
    await navigator.clipboard.writeText(code);
    // Show success feedback
    const button = document.getElementById('copy-code-btn');
    if (button) {
      button.textContent = 'Copied!';
      setTimeout(() => {
        button.textContent = 'Copy Code';
      }, 2000);
    }
  } catch (error) {
    console.error('Failed to copy code:', error);
  }
};

// --- Withdrawal Logic ---
const withdrawalMethod = ref("crypto"); // crypto | bank_transfer | mobile_money
const cryptoName = ref("");
const cryptoAddress = ref("");
const bankName = ref("");
const accountNumber = ref("");
const accountHolderName = ref("");
const mobileMoneyProvider = ref("");
const mobileMoneyNumber = ref("");
const walletBalance = ref(0);
const loadingWallet = ref(false);

// Get available crypto options from API
const cryptoOptions = computed(() => {
  return withdrawalMethods.value
    .filter((m: any) => m.method_key === 'crypto')
    .map((m: any) => ({ name: m.name, value: m.name }));
});

// Get available mobile money providers from API
const mobileMoneyProviders = computed(() => {
  return withdrawalMethods.value
    .filter((m: any) => m.method_key === 'mobile_money')
    .map((m: any) => ({
      name: m.name,
      value: m.mobile_money_provider || m.name
    }));
});

// Load wallet balance
const loadWallet = async () => {
  try {
    loadingWallet.value = true;
    const token = localStorage.getItem("auth_token");
    const response = await apiClient.get(
      "/wallet",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.success) {
      // Use available_balance if provided, otherwise use balance
      // Ensure balance is never negative
      const balance = parseFloat(response.data.data.available_balance ?? response.data.data.balance) || 0;
      walletBalance.value = Math.max(0, balance);
    }
  } catch (error: any) {
    console.error("Error loading wallet:", error);
  } finally {
    loadingWallet.value = false;
  }
};

// Submit withdrawal function
const submitWithdrawal = async () => {
  try {
    withdrawalLoading.value = true;
    withdrawalMessage.value = "";

    // Get limits from selected method
    let minAmount = 10;
    let maxAmount = 50000;

    if (withdrawalMethod.value === "crypto" && cryptoName.value) {
      const method = withdrawalMethods.value.find((m: any) =>
        m.method_key === 'crypto' && m.name === cryptoName.value
      );
      if (method) {
        minAmount = method.min_amount || 10;
        maxAmount = method.max_amount || 50000;
      }
    } else if (withdrawalMethod.value === "bank_transfer") {
      const method = withdrawalMethods.value.find((m: any) => m.method_key === 'bank_transfer');
      if (method) {
        minAmount = method.min_amount || 50;
        maxAmount = method.max_amount || 50000;
      }
    } else if (withdrawalMethod.value === "mobile_money" && mobileMoneyProvider.value) {
      const method = withdrawalMethods.value.find((m: any) =>
        m.method_key === 'mobile_money' && m.mobile_money_provider === mobileMoneyProvider.value
      );
      if (method) {
        minAmount = method.min_amount || 10;
        maxAmount = method.max_amount || 5000;
      }
    }

    // Client-side validation
    if (!withdrawalAmount.value || parseFloat(withdrawalAmount.value) < minAmount || parseFloat(withdrawalAmount.value) > maxAmount) {
      withdrawalMessage.value = t('dashboard.amountBetween', { min: minAmount, max: maxAmount });
      withdrawalMessageType.value = "error";
      withdrawalLoading.value = false;
      return;
    }

    if (parseFloat(withdrawalAmount.value) > walletBalance.value) {
      withdrawalMessage.value = t('dashboard.insufficientBalance');
      withdrawalMessageType.value = "error";
      withdrawalLoading.value = false;
      return;
    }

    // Method-specific validation
    if (withdrawalMethod.value === "crypto") {
      if (!cryptoName.value || !cryptoAddress.value) {
        withdrawalMessage.value = t('dashboard.cryptoNameRequired');
        withdrawalMessageType.value = "error";
        withdrawalLoading.value = false;
        return;
      }
    } else if (withdrawalMethod.value === "bank_transfer") {
      if (!bankName.value || !accountNumber.value || !accountHolderName.value) {
        withdrawalMessage.value = t('dashboard.bankDetailsRequired');
        withdrawalMessageType.value = "error";
        withdrawalLoading.value = false;
        return;
      }
    } else if (withdrawalMethod.value === "mobile_money") {
      if (!mobileMoneyProvider.value || !mobileMoneyNumber.value) {
        withdrawalMessage.value = t('dashboard.mobileMoneyRequired');
        withdrawalMessageType.value = "error";
        withdrawalLoading.value = false;
        return;
      }
    }

    // Prepare data
    const withdrawalData: any = {
      withdrawal_method: withdrawalMethod.value,
      amount: parseFloat(withdrawalAmount.value),
    };

    if (withdrawalMethod.value === "crypto") {
      withdrawalData.crypto_name = cryptoName.value;
      withdrawalData.crypto_address = cryptoAddress.value;
    } else if (withdrawalMethod.value === "bank_transfer") {
      withdrawalData.bank_name = bankName.value;
      withdrawalData.account_number = accountNumber.value;
      withdrawalData.account_holder_name = accountHolderName.value;
    } else if (withdrawalMethod.value === "mobile_money") {
      withdrawalData.mobile_money_provider = mobileMoneyProvider.value;
      withdrawalData.mobile_money_number = mobileMoneyNumber.value;
    }

    // Send request
    const token = localStorage.getItem("auth_token");
    const response = await apiClient.post(
      "/withdrawals",
      withdrawalData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.success) {
      withdrawalMessage.value = t('dashboard.withdrawalSubmitted');
      withdrawalMessageType.value = "success";

      // Reset form
      withdrawalAmount.value = "";
      cryptoName.value = "";
      cryptoAddress.value = "";
      bankName.value = "";
      accountNumber.value = "";
      accountHolderName.value = "";
      mobileMoneyProvider.value = "";
      mobileMoneyNumber.value = "";

      // Reload wallet balance
      await loadWallet();
    }
  } catch (error: any) {
    console.error("Withdrawal error:", error);

    if (error.response?.data?.errors) {
      const errors = error.response.data.errors;
      withdrawalMessage.value = Object.values(errors).flat().join(", ");
    } else {
      withdrawalMessage.value = error.response?.data?.message || "An error occurred";
    }
    withdrawalMessageType.value = "error";
  } finally {
    withdrawalLoading.value = false;
  }
};

// Transaction history
const transactionHistory = ref<any[]>([]);
const loadingHistory = ref(false);

// Betting history
const bettingHistory = ref<any[]>([]);
const loadingBets = ref(false);

// Load betting history
const loadBettingHistory = async () => {
  try {
    loadingBets.value = true;
    // Try to load bets from API
    try {
      const response = await apiClient.get("/bets");
      if (response.data.success) {
        bettingHistory.value = response.data.data || [];
      }
    } catch (error: any) {
      // If bets endpoint doesn't exist, try transactions with type 'bet'
      try {
        const response = await apiClient.get("/transactions");
        if (response.data.success) {
          bettingHistory.value = (response.data.data || []).filter((t: any) =>
            t.type === 'bet' || t.type === 'win' || t.type === 'loss'
          );
        }
      } catch (err) {
        console.error("Error loading betting history:", err);
        bettingHistory.value = [];
      }
    }
  } catch (error: any) {
    console.error("Error loading betting history:", error);
    bettingHistory.value = [];
  } finally {
    loadingBets.value = false;
  }
};

// Load transaction history (deposits + withdrawals)
const loadTransactionHistory = async () => {
  try {
    loadingHistory.value = true;
    const token = localStorage.getItem("auth_token");

    // Load deposits and withdrawals in parallel
    const [depositsResponse, withdrawalsResponse] = await Promise.all([
      apiClient.get("/deposits", {
        headers: { Authorization: `Bearer ${token}` }
      }),
      apiClient.get("/withdrawals", {
        headers: { Authorization: `Bearer ${token}` }
      })
    ]);

    const deposits = depositsResponse.data.success ? depositsResponse.data.data || [] : [];
    const withdrawals = withdrawalsResponse.data.success ? withdrawalsResponse.data.data || [] : [];

    // Combine and sort by date
    const combined = [
      ...deposits.map((d: any) => ({ ...d, type: 'deposit' })),
      ...withdrawals.map((w: any) => ({ ...w, type: 'withdrawal' }))
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    transactionHistory.value = combined;
  } catch (error: any) {
    console.error("Error loading transaction history:", error);
    transactionHistory.value = [];
  } finally {
    loadingHistory.value = false;
  }
};

// Helper functions
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getMethodLabel = (transaction: any) => {
  if (transaction.type === 'deposit') {
    return transaction.method === 'crypto'
      ? (transaction.crypto_name || 'Crypto')
      : (transaction.location || 'Cash');
  } else {
    if (transaction.withdrawal_method === 'crypto') {
      return transaction.crypto_name || 'Crypto';
    } else if (transaction.withdrawal_method === 'bank_transfer') {
      return 'Bank Transfer';
    } else if (transaction.withdrawal_method === 'mobile_money') {
      return transaction.mobile_money_provider || 'Mobile Money';
    }
    return transaction.withdrawal_method || 'N/A';
  }
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending: t('common.pending'),
    approved: t('common.approved'),
    rejected: t('common.rejected'),
  };
  return labels[status] || status;
};

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    pending: 'bg-warning',
    approved: 'bg-success',
    rejected: 'bg-danger',
  };
  return classes[status] || 'bg-secondary';
};

const getBetStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    pending: 'bg-warning',
    won: 'bg-success',
    lost: 'bg-danger',
    cancelled: 'bg-secondary',
  };
  return classes[status] || 'bg-secondary';
};

const getBetStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending: t('common.pending'),
    won: t('dashboard.won'),
    lost: t('dashboard.lost'),
    cancelled: t('dashboard.cancelled'),
  };
  return labels[status] || status;
};

const getMatchName = (bet: any) => {
  if (bet.championship_match) {
    const p1 = bet.championship_match.player1?.player_name || 'Joueur 1';
    const p2 = bet.championship_match.player2?.player_name || 'Joueur 2';
    return `${p1} vs ${p2}`;
  }
  if (bet.arena_match) {
    return `${bet.arena_match.team1_name || 'Équipe 1'} vs ${bet.arena_match.team2_name || 'Équipe 2'}`;
  }
  return bet.match_name || 'N/A';
};

const getBetTypeLabel = (betType: string) => {
  const labels: Record<string, string> = {
    team1_win: 'Team 1 Win',
    draw: 'Draw',
    team2_win: 'Team 2 Win',
  };
  return labels[betType] || betType || 'N/A';
};

const getBetOdds = (bet: any) => bet.odds || 'N/A';

const formatNumber = (num: number | string | null | undefined) => {
  if (num === null || num === undefined || num === '') {
    return '0.00';
  }
  const numberValue = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(numberValue)) {
    return '0.00';
  }
  return numberValue.toFixed(2);
};

// Helper functions for withdrawal limits
const getWithdrawalMinAmount = () => {
  if (withdrawalMethod.value === 'crypto' && cryptoName.value) {
    const method = withdrawalMethods.value.find((m: any) =>
      m.method_key === 'crypto' && m.name === cryptoName.value
    );
    return method?.min_amount || 10;
  } else if (withdrawalMethod.value === 'bank_transfer') {
    const method = withdrawalMethods.value.find((m: any) => m.method_key === 'bank_transfer');
    return method?.min_amount || 50;
  } else if (withdrawalMethod.value === 'mobile_money' && mobileMoneyProvider.value) {
    const method = withdrawalMethods.value.find((m: any) =>
      m.method_key === 'mobile_money' && m.mobile_money_provider === mobileMoneyProvider.value
    );
    return method?.min_amount || 10;
  }
  return 10;
};

const getWithdrawalMaxAmount = () => {
  if (withdrawalMethod.value === 'crypto' && cryptoName.value) {
    const method = withdrawalMethods.value.find((m: any) =>
      m.method_key === 'crypto' && m.name === cryptoName.value
    );
    return method?.max_amount || 50000;
  } else if (withdrawalMethod.value === 'bank_transfer') {
    const method = withdrawalMethods.value.find((m: any) => m.method_key === 'bank_transfer');
    return method?.max_amount || 50000;
  } else if (withdrawalMethod.value === 'mobile_money' && mobileMoneyProvider.value) {
    const method = withdrawalMethods.value.find((m: any) =>
      m.method_key === 'mobile_money' && m.mobile_money_provider === mobileMoneyProvider.value
    );
    return method?.max_amount || 5000;
  }
  return 50000;
};

// Load agents and wallet on component mount
onMounted(() => {
  loadPaymentMethods();
  loadRechargeAgents().then(() => {
    // Charger les agents de retrait seulement après que les agents de recharge soient chargés
    loadWithdrawalAgents();
  });
  loadWallet();
  loadTransactionHistory();
  loadBettingHistory();
});
</script>

<template>
  <div class="tw-page">

    <!-- Wallet Balance Card -->
    <div class="db-balance-card">
      <div class="db-balance-card__inner">
        <div class="db-balance-card__icon">
          <i class="fas fa-wallet"></i>
        </div>
        <div class="db-balance-card__info">
          <span class="db-balance-card__label">{{ $t('dashboard.availableBalance') }}</span>
          <span v-if="loadingWallet" class="db-balance-card__value db-balance-card__value--loading">
            <span class="db-spinner db-spinner--sm"></span>
          </span>
          <span v-else class="db-balance-card__value">
            {{ formatNumber(Math.max(0, walletBalance)) }} <em>EBT</em>
          </span>
        </div>
      </div>
    </div>

    <!-- Tab Group -->
    <TabGroup>
      <div class="db-layout">

        <!-- ===== Sidebar Tab List ===== -->
        <div class="db-sidebar">
          <TabList class="tw-tabs tw-tabs--vertical">
            <Tab as="template" v-slot="{ selected }">
              <button class="tw-tab db-tab-btn" :class="{ active: selected }">
                <i class="fas fa-wallet"></i>
                <span>{{ $t('ui.deposit_2') }}</span>
              </button>
            </Tab>

            <Tab as="template" v-slot="{ selected }">
              <button class="tw-tab db-tab-btn" :class="{ active: selected }">
                <i class="fas fa-credit-card"></i>
                <span>{{ $t('dashboard.withdrawal') }}</span>
              </button>
            </Tab>

            <Tab as="template" v-slot="{ selected }">
              <button class="tw-tab db-tab-btn" :class="{ active: selected }">
                <i class="fas fa-user"></i>
                <span>{{ $t('dashboard.balanceHistory') }}</span>
              </button>
            </Tab>

            <Tab as="template" v-slot="{ selected }">
              <button class="tw-tab db-tab-btn" :class="{ active: selected }">
                <i class="fas fa-user"></i>
                <span>{{ $t('dashboard.bettingHistory') }}</span>
              </button>
            </Tab>

            <Tab as="template" v-slot="{ selected }">
              <button class="tw-tab db-tab-btn" :class="{ active: selected }">
                <i class="fas fa-cog"></i>
                <span>{{ $t('ui.profile') }}</span>
              </button>
            </Tab>
          </TabList>
        </div>

        <!-- ===== Tab Panels ===== -->
        <div class="db-content">
          <TabPanels>

            <!-- ======================== -->
            <!--       DEPOSIT PANEL      -->
            <!-- ======================== -->
            <TabPanel>
              <div class="tw-card db-panel-card">

                <!-- Panel title -->
                <div class="db-panel-title">
                  <div class="db-panel-title__icon">
                    <i class="fas fa-wallet"></i>
                  </div>
                  <div>
                    <h2 class="db-panel-title__h">{{ $t('ui.deposit_funds') }}</h2>
                    <p class="db-panel-title__sub">{{ $t('ui.add_funds_to_your_ebetstream_wallet') }}</p>
                  </div>
                </div>

                <!-- Alert -->
                <div v-if="message"
                     class="tw-alert"
                     :class="messageType === 'success' ? 'tw-alert--success' : 'tw-alert--error'">
                  {{ message }}
                </div>

                <!-- Method Toggle: Crypto / Cash -->
                <div class="db-method-toggle db-method-toggle--spaced">
                  <button
                    class="tw-btn"
                    :class="depositMethod === 'crypto' ? 'tw-btn--primary' : 'tw-btn--secondary'"
                    @click="depositMethod = 'crypto'"
                    :disabled="loading"
                  >
                    {{ $t('dashboard.depositViaCrypto') }}
                  </button>
                  <button
                    class="tw-btn"
                    :class="depositMethod === 'cash' ? 'tw-btn--primary' : 'tw-btn--secondary'"
                    @click="depositMethod = 'cash'"
                    :disabled="loading"
                  >
                    {{ $t('dashboard.depositInCash') }}
                  </button>
                </div>

                <div class="tw-divider"></div>

                <!-- ==================== -->
                <!--     CRYPTO FORM      -->
                <!-- ==================== -->
                <div v-if="depositMethod === 'crypto'">

                  <!-- Loading payment methods -->
                  <div v-if="loadingPaymentMethods" class="db-loading-state">
                    <span class="db-spinner"></span>
                    <span class="db-loading-state__text">{{ $t('ui.loading_payment_methods') }}</span>
                  </div>

                  <!-- No crypto methods available -->
                  <div v-else-if="depositMethods.filter((m: any) => m.method_key === 'crypto').length === 0"
                       class="tw-alert tw-alert--error">
                    {{ $t('dashboard.noCryptoMethods') }}
                  </div>

                  <div v-else>
                    <!-- Select Cryptocurrency -->
                    <div class="tw-form-group">
                      <label class="tw-label">{{ $t('dashboard.selectCryptocurrency') }}</label>
                      <select
                        v-model="selectedCryptoMethod"
                        class="tw-select"
                        :disabled="loading"
                      >
                        <option :value="null">{{ $t('dashboard.selectACryptocurrency') }}</option>
                        <option
                          v-for="method in depositMethods.filter((m: any) => m.method_key === 'crypto')"
                          :key="method.id"
                          :value="method"
                        >
                          {{ method.name }}{{ method.crypto_network ? ` (${method.crypto_network})` : '' }}
                        </option>
                      </select>
                    </div>

                    <!-- Amount -->
                    <div v-if="selectedCryptoMethod" class="tw-form-group">
                      <label class="tw-label">{{ $t('dashboard.amount') }}</label>
                      <input
                        v-model="amount"
                        type="number"
                        class="tw-input"
                        :min="selectedCryptoMethod?.min_amount || 5"
                        :max="selectedCryptoMethod?.max_amount || 10000"
                        :placeholder="$t('dashboard.enterAmount')"
                        :disabled="loading"
                      />
                      <span class="db-hint">
                        {{ $t('dashboard.minimum') }}: {{ selectedCryptoMethod?.min_amount || 5 }} K &mdash;
                        {{ $t('dashboard.maximum') }}: {{ selectedCryptoMethod?.max_amount || 10000 }} K
                      </span>
                    </div>

                    <!-- Crypto address card -->
                    <div v-if="selectedCryptoMethod && selectedCryptoMethod.crypto_address"
                         class="db-crypto-card">
                      <div class="db-crypto-card__meta">
                        <span class="db-crypto-card__name">{{ selectedCryptoMethod.name }}</span>
                        <span class="db-crypto-card__network">{{ selectedCryptoMethod.crypto_network || 'Crypto' }}</span>
                      </div>
                      <div class="db-crypto-card__address-row">
                        <span class="db-crypto-card__address">{{ selectedCryptoMethod.crypto_address }}</span>
                        <button
                          class="tw-btn tw-btn--secondary db-crypto-card__copy-btn"
                          @click="copyAddress(selectedCryptoMethod.crypto_address)"
                          type="button"
                        >
                          {{ $t('dashboard.copy') }}
                        </button>
                      </div>
                    </div>

                    <!-- Transaction Hash -->
                    <div class="tw-form-group">
                      <label class="tw-label">{{ $t('dashboard.transactionHash') }}</label>
                      <input
                        v-model="transactionHash"
                        type="text"
                        class="tw-input"
                        :placeholder="$t('dashboard.pasteTransactionHash')"
                        :disabled="loading"
                      />
                    </div>

                    <!-- Review notice -->
                    <div class="db-notice">
                      {{ $t('dashboard.depositReview') }}
                    </div>

                    <!-- Submit -->
                    <button
                      class="tw-btn tw-btn--primary db-submit-btn"
                      @click="submitDeposit"
                      :disabled="loading"
                    >
                      <span v-if="loading" class="db-spinner db-spinner--sm"></span>
                      <span>{{ loading ? $t('dashboard.submitting') : $t('dashboard.submitDeposit') }}</span>
                    </button>
                  </div>
                </div>

                <!-- ==================== -->
                <!--   RECHARGE AGENTS    -->
                <!-- ==================== -->
                <div v-if="depositMethod === 'cash'">
                  <div class="db-section-header">
                    <h4 class="db-section-header__title">{{ $t('dashboard.selectRechargeAgent') }}</h4>
                    <p class="db-section-header__desc">{{ $t('dashboard.clickAgentWhatsApp') }}</p>
                  </div>

                  <!-- Loading -->
                  <div v-if="loadingAgents" class="db-loading-state">
                    <span class="db-spinner"></span>
                    <span class="db-loading-state__text">{{ $t('dashboard.loadingAgents') }}</span>
                  </div>

                  <!-- Agents grid -->
                  <div v-else-if="rechargeAgents.length > 0" class="db-agents-grid">
                    <div
                      v-for="agent in rechargeAgents"
                      :key="agent.id"
                      class="db-agent-card"
                      @click="contactAgent(agent)"
                    >
                      <!-- WhatsApp icon -->
                      <div class="db-agent-card__icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                        </svg>
                      </div>

                      <!-- Agent info -->
                      <div class="db-agent-card__body">
                        <span class="db-agent-card__name">{{ agent.name }}</span>
                        <span class="db-agent-card__id">ID: {{ agent.agent_id }}</span>
                        <span class="db-agent-card__phone">{{ agent.phone }}</span>
                        <span v-if="agent.description" class="db-agent-card__desc">{{ agent.description }}</span>
                      </div>

                      <!-- CTA -->
                      <div class="db-agent-card__cta">
                        <span class="db-agent-card__online-dot"></span>
                        <span class="db-agent-card__cta-label">{{ $t('dashboard.clickToChat') }}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                      </div>
                    </div>
                  </div>

                  <!-- Empty state -->
                  <div v-else class="db-empty-state">
                    <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <h5>{{ $t('dashboard.noAgentsAvailable') }}</h5>
                    <p>{{ $t('dashboard.noAgentsAvailableDesc') }}</p>
                  </div>
                </div>

              </div>
            </TabPanel>

            <!-- ======================== -->
            <!--    WITHDRAWAL PANEL      -->
            <!-- ======================== -->
            <TabPanel>
              <div class="tw-card db-panel-card">

                <!-- Panel title -->
                <div class="db-panel-title">
                  <div class="db-panel-title__icon">
                    <i class="fas fa-credit-card"></i>
                  </div>
                  <div>
                    <h2 class="db-panel-title__h">{{ $t('dashboard.withdrawal') }}</h2>
                    <p class="db-panel-title__sub">{{ $t('ui.withdraw_your_winnings_securely') }}</p>
                  </div>
                </div>

                <!-- Alert -->
                <div v-if="withdrawalMessage"
                     class="tw-alert"
                     :class="withdrawalMessageType === 'success' ? 'tw-alert--success' : 'tw-alert--error'">
                  {{ withdrawalMessage }}
                </div>

                <!-- Method Toggle -->
                <div v-if="loadingPaymentMethods" class="db-loading-state">
                  <span class="db-spinner db-spinner--sm"></span>
                </div>
                <div v-else class="db-method-toggle">
                  <button
                    v-if="withdrawalMethods.filter((m: any) => m.method_key === 'crypto').length > 0"
                    class="tw-btn"
                    :class="withdrawalMethod === 'crypto' ? 'tw-btn--primary' : 'tw-btn--secondary'"
                    @click="withdrawalMethod = 'crypto'"
                    :disabled="withdrawalLoading"
                  >
                    {{ $t('dashboard.crypto') }}
                  </button>

                  <button
                    v-if="withdrawalMethods.filter((m: any) => m.method_key === 'bank_transfer').length > 0"
                    class="tw-btn"
                    :class="withdrawalMethod === 'bank_transfer' ? 'tw-btn--primary' : 'tw-btn--secondary'"
                    @click="withdrawalMethod = 'bank_transfer'"
                    :disabled="withdrawalLoading"
                  >
                    {{ $t('dashboard.bankTransfer') }}
                  </button>

                  <button
                    v-if="withdrawalMethods.filter((m: any) => m.method_key === 'mobile_money').length > 0"
                    class="tw-btn"
                    :class="withdrawalMethod === 'mobile_money' ? 'tw-btn--primary' : 'tw-btn--secondary'"
                    @click="withdrawalMethod = 'mobile_money'"
                    :disabled="withdrawalLoading"
                  >
                    {{ $t('dashboard.mobileMoney') }}
                  </button>

                  <button
                    class="tw-btn"
                    :class="withdrawalMethod === 'agent_withdrawal' ? 'tw-btn--primary' : 'tw-btn--secondary'"
                    @click="withdrawalMethod = 'agent_withdrawal'"
                    :disabled="withdrawalLoading"
                  >
                    Agent Withdrawal
                  </button>
                </div>

                <div class="tw-divider"></div>

                <!-- ==================== -->
                <!--     CRYPTO FORM      -->
                <!-- ==================== -->
                <div v-if="withdrawalMethod === 'crypto'">
                  <div v-if="cryptoOptions.length === 0" class="tw-alert tw-alert--error">
                    {{ $t('dashboard.noCryptoWithdrawal') }}
                  </div>
                  <div v-else>
                    <div class="tw-form-group">
                      <label class="tw-label">{{ $t('dashboard.amount') }}</label>
                      <input
                        v-model="withdrawalAmount"
                        type="number"
                        class="tw-input"
                        :min="getWithdrawalMinAmount()"
                        :max="getWithdrawalMaxAmount()"
                        :placeholder="$t('dashboard.enterAmount')"
                        :disabled="withdrawalLoading"
                      />
                      <span class="db-hint">
                        {{ $t('dashboard.minimum') }}: {{ getWithdrawalMinAmount() }} K &mdash;
                        {{ $t('dashboard.maximum') }}: {{ getWithdrawalMaxAmount() }} K
                      </span>
                    </div>

                    <div class="tw-form-group">
                      <label class="tw-label">{{ $t('dashboard.cryptoName') }}</label>
                      <select v-model="cryptoName" class="tw-select" :disabled="withdrawalLoading">
                        <option value="">{{ $t('dashboard.selectCryptocurrency') }}</option>
                        <option v-for="crypto in cryptoOptions" :key="crypto.value" :value="crypto.value">
                          {{ crypto.name }}
                        </option>
                      </select>
                    </div>

                    <div class="tw-form-group">
                      <label class="tw-label">{{ $t('dashboard.walletAddress') }}</label>
                      <input
                        v-model="cryptoAddress"
                        type="text"
                        class="tw-input"
                        :placeholder="$t('dashboard.enterCryptoAddress')"
                        :disabled="withdrawalLoading"
                      />
                      <span class="db-hint">{{ $t('dashboard.addressWarning') }}</span>
                    </div>

                    <div class="db-notice">{{ $t('dashboard.withdrawalReview') }}</div>

                    <button
                      class="tw-btn tw-btn--primary db-submit-btn"
                      @click="submitWithdrawal"
                      :disabled="withdrawalLoading || parseFloat(withdrawalAmount) > walletBalance"
                    >
                      <span v-if="withdrawalLoading" class="db-spinner db-spinner--sm"></span>
                      <span>{{ withdrawalLoading ? $t('dashboard.submitting') : $t('dashboard.submitWithdrawalRequest') }}</span>
                    </button>
                  </div>
                </div>

                <!-- ==================== -->
                <!--    BANK TRANSFER     -->
                <!-- ==================== -->
                <div v-if="withdrawalMethod === 'bank_transfer'">
                  <div class="tw-form-group">
                    <label class="tw-label">{{ $t('dashboard.amount') }}</label>
                    <input
                      v-model="withdrawalAmount"
                      type="number"
                      class="tw-input"
                      :min="getWithdrawalMinAmount()"
                      :max="getWithdrawalMaxAmount()"
                      :placeholder="$t('dashboard.enterAmount')"
                      :disabled="withdrawalLoading"
                    />
                    <span class="db-hint">
                      {{ $t('dashboard.minimum') }}: {{ getWithdrawalMinAmount() }} K &mdash;
                      {{ $t('dashboard.maximum') }}: {{ getWithdrawalMaxAmount() }} K
                    </span>
                  </div>

                  <div class="tw-form-group">
                    <label class="tw-label">{{ $t('dashboard.bankName') }}</label>
                    <input
                      v-model="bankName"
                      type="text"
                      class="tw-input"
                      :placeholder="$t('dashboard.enterBankName')"
                      :disabled="withdrawalLoading"
                    />
                  </div>

                  <div class="tw-form-group">
                    <label class="tw-label">{{ $t('dashboard.accountNumber') }}</label>
                    <input
                      v-model="accountNumber"
                      type="text"
                      class="tw-input"
                      :placeholder="$t('dashboard.enterAccountNumber')"
                      :disabled="withdrawalLoading"
                    />
                  </div>

                  <div class="tw-form-group">
                    <label class="tw-label">{{ $t('dashboard.accountHolderName') }}</label>
                    <input
                      v-model="accountHolderName"
                      type="text"
                      class="tw-input"
                      :placeholder="$t('dashboard.enterAccountHolderName')"
                      :disabled="withdrawalLoading"
                    />
                  </div>

                  <div class="db-notice">{{ $t('dashboard.withdrawalReviewBank') }}</div>

                  <button
                    class="tw-btn tw-btn--primary db-submit-btn"
                    @click="submitWithdrawal"
                    :disabled="withdrawalLoading || parseFloat(withdrawalAmount) > walletBalance"
                  >
                    <span v-if="withdrawalLoading" class="db-spinner db-spinner--sm"></span>
                    <span>{{ withdrawalLoading ? $t('dashboard.submitting') : $t('dashboard.submitWithdrawalRequest') }}</span>
                  </button>
                </div>

                <!-- ==================== -->
                <!--    MOBILE MONEY      -->
                <!-- ==================== -->
                <div v-if="withdrawalMethod === 'mobile_money'">
                  <div class="tw-form-group">
                    <label class="tw-label">{{ $t('dashboard.amount') }}</label>
                    <input
                      v-model="withdrawalAmount"
                      type="number"
                      class="tw-input"
                      :min="getWithdrawalMinAmount()"
                      :max="getWithdrawalMaxAmount()"
                      :placeholder="$t('dashboard.enterAmount')"
                      :disabled="withdrawalLoading"
                    />
                    <span class="db-hint">
                      {{ $t('dashboard.minimum') }}: {{ getWithdrawalMinAmount() }} K &mdash;
                      {{ $t('dashboard.maximum') }}: {{ getWithdrawalMaxAmount() }} K
                    </span>
                  </div>

                  <div class="tw-form-group">
                    <label class="tw-label">{{ $t('dashboard.mobileMoneyProvider') }}</label>
                    <select
                      v-model="mobileMoneyProvider"
                      class="tw-select"
                      :disabled="withdrawalLoading"
                    >
                      <option value="">{{ $t('dashboard.selectProvider') }}</option>
                      <option v-for="provider in mobileMoneyProviders" :key="provider.value" :value="provider.value">
                        {{ provider.name }}
                      </option>
                    </select>
                  </div>

                  <div class="tw-form-group">
                    <label class="tw-label">{{ $t('dashboard.mobileMoneyNumber') }}</label>
                    <input
                      v-model="mobileMoneyNumber"
                      type="text"
                      class="tw-input"
                      :placeholder="$t('dashboard.enterMobileMoneyNumber')"
                      :disabled="withdrawalLoading"
                    />
                    <span class="db-hint">{{ $t('dashboard.mobileMoneyHint') }}</span>
                  </div>

                  <div class="db-notice">{{ $t('dashboard.withdrawalReviewMobile') }}</div>

                  <button
                    class="tw-btn tw-btn--primary db-submit-btn"
                    @click="submitWithdrawal"
                    :disabled="withdrawalLoading || parseFloat(withdrawalAmount) > walletBalance"
                  >
                    <span v-if="withdrawalLoading" class="db-spinner db-spinner--sm"></span>
                    <span>{{ withdrawalLoading ? $t('dashboard.submitting') : $t('dashboard.submitWithdrawalRequest') }}</span>
                  </button>
                </div>

                <!-- ======================== -->
                <!--    AGENT WITHDRAWAL      -->
                <!-- ======================== -->
                <div v-if="withdrawalMethod === 'agent_withdrawal'">

                  <!-- Withdrawal Code Result -->
                  <div v-if="showWithdrawalCode && generatedWithdrawalCode" class="db-code-result">
                    <div class="db-code-result__header">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span>{{ $t('ui.withdrawal_code_generated') }}</span>
                    </div>

                    <div class="db-code-result__body">
                      <div class="db-code-result__row">
                        <span class="db-code-result__key">{{ $t('ui.code') }}</span>
                        <div class="db-code-result__code-wrap">
                          <code class="db-code-result__code">{{ generatedWithdrawalCode.code }}</code>
                          <button
                            id="copy-code-btn"
                            class="tw-btn tw-btn--secondary"
                            @click="copyWithdrawalCode(generatedWithdrawalCode.code)"
                          >
                            Copy Code
                          </button>
                        </div>
                      </div>
                      <div class="db-code-result__row">
                        <span class="db-code-result__key">{{ $t('ui.amount') }}</span>
                        <span class="db-code-result__val">{{ formatNumber(generatedWithdrawalCode.amountUSD || convertToUSD(generatedWithdrawalCode.amount)) }} EBT</span>
                      </div>
                      <div class="db-code-result__row">
                        <span class="db-code-result__key">{{ $t('ui.agent') }}</span>
                        <span class="db-code-result__val">{{ generatedWithdrawalCode.agent_name }}</span>
                      </div>
                      <div class="db-code-result__row">
                        <span class="db-code-result__key">{{ $t('ui.agent_phone') }}</span>
                        <span class="db-code-result__val">{{ generatedWithdrawalCode.agent_phone }}</span>
                      </div>
                      <div class="db-code-result__row">
                        <span class="db-code-result__key">{{ $t('ui.expires_2') }}</span>
                        <span class="db-code-result__val">{{ formatDate(generatedWithdrawalCode.expires_at) }}</span>
                      </div>
                    </div>

                    <div v-if="generatedWithdrawalCode.instructions?.length" class="db-code-result__instructions">
                      <h6>{{ $t('ui.instructions') }}</h6>
                      <ol>
                        <li v-for="instruction in generatedWithdrawalCode.instructions" :key="instruction">
                          {{ instruction }}
                        </li>
                      </ol>
                    </div>
                  </div>

                  <!-- Agent selection form -->
                  <div v-if="!showWithdrawalCode">

                    <!-- Balance reminder -->
                    <div class="db-balance-reminder">
                      <span class="db-balance-reminder__label">{{ $t('ui.available_balance') }}</span>
                      <span class="db-balance-reminder__value">{{ formatNumber(walletBalance) }} EBT</span>
                    </div>

                    <div class="tw-form-group">
                      <label class="tw-label">{{ $t('ui.select_withdrawal_agent') }}</label>
                      <select
                        v-model="selectedWithdrawalAgent"
                        class="tw-select"
                        :disabled="withdrawalLoading"
                      >
                        <option :value="null">{{ $t('ui.choose_an_agent') }}</option>
                        <option
                          v-for="agent in withdrawalAgents"
                          :key="agent.id"
                          :value="agent"
                        >
                          ID: {{ agent.agent_id }} — {{ agent.name }} ({{ agent.phone }})
                        </option>
                      </select>
                    </div>

                    <div class="tw-form-group">
                      <label class="tw-label">{{ $t('ui.withdrawal_amount_usd') }}</label>
                      <input
                        v-model="withdrawalAmount"
                        type="number"
                        class="tw-input"
                        min="1"
                        max="10000"
                        :placeholder="$t('ui.enter_amount_min_1_usd')"
                        :disabled="withdrawalLoading"
                      />
                      <span class="db-hint">{{ $t('ui.minimum_1_usd_maximum_10_000_usd') }}</span>
                      <div v-if="withdrawalAmount && parseFloat(withdrawalAmount) > walletBalance"
                           class="tw-alert tw-alert--error" style="margin-top: 0.5rem;">
                        Insufficient balance. Available: {{ formatNumber(walletBalance) }} EBT
                      </div>
                    </div>

                    <button
                      type="button"
                      class="tw-btn tw-btn--primary db-submit-btn"
                      @click="generateWithdrawalCode"
                      :disabled="withdrawalLoading || !withdrawalAmount || !selectedWithdrawalAgent || (parseFloat(withdrawalAmount) > walletBalance)"
                    >
                      <span v-if="withdrawalLoading" class="db-spinner db-spinner--sm"></span>
                      <span>{{ withdrawalLoading ? 'Generating Code…' : 'Generate Withdrawal Code' }}</span>
                    </button>
                  </div>
                </div>

              </div>
            </TabPanel>

            <!-- ======================== -->
            <!--    BALANCE HISTORY       -->
            <!-- ======================== -->
            <TabPanel>
              <div class="tw-card db-table-card">
                <div class="db-panel-title db-panel-title--table">
                  <div class="db-panel-title__icon">
                    <i class="fas fa-user"></i>
                  </div>
                  <div>
                    <h2 class="db-panel-title__h">{{ $t('dashboard.balanceHistory') }}</h2>
                    <p class="db-panel-title__sub">{{ $t('ui.all_your_deposits_and_withdrawals') }}</p>
                  </div>
                </div>
                <div v-if="loadingHistory" class="db-loading-state">
                  <span class="db-spinner"></span>
                </div>

                <div v-else class="db-table-wrap">
                  <table class="db-table">
                    <thead>
                      <tr>
                        <th>{{ $t('dashboard.id') }}</th>
                        <th>{{ $t('dashboard.date') }}</th>
                        <th>{{ $t('dashboard.type') }}</th>
                        <th>{{ $t('dashboard.method') }}</th>
                        <th>{{ $t('dashboard.amount') }}</th>
                        <th>{{ $t('dashboard.status') }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="transaction in transactionHistory"
                        :key="`${transaction.type}-${transaction.id}`"
                      >
                        <td>#{{ transaction.id }}</td>
                        <td>{{ formatDate(transaction.created_at) }}</td>
                        <td>
                          <span
                            class="tw-badge"
                            :class="transaction.type === 'deposit' ? 'tw-badge--open' : 'tw-badge--pending'"
                          >
                            {{ transaction.type === 'deposit' ? $t('dashboard.deposit') : $t('dashboard.withdrawal') }}
                          </span>
                        </td>
                        <td>{{ getMethodLabel(transaction) }}</td>
                        <td class="db-table__amount">{{ transaction.amount.toLocaleString() }} EBT</td>
                        <td>
                          <span
                            class="tw-badge"
                            :class="{
                              'tw-badge--pending': transaction.status === 'pending',
                              'tw-badge--open': transaction.status === 'approved',
                              'tw-badge--closed': transaction.status === 'rejected'
                            }"
                          >
                            {{ getStatusLabel(transaction.status) }}
                          </span>
                        </td>
                      </tr>

                      <tr v-if="transactionHistory.length === 0">
                        <td colspan="6" class="db-table__empty">{{ $t('dashboard.noTransactionsFound') }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </TabPanel>

            <!-- ======================== -->
            <!--     BETTING HISTORY      -->
            <!-- ======================== -->
            <TabPanel>
              <div class="tw-card db-table-card">
                <div class="db-panel-title db-panel-title--table">
                  <div class="db-panel-title__icon">
                    <i class="fas fa-user"></i>
                  </div>
                  <div>
                    <h2 class="db-panel-title__h">{{ $t('dashboard.bettingHistory') }}</h2>
                    <p class="db-panel-title__sub">{{ $t('dashboard.bettingHistoryDesc') }}</p>
                  </div>
                </div>

                <div v-if="loadingBets" class="db-loading-state">
                  <span class="db-spinner"></span>
                </div>

                <div v-else class="db-table-wrap">
                  <table class="db-table">
                    <thead>
                      <tr>
                        <th>{{ $t('dashboard.id') }}</th>
                        <th>{{ $t('dashboard.date') }}</th>
                        <th>{{ $t('dashboard.match') }}</th>
                        <th>{{ $t('dashboard.betType') }}</th>
                        <th>{{ $t('dashboard.amount') }}</th>
                        <th>{{ $t('dashboard.odds') }}</th>
                        <th>{{ $t('dashboard.potentialWin') }}</th>
                        <th>{{ $t('dashboard.status') }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="bet in bettingHistory" :key="bet.id">
                        <td>#{{ bet.id }}</td>
                        <td>{{ formatDate(bet.created_at) }}</td>
                        <td>{{ getMatchName(bet) }}</td>
                        <td>{{ getBetTypeLabel(bet.bet_type) }}</td>
                        <td class="db-table__amount">{{ formatNumber(bet.amount) }} EBT</td>
                        <td>{{ getBetOdds(bet) }}x</td>
                        <td class="db-table__amount">{{ formatNumber(bet.potential_win || 0) }} EBT</td>
                        <td>
                          <span
                            class="tw-badge"
                            :class="{
                              'tw-badge--pending': bet.status === 'pending',
                              'tw-badge--open': bet.status === 'won',
                              'tw-badge--closed': bet.status === 'lost' || bet.status === 'cancelled'
                            }"
                          >
                            {{ getBetStatusLabel(bet.status) }}
                          </span>
                        </td>
                      </tr>

                      <tr v-if="bettingHistory.length === 0">
                        <td colspan="8" class="db-table__empty">{{ $t('dashboard.noBets') }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </TabPanel>

            <!-- ======================== -->
            <!--       PROFILE PANEL      -->
            <!-- ======================== -->
            <TabPanel>
              <div class="tw-card db-panel-card">
                <div class="db-panel-title">
                  <div class="db-panel-title__icon">
                    <i class="fas fa-cog"></i>
                  </div>
                  <div>
                    <h2 class="db-panel-title__h">{{ $t('ui.my_profile') }}</h2>
                    <p class="db-panel-title__sub">{{ $t('ui.manage_your_personal_information_and_settings') }}</p>
                  </div>
                </div>
                <ProfileComponent />
              </div>
            </TabPanel>

          </TabPanels>
        </div>

      </div>
    </TabGroup>
  </div>
</template>

<style scoped>
/* ============================================================
   DASHBOARD LAYOUT
   ============================================================ */
.db-layout {
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
}

/* ============================================================
   WALLET BALANCE CARD (top hero)
   ============================================================ */
.db-balance-card {
  background: rgb(var(--p2));
  border: 1px solid rgb(var(--n2));
  border-radius: 12px;
  padding: 1.25rem 1.5rem;
  margin-bottom: 1.5rem;
}

.db-balance-card__inner {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.db-balance-card__icon {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background: rgba(var(--g1), 0.15);
  color: rgb(var(--g1));
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.db-balance-card__info {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.db-balance-card__label {
  font-size: 0.75rem;
  color: rgb(var(--n3));
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.db-balance-card__value {
  font-size: 1.75rem;
  font-weight: 700;
  color: rgb(var(--n8));
  line-height: 1;
}

.db-balance-card__value em {
  font-style: normal;
  font-size: 1rem;
  color: rgb(var(--g1));
  margin-left: 0.25rem;
}

.db-balance-card__value--loading {
  display: flex;
  align-items: center;
}

/* ============================================================
   SIDEBAR TABS
   ============================================================ */
.db-sidebar {
  flex: 0 0 220px;
  width: 220px;
}

.tw-tabs--vertical {
  flex-direction: column !important;
  background: rgb(var(--p2));
  border-radius: 10px;
  padding: 0.5rem;
  gap: 0.25rem;
  border: 1px solid rgb(var(--n2));
}

.db-tab-btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.7rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  color: rgb(var(--n3));
  background: transparent;
  border: none;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  text-align: left;
  justify-content: flex-start;
}

.db-tab-btn:hover {
  background: rgb(var(--p3));
  color: rgb(var(--n8));
}

.db-tab-btn.active {
  background: rgba(var(--g1), 0.15);
  color: rgb(var(--g1));
}

/* ============================================================
   CONTENT AREA
   ============================================================ */
.db-content {
  flex: 1;
  min-width: 0;
}

/* ============================================================
   PANEL HEADER
   ============================================================ */
.db-panel-header {
  margin-bottom: 1.25rem;
}

.db-panel-header__title {
  font-size: 1.25rem;
  font-weight: 700;
  color: rgb(var(--n8));
  margin: 0 0 0.25rem;
}

.db-panel-header__desc {
  font-size: 0.875rem;
  color: rgb(var(--n3));
  margin: 0;
}

/* ============================================================
   METHOD TOGGLE BUTTONS
   ============================================================ */
.db-method-toggle {
  display: flex;
  flex-wrap: wrap;
  gap: 0.625rem;
  margin-bottom: 1.25rem;
}

/* ============================================================
   SECTION HEADER (agents intro)
   ============================================================ */
.db-section-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.db-section-header__title {
  font-size: 1.1rem;
  font-weight: 700;
  color: rgb(var(--n8));
  margin: 0 0 0.375rem;
}

.db-section-header__desc {
  font-size: 0.875rem;
  color: rgb(var(--n3));
  margin: 0;
}

/* ============================================================
   CRYPTO ADDRESS CARD
   ============================================================ */
.db-crypto-card {
  background: rgb(var(--p3));
  border: 1px solid rgb(var(--n2));
  border-left: 3px solid rgb(var(--g1));
  border-radius: 10px;
  padding: 1rem 1.25rem;
  margin-bottom: 1rem;
}

.db-crypto-card__meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.db-crypto-card__name {
  font-weight: 600;
  color: rgb(var(--n8));
  font-size: 0.95rem;
}

.db-crypto-card__network {
  font-size: 0.75rem;
  color: rgb(var(--g1));
  background: rgba(var(--g1), 0.12);
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
}

.db-crypto-card__address-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.db-crypto-card__address {
  font-family: 'Courier New', monospace;
  font-size: 0.82rem;
  color: rgb(var(--n3));
  word-break: break-all;
  flex: 1;
}

.db-crypto-card__copy-btn {
  flex-shrink: 0;
  font-size: 0.8rem;
  padding: 0.3rem 0.75rem;
}

/* ============================================================
   HINT / NOTICE
   ============================================================ */
.db-hint {
  display: block;
  font-size: 0.78rem;
  color: rgb(var(--n3));
  margin-top: 0.375rem;
}

.db-notice {
  background: rgba(var(--g1), 0.08);
  border: 1px solid rgba(var(--g1), 0.2);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  font-size: 0.85rem;
  color: rgb(var(--n3));
  margin-bottom: 1rem;
}

/* ============================================================
   SUBMIT BUTTON (full-width)
   ============================================================ */
.db-submit-btn {
  width: 100%;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-size: 0.95rem;
}

/* ============================================================
   AGENTS GRID
   ============================================================ */
.db-agents-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1rem;
}

.db-agent-card {
  background: rgb(var(--p3));
  border: 1px solid rgb(var(--n2));
  border-radius: 12px;
  padding: 1.25rem;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
  position: relative;
  overflow: hidden;
}

.db-agent-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(var(--g1), 0.04);
  opacity: 0;
  transition: opacity 0.2s;
}

.db-agent-card:hover {
  border-color: rgb(var(--g1));
  box-shadow: 0 4px 24px rgba(var(--g1), 0.15);
  transform: translateY(-2px);
}

.db-agent-card:hover::before {
  opacity: 1;
}

.db-agent-card:active {
  transform: translateY(0);
}

.db-agent-card__icon {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  background: linear-gradient(135deg, #25d366 0%, #128c7e 100%);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(37, 211, 102, 0.3);
}

.db-agent-card__body {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.db-agent-card__name {
  font-weight: 700;
  color: rgb(var(--n8));
  font-size: 1rem;
}

.db-agent-card__id {
  font-size: 0.75rem;
  color: rgb(var(--n3));
  background: rgb(var(--n2));
  display: inline-block;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  width: fit-content;
}

.db-agent-card__phone {
  font-size: 0.85rem;
  color: rgb(var(--g1));
  font-weight: 500;
}

.db-agent-card__desc {
  font-size: 0.78rem;
  color: rgb(var(--n3));
}

.db-agent-card__cta {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding-top: 0.625rem;
  border-top: 1px solid rgb(var(--n2));
  font-size: 0.8rem;
  color: rgb(var(--n3));
}

.db-agent-card__cta svg {
  margin-left: auto;
  color: rgb(var(--g1));
}

.db-agent-card__online-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #25d366;
  box-shadow: 0 0 6px rgba(37, 211, 102, 0.6);
  flex-shrink: 0;
}

.db-agent-card__cta-label {
  flex: 1;
}

/* ============================================================
   EMPTY STATE
   ============================================================ */
.db-empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: rgb(var(--n3));
}

.db-empty-state svg {
  color: rgb(var(--n2));
  margin-bottom: 1rem;
}

.db-empty-state h5 {
  color: rgb(var(--n8));
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.375rem;
}

.db-empty-state p {
  font-size: 0.875rem;
  margin: 0;
}

/* ============================================================
   LOADING STATE
   ============================================================ */
.db-loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 2.5rem 1rem;
}

.db-loading-state__text {
  font-size: 0.875rem;
  color: rgb(var(--n3));
}

/* Spinner */
.db-spinner {
  display: inline-block;
  width: 24px;
  height: 24px;
  border: 2px solid rgba(var(--g1), 0.25);
  border-top-color: rgb(var(--g1));
  border-radius: 50%;
  animation: db-spin 0.7s linear infinite;
  flex-shrink: 0;
}

.db-spinner--sm {
  width: 16px;
  height: 16px;
  border-width: 2px;
}

@keyframes db-spin {
  to { transform: rotate(360deg); }
}

/* ============================================================
   BALANCE REMINDER (agent withdrawal)
   ============================================================ */
.db-balance-reminder {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(var(--g1), 0.08);
  border: 1px solid rgba(var(--g1), 0.2);
  border-radius: 10px;
  padding: 0.875rem 1.125rem;
  margin-bottom: 1.25rem;
}

.db-balance-reminder__label {
  font-size: 0.875rem;
  color: rgb(var(--n3));
}

.db-balance-reminder__value {
  font-size: 1.1rem;
  font-weight: 700;
  color: rgb(var(--g1));
}

/* ============================================================
   WITHDRAWAL CODE RESULT
   ============================================================ */
.db-code-result {
  background: rgb(var(--p3));
  border: 1px solid rgba(var(--g1), 0.3);
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 1.25rem;
}

.db-code-result__header {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  background: rgba(var(--g1), 0.12);
  border-bottom: 1px solid rgba(var(--g1), 0.2);
  padding: 0.875rem 1.25rem;
  color: rgb(var(--g1));
  font-weight: 600;
  font-size: 0.95rem;
}

.db-code-result__body {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.db-code-result__row {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.db-code-result__key {
  font-size: 0.8rem;
  color: rgb(var(--n3));
  text-transform: uppercase;
  letter-spacing: 0.04em;
  min-width: 100px;
  flex-shrink: 0;
}

.db-code-result__val {
  font-size: 0.9rem;
  color: rgb(var(--n8));
  font-weight: 500;
}

.db-code-result__code-wrap {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.db-code-result__code {
  font-family: 'Courier New', monospace;
  font-size: 1.25rem;
  font-weight: 700;
  color: rgb(var(--g1));
  background: rgba(var(--g1), 0.1);
  border: 1px solid rgba(var(--g1), 0.25);
  padding: 0.35rem 0.875rem;
  border-radius: 6px;
  letter-spacing: 0.1em;
}

.db-code-result__instructions {
  padding: 1rem 1.25rem;
  border-top: 1px solid rgb(var(--n2));
  background: rgb(var(--p2));
}

.db-code-result__instructions h6 {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgb(var(--n3));
  margin: 0 0 0.5rem;
}

.db-code-result__instructions ol {
  margin: 0;
  padding-left: 1.25rem;
}

.db-code-result__instructions li {
  font-size: 0.875rem;
  color: rgb(var(--n3));
  margin-bottom: 0.25rem;
}

/* ============================================================
   TABLE
   ============================================================ */
.db-table-card {
  padding: 0 !important;
  overflow: hidden;
}

.db-table-wrap {
  overflow-x: auto;
}

.db-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.db-table thead tr {
  background: rgba(var(--g1), 0.1);
  border-bottom: 1px solid rgba(var(--g1), 0.2);
}

.db-table thead th {
  padding: 0.875rem 1rem;
  text-align: left;
  font-size: 0.78rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgb(var(--g1));
  white-space: nowrap;
}

.db-table tbody tr {
  border-bottom: 1px solid rgb(var(--n2));
  transition: background 0.15s;
}

.db-table tbody tr:last-child {
  border-bottom: none;
}

.db-table tbody tr:hover {
  background: rgba(var(--n2), 0.4);
}

.db-table td {
  padding: 0.875rem 1rem;
  color: rgb(var(--n3));
  vertical-align: middle;
  white-space: nowrap;
}

.db-table__amount {
  font-weight: 600;
  color: rgb(var(--n8)) !important;
  font-variant-numeric: tabular-nums;
}

.db-table__empty {
  text-align: center !important;
  padding: 3rem 1rem !important;
  color: rgb(var(--n3));
  font-style: italic;
}

/* ============================================================
   PANEL CARD — generous inner spacing
   ============================================================ */
.db-panel-card {
  padding: 36px 40px !important;
}

@media (max-width: 768px) {
  .db-panel-card { padding: 24px 20px !important; }
}

/* ============================================================
   PANEL TITLE HEADER
   ============================================================ */
.db-panel-title {
  display: flex;
  align-items: center;
  gap: 16px;
  padding-bottom: 24px;
  margin-bottom: 28px;
  border-bottom: 1px solid rgb(var(--n2));
}

.db-panel-title--table {
  padding: 28px 32px 24px;
  margin-bottom: 0;
  border-bottom: 1px solid rgb(var(--n2));
}

.db-panel-title__icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(var(--g1), 0.14);
  color: rgb(var(--g1));
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.db-panel-title__h {
  font-size: 20px;
  font-weight: 800;
  color: rgb(var(--n8));
  margin: 0 0 4px;
  letter-spacing: -0.3px;
}

.db-panel-title__sub {
  font-size: 13px;
  color: rgb(var(--n3));
  margin: 0;
}

/* ============================================================
   FORM GROUP — more space between fields
   ============================================================ */
:deep(.tw-form-group),
.tw-form-group {
  margin-bottom: 24px !important;
}

:deep(.tw-label),
.tw-label {
  font-size: 13px;
  font-weight: 700;
  color: rgb(var(--n5));
  margin-bottom: 8px;
  display: block;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

:deep(.tw-input),
.tw-input,
:deep(.tw-select),
.tw-select {
  height: 46px !important;
  font-size: 14px !important;
  background: rgb(var(--p1)) !important;
  border: 1px solid rgb(var(--n2)) !important;
  border-radius: 6px !important;
  color: rgb(var(--n8)) !important;
  padding: 0 16px !important;
  transition: border-color 0.2s, box-shadow 0.2s !important;

  &:focus {
    border-color: rgb(var(--g1)) !important;
    box-shadow: 0 0 0 3px rgba(var(--g1), 0.12) !important;
    outline: none !important;
  }

  &::placeholder { color: rgb(var(--n3)) !important; }
}

/* ============================================================
   METHOD TOGGLE — more breathing room
   ============================================================ */
.db-method-toggle--spaced {
  gap: 10px;
  margin-bottom: 28px;
}

.db-method-toggle--spaced .tw-btn {
  padding: 0 22px;
  height: 42px;
  font-size: 14px;
  border-radius: 6px;
}

/* ============================================================
   SUBMIT BUTTON — bigger, more prominent
   ============================================================ */
.db-submit-btn {
  height: 50px !important;
  font-size: 15px !important;
  font-weight: 700 !important;
  letter-spacing: 0.01em;
  margin-top: 8px;
  border-radius: 6px !important;
  box-shadow: 0 4px 16px rgba(var(--g1), 0.3) !important;

  &:hover:not(:disabled) {
    box-shadow: 0 6px 24px rgba(var(--g1), 0.4) !important;
    transform: translateY(-1px);
  }
}

/* ============================================================
   DIVIDER inside panel
   ============================================================ */
.db-panel-card .tw-divider {
  margin: 24px 0 28px !important;
}

/* ============================================================
   NOTICE — more prominent
   ============================================================ */
.db-notice {
  padding: 14px 18px !important;
  font-size: 13px !important;
  line-height: 1.55 !important;
  margin-bottom: 20px !important;
  border-radius: 8px !important;
}

/* ============================================================
   HINT — slightly larger
   ============================================================ */
.db-hint {
  font-size: 12px !important;
  margin-top: 6px !important;
  line-height: 1.4;
}

/* ============================================================
   SECTION HEADER inside deposit/withdrawal
   ============================================================ */
.db-section-header {
  padding: 20px 0 6px !important;
  margin-bottom: 20px !important;
}

.db-section-header__title {
  font-size: 16px !important;
  font-weight: 700 !important;
}

.db-section-header__desc {
  font-size: 13px !important;
  margin-top: 4px;
}

/* ============================================================
   TABLE — better row spacing
   ============================================================ */
.db-table thead th {
  padding: 14px 20px !important;
  font-size: 11px !important;
}

.db-table td {
  padding: 14px 20px !important;
  font-size: 13px !important;
  line-height: 1.4;
}

.db-table__empty {
  padding: 60px 20px !important;
  font-size: 14px !important;
  color: rgb(var(--n3));
}

/* ============================================================
   AGENT CARD — more space
   ============================================================ */
.db-agent-card {
  padding: 20px 22px !important;
  gap: 14px !important;
}

.db-agent-card__name { font-size: 15px !important; }
.db-agent-card__phone { font-size: 14px !important; }

/* ============================================================
   BALANCE CARD — top hero bigger
   ============================================================ */
.db-balance-card {
  padding: 24px 28px !important;
  margin-bottom: 24px !important;
  border-radius: 12px !important;
}

.db-balance-card__icon {
  width: 56px !important;
  height: 56px !important;
  border-radius: 14px !important;
}

.db-balance-card__value {
  font-size: 2.2rem !important;
}

/* ============================================================
   SIDEBAR TABS — more comfortable
   ============================================================ */
.db-tab-btn {
  padding: 12px 16px !important;
  font-size: 14px !important;
  gap: 10px !important;
  border-radius: 8px !important;
}

.tw-tabs--vertical {
  padding: 8px !important;
  gap: 4px !important;
}

/* ============================================================
   RESPONSIVE
   ============================================================ */

/* ── Tablet (≤900px): horizontal scrollable tab strip ── */
@media (max-width: 900px) {
  .db-layout {
    flex-direction: column;
    gap: 0;
  }

  .db-sidebar {
    flex: none;
    width: 100%;
    position: sticky;
    top: 50px; /* below fixed header */
    z-index: 10;
    background: rgb(var(--p1));
    padding-bottom: 12px;
  }

  .tw-tabs--vertical {
    flex-direction: row !important;
    flex-wrap: nowrap !important;
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: none;
    border-radius: 0 !important;
    border: none !important;
    border-bottom: 2px solid rgb(var(--n2)) !important;
    background: transparent !important;
    padding: 0 !important;
    gap: 0 !important;
  }

  .tw-tabs--vertical::-webkit-scrollbar { display: none; }

  .db-tab-btn {
    flex: 0 0 auto !important;
    width: auto !important;
    padding: 12px 18px !important;
    border-radius: 0 !important;
    border-bottom: 3px solid transparent !important;
    background: transparent !important;
    color: rgb(var(--n3)) !important;
    gap: 7px !important;
    white-space: nowrap;
    font-size: 14px !important;
    justify-content: center !important;
    margin-bottom: -2px;

    &.active {
      background: transparent !important;
      color: rgb(var(--n8)) !important;
      border-bottom-color: rgb(var(--g1)) !important;
    }

    &:hover:not(.active) {
      background: transparent !important;
      color: rgb(var(--n8)) !important;
    }
  }

  .db-panel-card {
    padding: 24px 20px !important;
    margin-top: 4px;
  }
}

/* ── Mobile (≤576px): icon + short label ── */
@media (max-width: 576px) {
  .db-tab-btn {
    padding: 10px 14px !important;
    font-size: 12px !important;
    gap: 5px !important;
  }

  .db-panel-card {
    padding: 20px 16px !important;
  }

  .db-agents-grid {
    grid-template-columns: 1fr;
  }

  .db-table thead th,
  .db-table td {
    padding: 10px 12px !important;
    font-size: 12px !important;
  }
}

/* ── Extra small (≤400px): hide text, icon only ── */
@media (max-width: 400px) {
  .db-tab-btn span { display: none; }
  .db-tab-btn { padding: 10px 12px !important; }
}
</style>
