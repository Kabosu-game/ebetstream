<template>
  <div class="pay_method__paymethod p-3 p-md-4 p-lg-6 p2-bg rounded-8">
    <div class="pay_method__paymethod-title mb-5 mb-md-6 d-flex justify-content-between align-items-center flex-wrap gap-3">
      <div>
        <h2 class="text-white fw-bold mb-2">{{ $t('ui.payment_methods') }}</h2>
        <p class="text-white-50">{{ $t('ui.manage_available_deposit_and_withdrawal_methods') }}</p>
      </div>
      <div class="d-flex gap-2">
        <button class="btn_primary" @click="showCreateModal = true; paymentMethodType = 'deposit'">
          <i class="fas fa-plus me-2"  ></i>{{ $t('ui.add_deposit') }}</button>
        <button class="btn_secondary" @click="showCreateModal = true; paymentMethodType = 'withdrawal'">
          <i class="fas fa-plus me-2"  ></i>{{ $t('ui.add_withdrawal') }}</button>
      </div>
    </div>

    <!-- Tabs -->
    <div class="d-flex gap-2 mb-4">
      <button 
        class="btn_tab" 
        :class="{ 'active': activeTab === 'deposits' }"
        @click="activeTab = 'deposits'"
      >
        <i class="fas fa-wallet me-2"  ></i>{{ $t('ui.deposit_methods') }}</button>
      <button 
        class="btn_tab" 
        :class="{ 'active': activeTab === 'withdrawals' }"
        @click="activeTab = 'withdrawals'"
      >
        <i class="fas fa-credit-card me-2"  ></i>{{ $t('ui.withdrawal_methods') }}</button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">{{ $t('common.loading') }}</span>
      </div>
    </div>

    <!-- Payment Methods List -->
    <div v-else class="row g-4">
      <div 
        v-for="method in filteredMethods" 
        :key="method.id"
        class="col-md-6 col-lg-4"
      >
        <div class="method_card n11-bg rounded-8 p-4 h-100">
          <div class="d-flex justify-content-between align-items-start mb-3">
            <div class="method_icon">
              <i :class="`${getMethodIcon(method.name)} text_gradient fs-1`"></i>
            </div>
            <div class="d-flex gap-2">
              <button 
                class="btn btn-sm btn-outline-warning p-1"
                @click="editMethod(method)"
                title="Edit"
              >
                <IconPencil />
              </button>
              <button 
                class="btn btn-sm btn-outline-danger p-1"
                @click="deleteMethod(method.id)"
                title="Delete"
              >
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
          <h4 class="text-white mb-2">{{ method.name }}</h4>
          <p class="text-white-50 small mb-3">{{ method.description || 'No description' }}</p>
          <div class="d-flex flex-wrap gap-2 mb-3">
            <span :class="['badge', method.is_active ? 'bg-success' : 'bg-secondary']">
              {{ method.is_active ? 'Active' : 'Inactive' }}
            </span>
            <span class="badge bg-info">{{ method.type === 'deposit' ? 'Deposit' : 'Withdrawal' }}</span>
          </div>
          <div v-if="method.method_key" class="mb-2">
            <span class="badge bg-secondary small">{{ method.method_key }}</span>
          </div>
          <div v-if="method.crypto_address" class="method_info mb-2">
            <p class="text-white-50 small mb-0">
              <strong>{{ $t('ui.address') }}</strong> 
              <span class="text-white" style="font-family: monospace; font-size: 0.75rem;">
                {{ method.crypto_address.substring(0, 20) }}...
              </span>
            </p>
          </div>
          <div v-if="method.mobile_money_provider" class="method_info mb-2">
            <p class="text-white-50 small mb-0">
              <strong>{{ $t('ui.provider') }}</strong> {{ method.mobile_money_provider }}
            </p>
          </div>
          <div v-if="method.min_amount || method.max_amount" class="method_limits">
            <p class="text-white-50 small mb-0">
              <strong>{{ $t('ui.limits') }}</strong> 
              <span v-if="method.min_amount">Min: ${{ method.min_amount }}</span>
              <span v-if="method.min_amount && method.max_amount"> - </span>
              <span v-if="method.max_amount">Max: ${{ method.max_amount }}</span>
            </p>
          </div>
          <div v-if="method.fee_percentage || method.fee_fixed" class="method_fees mt-2">
            <p class="text-white-50 small mb-0">
              <strong>{{ $t('ui.fees') }}</strong>
              <span v-if="method.fee_percentage">{{ method.fee_percentage }}%</span>
              <span v-if="method.fee_percentage && method.fee_fixed"> + </span>
              <span v-if="method.fee_fixed">${{ method.fee_fixed }}</span>
            </p>
          </div>
        </div>
      </div>
      <div v-if="filteredMethods.length === 0" class="col-12">
        <div class="text-center py-5">
          <p class="text-white-50">No {{ activeTab === 'deposits' ? 'deposit' : 'withdrawal' }} methods available</p>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showCreateModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content n11-bg rounded-8 p-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h3 class="text-white mb-0">
            {{ editingMethod ? 'Edit' : 'Add' }} Payment Method
          </h3>
          <button class="btn-close btn-close-white" @click="closeModal"></button>
        </div>

        <form @submit.prevent="saveMethod">
          <div class="form-group mb-3">
            <label class="text-white mb-2 d-block">{{ $t('common.type') }}</label>
            <select 
              v-model="formData.type" 
              class="form-select n11-bg text-white border-secondary"
              required
              :disabled="!!editingMethod"
            >
              <option value="deposit">{{ $t('ui.deposit_2') }}</option>
              <option value="withdrawal">{{ $t('ui.withdrawal_2') }}</option>
            </select>
          </div>

          <div class="form-group mb-3">
            <label class="text-white mb-2 d-block">{{ $t('ui.method_name') }}</label>
            <input 
              v-model="formData.name" 
              type="text" 
              class="form-control n11-bg text-white border-secondary" 
              :placeholder="$t('ui.formdata_type_deposit_ex_usdt_trc20_bitcoin_cash_ex_usdt_trc')"
              required
            />
            <small class="text-white-50 d-block mt-1">
              <span v-if="formData.type === 'deposit'">
                For deposits: crypto (USDT, Bitcoin, Ethereum) or Cash
              </span>
              <span v-else>
                For withdrawals: crypto, bank_transfer, or mobile_money (MTN, Orange, Moov)
              </span>
            </small>
          </div>

          <div class="form-group mb-3">
            <label class="text-white mb-2 d-block">{{ $t('ui.method_key') }}</label>
            <select 
              v-model="formData.method_key" 
              class="form-select n11-bg text-white border-secondary"
              required
            >
              <option v-if="formData.type === 'deposit'" value="crypto">{{ $t('ui.crypto') }}</option>
              <option v-if="formData.type === 'deposit'" value="cash">{{ $t('ui.cash_agents') }}</option>
              <option v-if="formData.type === 'withdrawal'" value="crypto">{{ $t('ui.crypto') }}</option>
              <option v-if="formData.type === 'withdrawal'" value="bank_transfer">{{ $t('ui.bank_transfer') }}</option>
              <option v-if="formData.type === 'withdrawal'" value="mobile_money">{{ $t('ui.mobile_money') }}</option>
            </select>
            <small class="text-white-50 d-block mt-1">
              Method type used in the system
            </small>
          </div>

          <div class="form-group mb-3">
            <label class="text-white mb-2 d-block">{{ $t('common.description') }}</label>
            <textarea 
              v-model="formData.description" 
              class="form-control n11-bg text-white border-secondary" 
              rows="3"
              :placeholder="$t('ui.payment_method_description')"
            ></textarea>
          </div>

          <!-- Crypto specific fields -->
          <div v-if="formData.method_key === 'crypto'" class="row g-3 mb-3">
            <div class="col-md-6">
              <label class="text-white mb-2 d-block">{{ $t('ui.crypto_address_for_deposits') }}</label>
              <input 
                v-model="formData.crypto_address" 
                type="text" 
                class="form-control n11-bg text-white border-secondary" 
                :placeholder="$t('ui.ex_tsf7x19gfn72jk4ah4rwvyugxvyt5hmwqc')"
              />
              <small class="text-white-50 d-block mt-1">
                Wallet address for crypto deposits
              </small>
            </div>
            <div class="col-md-6">
              <label class="text-white mb-2 d-block">{{ $t('ui.network') }}</label>
              <input 
                v-model="formData.crypto_network" 
                type="text" 
                class="form-control n11-bg text-white border-secondary" 
                :placeholder="$t('ui.ex_tron_ethereum_bitcoin')"
              />
            </div>
          </div>

          <!-- Mobile Money specific fields -->
          <div v-if="formData.method_key === 'mobile_money'" class="form-group mb-3">
            <label class="text-white mb-2 d-block">{{ $t('ui.mobile_money_provider') }}</label>
            <select 
              v-model="formData.mobile_money_provider" 
              class="form-select n11-bg text-white border-secondary"
            >
              <option value="">{{ $t('ui.select_a_provider') }}</option>
              <option value="MTN">{{ $t('ui.mtn_mobile_money') }}</option>
              <option value="Orange">{{ $t('ui.orange_money') }}</option>
              <option value="Moov">{{ $t('ui.moov_money') }}</option>
            </select>
          </div>

          <!-- Bank Transfer specific fields -->
          <div v-if="formData.method_key === 'bank_transfer'" class="form-group mb-3">
            <label class="text-white mb-2 d-block">{{ $t('ui.bank_name_optional') }}</label>
            <input 
              v-model="formData.bank_name" 
              type="text" 
              class="form-control n11-bg text-white border-secondary" 
              :placeholder="$t('ui.ex_bank_of_america_bnp_paribas')"
            />
          </div>

          <div class="row g-3 mb-3">
            <div class="col-md-6">
              <label class="text-white mb-2 d-block">{{ $t('ui.minimum_amount') }}</label>
              <input 
                v-model.number="formData.min_amount" 
                type="number" 
                step="0.01"
                class="form-control n11-bg text-white border-secondary" 
                placeholder="0.00"
              />
            </div>
            <div class="col-md-6">
              <label class="text-white mb-2 d-block">{{ $t('ui.maximum_amount') }}</label>
              <input 
                v-model.number="formData.max_amount" 
                type="number" 
                step="0.01"
                class="form-control n11-bg text-white border-secondary" 
                placeholder="0.00"
              />
            </div>
          </div>

          <div class="row g-3 mb-3">
            <div class="col-md-6">
              <label class="text-white mb-2 d-block">{{ $t('ui.fee_percentage') }}</label>
              <input 
                v-model.number="formData.fee_percentage" 
                type="number" 
                step="0.01"
                class="form-control n11-bg text-white border-secondary" 
                placeholder="0.00"
              />
            </div>
            <div class="col-md-6">
              <label class="text-white mb-2 d-block">{{ $t('ui.fixed_fee') }}</label>
              <input 
                v-model.number="formData.fee_fixed" 
                type="number" 
                step="0.01"
                class="form-control n11-bg text-white border-secondary" 
                placeholder="0.00"
              />
            </div>
          </div>

          <div class="form-group mb-4">
            <div class="form-check">
              <input 
                v-model="formData.is_active" 
                class="form-check-input" 
                type="checkbox" 
                id="isActive"
              />
              <label class="form-check-label text-white" for="isActive">
                Active Method
              </label>
            </div>
          </div>

          <div class="d-flex gap-2 justify-content-end">
            <button type="button" class="btn_secondary" @click="closeModal">
              Cancel
            </button>
            <button type="submit" class="btn_primary" :disabled="saving">
              <span v-if="!saving">{{ editingMethod ? 'Update' : 'Add' }}</span>
              <span v-else>
                <i class="fas fa-spinner fa-spin me-2"></i>{{ $t('common.saving') }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t } = useI18n();

import { ref, computed, onMounted } from 'vue';
import apiClient from '@/utils/axios';
interface PaymentMethod {
  id: number;
  name: string;
  description?: string;
  type: 'deposit' | 'withdrawal';
  method_key?: string; // crypto, cash, bank_transfer, mobile_money
  is_active: boolean;
  min_amount?: number;
  max_amount?: number;
  fee_percentage?: number;
  fee_fixed?: number;
  // Crypto specific
  crypto_address?: string;
  crypto_network?: string;
  // Mobile money specific
  mobile_money_provider?: string; // MTN, Orange, Moov
  // Bank transfer specific
  bank_name?: string;
}

const paymentMethods = ref<PaymentMethod[]>([]);
const loading = ref(false);
const saving = ref(false);
const activeTab = ref<'deposits' | 'withdrawals'>('deposits');
const showCreateModal = ref(false);
const editingMethod = ref<PaymentMethod | null>(null);
const paymentMethodType = ref<'deposit' | 'withdrawal'>('deposit');

const formData = ref({
  type: 'deposit' as 'deposit' | 'withdrawal',
  name: '',
  description: '',
  method_key: 'crypto' as 'crypto' | 'cash' | 'bank_transfer' | 'mobile_money',
  is_active: true,
  min_amount: undefined as number | undefined,
  max_amount: undefined as number | undefined,
  fee_percentage: undefined as number | undefined,
  fee_fixed: undefined as number | undefined,
  // Crypto specific
  crypto_address: '',
  crypto_network: '',
  // Mobile money specific
  mobile_money_provider: '',
  // Bank transfer specific
  bank_name: '',
});

const filteredMethods = computed(() => {
  return paymentMethods.value.filter(m => m.type === activeTab.value.slice(0, -1));
});

const getMethodIcon = (name: string) => {
  const nameLower = name.toLowerCase();
  if (nameLower.includes('usdt')) return 'fab fa-bitcoin';
  if (nameLower.includes('bitcoin') || nameLower.includes('btc')) return 'fab fa-bitcoin';
  if (nameLower.includes('ethereum') || nameLower.includes('eth')) return 'fab fa-ethereum';
  if (nameLower.includes('crypto')) return 'fab fa-bitcoin';
  if (nameLower.includes('cash') || nameLower.includes('agent')) return 'fas fa-money-bill-wave';
  if (nameLower.includes('bank') || nameLower.includes('transfer') || nameLower.includes('virement')) return 'fas fa-university';
  if (nameLower.includes('mtn')) return 'fas fa-mobile-alt';
  if (nameLower.includes('orange')) return 'fas fa-mobile-alt';
  if (nameLower.includes('moov')) return 'fas fa-mobile-alt';
  if (nameLower.includes('mobile') || nameLower.includes('money')) return 'fas fa-mobile-alt';
  return 'fas fa-wallet';
};

const loadPaymentMethods = async () => {
  try {
    loading.value = true;
    const response = await apiClient.get('/admin/payment-methods');
    if (response.data.success) {
      paymentMethods.value = response.data.data || [];
    }
  } catch (err: any) {
    console.error('Error loading payment methods:', err);
    // En cas d'erreur, utiliser des données de démonstration
    paymentMethods.value = getDefaultMethods();
  } finally {
    loading.value = false;
  }
};

const getDefaultMethods = (): PaymentMethod[] => {
  return [
    // Deposit Methods
    {
      id: 1,
      name: 'USDT (TRC20)',
      description: t('admin.depositUsdtTron'),
      type: 'deposit',
      method_key: 'crypto',
      is_active: true,
      min_amount: 5,
      max_amount: 10000,
      fee_percentage: 0,
      crypto_address: 'TSf7x19gfn72Jk4Ah4RWVYuGxvYt5HMWqc',
      crypto_network: 'TRON',
    },
    {
      id: 2,
      name: 'USDT (ERC20)',
      description: t('admin.depositUsdtEthereum'),
      type: 'deposit',
      method_key: 'crypto',
      is_active: true,
      min_amount: 5,
      max_amount: 10000,
      fee_percentage: 0,
      crypto_network: 'Ethereum',
    },
    {
      id: 3,
      name: 'Bitcoin (BTC)',
      description: t('admin.depositBitcoin'),
      type: 'deposit',
      method_key: 'crypto',
      is_active: true,
      min_amount: 20,
      max_amount: 20000,
      fee_percentage: 1,
      crypto_network: 'Bitcoin',
    },
    {
      id: 4,
      name: 'Ethereum (ETH)',
      description: t('admin.depositEthereum'),
      type: 'deposit',
      method_key: 'crypto',
      is_active: true,
      min_amount: 20,
      max_amount: 20000,
      fee_percentage: 1,
      crypto_network: 'Ethereum',
    },
    {
      id: 5,
      name: 'Cash (Agents)',
      description: t('admin.depositCashAgents'),
      type: 'deposit',
      method_key: 'cash',
      is_active: true,
      min_amount: 10,
      max_amount: 5000,
      fee_percentage: 0,
    },
    // Withdrawal Methods
    {
      id: 6,
      name: 'USDT (TRC20)',
      description: t('admin.withdrawUsdtTron'),
      type: 'withdrawal',
      method_key: 'crypto',
      is_active: true,
      min_amount: 10,
      max_amount: 50000,
      fee_percentage: 1,
    },
    {
      id: 7,
      name: 'USDT (ERC20)',
      description: t('admin.withdrawUsdtEthereum'),
      type: 'withdrawal',
      method_key: 'crypto',
      is_active: true,
      min_amount: 10,
      max_amount: 50000,
      fee_percentage: 1.5,
    },
    {
      id: 8,
      name: 'Bitcoin (BTC)',
      description: 'Retrait via Bitcoin',
      type: 'withdrawal',
      method_key: 'crypto',
      is_active: true,
      min_amount: 20,
      max_amount: 50000,
      fee_percentage: 2,
    },
    {
      id: 9,
      name: 'Ethereum (ETH)',
      description: 'Retrait via Ethereum',
      type: 'withdrawal',
      method_key: 'crypto',
      is_active: true,
      min_amount: 20,
      max_amount: 50000,
      fee_percentage: 2,
    },
    {
      id: 10,
      name: 'Virement Bancaire',
      description: 'Retrait par virement bancaire',
      type: 'withdrawal',
      method_key: 'bank_transfer',
      is_active: true,
      min_amount: 50,
      max_amount: 50000,
      fee_fixed: 5,
    },
    {
      id: 11,
      name: 'MTN Mobile Money',
      description: 'Retrait via MTN Mobile Money',
      type: 'withdrawal',
      method_key: 'mobile_money',
      is_active: true,
      min_amount: 10,
      max_amount: 5000,
      fee_percentage: 2,
      mobile_money_provider: 'MTN',
    },
    {
      id: 12,
      name: 'Orange Money',
      description: 'Retrait via Orange Money',
      type: 'withdrawal',
      method_key: 'mobile_money',
      is_active: true,
      min_amount: 10,
      max_amount: 5000,
      fee_percentage: 2,
      mobile_money_provider: 'Orange',
    },
    {
      id: 13,
      name: 'Moov Money',
      description: 'Retrait via Moov Money',
      type: 'withdrawal',
      method_key: 'mobile_money',
      is_active: true,
      min_amount: 10,
      max_amount: 5000,
      fee_percentage: 2,
      mobile_money_provider: 'Moov',
    },
  ];
};

const editMethod = (method: PaymentMethod) => {
  editingMethod.value = method;
  formData.value = {
    type: method.type,
    name: method.name,
    description: method.description || '',
    method_key: (method.method_key || (method.type === 'deposit' ? 'crypto' : 'crypto')) as 'crypto' | 'cash' | 'bank_transfer' | 'mobile_money',
    is_active: method.is_active,
    min_amount: method.min_amount,
    max_amount: method.max_amount,
    fee_percentage: method.fee_percentage,
    fee_fixed: method.fee_fixed,
    crypto_address: method.crypto_address || '',
    crypto_network: method.crypto_network || '',
    mobile_money_provider: method.mobile_money_provider || '',
    bank_name: method.bank_name || '',
  };
  showCreateModal.value = true;
};

const deleteMethod = async (id: number) => {
  if (!confirm('Are you sure you want to delete this payment method?')) return;
  
  try {
    await apiClient.delete(`/admin/payment-methods/${id}`);
    await loadPaymentMethods();
  } catch (err: any) {
    alert(err.response?.data?.message || t('errors.deletePaymentMethod'));
  }
};

const saveMethod = async () => {
  try {
    saving.value = true;
    
    if (editingMethod.value) {
      // Update
      await apiClient.put(`/admin/payment-methods/${editingMethod.value.id}`, formData.value);
    } else {
      // Create
      await apiClient.post('/admin/payment-methods', formData.value);
    }
    
    await loadPaymentMethods();
    closeModal();
  } catch (err: any) {
    alert(err.response?.data?.message || t('errors.savePaymentMethod'));
  } finally {
    saving.value = false;
  }
};

const closeModal = () => {
  showCreateModal.value = false;
  editingMethod.value = null;
  formData.value = {
    type: paymentMethodType.value,
    name: '',
    description: '',
    method_key: paymentMethodType.value === 'deposit' ? 'crypto' : 'crypto',
    is_active: true,
    min_amount: undefined,
    max_amount: undefined,
    fee_percentage: undefined,
    fee_fixed: undefined,
    crypto_address: '',
    crypto_network: '',
    mobile_money_provider: '',
    bank_name: '',
  };
};

onMounted(() => {
  loadPaymentMethods();
});
</script>

<style scoped>
.method_card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.method_card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  border-color: rgba(255, 159, 0, 0.3);
}

.btn_tab {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.8);
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.btn_tab:hover {
  background: rgba(255, 159, 0, 0.1);
  border-color: #FF9F00;
  color: #FF9F00;
}

.btn_tab.active {
  background: linear-gradient(135deg, #FF9F00 0%, #FF8C00 100%);
  border-color: #FF9F00;
  color: #000;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
}

.modal-content {
  background: rgba(26, 31, 58, 0.95);
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.text_gradient {
  background: linear-gradient(90deg, #FF9F00, #FF9F00);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.btn_primary {
  background: linear-gradient(135deg, #FFD700, #FF9F00);
  color: #000;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  transition: 0.3s;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
}

.btn_primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(255, 159, 0, 0.4);
}

.btn_primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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
  display: inline-flex;
  align-items: center;
}

.btn_secondary:hover {
  background: rgba(255, 159, 0, 0.1);
}
</style>

