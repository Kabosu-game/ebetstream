<template>
  <div class="pay_method__paymethod-alitem mb-5 mb-md-6">
    <form>
      <div
        class="pay_method__paymethod-items d-flex align-items-center gap-4 gap-sm-5 gap-md-6 mb-6"
      >
        <div
          v-for="{ id, ammounts } in dashboardAmmount"
          :key="id"
          class="pay_method__paymethod-item p-2 rounded-3 cpoint"
          :class="activeItem == id ? 'border-one' : ''"
          @click="() => handleClick(id)"
        >
          <div class="py-3 px-5 px-md-6 n11-bg rounded-3">
            <span class="fs-ten fw-bold">{{ ammounts }}</span>
          </div>
        </div>
      </div>
      <button type="submit" class="py-4 px-5 n11-bg rounded-2 w-100">
        Withdrawal $7,000
      </button>
    </form>
    <div class="text-center mt-4">
      <span>{{ $t('ui.your_withdrawal_limit_on_month_50_000') }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t } = useI18n();

import { ref } from "vue";
import { dashboardAmmount } from "../../../assets/data/dashBoard";

const activeItem = ref();
const handleClick = (id: number) => {
  activeItem.value = id;
};
</script>

<style scoped></style>
