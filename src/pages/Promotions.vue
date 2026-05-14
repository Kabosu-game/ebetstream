<template>
  <div class="tw-page">
    <!-- Section header -->
    <div class="tw-section-header">
      <div class="tw-section-title">
        <span class="tw-section-icon"><i class="fas fa-gift"></i></span>
        Promotions &amp; Bonuses
      </div>
    </div>

    <!-- Promotions grid -->
    <div class="tw-grid-3">
      <div
        v-for="{ id, imgSrc, title, bonusvalue } in promotionData"
        :key="id"
        class="tw-card promo-card"
      >
        <!-- Promo image -->
        <div class="promo-card__thumb">
          <img :src="imgSrc" :alt="$t('ui.title_3')" />
          <div class="promo-card__overlay"></div>
        </div>

        <!-- Card body -->
        <div class="tw-card__body promo-card__body">
          <h3 class="tw-card__title promo-card__title">{{ title }}</h3>
          <span class="promo-card__bonus">{{ bonusvalue }}</span>
          <button type="button" class="tw-btn tw-btn--primary promo-card__cta">
            <i class="fas fa-bolt"></i>
            Get Bonus
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t } = useI18n();

import { promotionData } from "../assets/data/allPageData";
</script>

<style scoped>
/* ── Promotion card ── */
.promo-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 0;
}

/* Thumb */
.promo-card__thumb {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: rgb(var(--p3));
}

.promo-card__thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.35s ease;
}

.promo-card:hover .promo-card__thumb img {
  transform: scale(1.05);
}

.promo-card__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(var(--p1), 0.85) 0%, transparent 60%);
}

/* Body */
.promo-card__body {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.25rem;
}

.promo-card__title {
  font-size: 1rem;
  font-weight: 700;
  margin: 0;
}

.promo-card__bonus {
  font-size: 1.5rem;
  font-weight: 800;
  color: rgb(var(--g1));
  line-height: 1.2;
  letter-spacing: -0.5px;
}

.promo-card__cta {
  margin-top: 0.25rem;
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.85rem;
}
</style>
