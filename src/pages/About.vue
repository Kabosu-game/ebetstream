<template>
  <div class="tw-page">
    <!-- Hero -->
    <div class="tw-page-hero">
      <p class="tw-page-hero__eyebrow">
        <i class="fas fa-info-circle"></i>{{ $t('ui.ebetstream_investor_pitch') }}</p>
      <h1 class="tw-page-hero__title">
        Plateforme de Streaming Compétitif et d'Engagement Communautaire
      </h1>
      <p class="tw-page-hero__sub">
        Ebetstream est une plateforme numérique innovante dédiée au streaming compétitif
        et à l'interaction entre créateurs de contenu gaming et leur communauté.
      </p>
      <div class="about-tagline">
        <span>{{ $t('ui.play') }}</span>
        <span>{{ $t('ui.stream') }}</span>
        <span class="about-tagline__accent">{{ $t('ui.bet_2') }}</span>
        <span>{{ $t('ui.win') }}</span>
      </div>
    </div>

    <!-- Présentation -->
    <div class="tw-content-block about-mission">
      <div class="about-mission__icon">
        <i class="fas fa-broadcast-tower"></i>
      </div>
      <div class="about-mission__body">
        <h2 class="about-mission__heading">{{ $t('ui.pr_sentation_g_n_rale') }}</h2>
        <p class="about-mission__text">
          Elle permet aux joueurs (streamers) de partager leurs performances en direct,
          de développer leur audience et de générer des revenus grâce à leur talent,
          leur régularité et leur capacité à engager leur public.
        </p>
        <p class="about-mission__text">
          Ebetstream s'inscrit dans une nouvelle génération de plateformes digitales où
          le divertissement interactif, la performance et la communauté se rencontrent
          pour créer une expérience immersive et dynamique.
        </p>
      </div>
    </div>

    <!-- Objectif -->
    <div class="tw-section-header">
      <div class="tw-section-header__left">
        <span class="tw-section-icon"><i class="fas fa-bullseye"></i></span>
        <h2 class="tw-section-title">{{ $t('ui.objectif_de_la_plateforme') }}</h2>
      </div>
    </div>

    <div class="tw-grid-2 about-goals">
      <div class="tw-info-box">
        <i class="fas fa-star"></i>
        <p>{{ $t('ui.valoriser_les_comp_tences_des_joueurs') }}</p>
      </div>
      <div class="tw-info-box">
        <i class="fas fa-shield-alt"></i>
        <p>{{ $t('ui.offrir_un_espace_de_diffusion_comp_titif_s_curis') }}</p>
      </div>
      <div class="tw-info-box">
        <i class="fas fa-comments"></i>
        <p>{{ $t('ui.encourager_linteraction_positive_entre_cr_ateurs_et_spectate') }}</p>
      </div>
      <div class="tw-info-box">
        <i class="fas fa-chart-line"></i>
        <p>{{ $t('ui.cr_er_un_cosyst_me_digital_bas_sur_la_performance_et_lengage') }}</p>
      </div>
    </div>

    <p class="about-note">
      La plateforme met l'accent sur le divertissement, la compétition saine et la création
      de valeur autour du contenu gaming.
    </p>

    <!-- Fonctionnalités clés -->
    <div class="tw-section-header" style="margin-top: 2rem;">
      <div class="tw-section-header__left">
        <span class="tw-section-icon"><i class="fas fa-puzzle-piece"></i></span>
        <h2 class="tw-section-title">{{ $t('ui.fonctionnalit_s_cl_s') }}</h2>
      </div>
    </div>

    <div class="tw-grid-2">
      <div class="tw-card value-card">
        <span class="value-card__icon"><i class="fas fa-video"></i></span>
        <h4 class="tw-card__title">{{ $t('ui.streaming_en_direct') }}</h4>
        <p class="tw-card__sub">
          Diffusez vos parties en temps réel et interagissez avec votre audience via chat et réactions.
        </p>
      </div>
      <div class="tw-card value-card">
        <span class="value-card__icon"><i class="fas fa-trophy"></i></span>
        <h4 class="tw-card__title">{{ $t('ui.d_fis_et_v_nements_comp_titifs') }}</h4>
        <p class="tw-card__sub">
          Matchs, défis et tournois structurés pour stimuler l'engagement et promouvoir le talent des joueurs.
        </p>
      </div>
      <div class="tw-card value-card">
        <span class="value-card__icon"><i class="fas fa-level-up-alt"></i></span>
        <h4 class="tw-card__title">{{ $t('ui.syst_me_de_progression') }}</h4>
        <p class="tw-card__sub">
          Évoluez à travers différents niveaux selon votre audience et votre activité, avec des avantages à chaque palier.
        </p>
      </div>
      <div class="tw-card value-card">
        <span class="value-card__icon"><i class="fas fa-heart"></i></span>
        <h4 class="tw-card__title">{{ $t('ui.soutien_communautaire') }}</h4>
        <p class="tw-card__sub">
          Les spectateurs soutiennent leurs streamers préférés via des contributions volontaires et des interactions intégrées.
        </p>
      </div>
    </div>

    <!-- Modèle économique -->
    <div class="tw-section-header" style="margin-top: 2rem;">
      <div class="tw-section-header__left">
        <span class="tw-section-icon"><i class="fas fa-coins"></i></span>
        <h2 class="tw-section-title">{{ $t('ui.mod_le_conomique') }}</h2>
      </div>
    </div>

    <div class="tw-content-block about-features">
      <div class="about-feature">
        <span class="about-feature__icon"><i class="fas fa-hand-holding-heart"></i></span>
        <div>
          <h5 class="about-feature__title">{{ $t('ui.contributions_volontaires_des_spectateurs') }}</h5>
          <p class="about-feature__desc">{{ $t('ui.un_mod_le_bas_sur_le_soutien_communautaire_et_la_reconnaissa') }}</p>
        </div>
      </div>
      <div class="tw-divider"></div>
      <div class="about-feature">
        <span class="about-feature__icon"><i class="fas fa-handshake"></i></span>
        <div>
          <h5 class="about-feature__title">{{ $t('ui.participation_des_v_nements_sponsoris_s') }}</h5>
          <p class="about-feature__desc">{{ $t('ui.des_opportunit_s_de_visibilit_et_de_revenus_via_des_partenar') }}</p>
        </div>
      </div>
      <div class="tw-divider"></div>
      <div class="about-feature">
        <span class="about-feature__icon"><i class="fas fa-award"></i></span>
        <div>
          <h5 class="about-feature__title">{{ $t('ui.syst_mes_internes_de_soutien_et_de_reconnaissance') }}</h5>
          <p class="about-feature__desc">{{ $t('ui.valorisation_de_la_performance_de_la_cr_ativit_et_de_lengage') }}</p>
        </div>
      </div>
    </div>

    <div class="tw-alert tw-alert--warning about-disclaimer">
      <i class="fas fa-info-circle"></i>
      <span>
        La plateforme ne repose pas sur des mécanismes de jeu d'argent, mais sur la valorisation
        du contenu, de la performance et de la communauté.
      </span>
    </div>

    <!-- Expérience utilisateur -->
    <div class="tw-section-header" style="margin-top: 2rem;">
      <div class="tw-section-header__left">
        <span class="tw-section-icon"><i class="fas fa-desktop"></i></span>
        <h2 class="tw-section-title">{{ $t('ui.exp_rience_utilisateur') }}</h2>
      </div>
    </div>

    <div class="tw-grid-4">
      <div class="tw-stat-card">
        <span class="value-card__icon" style="margin: 0 auto 8px;"><i class="fas fa-mouse-pointer"></i></span>
        <span class="tw-stat-card__label">{{ $t('ui.interface_intuitive_et_moderne') }}</span>
      </div>
      <div class="tw-stat-card">
        <span class="value-card__icon" style="margin: 0 auto 8px;"><i class="fas fa-route"></i></span>
        <span class="tw-stat-card__label">{{ $t('ui.navigation_fluide_entre_streams_et_v_nements') }}</span>
      </div>
      <div class="tw-stat-card">
        <span class="value-card__icon" style="margin: 0 auto 8px;"><i class="fas fa-bolt"></i></span>
        <span class="tw-stat-card__label">{{ $t('ui.exp_rience_interactive_en_temps_r_el') }}</span>
      </div>
      <div class="tw-stat-card">
        <span class="value-card__icon" style="margin: 0 auto 8px;"><i class="fas fa-users"></i></span>
        <span class="tw-stat-card__label">{{ $t('ui.environnement_inclusif_et_accessible') }}</span>
      </div>
    </div>

    <!-- Sécurité -->
    <div class="tw-section-header" style="margin-top: 2rem;">
      <div class="tw-section-header__left">
        <span class="tw-section-icon"><i class="fas fa-lock"></i></span>
        <h2 class="tw-section-title">{{ $t('ui.s_curit_et_conformit') }}</h2>
      </div>
    </div>

    <div class="tw-grid-2">
      <div class="tw-card value-card">
        <span class="value-card__icon"><i class="fas fa-user-check"></i></span>
        <h4 class="tw-card__title">{{ $t('ui.v_rification_des_comptes') }}</h4>
        <p class="tw-card__sub">{{ $t('ui.authentification_et_validation_des_utilisateurs_pour_un_envi') }}</p>
      </div>
      <div class="tw-card value-card">
        <span class="value-card__icon"><i class="fas fa-gavel"></i></span>
        <h4 class="tw-card__title">{{ $t('ui.mod_ration_et_arbitrage') }}</h4>
        <p class="tw-card__sub">{{ $t('ui.syst_me_de_mod_ration_actif_et_arbitrage_des_litiges_comp_ti') }}</p>
      </div>
      <div class="tw-card value-card">
        <span class="value-card__icon"><i class="fas fa-ban"></i></span>
        <h4 class="tw-card__title">{{ $t('ui.lutte_contre_la_fraude') }}</h4>
        <p class="tw-card__sub">{{ $t('ui.d_tection_et_pr_vention_des_comportements_abusifs_sur_la_pla') }}</p>
      </div>
      <div class="tw-card value-card">
        <span class="value-card__icon"><i class="fas fa-user-shield"></i></span>
        <h4 class="tw-card__title">{{ $t('ui.protection_des_donn_es') }}</h4>
        <p class="tw-card__sub">{{ $t('ui.respect_des_standards_de_confidentialit_et_conformit_aux_pol') }}</p>
      </div>
    </div>

    <!-- Vision -->
    <div class="tw-content-block about-mission" style="margin-top: 2rem;">
      <div class="about-mission__icon">
        <i class="fas fa-globe-americas"></i>
      </div>
      <div class="about-mission__body">
        <h2 class="about-mission__heading">{{ $t('ui.vision_et_d_veloppement') }}</h2>
        <p class="about-mission__text">
          Ebetstream ambitionne de devenir un acteur majeur du streaming compétitif à l'échelle internationale.
        </p>
        <ul class="about-vision-list">
          <li><i class="fas fa-check-circle"></i>{{ $t('ui.croissance_significative_de_la_communaut') }}</li>
          <li><i class="fas fa-check-circle"></i>{{ $t('ui.partenariats_avec_des_acteurs_du_gaming') }}</li>
          <li><i class="fas fa-check-circle"></i>{{ $t('ui.expansion_vers_de_nouveaux_march_s') }}</li>
          <li><i class="fas fa-check-circle"></i>{{ $t('ui.am_lioration_continue_des_fonctionnalit_s') }}</li>
        </ul>
      </div>
    </div>

    <!-- Conclusion + CTA -->
    <div class="about-cta">
      <h2 class="about-cta__heading">{{ $t('ui.conclusion') }}</h2>
      <p class="about-cta__sub">
        Ebetstream représente une nouvelle approche du streaming gaming, centrée sur la performance,
        la créativité et l'engagement communautaire. En combinant technologie, divertissement et
        interaction sociale, la plateforme offre une expérience unique qui valorise les talents et
        crée des opportunités économiques durables dans un cadre sécurisé et responsable.
      </p>
      <div class="about-tagline about-tagline--cta">
        <span>{{ $t('ui.play') }}</span>
        <span>{{ $t('ui.stream') }}</span>
        <span class="about-tagline__accent">{{ $t('ui.bet_2') }}</span>
        <span>{{ $t('ui.win') }}</span>
      </div>
      <div class="tw-page-hero__actions" style="justify-content: center; margin-top: 1.5rem;">
        <router-link to="/create-account" class="tw-btn tw-btn--primary">
          <i class="fas fa-user-plus"></i>
          Créer un compte
        </router-link>
        <router-link to="/contact" class="tw-btn tw-btn--secondary">
          <i class="fas fa-envelope"></i>
          Nous contacter
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t } = useI18n();

</script>

<style scoped>
.about-tagline {
  display: flex;
  gap: 1.25rem;
  margin-top: 1.5rem;
  font-size: 1.1rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: rgb(var(--n5));
}

.about-tagline--cta {
  justify-content: center;
  font-size: 1.3rem;
}

.about-tagline__accent {
  color: rgb(var(--g1));
}

.about-mission {
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
}

.about-mission__icon {
  flex-shrink: 0;
  width: 52px;
  height: 52px;
  border-radius: 12px;
  background: rgba(var(--g1), 0.15);
  color: rgb(var(--g1));
  font-size: 1.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.about-mission__heading {
  font-size: 1.15rem;
  font-weight: 700;
  color: rgb(var(--n8));
  margin: 0 0 0.5rem;
}

.about-mission__text {
  font-size: 0.9rem;
  color: rgb(var(--n3));
  line-height: 1.75;
  margin: 0 0 0.75rem;
}

.about-mission__text:last-child {
  margin-bottom: 0;
}

.about-goals {
  margin-bottom: 1rem;
}

.about-note {
  font-size: 0.88rem;
  color: rgb(var(--n3));
  line-height: 1.6;
  margin: 0 0 0.5rem;
  font-style: italic;
}

.value-card {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  padding: 1.25rem;
}

.value-card__icon {
  display: inline-flex;
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: rgba(var(--g1), 0.12);
  color: rgb(var(--g1));
  font-size: 1.1rem;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.25rem;
}

.about-features {
  display: flex;
  flex-direction: column;
}

.about-feature {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem 0;
}

.about-feature__icon {
  color: rgb(var(--g1));
  font-size: 1.1rem;
  flex-shrink: 0;
  margin-top: 2px;
}

.about-feature__title {
  font-size: 0.95rem;
  font-weight: 700;
  color: rgb(var(--n8));
  margin: 0 0 0.25rem;
}

.about-feature__desc {
  font-size: 0.83rem;
  color: rgb(var(--n3));
  margin: 0;
  line-height: 1.55;
}

.about-disclaimer {
  margin-top: 1rem;
}

.about-vision-list {
  list-style: none;
  padding: 0;
  margin: 0.75rem 0 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.about-vision-list li {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.88rem;
  color: rgb(var(--n5));
}

.about-vision-list i {
  color: rgb(var(--g1));
  font-size: 0.85rem;
}

.about-cta {
  margin-top: 2.5rem;
  padding: 2.5rem;
  border-radius: 12px;
  background: rgba(var(--g1), 0.08);
  border: 1px solid rgba(var(--g1), 0.2);
  text-align: center;
}

.about-cta__heading {
  font-size: 1.5rem;
  font-weight: 800;
  color: rgb(var(--n8));
  margin: 0 0 0.75rem;
}

.about-cta__sub {
  font-size: 0.9rem;
  color: rgb(var(--n3));
  margin: 0 auto;
  max-width: 680px;
  line-height: 1.7;
}

@media (max-width: 576px) {
  .about-tagline {
    flex-wrap: wrap;
    gap: 0.75rem;
    font-size: 0.95rem;
  }
}
</style>
