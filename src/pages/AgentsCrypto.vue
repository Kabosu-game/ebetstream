<template>
  <div class="tw-page">
    <div class="tw-page-hero">
      <p class="tw-page-hero__eyebrow"><i class="fas fa-network-wired"></i>{{ $t('ui.r_seau_agents_crypto') }}</p>
      <h1 class="tw-page-hero__title">{{ $t('ui.agents_officiels_ebetstream') }}</h1>
      <p class="tw-page-hero__sub">
        Partenaires certifiés capables de recharger via crypto, effectuer des dépôts internes
        et gérer les retraits avec sécurité et traçabilité totale.
      </p>
      <div class="tw-page-hero__actions">
        <router-link to="/become-agent" class="tw-btn tw-btn--primary"><i class="fas fa-user-plus"></i>{{ $t('ui.devenir_agent') }}</router-link>
        <router-link to="/agent-dashboard" class="tw-btn tw-btn--secondary"><i class="fas fa-tachometer-alt"></i>{{ $t('ui.tableau_de_bord_agent') }}</router-link>
      </div>
    </div>

    <div class="tw-grid-2 mb-4">
      <div class="tw-info-box"><i class="fas fa-shield-alt"></i><p>{{ $t('ui.recharge_uniquement_via_crypto_usdt_trc20_solde_agent_pr_pay') }}</p></div>
      <div class="tw-info-box"><i class="fas fa-exchange-alt"></i><p>{{ $t('ui.transferts_internes_tra_ables_lagent_ne_peut_jamais_d_passer') }}</p></div>
      <div class="tw-info-box"><i class="fas fa-lock"></i><p>{{ $t('ui.retraits_joueur_montant_bloqu_jusqu_validation_par_lagent') }}</p></div>
      <div class="tw-info-box"><i class="fas fa-star"></i><p>{{ $t('ui.syst_me_de_notation_et_3_niveaux_bronze_silver_gold') }}</p></div>
    </div>

    <div class="tw-section-header"><h2 class="tw-section-title">{{ $t('ui.comment_a_fonctionne') }}</h2></div>

    <div class="tw-steps mb-4">
      <div class="tw-step">
        <span class="tw-step__num">1</span>
        <div class="tw-step__body">
          <p class="tw-step__title">{{ $t('ui.lagent_recharge_son_compte') }}</p>
          <p class="tw-step__desc">{{ $t('ui.envoie_usdt_vers_le_wallet_ebetstream_validation_admin_solde') }}</p>
        </div>
      </div>
      <div class="tw-step">
        <span class="tw-step__num">2</span>
        <div class="tw-step__body">
          <p class="tw-step__title">{{ $t('ui.d_p_t_joueur_via_agent') }}</p>
          <p class="tw-step__desc">{{ $t('ui.le_joueur_paie_lagent_cash_mobile_money_lagent_cr_dite_le_co') }}</p>
        </div>
      </div>
      <div class="tw-step">
        <span class="tw-step__num">3</span>
        <div class="tw-step__body">
          <p class="tw-step__title">{{ $t('ui.retrait_via_agent') }}</p>
          <p class="tw-step__desc">{{ $t('ui.le_joueur_g_n_re_un_code_fonds_bloqu_s_lagent_remet_largent_') }}</p>
        </div>
      </div>
    </div>

    <div class="tw-grid-3">
      <div class="tw-card value-card" style="padding:1.25rem">
        <h4 class="tw-card__title">{{ $t('ui.agent_bronze') }}</h4>
        <p class="tw-card__sub">{{ $t('ui.petit_volume_2_d_p_ts_1_5_retraits') }}</p>
      </div>
      <div class="tw-card value-card" style="padding:1.25rem">
        <h4 class="tw-card__title">{{ $t('ui.agent_silver') }}</h4>
        <p class="tw-card__sub">{{ $t('ui.volume_moyen_commissions_major_es') }}</p>
      </div>
      <div class="tw-card value-card" style="padding:1.25rem">
        <h4 class="tw-card__title">{{ $t('ui.agent_gold') }}</h4>
        <p class="tw-card__sub">{{ $t('ui.gros_volume_zone_exclusive_possible') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t } = useI18n();

</script>

<style scoped>
.value-card { display: flex; flex-direction: column; gap: 0.5rem; }
</style>
