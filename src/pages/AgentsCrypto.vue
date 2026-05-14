<template>
  <div class="tw-page">
    <div class="tw-page-hero">
      <p class="tw-page-hero__eyebrow"><i class="fas fa-network-wired"></i> Réseau Agents Crypto</p>
      <h1 class="tw-page-hero__title">Agents officiels EBETSTREAM</h1>
      <p class="tw-page-hero__sub">
        Partenaires certifiés capables de recharger via crypto, effectuer des dépôts internes
        et gérer les retraits avec sécurité et traçabilité totale.
      </p>
      <div class="tw-page-hero__actions">
        <router-link to="/become-agent" class="tw-btn tw-btn--primary"><i class="fas fa-user-plus"></i> Devenir Agent</router-link>
        <router-link to="/agent-dashboard" class="tw-btn tw-btn--secondary"><i class="fas fa-tachometer-alt"></i> Tableau de bord Agent</router-link>
      </div>
    </div>

    <div class="tw-grid-2 mb-4">
      <div class="tw-info-box"><i class="fas fa-shield-alt"></i><p>Recharge uniquement via crypto (USDT TRC20) — solde agent prépayé</p></div>
      <div class="tw-info-box"><i class="fas fa-exchange-alt"></i><p>Transferts internes traçables — l'agent ne peut jamais dépasser son solde</p></div>
      <div class="tw-info-box"><i class="fas fa-lock"></i><p>Retraits joueur : montant bloqué jusqu'à validation par l'agent</p></div>
      <div class="tw-info-box"><i class="fas fa-star"></i><p>Système de notation et 3 niveaux : Bronze, Silver, Gold</p></div>
    </div>

    <div class="tw-section-header"><h2 class="tw-section-title">Comment ça fonctionne</h2></div>

    <div class="tw-steps mb-4">
      <div class="tw-step">
        <span class="tw-step__num">1</span>
        <div class="tw-step__body">
          <p class="tw-step__title">L'agent recharge son compte</p>
          <p class="tw-step__desc">Envoie USDT vers le wallet EBETSTREAM → validation admin → solde agent crédité.</p>
        </div>
      </div>
      <div class="tw-step">
        <span class="tw-step__num">2</span>
        <div class="tw-step__body">
          <p class="tw-step__title">Dépôt joueur via agent</p>
          <p class="tw-step__desc">Le joueur paie l'agent (cash/mobile money) → l'agent crédite le compte joueur en EBT depuis son solde.</p>
        </div>
      </div>
      <div class="tw-step">
        <span class="tw-step__num">3</span>
        <div class="tw-step__body">
          <p class="tw-step__title">Retrait via agent</p>
          <p class="tw-step__desc">Le joueur génère un code → fonds bloqués → l'agent remet l'argent et valide → solde agent crédité.</p>
        </div>
      </div>
    </div>

    <div class="tw-grid-3">
      <div class="tw-card value-card" style="padding:1.25rem">
        <h4 class="tw-card__title">Agent Bronze</h4>
        <p class="tw-card__sub">Petit volume — 2% dépôts / 1.5% retraits</p>
      </div>
      <div class="tw-card value-card" style="padding:1.25rem">
        <h4 class="tw-card__title">Agent Silver</h4>
        <p class="tw-card__sub">Volume moyen — commissions majorées</p>
      </div>
      <div class="tw-card value-card" style="padding:1.25rem">
        <h4 class="tw-card__title">Agent Gold</h4>
        <p class="tw-card__sub">Gros volume — zone exclusive possible</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.value-card { display: flex; flex-direction: column; gap: 0.5rem; }
</style>
