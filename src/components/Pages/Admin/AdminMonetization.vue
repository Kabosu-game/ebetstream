<template>
  <div class="admin-monetization">
    <div class="header">
      <h2>{{ $t('ui.monetization_program') }}</h2>
      <button class="btn-primary" @click="loadData" :disabled="loading">
        {{ loading ? "Loading..." : "Refresh" }}
      </button>
    </div>

    <div v-if="error" class="error">{{ error }}</div>

    <section class="card">
      <h3>{{ $t('ui.global_settings') }}</h3>
      <div class="settings-grid">
        <div class="setting-item" v-for="(value, key) in settingsMap" :key="key">
          <label>{{ key }}</label>
          <textarea v-model="settingsText[key]" rows="4"></textarea>
          <button class="btn-secondary" @click="saveSetting(key)">{{ $t('common.save') }}</button>
        </div>
      </div>
    </section>

    <section class="card">
      <div class="section-title">
        <h3>{{ $t('ui.streamer_tiers') }}</h3>
        <button class="btn-primary" @click="addStreamerTier">{{ $t('ui.add_tier') }}</button>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>{{ $t('common.name') }}</th>
              <th>{{ $t('ui.min_followers') }}</th>
              <th>{{ $t('ui.max_followers') }}</th>
              <th>{{ $t('ui.commission') }}</th>
              <th>{{ $t('ui.sort') }}</th>
              <th>{{ $t('common.active') }}</th>
              <th>{{ $t('common.actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="tier in streamerTiers" :key="tier.id">
              <td><input v-model="tier.name" /></td>
              <td><input type="number" v-model.number="tier.min_followers" /></td>
              <td><input type="number" v-model.number="tier.max_followers" /></td>
              <td><input type="number" step="0.01" v-model.number="tier.commission_percentage" /></td>
              <td><input type="number" v-model.number="tier.sort_order" /></td>
              <td><input type="checkbox" v-model="tier.is_active" /></td>
              <td class="actions">
                <button class="btn-secondary" @click="saveStreamerTier(tier)">{{ $t('common.save') }}</button>
                <button class="btn-danger" @click="removeStreamerTier(tier.id)">{{ $t('common.delete') }}</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="card">
      <div class="section-title">
        <h3>{{ $t('ui.agent_tiers') }}</h3>
        <button class="btn-primary" @click="addAgentTier">{{ $t('ui.add_tier') }}</button>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>{{ $t('common.name') }}</th>
              <th>{{ $t('ui.min_monthly_volume') }}</th>
              <th>{{ $t('ui.deposit') }}</th>
              <th>{{ $t('ui.withdrawal') }}</th>
              <th>{{ $t('ui.guarantee_amount') }}</th>
              <th>{{ $t('ui.sort') }}</th>
              <th>{{ $t('common.active') }}</th>
              <th>{{ $t('common.actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="tier in agentTiers" :key="tier.id">
              <td><input v-model="tier.name" /></td>
              <td><input type="number" step="0.01" v-model.number="tier.min_monthly_volume" /></td>
              <td><input type="number" step="0.01" v-model.number="tier.deposit_commission_percentage" /></td>
              <td><input type="number" step="0.01" v-model.number="tier.withdrawal_commission_percentage" /></td>
              <td><input type="number" step="0.01" v-model.number="tier.requires_guarantee_amount" /></td>
              <td><input type="number" v-model.number="tier.sort_order" /></td>
              <td><input type="checkbox" v-model="tier.is_active" /></td>
              <td class="actions">
                <button class="btn-secondary" @click="saveAgentTier(tier)">{{ $t('common.save') }}</button>
                <button class="btn-danger" @click="removeAgentTier(tier.id)">{{ $t('common.delete') }}</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t } = useI18n();

import { onMounted, reactive, ref } from "vue";
import apiClient from "@/utils/axios";

type GenericTier = Record<string, any>;

const loading = ref(false);
const error = ref("");
const streamerTiers = ref<GenericTier[]>([]);
const agentTiers = ref<GenericTier[]>([]);
const settingsMap = ref<Record<string, any>>({});
const settingsText = reactive<Record<string, string>>({});

const loadData = async () => {
  loading.value = true;
  error.value = "";
  try {
    const { data } = await apiClient.get("/admin/monetization");
    const payload = data?.data || {};
    streamerTiers.value = payload.streamer_tiers || [];
    agentTiers.value = payload.agent_tiers || [];

    const settings: Record<string, any> = {};
    (payload.settings || []).forEach((item: any) => {
      settings[item.setting_key] = item.setting_value || {};
    });
    settingsMap.value = settings;
    Object.keys(settings).forEach((key) => {
      settingsText[key] = JSON.stringify(settings[key], null, 2);
    });
  } catch (e: any) {
    error.value = e?.response?.data?.message || t('errors.loadMonetization');
  } finally {
    loading.value = false;
  }
};

const saveSetting = async (settingKey: string) => {
  try {
    const parsed = JSON.parse(settingsText[settingKey] || "{}");
    await apiClient.put(`/admin/monetization/settings/${settingKey}`, {
      setting_value: parsed,
    });
    await loadData();
  } catch {
    error.value = t('errors.invalidJson', { key: settingKey });
  }
};

const addStreamerTier = () => {
  streamerTiers.value.push({
    id: `new-${Date.now()}`,
    name: "",
    min_followers: 0,
    max_followers: null,
    commission_percentage: 0,
    sort_order: streamerTiers.value.length + 1,
    is_active: true,
  });
};

const saveStreamerTier = async (tier: GenericTier) => {
  const payload = {
    name: tier.name,
    min_followers: Number(tier.min_followers || 0),
    max_followers: tier.max_followers === "" ? null : tier.max_followers,
    commission_percentage: Number(tier.commission_percentage || 0),
    sort_order: Number(tier.sort_order || 0),
    is_active: !!tier.is_active,
  };
  if (String(tier.id).startsWith("new-")) {
    await apiClient.post("/admin/monetization/streamer-tiers", payload);
  } else {
    await apiClient.put(`/admin/monetization/streamer-tiers/${tier.id}`, payload);
  }
  await loadData();
};

const removeStreamerTier = async (id: number | string) => {
  if (String(id).startsWith("new-")) {
    streamerTiers.value = streamerTiers.value.filter((tier) => tier.id !== id);
    return;
  }
  await apiClient.delete(`/admin/monetization/streamer-tiers/${id}`);
  await loadData();
};

const addAgentTier = () => {
  agentTiers.value.push({
    id: `new-${Date.now()}`,
    name: "",
    min_monthly_volume: 0,
    deposit_commission_percentage: 0,
    withdrawal_commission_percentage: 0,
    requires_guarantee_amount: 0,
    sort_order: agentTiers.value.length + 1,
    is_active: true,
  });
};

const saveAgentTier = async (tier: GenericTier) => {
  const payload = {
    name: tier.name,
    min_monthly_volume: Number(tier.min_monthly_volume || 0),
    deposit_commission_percentage: Number(tier.deposit_commission_percentage || 0),
    withdrawal_commission_percentage: Number(tier.withdrawal_commission_percentage || 0),
    requires_guarantee_amount: Number(tier.requires_guarantee_amount || 0),
    sort_order: Number(tier.sort_order || 0),
    is_active: !!tier.is_active,
  };
  if (String(tier.id).startsWith("new-")) {
    await apiClient.post("/admin/monetization/agent-tiers", payload);
  } else {
    await apiClient.put(`/admin/monetization/agent-tiers/${tier.id}`, payload);
  }
  await loadData();
};

const removeAgentTier = async (id: number | string) => {
  if (String(id).startsWith("new-")) {
    agentTiers.value = agentTiers.value.filter((tier) => tier.id !== id);
    return;
  }
  await apiClient.delete(`/admin/monetization/agent-tiers/${id}`);
  await loadData();
};

onMounted(loadData);
</script>

<style scoped>
.admin-monetization {
  display: grid;
  gap: 1rem;
  color: #fff;
}
.header,
.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 1rem;
}
.settings-grid {
  display: grid;
  gap: 1rem;
}
.setting-item {
  display: grid;
  gap: 0.4rem;
}
.table-wrap {
  overflow-x: auto;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.5rem;
}
input,
textarea {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  border-radius: 6px;
  padding: 0.4rem;
}
.actions {
  display: flex;
  gap: 0.5rem;
}
.btn-primary,
.btn-secondary,
.btn-danger {
  border: none;
  border-radius: 6px;
  padding: 0.4rem 0.6rem;
  color: #fff;
  cursor: pointer;
}
.btn-primary {
  background: #2563eb;
}
.btn-secondary {
  background: #4b5563;
}
.btn-danger {
  background: #dc2626;
}
.error {
  color: #fca5a5;
}
</style>
