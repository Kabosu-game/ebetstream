<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/vue";
import {
  IconCreditCard,
  IconUser,
  IconWallet,
} from "@tabler/icons-vue";
import { useI18n } from "vue-i18n";
import apiClient from "@/utils/axios";

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

    // Validation - convertir en XAF pour l'API mais afficher en USD
    const amountInUSD = parseFloat(withdrawalAmount.value);
    const amountInXAF = Math.round(amountInUSD * 600); // Convertir USD en XAF pour l'API
    
    if (!withdrawalAmount.value || amountInUSD < 1) { // Minimum 1 USD
      withdrawalMessage.value = "Minimum withdrawal amount is $1 USD";
      withdrawalMessageType.value = "error";
      return;
    }

    if (!selectedWithdrawalAgent.value) {
      withdrawalMessage.value = "Please select an agent";
      withdrawalMessageType.value = "error";
      return;
    }

    // Vérifier si le solde est suffisant (comparaison en USD)
    if (amountInUSD > walletBalance.value) {
      withdrawalMessage.value = `Insufficient balance. Available: ${formatNumber(walletBalance.value)} EBT`;
      withdrawalMessageType.value = "error";
      return;
    }

    const token = localStorage.getItem("auth_token");
    const response = await apiClient.post(
      "/withdrawal-codes",
      {
        amount: amountInXAF, // Envoyer en XAF à l'API
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
      generatedWithdrawalCode.value.amountUSD = amountInUSD;
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
  if (bet.game_match) {
    const team1 = bet.game_match.team1_name || 'Team 1';
    const team2 = bet.game_match.team2_name || 'Team 2';
    return `${team1} vs ${team2}`;
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

const getBetOdds = (bet: any) => {
  if (!bet.game_match) {
    return bet.odds || 'N/A';
  }
  
  const match = bet.game_match;
  switch (bet.bet_type) {
    case 'team1_win':
      return match.team1_odds || 'N/A';
    case 'draw':
      return match.draw_odds || 'N/A';
    case 'team2_win':
      return match.team2_odds || 'N/A';
    default:
      return bet.odds || 'N/A';
  }
};

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
  <section class="pay_method pb-120 overflow-visible">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12 gx-0 gx-sm-4">
          <div class="hero_area__main">
            <TabGroup>
              <div class="row gy-6 gy-xxl-0 singletab">
                
                <!-- Left side menu -->
                <div class="col-xxl-3">
                  <div class="pay_method__scrol">
                    <TabList
                      class="tablinks pay_method__scrollbar p2-bg p-5 p-md-6 rounded-4 d-flex flex-wrap align-items-center justify-content-center flex-xxl-column gap-3 gap-xxl-2"
                    >
                      <!-- Deposit -->
                      <Tab as="template" v-slot="{ selected }" class="nav-links p-3 rounded-3 cpoint d-inline-block outstles dashboard-tab-item">
                        <button class="tablink d-flex align-items-center gap-2 outstles" :class="{ 'n11-bg': selected }">
                          <IconWallet height="20" width="20" />
                          Deposit
                        </button>
                      </Tab>

                      <!-- Withdrawal -->
                      <Tab as="template" v-slot="{ selected }" class="nav-links p-3 rounded-3 cpoint d-inline-block outstles dashboard-tab-item">
                        <button class="tablink d-flex align-items-center gap-2 outstles" :class="{ 'n11-bg': selected }">
                          <IconCreditCard height="20" width="20" />
                          {{ $t('dashboard.withdrawal') }}
                        </button>
                      </Tab>

                      <!-- Balance History -->
                      <Tab as="template" v-slot="{ selected }" class="nav-links p-3 rounded-3 cpoint d-inline-block outstles dashboard-tab-item">
                        <button class="tablink d-flex align-items-center gap-2 outstles" :class="{ 'n11-bg': selected }">
                          <IconUser height="20" width="20" />
                          {{ $t('dashboard.balanceHistory') }}
                        </button>
                      </Tab>

                      <!-- Betting History -->
                      <Tab as="template" v-slot="{ selected }" class="nav-links p-3 rounded-3 cpoint d-inline-block outstles dashboard-tab-item">
                        <button class="tablink d-flex align-items-center gap-2 outstles" :class="{ 'n11-bg': selected }">
                          <IconUser height="20" width="20" />
                          {{ $t('dashboard.bettingHistory') }}
                        </button>
                      </Tab>
                    </TabList>
                  </div>
                </div>

                <!-- Right side content -->
                <div class="col-xxl-9">
                  <TabPanels class="tabcontents">

                    <!-- ====================== -->
                    <!--      DEPOSIT PANEL     -->
                    <!-- ====================== -->
                    <TabPanel>
                      <div class="pay_method__paymethod p-4 p-lg-6 p2-bg rounded-8">

                        <div class="pay_method__paymethod-title mb-5 mb-md-6">
                          
                        </div>

                        <!-- Feedback message -->
                        <div v-if="message" 
                             class="alert mb-4"
                             :class="messageType === 'success' ? 'alert-success' : 'alert-danger'">
                          {{ message }}
                        </div>

                        <!-- Choice Crypto | Cash -->
                        <div class="d-flex gap-3 mb-4">
                          <button
                            class="btn btn-primary"
                            :class="{ active: depositMethod === 'crypto' }"
                            @click="depositMethod = 'crypto'"
                            :disabled="loading"
                          >
                            {{ $t('dashboard.depositViaCrypto') }}
                          </button>

                          <button
                            class="btn btn-secondary"
                            :class="{ active: depositMethod === 'cash' }"
                            @click="depositMethod = 'cash'"
                            :disabled="loading"
                          >
                            {{ $t('dashboard.depositInCash') }}
                          </button>
                        </div>

                        <!-- ===================== -->
                        <!--       CRYPTO FORM     -->
                        <!-- ===================== -->
                        <div v-if="depositMethod === 'crypto'">
                          <div v-if="loadingPaymentMethods" class="text-center py-3 mb-4">
                            <div class="spinner-border spinner-border-sm text-primary" role="status"></div>
                          </div>
                          
                          <div v-else-if="depositMethods.filter((m: any) => m.method_key === 'crypto').length === 0" class="alert alert-warning mb-4">
                            {{ $t('dashboard.noCryptoMethods') }}
                          </div>
                          
                          <div v-else>
                          <div class="mb-3">
                              <label class="form-label text-white">{{ $t('dashboard.selectCryptocurrency') }}</label>
                              <select
                                v-model="selectedCryptoMethod"
                                class="form-select n11-bg text-white border-secondary"
                                :disabled="loading"
                              >
                                <option :value="null">{{ $t('dashboard.selectACryptocurrency') }}</option>
                                <option 
                                  v-for="method in depositMethods.filter((m: any) => m.method_key === 'crypto')" 
                                  :key="method.id" 
                                  :value="method"
                                >
                                  {{ method.name }} {{ method.crypto_network ? `(${method.crypto_network})` : '' }}
                                </option>
                              </select>
                            </div>

                            <div v-if="selectedCryptoMethod" class="mb-3">
                              <label class="form-label text-white">{{ $t('dashboard.amount') }}</label>
                            <input
                              v-model="amount"
                              type="number"
                                class="form-control n11-bg text-white border-secondary"
                              :min="selectedCryptoMethod?.min_amount || 5"
                              :max="selectedCryptoMethod?.max_amount || 10000"
                              :placeholder="$t('dashboard.enterAmount')"
                              :disabled="loading"
                            />
                            <small class="text-white" style="opacity: 0.9;">
                                {{ $t('dashboard.minimum') }}: {{ selectedCryptoMethod?.min_amount || 5 }} K — {{ $t('dashboard.maximum') }}: {{ selectedCryptoMethod?.max_amount || 10000 }} K
                            </small>
                          </div>

                          <!-- Crypto card -->
                            <div v-if="selectedCryptoMethod && selectedCryptoMethod.crypto_address" class="p-3 mb-4 rounded border d-flex align-items-center justify-content-between">
                            <div>
                                <strong class="text-white">{{ selectedCryptoMethod.name }}</strong>
                                <div class="small text-white" style="opacity: 0.9;">
                                  {{ selectedCryptoMethod.crypto_network || 'Crypto' }}
                                </div>
                            </div>
                            <div class="text-end small">
                                <span class="text-white" style="font-family: monospace; font-size: 0.85rem;">
                                  {{ selectedCryptoMethod.crypto_address }}
                                </span>
                              <button 
                                class="btn btn-sm btn-outline-primary ms-2" 
                                  @click="copyAddress(selectedCryptoMethod.crypto_address)"
                                type="button"
                              >
                                {{ $t('dashboard.copy') }}
                              </button>
                              </div>
                            </div>
                          </div>

                          <!-- Hash -->
                          <div class="mb-4">
                            <label class="form-label">{{ $t('dashboard.transactionHash') }}</label>
                            <input 
                              v-model="transactionHash"
                              type="text" 
                              class="form-control" 
                              :placeholder="$t('dashboard.pasteTransactionHash')"
                              :disabled="loading"
                            />
                          </div>

                          <div class="alert alert-warning">
                            {{ $t('dashboard.depositReview') }}
                          </div>

                          <button 
                            class="btn btn-success w-100"
                            @click="submitDeposit"
                            :disabled="loading"
                          >
                            <span v-if="loading">{{ $t('dashboard.submitting') }}</span>
                            <span v-else>{{ $t('dashboard.submitDeposit') }}</span>
                          </button>
                        </div>

                        <!-- ===================== -->
                        <!--   RECHARGE AGENTS     -->
                        <!-- ===================== -->
                        <div v-if="depositMethod === 'cash'">
                          <div class="mb-5 text-center">
                            <h4 class="mb-3 fw-bold">{{ $t('dashboard.selectRechargeAgent') }}</h4>
                            <p class="text-white" style="opacity: 0.9;">
                              {{ $t('dashboard.clickAgentWhatsApp') }}
                            </p>
                          </div>

                          <!-- Loading state -->
                          <div v-if="loadingAgents" class="text-center py-5">
                            <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
                              <span class="visually-hidden">Loading...</span>
                            </div>
                            <p class="text-white mt-3" style="opacity: 0.9;">{{ $t('dashboard.loadingAgents') }}</p>
                          </div>

                          <!-- Agents list -->
                          <div v-else-if="rechargeAgents.length > 0" class="row g-4">
                            <div 
                              v-for="agent in rechargeAgents" 
                              :key="agent.id"
                              class="col-12 col-md-6"
                            >
                              <div 
                                class="agent-card position-relative overflow-hidden rounded-4 border-0 shadow-sm h-100"
                                @click="contactAgent(agent)"
                                style="cursor: pointer; transition: all 0.3s ease;"
                              >
                                <!-- Gradient background -->
                                <div class="position-absolute w-100 h-100" 
                                     style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); opacity: 0.05;"></div>
                                
                                <div class="card-body p-4 position-relative">
                                  <div class="d-flex align-items-start gap-3">
                                    <!-- WhatsApp icon with gradient -->
                                    <div class="flex-shrink-0">
                                      <div 
                                        class="rounded-3 text-white d-flex align-items-center justify-content-center position-relative"
                                        style="width: 60px; height: 60px; background: linear-gradient(135deg, #25D366 0%, #128C7E 100%); box-shadow: 0 4px 15px rgba(37, 211, 102, 0.3);"
                                      >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                                        </svg>
                                      </div>
                                    </div>
                                    
                                    <!-- Agent info -->
                                    <div class="flex-grow-1">
                                      <h5 class="mb-2 fw-bold" style="color: #2d3748;">{{ agent.name }}</h5>
                                      <div class="d-flex align-items-center gap-2 mb-2">
                                        <span class="badge bg-secondary small">ID: {{ agent.agent_id }}</span>
                                      </div>
                                      <div class="d-flex align-items-center gap-2 mt-3">
                                        <span class="badge rounded-pill px-3 py-2" 
                                              style="background: linear-gradient(135deg, #25D366 0%, #128C7E 100%); font-size: 0.85rem;">
                                          <i class="fab fa-whatsapp me-1"></i>
                                          {{ agent.phone }}
                                        </span>
                                      </div>
                                    </div>
                                    
                                    <!-- Arrow icon -->
                                    <div class="flex-shrink-0 align-self-center">
                                      <div class="rounded-circle d-flex align-items-center justify-content-center"
                                           style="width: 36px; height: 36px; background: rgba(102, 126, 234, 0.1);">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#667eea" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                          <polyline points="9 18 15 12 9 6"></polyline>
                                        </svg>
                                      </div>
                                    </div>
                                  </div>

                                  <!-- Bottom action hint -->
                                  <div class="mt-4 pt-3 border-top d-flex align-items-center justify-content-between" 
                                       style="border-color: rgba(0,0,0,0.05) !important;">
                                    <small class="text-dark" style="color: #000000;">
                                      <i class="fas fa-hand-pointer me-1"></i>
                                      {{ $t('dashboard.clickToChat') }}
                                    </small>
                                    <small class="text-success fw-semibold">
                                      <i class="fas fa-circle me-1" style="font-size: 0.5rem;"></i>
                                      {{ $t('dashboard.available') }}
                                    </small>
                                  </div>
                                </div>

                                <!-- Hover effect overlay -->
                                <div class="position-absolute w-100 h-100 top-0 start-0 hover-overlay"
                                     style="background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%); opacity: 0; transition: opacity 0.3s ease;"></div>
                              </div>
                            </div>
                          </div>

                          <!-- Empty state -->
                          <div v-else class="text-center py-5">
                            <div class="mb-4">
                              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color: #cbd5e0;">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="12"></line>
                                <line x1="12" y1="16" x2="12.01" y2="16"></line>
                              </svg>
                            </div>
                            <h5 class="mb-2">{{ $t('dashboard.noAgentsAvailable') }}</h5>
                            <p class="text-white" style="opacity: 0.9;">{{ $t('dashboard.noAgentsAvailableDesc') }}</p>
                          </div>
                        </div>

                      </div>
                    </TabPanel>

                    <!-- ====================== -->
                    <!--    WITHDRAWAL PANEL     -->
                    <!-- ====================== -->
                    <TabPanel>
                      <div class="pay_method__paymethod p-4 p-lg-6 p2-bg rounded-8">

                        <!-- Wallet Balance Display -->
                        <div class="mb-5 text-center">
                          <div class="p-4 rounded-4 mb-4" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                            <h6 class="text-white mb-2" style="opacity: 0.9;">{{ $t('dashboard.availableBalance') }}</h6>
                            <h2 class="text-white fw-bold mb-0">
                              {{ formatNumber(Math.max(0, walletBalance)) }} EBT
                            </h2>
                          </div>
                        </div>

                        <!-- Feedback message -->
                        <div v-if="withdrawalMessage" 
                             class="alert mb-4"
                             :class="withdrawalMessageType === 'success' ? 'alert-success' : 'alert-danger'">
                          {{ withdrawalMessage }}
                        </div>

                        <!-- Choice Crypto | Bank Transfer | Mobile Money -->
                        <div v-if="loadingPaymentMethods" class="text-center py-3 mb-4">
                          <div class="spinner-border spinner-border-sm text-primary" role="status"></div>
                        </div>
                        <div v-else class="d-flex gap-3 mb-4 flex-wrap">
                          <button
                            v-if="withdrawalMethods.filter((m: any) => m.method_key === 'crypto').length > 0"
                            class="btn btn-primary"
                            :class="{ active: withdrawalMethod === 'crypto' }"
                            @click="withdrawalMethod = 'crypto'"
                            :disabled="withdrawalLoading"
                          >
                            <i class="fab fa-bitcoin me-2"></i>
                            {{ $t('dashboard.crypto') }}
                          </button>

                          <button
                            v-if="withdrawalMethods.filter((m: any) => m.method_key === 'bank_transfer').length > 0"
                            class="btn btn-secondary"
                            :class="{ active: withdrawalMethod === 'bank_transfer' }"
                            @click="withdrawalMethod = 'bank_transfer'"
                            :disabled="withdrawalLoading"
                          >
                            <i class="fas fa-university me-2"></i>
                            {{ $t('dashboard.bankTransfer') }}
                          </button>

                          <button
                            v-if="withdrawalMethods.filter((m: any) => m.method_key === 'mobile_money').length > 0"
                            class="btn btn-info"
                            :class="{ active: withdrawalMethod === 'mobile_money' }"
                            @click="withdrawalMethod = 'mobile_money'"
                            :disabled="withdrawalLoading"
                          >
                            <i class="fas fa-mobile-alt me-2"></i>
                            {{ $t('dashboard.mobileMoney') }}
                          </button>

                          <button
                            class="btn btn-success"
                            :class="{ active: withdrawalMethod === 'agent_withdrawal' }"
                            @click="withdrawalMethod = 'agent_withdrawal'"
                            :disabled="withdrawalLoading"
                          >
                            <i class="fas fa-user me-2"></i>
                            Agent Withdrawal
                          </button>
                        </div>

                        <!-- ===================== -->
                        <!--       CRYPTO FORM     -->
                        <!-- ===================== -->
                        <div v-if="withdrawalMethod === 'crypto'">
                          <div v-if="cryptoOptions.length === 0" class="alert alert-warning mb-4">
                            {{ $t('dashboard.noCryptoWithdrawal') }}
                          </div>
                          <div v-else>
                          <div class="mb-3">
                            <label class="form-label text-white">{{ $t('dashboard.amount') }}</label>
                            <input
                              v-model="withdrawalAmount"
                              type="number"
                                class="form-control n11-bg text-white border-secondary"
                                :min="getWithdrawalMinAmount()"
                                :max="getWithdrawalMaxAmount()"
                              :placeholder="$t('dashboard.enterAmount')"
                              :disabled="withdrawalLoading"
                            />
                            <small class="text-white" style="opacity: 0.9;">
                                {{ $t('dashboard.minimum') }}: {{ getWithdrawalMinAmount() }} K — {{ $t('dashboard.maximum') }}: {{ getWithdrawalMaxAmount() }} K
                            </small>
                          </div>

                          <div class="mb-3">
                            <label class="form-label text-white">{{ $t('dashboard.cryptoName') }}</label>
                            <select
                              v-model="cryptoName"
                              class="form-select n11-bg text-white border-secondary"
                              :disabled="withdrawalLoading"
                            >
                              <option value="">{{ $t('dashboard.selectCryptocurrency') }}</option>
                              <option v-for="crypto in cryptoOptions" :key="crypto.value" :value="crypto.value">
                                {{ crypto.name }}
                              </option>
                            </select>
                          </div>

                          <div class="mb-4">
                            <label class="form-label text-white">{{ $t('dashboard.walletAddress') }}</label>
                            <input 
                              v-model="cryptoAddress"
                              type="text" 
                                class="form-control n11-bg text-white border-secondary" 
                              :placeholder="$t('dashboard.enterCryptoAddress')"
                              :disabled="withdrawalLoading"
                            />
                            <small class="text-white" style="opacity: 0.9;">
                              {{ $t('dashboard.addressWarning') }}
                            </small>
                          </div>

                          <div class="alert alert-warning">
                            {{ $t('dashboard.withdrawalReview') }}
                          </div>

                          <button 
                            class="btn btn-success w-100"
                            @click="submitWithdrawal"
                            :disabled="withdrawalLoading || parseFloat(withdrawalAmount) > walletBalance"
                          >
                            <span v-if="withdrawalLoading">{{ $t('dashboard.submitting') }}</span>
                            <span v-else>{{ $t('dashboard.submitWithdrawalRequest') }}</span>
                          </button>
                          </div>
                        </div>

                        <!-- ===================== -->
                        <!--    BANK TRANSFER      -->
                        <!-- ===================== -->
                        <div v-if="withdrawalMethod === 'bank_transfer'">
                          <div class="mb-3">
                            <label class="form-label text-white">Amount</label>
                            <input
                              v-model="withdrawalAmount"
                              type="number"
                              class="form-control n11-bg text-white border-secondary"
                              :min="getWithdrawalMinAmount()"
                              :max="getWithdrawalMaxAmount()"
                              placeholder="Enter amount"
                              :disabled="withdrawalLoading"
                            />
                            <small class="text-white" style="opacity: 0.9;">
                              Minimum: {{ getWithdrawalMinAmount() }} K — Maximum: {{ getWithdrawalMaxAmount() }} K
                            </small>
                          </div>

                          <div class="mb-3">
                            <label class="form-label text-white">{{ $t('dashboard.bankName') }}</label>
                            <input 
                              v-model="bankName"
                              type="text" 
                              class="form-control n11-bg text-white border-secondary" 
                              :placeholder="$t('dashboard.enterBankName')"
                              :disabled="withdrawalLoading"
                            />
                          </div>

                          <div class="mb-3">
                            <label class="form-label text-white">{{ $t('dashboard.accountNumber') }}</label>
                            <input 
                              v-model="accountNumber"
                              type="text" 
                              class="form-control n11-bg text-white border-secondary" 
                              :placeholder="$t('dashboard.enterAccountNumber')"
                              :disabled="withdrawalLoading"
                            />
                          </div>

                          <div class="mb-4">
                            <label class="form-label text-white">{{ $t('dashboard.accountHolderName') }}</label>
                            <input 
                              v-model="accountHolderName"
                              type="text" 
                              class="form-control n11-bg text-white border-secondary" 
                              :placeholder="$t('dashboard.enterAccountHolderName')"
                              :disabled="withdrawalLoading"
                            />
                          </div>

                          <div class="alert alert-warning">
                            {{ $t('dashboard.withdrawalReviewBank') }}
                          </div>

                          <button 
                            class="btn btn-success w-100"
                            @click="submitWithdrawal"
                            :disabled="withdrawalLoading || parseFloat(withdrawalAmount) > walletBalance"
                          >
                            <span v-if="withdrawalLoading">{{ $t('dashboard.submitting') }}</span>
                            <span v-else>{{ $t('dashboard.submitWithdrawalRequest') }}</span>
                          </button>
                        </div>

                        <!-- ===================== -->
                        <!--      MOBILE MONEY      -->
                        <!-- ===================== -->
                        <div v-if="withdrawalMethod === 'mobile_money'">
                          <div class="mb-3">
                            <label class="form-label text-white">Amount</label>
                            <input
                              v-model="withdrawalAmount"
                              type="number"
                              class="form-control n11-bg text-white border-secondary"
                              :min="getWithdrawalMinAmount()"
                              :max="getWithdrawalMaxAmount()"
                              placeholder="Enter amount"
                              :disabled="withdrawalLoading"
                            />
                            <small class="text-white" style="opacity: 0.9;">
                              Minimum: {{ getWithdrawalMinAmount() }} K — Maximum: {{ getWithdrawalMaxAmount() }} K
                            </small>
                          </div>

                          <div class="mb-3">
                            <label class="form-label text-white">{{ $t('dashboard.mobileMoneyProvider') }}</label>
                            <select
                              v-model="mobileMoneyProvider"
                              class="form-select n11-bg text-white border-secondary"
                              :disabled="withdrawalLoading"
                            >
                              <option value="">{{ $t('dashboard.selectProvider') }}</option>
                              <option v-for="provider in mobileMoneyProviders" :key="provider.value" :value="provider.value">
                                {{ provider.name }}
                              </option>
                            </select>
                          </div>

                          <div class="mb-4">
                            <label class="form-label text-white">{{ $t('dashboard.mobileMoneyNumber') }}</label>
                            <input 
                              v-model="mobileMoneyNumber"
                              type="text" 
                              class="form-control n11-bg text-white border-secondary" 
                              :placeholder="$t('dashboard.enterMobileMoneyNumber')"
                              :disabled="withdrawalLoading"
                            />
                            <small class="text-white" style="opacity: 0.9;">
                              {{ $t('dashboard.mobileMoneyHint') }}
                            </small>
                          </div>

                          <div class="alert alert-warning">
                            {{ $t('dashboard.withdrawalReviewMobile') }}
                          </div>

                          <button 
                            class="btn btn-success w-100"
                            @click="submitWithdrawal"
                            :disabled="withdrawalLoading || parseFloat(withdrawalAmount) > walletBalance"
                          >
                            <span v-if="withdrawalLoading">{{ $t('dashboard.submitting') }}</span>
                            <span v-else>{{ $t('dashboard.submitWithdrawalRequest') }}</span>
                          </button>
                        </div>

                        <!-- ===================== -->
                        <!--   AGENT WITHDRAWAL     -->
                        <!-- ===================== -->
                        <div v-if="withdrawalMethod === 'agent_withdrawal'">
                          <!-- Feedback message -->
                          <div v-if="withdrawalMessage" 
                               class="alert mb-4"
                               :class="withdrawalMessageType === 'success' ? 'alert-success' : 'alert-danger'">
                            {{ withdrawalMessage }}
                          </div>

                          <!-- Withdrawal Code Display Modal -->
                          <div v-if="showWithdrawalCode && generatedWithdrawalCode" class="mb-4 p-4 rounded-4" style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%);">
                            <h5 class="text-white mb-3">
                              <i class="fas fa-check-circle me-2"></i>
                              Withdrawal Code Generated!
                            </h5>
                            <div class="text-white">
                              <p class="mb-2"><strong>Code:</strong> 
                                <span class="bg-white text-success px-3 py-2 rounded font-monospace fs-5">
                                  {{ generatedWithdrawalCode.code }}
                                </span>
                                <button 
                                  id="copy-code-btn"
                                  @click="copyWithdrawalCode(generatedWithdrawalCode.code)"
                                  class="btn btn-sm btn-light ms-2"
                                >
                                  Copy Code
                                </button>
                              </p>
                              <p class="mb-2"><strong>Amount:</strong> {{ formatNumber(generatedWithdrawalCode.amountUSD || convertToUSD(generatedWithdrawalCode.amount)) }} EBT</p>
                              <p class="mb-2"><strong>Agent:</strong> {{ generatedWithdrawalCode.agent_name }}</p>
                              <p class="mb-2"><strong>Agent Phone:</strong> {{ generatedWithdrawalCode.agent_phone }}</p>
                              <p class="mb-2"><strong>Expires:</strong> {{ formatDate(generatedWithdrawalCode.expires_at) }}</p>
                            </div>
                            <div class="mt-3 p-3 bg-white bg-opacity-10 rounded">
                              <h6 class="text-white mb-2">Instructions:</h6>
                              <ol class="text-white small mb-0">
                                <li v-for="instruction in generatedWithdrawalCode.instructions" :key="instruction">
                                  {{ instruction }}
                                </li>
                              </ol>
                            </div>
                          </div>

                          <!-- Agent Selection Form -->
                          <div v-if="!showWithdrawalCode">
                            <!-- Solde disponible -->
                            <div class="mb-4 p-3 rounded-3" style="background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2);">
                              <h6 class="text-white mb-2">Available Balance</h6>
                              <div class="text-white fs-5 fw-bold">
                                {{ formatNumber(walletBalance) }} EBT
                              </div>
                            </div>

                            <div class="mb-4">
                              <label class="form-label text-white">Select Withdrawal Agent *</label>
                              <select
                                v-model="selectedWithdrawalAgent"
                                class="form-select n11-bg text-white border-secondary"
                                :disabled="withdrawalLoading"
                              >
                                <option :value="null">Choose an agent...</option>
                                <option 
                                  v-for="agent in withdrawalAgents" 
                                  :key="agent.id" 
                                  :value="agent"
                                >
                                  ID: {{ agent.agent_id }} - {{ agent.name }} ({{ agent.phone }})
                                </option>
                              </select>
                            </div>

                            <div class="mb-4">
                              <label class="form-label text-white">Withdrawal Amount (USD) *</label>
                              <input
                                v-model="withdrawalAmount"
                                type="number"
                                class="form-control n11-bg text-white border-secondary"
                                min="1"
                                max="10000"
                                placeholder="Enter amount (min: $1 USD)"
                                :disabled="withdrawalLoading"
                              />
                              <small class="text-white" style="opacity: 0.9;">
                                Minimum: $1 USD - Maximum: $10,000 USD
                              </small>
                              
                              <!-- Alert si solde insuffisant -->
                              <div v-if="withdrawalAmount && parseFloat(withdrawalAmount) > walletBalance" 
                                   class="alert alert-danger mt-2">
                                <i class="fas fa-exclamation-triangle me-2"></i>
                                Insufficient balance. Available: {{ formatNumber(walletBalance) }} EBT
                              </div>
                            </div>

                            <button
                              type="button"
                              class="btn btn-success w-100"
                              @click="generateWithdrawalCode"
                              :disabled="withdrawalLoading || !withdrawalAmount || !selectedWithdrawalAgent || (parseFloat(withdrawalAmount) > walletBalance)"
                            >
                              <span v-if="withdrawalLoading" class="spinner-border spinner-border-sm me-2"></span>
                              <span v-if="withdrawalLoading">Generating Code...</span>
                              <span v-else>Generate Withdrawal Code</span>
                            </button>
                          </div>
                        </div>

                      </div>
                    </TabPanel>

                    <!-- Balance history -->
                    <TabPanel>
                      <div class="pay_method__tabletwo">
                        <div class="pay_method__table-scrollbar overflow-x-auto">
                          <div v-if="loadingHistory" class="text-center py-5">
                            <div class="spinner-border text-primary" role="status">
                              <span class="visually-hidden">Loading...</span>
                            </div>
                          </div>
                          <table v-else class="w-100 text-center p2-bg">
                            <thead>
                              <tr>
                                <th class="text-white p-3">{{ $t('dashboard.id') }}</th>
                                <th class="text-white p-3">{{ $t('dashboard.date') }}</th>
                                <th class="text-white p-3">{{ $t('dashboard.type') }}</th>
                                <th class="text-white p-3">{{ $t('dashboard.method') }}</th>
                                <th class="text-white p-3">{{ $t('dashboard.amount') }}</th>
                                <th class="text-white p-3">{{ $t('dashboard.status') }}</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr v-for="transaction in transactionHistory" :key="`${transaction.type}-${transaction.id}`" class="border-top border-secondary">
                                <td class="text-white p-3">#{{ transaction.id }}</td>
                                <td class="text-white p-3">{{ formatDate(transaction.created_at) }}</td>
                                <td class="p-3">
                                  <span :class="['badge', transaction.type === 'deposit' ? 'bg-success' : 'bg-warning']">
                                    {{ transaction.type === 'deposit' ? $t('dashboard.deposit') : $t('dashboard.withdrawal') }}
                                  </span>
                                </td>
                                <td class="text-white p-3">{{ getMethodLabel(transaction) }}</td>
                                <td class="text-white p-3">{{ transaction.amount.toLocaleString() }} EBT</td>
                                <td class="p-3">
                                  <span :class="['badge', getStatusClass(transaction.status)]">
                                    {{ getStatusLabel(transaction.status) }}
                                  </span>
                                </td>
                              </tr>
                              <tr v-if="transactionHistory.length === 0">
                                <td colspan="6" class="text-white p-5 text-center">{{ $t('dashboard.noTransactionsFound') }}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </TabPanel>

                    <!-- Betting History -->
                    <TabPanel>
                      <div class="pay_method__paymethod p-4 p-lg-6 p2-bg rounded-8">
                        <div class="pay_method__paymethod-title mb-5 mb-md-6">
                          <h2 class="text-white fw-bold mb-2">{{ $t('dashboard.bettingHistory') }}</h2>
                          <p class="text-white-50">{{ $t('dashboard.bettingHistoryDesc') }}</p>
                        </div>

                        <div class="pay_method__tabletwo">
                          <div class="pay_method__table-scrollbar overflow-x-auto">
                            <div v-if="loadingBets" class="text-center py-5">
                              <div class="spinner-border text-primary" role="status">
                                <span class="visually-hidden">Loading...</span>
                              </div>
                            </div>
                            <table v-else class="w-100 text-center p2-bg">
                              <thead>
                                <tr>
                                  <th class="text-white p-3">{{ $t('dashboard.id') }}</th>
                                  <th class="text-white p-3">{{ $t('dashboard.date') }}</th>
                                  <th class="text-white p-3">{{ $t('dashboard.match') }}</th>
                                  <th class="text-white p-3">{{ $t('dashboard.betType') }}</th>
                                  <th class="text-white p-3">{{ $t('dashboard.amount') }}</th>
                                  <th class="text-white p-3">{{ $t('dashboard.odds') }}</th>
                                  <th class="text-white p-3">{{ $t('dashboard.potentialWin') }}</th>
                                  <th class="text-white p-3">{{ $t('dashboard.status') }}</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr v-for="bet in bettingHistory" :key="bet.id" class="border-top border-secondary">
                                  <td class="text-white p-3">#{{ bet.id }}</td>
                                  <td class="text-white p-3">{{ formatDate(bet.created_at) }}</td>
                                  <td class="text-white p-3">{{ getMatchName(bet) }}</td>
                                  <td class="text-white p-3">{{ getBetTypeLabel(bet.bet_type) }}</td>
                                  <td class="text-white p-3">{{ formatNumber(bet.amount) }} EBT</td>
                                  <td class="text-white p-3">{{ getBetOdds(bet) }}x</td>
                                  <td class="text-white p-3">{{ formatNumber(bet.potential_win || 0) }} EBT</td>
                                  <td class="p-3">
                                    <span :class="['badge', getBetStatusClass(bet.status)]">
                                      {{ getBetStatusLabel(bet.status) }}
                                    </span>
                                  </td>
                                </tr>
                                <tr v-if="bettingHistory.length === 0">
                                  <td colspan="8" class="text-white p-5 text-center">{{ $t('dashboard.noBets') }}</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </TabPanel>

                  </TabPanels>
                </div>

              </div>
            </TabGroup>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.agent-card {
  background: #ffffff;
  transition: all 0.3s ease;
}

.agent-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15) !important;
}

.agent-card:hover .hover-overlay {
  opacity: 1;
}

.agent-card:active {
  transform: translateY(-2px);
}

/* Dashboard tabs responsive layout - ONLY for mobile/tablet */
/* Desktop mode (xxl and above) remains completely unchanged */

/* Tablet and below - 2 columns with equal width */
@media (max-width: 1399px) {
  .dashboard-tab-item {
    flex: 0 0 calc(50% - 0.5rem) !important;
    width: calc(50% - 0.5rem) !important;
    max-width: calc(50% - 0.5rem) !important;
    display: inline-block;
  }
  
  .dashboard-tab-item .tablink {
    width: 100%;
    justify-content: center;
  }
}
</style>