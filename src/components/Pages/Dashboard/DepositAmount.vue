<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t } = useI18n();

import { ref } from "vue";
import { amountData } from "../../../assets/data/dashBoard";

const activeItem = ref();
const handleClick = (id: number) => {
  activeItem.value = id;
};
</script>

<template>
  <div class="pay_method__paymethod p-4 p-lg-6 p2-bg rounded-8">
    <div class="pay_method__paymethod-title mb-5 mb-md-6">
      <h5 class="n10-color">{{ $t('ui.choose_deposit_amount') }}</h5>
    </div>
    <div class="pay_method__paymethod-alitem mb-5 mb-md-6">
      <div
        class="pay_method__paymethod-items d-flex align-items-center gap-4 gap-sm-5 gap-md-6"
      >
        <div
          v-for="{ amount, bonus, id } in amountData"
          :key="id"
          @click="() => handleClick(id)"
          class="pay_method__paymethod-item amount-active p-2 rounded-3 cpoint"
          :class="activeItem == id ? 'border-one' : ''"
        >
          <div class="py-3 px-5 px-md-6 n11-bg rounded-3">
            <span class="fs-ten fw-bold mb-2">{{ amount }}</span>
            <span class="fs-seven d-block">{{ bonus }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="text-end mb-6 mb-md-8">
      <span>{{ $t('ui.min_3_000_max_3_060') }}</span>
    </div>
    <div class="pay_method__paymethod-title mb-5 mb-md-6">
      <h5 class="n10-color">{{ $t('ui.enter_your_payment_details') }}</h5>
    </div>
    <div class="pay_method__formarea">
      <form>
        <div
          class="d-flex align-items-center flex-wrap flex-md-nowrap gap-5 gap-md-6 mb-5"
        >
          <div class="d-flex w-100 p1-bg ps-3 rounded-8">
            <div class="d-flex align-items-center w-100">
              <i class="ti ti-credit-card fs-five"></i>
              <input
                type="text"
                id="card_number"
                name="card_number"
                :placeholder="$t('ui.card_number')"
              />
            </div>
            <div class="d-flex align-items-center justify-content-end">
              <input
                class="w-75"
                type="text"
                id="expiration"
                name="expiration"
                :placeholder="$t('ui.mm_yy_cvc')"
              />
            </div>
          </div>
          <div class="d-flex w-100 p1-bg rounded-8">
            <input type="text" :placeholder="$t('ui.street_address')" />
          </div>
        </div>
        <div
          class="d-flex align-items-center gap-5 gap-md-6 mb-5 flex-wrap flex-md-nowrap"
        >
          <div class="d-flex w-100 p1-bg rounded-8">
            <input
              type="text"
              :placeholder="$t('ui.apt_unit_suite_etc_optional')"
            />
          </div>
          <div class="d-flex w-100 p1-bg rounded-8">
            <input type="text" :placeholder="$t('ui.33_7_35_55_21_02')" />
          </div>
        </div>
        <div
          class="d-flex align-items-center gap-5 gap-md-6 mb-5 flex-wrap flex-md-nowrap"
        >
          <div class="d-flex p1-bg rounded-8 w-100">
            <input type="text" :placeholder="$t('ui.city')" />
          </div>
          <div class="d-flex align-items-center gap-6 w-100">
            <div class="d-flex p1-bg rounded-8 w-50">
              <input type="text" :placeholder="$t('ui.state')" />
            </div>
            <div class="d-flex p1-bg rounded-8 w-50">
              <input type="text" :placeholder="$t('ui.zip_code')" />
            </div>
          </div>
        </div>
        <div
          class="d-flex align-items-center justify-content-between mb-7 mb-md-10"
        >
          <span>{{ $t('betting.total') }}</span>
          <span>$3,000</span>
        </div>
        <button type="submit" class="py-4 px-5 n11-bg rounded-2 w-100">
          Deposit
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped></style>
